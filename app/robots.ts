import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'],
    },
    sitemap: 'https://concrete-calculator-uk.vercel.app/sitemap.xml',
    host: 'https://concrete-calculator-uk.vercel.app',
  };
}
