import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { ArrowLeft, ExternalLink, Shield } from 'lucide-react';
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

  if (!session || !session.user) {
    redirect('/login?callbackUrl=/admin');
  }

  if (session.user.role !== 'admin' || !can(session.user.role, 'create_deadline')) {
    redirect('/403');
  }

  const subjects = await getSubjects();
  const deadlines = await getDeadlines();

  return (
    <div className="container" style={{ paddingTop: '24px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
              Quản trị Deadline Lớp
            </h1>
            <span className="badge badge-ptit">
              Lớp trưởng (Admin)
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
            Thêm mới, theo dõi và quản lý toàn bộ hạn nộp bài tập của lớp
          </p>
        </div>

        <Link href="/dashboard" className="btn btn-secondary" style={{ fontSize: '0.8125rem', padding: '6px 12px' }}>
          <ArrowLeft size={13} />
          <span>Về Dashboard</span>
        </Link>
      </div>

      {/* Add Deadline Form */}
      <AdminDeadlineForm subjects={subjects} />

      {/* Deadlines Table */}
      <div className="saas-card" style={{ overflowX: 'auto' }}>
        <div
          style={{
            padding: '14px 16px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Danh sách quản trị bài tập ({deadlines.length})
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Lưu trữ: <code>deadlines.json</code>
          </span>
        </div>

        <table className="saas-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>ID</th>
              <th>Tiêu đề deadline</th>
              <th style={{ width: '180px' }}>Môn học</th>
              <th style={{ width: '150px' }}>Hạn chót</th>
              <th style={{ width: '100px' }}>Ưu tiên</th>
              <th style={{ width: '100px' }}>Đã nộp</th>
              <th style={{ width: '120px', textAlign: 'right' }}>Thao tác</th>
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
                <tr key={d.id}>
                  <td style={{ fontWeight: 600, color: 'var(--text-muted)' }}>
                    #{d.id}
                  </td>
                  <td>
                    <Link
                      href={`/deadlines/${d.id}`}
                      style={{ fontWeight: 600, color: 'var(--text-main)' }}
                    >
                      {d.title}
                    </Link>
                  </td>
                  <td>
                    <span className="badge badge-blue">
                      {d.subjectName}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                      {formatted}
                    </span>
                  </td>
                  <td>
                    {d.priority === 'high' ? (
                      <span className="badge badge-danger">Cao</span>
                    ) : d.priority === 'medium' ? (
                      <span className="badge badge-warning">Vừa</span>
                    ) : (
                      <span className="badge badge-neutral">Thấp</span>
                    )}
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: 'var(--success-text)', fontSize: '0.8125rem' }}>
                      {d.completedBy.length} SV
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '4px', alignItems: 'center' }}>
                      <Link
                        href={`/deadlines/${d.id}`}
                        className="btn btn-ghost"
                        style={{ padding: '4px 6px', fontSize: '0.75rem' }}
                        title="Xem trang"
                      >
                        <ExternalLink size={13} />
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
