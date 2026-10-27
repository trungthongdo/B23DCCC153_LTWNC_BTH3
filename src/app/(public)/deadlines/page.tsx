import React from 'react';
import type { Metadata } from 'next';
import { RefreshCw, CalendarClock } from 'lucide-react';
import { getDeadlines, getSubjects } from '@/lib/data';
import DeadlinesFilter from '@/components/DeadlinesFilter';

// CHIẾN LƯỢC RENDER: ISR (Incremental Static Regeneration), làm mới sau 60 giây
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Danh Sách Deadline Lớp Học | Class Deadline Hub',
  description:
    'Tra cứu toàn bộ hạn nộp bài tập lớn, bài tập tuần, kỳ thi môn học Khoa CNTT PTIT. Làm mới tự động sau 60 giây (ISR).',
};

export default async function DeadlinesPage() {
  const deadlines = await getDeadlines();
  const subjects = await getSubjects();

  return (
    <div className="container" style={{ paddingTop: '36px' }}>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span
              className="badge badge-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
            >
              <RefreshCw size={12} />
              ISR (Revalidate: 60s)
            </span>
            <span className="badge badge-neutral">
              Tổng cộng: {deadlines.length} deadline
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 800 }}>
            Tất Cả Deadline Lớp Học
          </h1>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '6px' }}>
            Tìm kiếm, lọc theo môn học và theo dõi thời gian còn lại theo thời gian thực.
          </p>
        </div>
      </div>

      {/* Interactive Filter and Grid */}
      <DeadlinesFilter
        initialDeadlines={deadlines}
        subjects={subjects}
      />
    </div>
  );
}
