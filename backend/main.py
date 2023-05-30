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

load_dotenv()

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
    allow_origins=["https://chat.openai.com", "http://localhost:8080", "http://localhost:5173"],
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
    
    print("Received document ID: " + document_id)
    
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
