import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/config/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.url;
  
  const routes = [
    '',
    '/events',
    '/tickets',
    '/schedule',
    '/sponsors',
    '/gallery',
    '/team',
    '/about',
    '/leaderboard',
    '/helpdesk',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.9,
  }));

  return routes;
}
