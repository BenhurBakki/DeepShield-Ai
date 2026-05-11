import os
import requests
from serpapi import GoogleSearch

API_KEY = "e4f5e3c0dea107b704a8c74a5a948b9868aa06cd0a791e4c59cc121e29920cbb"

# Provide a sample image URL
image_url = "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"

# Test Google Lens
print("--- GOOGLE LENS ---")
params = {
    "engine": "google_lens",
    "url": image_url,
    "api_key": API_KEY
}
search = GoogleSearch(params)
res = search.get_dict()
visual_matches = res.get("visual_matches", [])
for m in visual_matches[:5]:
    print(m.get("title"), m.get("link"))

# Test Yandex Images
print("\n--- YANDEX IMAGES ---")
params = {
    "engine": "yandex_images",
    "url": image_url,
    "api_key": API_KEY
}
search = GoogleSearch(params)
res = search.get_dict()
sites = res.get("sites_containing_image", [])
print(f"Sites containing image: {len(sites)}")
for m in sites[:5]:
    print(m.get("title"), m.get("link"))

similar = res.get("image_results", [])
print(f"Image results (similar): {len(similar)}")
