import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'],
    },
    sitemap: 'https://concretecalc.co.uk/sitemap.xml',
    host: 'https://concretecalc.co.uk',
  };
}
