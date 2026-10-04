import React from 'react';
import { Lightbulb, CheckCircle, ArrowRight } from 'lucide-react';

const RecommendationList = ({ recommendations = [], churnPrediction = false }) => {
  if (!recommendations || recommendations.length === 0) {
    return (
      <div style={{ padding: '16px', backgroundColor: 'var(--navy-50)', borderRadius: 'var(--radius-md)', color: 'var(--navy-600)', fontSize: '0.9rem' }}>
        No special retention intervention required at this time.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
        <Lightbulb size={18} color="var(--primary)" />
        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--navy-900)' }}>
          {churnPrediction ? 'High-Priority Retention Playbook' : 'Loyalty Maintenance Suggestions'}
        </h4>
      </div>

      {recommendations.map((rec, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            padding: '12px 14px',
            backgroundColor: churnPrediction ? 'var(--primary-light)' : 'var(--navy-50)',
            border: `1px solid ${churnPrediction ? 'var(--primary-border)' : 'var(--navy-200)'}`,
            borderRadius: 'var(--radius-md)',
          }}
        >
          <div style={{ marginTop: '2px', color: 'var(--primary)' }}>
            <CheckCircle size={16} />
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--navy-800)', lineHeight: '1.4' }}>
            {rec}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecommendationList;
