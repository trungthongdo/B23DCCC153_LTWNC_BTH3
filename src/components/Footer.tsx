import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer
      style={{
        marginTop: 'auto',
        borderTop: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-surface)',
        padding: '24px 0',
        fontSize: '0.8125rem',
        color: 'var(--text-muted)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Class Deadline Hub</span>
          <span>•</span>
          <span>Khoa CNTT - Học viện Công nghệ Bưu chính Viễn thông</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/deadlines" style={{ color: 'var(--text-secondary)' }}>
            Tất cả Deadline
          </Link>
          <Link href="/sitemap.xml" target="_blank" style={{ color: 'var(--text-muted)' }}>
            Sitemap
          </Link>
          <Link href="/robots.txt" target="_blank" style={{ color: 'var(--text-muted)' }}>
            Robots
          </Link>
        </div>
      </div>
    </footer>
  );
}
