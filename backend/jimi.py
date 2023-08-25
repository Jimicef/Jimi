from fastapi import FastAPI
from typing import Dict

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/api/qa")
async def get_answer(question:str) -> Dict[str, str]:
    
    answer = "42"
    support = "Don't panic and always carry a towel."
    response = {"answer": answer, "support": support}
    return response
