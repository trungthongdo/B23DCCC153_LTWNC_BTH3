import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import {
  BookOpen,
  User,
  Mail,
  Award,
  ArrowLeft,
  CalendarClock,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { getSubjects, getSubjectBySlug, getDeadlinesBySubject } from '@/lib/data';
import { authOptions } from '@/lib/auth';
import DeadlineCard from '@/components/DeadlineCard';

// CHIẾN LƯỢC RENDER: SSG (Static Site Generation)
export const dynamic = 'force-static';

// Tạo danh sách static params cho toàn bộ 4 môn học lúc build
export async function generateStaticParams() {
  const subjects = await getSubjects();
  return subjects.map((subject) => ({
    slug: subject.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const subject = await getSubjectBySlug(params.slug);
  if (!subject) {
    return {
      title: 'Không tìm thấy môn học | Class Deadline Hub',
    };
  }

  return {
    title: `${subject.name} (${subject.code}) | Class Deadline Hub`,
    description: `Danh sách bài tập và deadline môn ${subject.name} - Giảng viên ${subject.lecturer}. Khoa CNTT - Học viện Bưu chính Viễn thông.`,
    openGraph: {
      title: `${subject.name} (${subject.code}) - Deadlines`,
      description: subject.description,
    },
  };
}

export default async function SubjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const subject = await getSubjectBySlug(params.slug);

  if (!subject) {
    notFound();
  }

  const deadlines = await getDeadlinesBySubject(subject.slug);
  const session = await getServerSession(authOptions);

  return (
    <div className="container" style={{ paddingTop: '32px' }}>
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
        }}
      >
        <Link href="/" style={{ color: 'var(--text-secondary)' }}>
          Trang chủ
        </Link>
        <ChevronRight size={14} />
        <Link href="/" style={{ color: 'var(--text-secondary)' }}>
          Môn học
        </Link>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
          {subject.name}
        </span>
      </nav>

      {/* Subject Info Card */}
      <div
        className="glass-panel"
        style={{
          padding: '36px',
          marginBottom: '36px',
          position: 'relative',
          overflow: 'hidden',
          borderLeft: `6px solid ${subject.color}`,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '12px',
          }}
        >
          <span
            style={{
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              background: subject.bgColor,
              color: subject.color,
              fontWeight: 700,
              fontSize: '0.85rem',
              border: `1px solid ${subject.borderColor}`,
            }}
          >
            {subject.code}
          </span>
          <span className="badge badge-success">SSG Page</span>
          <span className="badge badge-neutral">{subject.credits} Tín chỉ</span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
            fontWeight: 800,
            marginBottom: '16px',
          }}
        >
          {subject.name}
        </h1>

        <p
          style={{
            fontSize: '1rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.65,
            maxWidth: '880px',
            marginBottom: '24px',
          }}
        >
          {subject.description}
        </p>

        {/* Lecturer info */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '24px',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
            <User size={16} style={{ color: subject.color }} />
            <span style={{ color: 'var(--text-muted)' }}>Giảng viên:</span>
            <strong style={{ color: 'var(--text-primary)' }}>{subject.lecturer}</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
            <Mail size={16} style={{ color: subject.color }} />
            <span style={{ color: 'var(--text-muted)' }}>Email liên hệ:</span>
            <a
              href={`mailto:${subject.email}`}
              style={{ color: 'var(--primary)', textDecoration: 'underline' }}
            >
              {subject.email}
            </a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
            <CalendarClock size={16} style={{ color: subject.color }} />
            <span style={{ color: 'var(--text-muted)' }}>Số lượng bài tập:</span>
            <strong style={{ color: 'var(--text-primary)' }}>{deadlines.length} deadline</strong>
          </div>
        </div>
      </div>

      {/* Deadlines of this subject */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
          }}
        >
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>
            Danh Sách Deadline Của Môn Học ({deadlines.length})
          </h2>
          <Link href="/deadlines" className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
            <ArrowLeft size={15} /> Tất cả deadline
          </Link>
        </div>

        {deadlines.length > 0 ? (
          <div className="grid-cards">
            {deadlines.map((deadline) => (
              <DeadlineCard
                key={deadline.id}
                deadline={deadline}
                currentUserId={session?.user?.id}
                showSubjectLink={false}
              />
            ))}
          </div>
        ) : (
          <div
            className="glass-panel"
            style={{
              padding: '40px 24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <Layers size={36} style={{ color: 'var(--text-muted)' }} />
            <h4 style={{ fontSize: '1.05rem', fontWeight: 600 }}>Chưa có deadline nào cho môn học này</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Lớp trưởng chưa thêm hạn nộp bài tập mới cho môn học này.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
