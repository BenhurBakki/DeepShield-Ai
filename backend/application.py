# ─── Bulletproof Startup ─────────────────────────────────────────────────────
try:
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
    import hashlib
    import numpy as np
    import faiss
    import torch
    import torchvision.transforms as transforms
    from PIL import Image
    from functools import wraps
    from werkzeug.security import generate_password_hash, check_password_hash
    from werkzeug.utils import secure_filename
    
    print("[INFO] Core dependencies loaded successfully.")
except Exception as startup_error:
    from flask import Flask, jsonify
    application = Flask(__name__)
    @application.route("/", defaults={"path": ""})
    @application.route("/<path:path>")
    def rescue(path):
        return jsonify({
            "status": "rescue_mode",
            "error": "Startup Failure",
            "details": str(startup_error)
        }), 500
    print(f"[CRITICAL] Startup failed: {startup_error}")

# ─── App Initialization ──────────────────────────────────────────────────────
VERSION = "1.0.6-rebuild"
application = Flask(__name__)
app = application
CORS(application, resources={r"/api/*": {"origins": "*"}})

SECRET_KEY = os.environ.get('SECRET_KEY', 'deepshield-fallback-secure-key-2024')
app.config['SECRET_KEY'] = SECRET_KEY
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:////tmp/deepverify.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

db = SQLAlchemy(app)

# ─── Optional: Reverse Image Search ─────────────────────────────────────────
try:
    from reverse_image_search import find_morphed_image_sources
    REVERSE_SEARCH_AVAILABLE = True
except ImportError:
    REVERSE_SEARCH_AVAILABLE = False

# ─── Database Models ─────────────────────────────────────────────────────────
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {"id": self.id, "username": self.username, "email": self.email}

class ScanHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=True)
    deepfake_probability = db.Column(db.Float, nullable=False)
    real_probability = db.Column(db.Float, nullable=False)
    verdict = db.Column(db.String(50), nullable=False)
    faces_detected = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

with app.app_context():
    try:
        db.create_all()
    except Exception:
        pass

# ─── AI Model Lazy Loading ──────────────────────────────────────────────────
def create_model():
    import torchvision.models as models
    import torch.nn as nn
    model = models.resnet18(pretrained=False)
    model.fc = nn.Linear(model.fc.in_features, 2)
    return model

_GLOBAL_MODEL = None
_MODEL_LOADED = False

def _lazy_load_detection_model():
    global _GLOBAL_MODEL, _MODEL_LOADED
    if _MODEL_LOADED: return True
    try:
        MODEL_PATH = os.environ.get("MODEL_PATH", "model.pth")
        if os.path.exists(MODEL_PATH):
            _GLOBAL_MODEL = create_model()
            _GLOBAL_MODEL.load_state_dict(torch.load(MODEL_PATH, map_location="cpu"))
            _GLOBAL_MODEL.eval()
            _MODEL_LOADED = True
            return True
    except Exception as e:
        print(f"Model load failed: {e}")
    return False

# ─── Authentication Endpoints ───────────────────────────────────────────────
@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    if not data or not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Missing required fields"}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "Email already exists"}), 400
        
    user = User(
        username=data['username'],
        email=data['email'],
        password_hash=generate_password_hash(data['password'])
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User created successfully"}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data.get('email')).first()
    if user and check_password_hash(user.password_hash, data.get('password')):
        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.now(timezone.utc) + timedelta(hours=24)
        }, SECRET_KEY, algorithm="HS256")
        return jsonify({"token": token, "user": user.to_dict()})
    return jsonify({"error": "Invalid credentials"}), 401

# ─── Analysis Endpoints ────────────────────────────────────────────────────
@app.route('/api/detect', methods=['POST'])
def detect():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    # Simplified simulation for recovery
    prob = random.uniform(0, 1)
    return jsonify({
        "deepfake_probability": round(prob * 100, 2),
        "real_probability": round((1-prob) * 100, 2),
        "verdict": "Likely Deepfake" if prob > 0.5 else "Likely Real",
        "faces_detected": 1,
        "demo_mode": True
    })

@app.route('/api/face-trace/search', methods=['POST'])
def face_trace_search():
    if not REVERSE_SEARCH_AVAILABLE:
        return jsonify({"error": "Reverse search module not loaded"}), 500
    
    if 'file' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
        
    try:
        file = request.files['file']
        img_bytes = file.read()
        results = find_morphed_image_sources(img_bytes)
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/health')
def health():
    return jsonify({"status": "ok", "version": VERSION})

if __name__ == '__main__':
    application.run(host='0.0.0.0', port=5000)
