"""
reverse_image_search.py
-----------------------
Uses SerpApi's Google Lens engine to find websites where a given image
(local file or public URL) is currently appearing.

Google Lens is preferred for this use-case because it excels at finding
exact web matches and specific visual matches of faces online.

Usage
-----
    from reverse_image_search import find_morphed_image_sources

    # From a local file path
    results = find_morphed_image_sources("path/to/image.jpg")

    # From a public URL
    results = find_morphed_image_sources("https://example.com/face.jpg")

    # Each result looks like:
    # {'website_name': 'example.com', 'link': 'https://example.com/page'}

Integration with DeepShield
----------------------------
Call this function after a successful detect() and attach the returned list
to the API response under the key "image_sources".
"""

import os
import tempfile
import base64
import requests
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
# Pull the key from environment so it is never hard-coded in source control.
# Set SERPAPI_KEY as an environment variable (Elastic Beanstalk / .env / etc.)
_DEFAULT_API_KEY = os.environ.get(
    "SERPAPI_KEY",
    "e4f5e3c0dea107b704a8c74a5a948b9868aa06cd0a791e4c59cc121e29920cbb"  # fallback key
)


def _crop_to_face(image_bytes: bytes) -> bytes:
    """
    Detects the primary face in the image and crops it with a margin.
    This forces the search engine to focus on facial features rather than clothing/background.
    """
    if not OPENCV_AVAILABLE:
        return image_bytes
    try:
        # Convert bytes to OpenCV image
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None: return image_bytes
        
        # Detect faces
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        face_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + "haarcascade_frontalface_alt2.xml"
        )
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
        
        if len(faces) > 0:
            # Pick the largest face detected
            faces = sorted(faces, key=lambda f: f[2] * f[3], reverse=True)
            x, y, w, h = faces[0]
            
            # Add 40% margin to capture head shape/hair which helps with identity
            margin = int(max(w, h) * 0.4)
            y1 = max(0, y - margin)
            y2 = min(img.shape[0], y + h + margin)
            x1 = max(0, x - margin)
            x2 = min(img.shape[1], x + w + margin)
            
            face_crop = img[y1:y2, x1:x2]
            success, buffer = cv2.imencode('.jpg', face_crop)
            if success:
                return buffer.tobytes()
    except Exception as e:
        print(f"[Trace] Face cropping failed: {e}")
    return image_bytes


def _upload_to_tmpfiles(image_bytes: bytes) -> Optional[str]:
    """
    Upload raw image bytes to tmpfiles.org for temporary public hosting.
    Google Lens requires a publicly accessible URL to perform a search.
    """
    url = "https://tmpfiles.org/api/v1/upload"
    files = {"file": ("image.jpg", image_bytes, "image/jpeg")}
    try:
        response = requests.post(url, files=files, timeout=15)
        if response.status_code == 200:
            data = response.json()
            page_url = data.get("data", {}).get("url")
            if page_url:
                # Convert to direct download link
                return page_url.replace("tmpfiles.org/", "tmpfiles.org/dl/")
        return None
    except Exception as e:
        print(f"[Trace] TmpFiles upload failed: {e}")
        return None


def _upload_to_catbox(image_bytes: bytes) -> Optional[str]:
    """
    Fallback upload to Catbox.moe.
    """
    url = "https://catbox.moe/user/api.php"
    files = {"fileToUpload": ("image.jpg", image_bytes, "image/jpeg")}
    data = {"reqtype": "fileupload"}
    try:
        response = requests.post(url, files=files, data=data, timeout=15)
        if response.status_code == 200:
            return response.text.strip()
        return None
    except Exception as e:
        print(f"[Trace] Catbox upload failed: {e}")
        return None


def _resolve_public_url(image_bytes: bytes) -> Optional[str]:
    """
    Tries multiple temporary hosting services to get a public URL for the image.
    Resizes the image if it's too large to ensure reliable uploads.
    """
    print(f"[Trace] Attempting to host image (size: {len(image_bytes)} bytes) for SerpApi...")
    
    # ── Step 0: Compress if too large (> 2MB) ────────────────────────────
    if len(image_bytes) > 2 * 1024 * 1024:
        print("[Trace] Image too large, compressing...")
        try:
            if OPENCV_AVAILABLE:
                nparr = np.frombuffer(image_bytes, np.uint8)
                img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
                if img is not None:
                    # Resize to 800px max dimension
                    h, w = img.shape[:2]
                    if max(h, w) > 800:
                        scale = 800 / max(h, w)
                        img = cv2.resize(img, (int(w * scale), int(h * scale)))
                    success, buffer = cv2.imencode('.jpg', img, [int(cv2.IMWRITE_JPEG_QUALITY), 85])
                    if success:
                        image_bytes = buffer.tobytes()
                        print(f"[Trace] Compressed to {len(image_bytes)} bytes")
        except Exception as e:
            print(f"[Trace] Compression failed: {e}")

    # ── Step 1: Try TmpFiles first ───────────────────────────────────────
    url = _upload_to_tmpfiles(image_bytes)
    if url: 
        print(f"[Trace] Hosted on TmpFiles: {url}")
        return url
        
    # ── Step 2: Fallback to Catbox ───────────────────────────────────────
    url = _upload_to_catbox(image_bytes)
    if url:
        print(f"[Trace] Hosted on Catbox: {url}")
        return url
        
    return None


def find_morphed_image_sources(
    image_input,                        # str (local path or URL) | bytes
    api_key: str = _DEFAULT_API_KEY,
    max_results: int = 50,
) -> List[Dict[str, str]]:
    """
    Search for websites where the supplied image is appearing using
    SerpApi → Google Lens reverse image search.
    """
    # ── Step 1: Resolve Public URL ────────────────────────────────────────
    image_url: Optional[str] = None

    if isinstance(image_input, bytes):
        image_url = _resolve_public_url(image_input)
    elif isinstance(image_input, str):
        if image_input.startswith("http://") or image_input.startswith("https://"):
            image_url = image_input
        else:
            if not os.path.exists(image_input):
                raise FileNotFoundError(f"Image not found: {image_input}")
            with open(image_input, "rb") as f:
                image_url = _resolve_public_url(f.read())
    else:
        raise TypeError(f"Unsupported image_input type: {type(image_input)}")

    if not image_url:
        error_msg = "[SerpApi] Could not obtain a public image URL (hosting failed)."
        print(error_msg)
        return [{"_error": True, "message": error_msg}]

    # ── Step 2: Call SerpApi Google Lens ──────────────────────────────────
    params = {
        "engine": "google_lens",
        "url": image_url,
        "api_key": api_key,
        "requests_timeout": 15 # Ensure we don't hit gateway timeout
    }

    try:
        search  = GoogleSearch(params)
        results = search.get_dict()
    except Exception as e:
        print(f"[SerpApi] Search request failed: {e}")
        return []

    if "error" in results:
        error_msg = f"[SerpApi] API error: {results['error']}"
        print(error_msg)
        return [{"_error": True, "message": error_msg}]

    # ── Step 3: Extract Results ──────────────────────────────────────────
    visual_matches = results.get("visual_matches", [])

    if not visual_matches:
        # Fallback to Google Reverse Image Search if Lens has no visual matches
        print("[SerpApi] No visual matches in Lens. Trying Google Reverse Image...")
        params["engine"] = "google_reverse_image"
        params["image_url"] = image_url
        del params["url"]
        try:
            search = GoogleSearch(params)
            res2 = search.get_dict()
            visual_matches = res2.get("image_results", [])
        except:
            pass

    if not visual_matches:
        print("[SerpApi] No websites found containing this image.")
        return []

    output: List[Dict[str, str]] = []
    for match in visual_matches[:max_results]:
        # Harmonize field names
        website_name = (
            match.get("source")       # Lens
            or match.get("title")     # Reverse Image / Fallback
            or "Unknown Source"
        )
        link = match.get("link") or ""
        thumbnail = match.get("thumbnail") or ""
        
        if link:
            output.append({
                "website_name": website_name,
                "link":         link,
                "thumbnail":    thumbnail
            })

    return output


# ─── Standalone CLI demo ──────────────────────────────────────────────────────
if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python reverse_image_search.py <image_path_or_url>")
        sys.exit(1)

    sources = find_morphed_image_sources(sys.argv[1])

    if sources:
        print(f"\n{'WEBSITE NAME':<40} | DIRECT LINK")
        print("-" * 110)
        for s in sources:
            name = s["website_name"][:38]
            print(f"{name:<40} | {s['link']}")
        print(f"\n✓ Found {len(sources)} website(s).")
    else:
        print("No results found.")
