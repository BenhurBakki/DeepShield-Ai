import requests
import os

API_KEY = "e4f5e3c0dea107b704a8c74a5a948b9868aa06cd0a791e4c59cc121e29920cbb"

def debug_upload():
    # Use a REAL image from the web to upload
    img_resp = requests.get("https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/President_Barack_Obama.jpg/220px-President_Barack_Obama.jpg")
    img_data = img_resp.content
    
    url = "https://serpapi.com/images/upload"
    # Try putting API key in the multipart form data as 'api_key'
    files = {
        "image": ("obama.jpg", img_data, "image/jpeg"),
        "api_key": (None, API_KEY)
    }
    
    print(f"DEBUG: Posting REAL IMAGE to {url}")
    resp = requests.post(url, files=files)
    
    print(f"Status: {resp.status_code}")
    print(f"Body: {resp.text}")

if __name__ == "__main__":
    debug_upload()
