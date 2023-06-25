import os 
from langchain.vectorstores.chroma import Chroma
from langchain.chat_models import ChatOpenAI
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.chains import ConversationalRetrievalChain
from langchain.schema import HumanMessage, AIMessage
from dotenv import load_dotenv


def make_chain(documentId:str):
    model = ChatOpenAI(
        model_name="gpt-3.5-turbo",
        temperature="0",
        # verbose=True
    )
    embedding = OpenAIEmbeddings()

    vector_store = Chroma(
        collection_name=documentId,
        embedding_function=embedding,
        persist_directory= os.getenv('DB_PERSIST_DIRECTORY'),
    )

    return ConversationalRetrievalChain.from_llm(
        model,
        retriever=vector_store.as_retriever(),
        return_source_documents=True,
        # verbose=True,
    )


def chat_bot_funtion(question: str, chat_history, documentId: str):
    load_dotenv()
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