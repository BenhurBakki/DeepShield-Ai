"""
Local integration test for DeepShield /api/detect with reverse image search.
Uses a different source (Unsplash) to avoid DNS issues.
"""
import requests
import json
import sys

FLASK_URL = "http://127.0.0.1:5000"
IMAGE_URL = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=300&h=300"

print(f"Downloading real image for testing: {IMAGE_URL}")
try:
    img_resp = requests.get(IMAGE_URL, timeout=30)
    img_resp.raise_for_status()
    img_bytes = img_resp.content
except Exception as e:
    print(f"Failed to download image: {e}")
    sys.exit(1)

print("\n── Testing Face Trace (Reverse Search) ──")
resp = requests.post(
    f"{FLASK_URL}/api/detect?reverse_search=true",
    files={"file": ("face.jpg", img_bytes, "image/jpeg")},
    timeout=120,
)

print(f"Status: {resp.status_code}")
if resp.ok:
    data = resp.json()
    sources = data.get("image_sources", [])
    print(f"Image sources: {len(sources)} found")
    if sources:
        for s in sources[:10]:
            print(f" - {s['website_name']:<30} | {s['link'][:80]}")
    else:
        print("FAIL: No image sources found.")
        sys.exit(1)
else:
    print(f"ERROR: {resp.text}")
    sys.exit(1)

print("\n✓ SUCCESS: Results returned correctly.")
