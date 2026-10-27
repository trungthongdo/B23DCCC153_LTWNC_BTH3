import React from 'react';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { ArrowRight, ChevronRight, BookOpen } from 'lucide-react';
import { getSubjects, getDeadlines } from '@/lib/data';
import { authOptions } from '@/lib/auth';
import DeadlineCard from '@/components/DeadlineCard';
import HomeHeroActions from '@/components/HomeHeroActions';

export const dynamic = 'force-static';

export default async function HomePage() {
  const subjects = await getSubjects();
  const deadlines = await getDeadlines();
  const session = await getServerSession(authOptions);

  const now = Date.now();
  const upcomingDeadlines = [...deadlines]
    .filter((d) => new Date(d.dueDate).getTime() >= now)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);

  return (
    <div className="container" style={{ paddingTop: '28px' }}>
      <section
        style={{
          padding: '24px 0 28px 0',
          borderBottom: '1px solid var(--border-color)',
          marginBottom: '28px',
        }}
      >
        <div style={{ maxWidth: '720px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-neutral">PTIT • Khoa Công nghệ Thông tin</span>
            <span className="badge badge-neutral">Cổng Deadline Lớp</span>
          </div>

          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: 700,
              color: 'var(--text-main)',
              letterSpacing: '-0.02em',
              lineHeight: 1.25,
              marginBottom: '10px',
            }}
          >
            Theo dõi và quản lý deadline các môn học
          </h1>

          <p
            style={{
              fontSize: '0.925rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.55,
              marginBottom: '18px',
            }}
          >
            Cổng thông tin mở cho phép sinh viên tra cứu hạn nộp bài tập lớn, bài kiểm tra và theo dõi tiến độ cá nhân.
          </p>

          <HomeHeroActions deadlinesCount={deadlines.length} />
        </div>
      </section>

      <section style={{ marginBottom: '36px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '14px',
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Deadline cần chú ý
            </h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Các hạn chót sắp đến gần nhất trong học kỳ
            </p>
          </div>

          <Link
            href="/deadlines"
            style={{
              fontSize: '0.8125rem',
              fontWeight: 500,
              color: 'var(--primary)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>Tất cả deadline</span>
            <ChevronRight size={13} />
          </Link>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '16px',
          }}
        >
          {upcomingDeadlines.map((deadline) => (
            <DeadlineCard
              key={deadline.id}
              deadline={deadline}
              currentUserId={session?.user?.id}
            />
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '24px' }}>
        <div style={{ marginBottom: '14px' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Môn học trong học kỳ
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Tra cứu thông tin giảng viên và danh sách bài tập theo từng học phần
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '14px',
          }}
        >
          {subjects.map((subject) => {
            const count = deadlines.filter((d) => d.subjectSlug === subject.slug).length;

            return (
              <Link
                key={subject.slug}
                href={`/subjects/${subject.slug}`}
                className="saas-card saas-card-interactive"
                style={{
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '8px',
                    }}
                  >
                    <span className="badge badge-neutral" style={{ fontWeight: 600 }}>
                      {subject.code}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {subject.credits} tín chỉ
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      color: 'var(--text-main)',
                      marginBottom: '4px',
                      lineHeight: 1.35,
                    }}
                  >
                    {subject.name}
                  </h3>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    GV: {subject.lecturer}
                  </div>
                </div>

                <div
                  style={{
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <span>{count} bài tập</span>
                  <span style={{ color: 'var(--primary)', fontWeight: 500 }}>Chi tiết →</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
