# 🛡️ Customer Churn Intelligence & Retention Platform
Enterprise Full-Stack Machine Learning (MERN + FastAPI) Application for Telco Customer Churn Prediction and Retention Analytics.

---

## 🏛️ System Architecture

```
                               ┌─────────────────────────┐
                               │     React Frontend      │
                               │  (Vite + Redux Toolkit) │
                               │   http://localhost:5173 │
                               └────────────┬────────────┘
                                            │ REST API / JSON
                                            ▼
                               ┌─────────────────────────┐
                               │     Express Backend     │
                               │  (Node.js + Mongoose)   │
                               │   http://localhost:5000 │
                               └───────┬───────────┬─────┘
                                       │           │
                       Inference Calls │           │ Persistence
                                       ▼           ▼
             ┌───────────────────────────┐   ┌───────────────────────────┐
             │    Python ML Service      │   │       MongoDB Atlas       │
             │   (FastAPI + scikit-learn)│   │     (churn-pridiction)    │
             │    http://127.0.0.1:8000  │   └───────────────────────────┘
             └───────────────────────────┘
```

---

## 🚀 How to Run the Full Stack (3 Terminals)

### Terminal 1: Start Python ML Microservice (FastAPI)
```bash
cd ml-service
# Using the workspace virtual environment
..\.venv\Scripts\python -m uvicorn main:app --port 8000 --reload
```
* API Documentation: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
* Health Endpoint: [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)

---

### Terminal 2: Start Node.js Backend API
```bash
cd backend
npm run dev
```
* Server URL: [http://localhost:5000](http://localhost:5000)
* Health Ping: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

### Terminal 3: Start React Frontend
```bash
cd frontend
npm run dev
```
* Open in browser: [http://localhost:5173](http://localhost:5173)

---

## 📂 Project Structure

```
Customer Churn/
├── ml-service/
│   ├── artifacts/
│   │   ├── model_pipeline.joblib  # Trained end-to-end Random Forest pipeline
│   │   └── config.json            # Model threshold (0.40) & metadata
│   ├── src/
│   │   ├── preprocessing/
│   │   │   └── transformers.py    # Custom FeatureEngineer transformer
│   │   └── train.py               # Pipeline training and artifact export script
│   ├── api/
│   │   ├── schemas.py             # Pydantic request/response validation schemas
│   │   └── routes/predict.py      # /predict, /predict-batch, /health endpoints
│   ├── data/raw/                  # Raw Telco Customer Churn CSV dataset
│   ├── notebooks/                 # EDA and Cleaning Jupyter notebooks
│   └── main.py                    # FastAPI server entry point
│
├── backend/
│   ├── .env                       # Environment configuration with MongoDB Atlas URI
│   ├── package.json
│   └── src/
│       ├── config/                # env.js, db.js (with DNS SRV resolution)
│       ├── controllers/           # prediction, customer, analytics, health controllers
│       ├── middleware/            # validateRequest, errorHandler
│       ├── models/                # Customer.js, BatchJob.js
│       ├── routes/                # predictionRoutes, customerRoutes, analyticsRoutes, healthRoutes
│       ├── services/              # mlService.js (HTTP bridge), customerService, analyticsService
│       ├── app.js
│       └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/            # Header, RiskGauge, StatCard, RecommendationList, CustomerDetailModal
    │   ├── features/              # Redux Toolkit store, predictionSlice, customerSlice, analyticsSlice, healthSlice
    │   ├── pages/                 # Dashboard, SinglePredict, BatchPredict, Customers, ThresholdSimulator
    │   ├── services/api.js        # Axios API client
    │   ├── index.css              # Corporate White & Blue design system
    │   ├── App.jsx
    │   └── main.jsx
    └── vite.config.js             # API proxy configuration
```

---

## 🎯 Key Capabilities
1. **End-to-End Pipeline**: Handles missing values, type coercions, `tenure_group` binning, and one-hot encoding on raw customer inputs.
2. **0.40 Decision Threshold**: Tuned for maximum recall and balanced PR-AUC to protect customer retention.
3. **Automated Playbooks**: Dynamically attaches business retention playbooks tailored to risk factors (e.g. Month-to-month contracts, electronic checks, absence of tech support).
4. **Batch CSV Scoring**: Instant processing and export of hundreds of customer records with drag-and-drop CSV interface.
5. **Real-time Synchronization**: Every scored customer is automatically persisted in MongoDB Atlas for historical tracking and sensitivity analysis.
