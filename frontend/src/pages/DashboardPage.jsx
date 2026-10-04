import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardMetrics } from '../features/analytics/analyticsSlice';
import StatCard from '../components/StatCard';
import { ChevronDown } from 'lucide-react';
import { DashboardSkeleton } from '../components/Skeleton';

const DashboardPage = ({ setActiveTab }) => {
  const dispatch = useDispatch();
  const { metrics, isLoading } = useSelector((state) => state.analytics);
  const [contractFilter, setContractFilter] = useState('Contract Driver');

  useEffect(() => {
    dispatch(fetchDashboardMetrics());
  }, [dispatch]);

  if (isLoading && !metrics) {
    return <DashboardSkeleton />;
  }

  const m = metrics || {
    totalCustomers: 0,
    churnCount: 0,
    safeCount: 0,
    churnRate: 0,
    avgChurnProbability: 0,
    monthlyRevenueAtRisk: 0,
    totalMonthlyRevenue: 0,
    riskDistribution: { High: 0, Medium: 0, Low: 0 },
    churnByContract: [],
  };

  const total = m.totalCustomers || 0;
  const highCount = m.riskDistribution?.High || 0;
  const medCount = m.riskDistribution?.Medium || 0;
  const lowCount = m.riskDistribution?.Low || 0;

  const highPercent = total > 0 ? Math.round((highCount / total) * 100) : 0;
  const medPercent = total > 0 ? Math.round((medCount / total) * 100) : 0;
  const lowPercent = total > 0 ? Math.round((lowCount / total) * 100) : 0;

  const exposurePercent =
    total > 0 && m.totalMonthlyRevenue > 0
      ? Math.round((m.monthlyRevenueAtRisk / m.totalMonthlyRevenue) * 100)
      : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Overview & Insights Banner Card with Wave Graphic */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '14px',
          padding: '28px 32px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)',
          minHeight: '140px',
        }}
      >
        {/* Layered Wave Graphic in Background */}
        <div
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '58%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          <svg
            viewBox="0 0 600 200"
            preserveAspectRatio="none"
            style={{ width: '100%', height: '100%', display: 'block' }}
          >
            <path
              d="M0,130 C120,60 220,170 340,110 C460,50 530,120 600,80 L600,200 L0,200 Z"
              fill="#e0f2fe"
              fillOpacity="0.45"
            />
            <path
              d="M0,155 C140,90 260,185 380,135 C500,85 550,145 600,115 L600,200 L0,200 Z"
              fill="#dbeafe"
              fillOpacity="0.75"
            />
            <path
              d="M0,175 C160,120 280,195 400,155 C520,115 570,165 600,140 L600,200 L0,200 Z"
              fill="#eff6ff"
              fillOpacity="0.9"
            />
          </svg>
        </div>

        {/* Banner Text Content */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '640px' }}>
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: '#2563eb',
              marginBottom: '6px',
            }}
          >
            OVERVIEW & INSIGHTS
          </div>
          <h2
            style={{
              fontSize: '1.65rem',
              fontWeight: 700,
              color: '#0f172a',
              letterSpacing: '-0.02em',
              marginBottom: '8px',
            }}
          >
            Customer Retention Intelligence
          </h2>
          <p
            style={{
              color: '#64748b',
              fontSize: '0.9rem',
              lineHeight: 1.5,
            }}
          >
            Monitor portfolio health, identify accounts at risk of churning, and deploy
            targeted retention playbooks.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid-4">
        <StatCard
          title="TOTAL ACCOUNTS"
          value={total.toLocaleString()}
          subtext="Scored accounts in database"
        />

        <StatCard
          title="AT-RISK ACCOUNTS"
          value={m.churnCount.toLocaleString()}
          subtext={`Churn Rate: ${m.churnRate}%`}
          trend={`${m.churnCount} accounts flagged`}
          trendColor="red"
        />

        <StatCard
          title="MONTHLY REVENUE AT RISK"
          value={`$${m.monthlyRevenueAtRisk.toLocaleString()}`}
          subtext={`Of $${m.totalMonthlyRevenue.toLocaleString()} Total MRR`}
          trend={`${exposurePercent}% exposure`}
          trendColor="orange"
        />

        <StatCard
          title="PORTFOLIO HEALTH"
          value={`${(100 - m.churnRate).toFixed(1)}%`}
          subtext="Safe customer ratio"
        />
      </div>

      {/* Bottom 2-Card Row */}
      <div className="grid-2">
        {/* Left Card: Risk Severity Breakdown */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '22px',
            }}
          >
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
              Risk Severity Breakdown
            </h3>
            <span
              style={{
                backgroundColor: '#f1f5f9',
                color: '#475569',
                fontSize: '0.775rem',
                fontWeight: 500,
                padding: '2px 10px',
                borderRadius: '9999px',
              }}
            >
              {total} Scored
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* High Risk Item */}
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.85rem',
                  marginBottom: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334155' }}>
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#ef4444',
                      display: 'inline-block',
                    }}
                  />
                  <span>High Risk (Probability ≥ 65%)</span>
                </div>
                <span style={{ color: '#475569', fontWeight: 500 }}>
                  {highCount} ({highPercent}%)
                </span>
              </div>
              <div
                style={{
                  width: '100%',
                  height: '6px',
                  backgroundColor: '#f1f5f9',
                  borderRadius: '9999px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${highPercent}%`,
                    height: '100%',
                    backgroundColor: '#ef4444',
                    borderRadius: '9999px',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
            </div>

            {/* Moderate Risk Item */}
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.85rem',
                  marginBottom: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334155' }}>
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#f59e0b',
                      display: 'inline-block',
                    }}
                  />
                  <span>Moderate Risk (Threshold 40% – 65%)</span>
                </div>
                <span style={{ color: '#475569', fontWeight: 500 }}>
                  {medCount} ({medPercent}%)
                </span>
              </div>
              <div
                style={{
                  width: '100%',
                  height: '6px',
                  backgroundColor: '#f1f5f9',
                  borderRadius: '9999px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${medPercent}%`,
                    height: '100%',
                    backgroundColor: '#f59e0b',
                    borderRadius: '9999px',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
            </div>

            {/* Low Risk Item */}
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.85rem',
                  marginBottom: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334155' }}>
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#10b981',
                      display: 'inline-block',
                    }}
                  />
                  <span>Low Risk (Safe &lt; 40%)</span>
                </div>
                <span style={{ color: '#475569', fontWeight: 500 }}>
                  {lowCount} ({lowPercent}%)
                </span>
              </div>
              <div
                style={{
                  width: '100%',
                  height: '6px',
                  backgroundColor: '#f1f5f9',
                  borderRadius: '9999px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${lowPercent}%`,
                    height: '100%',
                    backgroundColor: '#10b981',
                    borderRadius: '9999px',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Churn by Contract Type */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
              Churn by Contract Type
            </h3>

            <div
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '4px 10px',
                fontSize: '0.8rem',
                fontWeight: 500,
                color: '#334155',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer',
                backgroundColor: '#ffffff',
              }}
            >
              <span>{contractFilter}</span>
              <ChevronDown size={14} color="#64748b" />
            </div>
          </div>

          {/* Body: Either Empty State (if no data) or Populated Contract Rows */}
          {m.churnByContract?.length > 0 && total > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, justifyContent: 'center' }}>
              {m.churnByContract.map((item, idx) => (
                <div key={idx}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.85rem',
                      marginBottom: '6px',
                    }}
                  >
                    <span style={{ fontWeight: 500, color: '#334155' }}>{item.contract}</span>
                    <span style={{ color: '#475569', fontWeight: 600 }}>
                      {item.churnRate}% Churn{' '}
                      <span style={{ fontWeight: 400, color: '#94a3b8', fontSize: '0.775rem' }}>
                        ({item.churn}/{item.total})
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: '6px',
                      backgroundColor: '#f1f5f9',
                      borderRadius: '9999px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${item.churnRate}%`,
                        height: '100%',
                        backgroundColor: item.churnRate > 35 ? '#ef4444' : '#2563eb',
                        borderRadius: '9999px',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                padding: '30px 10px',
                textAlign: 'center',
              }}
            >
              {/* Center 3-Bar Circle Icon */}
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '18px' }}>
                  <div style={{ width: '3.5px', height: '9px', backgroundColor: '#94a3b8', borderRadius: '2px' }} />
                  <div style={{ width: '3.5px', height: '14px', backgroundColor: '#94a3b8', borderRadius: '2px' }} />
                  <div style={{ width: '3.5px', height: '18px', backgroundColor: '#94a3b8', borderRadius: '2px' }} />
                </div>
              </div>

              <div
                style={{
                  fontSize: '0.925rem',
                  fontWeight: 600,
                  color: '#0f172a',
                  marginBottom: '4px',
                }}
              >
                No contract data available yet
              </div>
              <p
                style={{
                  fontSize: '0.825rem',
                  color: '#64748b',
                  maxWidth: '320px',
                  lineHeight: 1.4,
                }}
              >
                Run predictions to view churn distribution by contract type.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
