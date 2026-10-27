'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw } from 'lucide-react';

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
        minHeight: '60vh',
        padding: '24px 20px',
        textAlign: 'center',
      }}
    >
      <div
        className="saas-card"
        style={{
          maxWidth: '440px',
          width: '100%',
          padding: '28px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '14px',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'var(--danger-surface)',
            color: 'var(--danger)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AlertTriangle size={20} />
        </div>

        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>
            Đã xảy ra sự cố
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', lineHeight: 1.5 }}>
            Không thể tải nội dung trang này. Vui lòng bấm thử lại hoặc quay về trang chủ.
          </p>
        </div>

        {error.message && (
          <div
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: 'var(--radius-xs)',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-color)',
              fontSize: '0.75rem',
              color: 'var(--danger-text)',
              fontFamily: 'monospace',
              textAlign: 'left',
              wordBreak: 'break-all',
            }}
          >
            {error.message}
          </div>
        )}

        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
          <button
            onClick={() => reset()}
            id="retry-button"
            className="btn btn-primary"
            style={{ fontSize: '0.8125rem' }}
          >
            <RotateCcw size={13} />
            <span>Thử lại</span>
          </button>
          <Link href="/" className="btn btn-secondary" style={{ fontSize: '0.8125rem' }}>
            Về Trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
