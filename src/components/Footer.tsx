import React from 'react';
import Link from 'next/link';
import { CalendarClock, Shield, Cpu, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      style={{
        marginTop: 'auto',
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(10, 13, 20, 0.95)',
        padding: '40px 0 24px 0',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '32px',
            marginBottom: '32px',
          }}
        >
          {/* Col 1 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  background: 'linear-gradient(135deg, #e11d48, #6366f1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                }}
              >
                <CalendarClock size={16} />
              </div>
              <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>Class Deadline Hub</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '12px' }}>
              Cổng thông tin deadline và quản lý tiến độ học tập lớp học chuyên ngành Công nghệ Thông tin, Học viện Công nghệ Bưu chính Viễn thông (PTIT).
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span className="badge badge-ptit">Học Viện PTIT</span>
              <span className="badge badge-primary">Next.js App Router</span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 style={{ fontSize: '0.925rem', fontWeight: 600, marginBottom: '14px', color: 'var(--text-primary)' }}>
              Chiến lược Rendering
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <li>
                <span className="badge badge-success" style={{ marginRight: '6px', fontSize: '0.7rem' }}>SSG</span>
                <span>Trang chủ (<code>/</code>) & Môn học (<code>/subjects/[slug]</code>)</span>
              </li>
              <li>
                <span className="badge badge-primary" style={{ marginRight: '6px', fontSize: '0.7rem' }}>ISR</span>
                <span>Deadlines 60s (<code>/deadlines</code> & <code>/deadlines/[id]</code>)</span>
              </li>
              <li>
                <span className="badge badge-warning" style={{ marginRight: '6px', fontSize: '0.7rem' }}>SSR</span>
                <span>Dashboard (<code>/dashboard</code>) & Admin (<code>/admin</code>)</span>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 style={{ fontSize: '0.925rem', fontWeight: 600, marginBottom: '14px', color: 'var(--text-primary)' }}>
              Tài khoản Demo
            </h4>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ padding: '8px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                <strong>Lớp trưởng (Admin):</strong> <code>admin@ptit.edu.vn</code> | <code>admin123</code>
              </div>
              <div style={{ padding: '8px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                <strong>Sinh viên (User):</strong> <code>sv@ptit.edu.vn</code> | <code>sv123456</code>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
          }}
        >
          <span>© 2026 PTIT Class Deadline Hub. Lập trình Web Nâng cao (BTTH 3 - Buổi 7 & Buổi 8).</span>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Link href="/sitemap.xml" target="_blank" style={{ color: 'var(--text-muted)', textDecoration: 'underline' }}>
              Sitemap.xml
            </Link>
            <Link href="/robots.txt" target="_blank" style={{ color: 'var(--text-muted)', textDecoration: 'underline' }}>
              Robots.txt
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
