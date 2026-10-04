import React from 'react';
import { X } from 'lucide-react';
import RiskGauge from './RiskGauge';
import RecommendationList from './RecommendationList';

const CustomerDetailModal = ({ customer, onClose }) => {
  if (!customer) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.5)',
        backdropFilter: 'blur(2px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '760px',
          maxHeight: '90vh',
          overflowY: 'auto',
          backgroundColor: '#ffffff',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="card-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span className="card-title" style={{ fontSize: '1.15rem' }}>
                Account: {customer.customerId}
              </span>
              <span
                className={`badge ${
                  customer.riskLevel === 'High'
                    ? 'badge-high'
                    : customer.riskLevel === 'Medium'
                    ? 'badge-medium'
                    : 'badge-low'
                }`}
              >
                {customer.riskLevel} Risk
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '2px' }}>
              Recorded on {new Date(customer.createdAt || Date.now()).toLocaleDateString()}
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ padding: '5px', borderRadius: '50%' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Top Risk Overview */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              padding: '14px',
              backgroundColor: 'var(--slate-50)',
              borderRadius: 'var(--radius-md)',
              alignItems: 'center',
            }}
          >
            <div style={{ flex: '1 1 200px', display: 'flex', justifyContent: 'center' }}>
              <RiskGauge
                probability={customer.churnProbability}
                threshold={customer.thresholdUsed || 0.4}
              />
            </div>
            <div style={{ flex: '2 1 260px' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--slate-900)' }}>
                Assessment Overview
              </h4>
              <p style={{ fontSize: '0.825rem', color: 'var(--slate-600)', marginTop: '4px', lineHeight: '1.4' }}>
                Estimated <strong>{(customer.churnProbability * 100).toFixed(1)}%</strong> churn risk. Account is on a <strong>{customer.Contract}</strong> plan with <strong>${customer.MonthlyCharges}/mo</strong> revenue.
              </p>
            </div>
          </div>

          {/* Customer Attributes Breakdown */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>
              Account & Subscription Data
            </h4>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                gap: '8px',
                fontSize: '0.8rem',
              }}
            >
              <div style={{ padding: '8px 10px', backgroundColor: 'var(--slate-50)', borderRadius: '6px' }}>
                <span style={{ color: 'var(--slate-500)', fontSize: '0.75rem' }}>Demographics:</span>
                <div style={{ fontWeight: 500, color: 'var(--slate-800)' }}>
                  {customer.gender}, Senior: {String(customer.SeniorCitizen)}
                </div>
              </div>

              <div style={{ padding: '8px 10px', backgroundColor: 'var(--slate-50)', borderRadius: '6px' }}>
                <span style={{ color: 'var(--slate-500)', fontSize: '0.75rem' }}>Partner / Dependents:</span>
                <div style={{ fontWeight: 500, color: 'var(--slate-800)' }}>
                  {customer.Partner} / {customer.Dependents}
                </div>
              </div>

              <div style={{ padding: '8px 10px', backgroundColor: 'var(--slate-50)', borderRadius: '6px' }}>
                <span style={{ color: 'var(--slate-500)', fontSize: '0.75rem' }}>Tenure:</span>
                <div style={{ fontWeight: 500, color: 'var(--slate-800)' }}>
                  {customer.tenure} Months
                </div>
              </div>

              <div style={{ padding: '8px 10px', backgroundColor: 'var(--slate-50)', borderRadius: '6px' }}>
                <span style={{ color: 'var(--slate-500)', fontSize: '0.75rem' }}>Internet Service:</span>
                <div style={{ fontWeight: 500, color: 'var(--slate-800)' }}>
                  {customer.InternetService}
                </div>
              </div>

              <div style={{ padding: '8px 10px', backgroundColor: 'var(--slate-50)', borderRadius: '6px' }}>
                <span style={{ color: 'var(--slate-500)', fontSize: '0.75rem' }}>Tech Support:</span>
                <div style={{ fontWeight: 500, color: 'var(--slate-800)' }}>
                  {customer.TechSupport}
                </div>
              </div>

              <div style={{ padding: '8px 10px', backgroundColor: 'var(--slate-50)', borderRadius: '6px' }}>
                <span style={{ color: 'var(--slate-500)', fontSize: '0.75rem' }}>Contract Type:</span>
                <div style={{ fontWeight: 500, color: 'var(--slate-800)' }}>
                  {customer.Contract}
                </div>
              </div>

              <div style={{ padding: '8px 10px', backgroundColor: 'var(--slate-50)', borderRadius: '6px' }}>
                <span style={{ color: 'var(--slate-500)', fontSize: '0.75rem' }}>Monthly Charges:</span>
                <div style={{ fontWeight: 500, color: 'var(--slate-800)' }}>
                  ${Number(customer.MonthlyCharges).toFixed(2)}
                </div>
              </div>

              <div style={{ padding: '8px 10px', backgroundColor: 'var(--slate-50)', borderRadius: '6px' }}>
                <span style={{ color: 'var(--slate-500)', fontSize: '0.75rem' }}>Total Charges:</span>
                <div style={{ fontWeight: 500, color: 'var(--slate-800)' }}>
                  ${Number(customer.TotalCharges).toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {/* Retention Recommendations */}
          <RecommendationList
            recommendations={customer.recommendations}
            churnPrediction={customer.churnPrediction}
          />
        </div>

        {/* Modal Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
          <button onClick={onClose} className="btn btn-secondary btn-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailModal;
