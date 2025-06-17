import React from 'react';

const ProgressSkeleton = () => (
  <div style={{
    width: '100%',
    minHeight: '60vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2rem',
    padding: '2rem 0',
  }}>
    <div style={{ width: 220, height: 32, borderRadius: 8, background: '#e5e7eb', marginBottom: 16 }} />
    <div style={{ width: '90%', maxWidth: 900, height: 120, borderRadius: 16, background: '#e5e7eb' }} />
    <div style={{ width: '90%', maxWidth: 900, height: 220, borderRadius: 16, background: '#e5e7eb' }} />
    <div style={{ width: '90%', maxWidth: 900, height: 120, borderRadius: 16, background: '#e5e7eb' }} />
  </div>
);

export default ProgressSkeleton;
