import os 
from langchain.chat_models import ChatOpenAI
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.chains import ConversationalRetrievalChain
from langchain.schema import HumanMessage, AIMessage
from langchain.vectorstores import Qdrant
from qdrant_client import QdrantClient

from dotenv import load_dotenv

load_dotenv()

def make_chain(documentId:str):
    model = ChatOpenAI(
        model_name="gpt-3.5-turbo",
        temperature="0",
    )
    
    embeddings = OpenAIEmbeddings()

    url = os.getenv('PUBLIC_QDRANT_URL')
    api_key = os.getenv('QDRANT__SERVICE_API_KEY')   
    
    if api_key:
        client = QdrantClient(url=url, prefer_grpc=True, api_key=api_key)
    else:
        client = QdrantClient(url=url)

    qdrant = Qdrant(client, documentId, embeddings)
    
    return ConversationalRetrievalChain.from_llm(
        model,
        retriever=qdrant.as_retriever(),
        return_source_documents=True,
    )

def chat_bot_funtion(question: str, chat_history, documentId: str):
    if not chat_history:
        chat_history=[]

    chain = make_chain(documentId)

    # Generate answer
    response = chain({"question": question, "chat_history": chat_history})

    # Retrieve answer
    answer = response["answer"]
    source = response["source_documents"]
    chat_history.append(HumanMessage(content=question))
    chat_history.append(AIMessage(content=answer))
    
    # Display answer
    print("\n\nSources:\n")
    for document in source:
        print(f"Page: {document.metadata['page_number']}")
        print(f"Text chunk: {document.page_content[:160]}...\n")
    print(f"Answer: {answer}")
    return response, chat_history