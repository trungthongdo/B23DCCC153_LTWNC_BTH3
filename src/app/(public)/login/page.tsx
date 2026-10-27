import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import LoginForm from '@/components/LoginForm';

// SEO: Yêu cầu không lập chỉ mục cho trang /login
export const metadata: Metadata = {
  title: 'Đăng Nhập | Class Deadline Hub PTIT',
  description: 'Đăng nhập vào hệ thống cổng thông tin deadline lớp học PTIT.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '75vh',
        padding: '30px 20px',
      }}
    >
      <Suspense fallback={<div>Đang tải form đăng nhập...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
