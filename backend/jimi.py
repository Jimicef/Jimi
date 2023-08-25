from fastapi import FastAPI
from typing import Dict

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/api/qa")
async def get_answer(question:str) -> Dict[str, str]:
    
    answer = "abs"
    support = "Don't panic and always carry a towel."
    response = {"answer": answer, "support": support}
    return response

@app.post("/api/test")
async def get_answer2(question:int):
    
    answer = question
    
    return answer