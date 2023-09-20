from fastapi import Query, UploadFile
from bs4 import BeautifulSoup
import requests
from prompts import MAIN_PROMPT, CHAT_PROMPT, FUNCTIONS, MODEL
from fastapi.responses import StreamingResponse
from prompts import MAIN_PROMPT, CHAT_PROMPT, FUNCTIONS, MODEL
import openai
import json
import os


openai.api_key = os.environ["OPENAI_API_KEY"]
Google_API_KEY = os.environ["Google_API_KEY"]
Google_SEARCH_ENGINE_ID = os.environ["Google_SEARCH_ENGINE_ID"]

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

            if strong_text.split()[0] == "신청기간":
                card_info["dueDate"] = card_text
            elif strong_text.split()[0] == "접수기관":
                card_info["rcvInstitution"] = card_text
            elif strong_text.split()[0] == "전화문의":
                card_info["phone"] = card_text
            elif strong_text.split()[0] == "지원형태":
                card_info["format"] = card_text
                

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


async def post_chat(data: dict):
    result = [{'link':None},{'link':None},{'link':None}]

    messages = [
        {"role": "system", "content": f"You can use this service information {data['summary']}"},
        {"role": "user","content": f"user query : {data['question']}"}
    ]
    
    messages.extend(data['history'])
    # print(data['history'])
    first_response = openai.ChatCompletion.create(
        model=MODEL,
        messages=messages,
        temperature=0,
        functions=FUNCTIONS
    )
    if first_response['choices'][0]['finish_reason'] == 'function_call':
        
        full_message = first_response["choices"][0]
        if full_message["message"]["function_call"]["name"] == "answer_with_service_info":
            messages=[
                    {"role": "system", "content": MAIN_PROMPT},
                    {"role": "system", "content": CHAT_PROMPT},
            ]
            messages.extend(data['history'])
            messages.append(
                {
                    "role": "user",
                    "content": f"""Please generate your response by referring specifically to the service information's key-value pairs that directly relate to the user's query.
                    You will follow the conversation and respond to the queries asked by the 'user's content. You will act as the assistant.
                    User query: {data['question']}
                    service information:\n{data['summary']}\nAnswer:\n""",
                }
            )
            response = openai.ChatCompletion.create(
                model=MODEL,
                messages=messages,
                temperature=0,
                max_tokens = 1000,
                stream=True
            )
        elif full_message["message"]["function_call"]["name"] == "get_search_info":
            parsed_output = json.loads(full_message["message"]["function_call"]["arguments"])
            search_query = parsed_output["keyword"]
            url = f"https://www.googleapis.com/customsearch/v1?key={Google_API_KEY}&cx={Google_SEARCH_ENGINE_ID}&q={search_query}"
            res = requests.get(url).json()

            search_result = res.get("items")

            cnt = 0
            for i in range(len(search_result)):
                if cnt == 3:
                    break
                if "snippet" in search_result[i].keys():
                    
                    search_info = {}

                    search_info['link'] = search_result[i]['link'] 
                    search_info['title'] = search_result[i]['title'] 
                    search_info['snippet'] = search_result[i]['snippet']
                    result[cnt] = search_info
                    cnt += 1

            messages=[
                        {"role": "system", "content": MAIN_PROMPT},
                        {"role": "system", "content": CHAT_PROMPT},
            ]

            messages.extend(data['history'])

            messages.append(
                {
                        "role": "user",
                        "content": f"""Please generate your response by referring specifically to google search result's key-value pairs that directly relate to the user's query.
                        You will follow the conversation and respond to the queries asked by the 'user's content. You will act as the assistant
                        you don't have to provide links(e.g. [링크](https://obank.kbstar.com/quics?page=C016613&cc=b061496:b061645&isNew=N&prcode=DP01000935)) in the response. 
                        
                        User query: {data['question']}
                        Google search result:\n{result}\nAnswer:\n""",
                    }
            )
            response = openai.ChatCompletion.create(
                    model=MODEL,
                    messages=messages,
                    temperature=0,
                    max_tokens=1000,
                    stream=True
                )
        else:
            raise Exception("Function does not exist and cannot be called")

    else:
        response = first_response['choices'][0]['message']['content']
        def generate_chunks_default():
            for chunk in response:
                yield chunk
                
        return StreamingResponse(
            content=generate_chunks_default(),
            media_type="text/plain"
        )
    
    def generate_chunks():
        for chunk in response:
            try :
                yield chunk["choices"][0]["delta"].content
            except :
                yield f"ˇ{result[0]['link']}˘{result[1]['link']}˘{result[2]['link']}"
    
    
    return StreamingResponse(
        content=generate_chunks(),
        media_type="text/plain"
    )


async def post_voice_chat(file: UploadFile):
    # 업로드된 MP3 파일을 저장
    with open(file.filename, "wb") as f:
        f.write(file.file.read())

    # 저장한 파일 경로를 사용하여 업로드된 MP3 파일을 transcribe 함수에 전달
    with open(file.filename, "rb") as f:
        transcript = openai.Audio.transcribe(
            file=f,
            model="whisper-1",
            prompt="",
        )
    os.remove(file.filename)
    # return {
    #     "transcript": transcript["text"]
    # }
    data = {
        "question": transcript["text"],
        "history" : [],
        "summary" : {
            "url": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/SD0000007044",
            "docs": "○ 검사비 지원 신청\r\n - 지원 신청서\r\n - 검사비 영수증\r\n - 검사비 세부내역서\r\n - 검사 결과지\r\n - 통장사본\r\n - 주민등록등본\r\n - 건강보험증 사본 및 건강보험료 납부확인서 \r\n  · 기초생활보장수급자, 차상위계층의 경우 관련 증명서 또는 확인서로 대체\r\n  · 전자정부법에 따른 행정정보의 공동 이용을 통한 확인에 동의할 경우 생략 가능\r\n - (해당자 제출)  휴직증명서1부\r\n  · 유급휴직자의 경우 급여명세서 1부 추가 제출\r\n  · 휴직여부 및 휴직기간 등을 확인할 수 있는 공문서로 대체 가능\r\n - (필요시) 가족관계증명서, 급여명세서, 맞벌이 경감 대상 증빙서류(사업자등록증명원, 위촉증명서, 계약서(사본), 이행계획확인서)\r\n\r\n○ 보청기 지원 신청\r\n - 보청기 처방전\r\n - 청력검사 결과지\r\n - 외래 진료기록지",
            "rcvInstitution": "보건복지상담센터/129",
            "serviceId": "SD0000007044",
            "title": "선천성 난청검사 및 보청기 지원",
            "description": "선천성 난청을 조기 발견하여 재활치료를 통해 언어·지능 발달장애를 예방함으로써 사회 부적응 등의 후유증 최소화",
            "selection": "○ 신생아 난청 외래 선별검사비 지원은 출생 후 28일 이내에 실시하여 건강보험이 적용된 선별검사를 대상으로 함\r\n - 검사방법을 불문하고 1회 지원이 원칙이나, 재검(Refer) 판정에 따라 청각선별 검사를 재실시한 경우에는 1회에 한하여 추가 지원 가능(최대 2회)\r\n - 난청 선별검사 결과 재검(Refer) 판정 후, 난청 확진검사를 받은 경우 확진검사비의 (일부)본인부담금 지원\r\n - 확진검사 결과에 관계없이, 난청 확진을 위한 아래 검사비용(ABR 또는 ASSR이 반드시 포함되어야 함)의 본인부담금을 합산하여 지원(7만원 한도)\r\n  ㆍ청성뇌간반응역치검사(ABR)\r\n  ㆍ청성지속반응검사(ASSR)\r\n  ㆍ이음향방사검사(DPOAE, TEOAE)\r\n  ㆍ임피던스청력검사(Tympanometry)\r\n\r\n○ 보청기 지원은 양측성 난청이면서 청력이 좋은 귀의 평균청력역치가 40-59dB로서, 청각장애 등급을 받지 못하는 난청이 있는 경우",
            "institution": "보건복지부",
            "dueDate": "ㅇ (난청 검사비) 대상 영아 출생일로부터 1년 이내  ㅇ (보청기) 보건소 지원신청일 기준 6개월 전후에 구입한 보청기에 대해 지원 가능",
            "way": "주소지 보건소에 신청",
            "content": "○ (검사비 지원) 신생아 난청 외래 선별검사비 및 확진검사비의 (일부)본인부담금 지원\r\n\r\n○ (보청기 지원) 만 3세(36개월) 미만 난청 환아 대상 양측 보청기 지원(개당 131만원 한도, 장애등급을 받은 환아 제외)",
            "target": "○ 기준 중위소득 180% 이하 가구 영유아\r\n - 다자녀(2명 이상) 가구의 영유아는 소득수준 관계없이 지원 가능\r\n  * 첫째로 출생한 쌍둥이는 다자녀로 인정",
            "format": "서비스(의료)"
        }
    }
    return await post_chat(data)