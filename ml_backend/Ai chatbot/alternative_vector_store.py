"""
Alternate vector store implementation that doesn't rely on sentence-transformers.
This uses scikit-learn's TfidfVectorizer which has fewer dependencies.
"""

import numpy as np
import os
import pickle
import faiss
from typing import List, Dict, Any
from sklearn.feature_extraction.text import TfidfVectorizer

class AlternativeVectorStore:
    """A vector store implementation using TF-IDF from scikit-learn."""
    
    def __init__(self):
        """Initialize the vector store with TF-IDF vectorizer."""
        self.vectorizer = TfidfVectorizer(
            lowercase=True,
            stop_words='english',
            max_features=5000,  # Limit features to avoid memory issues
            ngram_range=(1, 2)  # Use unigrams and bigrams for better context
        )
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
        
        # Create TF-IDF embeddings
        embeddings_sparse = self.vectorizer.fit_transform(texts)
        self.embeddings = embeddings_sparse.toarray().astype(np.float32)
        
        # Create FAISS index
        dimension = self.embeddings.shape[1]
        self.index = faiss.IndexFlatL2(dimension)
        self.index.add(self.embeddings)
        
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
        query_embedding = self.vectorizer.transform([query]).toarray().astype(np.float32)
        
        # Search index
        distances, indices = self.index.search(
            query_embedding, 
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
        
        # Save vectorizer and documents
        with open(os.path.join(directory, "vector_store.pkl"), "wb") as f:
            pickle.dump({
                "documents": self.documents,
                "vectorizer": self.vectorizer
            }, f)
    
    # Required to match the interface of VectorStore
    def get_sentence_embedding_dimension(self):
        """Return the embedding dimension (compatibility method)."""
        if self.embeddings is not None:
            return self.embeddings.shape[1]
        return 0
            
    @classmethod
    def load(cls, directory: str):
        """
        Load a vector store from disk.
        
        Args:
            directory: Directory where the vector store is saved
            
        Returns:
            Loaded AlternativeVectorStore instance
        """
        # Load vectorizer and documents
        with open(os.path.join(directory, "vector_store.pkl"), "rb") as f:
            data = pickle.load(f)
            
        # Create instance
        instance = cls()
        instance.documents = data["documents"]
        instance.vectorizer = data["vectorizer"]
        
        # Load the index
        instance.index = faiss.read_index(os.path.join(directory, "index.faiss"))
        
        return instance
