import React from 'react';
import type { Metadata } from 'next';
import { getDeadlines, getSubjects } from '@/lib/data';
import DeadlinesFilter from '@/components/DeadlinesFilter';

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
    <div className="container" style={{ paddingTop: '24px' }}>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
            Danh sách Deadline
          </h1>
          <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
            {deadlines.length} bài tập
          </span>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Lọc theo môn học, tìm kiếm bài tập và theo dõi hạn nộp thời gian thực.
        </p>
      </div>

      {/* Interactive SaaS Task Filter & List */}
      <DeadlinesFilter
        initialDeadlines={deadlines}
        subjects={subjects}
      />
    </div>
  );
}
