import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: '403 - Không Có Quyền Truy Cập | Class Deadline Hub',
  description: 'Trang này chỉ dành riêng cho Ban Cán sự / Lớp trưởng.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ForbiddenPage() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '65vh',
        padding: '24px 20px',
      }}
    >
      <div
        className="saas-card"
        style={{
          maxWidth: '440px',
          width: '100%',
          padding: '28px 24px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '14px',
        }}
      >
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            backgroundColor: 'var(--danger-surface)',
            color: 'var(--danger)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ShieldAlert size={24} />
        </div>

        <div>
          <h1 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
            403 - Quyền truy cập bị từ chối
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', lineHeight: 1.5 }}>
            Bạn không có quyền truy cập vào khu vực Quản trị (<code>/admin</code>). Trang này chỉ dành riêng cho tài khoản có vai trò <strong>Lớp trưởng (Admin)</strong>.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
          <Link href="/dashboard" className="btn btn-primary" id="forbidden-dashboard-btn" style={{ fontSize: '0.8125rem' }}>
            <span>Đến Dashboard</span>
          </Link>
          <Link href="/" className="btn btn-secondary" id="forbidden-home-btn" style={{ fontSize: '0.8125rem' }}>
            <span>Về Trang chủ</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
