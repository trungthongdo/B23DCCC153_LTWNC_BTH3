'use client';

import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { ArrowRight, LayoutDashboard, Shield, LogIn } from 'lucide-react';

interface HomeHeroActionsProps {
  deadlinesCount: number;
}

export default function HomeHeroActions({ deadlinesCount }: HomeHeroActionsProps) {
  const { data: session, status } = useSession();

  const isAdmin = session?.user?.role === 'admin';
  const isAuthenticated = status === 'authenticated' && !!session?.user;

  return (
    <div>
      {isAuthenticated && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '5px 12px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--accent-subtle)',
            border: '1px solid var(--border-color)',
            fontSize: '0.8125rem',
            color: 'var(--text-main)',
            marginBottom: '14px',
          }}
        >
          {isAdmin ? (
            <Shield size={13} style={{ color: 'var(--ptit-red)' }} />
          ) : (
            <div
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'var(--success-text)',
              }}
            />
          )}
          <span>
            Đang đăng nhập: <strong>{session.user.name}</strong> ({isAdmin ? 'Lớp trưởng' : 'Sinh viên'})
          </span>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <Link href="/deadlines" className="btn btn-primary" id="home-view-deadlines-btn">
          <span>Xem tất cả deadline ({deadlinesCount})</span>
          <ArrowRight size={14} />
        </Link>

        {isAuthenticated ? (
          <Link
            href={isAdmin ? '/admin' : '/dashboard'}
            className="btn btn-secondary"
            id="home-dashboard-btn"
            style={{ fontWeight: 600 }}
          >
            <LayoutDashboard size={14} style={{ color: isAdmin ? 'var(--ptit-red)' : 'var(--primary)' }} />
            <span>{isAdmin ? 'Vào Trang quản trị' : 'Vào Bảng điều khiển'}</span>
            <ArrowRight size={13} />
          </Link>
        ) : (
          <Link href="/login" className="btn btn-secondary" id="home-login-btn">
            <LogIn size={14} />
            <span>Đăng nhập hệ thống</span>
          </Link>
        )}
      </div>
    </div>
  );
}
