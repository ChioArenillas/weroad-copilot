import json
import os
from dotenv import load_dotenv

from langchain_community.document_loaders import PyPDFLoader, TextLoader
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_groq import ChatGroq
from langchain_community.vectorstores import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

load_dotenv()

PERSIST_DIRECTORY = "./chroma_db"

def parse_telegram_json(file_path):
    """Extrae texto del JSON exportado de Telegram"""
    documents = []
    if not os.path.exists(file_path):
        return documents
        
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    messages = data.get("messages", [])
    chat_text = []
    
    for msg in messages:
        if msg.get("type") == "message" and "text" in msg:
            text_content = msg["text"]
            if isinstance(text_content, list):
                text_content = "".join([part["text"] if isinstance(part, dict) else part for part in text_content])
            
            if text_content.strip():
                sender = msg.get("from", "Usuario")
                date = msg.get("date", "")
                chat_text.append(f"[{date}] {sender}: {text_content}")
                
    full_chat = "\n".join(chat_text)
    if full_chat:
        documents.append(Document(
            page_content=full_chat,
            metadata={"source": "Telegram Group Chat"}
        ))
    return documents

def build_or_load_vectorstore():
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    
    if os.path.exists(PERSIST_DIRECTORY) and os.listdir(PERSIST_DIRECTORY):
        print("Cargando base de datos de vectores existente...")
        return Chroma(persist_directory=PERSIST_DIRECTORY, embedding_function=embeddings)
        
    print("Procesando documentos y creando la base de datos de vectores por primera vez...")
    all_docs = []
    
    # 1. Travel Diary PDF
    if os.path.exists("data/travel_diary.pdf"):
        pdf_loader = PyPDFLoader("data/travel_diary.pdf")
        pdf_docs = pdf_loader.load()
        for doc in pdf_docs:
            doc.metadata["source"] = "Travel Diary PDF"
        all_docs.extend(pdf_docs)
        
    # 2. TIPS de Coordis
    if os.path.exists("data/tips.txt"):
        tips_loader = TextLoader("data/tips.txt", encoding="utf-8")
        tips_docs = tips_loader.load()
        for doc in tips_docs:
            doc.metadata["source"] = "Sección TIPS de Coordinadores"
        all_docs.extend(tips_docs)
        
    # 3. Chat de Telegram
    telegram_docs = parse_telegram_json("data/telegram_chat.json")
    all_docs.extend(telegram_docs)
    
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=150)
    splits = text_splitter.split_documents(all_docs)
    
    vectorstore = Chroma.from_documents(
        documents=splits,
        embedding=embeddings,
        persist_directory=PERSIST_DIRECTORY
    )
    return vectorstore

def format_docs(docs):
    """Formatea los documentos recuperados incluyendo su fuente en el contexto"""
    formatted = []
    for doc in docs:
        source = doc.metadata.get("source", "Documento")
        formatted.append(f"--- [Fuente: {source}] ---\n{doc.page_content}")
    return "\n\n".join(formatted)

def get_qa_chain():
    vectorstore = build_or_load_vectorstore()
    retriever = vectorstore.as_retriever(search_kwargs={"k": 4})
    
    system_prompt = (
        "Eres el asistente inteligente de viaje para coordinadores de WeRoad (WeRoad Co-Pilot).\n"
        "Tu objetivo es ayudar al coordinador respondiendo preguntas operativas del viaje usando ÚNICAMENTE la siguiente información extraída del Travel Diary PDF, la sección de TIPS y el grupo de Telegram.\n\n"
        "Instrucciones:\n"
        "1. Responde de forma concisa, clara y profesional en español.\n"
        "2. Indica siempre al final de tu respuesta de qué fuente procede la información (ej. [Fuente: TIPS Coordis], [Fuente: Travel Diary PDF] o [Fuente: Telegram]).\n"
        "3. Si la información no está en los documentos, di educadamente que no consta en los registros oficiales ni en los TIPS del viaje.\n\n"
        "Contexto disponible:\n{context}"
    )
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "{question}"),
    ])
    
    llm = ChatGroq(
        model_name="openai/gpt-oss-120b",
        temperature=0.2
    )
    
    # Cadena RAG construida con LCEL
    rag_chain = (
        {"context": retriever | format_docs, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )
    
    return rag_chain