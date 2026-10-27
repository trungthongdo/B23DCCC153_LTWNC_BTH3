import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Flame,
  ArrowRight,
  TrendingUp,
  BookmarkCheck,
  Calendar,
} from 'lucide-react';
import { authOptions } from '@/lib/auth';
import { getDeadlines, getSubjects } from '@/lib/data';
import DeadlineCard from '@/components/DeadlineCard';

// CHIẾN LƯỢC RENDER: SSR (Server-Side Rendering)
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/login?callbackUrl=/dashboard');
  }

  const userId = session.user.id;
  const deadlines = await getDeadlines();
  const subjects = await getSubjects();

  const now = Date.now();
  const completedDeadlines = deadlines.filter((d) => d.completedBy.includes(userId));
  const pendingDeadlines = deadlines.filter((d) => !d.completedBy.includes(userId));
  const overdueDeadlines = pendingDeadlines.filter(
    (d) => new Date(d.dueDate).getTime() < now
  );
  const urgentUpcoming = pendingDeadlines
    .filter((d) => new Date(d.dueDate).getTime() >= now)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const total = deadlines.length;
  const completedCount = completedDeadlines.length;
  const percentComplete = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Welcome Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '28px 32px',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(16, 22, 34, 0.8) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="badge badge-warning">SSR (Server-Side Rendering)</span>
          <span className="badge badge-neutral">ID Sinh viên: #{userId}</span>
        </div>

        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '8px' }}>
          Xin chào, <span className="gradient-text">{session.user.name}</span>! 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Dưới đây là tiến độ học tập và các bài tập cần hoàn thành trong học kỳ này của bạn.
        </p>

        {/* Progress Bar Container */}
        <div style={{ marginTop: '24px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px',
              fontSize: '0.875rem',
            }}
          >
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
              Tiến độ hoàn thành bài tập kỳ này
            </span>
            <span style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>
              {percentComplete}% ({completedCount}/{total})
            </span>
          </div>

          <div
            style={{
              width: '100%',
              height: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${percentComplete}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #6366f1 0%, #10b981 100%)',
                borderRadius: 'var(--radius-full)',
                transition: 'width 0.5s ease',
              }}
            />
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
        }}
      >
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', color: 'var(--primary)' }}>
            <Calendar size={18} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Tổng bài tập</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{total}</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', color: 'var(--accent-emerald)' }}>
            <CheckCircle2 size={18} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Đã hoàn thành</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
            {completedCount}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', color: 'var(--accent-amber)' }}>
            <Clock size={18} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Cần làm tiếp</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
            {pendingDeadlines.length}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', color: 'var(--accent-rose)' }}>
            <AlertTriangle size={18} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Quá hạn nộp</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-rose)' }}>
            {overdueDeadlines.length}
          </div>
        </div>
      </div>

      {/* Urgent Pending Deadlines Section */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Flame size={20} style={{ color: 'var(--accent-rose)' }} />
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>
              Bài Tập Cần Ưu Tiên Hoàn Thành
            </h2>
          </div>
          <Link href="/deadlines" className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>
            Xem toàn bộ ({total}) <ArrowRight size={14} />
          </Link>
        </div>

        {urgentUpcoming.length > 0 ? (
          <div className="grid-cards">
            {urgentUpcoming.slice(0, 4).map((d) => (
              <DeadlineCard key={d.id} deadline={d} currentUserId={userId} />
            ))}
          </div>
        ) : (
          <div
            className="glass-panel"
            style={{
              padding: '36px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <CheckCircle2 size={40} style={{ color: 'var(--accent-emerald)' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Tuyệt vời! Bạn không còn deadline nào tồn đọng</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Tất cả bài tập đã được bạn đánh dấu hoàn thành hoặc chưa có bài tập mới.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
