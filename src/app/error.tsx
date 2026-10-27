'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Error boundary caught:', error);
  }, [error]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '65vh',
        padding: '32px 20px',
        textAlign: 'center',
      }}
    >
      <div
        className="glass-panel"
        style={{
          maxWidth: '520px',
          width: '100%',
          padding: '40px 32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          border: '1px solid rgba(239, 68, 68, 0.3)',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ef4444',
          }}
        >
          <AlertTriangle size={32} />
        </div>

        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>
            Đã xảy ra sự cố không mong muốn
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.6 }}>
            Hệ thống không thể tải dữ liệu trang này. Bạn có thể thử tải lại hoặc quay về trang chủ.
          </p>
        </div>

        {error.message && (
          <div
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.825rem',
              color: '#fca5a5',
              fontFamily: 'monospace',
              textAlign: 'left',
              wordBreak: 'break-all',
            }}
          >
            Lỗi: {error.message}
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '12px' }}>
          <button
            onClick={() => reset()}
            id="retry-button"
            className="btn btn-primary"
            style={{ minWidth: '130px' }}
          >
            <RotateCcw size={16} /> Thử lại
          </button>
          <Link href="/" className="btn btn-secondary" style={{ minWidth: '130px' }}>
            <Home size={16} /> Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
