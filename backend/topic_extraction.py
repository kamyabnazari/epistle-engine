import os
import openai 
import plotly.express as px
from pocketbase import PocketBase
from pocketbase.client import FileUpload

from typing import Callable, List, Tuple, Dict

from bertopic.backend import OpenAIBackend
from bertopic import BERTopic

from dotenv import load_dotenv

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

def visualize_topics(doc_chunks: List[str], documentId: str) -> str : 
    topic_model = BERTopic(embedding_model="all-MiniLM-L6-v2")

    # fit data 
    topic_model.fit_transform(doc_chunks)

   # generate a html file
    current_dir = os.getcwd()
    fig_file_name = documentId + ".html" 

    # visualization in html 
    fig = topic_model.visualize_topics()
    fig_path = os.path.join(current_dir, fig_file_name)
    fig.write_html(fig_path)

    # save visualization of the document in pocketbase 
    pb_client = create_pocketbase_client()
    data = {
    "visualization_in_html": FileUpload((fig_file_name, open(fig_path, "rb"))),
    }
    pb_client.collection('documents').update(documentId, data)

    # detele the file 
    os.remove(fig_path)

    return  f"{pocketbase_url}/api/files/documents/{documentId}/{fig_file_name}?thumb=100x300f"
