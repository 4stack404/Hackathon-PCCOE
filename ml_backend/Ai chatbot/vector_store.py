import os
import numpy as np
import faiss
import pickle
from typing import List, Dict, Any

# Use our patched version instead of the original
try:
    from patched_transformers import SentenceTransformer
    print("Using patched SentenceTransformer")
except ImportError:
    print("Warning: Could not import patched SentenceTransformer, attempting to use original")
    try:
        from sentence_transformers import SentenceTransformer
    except ImportError:
        raise ImportError("Could not import SentenceTransformer. Please install sentence-transformers.")

# Update imports for huggingface_hub if needed
try:
    # New way (modern huggingface_hub)
    from huggingface_hub import hf_hub_download as hf_download
except ImportError:
    try:
        # Old way (legacy huggingface_hub)
        from huggingface_hub import cached_download as hf_download
    except ImportError:
        # Fallback
        print("Warning: Neither hf_hub_download nor cached_download could be imported.")
        hf_download = None

class VectorStore:
    """Vector database for storing and retrieving document embeddings."""
    
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        """
        Initialize the vector store with a sentence transformer model.
        
        Args:
            model_name: Name of the sentence transformer model to use
        """
        # Fix for potential huggingface_hub compatibility issues
        os.environ["SENTENCE_TRANSFORMERS_HOME"] = os.path.join(os.path.dirname(os.path.abspath(__file__)), "models")
        
        try:
            self.model = SentenceTransformer(model_name)
            print(f"Successfully loaded model: {model_name}")
        except Exception as e:
            print(f"Error loading model {model_name}: {str(e)}")
            raise
            
        self.index = None
        self.documents = []
        self.embeddings = None
        
    def add_documents(self, documents: List[Dict[str, Any]]):
        """
        Add documents to the vector store.
        
        Args:
            documents: List of documents with text and metadata
        """
        self.documents = documents
        texts = [doc["text"] for doc in documents]
        
        # Create embeddings
        self.embeddings = self.model.encode(texts, show_progress_bar=True)
        
        # Create FAISS index
        dimension = self.embeddings.shape[1]
        self.index = faiss.IndexFlatL2(dimension)
        self.index.add(np.array(self.embeddings).astype('float32'))
        
    def search(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Search for documents similar to the query.
        
        Args:
            query: Query text
            top_k: Number of top results to return
            
        Returns:
            List of documents with similarity scores
        """
        if self.index is None or not self.documents:
            raise ValueError("No documents have been added to the vector store")
            
        # Create query embedding
        query_embedding = self.model.encode([query])[0].reshape(1, -1)
        
        # Search index
        distances, indices = self.index.search(
            np.array(query_embedding).astype('float32'), 
            k=min(top_k, len(self.documents))
        )
        
        results = []
        for i, idx in enumerate(indices[0]):
            results.append({
                "text": self.documents[idx]["text"],
                "metadata": self.documents[idx]["metadata"],
                "score": float(distances[0][i])
            })
            
        return results
    
    def save(self, directory: str):
        """
        Save the vector store to disk.
        
        Args:
            directory: Directory to save the vector store
        """
        os.makedirs(directory, exist_ok=True)
        
        # Save the index
        faiss.write_index(self.index, os.path.join(directory, "index.faiss"))
        
        # Save documents and model name
        with open(os.path.join(directory, "vector_store.pkl"), "wb") as f:
            pickle.dump({
                "documents": self.documents,
                "model_name": self.model.get_sentence_embedding_dimension()
            }, f)
            
    @classmethod
    def load(cls, directory: str):
        """
        Load a vector store from disk.
        
        Args:
            directory: Directory where the vector store is saved
            
        Returns:
            Loaded VectorStore instance
        """
        # Load documents and model name
        with open(os.path.join(directory, "vector_store.pkl"), "rb") as f:
            data = pickle.load(f)
            
        # Create instance
        instance = cls()
        instance.documents = data["documents"]
        
        # Load the index
        instance.index = faiss.read_index(os.path.join(directory, "index.faiss"))
        
        return instance
