import pdfplumber
import PyPDF3
import re
import os
from typing import Callable, List, Tuple, Dict

from langchain.docstore.document import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Qdrant

from operator import attrgetter

from transformers import pipeline

from qdrant_client import QdrantClient

from pocketbase import PocketBase

from dotenv import load_dotenv

from topic_extraction import visualize_topics
load_dotenv

pocketbase_url = os.getenv("PUBLIC_POCKETBASE_URL")

def create_pocketbase_client():
    pocketbase_client = PocketBase(pocketbase_url)

    # Login as admin
    pocketbase_client.admins.auth_with_password(
        os.getenv("POCKETBASE_ADMIN_EMAIL"), os.getenv("POCKETBASE_ADMIN_PASSWORD")
    )

    # If the above code executes successfully, return the PocketBase client
    return pocketbase_client

def get_candidate_labels_for_documents():
    return ["technology", "science", "politics", "business", "lifestyle", "art", "entertainment", "sports"] 

def get_candidate_labels_for_chunks():
    return [
    "technology",
    "science",
    "sports",
    "entertainment",
    "politics",
    "business",
    "health",
    "education",
    "environment",
    "travel",
    "food and cooking",
    "fashion",
    "art and culture",
    "history",
    "literature",
    "music",
    "film and tv",
    "gaming",
    "fitness and wellness",
    "social issues"
]
def extract_metadata_from_pdf(file_path: str) -> Dict[str, str]:
    with open(file_path, "rb") as pdf_file:
        reader = PyPDF3.PdfFileReader(pdf_file) 
        metadata = reader.getDocumentInfo()
        return {
            "title": metadata.get("/Title", "").strip(),
            "author": metadata.get("/Author", "").strip(),
            "creation_date": metadata.get("/CreationDate", "").strip(),
        }
    
def classify_topics_document(text:str) -> str:
    candidate_labels = get_candidate_labels_for_documents()
    classifier = pipeline("zero-shot-classification")
    result = classifier(text, candidate_labels)
    # find the index of the topic with the highest score
    highest_score_index = result["scores"].index(max(result["scores"]))
    # return the topic with the highest score if this score is greater than 0.5
    if(max(result["scores"])) < 0.5:
        return None 
    else:
        return result["labels"][highest_score_index]
    
def classify_topics_chunks(text:str) -> str:
    candidate_labels = ["technology", "science", "politics", "business", "lifestyle", "art", "entertainment", "sports"]   # Adjust this list to your desired topics
    classifier = pipeline("zero-shot-classification")
    result = classifier(text, candidate_labels)
    # find the index of the topic with the highest score
    highest_score_index = result["scores"].index(max(result["scores"]))
    # return the topic with the highest score if this score is greater than 0.5
    if(max(result["scores"])) < 0.5:
        return None 
    else:
        return result["labels"][highest_score_index]

def extract_pages_from_pdf(file_path: str) -> List[Tuple[int, str]]:
    """
    Extracts the text from each page of the PDF.

    :param file_path: The path to the PDF file.
    :return: A list of tuples containing the page number and the extracted text.
    """
    if not os.path.isfile(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")

    with pdfplumber.open(file_path) as pdf:
        pages = []
        for page_num, page in enumerate(pdf.pages):
            text = page.extract_text()
            if text.strip():  # Check if extracted text is not empty
                pages.append((page_num + 1, text))
    return pages


def parse_pdf(file_path: str) -> Tuple[List[Tuple[int, str]], Dict[str, str]]:
    """
    Extracts the title and text from each page of the PDF.

    :param file_path: The path to the PDF file.
    :return: A tuple containing the title and a list of tuples with page numbers and extracted text.
    """
    if not os.path.isfile(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")

    metadata = extract_metadata_from_pdf(file_path)
    pages = extract_pages_from_pdf(file_path)

    return pages, metadata


def merge_hyphenated_words(text: str) -> str:
    return re.sub(r"(\w)-\n(\w)", r"\1\2", text)


def fix_newlines(text: str) -> str:
    return re.sub(r"(?<!\n)\n(?!\n)", " ", text)


def remove_multiple_newlines(text: str) -> str:
    return re.sub(r"\n{2,}", "\n", text)


def clean_text(
    pages: List[Tuple[int, str]], cleaning_functions: List[Callable[[str], str]]
) -> List[Tuple[int, str]]:
    cleaned_pages = []
    for page_num, text in pages:
        for cleaning_function in cleaning_functions:
            text = cleaning_function(text)
        cleaned_pages.append((page_num, text))
    return cleaned_pages


def text_to_docs(text: List[str], metadata: Dict[str, str]) -> List[Document]:
    """Converts list of strings to a list of Documents with metadata."""
    doc_chunks = []

    for page_num, page in text:
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            separators=["\n\n", "\n", ".", "!", "?", ",", " ", ""],
            chunk_overlap=200,
        )
        chunks = text_splitter.split_text(page)

        for i, chunk in enumerate(chunks):
            #topic = classify_topics_chunks(chunk)
            #                    "topic" : topic, 
            doc = Document(
                page_content=chunk,
                metadata={
                    "page_number": page_num,
                    "chunk": i,
                    "source": f"p{page_num}-{i}",
                    **metadata,
                },
            )
            doc_chunks.append(doc)

    return doc_chunks

def create_embeddings_from_pdf_file(file_path: str, documentId: str):
    
    # Step 1: Parse PDF
    raw_pages, metadata = parse_pdf(file_path)

    # Step 2: Create text chunks
    cleaning_functions = [
        merge_hyphenated_words,
        fix_newlines,
        remove_multiple_newlines,
    ]
    cleaned_text_pdf = clean_text(raw_pages, cleaning_functions)
    document_chunks = text_to_docs(cleaned_text_pdf, metadata)

    # visualize the topic for this document and save it in pocketbase 
    page_contents_list = list(map(attrgetter('page_content'), document_chunks))
    if(len(page_contents_list) >= 10):
        visualize_topics(page_contents_list, documentId=documentId)
    
    # Step 3 + 4: Generate embeddings and store them in DB
    embeddings = OpenAIEmbeddings()

    url = os.getenv('PUBLIC_QDRANT_URL')
    api_key = os.getenv('QDRANT__SERVICE_API_KEY')   

    if api_key:
        Qdrant.from_documents(
            document_chunks,
            embedding=embeddings,
            url=url,
            prefer_grpc=True,
            api_key=api_key,
            collection_name=documentId,
            timeout=120
        )
    else:
        Qdrant.from_documents(
            document_chunks,
            embedding=embeddings,
            url=url,
            prefer_grpc=False,
            collection_name=documentId,
            timeout=120
        )
