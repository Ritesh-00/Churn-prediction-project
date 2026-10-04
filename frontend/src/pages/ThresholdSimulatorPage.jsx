import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { simulateThresholdImpact } from '../features/analytics/analyticsSlice';
import { setGlobalThreshold } from '../features/prediction/predictionSlice';
import { ThresholdSimulatorSkeleton } from '../components/Skeleton';
import {
  Check,
  Info,
} from 'lucide-react';

const ThresholdSimulatorPage = () => {
  const dispatch = useDispatch();
  const { globalThreshold } = useSelector((state) => state.prediction);
  const { simulationResult, isLoading } = useSelector((state) => state.analytics);

  const [sliderVal, setSliderVal] = useState(globalThreshold);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    dispatch(simulateThresholdImpact(sliderVal));
  }, [dispatch, sliderVal]);

  const handleApplyThreshold = () => {
    dispatch(setGlobalThreshold(parseFloat(sliderVal)));
    setApplied(true);
    setTimeout(() => setApplied(false), 2500);
  };

  const sim = simulationResult || {
    totalCustomers: 0,
    flaggedCount: 0,
    flaggedPercentage: 0,
    flaggedRevenue: 0,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="card" style={{ padding: '18px 22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>Decision Threshold Simulator</h2>
            <p style={{ fontSize: '0.825rem', color: '#64748b', marginTop: '2px' }}>
              Adjust classification cutoff boundary to balance precision and recall.
            </p>
          </div>

          <button
            onClick={() => setSliderVal(0.4)}
            className="btn btn-secondary btn-sm"
          >
            Reset to Optimal (40%)
          </button>
        </div>
      </div>

      <div className="grid-2">
        {/* Slider Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="card-title">
                Cutoff Boundary
              </h3>
              <span
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: 'var(--primary)',
                }}
              >
                {(sliderVal * 100).toFixed(0)}%
              </span>
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--slate-500)', marginTop: '4px' }}>
              Accounts with churn probability ≥ {(sliderVal * 100).toFixed(0)}% will be flagged as <strong>At-Risk</strong>.
            </p>
          </div>

          {/* Range Slider */}
          <div style={{ padding: '6px 0' }}>
            <input
              type="range"
              min="0.10"
              max="0.90"
              step="0.05"
              value={sliderVal}
              onChange={(e) => setSliderVal(parseFloat(e.target.value))}
              style={{
                width: '100%',
                height: '6px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--slate-400)', marginTop: '6px' }}>
              <span>10% (High Recall)</span>
              <span style={{ fontWeight: 600, color: 'var(--primary)' }}>40% (Optimal)</span>
              <span>90% (High Precision)</span>
            </div>
          </div>

          {/* Presets */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[
              { val: 0.25, label: 'Aggressive (25%)' },
              { val: 0.40, label: 'Optimal (40%)' },
              { val: 0.50, label: 'Standard (50%)' },
              { val: 0.65, label: 'Conservative (65%)' },
            ].map((btn) => (
              <button
                key={btn.val}
                onClick={() => setSliderVal(btn.val)}
                className={`btn btn-sm ${sliderVal === btn.val ? 'btn-primary' : 'btn-secondary'}`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          <div>
            <button
              onClick={handleApplyThreshold}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              {applied ? (
                <>
                  <Check size={16} />
                  Threshold Set to {(sliderVal * 100).toFixed(0)}%
                </>
              ) : (
                `Set Active Threshold (${(sliderVal * 100).toFixed(0)}%)`
              )}
            </button>
          </div>
        </div>

        {/* Portfolio Impact Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card-header">
            <h3 className="card-title">
              Impact at {(sliderVal * 100).toFixed(0)}% Cutoff
            </h3>
            <span className="badge badge-slate">{sim.totalCustomers} Scored Accounts</span>
          </div>

          {isLoading ? (
            <ThresholdSimulatorSkeleton />
          ) : (
            <>
              <div className="grid-2">
                <div style={{ padding: '14px', backgroundColor: 'var(--slate-50)', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase' }}>Flagged At-Risk</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--risk-high)', marginTop: '2px' }}>
                    {sim.flaggedCount}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                    {sim.flaggedPercentage}% of portfolio
                  </span>
                </div>

                <div style={{ padding: '14px', backgroundColor: 'var(--slate-50)', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase' }}>Revenue in Focus</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary)', marginTop: '2px' }}>
                    ${sim.flaggedRevenue.toLocaleString()}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                    Monthly recurring revenue
                  </span>
                </div>
              </div>

              <div
                style={{
                  padding: '12px 14px',
                  backgroundColor: 'var(--primary-light)',
                  border: '1px solid var(--primary-border)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.8rem',
                  color: 'var(--slate-800)',
                  lineHeight: '1.4',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600, color: 'var(--primary)', marginBottom: '3px' }}>
                  <Info size={14} />
                  Evaluation Insight
                </div>
                {sliderVal <= 0.35 ? (
                  <p>
                    <strong>High Recall:</strong> Captures nearly all potential churners early. Increases outreach volume.
                  </p>
                ) : sliderVal >= 0.55 ? (
                  <p>
                    <strong>High Precision:</strong> Only alerts when customers are highly likely to churn. Minimizes outreach to safe accounts.
                  </p>
                ) : (
                  <p>
                    <strong>Optimal 40% Threshold:</strong> Maximizes the PR-AUC and F1 score on validation splits, providing the best trade-off between retention capture and intervention cost.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThresholdSimulatorPage;
