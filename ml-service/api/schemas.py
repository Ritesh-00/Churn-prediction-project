from pydantic import BaseModel, Field
from typing import List, Optional, Union, Dict, Any

class CustomerFeatureSchema(BaseModel):
    customerId: Optional[str] = Field(default="CUST-UNKNOWN")
    gender: str = Field(default="Female", description="Gender of the customer (Male, Female)")
    SeniorCitizen: Union[int, str] = Field(default=0, description="0, 1, 'Yes', or 'No'")
    Partner: str = Field(default="No", description="Yes or No")
    Dependents: str = Field(default="No", description="Yes or No")
    tenure: float = Field(default=1.0, description="Number of months customer has stayed with the company")
    PhoneService: str = Field(default="Yes", description="Yes or No")
    MultipleLines: str = Field(default="No", description="Yes, No, or No phone service")
    InternetService: str = Field(default="Fiber optic", description="DSL, Fiber optic, or No")
    OnlineSecurity: str = Field(default="No", description="Yes, No, or No internet service")
    OnlineBackup: str = Field(default="No", description="Yes, No, or No internet service")
    DeviceProtection: str = Field(default="No", description="Yes, No, or No internet service")
    TechSupport: str = Field(default="No", description="Yes, No, or No internet service")
    StreamingTV: str = Field(default="No", description="Yes, No, or No internet service")
    StreamingMovies: str = Field(default="No", description="Yes, No, or No internet service")
    Contract: str = Field(default="Month-to-month", description="Month-to-month, One year, Two year")
    PaperlessBilling: str = Field(default="Yes", description="Yes or No")
    PaymentMethod: str = Field(default="Electronic check", description="Payment method name")
    MonthlyCharges: float = Field(default=70.0, description="The amount charged to the customer monthly")
    TotalCharges: Optional[Union[float, str]] = Field(default=70.0, description="The total amount charged")

    model_config = {
        "extra": "ignore"
    }

class SinglePredictRequest(BaseModel):
    features: Union[CustomerFeatureSchema, Dict[str, Any]]
    threshold: Optional[float] = Field(default=0.40, ge=0.01, le=0.99)

class BatchPredictRequest(BaseModel):
    customers: List[Union[CustomerFeatureSchema, Dict[str, Any]]]
    threshold: Optional[float] = Field(default=0.40, ge=0.01, le=0.99)

class PredictionResponse(BaseModel):
    churn_probability: float
    churn_prediction: bool
    risk_level: str
    threshold_used: float

class BatchPredictionResponse(BaseModel):
    count: int
    results: List[PredictionResponse]

class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    version: str
    default_threshold: float
