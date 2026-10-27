import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://class-deadline-hub.ptit.edu.vn';

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/deadlines', '/deadlines/', '/subjects/'],
        disallow: ['/dashboard', '/dashboard/', '/admin', '/admin/', '/login', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
