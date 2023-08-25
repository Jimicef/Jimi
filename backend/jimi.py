from fastapi import FastAPI
from typing import Dict
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:80",
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
