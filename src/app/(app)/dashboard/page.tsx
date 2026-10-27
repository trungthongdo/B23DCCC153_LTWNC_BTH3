import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { authOptions } from '@/lib/auth';
import { getDeadlines } from '@/lib/data';
import DeadlineCard from '@/components/DeadlineCard';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/login?callbackUrl=/dashboard');
  }

  const userId = session.user.id;
  const deadlines = await getDeadlines();

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Welcome & Progress Card */}
      <div className="saas-card" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '2px' }}>
              Xin chào, {session.user.name}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
              Học kỳ này bạn đã hoàn thành {completedCount} trên tổng số {total} bài tập.
            </p>
          </div>

          <span className="badge badge-neutral">
            ID: #{userId}
          </span>
        </div>

        {/* Minimal Progress Bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.785rem', marginBottom: '6px' }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Tiến độ kỳ học</span>
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{percentComplete}%</span>
          </div>

          <div
            style={{
              width: '100%',
              height: '6px',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${percentComplete}%`,
                height: '100%',
                backgroundColor: 'var(--btn-dark-bg)',
                borderRadius: 'var(--radius-full)',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>
      </div>

      {/* KPI Metrics Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '12px',
        }}
      >
        <div className="saas-card" style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
            Tổng bài tập
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--text-main)' }}>
            {total}
          </div>
        </div>

        <div className="saas-card" style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
            Đã hoàn thành
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--success)' }}>
            {completedCount}
          </div>
        </div>

        <div className="saas-card" style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
            Cần hoàn thành
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--warning)' }}>
            {pendingDeadlines.length}
          </div>
        </div>

        <div className="saas-card" style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
            Đã quá hạn
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 700, color: overdueDeadlines.length > 0 ? 'var(--danger)' : 'var(--text-muted)' }}>
            {overdueDeadlines.length}
          </div>
        </div>
      </div>

      {/* Priority Pending Deadlines */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px',
          }}
        >
          <h2 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Bài tập cần làm tiếp ({pendingDeadlines.length})
          </h2>

          <Link href="/deadlines" className="btn btn-ghost" style={{ fontSize: '0.785rem', padding: '4px 8px' }}>
            <span>Xem tất cả</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        {urgentUpcoming.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
              gap: '14px',
            }}
          >
            {urgentUpcoming.map((d) => (
              <DeadlineCard key={d.id} deadline={d} currentUserId={userId} />
            ))}
          </div>
        ) : (
          <div
            className="saas-card"
            style={{
              padding: '36px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <CheckCircle2 size={32} style={{ color: 'var(--success)' }} />
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Không còn bài tập nào chưa xong
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
              Bạn đã đánh dấu hoàn thành tất cả bài tập hiện có.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
