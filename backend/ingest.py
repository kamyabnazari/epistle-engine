import json
import pdfplumber
import PyPDF3
import re
import os
from typing import Callable, List, Tuple, Dict, Union

from langchain.docstore.document import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Qdrant

from transformers import pipeline

# Importing pocketbase sdk
from pocketbase import PocketBase

from dotenv import load_dotenv

from collections import Counter

from retry import retry

import logging

from labels_dictionary import get_candidate_labels_for_documents, get_candidate_labels_for_chunks

logging.basicConfig(level=logging.INFO)

load_dotenv()

# Define the maximum number of retries and the delay between retries
max_retries = 5
retry_delay = 2

pocketbase_url = os.getenv("PUBLIC_POCKETBASE_URL")

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

def extract_metadata_from_pdf(file_path: str) -> Dict[str, str]:
    with open(file_path, "rb") as pdf_file:
        reader = PyPDF3.PdfFileReader(pdf_file) 
        metadata = reader.getDocumentInfo()
        return {
            "title": metadata.get("/Title", "").strip(),
            "author": metadata.get("/Author", "").strip(),
            "creation_date": metadata.get("/CreationDate", "").strip(),
        }

# Load the classifier once at the top of your script
classifier = pipeline("zero-shot-classification", model="distilbert-base-uncased")

def classify_topics_document(text:str) -> str:
    candidate_labels = get_candidate_labels_for_documents()
    result = classifier(text, candidate_labels, multi_label=True)
    # find the index of the topic with the highest score
    highest_score_index = result["scores"].index(max(result["scores"]))
    # log the labels and their scores
    logging.info(f"Document Labels: {result['labels']}")
    logging.info(f"Document Scores: {result['scores']}")
    # return the topic with the highest score if this score is greater than 0.4
    if(max(result["scores"])) < 0.4:
        return "Other" 
    else:
        return result["labels"][highest_score_index]

def classify_topics_chunks(chunks: List[str]) -> List[str]:
    candidate_labels = get_candidate_labels_for_chunks()
    results = classifier(chunks, candidate_labels, multi_label=True)

    classified_chunks = []
    for result in results:
        # find the index of the topic with the highest score
        highest_score_index = result["scores"].index(max(result["scores"]))
        # log the labels and their scores
        logging.info(f"Chunk Labels: {result['labels']}")
        logging.info(f"Chunk Scores: {result['scores']}")
        # add the topic with the highest score if this score is greater than 0.4
        if max(result["scores"]) < 0.4:
            classified_chunks.append("Other")
        else:
            classified_chunks.append(result["labels"][highest_score_index])
    
    return classified_chunks

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
    all_chunks = []
    for page_num, page in text:
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            separators=["\n\n", "\n", ".", "!", "?", ",", " ", ""],
            chunk_overlap=100,
        )
        chunks = text_splitter.split_text(page)
        all_chunks.extend([(page_num, i, chunk) for i, chunk in enumerate(chunks)])

    all_topics = classify_topics_chunks([chunk for _, _, chunk in all_chunks])

    topic_counts = count_topic_occurrences(all_topics)
    
    for (page_num, i, chunk), topic in zip(all_chunks, all_topics):
        doc = Document(
            page_content=chunk,
            metadata={
                "page_number": page_num,
                "chunk": i,
                "source": f"p{page_num}-{i}",
                "topic" : topic,
                **metadata,
            },
        )
        doc_chunks.append(doc)
    return doc_chunks, topic_counts

def count_topic_occurrences(topics: List[str]) -> List[Dict[str, Union[str, int]]]:
    counter = Counter(topics)
    result = [{'id': topic, 'value': count} for topic, count in counter.items()]
    return result

def create_embeddings_from_pdf_file(file_path: str, documentId: str):
    # Step 0: Create Pocketbase client
    pocketbase_client = create_pocketbase_client()
    
    # Step 1: Parse PDF
    raw_pages, metadata = parse_pdf(file_path)
    
    # Step 1.5: Classify the topic of the whole document
    whole_document_text = " ".join([text for _, text in raw_pages])
    document_topic = classify_topics_document(whole_document_text)
    metadata["document_topic"] = document_topic  # add the document's topic to the metadata
    
    # Step 1.75: Update the document's topic in the database
    data = {
        "classified_topic": document_topic
    }
    pocketbase_client.collection('documents').update(documentId, data)

    # Step 2: Create text chunks
    cleaning_functions = [
        merge_hyphenated_words,
        fix_newlines,
        remove_multiple_newlines,
    ]
    cleaned_text_pdf = clean_text(raw_pages, cleaning_functions)
    document_chunks, topic_counts = text_to_docs(cleaned_text_pdf, metadata)
    
    # Step 2.5: Save the topic statistics to PocketBase
    data = {
        "classified_doc_chunks_topics": json.dumps(topic_counts)
    }
    pocketbase_client.collection('documents').update(documentId, data)
    
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
    