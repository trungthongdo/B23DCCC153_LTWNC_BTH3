import { ImageResponse } from 'next/og';
import { getDeadlineById } from '@/lib/data';

export const runtime = 'nodejs';
export const alt = 'Class Deadline Hub - Chi tiết Deadline';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: { id: string } }) {
  const deadline = await getDeadlineById(params.id);

  const title = deadline?.title || 'Thông tin Deadline Lớp học';
  const subjectName = deadline?.subjectName || 'Học viện Công nghệ Bưu chính Viễn thông';
  const dueDateStr = deadline?.dueDate
    ? new Date(deadline.dueDate).toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#0a0d14',
          backgroundImage:
            'radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.25) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(225, 29, 72, 0.2) 0%, transparent 50%)',
          padding: '60px 70px',
          fontFamily: 'sans-serif',
          color: '#ffffff',
        }}
      >
        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #e11d48, #6366f1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold',
              }}
            >
              PTIT
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '24px', fontWeight: 'bold', letterSpacing: '-0.02em' }}>
                Class Deadline Hub
              </span>
              <span style={{ fontSize: '14px', color: '#94a3b8', textTransform: 'uppercase' }}>
                Cổng Tra Cứu Deadline Lớp Học
              </span>
            </div>
          </div>

          <div
            style={{
              padding: '8px 20px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(225, 29, 72, 0.2)',
              border: '2px solid rgba(225, 29, 72, 0.5)',
              color: '#fda4af',
              fontSize: '18px',
              fontWeight: 'bold',
            }}
          >
            Hạn chót sắp tới
          </div>
        </div>

        {/* Middle Body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              fontSize: '22px',
              fontWeight: 600,
              color: '#818cf8',
              letterSpacing: '0.02em',
            }}
          >
            {subjectName}
          </div>

          <div
            style={{
              fontSize: '48px',
              fontWeight: 800,
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              color: '#f8fafc',
              maxLines: 2,
            }}
          >
            {title}
          </div>
        </div>

        {/* Footer Info */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '2px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '18px', color: '#94a3b8' }}>Hạn nộp:</span>
            <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#fca5a5' }}>
              {dueDateStr}
            </span>
          </div>

          <div style={{ fontSize: '16px', color: '#64748b' }}>
            class-deadline-hub.ptit.edu.vn
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
