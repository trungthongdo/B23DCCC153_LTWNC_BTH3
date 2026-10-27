import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { CheckCircle2, ArrowLeft, BookmarkCheck } from 'lucide-react';
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div
        className="glass-panel"
        style={{
          padding: '24px 28px',
          borderLeft: '4px solid var(--accent-emerald)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <BookmarkCheck size={18} style={{ color: 'var(--accent-emerald)' }} />
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Bài Tập Đã Hoàn Thành</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Danh sách các bài tập bạn đã đánh dấu hoàn tất. Bạn có thể nhấn lại vào nút để đánh dấu chưa xong bất kỳ lúc nào.
        </p>
      </div>

      {completedDeadlines.length > 0 ? (
        <div className="grid-cards">
          {completedDeadlines.map((d) => (
            <DeadlineCard key={d.id} deadline={d} currentUserId={userId} />
          ))}
        </div>
      ) : (
        <div
          className="glass-panel"
          style={{
            padding: '48px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <CheckCircle2 size={44} style={{ color: 'var(--text-muted)' }} />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Bạn chưa đánh dấu hoàn thành bài tập nào</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', maxWidth: '420px' }}>
            Hãy truy cập danh sách deadline và nhấn vào nút "Chưa xong" để chuyển trạng thái khi bạn đã nộp bài.
          </p>
          <Link href="/deadlines" className="btn btn-primary" style={{ marginTop: '8px' }}>
            <ArrowLeft size={16} /> Xem danh sách deadline
          </Link>
        </div>
      )}
    </div>
  );
}
