import numpy as np
import pandas as pd
from sklearn.base import BaseEstimator, TransformerMixin

class FeatureEngineer(BaseEstimator, TransformerMixin):
    """
    Custom Feature Engineering transformer for Telco Customer Churn dataset.
    Converts TotalCharges to numeric, bins tenure into tenure_group, and normalizes SeniorCitizen.
    """
    def __init__(self):
        pass

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        X = X.copy()
        
        # Convert 'TotalCharges' to numeric, coercing blank spaces or errors to NaN
        if 'TotalCharges' in X.columns:
            X['TotalCharges'] = pd.to_numeric(X['TotalCharges'], errors='coerce')
        
        # Create 'tenure_group'
        if 'tenure' in X.columns:
            X['tenure_group'] = pd.cut(
                X['tenure'],
                bins=[0, 12, 24, 48, 60, np.inf],
                labels=['0-12', '12-24', '24-48', '48-60', '60+']
            ).astype(str)
        
        # Standardize SeniorCitizen
        if 'SeniorCitizen' in X.columns:
            X['SeniorCitizen'] = X['SeniorCitizen'].replace({1: 'Yes', 0: 'No', '1': 'Yes', '0': 'No'})
        
        return X
