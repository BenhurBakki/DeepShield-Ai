import os
from serpapi import GoogleSearch
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("SERPAPI_KEY")

def test_key():
    params = {
        "q": "Coffee",
        "location": "Austin, Texas, United States",
        "hl": "en",
        "gl": "us",
        "google_domain": "google.com",
        "api_key": API_KEY
    }

    print("Testing API Key with basic Google Search...")
    search = GoogleSearch(params)
    results = search.get_dict()
    
    if "error" in results:
        print("ERROR:", results["error"])
    else:
        print("SUCCESS! Key is working. Found results:", len(results.get("organic_results", [])))

if __name__ == "__main__":
    test_key()
