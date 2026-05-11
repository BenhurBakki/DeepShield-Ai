import requests
import re

def upload_to_tmpfiles(image_bytes):
    url = "https://tmpfiles.org/api/v1/upload"
    files = {"file": ("image.jpg", image_bytes, "image/jpeg")}
    try:
        response = requests.post(url, files=files, timeout=30)
        if response.status_code == 200:
            data = response.json()
            page_url = data.get("data", {}).get("url")
            if page_url:
                # Convert https://tmpfiles.org/XXXX to https://tmpfiles.org/dl/XXXX
                direct_url = page_url.replace("tmpfiles.org/", "tmpfiles.org/dl/")
                return direct_url
        else:
            print(f"tmpfiles upload failed: {response.status_code} {response.text}")
            return None
    except Exception as e:
        print(f"tmpfiles upload exception: {e}")
        return None

if __name__ == "__main__":
    img_resp = requests.get("https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/President_Barack_Obama.jpg/220px-President_Barack_Obama.jpg")
    url = upload_to_tmpfiles(img_resp.content)
    print("Uploaded URL:", url)
    if url:
        # Check if the URL is accessible
        head = requests.head(url)
        print("Accessibility status:", head.status_code)
