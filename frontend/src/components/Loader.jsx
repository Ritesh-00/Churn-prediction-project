import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ size = 'md', text, overlay = false, color = '#2563eb' }) => {
  const sizeMap = {
    xs: 14,
    sm: 16,
    md: 22,
    lg: 32,
    xl: 44,
  };

  const iconSize = sizeMap[size] || 22;

  const content = (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        color: '#334155',
        fontFamily: 'inherit',
      }}
    >
      <Loader2
        size={iconSize}
        color={color}
        className="animate-spin"
        style={{ flexShrink: 0 }}
      />
      {text && (
        <span style={{ fontSize: size === 'sm' || size === 'xs' ? '0.8rem' : '0.875rem', fontWeight: 500, color: '#475569' }}>
          {text}
        </span>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(1.5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          borderRadius: 'inherit',
        }}
      >
        {content}
      </div>
    );
  }

  return content;
};

export default Loader;
