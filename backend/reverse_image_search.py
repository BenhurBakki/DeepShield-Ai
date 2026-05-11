"""
reverse_image_search.py
-----------------------
Uses SerpApi's Google Lens engine to find websites where a given image
is appearing. Multi-provider hosting fallback for AWS reliability.
"""

import os
import tempfile
import requests
import time
from typing import List, Dict, Optional

# ─── Hosting Providers ────────────────────────────────────────────────────────

def _upload_to_catbox(image_bytes: bytes) -> Optional[str]:
    try:
        url = "https://catbox.moe/user/api.php"
        files = {"fileToUpload": ("image.jpg", image_bytes, "image/jpeg")}
        data = {"reqtype": "fileupload"}
        resp = requests.post(url, files=files, data=data, timeout=10)
        if resp.status_code == 200: return resp.text.strip()
    except: pass
    return None

def _upload_to_tmpfiles(image_bytes: bytes) -> Optional[str]:
    try:
        url = "https://tmpfiles.org/api/v1/upload"
        files = {"file": ("image.jpg", image_bytes, "image/jpeg")}
        resp = requests.post(url, files=files, timeout=10)
        if resp.status_code == 200:
            data = resp.json()
            # Convert the view URL to a direct download URL
            # https://tmpfiles.org/12345/image.jpg -> https://tmpfiles.org/dl/12345/image.jpg
            view_url = data["data"]["url"]
            return view_url.replace("tmpfiles.org/", "tmpfiles.org/dl/")
    except: pass
    return None

def _resolve_public_url(image_bytes: bytes) -> Optional[str]:
    # 1. Try TmpFiles (very AWS friendly)
    url = _upload_to_tmpfiles(image_bytes)
    if url: return url
    
    # 2. Try Catbox (Fallback)
    url = _upload_to_catbox(image_bytes)
    if url: return url
    
    return None

# ─── Main Search Logic ──────────────────────────────────────────────────────

def find_morphed_image_sources(image_input, api_key: str = None, max_results: int = 15) -> List[Dict[str, str]]:
    if api_key is None:
        api_key = os.environ.get("SERPAPI_KEY")

    if not api_key:
        return [{"_error": True, "message": "SERPAPI_KEY missing in AWS environment. Please check EB Software Configuration."}]

    # Step 1: Upload Image
    image_url = None
    if isinstance(image_input, bytes):
        image_url = _resolve_public_url(image_input)
    elif isinstance(image_input, str):
        if image_input.startswith("http"):
            image_url = image_input
        else:
            try:
                with open(image_input, "rb") as f:
                    image_url = _resolve_public_url(f.read())
            except Exception as e:
                return [{"_error": True, "message": f"File error: {str(e)}"}]

    if not image_url:
        return [{"_error": True, "message": "Cloud upload failed (All providers blocked). Please check server outbound rules."}]

    # Step 2: SerpApi REST Call
    search_url = "https://serpapi.com/search.json"
    params = {
        "engine": "google_lens",
        "url": image_url,
        "api_key": api_key
    }

    try:
        resp = requests.get(search_url, params=params, timeout=25)
        results = resp.json()
        
        if "error" in results:
            # Handle rate limiting or invalid key
            return [{"_error": True, "message": f"SerpApi Error: {results['error']}"}]
            
        visual_matches = results.get("visual_matches", [])
        
        # Fallback to Reverse Image
        if not visual_matches:
            params["engine"] = "google_reverse_image"
            params["image_url"] = image_url
            if "url" in params: del params["url"]
            resp = requests.get(search_url, params=params, timeout=25)
            results = resp.json()
            visual_matches = results.get("image_results", [])

        if not visual_matches:
            return [] # No matches found

        output = []
        for match in visual_matches[:max_results]:
            website_name = match.get("source") or match.get("title") or "Source"
            link = match.get("link") or ""
            thumbnail = match.get("thumbnail") or ""
            if link:
                output.append({"website_name": website_name, "link": link, "thumbnail": thumbnail})
        return output

    except Exception as e:
        return [{"_error": True, "message": f"Search failed: {str(e)}"}]
