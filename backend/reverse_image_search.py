"""
reverse_image_search.py
-----------------------
Uses SerpApi's Google Lens engine to find websites where a given image
is appearing. Rewritten to use vanilla 'requests' for maximum compatibility.
"""

import os
import tempfile
import requests
import time
from typing import List, Dict, Optional

# ─── Configuration ────────────────────────────────────────────────────────────
# API module is now 'requests' based to avoid library installation issues.

def _upload_to_catbox(image_bytes: bytes) -> Optional[str]:
    """Upload to Catbox (very reliable for search engines)"""
    try:
        url = "https://catbox.moe/user/api.php"
        # We use a temporary file because Catbox expects a file stream
        with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tmp:
            tmp.write(image_bytes)
            tmp_path = tmp.name
        
        with open(tmp_path, "rb") as f:
            files = {"fileToUpload": f}
            data = {"reqtype": "fileupload"}
            response = requests.post(url, files=files, data=data, timeout=15)
        
        os.remove(tmp_path)
        if response.status_code == 200:
            return response.text.strip()
    except Exception as e:
        print(f"[Trace] Catbox upload failed: {e}")
    return None


def find_morphed_image_sources(image_input, api_key: str = None, max_results: int = 15) -> List[Dict[str, str]]:
    """
    Performs a reverse image search using SerpApi via direct REST calls.
    """
    if api_key is None:
        api_key = os.environ.get("SERPAPI_KEY")

    if not api_key:
        return [{"_error": True, "message": "SERPAPI_KEY missing in AWS environment. Please add it to EB Configuration."}]

    # ── Step 1: Resolve Image to Public URL ──────────────────────────────
    image_url = None
    try:
        if isinstance(image_input, bytes):
            image_url = _upload_to_catbox(image_input)
        elif isinstance(image_input, str):
            if image_input.startswith("http"):
                image_url = image_input
            else:
                with open(image_input, "rb") as f:
                    image_url = _upload_to_catbox(f.read())
    except Exception as e:
        return [{"_error": True, "message": f"File handling error: {str(e)}"}]

    if not image_url:
        return [{"_error": True, "message": "Cloud upload failed — could not host image for search."}]

    # ── Step 2: Call SerpApi REST API (Google Lens) ──────────────────────────
    # We use direct requests.get to avoid dependency on the 'google-search-results' library
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
            return [{"_error": True, "message": f"SerpApi Error: {results['error']}"}]
            
        visual_matches = results.get("visual_matches", [])
        
        # Fallback to Reverse Image Search if Lens is empty
        if not visual_matches:
            params["engine"] = "google_reverse_image"
            params["image_url"] = image_url
            if "url" in params: del params["url"]
            resp = requests.get(search_url, params=params, timeout=25)
            results = resp.json()
            visual_matches = results.get("image_results", [])

        if not visual_matches:
            return [] # Success, but no results

        output = []
        for match in visual_matches[:max_results]:
            website_name = match.get("source") or match.get("title") or "Unknown Website"
            link = match.get("link") or ""
            thumbnail = match.get("thumbnail") or ""
            if link:
                output.append({
                    "website_name": website_name,
                    "link": link,
                    "thumbnail": thumbnail
                })
        return output

    except Exception as e:
        return [{"_error": True, "message": f"HTTP Search failed: {str(e)}"}]
