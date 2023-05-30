from collections import namedtuple
import json
import asyncio
import os

# Importing fastAPI
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Importing langchain
from langchain import LLMChain
from langchain.chat_models import ChatOpenAI  
from langchain.prompts import PromptTemplate, ChatPromptTemplate

from dotenv import load_dotenv

# Importing pocketbase sdk
from pocketbase import PocketBase
from pocketbase.client import FileUpload

load_dotenv()

pocketbase_client = PocketBase("http://localhost:8090")

# Login as admin
admin_data = pocketbase_client.admins.auth_with_password(os.getenv("POCKETBASE_ADMIN_EMAIL"), os.getenv("POCKETBASE_ADMIN_PASSWORD"))

apikey = os.getenv("OPENAI_API_KEY")
# use the gpt-3.5-turbo LLM   
openai_model = ChatOpenAI(openai_api_key=apikey, model_name = 'gpt-3.5-turbo')  

chat_prompt = ChatPromptTemplate.from_template("tell me a joke about {subject}")
chat_prompt_value = chat_prompt.format_prompt(subject="soccer")

llm_chain = LLMChain(  
    prompt = chat_prompt,
    llm = openai_model  
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://chat.openai.com", "http://localhost:8080", "http://localhost:5173", "http://localhost:8090"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def read_root():
    return {"message": "This is the backend for ADM Project!"}

@app.get("/api")
async def read_api_root():
    return {"message": "Welcome to the ADM API!"}

@app.post("/api/documents/{document_id}/calculate_stats")
async def read_api_documents_calculate_stats(document_id: str):
    # Fetching document from the databse by document ID
    response = pocketbase_client.collection("documents").get_one(document_id)
    response_dict = dict(response.__dict__)  # Convert Record object to a dictionary
    ResponseObject = namedtuple("ResponseObject", response_dict.keys())
    response_object = ResponseObject(**response_dict)

    print(response_object.collection_id["document"])
    print(json.dumps(response_dict, indent=4))
    
    return {"message": "Has been calculated!"}

@app.get("/api/joke")
async def read_():
    # joke question   
    question = "Tell me a joke"
    response = llm_chain.run(question)
    return {"message": response}

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
