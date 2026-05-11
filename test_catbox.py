import requests

def upload_to_catbox(image_bytes):
    url = "https://catbox.moe/user/api.php"
    data = {
        "reqtype": "fileupload",
    }
    files = {
        "fileToUpload": ("image.jpg", image_bytes, "image/jpeg")
    }
    try:
        response = requests.post(url, data=data, files=files, timeout=30)
        if response.status_code == 200:
            return response.text.strip()
        else:
            print(f"Catbox upload failed: {response.status_code} {response.text}")
            return None
    except Exception as e:
        print(f"Catbox upload exception: {e}")
        return None

if __name__ == "__main__":
    # Test upload
    test_data = b"GIF89a\x01\x00\x01\x00\x80\x00\x00\xff\xff\xff\x00\x00\x00!\xf9\x04\x01\x00\x00\x00\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;"
    url = upload_to_catbox(test_data)
    print("Uploaded URL:", url)
