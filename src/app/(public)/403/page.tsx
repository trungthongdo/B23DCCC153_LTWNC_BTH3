import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ShieldAlert, Home, LayoutDashboard, ArrowLeft } from 'lucide-react';

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
        minHeight: '70vh',
        padding: '30px 20px',
      }}
    >
      <div
        className="glass-panel"
        style={{
          maxWidth: '520px',
          width: '100%',
          padding: '44px 32px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          border: '1px solid rgba(225, 29, 72, 0.4)',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(225, 29, 72, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--ptit-red)',
          }}
        >
          <ShieldAlert size={36} />
        </div>

        <div>
          <span
            className="badge badge-ptit"
            style={{ marginBottom: '10px', fontSize: '0.785rem' }}
          >
            Lỗi 403 - Forbidden
          </span>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '8px' }}>
            Truy Cập Bị Từ Chối
          </h1>
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.925rem',
              lineHeight: 1.6,
            }}
          >
            Bạn không có quyền truy cập vào trang Quản trị (<code>/admin</code>). Khu vực này chỉ dành cho tài khoản có vai trò <strong>Lớp trưởng (Admin)</strong>.
          </p>
        </div>

        <div
          style={{
            padding: '14px 16px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.825rem',
            color: 'var(--text-secondary)',
            textAlign: 'left',
            width: '100%',
          }}
        >
          <strong>Ma trận phân quyền (Buổi 8):</strong>
          <ul style={{ paddingLeft: '18px', marginTop: '6px', lineHeight: 1.5 }}>
            <li>Tài khoản sinh viên (<code>user</code>) chỉ được xem và đánh dấu hoàn thành bài tập cá nhân.</li>
            <li>Hành động Thêm / Xoá deadline yêu cầu quyền <code>create_deadline</code> / <code>delete_deadline</code>.</li>
          </ul>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/dashboard" className="btn btn-primary" id="forbidden-dashboard-btn">
            <LayoutDashboard size={16} /> Đến Dashboard
          </Link>
          <Link href="/" className="btn btn-secondary" id="forbidden-home-btn">
            <Home size={16} /> Về Trang Chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
