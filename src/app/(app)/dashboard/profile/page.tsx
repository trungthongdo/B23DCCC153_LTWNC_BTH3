import React from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Check, X, Shield, User } from 'lucide-react';
import { authOptions } from '@/lib/auth';
import { can } from '@/lib/permissions';
import { Action } from '@/types';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/login?callbackUrl=/dashboard/profile');
  }

  const user = session.user;
  const role = user.role;
  const isAdmin = role === 'admin';

  const actions: { id: Action; label: string; desc: string }[] = [
    {
      id: 'view_deadline',
      label: 'Xem deadline công khai',
      desc: 'Truy cập danh sách bài tập, chi tiết và hạn nộp',
    },
    {
      id: 'toggle_complete',
      label: 'Đánh dấu hoàn thành deadline',
      desc: 'Chuyển đổi trạng thái bài tập cá nhân',
    },
    {
      id: 'create_deadline',
      label: 'Thêm deadline mới',
      desc: 'Tạo bài tập lớn, bài tập tuần cho cả lớp',
    },
    {
      id: 'delete_deadline',
      label: 'Xoá deadline',
      desc: 'Xoá vĩnh viễn bài tập khỏi hệ thống lớp',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Profile Overview Card */}
      <div className="saas-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: isAdmin ? 'var(--ptit-red)' : 'var(--btn-dark-bg)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              fontWeight: 700,
            }}
          >
            {user.name?.charAt(0) || 'U'}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {user.name}
              </h1>
              <span className={`badge ${isAdmin ? 'badge-ptit' : 'badge-neutral'}`}>
                {isAdmin ? 'Lớp trưởng (Admin)' : 'Sinh viên (User)'}
              </span>
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {user.email} • ID: #{user.id}
            </div>
          </div>
        </div>
      </div>

      {/* Permissions Matrix Table */}
      <div className="saas-card" style={{ padding: '20px' }}>
        <div style={{ marginBottom: '14px' }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '2px' }}>
            Phân quyền tài khoản
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
            Được kiểm soát tập trung qua hàm <code>can(role, action)</code>
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {actions.map((act) => {
            const hasPermission = can(role, act.id);

            return (
              <div
                key={act.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-main)' }}>
                    {act.label}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {act.desc}
                  </div>
                </div>

                <div>
                  {hasPermission ? (
                    <span className="badge badge-success">
                      <Check size={12} /> Cho phép
                    </span>
                  ) : (
                    <span className="badge badge-neutral">
                      <X size={12} /> Không có quyền
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
