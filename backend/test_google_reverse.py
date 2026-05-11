import os
import requests
from serpapi import GoogleSearch

API_KEY = "e4f5e3c0dea107b704a8c74a5a948b9868aa06cd0a791e4c59cc121e29920cbb"
image_url = "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"

print("--- GOOGLE REVERSE IMAGE SEARCH ---")
params = {
    "engine": "google_reverse_image",
    "image_url": image_url,
    "api_key": API_KEY
}
search = GoogleSearch(params)
res = search.get_dict()

# Google Reverse Image Search has 'image_results' and sometimes 'pages_with_matching_images'
pages = res.get("pages_with_matching_images", [])
print(f"Pages with matching images: {len(pages)}")
for p in pages[:5]:
    print(p.get("title"), p.get("link"))

image_results = res.get("image_results", [])
print(f"\nImage results: {len(image_results)}")
for r in image_results[:5]:
    print(r.get("title"), r.get("link"))
