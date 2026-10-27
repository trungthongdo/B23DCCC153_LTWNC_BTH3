import React from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { User, Shield, Check, X, ShieldCheck, Mail, Key, Crown } from 'lucide-react';
import { authOptions } from '@/lib/auth';
import { can, PERMISSION_MATRIX } from '@/lib/permissions';
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
      desc: 'Truy cập danh sách bài tập, chi tiết và thời hạn',
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Profile Header */}
      <div className="glass-panel" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: isAdmin
                ? 'linear-gradient(135deg, #e11d48, #be123c)'
                : 'linear-gradient(135deg, #6366f1, #4338ca)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.6rem',
              fontWeight: 800,
            }}
          >
            {isAdmin ? <Crown size={32} /> : user.name?.charAt(0) || 'U'}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{user.name}</h1>
              <span className={`badge ${isAdmin ? 'badge-ptit' : 'badge-primary'}`}>
                {isAdmin ? 'Lớp trưởng (Admin)' : 'Sinh viên (User)'}
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
              Email tài khoản: <code>{user.email}</code> • User ID: <code>#{user.id}</code>
            </p>
          </div>
        </div>
      </div>

      {/* Permission Matrix for this user */}
      <div className="glass-panel" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <ShieldCheck size={22} style={{ color: 'var(--primary)' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
            Kiểm Tra Phân Quyền Cá Nhân (can(role, action))
          </h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '20px' }}>
          Hệ thống phân quyền được thực thi tập trung qua hàm <code>can(role, action)</code> kết hợp kiểm tra hai lớp tại Middleware và Server Action.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {actions.map((act) => {
            const hasPermission = can(role, act.id);

            return (
              <div
                key={act.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(0, 0, 0, 0.25)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '2px' }}>
                    {act.label}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Action: <code>{act.id}</code> — {act.desc}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {hasPermission ? (
                    <span
                      className="badge badge-success"
                      style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                    >
                      <Check size={14} /> Có quyền (ALLOW)
                    </span>
                  ) : (
                    <span
                      className="badge badge-danger"
                      style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                    >
                      <X size={14} /> Bị từ chối (DENY)
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
