import subprocess
import pdfkit
import io
import os
from qdrant_client import QdrantClient
import requests

# Python package for PDF parsing
import PyPDF3

# Importing fastAPI
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

# Importing langchain
from langchain import LLMChain
from langchain.chat_models import ChatOpenAI  
from langchain.prompts import ChatPromptTemplate
from langchain.schema import HumanMessage, AIMessage

from dotenv import load_dotenv

# Importing pocketbase sdk
from pocketbase import PocketBase
from pocketbase.client import FileUpload

# Importing ingest.py 
from ingest import create_embeddings_from_pdf_file

# Importing chat_bot_function.py 
from chat_bot_function import chat_bot_funtion

load_dotenv()

from retry import retry

# Define the maximum number of retries and the delay between retries
max_retries = 5
retry_delay = 2

pocketbase_url = os.getenv("PUBLIC_POCKETBASE_URL")
frontend_public_url = os.getenv("PUBLIC_FRONTEND_URL")
apikey = os.getenv("OPENAI_API_KEY")

# Empty PocketBase client
pocketbase_client = None

# Function to create PocketBase client with retries
@retry(tries=max_retries, delay=retry_delay)
def create_pocketbase_client():
    pocketbase_client = PocketBase(pocketbase_url)

    # Login as admin
    pocketbase_client.admins.auth_with_password(
        os.getenv("POCKETBASE_ADMIN_EMAIL"), os.getenv("POCKETBASE_ADMIN_PASSWORD")
    )

    # If the above code executes successfully, return the PocketBase client
    return pocketbase_client

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[pocketbase_url, frontend_public_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def read_root():
    return {"message": "This is the backend for EE Project!"}

@app.get("/favicon.ico")
async def read_favicon():
    return FileResponse("favicon.ico", media_type="image/vnd.microsoft.icon")

@app.get("/api")
async def read_api_root():
    return {"message": "Welcome to the EE API!"}

@app.post("/api/documents/{document_id}/delete_vector_file")
async def delete_api_vector_file(document_id: str):
    
    url = os.getenv('PUBLIC_QDRANT_URL')
    api_key = os.getenv('QDRANT__SERVICE_API_KEY')   
    
    if api_key:
        client = QdrantClient(url=url, prefer_grpc=True, api_key=api_key)
    else:
        client = QdrantClient(url=url)
    
    client.delete_collection(document_id)
    return {"message": "Vector file deleted!"}

@app.post("/api/documents/{document_id}/send_new_message/{user_id}")
async def read_api_documents_send_new_message(document_id: str, user_id: str, request: Request):
    # Accessing Request body and converting it to a dictionary
    body = await request.json()
    
    # Sending topic to gpt to generate latex output of the text 
    message = body.get('message')
    history = body.get('history')
    chat_history = []
    #loop through the chat history to create a new chat history array for the chat_bot_function 
    for el in history:
        if(el.get('sender') == "person"):
            chat_history.append(HumanMessage(content=el.get('message')))
        else:
            chat_history.append(AIMessage(content=el.get('message')))

    response, new_chat_history = chat_bot_funtion(message, chat_history=chat_history, documentId=document_id)

    answer = response["answer"]
    source = response["source_documents"]

    return {"message": answer, "sender": "Epistle Engine"}

@app.post("/api/documents/{document_id}/document_post_process/{user_id}")
async def read_api_documents_document_post_process(document_id: str, user_id: str):
    # Create PocketBase client with retries
    pocketbase_client = create_pocketbase_client()
    
    content, recordId = get_file_from_pb(document_id, user_id)

    # Write content to a file
    pdf_file_name = "created-document.pdf"
    with open(pdf_file_name, "wb") as file:
        file.write(content)
        file.close

    # Generate a PDF file
    current_dir = os.getcwd()
    pdf_path = os.path.join(current_dir, pdf_file_name)
    create_embeddings_from_pdf_file(pdf_path, document_id)
    os.remove(pdf_path)

    total_pages = get_pdf_page_count(io.BytesIO(content))
    total_words = get_pdf_word_count(io.BytesIO(content))
    
    data = {
        "page_count": total_pages,
        "word_count": total_words
    }
    pocketbase_client.collection('documents').update(recordId, data)
   

@app.post("/api/documents/create/{user_id}")
async def read_api_document_create(user_id: str, request: Request):
    # Create PocketBase client with retries
    pocketbase_client = create_pocketbase_client()
    
    # use the gpt-3.5-turbo LLM   
    openai_model = ChatOpenAI(openai_api_key=apikey, model_name = 'gpt-3.5-turbo') 
    
    # Accessing Request body and converting it to a dictionary
    body = await request.json()
    
    # Sending topic to gpt to generate latex output of the text 
    topic = body.get('topic')
    
    if (body.get('export_option') == 'LaTeX'):  
        # Create a LaTeX prompt using this topic
        latex_prompt = ChatPromptTemplate.from_template("Write a section about {subject}, it should be in LaTeX format.")
        latex_prompt_value = latex_prompt.format_prompt(subject=topic)

        llm_chain = LLMChain(  
        prompt = latex_prompt,
        llm = openai_model  
        )
        #TODO scan text to classify topic of the document
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
        
        response = pocketbase_client.collection("documents").create(data)
        response_dict = dict(response.__dict__)  # Convert Record object to a dictionary
        try:
            # This works when deployed
            documentId = response_dict["id"]
        except KeyError:
            # This works locally
            documentId = response_dict["collection_id"]["id"]
        
        # Generate a Embeddings from the PDF file
        current_dir = os.getcwd()
        pdf_path = os.path.join(current_dir, pdf_file_name)
        create_embeddings_from_pdf_file(pdf_path, documentId)
        
        # Delete the generated LaTeX and PDF files
        os.remove(pdf_file_path)
        os.remove(latex_file_name)
        os.remove('created-document.aux')
        os.remove('created-document.log')
        
    elif (body.get('export_option') == 'HTML'):
        
        # Create a LaTeX prompt using this topic
        html_prompt = ChatPromptTemplate.from_template("Write a document about {subject}, it should be in HTML format and styled like a scientific document.")
        html_prompt_value = html_prompt.format_prompt(subject=topic)

        llm_chain = LLMChain(  
        prompt = html_prompt,
        llm = openai_model  
        )

        # Generate HTML content using this prompt
        html_content = llm_chain.run(html_prompt_value)
        html_content = "<!DOCTYPE html>\n<html>\n<head>\n<title>Document</title>\n</head>\n<body>\n" + html_content + "\n</body>\n</html>"
        
        # Write the HTML content to a file
        html_file_name = "created-document.html"
        with open(html_file_name, "w") as file:
            file.write(html_content)

        # Generate a PDF from the HTML file
        pdf_file_name = html_file_name.replace('.html', '.pdf')
        pdfkit.from_file(html_file_name, pdf_file_name)

        # Calculate the total number of pages and words in the document
        total_pages = get_pdf_page_count(pdf_file_name)
        total_words = get_pdf_word_count(pdf_file_name)

        # Create a new document in the database
        data = {
            "owner": user_id,
            "name": pdf_file_name,
            "document": FileUpload((pdf_file_name, open(pdf_file_name, "rb"))),
            "type": "Created",
            "page_count": total_pages,
            "word_count": total_words
        }
        
        response = pocketbase_client.collection("documents").create(data)
        response_dict = dict(response.__dict__)  # Convert Record object to a dictionary
        try:
            # This works when deployed
            documentId = response_dict["id"]
        except KeyError:
            # This works locally
            documentId = response_dict["collection_id"]["id"]
        
        # Generate a Embeddings from the PDF file
        current_dir = os.getcwd()
        pdf_path = os.path.join(current_dir, pdf_file_name)
        create_embeddings_from_pdf_file(pdf_path, documentId)
        
        # Delete the generated HTML and PDF files
        os.remove(html_file_name)
        os.remove(pdf_file_name)

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
        try:
            page = pdf_reader.getPage(page_num)
            total_words += len(page.extractText().split())
        except KeyError:
            pass  # Skip pages without a /Contents key
    
    return total_words

def get_file_from_pb(document_id: str, user_id: str):
    try:
        # Create PocketBase client with retries
        pocketbase_client = create_pocketbase_client()
    
        # Fetching document from the database by document ID
        response = pocketbase_client.collection("documents").get_one(document_id)
        response_dict = dict(response.__dict__)  # Convert Record object to a dictionary
        try:
            # This works when deployed
            owner = response_dict["owner"]
            recordId = response_dict["id"]
            collectionId = response_dict["collection_id"]
            fileName = response_dict["document"]
            size = '0x0'
        except KeyError:
            # This works locally
            owner = response_dict["collection_id"]["owner"]
            recordId = response_dict["collection_id"]["id"]
            collectionId = response_dict["collection_id"]["collectionId"]
            fileName = response_dict["collection_id"]["document"]
            size = '0x0'

        if owner == user_id:
            url = f"{pocketbase_url}/api/files/{collectionId}/{recordId}/{fileName}?thumb={size}"
            response = requests.get(url)
            response.raise_for_status()
            return response.content, recordId 
    except Exception as e:
        print(f"An error occurred: {str(e)}")