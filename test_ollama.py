import requests
import json

"""Simple sanity check for the local Ollama setup.

Uses the same small, fast model configured in the backend (phi3:mini).
Run with:  python test_ollama.py
"""

# Test Ollama API
url = "http://localhost:11434/api/chat"
payload = {
    "model": "phi3:mini",
    "messages": [
        {"role": "user", "content": "What is financial literacy?"}
    ],
    "stream": False
}

try:
    print("Testing Ollama API...")
    response = requests.post(url, json=payload, timeout=30)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print(f"\nResponse: {result.get('message', {}).get('content', 'No content')}")
        print("\n✅ Ollama is working!")
    else:
        print(f"❌ Error: {response.text}")
except Exception as e:
    print(f"❌ Error connecting to Ollama: {str(e)}")
