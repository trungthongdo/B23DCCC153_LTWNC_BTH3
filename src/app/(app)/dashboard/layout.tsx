import React from 'react';
import type { Metadata } from 'next';
import DashboardSidebar from '@/components/DashboardSidebar';

// SEO: Yêu cầu không lập chỉ mục cho trang /dashboard
export const metadata: Metadata = {
  title: 'Dashboard Cá Nhân | Class Deadline Hub PTIT',
  description: 'Quản lý và theo dõi tiến độ nộp bài tập cá nhân.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container" style={{ paddingTop: '32px' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '260px minmax(0, 1fr)',
          gap: '28px',
          alignItems: 'start',
        }}
        className="dashboard-container-grid"
      >
        <DashboardSidebar />
        <div style={{ minWidth: 0 }}>{children}</div>
      </div>

      <style>{`
        @media (max-width: 820px) {
          .dashboard-container-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
