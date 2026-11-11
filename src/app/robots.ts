import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/thank-you', '/login', '/dashboard/', '/register/', '/pay/', '/payment/'] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
