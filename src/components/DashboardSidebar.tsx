'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CheckCircle2, User, Shield, ArrowLeft } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'admin';

  const navItems = [
    {
      href: '/dashboard',
      label: 'Tổng quan',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: '/dashboard/completed',
      label: 'Đã hoàn thành',
      icon: CheckCircle2,
      exact: false,
    },
    {
      href: '/dashboard/profile',
      label: 'Hồ sơ & Quyền',
      icon: User,
      exact: false,
    },
  ];

  return (
    <aside
      className="saas-card"
      style={{
        padding: '16px 12px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '20px',
      }}
    >
      <div>
        <div
          style={{
            padding: '4px 10px 10px 10px',
            borderBottom: '1px solid var(--border-color)',
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: 'var(--text-muted)',
          }}
        >
          Menu Cá Nhân
        </div>

        <nav
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            marginTop: '10px',
          }}
        >
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
                  gap: '9px',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.84rem',
                  fontWeight: isActive ? 600 : 500,
                  transition: 'all 0.15s ease',
                  backgroundColor: isActive ? 'var(--bg-subtle)' : 'transparent',
                  color: isActive ? 'var(--text-main)' : 'var(--text-secondary)',
                  borderLeft: isActive ? '3px solid var(--btn-dark-bg)' : '3px solid transparent',
                }}
              >
                <Icon
                  size={15}
                  style={{
                    color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                  }}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {isAdmin && (
            <Link
              href="/admin"
              id="sidebar-admin-link"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '9px',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.84rem',
                fontWeight: pathname === '/admin' ? 600 : 500,
                backgroundColor: pathname === '/admin' ? 'var(--ptit-red-surface)' : 'transparent',
                color: 'var(--ptit-red)',
                borderLeft: pathname === '/admin' ? '3px solid var(--ptit-red)' : '3px solid transparent',
                marginTop: '6px',
              }}
            >
              <Shield size={15} />
              <span>Quản trị Lớp (Admin)</span>
            </Link>
          )}
        </nav>
      </div>

      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
        <Link
          href="/deadlines"
          className="btn btn-ghost"
          style={{
            width: '100%',
            justifyContent: 'flex-start',
            fontSize: '0.8125rem',
            padding: '6px 10px',
          }}
        >
          <ArrowLeft size={13} />
          <span>Tất cả deadline</span>
        </Link>
      </div>
    </aside>
  );
}
