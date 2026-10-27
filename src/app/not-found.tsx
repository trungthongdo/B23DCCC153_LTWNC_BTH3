import React from 'react';
import Link from 'next/link';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        padding: '32px 20px',
        textAlign: 'center',
      }}
    >
      <div
        className="glass-panel"
        style={{
          maxWidth: '540px',
          width: '100%',
          padding: '48px 36px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
        }}
      >
        <div
          style={{
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontSize: '6rem',
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: '-0.05em',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.4) 0%, rgba(225, 29, 72, 0.4) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            404
          </span>
          <div
            style={{
              position: 'absolute',
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-medium)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-amber)',
            }}
          >
            <FileQuestion size={28} />
          </div>
        </div>

        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '8px' }}>
            Không tìm thấy trang yêu cầu
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Deadline hoặc trang bạn đang tìm kiếm không tồn tại, đã bị xoá hoặc đường dẫn URL không chính xác.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/deadlines" className="btn btn-primary" id="view-deadlines-btn">
            <ArrowLeft size={16} /> Danh sách Deadline
          </Link>
          <Link href="/" className="btn btn-secondary" id="back-home-btn">
            <Home size={16} /> Về Trang Chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
