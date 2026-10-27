import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { authOptions } from '@/lib/auth';
import { getDeadlines } from '@/lib/data';
import DeadlineCard from '@/components/DeadlineCard';

export const dynamic = 'force-dynamic';

export default async function CompletedDeadlinesPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/login?callbackUrl=/dashboard/completed');
  }

  const userId = session.user.id;
  const deadlines = await getDeadlines();
  const completedDeadlines = deadlines.filter((d) => d.completedBy.includes(userId));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '2px' }}>
            Bài tập đã hoàn thành
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
            Danh sách bài tập bạn đã nộp và đánh dấu xong ({completedDeadlines.length})
          </p>
        </div>

        <Link href="/dashboard" className="btn btn-secondary" style={{ fontSize: '0.8125rem', padding: '5px 10px' }}>
          <ArrowLeft size={13} />
          <span>Dashboard</span>
        </Link>
      </div>

      {completedDeadlines.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: '14px',
          }}
        >
          {completedDeadlines.map((d) => (
            <DeadlineCard key={d.id} deadline={d} currentUserId={userId} />
          ))}
        </div>
      ) : (
        <div
          className="saas-card"
          style={{
            padding: '40px 20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <div style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: '0.95rem' }}>
            Chưa có bài tập nào được đánh dấu hoàn thành
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
            Khi nộp bài, hãy bấm vào nút "Chưa xong" tại mỗi deadline để chuyển trạng thái.
          </p>
          <Link href="/deadlines" className="btn btn-primary" style={{ marginTop: '8px', fontSize: '0.8125rem' }}>
            Xem danh sách bài tập
          </Link>
        </div>
      )}
    </div>
  );
}
