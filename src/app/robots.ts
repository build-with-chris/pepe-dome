/**
 * robots.txt
 *
 * Die Newsletter-Servicepfade liegen unter /de/... bzw. /en/..., nicht direkt
 * unter /newsletter/... — die alte Regel `/newsletter/unsubscribed` traf
 * deshalb keine einzige echte URL. Mit dem `*`-Wildcard greifen beide Sprachen.
 *
 * Diese Seiten tragen zusätzlich `robots: noindex` in ihren Metadaten. robots.txt
 * verhindert das Crawlen, noindex das Indexieren — beides zusammen, weil eine
 * Seite, die nur per robots.txt gesperrt ist, trotzdem als URL-only-Treffer in
 * den Suchergebnissen landen kann.
 */

import { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/*/newsletter/confirm',
          '/*/newsletter/unsubscribe',
          '/*/newsletter/unsubscribed',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
