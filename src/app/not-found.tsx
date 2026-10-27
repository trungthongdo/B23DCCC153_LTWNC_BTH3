import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '65vh',
        padding: '24px 20px',
        textAlign: 'center',
      }}
    >
      <div
        className="saas-card"
        style={{
          maxWidth: '440px',
          width: '100%',
          padding: '32px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '14px',
        }}
      >
        <div
          style={{
            fontSize: '2rem',
            fontWeight: 800,
            color: 'var(--text-muted)',
            letterSpacing: '-0.03em',
            lineHeight: 1,
          }}
        >
          404
        </div>

        <div>
          <h1 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
            Không tìm thấy trang
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', lineHeight: 1.5 }}>
            Deadline hoặc trang bạn tìm kiếm không tồn tại, đã bị xoá hoặc đường dẫn URL chưa chính xác.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
          <Link href="/deadlines" className="btn btn-primary" id="view-deadlines-btn" style={{ fontSize: '0.8125rem' }}>
            <ArrowLeft size={13} />
            <span>Xem danh sách deadline</span>
          </Link>
          <Link href="/" className="btn btn-secondary" id="back-home-btn" style={{ fontSize: '0.8125rem' }}>
            <Home size={13} />
            <span>Về Trang chủ</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
