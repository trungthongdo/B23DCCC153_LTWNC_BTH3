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
    <div className="container" style={{ paddingTop: '24px' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '220px minmax(0, 1fr)',
          gap: '24px',
          alignItems: 'start',
        }}
        className="dashboard-grid-layout"
      >
        <DashboardSidebar />
        <div style={{ minWidth: 0 }}>{children}</div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .dashboard-grid-layout {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}
