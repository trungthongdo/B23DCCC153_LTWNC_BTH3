import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  Calendar,
  Clock,
  ChevronRight,
  ArrowLeft,
  Tag,
  AlertCircle,
  Share2,
  CheckCircle2,
  User,
  Layers,
  Sparkles,
} from 'lucide-react';
import { getDeadlines, getDeadlineById, getSubjectBySlug } from '@/lib/data';
import CountdownBadge from '@/components/CountdownBadge';
import CompleteButton from '@/components/CompleteButton';

// CHIẾN LƯỢC RENDER: ISR (Incremental Static Regeneration)
// Làm mới sau 60s hoặc ngay lập tức khi admin thêm / xoá (thông qua revalidatePath)
export const revalidate = 60;

// Tạo danh sách static params cho toàn bộ deadlines lúc build
export async function generateStaticParams() {
  const deadlines = await getDeadlines();
  return deadlines.map((d) => ({
    id: d.id,
  }));
}

// Metadata động kèm OpenGraph image
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

  // Structured Data (JSON-LD) BreadcrumbList
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

  const TYPE_NAMES: Record<string, string> = {
    assignment: 'Bài tập tuần',
    project: 'Đồ án lớn',
    quiz: 'Trắc nghiệm online',
    exam: 'Thi / Kiểm tra',
  };

  return (
    <div className="container" style={{ paddingTop: '32px' }}>
      {/* Structured data JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          marginBottom: '24px',
          flexWrap: 'wrap',
        }}
      >
        <Link href="/" style={{ color: 'var(--text-secondary)' }}>
          Trang chủ
        </Link>
        <ChevronRight size={14} />
        <Link href="/deadlines" style={{ color: 'var(--text-secondary)' }}>
          Danh sách Deadline
        </Link>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
          {deadline.title}
        </span>
      </nav>

      {/* Main Content Layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 340px',
          gap: '28px',
        }}
        className="deadline-detail-grid"
      >
        {/* Left Column: Details */}
        <div>
          <div
            className="glass-panel"
            style={{
              padding: '36px',
              borderTop: `6px solid ${
                deadline.priority === 'high'
                  ? 'var(--accent-rose)'
                  : deadline.priority === 'medium'
                  ? 'var(--accent-amber)'
                  : 'var(--primary)'
              }`,
            }}
          >
            {/* Badges & Rendering tag */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexWrap: 'wrap',
                marginBottom: '16px',
              }}
            >
              <Link
                href={`/subjects/${deadline.subjectSlug}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  color: 'var(--primary)',
                }}
              >
                <Tag size={14} />
                {deadline.subjectName}
              </Link>

              <span className="badge badge-primary">
                {TYPE_NAMES[deadline.type] || 'Bài tập'}
              </span>

              <span
                className={`badge ${
                  deadline.priority === 'high'
                    ? 'badge-danger'
                    : deadline.priority === 'medium'
                    ? 'badge-warning'
                    : 'badge-neutral'
                }`}
              >
                Ưu tiên {deadline.priority === 'high' ? 'cao' : deadline.priority === 'medium' ? 'vừa' : 'thấp'}
              </span>

              <span className="badge badge-success">ISR Page</span>
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
                fontWeight: 800,
                lineHeight: 1.3,
                marginBottom: '20px',
                color: 'var(--text-primary)',
              }}
            >
              {deadline.title}
            </h1>

            {/* Due date & countdown alert box */}
            <div
              style={{
                padding: '18px 22px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(99, 102, 241, 0.08)',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '14px',
                marginBottom: '28px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: 'rgba(99, 102, 241, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary)',
                  }}
                >
                  <Calendar size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Hạn nộp chính xác:
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {formattedDueDate}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CountdownBadge dueDate={deadline.dueDate} />
                <CompleteButton deadlineId={deadline.id} completedBy={deadline.completedBy} />
              </div>
            </div>

            {/* Content Description */}
            <div style={{ marginBottom: '32px' }}>
              <h2
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  marginBottom: '12px',
                  color: 'var(--text-primary)',
                }}
              >
                Nội Dung Và Yêu Cầu Chi Tiết
              </h2>
              <div
                style={{
                  fontSize: '0.975rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.7,
                  whiteSpace: 'pre-line',
                }}
              >
                {deadline.description}
              </div>
            </div>

            {/* Social Sharing Notice */}
            <div
              style={{
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Được tạo bởi: <code>{deadline.createdBy}</code>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-neutral">
                  <Share2 size={12} />
                  OG Image Dynamic Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Subject Info & Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Subject Overview Card */}
          {subject && (
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px' }}>
                Thông Tin Môn Học
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Môn: </span>
                  <strong>{subject.name}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Mã môn: </span>
                  <span className="badge badge-primary" style={{ padding: '2px 6px', fontSize: '0.75rem' }}>
                    {subject.code}
                  </span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Giảng viên: </span>
                  <strong>{subject.lecturer}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Email: </span>
                  <a href={`mailto:${subject.email}`} style={{ color: 'var(--primary)', textDecoration: 'underline' }}>
                    {subject.email}
                  </a>
                </div>
              </div>

              <Link
                href={`/subjects/${subject.slug}`}
                className="btn btn-secondary"
                style={{ width: '100%', marginTop: '16px', fontSize: '0.85rem' }}
              >
                Xem chi tiết môn học
              </Link>
            </div>
          )}

          {/* Quick Actions Card */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px' }}>
              Thao Tác Nhanh
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link href="/deadlines" className="btn btn-secondary" style={{ width: '100%' }}>
                <ArrowLeft size={16} /> Quay lại danh sách
              </Link>
              <Link href="/dashboard" className="btn btn-primary" style={{ width: '100%' }}>
                Vào Dashboard của tôi
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .deadline-detail-grid {
            grid-template-columns: 1fr !min;
            display: flex !important;
            flex-direction: column !important;
          }
        }
      `}</style>
    </div>
  );
}
