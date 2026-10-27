import React from 'react';
import Link from 'next/link';
import { CalendarClock, BookOpen, Layers } from 'lucide-react';
import AuthHeader from './AuthHeader';

export default function Header() {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(10, 13, 20, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '12px 0',
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
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
          id="logo-link"
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #e11d48 0%, #6366f1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 4px 12px rgba(225, 29, 72, 0.3)',
            }}
          >
            <CalendarClock size={22} />
          </div>
          <div>
            <span
              style={{
                fontSize: '1.15rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: 'var(--text-primary)',
                display: 'block',
                lineHeight: 1.1,
              }}
            >
              Class <span style={{ color: '#e11d48' }}>Deadline</span> Hub
            </span>
            <span
              style={{
                fontSize: '0.68rem',
                letterSpacing: '0.05em',
                color: 'var(--text-secondary)',
                fontWeight: 600,
                textTransform: 'uppercase',
              }}
            >
              PTIT Portal
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
          className="desktop-nav"
        >
          <Link
            href="/"
            style={{
              fontSize: '0.9rem',
              fontWeight: 500,
              color: 'var(--text-secondary)',
              transition: 'color 0.2s',
            }}
            className="nav-link"
          >
            Trang chủ
          </Link>

          <Link
            href="/deadlines"
            style={{
              fontSize: '0.9rem',
              fontWeight: 500,
              color: 'var(--text-secondary)',
              transition: 'color 0.2s',
            }}
            className="nav-link"
          >
            Deadlines (ISR)
          </Link>

          <Link
            href="/subjects/lap-trinh-web-nang-cao"
            style={{
              fontSize: '0.9rem',
              fontWeight: 500,
              color: 'var(--text-secondary)',
              transition: 'color 0.2s',
            }}
            className="nav-link"
          >
            Môn học (SSG)
          </Link>
        </nav>

        {/* Auth section */}
        <AuthHeader />
      </div>
    </header>
  );
}
