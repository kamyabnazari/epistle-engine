import pdfplumber
import PyPDF3
import re
import os
from typing import Callable, List, Tuple, Dict, Union

from langchain.docstore.document import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Qdrant
from langchain import LLMChain
from langchain.chat_models import ChatOpenAI  
from langchain.prompts import ChatPromptTemplate

# Import document_topics from document_topics.py
from document_topics import document_topics

# Importing pocketbase sdk
from pocketbase import PocketBase

from dotenv import load_dotenv

from collections import Counter

import logging

logging.basicConfig(level=logging.INFO)

load_dotenv()

qdrant_public_url = os.getenv('PUBLIC_QDRANT_URL')

def extract_metadata_from_pdf(file_path: str) -> Dict[str, str]:
    with open(file_path, "rb") as pdf_file:
        reader = PyPDF3.PdfFileReader(pdf_file) 
        metadata = reader.getDocumentInfo()
        return {
            "title": metadata.get("/Title", "").strip(),
            "author": metadata.get("/Author", "").strip(),
            "creation_date": metadata.get("/CreationDate", "").strip(),
        }

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
            chunk_size=3500,
            separators=["\n\n", "\n", ".", "!", "?", ",", " ", ""],
            chunk_overlap=500,
        )
        chunks = text_splitter.split_text(page)
        all_chunks.extend([(page_num, i, chunk) for i, chunk in enumerate(chunks)])
    
    for page_num, i, chunk in all_chunks:
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

def count_topic_occurrences(topics: List[str]) -> List[Dict[str, Union[str, int]]]:
    counter = Counter(topics)
    result = [{'id': topic, 'value': count} for topic, count in counter.items()]
    return result

def classify_topic_document(text:str, openai_model: ChatOpenAI) -> str:    
    # Create a Classification prompt
    classify_prompt = ChatPromptTemplate.from_template(
        "Based on the following text: '{all_texts}', "
        "please classify the document by selecting one word from this list of topics: {all_topics}. "
        "Choose the topic that is most accurately represented in the text."
    )

    all_topics = ', '.join(document_topics)
    all_texts = text[:1000]

    # classify_prompt_value = classify_prompt.format(all_topics=all_topics, all_texts=all_texts)

    # Create a dictionary to hold the inputs
    classify_prompt_dict = {
        'all_topics': all_topics,
        'all_texts': all_texts
    }
    
    llm_chain = LLMChain(  
        prompt=classify_prompt,
        llm=openai_model
    )

    # Classify Document on the basis of its text
    classify_result = llm_chain.run(classify_prompt_dict)

    return classify_result

def create_embeddings_from_pdf_file(file_path: str, documentId: str, pocketbase_client: PocketBase, openai_model: ChatOpenAI):
    # Step 1: Parse PDF
    raw_pages, metadata = parse_pdf(file_path)
    
    # Step 1.5: Classify the topic of the whole document
    whole_document_text = " ".join([text for _, text in raw_pages])
    document_topic = classify_topic_document(whole_document_text, openai_model)
    metadata["document_topic"] = document_topic # add the document's topic to the metadata
    
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
    document_chunks = text_to_docs(cleaned_text_pdf, metadata)
    
    # Step 3 + 4: Generate embeddings and store them in DB
    embeddings = OpenAIEmbeddings()

    Qdrant.from_documents(
        document_chunks,
        embedding=embeddings,
        url=qdrant_public_url,
        prefer_grpc=False,
        collection_name=documentId,
        timeout=120
    )