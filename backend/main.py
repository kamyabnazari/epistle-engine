from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
import io
import os
import subprocess
import requests

# Python package for PDF parsing
import PyPDF3

# Importing fastAPI
from fastapi import FastAPI, Request
from fastapi.responses import FileResponse
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

from retry import retry

# Define the maximum number of retries and the delay between retries
max_retries = 5
retry_delay = 2

# Function to create PocketBase client with retries
@retry(tries=max_retries, delay=retry_delay)
def create_pocketbase_client():
    pocketbase_client = PocketBase("http://localhost:8090")

    # Login as admin
    pocketbase_client.admins.auth_with_password(
        os.getenv("POCKETBASE_ADMIN_EMAIL"), os.getenv("POCKETBASE_ADMIN_PASSWORD")
    )

    # If the above code executes successfully, return the PocketBase client
    return pocketbase_client

# Create PocketBase client with retries
pocketbase_client = create_pocketbase_client()

apikey = os.getenv("OPENAI_API_KEY")
# use the gpt-3.5-turbo LLM   
openai_model = ChatOpenAI(openai_api_key=apikey, model_name = 'gpt-3.5-turbo')  

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

@app.post("/api/documents/{document_id}/calculate_stats/{user_id}")
async def read_api_documents_calculate_stats(document_id: str, user_id: str):
    # Fetching document from the database by document ID
    response = pocketbase_client.collection("documents").get_one(document_id)
    response_dict = dict(response.__dict__)  # Convert Record object to a dictionary
    owner = response_dict["collection_id"]["owner"]
    recordId = response_dict["collection_id"]["id"]
    collectionId = response_dict["collection_id"]["collectionId"]
    fileName = response_dict["collection_id"]["document"]
    size = '0x0'

    if owner == user_id:
        url = f"http://localhost:8090/api/files/{collectionId}/{recordId}/{fileName}?thumb={size}"
        response = requests.get(url)
        response.raise_for_status()
        content = io.BytesIO(response.content)  # Create a BytesIO object from the response content

        total_pages = get_pdf_page_count(content)
        total_words = get_pdf_word_count(content)
        
        data = {
            "page_count": total_pages,
            "word_count": total_words
        }
        pocketbase_client.collection('documents').update(recordId, data)

@app.post("/api/documents/create/{user_id}")
async def read_api_document_create(user_id: str, request: Request):
    # Accessing Request body and converting it to a dictionary
    body = await request.json()
    
    # Sending topic to gpt to generate latex output of the text 
    topic = body.get('topic')
    
    # Create a LaTeX prompt using this topic
    latex_prompt = ChatPromptTemplate.from_template("Write a section about {subject}, it should be in LaTeX format.")
    latex_prompt_value = latex_prompt.format_prompt(subject=topic)

    llm_chain = LLMChain(  
    prompt = latex_prompt,
    llm = openai_model  
    )

    # Generate LaTeX content using this prompt
    latex_content = llm_chain.run(latex_prompt_value)
    latex_content = "\\documentclass{article}\n\\begin{document}\n" + latex_content + "\n\\end{document}"
    
    # Write the LaTeX content to a file
    latex_file_name = "created-document.tex"
    with open(latex_file_name, "w") as file:
        file.write(latex_content)

    # Generate a PDF from the LaTeX file
    current_dir = os.getcwd()
    generate_pdf_from_latex(latex_file_name, current_dir)

    # The name of the generated PDF file
    pdf_file_name = latex_file_name.replace('.tex', '.pdf')
    # The path to the generated PDF file
    pdf_file_path = os.path.join(current_dir, pdf_file_name)

    # Calculate the total number of pages and words in the document
    total_pages = get_pdf_page_count(pdf_file_path)
    total_words = get_pdf_word_count(pdf_file_path)

    # Create a new document in the database
    data = {
        "owner": user_id,
        "name": pdf_file_name,
        "document": FileUpload((pdf_file_name, open(pdf_file_path, "rb"))),
        "type": "Created",
        "page_count": total_pages,
        "word_count": total_words
    }
    
    pocketbase_client.collection("documents").create(data)
    
    # Delete the generated LaTeX and PDF files
    os.remove(latex_file_name)
    os.remove(pdf_file_path)

def generate_pdf_from_latex(latex_file_name, output_directory):
    # Save the current working directory
    original_cwd = os.getcwd()
    # Change the current working directory
    os.chdir(output_directory)
    # Generate a PDF from the LaTeX file
    subprocess.check_call(['pdflatex', latex_file_name])
    # Restore the original working directory
    os.chdir(original_cwd)
   
def get_pdf_page_count(file_content):
    pdf_reader = PyPDF3.PdfFileReader(file_content)
    total_pages = len(pdf_reader.pages)
    return total_pages

def get_pdf_word_count(file_content):
    pdf_reader = PyPDF3.PdfFileReader(file_content)
    total_words = 0
    for page_num in range(pdf_reader.getNumPages()):
        page = pdf_reader.getPage(page_num)
        total_words += len(page.extractText().split())
    return total_words

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
