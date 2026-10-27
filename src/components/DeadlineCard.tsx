import React from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight, Tag, BookmarkCheck } from 'lucide-react';
import { Deadline } from '@/types';
import CountdownBadge from './CountdownBadge';
import CompleteButton from './CompleteButton';

interface DeadlineCardProps {
  deadline: Deadline;
  currentUserId?: string;
  showSubjectLink?: boolean;
}

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  assignment: { label: 'Bài tập tuần', color: '#818cf8' },
  project: { label: 'Đồ án lớn', color: '#c084fc' },
  quiz: { label: 'Trắc nghiệm', color: '#38bdf8' },
  exam: { label: 'Thi / Kiểm tra', color: '#f43f5e' },
};

const PRIORITY_LABELS: Record<string, { label: string; badgeClass: string }> = {
  high: { label: 'Ưu tiên cao', badgeClass: 'badge-danger' },
  medium: { label: 'Ưu tiên vừa', badgeClass: 'badge-warning' },
  low: { label: 'Ưu tiên thấp', badgeClass: 'badge-neutral' },
};

export default function DeadlineCard({
  deadline,
  currentUserId,
  showSubjectLink = true,
}: DeadlineCardProps) {
  const isCompleted = currentUserId ? deadline.completedBy.includes(currentUserId) : false;
  const typeInfo = TYPE_LABELS[deadline.type] || { label: 'Bài tập', color: '#818cf8' };
  const priorityInfo = PRIORITY_LABELS[deadline.priority] || PRIORITY_LABELS.medium;

  const dueDateObj = new Date(deadline.dueDate);
  const formattedDate = new Intl.DateTimeFormat('vi-VN', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dueDateObj);

  return (
    <div
      className="glass-panel"
      style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '18px',
        position: 'relative',
        borderLeft: `4px solid ${
          deadline.priority === 'high'
            ? 'var(--accent-rose)'
            : deadline.priority === 'medium'
            ? 'var(--accent-amber)'
            : 'var(--primary)'
        }`,
      }}
    >
      <div>
        {/* Top meta tags */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            flexWrap: 'wrap',
            marginBottom: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {showSubjectLink ? (
              <Link
                href={`/subjects/${deadline.subjectSlug}`}
                style={{
                  fontSize: '0.785rem',
                  fontWeight: 600,
                  color: 'var(--primary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Tag size={12} />
                {deadline.subjectName}
              </Link>
            ) : (
              <span
                style={{
                  fontSize: '0.785rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                }}
              >
                {deadline.subjectName}
              </span>
            )}
            <span
              style={{
                fontSize: '0.725rem',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: typeInfo.color,
                border: `1px solid ${typeInfo.color}40`,
                fontWeight: 500,
              }}
            >
              {typeInfo.label}
            </span>
          </div>

          <span className={`badge ${priorityInfo.badgeClass}`}>
            {priorityInfo.label}
          </span>
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: '1.15rem',
            fontWeight: 700,
            lineHeight: 1.4,
            marginBottom: '10px',
          }}
        >
          <Link
            href={`/deadlines/${deadline.id}`}
            style={{
              color: 'var(--text-primary)',
              transition: 'color 0.2s',
            }}
            className="hover-underline"
          >
            {deadline.title}
          </Link>
        </h3>

        {/* Description snippet */}
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '0.875rem',
            lineHeight: 1.55,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            marginBottom: '16px',
          }}
        >
          {deadline.description}
        </p>
      </div>

      {/* Footer info: Due date, Countdown, Actions */}
      <div
        style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--text-muted)',
              fontSize: '0.825rem',
            }}
          >
            <Calendar size={14} />
            <span>{formattedDate}</span>
          </div>
          <CountdownBadge dueDate={deadline.dueDate} isCompleted={isCompleted} />
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            marginTop: '4px',
          }}
        >
          <CompleteButton
            deadlineId={deadline.id}
            initialCompleted={isCompleted}
            size="sm"
          />

          <Link
            href={`/deadlines/${deadline.id}`}
            className="btn btn-outline"
            style={{
              padding: '6px 12px',
              fontSize: '0.8rem',
              borderRadius: 'var(--radius-full)',
            }}
          >
            <span>Chi tiết</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}
