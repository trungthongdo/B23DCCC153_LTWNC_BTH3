import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { can } from '@/lib/permissions';
import { Role } from '@/types';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const secret = process.env.NEXTAUTH_SECRET || 'ptit-ltwnc-secret-super-key-2026-very-secure';
  // Thử cả cookie __Secure- (HTTPS/Vercel) và cookie thường (localhost) để tránh vòng lặp redirect
  const token =
    (await getToken({ req, secret, secureCookie: true })) ??
    (await getToken({ req, secret, secureCookie: false }));

  const isAuth = !!token;
  const userRole = (token?.role as Role) || 'guest';

  if (pathname.startsWith('/dashboard')) {
    if (!isAuth) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname.startsWith('/admin')) {
    if (!isAuth) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

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
