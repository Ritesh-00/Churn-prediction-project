import sys
import os
import json
import joblib
import numpy as np
import pandas as pd

# Add ml-service root to python path
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if base_dir not in sys.path:
    sys.path.insert(0, base_dir)

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, roc_auc_score, average_precision_score

from src.preprocessing.transformers import FeatureEngineer

def train_and_export_model():
    print("[TRAIN] Starting Model Training & Export Pipeline...")
    
    # 1. Load raw data
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_path = os.path.join(base_dir, "data", "raw", "WA_Fn-UseC_-Telco-Customer-Churn.csv")
    artifacts_dir = os.path.join(base_dir, "artifacts")
    os.makedirs(artifacts_dir, exist_ok=True)
    
    print(f"[DATA] Loading dataset from: {data_path}")
    df = pd.read_csv(data_path)
    
    # 2. Separate Features and Target
    X = df.drop(columns=['customerID', 'Churn'])
    y = df['Churn'].map({'No': 0, 'Yes': 1})
    
    # 3. Train-Test Split with Stratification
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    print(f"[SPLIT] Training samples: {len(X_train)}, Test samples: {len(X_test)}")
    
    # 4. Define Column Pipelines
    num_cols = ['tenure', 'MonthlyCharges', 'TotalCharges']
    cat_cols = [
        'gender', 'SeniorCitizen', 'Partner', 'Dependents', 'PhoneService',
        'MultipleLines', 'InternetService', 'OnlineSecurity', 'OnlineBackup',
        'DeviceProtection', 'TechSupport', 'StreamingTV', 'StreamingMovies',
        'Contract', 'PaperlessBilling', 'PaymentMethod', 'tenure_group'
    ]
    
    num_pipeline = Pipeline([
        ('imputer', SimpleImputer(strategy='median', add_indicator=True)),
        ('scaler', StandardScaler())
    ])

    cat_pipeline = Pipeline([
        ('imputer', SimpleImputer(strategy='constant', fill_value='Unknown')),
        ('onehot', OneHotEncoder(handle_unknown='ignore'))
    ])

    preprocessor = ColumnTransformer([
        ('num', num_pipeline, num_cols),
        ('cat', cat_pipeline, cat_cols)
    ])
    
    # 5. Build Complete Pipeline with Best Tuned RandomForest
    model_pipeline = Pipeline([
        ('feature_engineer', FeatureEngineer()),
        ('preprocessor', preprocessor),
        ('classifier', RandomForestClassifier(
            n_estimators=300,
            max_depth=10,
            min_samples_split=5,
            min_samples_leaf=2,
            max_features='sqrt',
            class_weight='balanced',
            random_state=42,
            n_jobs=-1
        ))
    ])
    
    # 6. Fit Pipeline
    print("[PIPELINE] Fitting end-to-end pipeline...")
    model_pipeline.fit(X_train, y_train)
    
    # 7. Evaluate on Test Split with 0.40 Decision Threshold
    test_probas = model_pipeline.predict_proba(X_test)[:, 1]
    threshold = 0.40
    test_preds = (test_probas >= threshold).astype(int)
    
    acc = float(accuracy_score(y_test, test_preds))
    roc_auc = float(roc_auc_score(y_test, test_probas))
    pr_auc = float(average_precision_score(y_test, test_probas))
    
    print("\n[EVALUATION] Results on Test Set:")
    print(f"  - Accuracy: {acc:.4f}")
    print(f"  - ROC-AUC:  {roc_auc:.4f}")
    print(f"  - PR-AUC:   {pr_auc:.4f}")
    print(f"  - Applied Threshold: {threshold}")
    
    # 8. Export Model Artifact
    model_path = os.path.join(artifacts_dir, "model_pipeline.joblib")
    joblib.dump(model_pipeline, model_path)
    print(f"[ARTIFACT] Saved trained pipeline to: {model_path}")
    
    # 9. Export Config & Metadata
    config_data = {
        "model_name": "RandomForestClassifier_Churn_Pipeline",
        "version": "1.0.0",
        "decision_threshold": threshold,
        "metrics": {
            "accuracy": acc,
            "roc_auc": roc_auc,
            "pr_auc": pr_auc
        },
        "numeric_features": num_cols,
        "categorical_features": cat_cols,
        "raw_required_features": [col for col in X.columns]
    }
    
    config_path = os.path.join(artifacts_dir, "config.json")
    with open(config_path, "w", encoding="utf-8") as f:
        json.dump(config_data, f, indent=2)
    print(f"[CONFIG] Saved config metadata to: {config_path}")
    print("[SUCCESS] Training and Export Completed Successfully!")

if __name__ == "__main__":
    train_and_export_model()
