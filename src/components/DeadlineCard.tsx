import React from 'react';
import Link from 'next/link';
import { Calendar, ChevronRight } from 'lucide-react';
import { Deadline } from '@/types';
import CountdownBadge from './CountdownBadge';
import CompleteButton from './CompleteButton';

interface DeadlineCardProps {
  deadline: Deadline;
  currentUserId?: string;
  showSubjectLink?: boolean;
}

const TYPE_LABELS: Record<string, string> = {
  assignment: 'Bài tập tuần',
  project: 'Đồ án lớn',
  quiz: 'Trắc nghiệm',
  exam: 'Thi / Kiểm tra',
};

export default function DeadlineCard({
  deadline,
  currentUserId,
  showSubjectLink = true,
}: DeadlineCardProps) {
  const isCompleted = currentUserId ? deadline.completedBy.includes(currentUserId) : false;
  const typeLabel = TYPE_LABELS[deadline.type] || 'Bài tập';

  const dueDateObj = new Date(deadline.dueDate);
  const formattedDate = new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dueDateObj);

  const isHighPriority = deadline.priority === 'high';

  return (
    <div
      className="saas-card saas-card-interactive"
      style={{
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '14px',
      }}
    >
      <div>
        {/* Top metadata tags */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            flexWrap: 'wrap',
            marginBottom: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {showSubjectLink ? (
              <Link
                href={`/subjects/${deadline.subjectSlug}`}
                className="badge badge-blue"
                style={{ textDecoration: 'none' }}
              >
                {deadline.subjectName}
              </Link>
            ) : (
              <span className="badge badge-blue">
                {deadline.subjectName}
              </span>
            )}

            <span className="badge badge-neutral">
              {typeLabel}
            </span>
          </div>

          {isHighPriority && (
            <span className="badge badge-danger">
              Ưu tiên cao
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: '0.975rem',
            fontWeight: 600,
            lineHeight: 1.4,
            marginBottom: '6px',
            color: 'var(--text-main)',
          }}
        >
          <Link
            href={`/deadlines/${deadline.id}`}
            style={{ color: 'var(--text-main)' }}
          >
            {deadline.title}
          </Link>
        </h3>

        {/* Description */}
        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.8125rem',
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {deadline.description}
        </p>
      </div>

      {/* Footer info: Due date, Countdown, Actions */}
      <div
        style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              color: 'var(--text-muted)',
              fontSize: '0.785rem',
            }}
          >
            <Calendar size={13} />
            <span>{formattedDate}</span>
          </div>
          <CountdownBadge dueDate={deadline.dueDate} isCompleted={isCompleted} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CompleteButton
            deadlineId={deadline.id}
            initialCompleted={isCompleted}
            size="sm"
          />

          <Link
            href={`/deadlines/${deadline.id}`}
            className="btn btn-secondary"
            style={{
              padding: '4px 8px',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
            }}
          >
            <span>Chi tiết</span>
            <ChevronRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}
