import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { can } from '@/lib/permissions';
import { Role } from '@/types';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const secret = process.env.NEXTAUTH_SECRET || 'ptit-ltwnc-secret-super-key-2026-very-secure';
  const token = await getToken({ req, secret });

  const isAuth = !!token;
  const userRole = (token?.role as Role) || 'guest';

  // 1. Bảo vệ route /dashboard (yêu cầu đăng nhập)
  if (pathname.startsWith('/dashboard')) {
    if (!isAuth) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Bảo vệ route /admin (chỉ admin có quyền)
  if (pathname.startsWith('/admin')) {
    if (!isAuth) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Kiểm tra quyền thông qua hàm can() và vai trò admin
    if (userRole !== 'admin' || !can(userRole, 'create_deadline')) {
      const forbiddenUrl = new URL('/403', req.url);
      return NextResponse.redirect(forbiddenUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
