import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { predictSingleCustomer } from '../features/prediction/predictionSlice';
import { fetchDashboardMetrics } from '../features/analytics/analyticsSlice';
import RiskGauge from '../components/RiskGauge';
import RecommendationList from '../components/RecommendationList';
import { PredictResultSkeleton } from '../components/Skeleton';
import Loader from '../components/Loader';
import {
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Zap,
} from 'lucide-react';

const INITIAL_FORM_STATE = {
  gender: 'Female',
  SeniorCitizen: 'No',
  Partner: 'Yes',
  Dependents: 'No',
  tenure: 12,
  PhoneService: 'Yes',
  MultipleLines: 'No',
  InternetService: 'Fiber optic',
  OnlineSecurity: 'No',
  OnlineBackup: 'Yes',
  DeviceProtection: 'No',
  TechSupport: 'No',
  StreamingTV: 'Yes',
  StreamingMovies: 'Yes',
  Contract: 'Month-to-month',
  PaperlessBilling: 'Yes',
  PaymentMethod: 'Electronic check',
  MonthlyCharges: 89.85,
  TotalCharges: 1078.20,
};

const SinglePredictPage = () => {
  const dispatch = useDispatch();
  const { currentPrediction, lastSavedCustomer, isLoading, error, globalThreshold } = useSelector(
    (state) => state.prediction
  );

  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [saveToDb, setSaveToDb] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === 'tenure' || name === 'MonthlyCharges') {
        const t = name === 'tenure' ? parseFloat(value) || 0 : prev.tenure;
        const m = name === 'MonthlyCharges' ? parseFloat(value) || 0 : prev.MonthlyCharges;
        updated.TotalCharges = Number((t * m).toFixed(2));
      }

      return updated;
    });
  };

  const applyPreset = (presetType) => {
    if (presetType === 'high_risk') {
      setFormData({
        gender: 'Male',
        SeniorCitizen: 'Yes',
        Partner: 'No',
        Dependents: 'No',
        tenure: 3,
        PhoneService: 'Yes',
        MultipleLines: 'Yes',
        InternetService: 'Fiber optic',
        OnlineSecurity: 'No',
        OnlineBackup: 'No',
        DeviceProtection: 'No',
        TechSupport: 'No',
        StreamingTV: 'Yes',
        StreamingMovies: 'Yes',
        Contract: 'Month-to-month',
        PaperlessBilling: 'Yes',
        PaymentMethod: 'Electronic check',
        MonthlyCharges: 98.50,
        TotalCharges: 295.50,
      });
    } else if (presetType === 'loyal') {
      setFormData({
        gender: 'Female',
        SeniorCitizen: 'No',
        Partner: 'Yes',
        Dependents: 'Yes',
        tenure: 58,
        PhoneService: 'Yes',
        MultipleLines: 'Yes',
        InternetService: 'DSL',
        OnlineSecurity: 'Yes',
        OnlineBackup: 'Yes',
        DeviceProtection: 'Yes',
        TechSupport: 'Yes',
        StreamingTV: 'No',
        StreamingMovies: 'No',
        Contract: 'Two year',
        PaperlessBilling: 'No',
        PaymentMethod: 'Credit card (automatic)',
        MonthlyCharges: 64.20,
        TotalCharges: 3723.60,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');

    const result = await dispatch(
      predictSingleCustomer({
        customerData: formData,
        threshold: globalThreshold,
        saveToDb,
      })
    );

    if (!result.error) {
      setSuccessMessage('Prediction completed and recorded.');
      dispatch(fetchDashboardMetrics());
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Card */}
      <div className="card" style={{ padding: '18px 22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>Single Account Scoring</h2>
            <p style={{ fontSize: '0.825rem', color: '#64748b', marginTop: '2px' }}>
              Enter customer contract details to estimate churn probability.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.775rem', fontWeight: 500, color: 'var(--slate-500)' }}>Presets:</span>
            <button
              type="button"
              onClick={() => applyPreset('high_risk')}
              className="btn btn-secondary btn-sm"
            >
              High-Risk Sample
            </button>
            <button
              type="button"
              onClick={() => applyPreset('loyal')}
              className="btn btn-secondary btn-sm"
            >
              Loyal Sample
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid-2" style={{ gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)' }}>
        {/* Prediction Form */}
        <div className="card">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Demographics */}
            <div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--slate-800)', marginBottom: '10px' }}>
                1. Demographics
              </h3>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} className="form-select">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Senior Citizen</label>
                  <select name="SeniorCitizen" value={formData.SeniorCitizen} onChange={handleChange} className="form-select">
                    <option value="No">No</option>
                    <option value="Yes">Yes (65+)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Partner</label>
                  <select name="Partner" value={formData.Partner} onChange={handleChange} className="form-select">
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Dependents</label>
                  <select name="Dependents" value={formData.Dependents} onChange={handleChange} className="form-select">
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--slate-100)' }} />

            {/* Services */}
            <div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--slate-800)', marginBottom: '10px' }}>
                2. Subscribed Services
              </h3>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Internet Service</label>
                  <select name="InternetService" value={formData.InternetService} onChange={handleChange} className="form-select">
                    <option value="Fiber optic">Fiber optic</option>
                    <option value="DSL">DSL</option>
                    <option value="No">No Internet Service</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Tech Support</label>
                  <select name="TechSupport" value={formData.TechSupport} onChange={handleChange} className="form-select">
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                    <option value="No internet service">No internet service</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Online Security</label>
                  <select name="OnlineSecurity" value={formData.OnlineSecurity} onChange={handleChange} className="form-select">
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                    <option value="No internet service">No internet service</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Online Backup</label>
                  <select name="OnlineBackup" value={formData.OnlineBackup} onChange={handleChange} className="form-select">
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="No internet service">No internet service</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Service</label>
                  <select name="PhoneService" value={formData.PhoneService} onChange={handleChange} className="form-select">
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Multiple Lines</label>
                  <select name="MultipleLines" value={formData.MultipleLines} onChange={handleChange} className="form-select">
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                    <option value="No phone service">No phone service</option>
                  </select>
                </div>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--slate-100)' }} />

            {/* Contract & Billing */}
            <div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--slate-800)', marginBottom: '10px' }}>
                3. Contract & Financials
              </h3>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Contract Type</label>
                  <select name="Contract" value={formData.Contract} onChange={handleChange} className="form-select">
                    <option value="Month-to-month">Month-to-month</option>
                    <option value="One year">One year</option>
                    <option value="Two year">Two year</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Payment Method</label>
                  <select name="PaymentMethod" value={formData.PaymentMethod} onChange={handleChange} className="form-select">
                    <option value="Electronic check">Electronic check</option>
                    <option value="Mailed check">Mailed check</option>
                    <option value="Bank transfer (automatic)">Bank transfer (automatic)</option>
                    <option value="Credit card (automatic)">Credit card (automatic)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Tenure (Months)</label>
                  <input
                    type="number"
                    name="tenure"
                    min="0"
                    max="100"
                    value={formData.tenure}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Paperless Billing</label>
                  <select name="PaperlessBilling" value={formData.PaperlessBilling} onChange={handleChange} className="form-select">
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Monthly Charges ($)</label>
                  <input
                    type="number"
                    step="0.05"
                    name="MonthlyCharges"
                    min="0"
                    value={formData.MonthlyCharges}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Total Charges ($)</label>
                  <input
                    type="number"
                    step="0.05"
                    name="TotalCharges"
                    min="0"
                    value={formData.TotalCharges}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              </div>
            </div>

            {/* Checkbox Save */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                id="saveToDb"
                checked={saveToDb}
                onChange={(e) => setSaveToDb(e.target.checked)}
                style={{ width: '15px', height: '15px', cursor: 'pointer' }}
              />
              <label htmlFor="saveToDb" style={{ fontSize: '0.825rem', color: 'var(--slate-700)', cursor: 'pointer' }}>
                Record this score to database
              </label>
            </div>

            {error && (
              <div style={{ padding: '10px 12px', backgroundColor: 'var(--risk-high-bg)', border: '1px solid var(--risk-high-border)', color: 'var(--risk-high)', borderRadius: 'var(--radius-md)', fontSize: '0.825rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertCircle size={15} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
            >
              {isLoading ? (
                <Loader size="sm" text="Calculating Churn Risk..." color="#ffffff" />
              ) : (
                'Predict Churn Risk'
              )}
            </button>
          </form>
        </div>

        {/* Prediction Results Side Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                Assessment Results
              </h3>
              {currentPrediction && !isLoading && (
                <span className="badge badge-slate">
                  {currentPrediction.modelSource === 'ml_microservice' ? 'ML Model' : 'Simulator'}
                </span>
              )}
            </div>

            {isLoading ? (
              <PredictResultSkeleton />
            ) : currentPrediction ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Gauge */}
                <RiskGauge
                  probability={currentPrediction.churnProbability}
                  threshold={currentPrediction.thresholdUsed}
                />

                {/* Outcome Banner */}
                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: currentPrediction.churnPrediction ? 'var(--risk-high-bg)' : 'var(--risk-low-bg)',
                    border: `1px solid ${currentPrediction.churnPrediction ? 'var(--risk-high-border)' : 'var(--risk-low-border)'}`,
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: currentPrediction.churnPrediction ? 'var(--risk-high)' : 'var(--risk-low)' }}>
                    {currentPrediction.churnPrediction ? 'High Churn Risk' : 'Low Churn Risk'}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--slate-700)', marginTop: '2px' }}>
                    Probability ({(currentPrediction.churnProbability * 100).toFixed(1)}%) is {currentPrediction.churnProbability >= currentPrediction.thresholdUsed ? 'above' : 'below'} the {(currentPrediction.thresholdUsed * 100).toFixed(0)}% decision boundary.
                  </p>
                </div>

                {/* Playbook recommendations */}
                <RecommendationList
                  recommendations={currentPrediction.recommendations}
                  churnPrediction={currentPrediction.churnPrediction}
                />

                {lastSavedCustomer && (
                  <div style={{ fontSize: '0.775rem', color: 'var(--slate-500)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <CheckCircle2 size={13} color="var(--risk-low)" />
                    ID: <strong>{lastSavedCustomer.customerId}</strong>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--slate-400)' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>
                  Awaiting input data
                </p>
                <p style={{ fontSize: '0.775rem', marginTop: '4px' }}>
                  Click <strong>Predict Churn Risk</strong> to calculate score.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePredictPage;
