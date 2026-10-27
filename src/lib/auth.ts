import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import { getUserByEmail } from '@/lib/data';
import { Role } from '@/types';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'admin@ptit.edu.vn' },
        password: { label: 'Mật khẩu', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Vui lòng nhập đầy đủ email và mật khẩu.');
        }

        const user = await getUserByEmail(credentials.email);

        if (!user) {
          throw new Error('Không tìm thấy tài khoản với email này.');
        }

        if (user.password !== credentials.password) {
          throw new Error('Mật khẩu không chính xác.');
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.avatar,
        };
      },
    }),
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET
      ? [
          GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
            issuer: 'https://github.com/login/oauth',
            profile(profile) {
              return {
                id: profile.id.toString(),
                name: profile.name || profile.login,
                email: profile.email || `${profile.login}@github.com`,
                image: profile.avatar_url,
                role: 'user' as Role,
              };
            },
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role as Role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs by prefixing baseUrl
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      try {
        if (new URL(url).origin === baseUrl) return url;
      } catch {}
      return baseUrl;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'ptit-ltwnc-secret-super-key-2026-very-secure',
};
