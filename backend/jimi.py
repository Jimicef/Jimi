from fastapi import FastAPI, UploadFile, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import Annotated


from handlers import get_service_list, get_chat, post_chat, post_voice_chat, get_voice_chat

app = FastAPI()


origins = [
    "https://d2cbtv7b4u1taw.cloudfront.net",
    "https://jimi-bot.net",
    "https://be.jimi-bot.net",
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

#todo post chat -> voice
@app.post("/api/chat")
async def api_post_chat(chat_response: Annotated[dict,Depends(post_chat)]):
    return chat_response


# 디버그용 추후 아룸변경!!!! 필요 /api/voice/chat으로 대체할 예정임
@app.post("/api/voice/chat")
async def api_post_voice_chat(voice_chat_response: Annotated[dict,Depends(post_voice_chat)]):
    return voice_chat_response

@app.get("/api/voice/chat")
async def api_get_voice_chat(voice_chat_response: Annotated[str,Depends(get_voice_chat)]):
    return voice_chat_response