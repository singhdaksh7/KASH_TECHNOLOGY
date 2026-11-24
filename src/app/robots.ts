import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/constants';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || SITE_CONFIG.websiteUrl;

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Public site stays open. Admin, API and draft preview are excluded
      // (preview pages additionally send noindex via metadata).
      disallow: ['/api/', '/admin', '/admin/', '/preview'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
