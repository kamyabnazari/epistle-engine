import os

# Importing fastAPI
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Importing langchain
from langchain.llms import OpenAI

from dotenv import load_dotenv

load_dotenv()

apikey = os.getenv("OPENAI_API_KEY")

llm = OpenAI(openai_api_key=apikey)
respose = llm("Tell me a joke")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://chat.openai.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api")
async def read_root():
    return {"message": "Welcome to the ADM Backend!"}

@app.get("/api/ai")
async def read_ai():
    return {"message": respose}

@app.get("/logo.png")
async def logo():
    return FileResponse('logo.png', media_type='image/png')

@app.get("/.well-known/ai-plugin.json")
async def ai_plugin():
    return FileResponse('./.well-known/ai-plugin.json', media_type='application/json')

@app.get("/openapi.yaml")
async def openapi():
    return FileResponse('openapi.yaml', media_type='text/yaml')

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5003)
