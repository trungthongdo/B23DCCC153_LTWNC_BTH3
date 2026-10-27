import React from 'react';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import {
  CalendarClock,
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowRight,
  Shield,
  Layers,
  Sparkles,
  Users,
} from 'lucide-react';
import { getSubjects, getDeadlines } from '@/lib/data';
import { authOptions } from '@/lib/auth';
import DeadlineCard from '@/components/DeadlineCard';

// CHIẾN LƯỢC RENDER: SSG (Static Site Generation)
export const dynamic = 'force-static';

export default async function HomePage() {
  const subjects = await getSubjects();
  const deadlines = await getDeadlines();
  const session = await getServerSession(authOptions);

  const now = Date.now();
  // Sắp xếp các deadline sắp đến hạn (chưa quá hạn) lên đầu
  const upcomingDeadlines = [...deadlines]
    .filter((d) => new Date(d.dueDate).getTime() >= now)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);

  // Deadline khẩn cấp nhất
  const urgentCount = deadlines.filter((d) => {
    const diff = new Date(d.dueDate).getTime() - now;
    return diff > 0 && diff < 3 * 24 * 60 * 60 * 1000;
  }).length;

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          padding: '60px 0 40px 0',
          overflow: 'hidden',
        }}
      >
        <div className="container">
          <div
            style={{
              maxWidth: '840px',
              margin: '0 auto',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                background: 'rgba(99, 102, 241, 0.12)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                color: '#c7d2fe',
                fontWeight: 600,
              }}
            >
              <Sparkles size={14} style={{ color: 'var(--ptit-red)' }} />
              <span>Học viện Công nghệ Bưu chính Viễn thông • Khóa CNTT</span>
              <span className="badge badge-success" style={{ padding: '1px 6px', fontSize: '0.7rem' }}>
                SSG
              </span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
              }}
            >
              Cổng Quản Lý <span className="gradient-text">Deadline Lớp Học</span> Hiện Đại
            </h1>

            <p
              style={{
                fontSize: '1.1rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                maxWidth: '680px',
              }}
            >
              Xem toàn bộ lịch nộp bài tập lớn, bài tập tuần, kiểm tra giữa kỳ công khai.
              Đăng nhập để đánh dấu tiến độ cá nhân và nhận thông báo hạn nộp chính xác.
            </p>

            {/* Action buttons */}
            <div
              style={{
                display: 'flex',
                gap: '14px',
                flexWrap: 'wrap',
                justifyContent: 'center',
                marginTop: '10px',
              }}
            >
              <Link
                href="/deadlines"
                className="btn btn-primary"
                id="hero-explore-btn"
                style={{ padding: '12px 24px', fontSize: '1rem' }}
              >
                <span>Khám phá Deadline</span>
                <ArrowRight size={18} />
              </Link>

              {!session ? (
                <Link
                  href="/login"
                  className="btn btn-secondary"
                  id="hero-login-btn"
                  style={{ padding: '12px 24px', fontSize: '1rem' }}
                >
                  <Users size={18} />
                  <span>Đăng nhập Sinh viên</span>
                </Link>
              ) : (
                <Link
                  href="/dashboard"
                  className="btn btn-secondary"
                  id="hero-dashboard-btn"
                  style={{ padding: '12px 24px', fontSize: '1rem' }}
                >
                  <CheckCircle2 size={18} />
                  <span>Vào Dashboard của tôi</span>
                </Link>
              )}
            </div>

            {/* Quick Metrics Bar */}
            <div
              className="glass-panel"
              style={{
                marginTop: '32px',
                width: '100%',
                maxWidth: '720px',
                padding: '20px 24px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '16px',
                textAlign: 'center',
              }}
            >
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {deadlines.length}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Tổng số Deadline
                </div>
              </div>

              <div style={{ borderLeft: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)' }}>
                  {subjects.length}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Môn học kỳ này
                </div>
              </div>

              <div style={{ borderLeft: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-rose)' }}>
                  {urgentCount}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Gấp (&lt; 3 ngày)
                </div>
              </div>

              <div style={{ borderLeft: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                  100%
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Công khai & Tối ưu SEO
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subjects Grid Section (SSG) */}
      <section style={{ padding: '40px 0' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '24px',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span className="badge badge-success" style={{ fontSize: '0.725rem' }}>
                  Static Site Generation (SSG)
                </span>
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 700 }}>
                Các Môn Học Trong Học Kỳ
              </h2>
            </div>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Nhấp vào môn học để xem thông tin giảng viên và danh sách deadline môn đó
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
            }}
          >
            {subjects.map((subject) => {
              const subDeadlines = deadlines.filter((d) => d.subjectSlug === subject.slug);
              return (
                <Link
                  key={subject.slug}
                  href={`/subjects/${subject.slug}`}
                  className="glass-panel"
                  style={{
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '16px',
                    borderTop: `4px solid ${subject.color}`,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  id={`subject-card-${subject.slug}`}
                >
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '12px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-sm)',
                          background: subject.bgColor,
                          color: subject.color,
                          border: `1px solid ${subject.borderColor}`,
                        }}
                      >
                        {subject.code}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {subject.credits} tín chỉ
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>
                      {subject.name}
                    </h3>

                    <p
                      style={{
                        fontSize: '0.85rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        marginBottom: '14px',
                      }}
                    >
                      {subject.description}
                    </p>
                  </div>

                  <div
                    style={{
                      borderTop: '1px solid var(--border-subtle)',
                      paddingTop: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Giảng viên: <strong style={{ color: 'var(--text-primary)' }}>{subject.lecturer}</strong>
                    </span>
                    <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                      {subDeadlines.length} deadline
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Urgent Upcoming Deadlines Preview */}
      <section style={{ padding: '40px 0 60px 0' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '24px',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span className="badge badge-danger" style={{ fontSize: '0.725rem' }}>
                  <Clock size={11} /> Deadline Sắp Đến Hạn
                </span>
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 700 }}>
                Hạn Nộp Gần Nhất
              </h2>
            </div>

            <Link href="/deadlines" className="btn btn-secondary">
              <span>Xem tất cả {deadlines.length} deadline</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid-cards">
            {upcomingDeadlines.map((deadline) => (
              <DeadlineCard
                key={deadline.id}
                deadline={deadline}
                currentUserId={session?.user?.id}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
