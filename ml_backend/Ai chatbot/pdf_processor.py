import os
from typing import List, Dict, Any
from pypdf import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter

class PDFProcessor:
    """Class to extract text from PDF files and process into chunks."""
    
    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 200):
        """
        Initialize the PDFProcessor.
        
        Args:
            chunk_size: Size of text chunks for vector embedding
            chunk_overlap: Overlap between chunks to maintain context
        """
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=self.chunk_size,
            chunk_overlap=self.chunk_overlap,
            length_function=len
        )
    
    def extract_text_from_pdf(self, pdf_path: str) -> str:
        """
        Extract text from a PDF file.
        
        Args:
            pdf_path: Path to the PDF file
            
        Returns:
            Extracted text as a string
        """
        if not os.path.exists(pdf_path):
            raise FileNotFoundError(f"PDF file not found: {pdf_path}")
            
        raw_text = ""
        pdf_reader = PdfReader(pdf_path)
        
        for page in pdf_reader.pages:
            text = page.extract_text()
            if text:
                raw_text += text + "\n"
                
        return raw_text
    
    def process_pdf(self, pdf_path: str) -> List[str]:
        """
        Process a PDF file into text chunks suitable for embedding.
        
        Args:
            pdf_path: Path to the PDF file
            
        Returns:
            List of text chunks
        """
        raw_text = self.extract_text_from_pdf(pdf_path)
        chunks = self.text_splitter.split_text(raw_text)
        return chunks
    
    def process_multiple_pdfs(self, pdf_paths: List[str]) -> List[Dict[str, Any]]:
        """
        Process multiple PDF files and create metadata for each chunk.
        
        Args:
            pdf_paths: List of paths to PDF files
            
        Returns:
            List of dictionaries containing text chunks and their metadata
        """
        all_docs = []
        
        for pdf_path in pdf_paths:
            file_name = os.path.basename(pdf_path)
            chunks = self.process_pdf(pdf_path)
            
            for i, chunk in enumerate(chunks):
                doc_info = {
                    "text": chunk,
                    "metadata": {
                        "source": file_name,
                        "chunk_id": i,
                        "file_path": pdf_path
                    }
                }
                all_docs.append(doc_info)
                
        return all_docs
