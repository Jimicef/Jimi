from fastapi import FastAPI, Query, UploadFile, Depends
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Annotated
import requests
from bs4 import BeautifulSoup
import openai
from prompts import MAIN_PROMPT, CHAT_PROMPT, FUNCTIONS, MODEL
import os
import json
from handlers import get_service_list

app = FastAPI()
openai.api_key = os.environ["OPENAI_API_KEY"]
Google_API_KEY = os.environ["Google_API_KEY"]
Google_SEARCH_ENGINE_ID = os.environ["Google_SEARCH_ENGINE_ID"]

origins = [
    "https://d2cbtv7b4u1taw.cloudfront.net",
    "https://jimi-bot.net",
    "https://*.jimi-bot.net",
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

@app.get("/api/service_list")
async def api_get_service_list(result: Annotated[dict,Depends(get_service_list)]):
    return result


@app.get("/api/chat")
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

@app.post("/api/chat")
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





# 디버그용 추후 삭제 필요 /api/voice/chat으로 대체할 예정임
@app.post("/api/voice_chat")
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
    return {
        "transcript": transcript["text"]
    }