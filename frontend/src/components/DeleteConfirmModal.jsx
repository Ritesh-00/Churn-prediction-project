import React from 'react';
import { X } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, customerId, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(2px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '16px',
      }}
      onClick={onCancel}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          padding: '22px',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Close Button */}
        <button
          onClick={onCancel}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#94a3b8',
            padding: '4px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={18} />
        </button>

        {/* Content */}
        <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
          {/* <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
          </div> */}

          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
              Delete Customer
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.45 }}>
              Are you sure you want to remove customer{' '}
              <strong style={{ color: '#0f172a' }}>{customerId}</strong>? This action cannot be
              undone.
            </p>
          </div>
        </div>

        {/* Actions Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
            marginTop: '20px',
          }}
        >
          <button
            onClick={onCancel}
            style={{
              padding: '8px 14px',
              fontSize: '0.85rem',
              fontWeight: 500,
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              color: '#334155',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '8px 16px',
              fontSize: '0.85rem',
              fontWeight: 600,
              backgroundColor: '#dc2626',
              border: '1px solid #dc2626',
              borderRadius: '8px',
              color: '#ffffff',
              cursor: 'pointer',
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
