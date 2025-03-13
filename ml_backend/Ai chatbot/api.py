import os
import tempfile
import uuid
import json
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from fastapi.staticfiles import StaticFiles
import logging
from dotenv import load_dotenv

# Load environment variables from .env file if present
load_dotenv()

from pdf_processor import PDFProcessor
from alternative_vector_store import AlternativeVectorStore
from rag_chain import RAGChain
from chatbot_config import CHATBOT_NAME, CHATBOT_VERSION, CHATBOT_PURPOSE

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = FastAPI(
    title=f"{CHATBOT_NAME} API",
    description=CHATBOT_PURPOSE,
    version=CHATBOT_VERSION
)

# Add CORS middleware to allow cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Modify this in production to specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data directory
DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
# Vector store directory
VECTOR_STORE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "vector_store")
# Knowledge base info file
KB_INFO_FILE = os.path.join(VECTOR_STORE_DIR, "kb_info.json")

# Create directories if they don't exist
os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(VECTOR_STORE_DIR, exist_ok=True)

# Initialize components
pdf_processor = PDFProcessor()
vector_store = None
rag_chain = None  # Will be initialized when API key is provided

# In-memory storage for chat sessions
chat_sessions = {}

# Store for knowledge bases
knowledge_bases = {}

# Models
class ApiKeyRequest(BaseModel):
    api_key: str = Field(..., description="Groq API key")
    model_name: str = Field("llama3-70b-8192", description="Groq model name")

class ChatRequest(BaseModel):
    question: str = Field(..., description="User question")
    session_id: Optional[str] = Field(None, description="Chat session ID")
    top_k: int = Field(5, description="Number of documents to retrieve")

class ChatResponse(BaseModel):
    answer: str = Field(..., description="Answer from the LLM")
    session_id: str = Field(..., description="Chat session ID")
    sources: List[Dict[str, Any]] = Field([], description="Sources used for the answer")

class ProcessDataResponse(BaseModel):
    message: str = Field(..., description="Status message")
    kb_id: str = Field(..., description="Knowledge base ID")
    num_documents: int = Field(..., description="Number of documents processed")
    files_processed: List[str] = Field(..., description="List of processed files")

# Function to load knowledge base information
def load_kb_info():
    if os.path.exists(KB_INFO_FILE):
        with open(KB_INFO_FILE, 'r') as f:
            return json.load(f)
    return {}

# Function to save knowledge base information
def save_kb_info(kb_info):
    with open(KB_INFO_FILE, 'w') as f:
        json.dump(kb_info, f)

# Function to load knowledge bases on startup
def load_knowledge_bases():
    global knowledge_bases
    
    kb_info = load_kb_info()
    logger.info(f"Found {len(kb_info)} knowledge bases in storage")
    
    for kb_id, kb_data in kb_info.items():
        try:
            kb_dir = os.path.join(VECTOR_STORE_DIR, kb_id)
            if os.path.exists(kb_dir):
                logger.info(f"Loading knowledge base {kb_id}")
                knowledge_bases[kb_id] = AlternativeVectorStore.load(kb_dir)
                logger.info(f"Loaded knowledge base {kb_id} with {len(knowledge_bases[kb_id].documents)} documents")
        except Exception as e:
            logger.error(f"Error loading knowledge base {kb_id}: {str(e)}")

# Load knowledge bases on startup
load_knowledge_bases()

# API endpoint to set Groq API key
@app.post("/api/set-api-key", response_model=dict)
async def set_api_key(request: ApiKeyRequest):
    global rag_chain
    try:
        rag_chain = RAGChain(model_name=request.model_name, api_key=request.api_key)
        return {"message": "API key set successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to initialize Groq LLM: {str(e)}")

# Helper to check if API key is set
def get_rag_chain():
    if rag_chain is None:
        raise HTTPException(
            status_code=401, 
            detail="Groq API key not set. Please call /api/set-api-key first."
        )
    return rag_chain

# API endpoint to process PDF files from data directory
@app.post("/api/process-knowledge-base", response_model=ProcessDataResponse)
async def process_knowledge_base(force_reprocess: bool = False):
    try:
        # Check if we already have a processed knowledge base
        kb_info = load_kb_info()
        default_kb_id = kb_info.get("default_kb_id")
        
        # If we have a default KB and not forcing reprocess, just return it
        if default_kb_id and default_kb_id in knowledge_bases and not force_reprocess:
            kb = knowledge_bases[default_kb_id]
            return ProcessDataResponse(
                message="Using existing knowledge base",
                kb_id=default_kb_id,
                num_documents=len(kb.documents),
                files_processed=[doc["metadata"].get("source", "Unknown") for doc in kb.documents]
            )
        
        # For Vercel deployment, check if DATA_DIR exists first
        if not os.path.exists(DATA_DIR):
            # If we're on Vercel, we might not have the data directory but still have the vector store
            # Check if we have any pre-processed knowledge bases available
            kb_dirs = [d for d in os.listdir(VECTOR_STORE_DIR) 
                      if os.path.isdir(os.path.join(VECTOR_STORE_DIR, d)) and d != "__pycache__"]
            
            if kb_dirs:
                # Use the most recent pre-processed knowledge base
                kb_id = kb_dirs[0]  # Just use the first one for simplicity
                kb_path = os.path.join(VECTOR_STORE_DIR, kb_id)
                
                # Load the vector store
                kb_vector_store = AlternativeVectorStore.load(kb_path)
                knowledge_bases[kb_id] = kb_vector_store
                
                # Update KB info
                kb_info = load_kb_info()
                kb_info["default_kb_id"] = kb_id
                save_kb_info(kb_info)
                
                logger.info(f"Loaded pre-processed knowledge base {kb_id} from {kb_path}")
                
                return ProcessDataResponse(
                    message="Loaded pre-processed knowledge base",
                    kb_id=kb_id,
                    num_documents=len(kb_vector_store.documents),
                    files_processed=["pre-processed"]
                )
            else:
                raise HTTPException(
                    status_code=404, 
                    detail=f"No data directory found and no pre-processed knowledge bases available"
                )
                
        # Find all PDF files in the data directory
        pdf_paths = []
        for root, _, files in os.walk(DATA_DIR):
            for file in files:
                if file.lower().endswith(".pdf"):
                    pdf_paths.append(os.path.join(root, file))
        
        if not pdf_paths:
            raise HTTPException(status_code=404, detail=f"No PDF files found in {DATA_DIR}")
        
        # Process PDFs
        logger.info(f"Processing {len(pdf_paths)} PDF files")
        documents = pdf_processor.process_multiple_pdfs(pdf_paths)
        logger.info(f"Created {len(documents)} document chunks")
        
        # Create a new vector store for this knowledge base
        kb_vector_store = AlternativeVectorStore()
        kb_vector_store.add_documents(documents)
        
        # Generate a unique ID for this knowledge base
        kb_id = str(uuid.uuid4())
        knowledge_bases[kb_id] = kb_vector_store
        
        # Save the vector store to disk
        kb_dir = os.path.join(VECTOR_STORE_DIR, kb_id)
        kb_vector_store.save(kb_dir)
        logger.info(f"Saved knowledge base {kb_id} to {kb_dir}")
        
        # Update KB info
        kb_info = load_kb_info()
        kb_info[kb_id] = {
            "created_at": str(uuid.uuid1()),
            "num_documents": len(documents),
            "files": [os.path.basename(path) for path in pdf_paths]
        }
        kb_info["default_kb_id"] = kb_id
        save_kb_info(kb_info)
        
        return ProcessDataResponse(
            message="Knowledge base created and saved successfully",
            kb_id=kb_id,
            num_documents=len(documents),
            files_processed=[os.path.basename(path) for path in pdf_paths]
        )
        
    except Exception as e:
        logger.error(f"Error processing PDFs: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing PDFs: {str(e)}")

# API endpoint to update knowledge base with new PDFs
@app.post("/api/update-knowledge-base", response_model=ProcessDataResponse)
async def update_knowledge_base():
    try:
        # For Vercel deployment, check if DATA_DIR exists first
        if not os.path.exists(DATA_DIR):
            raise HTTPException(
                status_code=404, 
                detail="Cannot update knowledge base: Data directory not available in this environment. Please use pre-processed knowledge base."
            )
            
        # Find all PDF files in the data directory
        pdf_paths = []
        for root, _, files in os.walk(DATA_DIR):
            for file in files:
                if file.lower().endswith(".pdf"):
                    pdf_paths.append(os.path.join(root, file))
        
        if not pdf_paths:
            raise HTTPException(status_code=404, detail=f"No PDF files found in {DATA_DIR}")
        
        # Process PDFs
        logger.info(f"Processing {len(pdf_paths)} PDF files for update")
        documents = pdf_processor.process_multiple_pdfs(pdf_paths)
        logger.info(f"Created {len(documents)} document chunks")
        
        # Create a new vector store
        kb_vector_store = AlternativeVectorStore()
        kb_vector_store.add_documents(documents)
        
        # Generate a unique ID for this knowledge base
        kb_id = str(uuid.uuid4())
        knowledge_bases[kb_id] = kb_vector_store
        
        # Save the vector store to disk
        kb_dir = os.path.join(VECTOR_STORE_DIR, kb_id)
        kb_vector_store.save(kb_dir)
        logger.info(f"Saved updated knowledge base {kb_id} to {kb_dir}")
        
        # Update KB info
        kb_info = load_kb_info()
        kb_info[kb_id] = {
            "created_at": str(uuid.uuid1()),
            "num_documents": len(documents),
            "files": [os.path.basename(path) for path in pdf_paths]
        }
        kb_info["default_kb_id"] = kb_id
        save_kb_info(kb_info)
        
        return ProcessDataResponse(
            message="Knowledge base updated and saved successfully",
            kb_id=kb_id,
            num_documents=len(documents),
            files_processed=[os.path.basename(path) for path in pdf_paths]
        )
        
    except Exception as e:
        logger.error(f"Error updating knowledge base: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error updating knowledge base: {str(e)}")

# API endpoint for chat
@app.post("/api/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    rag_chain: RAGChain = Depends(get_rag_chain),
    x_kb_id: Optional[str] = Header(None, description="Knowledge base ID")
):
    # If no KB ID is provided, use the default KB
    kb_id = x_kb_id
    if not kb_id:
        kb_info = load_kb_info()
        kb_id = kb_info.get("default_kb_id")
    
    if not kb_id or kb_id not in knowledge_bases:
        # Try to load knowledge bases again
        load_knowledge_bases()
        
        # Check again
        if not kb_id or kb_id not in knowledge_bases:
            raise HTTPException(
                status_code=404, 
                detail="Knowledge base not found. Please process PDFs first using /api/process-knowledge-base"
            )
    
    # Get the knowledge base
    kb_vector_store = knowledge_bases[kb_id]
    
    # Create a new session if none exists
    session_id = request.session_id or str(uuid.uuid4())
    
    # Retrieve relevant documents
    relevant_docs = kb_vector_store.search(request.question, top_k=request.top_k)
    
    # Answer the question
    answer = rag_chain.answer_question(request.question, relevant_docs)
    
    # Update the session with the conversation
    if session_id not in chat_sessions:
        chat_sessions[session_id] = []
        
    chat_sessions[session_id].append({
        "question": request.question,
        "answer": answer,
        "sources": [doc["metadata"] for doc in relevant_docs]
    })
    
    # Format sources for the response
    sources = [
        {
            "source": doc["metadata"].get("source", "Unknown"),
            "score": doc["score"]
        }
        for doc in relevant_docs
    ]
    
    return ChatResponse(
        answer=answer,
        session_id=session_id,
        sources=sources
    )

# Health check endpoint
@app.get("/api/health")
async def health_check():
    kb_info = load_kb_info()
    default_kb_id = kb_info.get("default_kb_id")
    kb_loaded = default_kb_id in knowledge_bases if default_kb_id else False
    
    # Get RAG chain to access chatbot info if available
    try:
        rag_chain = get_rag_chain()
        chatbot_info = rag_chain.chatbot_info
    except:
        chatbot_info = {
            "name": CHATBOT_NAME,
            "version": CHATBOT_VERSION,
            "model": "unknown"
        }
    
    return {
        "status": "ok", 
        "version": app.version,
        "kb_status": "loaded" if kb_loaded else "not_loaded",
        "chatbot": chatbot_info
    }

# Get available knowledge bases
@app.get("/api/knowledge-bases")
async def get_knowledge_bases():
    kb_info = load_kb_info()
    default_kb_id = kb_info.get("default_kb_id")
    
    return {
        "knowledge_bases": [
            {
                "id": kb_id, 
                "num_documents": len(kb) if kb_id in knowledge_bases else 0,
                "is_default": kb_id == default_kb_id,
                "info": kb_info.get(kb_id, {})
            }
            for kb_id, kb in knowledge_bases.items()
        ],
        "default_kb_id": default_kb_id
    }

# List all PDF files in the data directory
@app.get("/api/list-pdf-files")
async def list_pdf_files():
    pdf_files = []
    for root, _, files in os.walk(DATA_DIR):
        for file in files:
            if file.lower().endswith(".pdf"):
                rel_path = os.path.relpath(os.path.join(root, file), DATA_DIR)
                pdf_files.append(rel_path)
    
    return {"pdf_files": pdf_files}

# Add mount for static files if they exist
static_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static")
if os.path.exists(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

# Root endpoint that returns basic info about the API
@app.get("/")
async def root():
    return {
        "name": CHATBOT_NAME,
        "version": CHATBOT_VERSION,
        "description": CHATBOT_PURPOSE,
        "endpoints": [
            "/api/health", 
            "/api/set-api-key",
            "/api/chat",
            "/api/process-knowledge-base",
            "/api/knowledge-bases",
            "/api/list-pdf-files"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    # Get the port from the environment variable (for Render) or use 8000 as default
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
