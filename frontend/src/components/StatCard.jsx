import React from 'react';

const StatCard = ({ title, value, subtext, trend, trendColor = 'default' }) => {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '120px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
      }}
    >
      <div>
        <div
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: '1.85rem',
            fontWeight: 700,
            color: '#0f172a',
            marginTop: '6px',
            lineHeight: 1.1,
          }}
        >
          {value}
        </div>
      </div>

      <div
        style={{
          marginTop: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.825rem',
          color: '#64748b',
          gap: '8px',
        }}
      >
        <span>{subtext}</span>
        {trend && (
          <span
            style={{
              fontWeight: 600,
              color:
                trendColor === 'red'
                  ? '#ef4444'
                  : trendColor === 'orange'
                  ? '#f97316'
                  : trendColor === 'green'
                  ? '#10b981'
                  : '#2563eb',
              whiteSpace: 'nowrap',
            }}
          >
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
