import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ChevronRight, ArrowLeft, Calendar, User } from 'lucide-react';
import { getDeadlines, getDeadlineById, getSubjectBySlug } from '@/lib/data';
import CountdownBadge from '@/components/CountdownBadge';
import CompleteButton from '@/components/CompleteButton';

export const revalidate = 60;

export async function generateStaticParams() {
  const deadlines = await getDeadlines();
  return deadlines.map((d) => ({
    id: d.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const deadline = await getDeadlineById(params.id);

  if (!deadline) {
    return {
      title: 'Không tìm thấy deadline | Class Deadline Hub',
      description: 'Hạn chót bài tập này không tồn tại hoặc đã bị gỡ bỏ.',
    };
  }

  const dueDateFormatted = new Date(deadline.dueDate).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return {
    title: `${deadline.title} | ${deadline.subjectName} - Class Deadline Hub`,
    description: `Hạn chót nộp bài: ${dueDateFormatted}. ${deadline.description}`,
    openGraph: {
      title: `${deadline.title} - ${deadline.subjectName}`,
      description: `Hạn chót: ${dueDateFormatted}. Cổng thông tin deadline lớp học PTIT.`,
      type: 'article',
      url: `/deadlines/${deadline.id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${deadline.title} - ${deadline.subjectName}`,
      description: `Hạn chót: ${dueDateFormatted}. ${deadline.description}`,
    },
  };
}

const TYPE_NAMES: Record<string, string> = {
  assignment: 'Bài tập tuần',
  project: 'Đồ án lớn',
  quiz: 'Trắc nghiệm online',
  exam: 'Thi / Kiểm tra',
};

export default async function DeadlineDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const deadline = await getDeadlineById(params.id);

  if (!deadline) {
    notFound();
  }

  const subject = await getSubjectBySlug(deadline.subjectSlug);

  const dueDateObj = new Date(deadline.dueDate);
  const formattedDueDate = new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dueDateObj);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Trang chủ',
        item: 'https://class-deadline-hub.ptit.edu.vn/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Deadlines',
        item: 'https://class-deadline-hub.ptit.edu.vn/deadlines',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: deadline.title,
        item: `https://class-deadline-hub.ptit.edu.vn/deadlines/${deadline.id}`,
      },
    ],
  };

  return (
    <div className="container" style={{ paddingTop: '24px' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav
        aria-label="Breadcrumb"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.8125rem',
          color: 'var(--text-muted)',
          marginBottom: '18px',
          flexWrap: 'wrap',
        }}
      >
        <Link href="/" style={{ color: 'var(--text-secondary)' }}>
          Trang chủ
        </Link>
        <ChevronRight size={12} />
        <Link href="/deadlines" style={{ color: 'var(--text-secondary)' }}>
          Deadlines
        </Link>
        <ChevronRight size={12} />
        <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>
          {deadline.title}
        </span>
      </nav>

      <div
        className="saas-card"
        style={{
          padding: '28px',
          maxWidth: '860px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Link
              href={`/subjects/${deadline.subjectSlug}`}
              className="badge badge-blue"
              style={{ textDecoration: 'none' }}
            >
              {deadline.subjectName}
            </Link>

            <span className="badge badge-neutral">
              {TYPE_NAMES[deadline.type] || 'Bài tập'}
            </span>

            {deadline.priority === 'high' && (
              <span className="badge badge-danger">
                Ưu tiên cao
              </span>
            )}
          </div>

          <CountdownBadge dueDate={deadline.dueDate} />
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: '1.45rem',
            fontWeight: 700,
            lineHeight: 1.35,
            color: 'var(--text-main)',
            marginBottom: '18px',
          }}
        >
          {deadline.title}
        </h1>

        {/* Key Information Bar */}
        <div
          style={{
            padding: '14px 16px',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={16} style={{ color: 'var(--text-muted)' }} />
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                Hạn nộp chính xác:
              </span>
              <span style={{ fontSize: '0.925rem', fontWeight: 600, color: 'var(--text-main)' }}>
                {formattedDueDate}
              </span>
            </div>
          </div>

          <CompleteButton
            deadlineId={deadline.id}
            completedBy={deadline.completedBy}
            size="md"
          />
        </div>

        {/* Requirement & Description */}
        <div style={{ marginBottom: '28px' }}>
          <h2
            style={{
              fontSize: '0.95rem',
              fontWeight: 600,
              color: 'var(--text-main)',
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
              marginBottom: '10px',
            }}
          >
            Yêu cầu chi tiết
          </h2>
          <div
            style={{
              fontSize: '0.925rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.65,
              whiteSpace: 'pre-line',
              padding: '16px',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
            }}
          >
            {deadline.description}
          </div>
        </div>

        {/* Subject and Instructor Brief */}
        {subject && (
          <div
            style={{
              paddingTop: '16px',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              fontSize: '0.8125rem',
              color: 'var(--text-muted)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={14} />
              <span>Giảng viên:</span>
              <strong style={{ color: 'var(--text-main)' }}>{subject.lecturer}</strong>
              <span>({subject.email})</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link href="/deadlines" className="btn btn-secondary" style={{ padding: '5px 10px', fontSize: '0.785rem' }}>
                <ArrowLeft size={13} />
                <span>Quay lại</span>
              </Link>
              <Link href="/dashboard" className="btn btn-primary" style={{ padding: '5px 10px', fontSize: '0.785rem' }}>
                Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
