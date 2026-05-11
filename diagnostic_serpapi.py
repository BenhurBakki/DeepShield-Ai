from serpapi import GoogleSearch

API_KEY = "e4f5e3c0dea107b704a8c74a5a948b9868aa06cd0a791e4c59cc121e29920cbb"

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
