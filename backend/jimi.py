from fastapi import FastAPI
from typing import Dict
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://jimi4-alb2-755561355.ap-northeast-2.elb.amazonaws.com"
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
