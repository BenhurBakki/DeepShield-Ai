"""
Tests for the AI-specific components:
  - VectorIndex (FAISS)
  - FacialExtractor (FaceNet with fallback)
  - /api/detect input validation
"""
import json
import io
import sys
import os
import numpy as np
from io import BytesIO
from PIL import Image

# ── make sure the backend package is importable ──────────────────────────────
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from app import VectorIndex, FacialExtractor


# ─── VectorIndex (FAISS) ─────────────────────────────────────────────────────

class TestVectorIndex:
    def test_empty_search_returns_no_results(self):
        """An empty FAISS index should return an empty list."""
        idx = VectorIndex(dimension=512)
        query = [0.0] * 512
        results = idx.search(query, k=5)
        assert results == []

    def test_add_and_search_returns_correct_dimension(self):
        """After adding a vector the search result must include distance & metadata."""
        idx = VectorIndex(dimension=4)
        vec = [1.0, 0.0, 0.0, 0.0]
        idx.add(vec, {"label": "test"})
        results = idx.search(vec, k=1)
        assert len(results) == 1
        assert "distance" in results[0]
        assert "metadata" in results[0]
        assert results[0]["metadata"]["label"] == "test"

    def test_nearest_neighbour_is_closest(self):
        """The nearest vector in the index should be returned first."""
        idx = VectorIndex(dimension=2)
        idx.add([1.0, 0.0], {"id": "a"})
        idx.add([0.0, 1.0], {"id": "b"})
        # Query close to vector "a"
        results = idx.search([0.9, 0.1], k=1)
        assert results[0]["metadata"]["id"] == "a"


# ─── FacialExtractor (FaceNet / fallback) ────────────────────────────────────

class TestFacialExtractor:
    def _dummy_image_bytes(self):
        buf = BytesIO()
        Image.new("RGB", (160, 160), color=(128, 64, 32)).save(buf, format="JPEG")
        buf.seek(0)
        return buf.read()

    def test_embedding_has_correct_dimension(self):
        """Embedding must always be 512-dimensional."""
        extractor = FacialExtractor()
        embedding = extractor.get_embedding(self._dummy_image_bytes())
        assert len(embedding) == 512

    def test_embedding_is_non_empty(self):
        """Embedding must always be a list of 512 floats, regardless of model state."""
        extractor = FacialExtractor()
        embedding = extractor.get_embedding(self._dummy_image_bytes())
        # Must be 512-dimensional
        assert len(embedding) == 512
        # All values must be finite floats
        assert all(isinstance(v, float) for v in embedding)

    def test_same_image_gives_consistent_embedding(self):
        """Given the same image bytes, the extractor should return a stable embedding."""
        extractor = FacialExtractor()
        img_bytes = self._dummy_image_bytes()
        emb1 = extractor.get_embedding(img_bytes)
        emb2 = extractor.get_embedding(img_bytes)
        # Embeddings should be identical (deterministic fallback or same model run)
        assert emb1 == emb2


# ─── /api/detect input validation ────────────────────────────────────────────

class TestDetectValidation:
    def _make_image_file(self, fmt="JPEG", ext="jpg"):
        buf = BytesIO()
        Image.new("RGB", (100, 100), color=(200, 100, 50)).save(buf, format=fmt)
        buf.seek(0)
        return buf, f"test.{ext}"

    def test_detect_rejects_empty_file(self, test_client):
        """Uploading with an empty filename should return a 400."""
        empty = BytesIO(b"")
        response = test_client.post(
            "/api/detect",
            data={"file": (empty, "")},
            content_type="multipart/form-data",
        )
        assert response.status_code == 400

    def test_detect_rejects_disallowed_extension(self, test_client):
        """Uploading a .txt file should return 400."""
        txt = BytesIO(b"not an image")
        response = test_client.post(
            "/api/detect",
            data={"file": (txt, "evil.txt")},
            content_type="multipart/form-data",
        )
        assert response.status_code == 400

    def test_detect_accepts_valid_jpeg(self, test_client):
        """A valid JPEG upload should return 200 with detection fields."""
        buf, name = self._make_image_file()
        response = test_client.post(
            "/api/detect",
            data={"file": (buf, name)},
            content_type="multipart/form-data",
        )
        assert response.status_code == 200
        data = json.loads(response.data)
        assert "deepfake_probability" in data
        assert "verdict" in data
        assert "embedding_dimension" in data.get("vector_search", {})
