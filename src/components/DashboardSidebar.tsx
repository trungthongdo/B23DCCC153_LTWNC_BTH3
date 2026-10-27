'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CheckCircle2, UserCircle, Shield, Home, ListOrdered } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'admin';

  const navItems = [
    {
      href: '/dashboard',
      label: 'Tổng quan & Tiến độ',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: '/dashboard/completed',
      label: 'Bài tập đã xong',
      icon: CheckCircle2,
      exact: false,
    },
    {
      href: '/dashboard/profile',
      label: 'Hồ sơ & Phân quyền',
      icon: UserCircle,
      exact: false,
    },
  ];

  return (
    <aside
      className="glass-panel"
      style={{
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        minHeight: '480px',
      }}
    >
      <div>
        <div style={{ padding: '0 12px 16px 12px', borderBottom: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>
            Menu Sinh Viên
          </span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '14px' }}>
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                id={`sidebar-link-${item.href.replace(/\//g, '-')}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 600 : 500,
                  transition: 'all 0.2s ease',
                  background: isActive ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                  color: isActive ? '#c7d2fe' : 'var(--text-secondary)',
                  border: `1px solid ${isActive ? 'rgba(99, 102, 241, 0.4)' : 'transparent'}`,
                }}
              >
                <Icon
                  size={18}
                  style={{
                    color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  }}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {isAdmin && (
          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--ptit-red)', fontWeight: 700, letterSpacing: '0.05em', padding: '0 12px', display: 'block', marginBottom: '8px' }}>
              Ban Cán Sự
            </span>
            <Link
              href="/admin"
              id="sidebar-admin-link"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9rem',
                fontWeight: pathname === '/admin' ? 600 : 500,
                background: pathname === '/admin' ? 'rgba(225, 29, 72, 0.2)' : 'rgba(225, 29, 72, 0.08)',
                color: '#fda4af',
                border: '1px solid rgba(225, 29, 72, 0.3)',
              }}
            >
              <Shield size={18} style={{ color: 'var(--ptit-red)' }} />
              <span>Trang Quản Trị Admin</span>
            </Link>
          </div>
        )}
      </div>

      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Link
          href="/deadlines"
          className="btn btn-secondary"
          style={{ width: '100%', fontSize: '0.825rem', justifyContent: 'flex-start' }}
        >
          <ListOrdered size={15} /> Tất cả Deadline
        </Link>
        <Link
          href="/"
          className="btn btn-outline"
          style={{ width: '100%', fontSize: '0.825rem', justifyContent: 'flex-start' }}
        >
          <Home size={15} /> Về Trang Chủ
        </Link>
      </div>
    </aside>
  );
}
