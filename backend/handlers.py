from fastapi import Query, UploadFile
from typing import Annotated
from bs4 import BeautifulSoup
import requests
from prompts import *
from utils import *
from opensearchpy import OpenSearch

from fastapi.responses import StreamingResponse

import openai
import json
import os


openai.api_key = os.environ["OPENAI_API_KEY"]
Google_API_KEY = os.environ["Google_API_KEY"]
Google_SEARCH_ENGINE_ID = os.environ["Google_SEARCH_ENGINE_ID"]

opensearch_url = os.environ["OPENSEARCH_URL"]
auth = (os.environ["OPENSEARCH_ID"], os.environ["OPENSEARCH_PW"])

client = OpenSearch(
    opensearch_url,
    http_compress=True,  # enables gzip compression for request bodies
    http_auth=auth,
    use_ssl=False,
    verify_certs=False,
    ssl_assert_hostname=False,
    ssl_show_warn=False,
)

async def get_service_list(keyword : str = Query(None,description = "검색 키워드"),
                           count : int = Query(0,description = "페이지 번호"),
                           chktype1 : str = Query(None,description = "서비스 분야"),
                           siGunGuArea : str = Query(None,description = "시/군/구 코드"),
                           sidocode : str = Query(None,description = "시/도 코드"),
                           svccd : str = Query(None,description = "사용자 구분"),
                           voice : bool = Query(None,description = "시각 장애인 자막 생성 여부")
                           ):
    url = "https://www.gov.kr/portal/rcvfvrSvc/svcFind/svcSearchAll"
    
    div_count = count // 2
    
    last_page = False
    voice_answer = ""

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
        "vocieAnswer": "검색 결과가 없습니다.",
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
    
    if voice:
        for i in range(6):
            try:
                voice_answer += f"{i+1}번: {card_data_list[i]['title']}\n"
            except:
                print(i,len(card_data_list))
    return {
        "answer" : message,
        "support" : card_data_list,
        "lastpage" : last_page,
        "voiceAnswer" : voice_answer
    }


async def get_chat(serviceId : str = Query(None,description = "서비스 ID"),
                   voice : bool = Query(None,description = "시각 장애인 자막 생성 여부")):
    cond = serviceId
    voice_answer = ""
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

    if voice:
        messages = [
            {"role": "user","content": f"{GET_CHAT_PROMPT}"},
            {"role": "user","content": f"SERVICE INFORMATION: {ret}"}
        ]
        
        gpt_response = openai.ChatCompletion.create(
            model=MODEL,
            messages=messages,
            temperature=0,
        )

        voice_answer = gpt_response["choices"][0]["message"]["content"]
    return {
        "voiceAnswer" : voice_answer,
        "summary" : ret
        }


async def post_chat(data: Annotated[dict,{
    "username" : str,
    "question" : str,
    "history" : list,
    "summary" : dict,
    "voice" : int
}]):
    is_stream = not data["voice"]

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
                stream=is_stream
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
                    stream=is_stream
                )
        else:
            raise Exception("Function does not exist and cannot be called")

    else:
        response = first_response['choices'][0]['message']['content']
        def generate_chunks_default():
            for chunk in response:
                yield chunk
        if is_stream:
            return StreamingResponse(
                content=generate_chunks_default(),
                media_type="text/plain"
            )
        else:
            return {
                "voiceAnswer" : response,
                "links" : [None,None,None]
            }
    
    
    if is_stream:
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
    else:
        return {
                "voiceAnswer" : response['choices'][0]['message']['content'],
                "links" : [result[0]['link'],result[1]['link'],result[2]['link']]
        }


async def post_voice_chat(file: UploadFile, history: UploadFile):
    # 업로드된 MP3 파일을 저장
    voice_answer=""
    function_name = ""
    get_service_params = {}
    get_chat_params = {}
    post_chat_params = {}

    history_json = await history.read()
    chat_history = json.loads(history_json)
    
    with open(file.filename, "wb") as f:
        f.write(file.file.read())

    # 저장한 파일 경로를 사용하여 업로드된 MP3 파일을 transcribe 함수에 전달
    with open(file.filename, "rb") as f:
        transcript = openai.Audio.transcribe(
            file=f,
            model=AUDIO_MODEL,
            prompt="",
        )
    os.remove(file.filename)
    
    messages = [{"role": "system", "content" : "If it's unclear which function to use, you should ask the user for the required function arguments again."},]
    
    #messages = [{"role": "system", "content" : "you must function call post_api_chat If you determine that it is not the appropriate time to call the 'get_api_service_list' or 'get_api_chat' functions"},]
    messages.extend(chat_history)
    messages.append({"role": "user","content": transcript["text"]})

    response = openai.ChatCompletion.create(
            model=MODEL,
            messages=messages,
            temperature=0,
            functions=VOICE_FUNCTIONS,
    )

    if response["choices"][0]['finish_reason'] != 'function_call':
        # raise Exception("finish_reason is not function_call")
        voice_answer = response["choices"][0]['message']['content']
    else:
        function_name = response['choices'][0]['message']['function_call']['name']
        params = json.loads(response['choices'][0]['message']['function_call']['arguments'])
        if function_name == 'get_api_service_list':
            get_service_params = params
            try:
                get_service_params['siGunGuArea'] = sub_region_code[get_service_params['sidocode']][get_service_params['siGunGuArea']]
            except:
                get_service_params['siGunGuArea'] = sub_region_code[get_service_params['sidocode']]["전체"]
            get_service_params['sidocode'] = region_code[get_service_params['sidocode']]
            get_service_params['chktype1'] = 'NB0301|NB0302|NB0303|NB0304|NB0305|NB0306|NB0307|NB0308|NB0309|NB0310|'
        elif function_name == 'get_api_chat':
            get_chat_params = params

        elif function_name == 'post_api_chat':
            post_chat_params = params

        else:
            raise Exception("Function does not exist")

    return {
        "userText": transcript["text"],
        "voiceAnswer": voice_answer,
        "function": function_name,
        "serviceParams": get_service_params,
        "getChatParams": get_chat_params,
        "postChatParams": post_chat_params,
    }


async def get_voice_chat():
    return {
        "voiceAnswer": "안녕하세요! 👋 저는 지원금 찾기 도우미, 지미입니다. 현재 거주하고 계신 지역과 지원받고 싶은 상황에 대해 아래 버튼을 누르고 말씀해주세요"
    }

# keyword : str = Query(None,description = "검색 키워드"),
# count : int = Query(0,description = "페이지 번호"),
# chktype1 : str = Query(None,description = "서비스 분야"),#배열 리스트에 담아서 줘야함 생활안정|주거·자립 이렇게 줘야함
# siGunGuArea : str = Query(None,description = "시/군/구 코드"),
# sidocode : str = Query(None,description = "시/도 코드"),#["대전광역시 유성구"]
# svccd : str = Query(None,description = "사용자 구분"),
# voice : bool = Query(None,description = "시각 장애인 자막 생성 여부")
                           
async def post_opensearch_service_list(data: Annotated[dict,{
    "keyword" : str,
    "count" : int,
    "chktype1" : list,
    "sidocode" : list,
    "svccd" : list,
    "voice" : int
}]):

    last_page = False
    voice_answer = ""
    low_query = {
        "query": {
            "bool": {
            "must": [
                { "terms": { "소관기관명.keyword": data['sidocode'] } }
            ],
            "should": [
                { "match": { "서비스명": data['keyword'] } },
                { "terms": { "사용자구분.keyword": data['svccd'] } },
                { "terms": { "서비스분야.keyword": data['chktype1'] } },#["생활안정","주거·자립"] 이렇게 줘야함
            ]
            }
        }
    }


    query = {
        "size" : 6,
        "from" : 6*data['count'],
        "query": low_query['query']
    }

    response = client.search(
        body = query,
        index = 'jimi-index'
    )

    card_data_list = []

    for hit in response['hits']['hits']:
        card_info = {}
        card_info["institution"] = hit['_source']['소관기관명']
        card_info["serviceId"] = hit['_source']['서비스ID']
        card_info["title"] = hit['_source']['서비스명']
        card_info["description"] = hit['_source']['지원내용']
        card_info["dueDate"] = hit['_source']['신청기한']
        card_info["rcvInstitution"] = hit['_source']['부서명']
        card_info["phone"] = hit['_source']['전화문의']
        card_info["format"] = hit['_source']['지원유형']
        card_data_list.append(card_info)
    
    if data['keyword']:
        message = f"{data['keyword']}에 대한 {response['hits']['total']['value']}개의 통합검색 결과입니다."
    else:
        message = f"선택한 조건에 대한 {response['hits']['total']['value']}개의 통합검색 결과입니다."
    if data['voice']:
        for i in range(6):
            try:
                voice_answer += f"{i+1}번: {card_data_list[i]['title']}\n"
            except:
                print(i,len(card_data_list))

    if (data['count']+1)*6 >= response['hits']['total']['value']:
        last_page = True

    return {
        "answer" : message,
        "support" : card_data_list,
        "lastpage" : last_page,
        "voiceAnswer" : voice_answer
    }