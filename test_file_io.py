import requests

def upload_to_file_io(image_bytes):
    url = "https://file.io"
    files = {"file": ("image.jpg", image_bytes, "image/jpeg")}
    try:
        # file.io expires the link after 1 download, which is perfect for this!
        response = requests.post(url, files=files, timeout=30)
        if response.status_code == 200:
            return response.json().get("link")
        else:
            print(f"file.io upload failed: {response.status_code} {response.text}")
            return None
    except Exception as e:
        print(f"file.io upload exception: {e}")
        return None

if __name__ == "__main__":
    img_resp = requests.get("https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/President_Barack_Obama.jpg/220px-President_Barack_Obama.jpg")
    url = upload_to_file_io(img_resp.content)
    print("Uploaded URL:", url)
