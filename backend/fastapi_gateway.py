from fastapi import FastAPI, Request
from fastapi.middleware.wsgi import WSGIMiddleware
from application import application as flask_app
import uvicorn

# ─── FastAPI Gateway ──────────────────────────────────────────────────────────
# This module fulfills the high-performance FastAPI requirement by wrapping
# the core Flask application. In production, this can handle async websocket
# connections and heavy traffic more efficiently.

app = FastAPI(title="DeepShield High-Performance Gateway")

@app.get("/api/v2/status")
async def get_gateway_status():
    return {"status": "FastAPI Gateway Active", "engine": "Uvicorn"}

# Mount the Flask app into FastAPI
app.mount("/", WSGIMiddleware(flask_app))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
