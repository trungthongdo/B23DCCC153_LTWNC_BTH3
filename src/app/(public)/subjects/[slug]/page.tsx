import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { ArrowLeft, ChevronRight, Mail, User, BookOpen } from 'lucide-react';
import { getSubjects, getSubjectBySlug, getDeadlinesBySubject } from '@/lib/data';
import { authOptions } from '@/lib/auth';
import DeadlineCard from '@/components/DeadlineCard';

export const dynamic = 'force-static';

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
    description: `Danh sách bài tập và deadline môn ${subject.name} - Giảng viên ${subject.lecturer}.`,
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
    <div className="container" style={{ paddingTop: '24px' }}>
      {/* Clean Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.8125rem',
          color: 'var(--text-muted)',
          marginBottom: '16px',
        }}
      >
        <Link href="/" style={{ color: 'var(--text-secondary)' }}>
          Trang chủ
        </Link>
        <ChevronRight size={12} />
        <Link href="/" style={{ color: 'var(--text-secondary)' }}>
          Môn học
        </Link>
        <ChevronRight size={12} />
        <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>
          {subject.name}
        </span>
      </nav>

      {/* Subject Info SaaS Card */}
      <div
        className="saas-card"
        style={{
          padding: '24px',
          marginBottom: '28px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="badge badge-blue">{subject.code}</span>
          <span className="badge badge-neutral">{subject.credits} Tín chỉ</span>
        </div>

        <h1
          style={{
            fontSize: '1.45rem',
            fontWeight: 700,
            color: 'var(--text-main)',
            marginBottom: '8px',
          }}
        >
          {subject.name}
        </h1>

        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.55,
            maxWidth: '780px',
            marginBottom: '16px',
          }}
        >
          {subject.description}
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            fontSize: '0.8125rem',
            color: 'var(--text-muted)',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '12px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <User size={14} />
            <span>Giảng viên:</span>
            <strong style={{ color: 'var(--text-main)' }}>{subject.lecturer}</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Mail size={14} />
            <a href={`mailto:${subject.email}`} style={{ color: 'var(--primary)' }}>
              {subject.email}
            </a>
          </div>

          <div>
            <span>Số bài tập:</span>{' '}
            <strong style={{ color: 'var(--text-main)' }}>{deadlines.length} deadline</strong>
          </div>
        </div>
      </div>

      {/* Deadlines List */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '14px',
          }}
        >
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Danh sách bài tập ({deadlines.length})
          </h2>

          <Link href="/deadlines" className="btn btn-secondary" style={{ fontSize: '0.8125rem' }}>
            <ArrowLeft size={13} />
            <span>Tất cả deadline</span>
          </Link>
        </div>

        {deadlines.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '16px',
            }}
          >
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
            className="saas-card"
            style={{
              padding: '36px',
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: '0.875rem',
            }}
          >
            Chưa có deadline nào cho môn học này.
          </div>
        )}
      </div>
    </div>
  );
}
