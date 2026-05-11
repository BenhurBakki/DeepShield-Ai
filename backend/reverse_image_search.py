"""
reverse_image_search.py
-----------------------
Uses SerpApi's Google Lens engine to find websites where a given image
(local file or public URL) is currently appearing.

Google Lens is preferred for this use-case because it excels at finding
exact web matches and specific visual matches of faces online.
"""

import os
import tempfile
import base64
import requests
import time
import hashlib
from typing import List, Dict, Optional

try:
    from serpapi import GoogleSearch
    SERPAPI_AVAILABLE = True
except ImportError:
    SERPAPI_AVAILABLE = False

try:
    import cv2
    import numpy as np
    OPENCV_AVAILABLE = True
except ImportError:
    OPENCV_AVAILABLE = False

# ─── Configuration ────────────────────────────────────────────────────────────
_DEFAULT_API_KEY = os.environ.get("SERPAPI_KEY")


def _crop_to_face(image_bytes: bytes) -> bytes:
    if not OPENCV_AVAILABLE: return image_bytes
    try:
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None: return image_bytes
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_alt2.xml")
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
        if len(faces) > 0:
            faces = sorted(faces, key=lambda f: f[2] * f[3], reverse=True)
            x, y, w, h = faces[0]
            margin = int(max(w, h) * 0.4)
            y1 = max(0, y - margin); y2 = min(img.shape[0], y + h + margin)
            x1 = max(0, x - margin); x2 = min(img.shape[1], x + w + margin)
            face_crop = img[y1:y2, x1:x2]
            success, buffer = cv2.imencode('.jpg', face_crop)
            if success: return buffer.tobytes()
    except Exception as e:
        print(f"[Trace] Face cropping failed: {e}")
    return image_bytes


def _upload_to_catbox(image_bytes: bytes) -> Optional[str]:
    """Upload to Catbox (very reliable)"""
    try:
        url = "https://catbox.moe/user/api.php"
        with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tmp:
            tmp.write(image_bytes)
            tmp_path = tmp.name
        
        files = {"fileToUpload": open(tmp_path, "rb")}
        data = {"reqtype": "fileupload"}
        response = requests.post(url, files=files, data=data, timeout=15)
        os.remove(tmp_path)
        
        if response.status_code == 200:
            return response.text.strip()
    except Exception as e:
        print(f"[Trace] Catbox upload failed: {e}")
    return None


def _resolve_public_url(image_bytes: bytes) -> Optional[str]:
    # 1. Try Catbox (most reliable for Yandex/Google)
    url = _upload_to_catbox(image_bytes)
    if url: return url
    return None


def find_morphed_image_sources(image_input, api_key: str = None, max_results: int = 15) -> List[Dict[str, str]]:
    if not SERPAPI_AVAILABLE:
        return [{"_error": True, "message": "SerpApi library not installed"}]
    
    if api_key is None:
        api_key = os.environ.get("SERPAPI_KEY")

    if not api_key:
        return [{"_error": True, "message": "SERPAPI_KEY missing in environment"}]

    # ── Step 1: Resolve Image to Public URL ──────────────────────────────
    image_url = None
    if isinstance(image_input, bytes):
        image_url = _resolve_public_url(image_input)
    elif isinstance(image_input, str):
        if image_input.startswith("http"):
            image_url = image_input
        else:
            with open(image_input, "rb") as f:
                image_url = _resolve_public_url(f.read())

    if not image_url:
        return [{"_error": True, "message": "Cloud upload failed — cannot perform search"}]

    # ── Step 2: Call SerpApi Google Lens ──────────────────────────────────
    params = {
        "engine": "google_lens",
        "url": image_url,
        "api_key": api_key,
        "requests_timeout": 20
    }

    try:
        search = GoogleSearch(params)
        results = search.get_dict()
        if "error" in results:
            return [{"_error": True, "message": f"SerpApi Error: {results['error']}"}]
            
        visual_matches = results.get("visual_matches", [])
        
        # Fallback to Reverse Image Search
        if not visual_matches:
            params["engine"] = "google_reverse_image"
            params["image_url"] = image_url
            del params["url"]
            search = GoogleSearch(params)
            res2 = search.get_dict()
            visual_matches = res2.get("image_results", [])

        if not visual_matches:
            return [] # Truly no results found

        output = []
        for match in visual_matches[:max_results]:
            website_name = match.get("source") or match.get("title") or "Unknown"
            link = match.get("link") or ""
            thumbnail = match.get("thumbnail") or ""
            if link:
                output.append({"website_name": website_name, "link": link, "thumbnail": thumbnail})
        return output

    except Exception as e:
        return [{"_error": True, "message": f"Search failed: {str(e)}"}]
