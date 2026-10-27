'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { LogIn, LogOut, LayoutDashboard, Shield } from 'lucide-react';

export default function AuthHeader() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div style={{ width: '70px', height: '28px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }} />
    );
  }

  if (!session || !session.user) {
    return (
      <Link
        href="/login"
        id="header-login-btn"
        className="btn btn-primary"
        style={{ padding: '6px 12px', fontSize: '0.8125rem' }}
      >
        <LogIn size={14} />
        <span>Đăng nhập</span>
      </Link>
    );
  }

  const user = session.user;
  const isAdmin = user.role === 'admin';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      {/* User profile pill */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '3px 8px 3px 4px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--bg-subtle)',
          border: '1px solid var(--border-color)',
        }}
      >
        <div
          style={{
            width: '22px',
            height: '22px',
            borderRadius: '50%',
            backgroundColor: isAdmin ? 'var(--ptit-red)' : 'var(--primary)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.7rem',
            fontWeight: 700,
          }}
        >
          {user.name?.charAt(0) || 'U'}
        </div>

        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)' }}>
          {user.name?.split(' ')[0]}
        </span>

        <span
          className={`badge ${isAdmin ? 'badge-ptit' : 'badge-neutral'}`}
          style={{ fontSize: '0.68rem', padding: '1px 5px' }}
        >
          {isAdmin ? 'Admin' : 'SV'}
        </span>
      </div>

      {/* Navigation Quick Links */}
      <Link
        href="/dashboard"
        id="header-dashboard-link"
        className="btn btn-secondary"
        style={{ padding: '5px 10px', fontSize: '0.8125rem' }}
      >
        <LayoutDashboard size={13} />
        <span>Dashboard</span>
      </Link>

      {isAdmin && (
        <Link
          href="/admin"
          id="header-admin-link"
          className="btn btn-secondary"
          style={{
            padding: '5px 10px',
            fontSize: '0.8125rem',
            color: 'var(--ptit-red)',
            borderColor: 'var(--ptit-red-border)',
            backgroundColor: 'var(--ptit-red-surface)',
          }}
        >
          <Shield size={13} />
          <span>Quản trị</span>
        </Link>
      )}

      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        id="header-logout-btn"
        className="btn btn-ghost"
        style={{ padding: '5px 8px', fontSize: '0.8125rem' }}
        title="Đăng xuất"
      >
        <LogOut size={13} />
        <span>Thoát</span>
      </button>
    </div>
  );
}
