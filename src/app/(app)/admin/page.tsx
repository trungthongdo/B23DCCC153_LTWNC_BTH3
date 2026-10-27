import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import {
  Shield,
  Crown,
  Calendar,
  Layers,
  ArrowRight,
  ExternalLink,
  Users,
  AlertTriangle,
} from 'lucide-react';
import { authOptions } from '@/lib/auth';
import { can } from '@/lib/permissions';
import { getDeadlines, getSubjects } from '@/lib/data';
import AdminDeadlineForm from '@/components/AdminDeadlineForm';
import DeleteDeadlineButton from '@/components/DeleteDeadlineButton';

// CHIẾN LƯỢC RENDER: SSR (Server-Side Rendering)
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Quản Trị Lớp Học | Class Deadline Hub',
  description: 'Trang quản trị dành riêng cho Lớp trưởng PTIT.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  // 1. Kiểm tra xác thực (Bảo vệ đa tầng - Lớp Server Component)
  if (!session || !session.user) {
    redirect('/login?callbackUrl=/admin');
  }

  // 2. Kiểm tra phân quyền đa tầng qua can(role, action)
  if (session.user.role !== 'admin' || !can(session.user.role, 'create_deadline')) {
    redirect('/403');
  }

  const subjects = await getSubjects();
  const deadlines = await getDeadlines();

  return (
    <div className="container" style={{ paddingTop: '32px' }}>
      {/* Header section */}
      <div
        className="glass-panel"
        style={{
          padding: '28px 32px',
          marginBottom: '32px',
          borderLeft: '6px solid var(--ptit-red)',
          background: 'linear-gradient(135deg, rgba(225, 29, 72, 0.12) 0%, rgba(16, 22, 34, 0.8) 100%)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="badge badge-ptit">
            <Crown size={12} /> Ban Cán Sự • Lớp Trưởng
          </span>
          <span className="badge badge-warning">SSR (Server-Side Rendering)</span>
          <span className="badge badge-neutral">Defense-in-Depth Active</span>
        </div>

        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.2rem)', fontWeight: 800 }}>
          Bảng Điều Khiển Quản Trị Deadline
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', marginTop: '6px' }}>
          Thêm mới, chỉnh sửa và xoá các hạn nộp bài tập của cả lớp. Khi bạn thao tác, hệ thống sẽ thực hiện on-demand revalidation để cập nhật ngay lập tức các trang tĩnh ISR.
        </p>
      </div>

      {/* Add Deadline Form */}
      <AdminDeadlineForm subjects={subjects} />

      {/* Deadlines Table */}
      <div className="glass-panel" style={{ padding: '28px', overflowX: 'auto' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={18} style={{ color: 'var(--primary)' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              Danh Sách Quản Lý Tất Cả Deadline ({deadlines.length})
            </h2>
          </div>

          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Dữ liệu lưu tại: <code>src/data/deadlines.json</code>
          </span>
        </div>

        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.875rem',
            textAlign: 'left',
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: '1px solid var(--border-medium)',
                color: 'var(--text-secondary)',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              <th style={{ padding: '12px 14px' }}>ID</th>
              <th style={{ padding: '12px 14px' }}>Tiêu đề</th>
              <th style={{ padding: '12px 14px' }}>Môn học</th>
              <th style={{ padding: '12px 14px' }}>Hạn chót</th>
              <th style={{ padding: '12px 14px' }}>Ưu tiên</th>
              <th style={{ padding: '12px 14px' }}>Đã nộp</th>
              <th style={{ padding: '12px 14px', textAlign: 'right' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {deadlines.map((d) => {
              const dateObj = new Date(d.dueDate);
              const formatted = new Intl.DateTimeFormat('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }).format(dateObj);

              return (
                <tr
                  key={d.id}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    transition: 'background-color 0.15s',
                  }}
                  className="table-row-hover"
                >
                  <td style={{ padding: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>
                    #{d.id}
                  </td>
                  <td style={{ padding: '14px', maxWidth: '300px' }}>
                    <Link
                      href={`/deadlines/${d.id}`}
                      style={{ fontWeight: 600, color: 'var(--text-primary)' }}
                      className="hover-underline"
                    >
                      {d.title}
                    </Link>
                  </td>
                  <td style={{ padding: '14px' }}>
                    <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                      {d.subjectName}
                    </span>
                  </td>
                  <td style={{ padding: '14px', color: 'var(--text-secondary)' }}>
                    {formatted}
                  </td>
                  <td style={{ padding: '14px' }}>
                    <span
                      className={`badge ${
                        d.priority === 'high'
                          ? 'badge-danger'
                          : d.priority === 'medium'
                          ? 'badge-warning'
                          : 'badge-neutral'
                      }`}
                      style={{ fontSize: '0.72rem' }}
                    >
                      {d.priority === 'high' ? 'Cao' : d.priority === 'medium' ? 'Vừa' : 'Thấp'}
                    </span>
                  </td>
                  <td style={{ padding: '14px', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                    {d.completedBy.length} SV
                  </td>
                  <td style={{ padding: '14px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                      <Link
                        href={`/deadlines/${d.id}`}
                        className="btn btn-secondary"
                        style={{ padding: '6px 10px', fontSize: '0.785rem' }}
                        title="Xem trang công khai"
                      >
                        <ExternalLink size={13} />
                        <span>Xem</span>
                      </Link>

                      <DeleteDeadlineButton deadlineId={d.id} deadlineTitle={d.title} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
