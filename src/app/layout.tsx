import type { Metadata } from 'next';
import { Be_Vietnam_Pro } from 'next/font/google';
import SessionProvider from '@/components/SessionProvider';
import './globals.css';

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-be-vietnam-pro',
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXTAUTH_URL || 'https://class-deadline-hub.ptit.edu.vn'
  ),
  title: {
    default: 'Class Deadline Hub | Cổng thông tin Deadline Lớp học PTIT',
    template: '%s | Class Deadline Hub',
  },
  description:
    'Cổng web tra cứu công khai và theo dõi tiến độ deadline các môn học Khoa CNTT - Học viện Công nghệ Bưu chính Viễn thông PTIT.',
  keywords: [
    'PTIT',
    'Deadline Hub',
    'Lập trình Web Nâng cao',
    'Học viện Công nghệ Bưu chính Viễn thông',
    'Class Deadlines',
    'Quản lý bài tập',
  ],
  authors: [{ name: 'Khoa CNTT - Học viện Bưu chính Viễn thông' }],
  openGraph: {
    title: 'Class Deadline Hub | Cổng Deadline Lớp PTIT',
    description:
      'Tra cứu hạn nộp bài tập lớn, bài tập tuần, kiểm tra giữa kỳ các môn học Khoa CNTT PTIT.',
    siteName: 'Class Deadline Hub PTIT',
    locale: 'vi_VN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={beVietnamPro.className}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
