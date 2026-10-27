import React from 'react';
import Link from 'next/link';
import { CalendarCheck2 } from 'lucide-react';
import AuthHeader from './AuthHeader';

export default function Header() {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-color)',
        padding: '10px 0',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        {/* Brand */}
        <Link
          href="/"
          id="logo-link"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--btn-dark-bg)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CalendarCheck2 size={16} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span
              style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                letterSpacing: '-0.01em',
              }}
            >
              Class Deadline Hub
            </span>
            <span
              style={{
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                fontWeight: 500,
              }}
            >
              PTIT
            </span>
          </div>
        </Link>

        {/* Navigation links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <Link
            href="/"
            style={{
              fontSize: '0.85rem',
              fontWeight: 500,
              color: 'var(--text-secondary)',
              transition: 'color 0.15s ease',
            }}
          >
            Trang chủ
          </Link>

          <Link
            href="/deadlines"
            style={{
              fontSize: '0.85rem',
              fontWeight: 500,
              color: 'var(--text-secondary)',
              transition: 'color 0.15s ease',
            }}
          >
            Deadlines
          </Link>

          <Link
            href="/subjects/lap-trinh-web-nang-cao"
            style={{
              fontSize: '0.85rem',
              fontWeight: 500,
              color: 'var(--text-secondary)',
              transition: 'color 0.15s ease',
            }}
          >
            Môn học
          </Link>
        </nav>

        {/* Auth section */}
        <AuthHeader />
      </div>
    </header>
  );
}
