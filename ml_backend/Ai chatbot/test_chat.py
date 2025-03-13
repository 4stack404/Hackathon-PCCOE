import os
import json
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
API_URL = "http://localhost:8000"
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")

def main():
    # Set API key first
    set_api_key()
    
    # Ask a question
    question = "What is your name and what can you help me with?"
    print(f"\nAsking: {question}\n")
    
    # Send request
    response = requests.post(
        f"{API_URL}/api/chat",
        json={"question": question}
    )
    
    # Display results
    if response.status_code == 200:
        data = response.json()
        # Save full response to file for inspection
        with open("response.json", "w") as f:
            json.dump(data, f, indent=2)
            
        print("=" * 80)
        print("ANSWER:")
        print("=" * 80)
        print(data.get("answer", "No answer provided"))
        print("=" * 80)
        print(f"Response saved to response.json")
    else:
        print(f"Error: {response.status_code}")
        print(response.text)

def set_api_key():
    """Set the API key."""
    if not GROQ_API_KEY:
        print("Warning: GROQ_API_KEY not found in environment or .env file")
        return False
        
    response = requests.post(
        f"{API_URL}/api/set-api-key",
        json={"api_key": GROQ_API_KEY}
    )
    
    if response.status_code == 200:
        return True
    else:
        print(f"Error setting API key: {response.status_code}")
        print(response.text)
        return False

if __name__ == "__main__":
    main()
