from fastapi import FastAPI, UploadFile, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import Annotated

import openai

import os

from handlers import get_service_list, get_chat, post_chat

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
async def api_get_chat(service_info: Annotated[dict,Depends(get_chat)]):
    return service_info


@app.post("/api/chat")
async def api_post_chat(chat_response: Annotated[dict,Depends(post_chat)]):
    return chat_response





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