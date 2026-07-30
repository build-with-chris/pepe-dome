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

// Gilt für alle Bots und wird für die KI-Crawler wörtlich wiederholt.
const DISALLOW = [
  '/admin/',
  '/api/',
  '/*/newsletter/confirm',
  '/*/newsletter/unsubscribe',
  '/*/newsletter/unsubscribed',
]

// Grosse KI-Crawler ausdrücklich benennen. Über `*` sind sie ohnehin erlaubt;
// der eigene Eintrag macht die Absicht sichtbar und verhindert, dass ein später
// ergänztes generelles Verbot sie versehentlich mit aussperrt.
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-Web',
  'Google-Extended',
  'PerplexityBot',
  'CCBot',
  'Applebot-Extended',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: DISALLOW },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: '/', disallow: DISALLOW })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
