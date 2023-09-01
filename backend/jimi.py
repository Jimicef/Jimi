from fastapi import FastAPI, Query, HTTPException, Cookie, Depends
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict
import requests
from bs4 import BeautifulSoup
import re
import openai
from prompts import MAIN_PROMPT
import os
import json
app = FastAPI()
openai.api_key = os.environ["OPENAI_API_KEY"]
origins = [
    "http://jimi4-alb2-755561355.ap-northeast-2.elb.amazonaws.com",
    "http://jimi-bucket.s3-website.ap-northeast-2.amazonaws.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/service_list")
async def get_service_list(keyword : str = Query(None,description = "검색 키워드"),
                           count : int = Query(0,description = "페이지 번호"),
                           chktype1 : str = Query(None,description = "서비스 분야"),
                           siGunGuArea : str = Query(None,description = "시/군/구 코드"),
                           sidocode : str = Query(None,description = "시/도 코드"),
                           svccd : str = Query(None,description = "사용자 구분"),
                           ):
    url = "https://www.gov.kr/portal/rcvfvrSvc/svcFind/svcSearchAll"
    
    div_count = count // 2
    
    last_page = False

    params = {
        "siGunGuArea" : siGunGuArea,
        "sidocode" : sidocode,
        'svccd' : svccd,
        "chktype1" : chktype1,
        "startCount": 12*div_count,
        "query": keyword
    }
    response = requests.get(url,params=params)


    if response.status_code == 200:
        html = response.text
        soup = BeautifulSoup(html, 'html.parser')

    else : 
        return response.status_code
    
    
    option_tag = soup.select_one('#orgSel option')
    text = option_tag.text  # '전체 (9,880)'

    # 괄호 안의 숫자를 추출
    result_count = int(''.join(filter(str.isdigit, text)))
    if result_count == 0:
        return {
        "answer" : None,
        "support" : None,
        "lastpage" : True
        }
    
    page_count = (result_count - 1) // 12

    if result_count == 0:
        last_page = True
    elif div_count  == page_count :
        # 첫페이지가 last인 경우
        if count % 2 == 0 and result_count - (6 * count) <= 6:
            last_page = True
        # 두번째 페이지가 last인 경우
        elif count % 2 !=0 and result_count - (6 * count) <= 6:
            last_page = True

    card_data_list = []
    cards = soup.find_all('div', class_='card-item')


    for card in cards:
        card_tag = soup.find('div', class_='card-tag')
        department = card_tag.find('em', class_='chip').text
        title = card.find('a', class_='card-title')
        card_title = title.text
        card_id = title.get('href').split('/')[4].split('?')[0]
        card_desc = card.find('p', class_='card-desc').text
        card_info_list = card.find_all('li', class_='card-list')
        
        # print("카드 제목:", card_title)
        # print("카드 설명:", card_desc)
        card_info = {
            "institution" : department,
            "serviceId" : card_id,
            "title" : card_title,
            "description" : card_desc
        }
        for info in card_info_list:
            try:
                strong_text = info.find('strong', class_='card-sub').text
            except:
                strong_text = None
            try:
                card_text = info.find('span', class_='card-text').text
            except:
                card_text = None
            # print(strong_text, card_text)
            if strong_text.split()[0] == "신청기간":
                card_info["dueDate"] = card_text
            elif strong_text.split()[0] == "접수기관":
                card_info["rcvInstitution"] = card_text
            elif strong_text.split()[0] == "전화문의":
                card_info["phone"] = card_text
            elif strong_text.split()[0] == "지원형태":
                card_info["format"] = card_text
                
            # card_info[strong_text.split()[0]] = card_text
        if len(card_info.keys()) > 6:
            card_data_list.append(card_info)
        else:
            break
    if count % 2 == 0:
        card_data_list = card_data_list[:6]
    else :
        card_data_list = card_data_list[6:]
    # request = requests.Request('GET', url, params=params)
    # prepared_request = request.prepare()

    # # 최종 요청되는 URL 확인
    # final_url = prepared_request.url
    if keyword:
        message = f"{keyword}에 대한 {result_count}개의 통합검색 결과입니다."
    else:
        message = f"선택한 조건에 대한 {result_count}개의 통합검색 결과입니다."
    
    return {
        "answer" : message,
        "support" : card_data_list,
        "lastpage" : last_page
    }

@app.post("/chat")
def post_chat(data: dict):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": MAIN_PROMPT},
            {
                "role": "user",
                "content": f"""Please generate your response by referring specifically to the service information's key-value pairs that directly relate to the user's query.
                Do not providing extra explanations for parts not directly asked by the user.
                Feel free to generate your response in a casual tone, keeping it succinct and avoiding unnecessary symbols.

                User query: {data["question"]}
                service information:\n{data["summary"]}\nAnswer:\n""",
            }
        ],
        temperature=0,
        max_tokens = 1000,
        stream=True
    )
    
    link_data = {'link1': 'https://www.mma.go.kr/contents.do?mc=usr0000146',
                 'title1': '병적증명서 등 발급안내 - 병역이행안내 - 병무청',
                 'link2': 'http://m.blog.naver.com/allminwon3/221622331226',
                 'title2': '제대 후 복학신청! 병적증명서가 뭐야? : 네이버 블로그',
                 'link3': 'https://www.gov.kr/mw/AA020InfoCappView.do?HighCtgCD=A01002&CappBizCD=13000000016',
                 'title3': '병적증명서 발급 | 민원안내 및 신청 | 정부24'}
        

    # json_data = await generate_json_data()
    def generate_chunks():
        for chunk in response:
            try :
                yield chunk["choices"][0]["delta"].content
            except :
                yield " "
    
    return StreamingResponse(
        content=generate_chunks(),
        media_type="text/plain"
    ),link_data

    # return {"answer": response["choices"][0]["message"]['content']}

@app.get("/chat")
async def get_chat(serviceId):
    cond = serviceId
    url = f"http://api.odcloud.kr/api/gov24/v3/serviceDetail?page=1&perPage=10&cond%5B%EC%84%9C%EB%B9%84%EC%8A%A4ID%3A%3AEQ%5D={cond}&serviceKey=aVyQkv5W8mV6fweNFyOmB3fvxjmcuMvbOl4fkTCOVH1kCgOCcSkFa8UKeUBljB3Czd5VwvoIYKkH%2FpWWwVvpKQ%3D%3D"
    response = requests.get(url)
    res = response.json()
    ret = {}
    ret["url"] = "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/"+serviceId
    for key, value in res['data'][0].items():
        askey = key
        if key == '구비서류':
            askey = "docs"
        elif key == '소관기관명':
            askey = "institution"
        elif key == '서비스ID':
            askey = "serviceId"
        elif key == "서비스명":
            askey = "title"
        elif key == "서비스목적":
            askey = "description"
        elif key == "선정기준":
            askey = "selection"
        elif key == "문의처":
            askey = "rcvInstitution"
        elif key == "신청기한":
            askey = "dueDate"
        elif key == "신청방법":
            askey = "way"
        elif key == "지원내용":
            askey = "content"
        elif key == "지원대상":
            askey = "target"
        elif key == "지원유형":
            askey = "format"
        else:
            askey = key
        if key != askey :
            ret[askey] = value
    return ret
