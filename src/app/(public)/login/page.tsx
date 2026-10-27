import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import LoginForm from '@/components/LoginForm';

export const metadata: Metadata = {
  title: 'Đăng Nhập | Class Deadline Hub PTIT',
  description: 'Đăng nhập vào hệ thống cổng thông tin deadline lớp học PTIT.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect(session.user?.role === 'admin' ? '/admin' : '/dashboard');
  }
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
