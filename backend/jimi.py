from fastapi import FastAPI, Query
from typing import Dict
from fastapi.middleware.cors import CORSMiddleware
import requests
from bs4 import BeautifulSoup

app = FastAPI()

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

@app.get("/api/qa")
async def get_answer(question:str) -> Dict[str, str]:
    
    answer = "abs"
    support = "Don't panic and always carry a towel."
    response = {"answer": answer, "support": support}
    return response

@app.get("/service_list")
async def get_service_list(keyword : str = Query(None,description = "검색 키워드"),
                           count : int = Query(0,description = "페이지 번호"),
                           chktype1 : str = Query(None,description = "서비스 분야"),
                           siGunGuArea : str = Query(None,description = "시/군/구 코드"),
                           sidocode : str = Query(None,description = "시/도 코드"),
                           ):
    url = "https://www.gov.kr/portal/rcvfvrSvc/svcFind/svcSearchAll"
    params = {
        "query": keyword,
        "startCount": 12*count,
        "chktype1" : chktype1,
        "siGunGuArea" : siGunGuArea,
        "sidocode" : sidocode
    }
    response = requests.get(url,params=params)


    if response.status_code == 200:
        html = response.text
        soup = BeautifulSoup(html, 'html.parser')

    else : 
        return response.status_code

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
            "기관종류" : department,
            "서비스ID" : card_id,
            "카드제목" : card_title,
            "카드설명" : card_desc

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
            card_info[strong_text.split()[0]] = card_text
        if len(card_info.keys()) > 2:
            card_data_list.append(card_info)
        else:
            break
    return {"card_data_list":card_data_list}
