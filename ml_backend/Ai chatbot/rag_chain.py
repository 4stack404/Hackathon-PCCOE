import os
from typing import List, Dict, Any
from langchain.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq
from langchain.schema.runnable import RunnablePassthrough
from langchain.schema.output_parser import StrOutputParser
from chatbot_config import (
    get_system_prompt,
    CHATBOT_NAME,
    CHATBOT_VERSION,
    CITATION_FORMAT,
    NO_INFORMATION_RESPONSE,
    ERROR_RESPONSE
)

class RAGChain:
    """Implements the RAG (Retrieval-Augmented Generation) chain using Groq LLM."""
    
    def __init__(
        self, 
        model_name: str = "llama3-70b-8192",
        api_key: str = None,
        temperature: float = 0.2
    ):
        """
        Initialize the RAG chain with a Groq LLM.
        
        Args:
            model_name: Name of the Groq model to use
            api_key: Groq API key
            temperature: Temperature for generation
        """
        if api_key is None:
            api_key = os.environ.get("GROQ_API_KEY")
            if not api_key:
                raise ValueError(
                    "Groq API key not provided. Please provide it as an argument "
                    "or set the GROQ_API_KEY environment variable."
                )
        
        # Initialize the Groq LLM
        self.llm = ChatGroq(
            model_name=model_name,
            groq_api_key=api_key,
            temperature=temperature
        )
        
        # The prompt template is now imported from chatbot_config.py
        # and applied dynamically in the answer_question method
    
    def format_context(self, relevant_docs: List[Dict[str, Any]]) -> str:
        """
        Format the retrieved documents into a context string with proper citations.
        
        Args:
            relevant_docs: List of retrieved documents
            
        Returns:
            Formatted context string
        """
        if not relevant_docs:
            return "No relevant information found in the documents."
            
        context_parts = []
        
        for i, doc in enumerate(relevant_docs):
            source = doc["metadata"].get("source", "Unknown")
            page = doc["metadata"].get("page", "N/A")
            text = doc["text"]
            
            citation = CITATION_FORMAT.format(
                document_name=os.path.basename(source),
                page_number=page
            )
            
            context_parts.append(f"EXCERPT {i+1} {citation}\n{text}\n")
            
        return "\n".join(context_parts)
    
    def answer_question(self, question: str, relevant_docs: List[Dict[str, Any]]) -> str:
        """
        Answer a question based on the retrieved documents using the configured chatbot personality.
        
        Args:
            question: User question
            relevant_docs: List of retrieved documents
            
        Returns:
            Answer from the LLM
        """
        try:
            if not relevant_docs:
                return NO_INFORMATION_RESPONSE
                
            # Format the context from relevant documents
            context = self.format_context(relevant_docs)
            
            # Get the complete prompt using the chatbot configuration
            system_prompt = get_system_prompt(context, question)
            
            # Create a prompt template for this specific query
            prompt = ChatPromptTemplate.from_template(system_prompt)
            
            # Create the chain and invoke it
            chain = prompt | self.llm | StrOutputParser()
            return chain.invoke({})
            
        except Exception as e:
            print(f"Error in RAG chain: {str(e)}")
            return ERROR_RESPONSE
    
    def change_model(self, model_name: str):
        """
        Change the Groq model being used.
        
        Args:
            model_name: Name of the new Groq model to use
        """
        self.llm.model_name = model_name
        
    @property
    def chatbot_info(self):
        """
        Return information about the chatbot.
        
        Returns:
            Dict with chatbot information
        """
        return {
            "name": CHATBOT_NAME,
            "version": CHATBOT_VERSION,
            "model": self.llm.model_name
        }
