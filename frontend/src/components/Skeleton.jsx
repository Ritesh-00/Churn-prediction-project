import React from 'react';

export const Skeleton = ({
  width = '100%',
  height = '16px',
  borderRadius = '6px',
  style = {},
  className = '',
}) => {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width,
        height,
        borderRadius,
        ...style,
      }}
    />
  );
};

export const DashboardSkeleton = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Overview Banner Skeleton */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '14px',
          padding: '28px 32px',
          minHeight: '140px',
        }}
      >
        <Skeleton width="140px" height="12px" style={{ marginBottom: '12px' }} />
        <Skeleton width="340px" height="26px" style={{ marginBottom: '10px' }} />
        <Skeleton width="520px" height="14px" />
      </div>

      {/* 4 KPI StatCards Skeleton */}
      <div className="grid-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '20px 22px',
              minHeight: '120px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <Skeleton width="100px" height="12px" style={{ marginBottom: '10px' }} />
              <Skeleton width="70px" height="32px" />
            </div>
            <Skeleton width="130px" height="12px" style={{ marginTop: '12px' }} />
          </div>
        ))}
      </div>

      {/* 2 Bottom Breakdown Cards Skeleton */}
      <div className="grid-2">
        {[1, 2].map((i) => (
          <div
            key={i}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '24px',
              minHeight: '220px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '22px' }}>
              <Skeleton width="180px" height="18px" />
              <Skeleton width="60px" height="18px" borderRadius="9999px" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <Skeleton width="140px" height="14px" />
                  <Skeleton width="40px" height="14px" />
                </div>
                <Skeleton width="100%" height="6px" borderRadius="9999px" />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <Skeleton width="160px" height="14px" />
                  <Skeleton width="40px" height="14px" />
                </div>
                <Skeleton width="100%" height="6px" borderRadius="9999px" />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <Skeleton width="120px" height="14px" />
                  <Skeleton width="40px" height="14px" />
                </div>
                <Skeleton width="100%" height="6px" borderRadius="9999px" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const TableSkeleton = ({ rows = 5, cols = 8 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rIdx) => (
        <tr key={rIdx}>
          {Array.from({ length: cols }).map((_, cIdx) => (
            <td key={cIdx}>
              <Skeleton
                width={cIdx === 0 ? '110px' : cIdx === 1 ? '90px' : '70px'}
                height="14px"
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

export const PredictResultSkeleton = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '10px 0' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        <Skeleton width="180px" height="90px" borderRadius="90px 90px 0 0" />
        <Skeleton width="80px" height="28px" style={{ marginTop: '4px' }} />
        <Skeleton width="120px" height="12px" />
        <Skeleton width="110px" height="22px" borderRadius="9999px" />
      </div>

      <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
        <Skeleton width="160px" height="16px" style={{ marginBottom: '6px' }} />
        <Skeleton width="100%" height="12px" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Skeleton width="180px" height="14px" />
        <Skeleton width="100%" height="38px" borderRadius="8px" />
        <Skeleton width="100%" height="38px" borderRadius="8px" />
      </div>
    </div>
  );
};

export const ThresholdSimulatorSkeleton = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="grid-2">
        <div style={{ padding: '14px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
          <Skeleton width="90px" height="12px" style={{ marginBottom: '8px' }} />
          <Skeleton width="60px" height="24px" style={{ marginBottom: '6px' }} />
          <Skeleton width="100px" height="12px" />
        </div>
        <div style={{ padding: '14px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
          <Skeleton width="110px" height="12px" style={{ marginBottom: '8px' }} />
          <Skeleton width="75px" height="24px" style={{ marginBottom: '6px' }} />
          <Skeleton width="120px" height="12px" />
        </div>
      </div>
      <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
        <Skeleton width="130px" height="14px" style={{ marginBottom: '6px' }} />
        <Skeleton width="100%" height="12px" style={{ marginBottom: '4px' }} />
        <Skeleton width="80%" height="12px" />
      </div>
    </div>
  );
};

export default Skeleton;
