import sys
import os

# Add ml-service root directory to sys.path
base_dir = os.path.dirname(os.path.abspath(__file__))
if base_dir not in sys.path:
    sys.path.insert(0, base_dir)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load .env file if present
load_dotenv()

from api.routes.predict import router as predict_router, get_model

app = FastAPI(
    title="Telco Customer Churn Prediction ML Service",
    description="Production-grade ML Microservice serving end-to-end Random Forest Pipeline with custom 0.40 threshold for churn risk scoring.",
    version="1.0.0"
)

# CORS Middleware configuration
cors_origins = os.getenv("CORS_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in cors_origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(predict_router, prefix="", tags=["Predictions & Health"])

@app.on_event("startup")
def startup_event():
    """Warm up the ML model on service startup"""
    try:
        model, cfg = get_model()
        print(f"[ML SERVICE] Model pipeline successfully loaded into memory (Version: {cfg.get('version')})")
    except Exception as e:
        print(f"[ML SERVICE WARNING] Could not load model pipeline at startup: {e}")

@app.get("/")
def root():
    return {
        "service": "Telco Customer Churn ML API",
        "status": "online",
        "docs_url": "/docs",
        "health_url": "/health"
    }

if __name__ == "__main__":
    import uvicorn
    host = os.getenv("HOST", "127.0.0.1")
    port = int(os.getenv("PORT", "8000"))
    reload = os.getenv("RELOAD", "true").lower() in ("true", "1", "yes")
    uvicorn.run("main:app", host=host, port=port, reload=reload)
