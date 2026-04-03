import { MetadataRoute } from 'next'

const BASE_URL = 'https://www.pepe-dome.de'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/newsletter/unsubscribed'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
