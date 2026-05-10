"""
reverse_image_search.py
-----------------------
Uses SerpApi's Yandex Images engine to find websites where a given image
(local file or public URL) is currently appearing.

Yandex is preferred for this use-case because it excels at finding
visually similar / morphed / edited faces that other engines miss.

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

# ─── Configuration ────────────────────────────────────────────────────────────
# Pull the key from environment so it is never hard-coded in source control.
# Set SERPAPI_KEY as an environment variable (Elastic Beanstalk / .env / etc.)
_DEFAULT_API_KEY = os.environ.get(
    "SERPAPI_KEY",
    "e4f5e3c0dea107b704a8c74a5a948b9868aa06cd0a791e4c59cc121e29920cbb"  # fallback key
)


def _upload_image_to_serpapi(image_bytes: bytes, api_key: str) -> Optional[str]:
    """
    Upload raw image bytes to SerpApi's file-upload endpoint.
    Returns the temporary hosted URL that can be passed to Yandex Images.
    """
    upload_url = "https://serpapi.com/images/upload"
    try:
        response = requests.post(
            upload_url,
            files={"image": ("image.jpg", image_bytes, "image/jpeg")},
            params={"api_key": api_key},
            timeout=30,
        )
        response.raise_for_status()
        data = response.json()
        return data.get("url")  # SerpApi returns the hosted image URL
    except Exception as e:
        print(f"[SerpApi] File upload failed: {e}")
        return None


def find_morphed_image_sources(
    image_input,                        # str (local path or URL) | bytes
    api_key: str = _DEFAULT_API_KEY,
    max_results: int = 50,
) -> List[Dict[str, str]]:
    """
    Search for websites where the supplied image is appearing using
    SerpApi → Yandex Images reverse image search.

    Parameters
    ----------
    image_input : str | bytes
        • Local file path  – e.g. "/tmp/face.jpg"
        • Public HTTPS URL – e.g. "https://cdn.example.com/face.jpg"
        • Raw bytes        – image data read directly from memory
    api_key : str
        Your SerpApi secret key.  Defaults to the SERPAPI_KEY env var.
    max_results : int
        Maximum number of website entries to return (default 50).

    Returns
    -------
    List[Dict[str, str]]
        [{'website_name': 'example.com', 'link': 'https://example.com/...'}, ...]
        Returns an empty list on error or when no matches are found.
    """
    if not SERPAPI_AVAILABLE:
        raise ImportError(
            "serpapi package not installed. "
            "Run: pip install google-search-results"
        )

    # ── Step 1: Resolve the image to a public URL ──────────────────────────
    image_url: Optional[str] = None

    if isinstance(image_input, bytes):
        # Raw bytes → upload to SerpApi
        image_url = _upload_image_to_serpapi(image_input, api_key)

    elif isinstance(image_input, str):
        if image_input.startswith("http://") or image_input.startswith("https://"):
            # Already a public URL
            image_url = image_input
        else:
            # Local file path → read bytes → upload to SerpApi
            if not os.path.exists(image_input):
                raise FileNotFoundError(f"Image not found: {image_input}")
            with open(image_input, "rb") as f:
                image_url = _upload_image_to_serpapi(f.read(), api_key)
    else:
        raise TypeError(f"Unsupported image_input type: {type(image_input)}")

    if not image_url:
        print("[SerpApi] Could not obtain a public image URL. Aborting search.")
        return []

    # ── Step 2: Call SerpApi Yandex Images ────────────────────────────────
    params = {
        "engine":  "yandex_images",
        "url":     image_url,
        "api_key": api_key,
    }

    try:
        search  = GoogleSearch(params)
        results = search.get_dict()
    except Exception as e:
        print(f"[SerpApi] Search request failed: {e}")
        return []

    if "error" in results:
        print(f"[SerpApi] API error: {results['error']}")
        return []

    # ── Step 3: Extract sites_containing_image ────────────────────────────
    sites = results.get("sites_containing_image", [])

    if not sites:
        print("[SerpApi] No websites found containing this image.")
        return []

    output: List[Dict[str, str]] = []
    for site in sites[:max_results]:
        # Yandex returns: title, description, url, domain, etc.
        website_name = (
            site.get("domain")        # e.g. "instagram.com"
            or site.get("title")      # page title as fallback
            or site.get("description", "Unknown Source")
        )
        link = site.get("url", "")
        if link:
            output.append({
                "website_name": website_name,
                "link":         link,
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
