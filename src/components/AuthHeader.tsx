'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { LogIn, LogOut, User as UserIcon, Shield, LayoutDashboard, Crown } from 'lucide-react';

export default function AuthHeader() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div
          style={{
            width: '80px',
            height: '32px',
            background: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-md)',
            animation: 'pulse 1.5s infinite',
          }}
        />
      </div>
    );
  }

  if (!session || !session.user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Link
          href="/login"
          id="header-login-btn"
          className="btn btn-primary"
          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
        >
          <LogIn size={15} />
          <span>Đăng nhập</span>
        </Link>
      </div>
    );
  }

  const user = session.user;
  const isAdmin = user.role === 'admin';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
      {/* Role and User info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: isAdmin
              ? 'linear-gradient(135deg, #e11d48, #be123c)'
              : 'linear-gradient(135deg, #6366f1, #4338ca)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 700,
            fontSize: '0.85rem',
            border: '2px solid rgba(255, 255, 255, 0.15)',
          }}
        >
          {isAdmin ? <Crown size={16} /> : user.name?.charAt(0) || 'U'}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {user.name}
            </span>
            <span className={`badge ${isAdmin ? 'badge-ptit' : 'badge-primary'}`} style={{ padding: '1px 6px', fontSize: '0.7rem' }}>
              {isAdmin ? 'Lớp trưởng' : 'Sinh viên'}
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {user.email}
          </span>
        </div>
      </div>

      {/* Navigation Quick Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Link
          href="/dashboard"
          id="header-dashboard-link"
          className="btn btn-secondary"
          style={{ padding: '7px 12px', fontSize: '0.8rem' }}
        >
          <LayoutDashboard size={14} />
          <span>Dashboard</span>
        </Link>

        {isAdmin && (
          <Link
            href="/admin"
            id="header-admin-link"
            className="btn btn-ptit"
            style={{ padding: '7px 12px', fontSize: '0.8rem' }}
          >
            <Shield size={14} />
            <span>Quản trị</span>
          </Link>
        )}

        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          id="header-logout-btn"
          className="btn btn-outline"
          style={{ padding: '7px 12px', fontSize: '0.8rem', color: '#fca5a5', borderColor: 'rgba(239, 68, 68, 0.3)' }}
          title="Đăng xuất"
        >
          <LogOut size={14} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
}
