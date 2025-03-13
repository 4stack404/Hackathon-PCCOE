"""
Test script for the RAG Chatbot API
"""

import requests
import os
import time
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Set the API base URL
BASE_URL = "http://localhost:8000"

def test_health():
    """Test the health endpoint."""
    try:
        response = requests.get(f"{BASE_URL}/api/health")
        data = response.json()
        print(f"Health check: {data}")
        return data
    except Exception as e:
        print(f"Error in health check: {str(e)}")
        return {"status": "error", "error": str(e)}

def set_api_key():
    """Set the API key from environment variables."""
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY environment variable not set")
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/set-api-key",
            json={"api_key": api_key}
        )
        data = response.json()
        print(f"Set API key: {data}")
        return data
    except Exception as e:
        print(f"Error setting API key: {str(e)}")
        return {"status": "error", "error": str(e)}

def process_knowledge_base(force_reprocess=False):
    """Process the knowledge base."""
    try:
        response = requests.post(
            f"{BASE_URL}/api/process-knowledge-base",
            params={"force_reprocess": force_reprocess}
        )
        data = response.json()
        print(f"Process knowledge base: {data}")
        return data
    except Exception as e:
        print(f"Error processing knowledge base: {str(e)}")
        if hasattr(response, 'text'):
            print(f"Response text: {response.text}")
        return {"status": "error", "error": str(e)}

def get_knowledge_bases():
    """Get the list of knowledge bases."""
    try:
        response = requests.get(f"{BASE_URL}/api/knowledge-bases")
        data = response.json()
        print(f"Knowledge bases: {data}")
        return data
    except Exception as e:
        print(f"Error getting knowledge bases: {str(e)}")
        return {"status": "error", "error": str(e)}

def chat(question):
    """Send a chat request to the API."""
    response = requests.post(
        f"{BASE_URL}/api/chat",
        json={"question": question}
    )
    
    if response.status_code == 200:
        print("\nChat Response:")
        result = response.json()
        print("-" * 80)
        print(f"Answer: {result.get('answer', 'No answer provided')}")
        print("-" * 80)
        print(f"Sources: {len(result.get('sources', []))} documents used")
        print(f"Tokens: {result.get('token_count', 'Unknown')} total tokens")
        return result
    else:
        print(f"Error: {response.status_code}")
        print(response.text)
        return None

def health_check():
    """Test the health endpoint."""
    try:
        response = requests.get(f"{BASE_URL}/api/health")
        data = response.json()
        print(f"Health check: {data}")
        return data
    except Exception as e:
        print(f"Error in health check: {str(e)}")
        return {"status": "error", "error": str(e)}

def main():
    """Main test function."""
    # Set up
    print("Setting up test...")
    time.sleep(1)
    
    # Test the API
    print("Testing health check...")
    health = health_check()
    print(f"Health check result: {json.dumps(health, indent=2)}")
    
    # Run specific test
    print("\nRunning simple test...")
    simple_test()

def simple_test():
    """Run a simpler test with just one question."""
    # Set API key
    set_api_key()
    
    # Just ask one question to test
    question = "whats your name and what can you do?"
    print(f"\nTesting with question: '{question}'")
    
    # Make the request directly
    response = requests.post(
        f"{BASE_URL}/api/chat",
        json={"question": question}
    )
    
    # Print the response
    if response.status_code == 200:
        data = response.json()
        print("\n" + "-" * 80)
        print("CHATBOT RESPONSE:")
        print("-" * 80)
        print(data.get('answer', 'No answer'))
        print("-" * 80)
        print(f"Sources used: {len(data.get('sources', []))}")
    else:
        print(f"Error: {response.status_code}")
        print(response.text)

if __name__ == "__main__":
    main()
