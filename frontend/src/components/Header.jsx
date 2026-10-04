import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkSystemHealth } from '../features/health/healthSlice';
import {
  LayoutGrid,
  User,
  FileText,
  Users,
  SlidersHorizontal,
} from 'lucide-react';

const Header = ({ activeTab, setActiveTab }) => {
  const dispatch = useDispatch();
  const { globalThreshold } = useSelector((state) => state.prediction);

  useEffect(() => {
    dispatch(checkSystemHealth());
    const interval = setInterval(() => {
      dispatch(checkSystemHealth());
    }, 15000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'predict', label: 'Single Prediction', icon: User },
    { id: 'batch', label: 'Batch CSV', icon: FileText },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'threshold', label: 'Threshold Simulator', icon: SlidersHorizontal },
  ];

  return (
    <header
      style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          maxWidth: '1360px',
          margin: '0 auto',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Custom 3-Bar Chart Icon */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '22px' }}>
            <div style={{ width: '4.5px', height: '12px', backgroundColor: '#2563eb', borderRadius: '3px' }} />
            <div style={{ width: '4.5px', height: '17px', backgroundColor: '#2563eb', borderRadius: '3px' }} />
            <div style={{ width: '4.5px', height: '22px', backgroundColor: '#2563eb', borderRadius: '3px' }} />
          </div>

          <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em', marginLeft: '4px' }}>
            ChurnShield
          </span>

          <span
            style={{
              fontSize: '0.725rem',
              fontWeight: 500,
              padding: '2px 8px',
              borderRadius: '9999px',
              backgroundColor: '#f1f5f9',
              color: '#64748b',
              marginLeft: '4px',
            }}
          >
            v1.0
          </span>
        </div>

        {/* Center Navigation Tabs */}
        <nav className="nav-scroll-container" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  border: 'none',
                  backgroundColor: isActive ? '#eff6ff' : 'transparent',
                  color: isActive ? '#2563eb' : '#475569',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={16} color={isActive ? '#2563eb' : '#64748b'} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Status Badge */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              border: '1px solid #bfdbfe',
              borderRadius: '9999px',
              padding: '4px 14px',
              fontSize: '0.825rem',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            Cutoff: {(globalThreshold * 100).toFixed(0)}%
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
