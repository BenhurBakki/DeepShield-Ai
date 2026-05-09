from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta, timezone
import os
import base64
import io
import time
import random
import jwt
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash
import os
import base64
import io
import time
import random

# ─── Optional: load real model if available ───────────────────────────────────
try:
    import torch
    import torchvision.transforms as transforms
    from PIL import Image
    import torchvision.models as models
    import torch.nn as nn

    def create_model(use_hidden_layer=True, dropout=0.5):
        model = models.resnet18(pretrained=False)
        in_features = model.fc.in_features
        if use_hidden_layer:
            model.fc = nn.Sequential(
                nn.Dropout(dropout),
                nn.Linear(in_features, in_features // 2),
                nn.ReLU(),
                nn.BatchNorm1d(in_features // 2),
                nn.Dropout(dropout),
                nn.Linear(in_features // 2, 2)
            )
        else:
            model.fc = nn.Sequential(
                nn.Dropout(dropout),
                nn.Linear(in_features, 2)
            )
        return model

    MODEL_PATH = os.environ.get("MODEL_PATH", "model.pth")
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    if os.path.exists(MODEL_PATH):
        model = create_model()
        model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
        model.eval()
        MODEL_LOADED = True
        print(f"[INFO] Model loaded from {MODEL_PATH}")
    else:
        MODEL_LOADED = False
        print("[WARN] No model file found — running in demo mode")

    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406],
                             [0.229, 0.224, 0.225])
    ])
    TORCH_AVAILABLE = True

except ImportError:
    TORCH_AVAILABLE = False
    MODEL_LOADED = False
    print("[WARN] PyTorch not installed — running in demo mode")

# ─── Optional: face detection ─────────────────────────────────────────────────
try:
    import cv2
    OPENCV_AVAILABLE = True
except ImportError:
    OPENCV_AVAILABLE = False

# ─── App setup ────────────────────────────────────────────────────────────────
app = Flask(__name__)
CORS(app)

# ─── Database Setup ───────────────────────────────────────────────────────────
# Use SQLite by default if no DATABASE_URL is provided, else use PostgreSQL
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///deepverify.db')
if app.config['SQLALCHEMY_DATABASE_URI'].startswith("postgres://"):
    app.config['SQLALCHEMY_DATABASE_URI'] = app.config['SQLALCHEMY_DATABASE_URI'].replace("postgres://", "postgresql://", 1)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'deepshield-super-secret-key-minimum-32-bytes-long')

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "created_at": self.created_at.isoformat()
        }

class ScanHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=True)
    deepfake_probability = db.Column(db.Float, nullable=False)
    real_probability = db.Column(db.Float, nullable=False)
    verdict = db.Column(db.String(50), nullable=False)
    faces_detected = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "id": self.id,
            "filename": self.filename,
            "deepfake_probability": self.deepfake_probability,
            "real_probability": self.real_probability,
            "verdict": self.verdict,
            "faces_detected": self.faces_detected,
            "created_at": self.created_at.isoformat()
        }

with app.app_context():
    db.create_all()

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def detect_faces_opencv(image_bytes):
    """Returns bounding boxes of faces found."""
    if not OPENCV_AVAILABLE:
        return []
    try:
        import numpy as np
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        face_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + "haarcascade_frontalface_alt2.xml"
        )
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
        return [{"x": int(x), "y": int(y), "w": int(w), "h": int(h)}
                for (x, y, w, h) in faces]
    except ImportError:
        return []


def run_model(image_bytes):
    """Run the ResNet18 model on image bytes, return (real_prob, fake_prob)."""
    if not TORCH_AVAILABLE or not MODEL_LOADED:
        # Demo mode: return simulated values (deterministic based on image hash)
        import hashlib
        h = hashlib.md5(image_bytes).hexdigest()
        random.seed(int(h[:8], 16))
        fake_prob = round(random.uniform(0.1, 0.95), 4)
        random.seed() # reset seed
        return round(1 - fake_prob, 4), fake_prob

    from PIL import Image
    import numpy as np

    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    
    # Try to crop face using OpenCV before inference
    if OPENCV_AVAILABLE:
        import cv2
        nparr = np.frombuffer(image_bytes, np.uint8)
        cv_img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if cv_img is not None:
            gray = cv2.cvtColor(cv_img, cv2.COLOR_BGR2GRAY)
            face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_alt2.xml")
            faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
            
            if len(faces) > 0:
                x, y, w, h = faces[0]
                # Increase bounding box slightly to capture full head like dlib
                margin = int(max(w, h) * 0.2)
                y1 = max(0, y - margin)
                y2 = min(cv_img.shape[0], y + h + margin)
                x1 = max(0, x - margin)
                x2 = min(cv_img.shape[1], x + w + margin)
                cropped_face = cv_img[y1:y2, x1:x2]
                cropped_face = cv2.cvtColor(cropped_face, cv2.COLOR_BGR2RGB)
                img = Image.fromarray(cropped_face)

    tensor = transform(img).unsqueeze(0).to(device)
    with torch.no_grad():
        logits = model(tensor)
        probs = torch.softmax(logits, dim=1).squeeze().tolist()
    
    # Ensure probs is a list even if batch size changes somehow
    if not isinstance(probs, list):
        probs = [probs]

    # PyTorch ImageFolder sorts alphabetically: 0 = Fake/Deepfake, 1 = Real
    # Therefore, probs[0] is fake, probs[1] is real
    fake_prob = probs[0]
    real_prob = probs[1]
    
    return round(real_prob, 4), round(fake_prob, 4)


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(" ")[1]
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.get(data['user_id'])
        except Exception as e:
            return jsonify({'message': 'Token is invalid!'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Missing required fields'}), 400
    
    if User.query.filter_by(email=data['email']).first() or User.query.filter_by(username=data['username']).first():
        return jsonify({'message': 'User already exists'}), 409
        
    hashed_password = generate_password_hash(data['password'])
    new_user = User(username=data['username'], email=data['email'], password_hash=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({'message': 'User created successfully'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Missing email or password'}), 400
        
    user = User.query.filter_by(email=data['email']).first()
    if not user or not check_password_hash(user.password_hash, data['password']):
        return jsonify({'message': 'Invalid credentials'}), 401
        
    token = jwt.encode({
        'user_id': user.id,
        'exp': datetime.now(timezone.utc) + timedelta(days=7)
    }, app.config['SECRET_KEY'], algorithm="HS256")
    
    return jsonify({
        'token': token,
        'user': user.to_dict()
    }), 200

@app.route("/", methods=["GET"])
def root():
    return jsonify({"status": "ok", "service": "DeepShield AI Backend"}), 200

@app.route("/api/health", methods=["GET"])

def health():
    return jsonify({
        "status": "ok",
        "model_loaded": MODEL_LOADED,
        "torch_available": TORCH_AVAILABLE,
        "opencv_available": OPENCV_AVAILABLE,
        "demo_mode": not MODEL_LOADED
    })


@app.route("/api/detect", methods=["POST"])
def detect():
    """
    Accept an image (multipart OR base64 JSON) and return:
      - deepfake_probability  (0–1)
      - real_probability      (0–1)
      - verdict               (real | deepfake | uncertain)
      - faces_detected        (int)
      - face_boxes            (list of {x,y,w,h})
      - demo_mode             (bool)
    """
    start = time.time()

    image_bytes = None

    # Multipart upload
    if "file" in request.files:
        f = request.files["file"]
        image_bytes = f.read()

    # Base64 JSON
    elif request.is_json:
        data = request.get_json()
        b64 = data.get("image", "")
        if "," in b64:
            b64 = b64.split(",")[1]
        image_bytes = base64.b64decode(b64)

    if not image_bytes:
        return jsonify({"error": "No image provided"}), 400

    # Face detection
    face_boxes = detect_faces_opencv(image_bytes)
    faces_detected = len(face_boxes)

    # Model inference
    real_prob, fake_prob = run_model(image_bytes)

    # Verdict
    if fake_prob >= 0.75:
        verdict = "deepfake"
    elif fake_prob <= 0.35:
        verdict = "real"
    else:
        verdict = "uncertain"

    elapsed = round(time.time() - start, 3)
    
    # Save to database
    filename = request.files["file"].filename if "file" in request.files else "base64_upload"
    scan_record = ScanHistory(
        filename=filename,
        deepfake_probability=fake_prob,
        real_probability=real_prob,
        verdict=verdict,
        faces_detected=faces_detected
    )
    try:
        db.session.add(scan_record)
        db.session.commit()
    except Exception as e:
        print(f"[ERROR] Failed to save to database: {e}")
        db.session.rollback()

    return jsonify({
        "deepfake_probability": fake_prob,
        "real_probability": real_prob,
        "verdict": verdict,
        "faces_detected": faces_detected,
        "face_boxes": face_boxes,
        "processing_time_s": elapsed,
        "demo_mode": not MODEL_LOADED
    })


@app.route("/api/batch", methods=["POST"])
def batch_detect():
    """Accept multiple images and return results for each."""
    files = request.files.getlist("files")
    if not files:
        return jsonify({"error": "No files provided"}), 400

    results = []
    for f in files:
        image_bytes = f.read()
        real_prob, fake_prob = run_model(image_bytes)
        face_boxes = detect_faces_opencv(image_bytes)
        verdict = "deepfake" if fake_prob >= 0.75 else ("real" if fake_prob <= 0.35 else "uncertain")
        
        scan_record = ScanHistory(
            filename=f.filename,
            deepfake_probability=fake_prob,
            real_probability=real_prob,
            verdict=verdict,
            faces_detected=len(face_boxes)
        )
        db.session.add(scan_record)
        
        results.append({
            "filename": f.filename,
            "deepfake_probability": fake_prob,
            "real_probability": real_prob,
            "verdict": verdict,
            "faces_detected": len(face_boxes)
        })
        
    try:
        db.session.commit()
    except Exception as e:
        print(f"[ERROR] Failed to save batch to database: {e}")
        db.session.rollback()

    return jsonify({"results": results, "total": len(results)})

@app.route("/api/detect_video", methods=["POST"])
def detect_video():
    """
    Accept a video file and return:
      - deepfake_probability
      - real_probability
      - verdict
      - faces_detected
    """
    start = time.time()
    if "file" not in request.files:
        return jsonify({"error": "No video provided"}), 400

    f = request.files["file"]
    
    # Save video to a temporary file
    import tempfile
    import cv2
    import shutil
    
    temp_dir = tempfile.mkdtemp()
    video_path = os.path.join(temp_dir, f.filename)
    f.save(video_path)
    
    # Extract frames using OpenCV
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        shutil.rmtree(temp_dir)
        return jsonify({"error": "Could not open video file"}), 400
        
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = cap.get(cv2.CAP_PROP_FPS)
    if fps <= 0:
        fps = 30
        
    # Sample up to 10 frames evenly distributed across the video
    num_samples = 10
    step = max(1, frame_count // num_samples)
    
    fake_probs = []
    real_probs = []
    total_faces = 0
    
    for i in range(num_samples):
        cap.set(cv2.CAP_PROP_POS_FRAMES, i * step)
        ret, frame = cap.read()
        if not ret:
            break
            
        # Encode frame to bytes to reuse existing run_model / detect_faces_opencv functions
        ret, buffer = cv2.imencode('.jpg', frame)
        if ret:
            image_bytes = buffer.tobytes()
            # Face detection
            face_boxes = detect_faces_opencv(image_bytes)
            total_faces += len(face_boxes)
            
            # Model inference
            real_prob, fake_prob = run_model(image_bytes)
            fake_probs.append(fake_prob)
            real_probs.append(real_prob)
            
    cap.release()
    shutil.rmtree(temp_dir)
    
    if len(fake_probs) == 0:
        return jsonify({"error": "No valid frames extracted"}), 400
        
    avg_fake_prob = round(sum(fake_probs) / len(fake_probs), 4)
    avg_real_prob = round(sum(real_probs) / len(real_probs), 4)
    
    if avg_fake_prob >= 0.75:
        verdict = "deepfake"
    elif avg_fake_prob <= 0.35:
        verdict = "real"
    else:
        verdict = "uncertain"

    elapsed = round(time.time() - start, 3)
    
    # Save to database
    scan_record = ScanHistory(
        filename=f.filename,
        deepfake_probability=avg_fake_prob,
        real_probability=avg_real_prob,
        verdict=verdict,
        faces_detected=total_faces
    )
    try:
        db.session.add(scan_record)
        db.session.commit()
    except Exception as e:
        print(f"[ERROR] Failed to save to database: {e}")
        db.session.rollback()

    return jsonify({
        "deepfake_probability": avg_fake_prob,
        "real_probability": avg_real_prob,
        "verdict": verdict,
        "faces_detected": total_faces,
        "processing_time_s": elapsed,
        "demo_mode": not MODEL_LOADED,
        "frames_analyzed": len(fake_probs)
    })

@app.route("/api/history", methods=["GET"])
def get_history():
    """Return the recent scan history from the database."""
    limit = request.args.get("limit", 50, type=int)
    history = ScanHistory.query.order_by(ScanHistory.created_at.desc()).limit(limit).all()
    return jsonify([record.to_dict() for record in history])


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
