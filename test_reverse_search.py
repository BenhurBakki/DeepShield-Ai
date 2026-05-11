from PIL import Image, ImageDraw
import requests

# Create a proper 300x300 JPEG
img = Image.new("RGB", (300, 300), color=(255, 200, 200))
draw = ImageDraw.Draw(img)
draw.ellipse([50, 50, 250, 250], fill=(200, 100, 100))
img.save("test_real.jpg", "JPEG")

print("Created test_real.jpg")

# Now try to upload it and check if Yandex accepts it
with open("test_real.jpg", "rb") as f:
    img_bytes = f.read()

# Integration test with local Flask
print("Testing with local Flask...")
resp = requests.post(
    "http://127.0.0.1:5000/api/detect?reverse_search=true",
    files={"file": ("test_real.jpg", img_bytes, "image/jpeg")},
    timeout=120
)

print(f"Status: {resp.status_code}")
data = resp.json()
print(f"Image sources: {len(data.get('image_sources', []))} found")
if "error" in data:
    print("Error:", data["error"])

print("\n✓ Test finished.")
