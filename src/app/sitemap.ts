/**
 * Sitemap
 *
 * Hier stehen die *kanonischen* URLs, also die mit Locale-Prefix
 * (`/de/events`, `/en/events`). Vorher listete die Sitemap die alten
 * Root-Pfade (`/events`) — die aber alle per Middleware auf `/de/events`
 * weiterleiten, während das canonical-Tag der Seite ebenfalls auf `/de/events`
 * zeigt. Jeder Sitemap-Eintrag widersprach damit dem canonical der Seite, und
 * `/cafe` lief sogar in einen echten 404, weil es dafür keine Root-Route gibt.
 *
 * Jeder Eintrag trägt zusätzlich `alternates.languages` — damit weiss Google,
 * dass /de/x und /en/x dieselbe Seite in zwei Sprachen sind, und spielt dem
 * Nutzer die passende Fassung aus statt beide gegeneinander zu bewerten.
 */

import { MetadataRoute } from 'next'
import { getAllEvents, getAllArticles } from '@/lib/db-data'
import { LOCALES, LOCALIZED_PATHS, DEFAULT_LOCALE } from '@/i18n/config'
import { absoluteUrl } from '@/lib/seo'

/** Priorität pro Seite — was am meisten Besucher bringt, steht oben. */
const PRIORITY: Record<string, number> = {
  '/': 1.0,
  '/events': 0.9,
  '/galerie': 0.8,
  '/news': 0.8,
  '/training': 0.8,
  '/cafe': 0.7,
  '/about': 0.7,
  '/contact': 0.6,
  '/newsletter': 0.6,
  '/spenden': 0.5,
  '/datenschutz': 0.3,
  '/impressum': 0.3,
  '/agb': 0.3,
}

type ChangeFrequency = MetadataRoute.Sitemap[number]['changeFrequency']

const CHANGE_FREQUENCY: Record<string, ChangeFrequency> = {
  '/': 'weekly',
  '/events': 'daily',
  '/galerie': 'monthly',
  '/news': 'weekly',
  '/datenschutz': 'yearly',
  '/impressum': 'yearly',
  '/agb': 'yearly',
}

/** hreflang-Block für einen Pfad, identisch für alle Locale-Varianten. */
function languagesFor(path: string): Record<string, string> {
  const languages: Record<string, string> = {}
  for (const locale of LOCALES) {
    languages[locale] = absoluteUrl(locale, path)
  }
  languages['x-default'] = absoluteUrl(DEFAULT_LOCALE, path)
  return languages
}

/** Ein Sitemap-Eintrag pro Locale, jeder mit vollem hreflang-Set. */
function entriesForPath(
  path: string,
  lastModified: Date,
  overrides?: { priority?: number; changeFrequency?: ChangeFrequency }
): MetadataRoute.Sitemap {
  const languages = languagesFor(path)
  return LOCALES.map((locale) => ({
    url: absoluteUrl(locale, path),
    lastModified,
    changeFrequency: overrides?.changeFrequency ?? CHANGE_FREQUENCY[path] ?? 'monthly',
    priority: overrides?.priority ?? PRIORITY[path] ?? 0.5,
    alternates: { languages },
  }))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticPages = LOCALIZED_PATHS.flatMap((path) => entriesForPath(path, now))

  // Events und News liegen pro Sprache unter demselben Slug (Slugs sind global
  // unique, die Übersetzung steckt im translations-Feld). Aus einer Liste
  // lassen sich deshalb beide Sprachvarianten erzeugen.
  let eventPages: MetadataRoute.Sitemap = []
  try {
    const events = await getAllEvents(DEFAULT_LOCALE)
    eventPages = events.flatMap((event) =>
      entriesForPath(`/events/${event.slug}`, new Date(event.date), {
        priority: 0.8,
        changeFrequency: 'weekly',
      })
    )
  } catch {
    console.error('Sitemap: Failed to fetch events')
  }

  let newsPages: MetadataRoute.Sitemap = []
  try {
    const articles = await getAllArticles(DEFAULT_LOCALE)
    newsPages = articles.flatMap((article) =>
      entriesForPath(`/news/${article.slug}`, new Date(article.publishedAt), {
        priority: 0.7,
        changeFrequency: 'monthly',
      })
    )
  } catch {
    console.error('Sitemap: Failed to fetch articles')
  }

  return [...staticPages, ...eventPages, ...newsPages]
}
