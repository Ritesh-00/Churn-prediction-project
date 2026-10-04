import os
import json
import joblib
import pandas as pd
from fastapi import APIRouter, HTTPException, status
from api.schemas import (
    SinglePredictRequest,
    BatchPredictRequest,
    PredictionResponse,
    BatchPredictionResponse,
    HealthResponse
)

router = APIRouter()

# Global model state
_model = None
_config = None

def get_model():
    global _model, _config
    if _model is None:
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        default_model_path = os.path.join(base_dir, "artifacts", "model_pipeline.joblib")
        default_config_path = os.path.join(base_dir, "artifacts", "config.json")

        model_path = os.getenv("MODEL_PATH", default_model_path)
        config_path = os.getenv("CONFIG_PATH", default_config_path)

        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model artifact not found at {model_path}. Please run train.py first.")
        
        _model = joblib.load(model_path)
        
        if os.path.exists(config_path):
            with open(config_path, "r", encoding="utf-8") as f:
                _config = json.load(f)
        else:
            default_thresh = float(os.getenv("DEFAULT_THRESHOLD", "0.40"))
            _config = {"version": "1.0.0", "decision_threshold": default_thresh}
            
    return _model, _config

@router.get("/health", response_model=HealthResponse)
def health_check():
    """Health check endpoint for the ML Service"""
    try:
        model, cfg = get_model()
        return HealthResponse(
            status="healthy",
            model_loaded=model is not None,
            version=cfg.get("version", "1.0.0"),
            default_threshold=cfg.get("decision_threshold", 0.40)
        )
    except Exception as e:
        return HealthResponse(
            status=f"unhealthy: {str(e)}",
            model_loaded=False,
            version="unknown",
            default_threshold=0.40
        )

@router.post("/predict", response_model=PredictionResponse)
def predict_single(payload: SinglePredictRequest):
    """
    Predict churn risk for a single customer.
    """
    try:
        model, cfg = get_model()
        threshold = payload.threshold if payload.threshold is not None else cfg.get("decision_threshold", 0.40)

        # Extract features dict
        features_dict = payload.features if isinstance(payload.features, dict) else payload.features.model_dump()

        # Convert to single-row DataFrame
        df = pd.DataFrame([features_dict])

        # Execute prediction pipeline
        probabilities = model.predict_proba(df)[:, 1]
        churn_prob = float(probabilities[0])
        is_churn = bool(churn_prob >= threshold)

        # Categorize risk level
        if churn_prob >= 0.65:
            risk = "High"
        elif churn_prob >= threshold:
            risk = "Medium"
        else:
            risk = "Low"

        return PredictionResponse(
            churn_probability=round(churn_prob, 4),
            churn_prediction=is_churn,
            risk_level=risk,
            threshold_used=threshold
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference error: {str(e)}"
        )

@router.post("/predict-batch", response_model=BatchPredictionResponse)
def predict_batch(payload: BatchPredictRequest):
    """
    Predict churn risk for a batch of customers.
    """
    try:
        model, cfg = get_model()
        threshold = payload.threshold if payload.threshold is not None else cfg.get("decision_threshold", 0.40)

        if not payload.customers:
            return BatchPredictionResponse(count=0, results=[])

        # Convert list of customer dicts to DataFrame
        customers_list = [
            c if isinstance(c, dict) else c.model_dump()
            for c in payload.customers
        ]
        df = pd.DataFrame(customers_list)

        # Predict probabilities
        probabilities = model.predict_proba(df)[:, 1]

        results = []
        for prob in probabilities:
            p = float(prob)
            is_churn = bool(p >= threshold)
            risk = "High" if p >= 0.65 else ("Medium" if p >= threshold else "Low")
            results.append(
                PredictionResponse(
                    churn_probability=round(p, 4),
                    churn_prediction=is_churn,
                    risk_level=risk,
                    threshold_used=threshold
                )
            )

        return BatchPredictionResponse(
            count=len(results),
            results=results
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Batch inference error: {str(e)}"
        )
