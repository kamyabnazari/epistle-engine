import os
import openai 

from typing import Callable, List, Tuple, Dict

from bertopic.backend import OpenAIBackend
from bertopic import BERTopic

def prepare_embeddings(doc_chunks: List[str]):
    openai.api_key = os.environ.get("OPENAI_API_KEY")
    embedding_model = OpenAIBackend("text-embedding-ada-002")

    topic_model = BERTopic(embedding_model = embedding_model)

    #fit data 
    topic_model.fit_transform(doc_chunks)

   # Generate a PDF from the LaTeX file
    current_dir = os.getcwd()
    fig_file_name = "figure.html"

    #visualize 
    fig = topic_model.visualize_topics()
    fig_path = os.path.join(current_dir, fig_file_name)
    fig.write_html(fig_path)
    
    return fig_path
