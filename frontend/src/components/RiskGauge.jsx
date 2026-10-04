import React from 'react';

const RiskGauge = ({ probability = 0, threshold = 0.4 }) => {
  const percentage = Math.min(Math.max(probability * 100, 0), 100);
  const thresholdPercentage = Math.min(Math.max(threshold * 100, 0), 100);

  // Determine color based on threshold & risk
  let riskColor = '#15803d'; // Green (Safe)
  let riskLabel = 'Low Churn Risk';
  let badgeClass = 'badge-low';

  if (probability >= 0.65) {
    riskColor = '#dc2626'; // High Churn
    riskLabel = 'High Churn Risk';
    badgeClass = 'badge-high';
  } else if (probability >= threshold) {
    riskColor = '#d97706'; // Medium / Above Threshold
    riskLabel = 'Moderate Churn Risk';
    badgeClass = 'badge-medium';
  }

  // Calculate needle angle (-90deg to +90deg for 0% to 100%)
  const needleAngle = (percentage / 100) * 180 - 90;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '6px 0', width: '100%' }}>
      <div style={{ position: 'relative', width: '200px', height: '110px', overflow: 'hidden' }}>
        <svg viewBox="0 0 200 110" width="200" height="110">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#15803d" />
              <stop offset="40%" stopColor="#ca8a04" />
              <stop offset="65%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
          </defs>

          {/* Background Track Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* Colored Gauge Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray="251.2"
            strokeDashoffset={251.2 - (percentage / 100) * 251.2}
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />

          {/* Threshold Marker Indicator */}
          {(() => {
            const angleRad = ((thresholdPercentage / 100) * 180 * Math.PI) / 180;
            const x1 = 100 - 89 * Math.cos(angleRad);
            const y1 = 100 - 89 * Math.sin(angleRad);
            const x2 = 100 - 71 * Math.cos(angleRad);
            const y2 = 100 - 71 * Math.sin(angleRad);
            return (
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#0f172a"
                strokeWidth="2.5"
                strokeDasharray="2,2"
              />
            );
          })()}

          {/* Needle Base Circle */}
          <circle cx="100" cy="100" r="7" fill="#1e293b" />
          <circle cx="100" cy="100" r="3" fill="#ffffff" />

          {/* Needle */}
          <g style={{ transform: `rotate(${needleAngle}deg)`, transformOrigin: '100px 100px', transition: 'transform 0.6s ease' }}>
            <polygon points="98.5,100 101.5,100 100,30" fill="#1e293b" />
          </g>
        </svg>
      </div>

      {/* Probability Percentage Readout */}
      <div style={{ textAlign: 'center', marginTop: '-2px' }}>
        <div style={{ fontSize: '1.75rem', fontWeight: 700, color: riskColor, lineHeight: 1 }}>
          {percentage.toFixed(1)}%
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '3px' }}>
          Estimated Probability
        </div>
        <div style={{ marginTop: '6px' }}>
          <span className={`badge ${badgeClass}`} style={{ fontSize: '0.8rem', padding: '4px 10px' }}>
            {riskLabel}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RiskGauge;
