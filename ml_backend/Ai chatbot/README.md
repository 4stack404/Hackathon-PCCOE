# RAG Chatbot with Groq LLM

A Retrieval-Augmented Generation (RAG) chatbot built using Groq's LLM API. This chatbot reads PDFs from a local data directory and answers questions based on the content.

## Features

- PDF knowledge base processing from local data directory
- Persistent storage of processed knowledge bases
- Vector-based semantic search
- Integration with Groq's powerful LLMs
- Simple API endpoints for frontend integration
- Easy deployment options
- Alternative vector store implementation that doesn't rely on sentence-transformers

## Setup

1. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Set your Groq API key:
   ```
   export GROQ_API_KEY="your-api-key-here"  # For Linux/Mac
   # OR
   set GROQ_API_KEY=your-api-key-here  # For Windows
   ```
   
   Alternatively, create a `.env` file with the following content:
   ```
   GROQ_API_KEY=your-api-key-here
   ```

3. Add your PDF files to the data directory:
   ```
   mkdir -p data
   cp your-documents/*.pdf data/
   ```

4. Run the application using the provided batch file:
   ```
   start_chatbot.bat
   ```
   
   Or manually with:
   ```
   python -m uvicorn api:app --host 0.0.0.0 --port 8000
   ```

## Knowledge Base Management

The system automatically manages processed knowledge bases:

- Knowledge bases are processed once and stored on disk
- The system automatically loads the last processed knowledge base on startup
- You only need to reprocess the knowledge base when adding new PDF files
- Use the `/api/update-knowledge-base` endpoint to update when you add new PDFs

## Deploying to Vercel

MedAssist can be deployed to Vercel with pre-processed knowledge bases. Follow these steps:

1. **Prepare your GitHub repository**:
   - Process your medical PDFs locally using the `/api/process-knowledge-base` endpoint
   - Make sure the `vector_store/` directory contains your processed knowledge base
   - The `.gitignore` file is already configured to exclude the `data/` directory but include `vector_store/`

2. **Connect to Vercel**:
   - Sign up/login to [Vercel](https://vercel.com/)
   - Create a new project and connect it to your GitHub repository
   - During setup, configure the following:
     - Framework Preset: Other
     - Build Command: None
     - Output Directory: None
     - Install Command: `pip install -r requirements.txt`

3. **Configure environment variables**:
   - Add `GROQ_API_KEY` in the Vercel project settings
   - (Optional) Configure `ALLOWED_ORIGINS` for CORS if needed

4. **Deploy**:
   - Click "Deploy" and wait for the build to complete
   - Your MedAssist chatbot will be live at the URL provided by Vercel

### Vercel Limitations

- Serverless functions on Vercel have a 10-second timeout limit in the free tier
- For production use with heavy traffic, consider upgrading to Vercel Pro

### Testing Your Deployment

Once deployed, test your chatbot with a direct request to verify it's working:

```
curl -X POST https://your-vercel-app.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{"question":"What are the key aspects of prenatal care?"}'
```

The response should include information retrieved from your pre-processed knowledge base.

## Deploying to Render

MedAssist can also be deployed to Render with the included configuration files. Follow these steps:

1. **Prepare your GitHub repository**:
   - Process your medical PDFs locally using the `/api/process-knowledge-base` endpoint
   - Make sure the `vector_store/` directory contains your processed knowledge base
   - The `.gitignore` file is already configured to exclude the `data/` directory but include `vector_store/`

2. **Connect to Render**:
   - Sign up/login to [Render](https://render.com/)
   - Create a new "Web Service" and connect it to your GitHub repository
   - During setup, configure the following:
     - Name: medassist (or your preferred name)
     - Environment: Python
     - Build Command: `pip install -r requirements.txt`
     - Start Command: `uvicorn api:app --host 0.0.0.0 --port $PORT`

3. **Configure environment variables**:
   - Add `GROQ_API_KEY` in the Render project environment settings

4. **Deploy**:
   - Click "Create Web Service" and wait for the build to complete
   - Your MedAssist chatbot will be live at the URL provided by Render

### Testing Your Render Deployment

Once deployed, test your chatbot with a direct request to verify it's working:

```
curl -X POST https://your-render-app.onrender.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{"question":"What are the key aspects of prenatal care?"}'
```

The response should include information retrieved from your pre-processed knowledge base.

## API Endpoints

- `POST /api/set-api-key`: Set your Groq API key
- `POST /api/process-knowledge-base`: Process PDFs from the data directory (with `force_reprocess=true` query parameter to force reprocessing) 
- `POST /api/update-knowledge-base`: Update the knowledge base when you add new PDFs
- `POST /api/chat`: Ask a question to the chatbot
- `GET /api/list-pdf-files`: List all PDF files in the data directory
- `GET /api/knowledge-bases`: List all available knowledge bases
- `GET /api/health`: Health check

## Using the API

1. Set the Groq API key:
   ```
   curl -X POST http://localhost:8000/api/set-api-key \
     -H "Content-Type: application/json" \
     -d '{"api_key": "your-groq-api-key-here"}'
   ```

2. Process the PDFs in the data directory (only needed once):
   ```
   curl -X POST http://localhost:8000/api/process-knowledge-base
   ```

3. Ask a question:
   ```
   curl -X POST http://localhost:8000/api/chat \
     -H "Content-Type: application/json" \
     -d '{"question": "What is RAG?", "top_k": 5}'
   ```

4. When you add new PDFs, update the knowledge base:
   ```
   curl -X POST http://localhost:8000/api/update-knowledge-base
   ```

## Testing

The repository includes a `test_api.py` script that can be used to test all API endpoints:

```
python test_api.py
```

## Vector Store Implementation

This project provides two vector store implementations:

1. Default implementation using sentence-transformers (may have compatibility issues)
2. Alternative implementation using scikit-learn's TF-IDF vectorizer (more reliable but potentially less accurate)

The API automatically falls back to the alternative implementation if the default one has issues.

## Project Structure

- `pdf_processor.py`: Handles PDF extraction and text chunking
- `vector_store.py`: Manages vector embeddings and search
- `alternative_vector_store.py`: An alternative vector store implementation using TF-IDF
- `rag_chain.py`: Implements the RAG pipeline with Groq
- `api.py`: FastAPI application for deployment
- `data/`: Directory for PDF files
- `vector_store/`: Directory for persistent storage of processed knowledge bases
- `test_api.py`: Test script for the API
- `start_chatbot.bat`: Batch file to start the application
