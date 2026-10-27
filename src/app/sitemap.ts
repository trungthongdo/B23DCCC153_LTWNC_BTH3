import { MetadataRoute } from 'next';
import { getDeadlines, getSubjects } from '@/lib/data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://class-deadline-hub.ptit.edu.vn';
  const subjects = await getSubjects();
  const deadlines = await getDeadlines();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/deadlines`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
  ];

  const subjectRoutes: MetadataRoute.Sitemap = subjects.map((sub) => ({
    url: `${baseUrl}/subjects/${sub.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const deadlineRoutes: MetadataRoute.Sitemap = deadlines.map((dl) => ({
    url: `${baseUrl}/deadlines/${dl.id}`,
    lastModified: new Date(dl.createdAt || new Date()),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  return [...staticRoutes, ...subjectRoutes, ...deadlineRoutes];
}
