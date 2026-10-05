/**
 * Database data utilities - replaces JSON-based data.ts for events/articles
 * Static content (homepage, about, etc.) still uses content.json
 */

import { prisma } from './prisma'
import type { Event, Article, Artist } from '@prisma/client'
import { ContentStatus } from '@prisma/client'
import { nichtVorbeiFilter, tagesbeginn } from './event-window'

// Safe database query wrapper - returns fallback on error.
// Verbindungsabbrüche zur Supabase-Direktverbindung treten sporadisch auf
// ("Can't reach database server") — ein kurzer Retry fängt diese Blips ab,
// statt dem Besucher eine leere Seite ("Keine Events verfügbar") zu zeigen.
async function safeDbQuery<T>(
  queryFn: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await queryFn()
  } catch (firstError) {
    console.error('Database query error (retrying once):', firstError)
    await new Promise((resolve) => setTimeout(resolve, 300))
    try {
      return await queryFn()
    } catch (error) {
      console.error('Database query error:', error)
      return fallback
    }
  }
}

// Re-export types for convenience
export type { Event, Article }

// Simplified event type for frontend (matches old JSON structure)
export type EventData = {
  id: string
  slug: string
  title: string
  subtitle: string | null
  description: string
  date: string
  endDate: string | null
  /** Beginn als "HH:MM" (Altbestand kann Freitext sein), siehe src/lib/event-time.ts */
  time: string | null
  /** Ende als "HH:MM", optional */
  endTime: string | null
  location: string
  category: string
  ticketUrl: string | null
  price: string | null
  /** Roher Feldinhalt, siehe src/lib/event-trailer.ts */
  trailerUrl: string | null
  imageUrl: string | null
  featured: boolean
  highlights: string[]
  /** Nur von getEventBySlug gefüllt (Detailseite), in Listen nie gesetzt. */
  artists?: ArtistData[]
}

/** Wer bei einem Event auftritt, Bio schon in der Sprache der Seite. */
export type ArtistData = {
  id: string
  slug: string
  name: string
  imageUrl: string | null
  bio: string
  instagramUrl: string | null
  websiteUrl: string | null
}

export type ArticleData = {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  author: string
  publishedAt: string
  imageUrl: string | null
  tags: string[]
  featured: boolean
  /**
   * Sprachen, in denen der Artikel wirklich vorliegt. Deutsch immer, weitere
   * nur mit gepflegtem Titel und Inhalt in `translations`. Die Detailseite
   * entscheidet daran, ob hreflang die englische URL nennt oder ob sie per
   * canonical auf die deutsche Fassung zeigt.
   */
  availableLocales: DbLocale[]
}

/**
 * Locale-Type für Events/Article-Queries.
 * Deutsch ist die Quelle in den Hauptspalten. Übersetzungen liegen in der
 * JSON-Spalte `translations` (z.B. { "en": { "title": … } }) und werden im
 * Transformer feldweise überlagert — fehlende Felder fallen auf DE zurück.
 */
export type DbLocale = 'de' | 'en'

/** Übersetzbare Event-Felder (Teilmenge; Rest bleibt immer DE) */
export type EventTranslation = {
  title?: string
  subtitle?: string | null
  description?: string
  highlights?: string[]
  price?: string | null
}

// Transform DB event to frontend format
// (exportiert, damit API-Routen mit eigenen Queries denselben Locale-Overlay nutzen)
export function transformEvent(event: Event, locale: DbLocale = 'de'): EventData {
  const translations = (event.translations ?? {}) as Record<string, EventTranslation>
  const t = locale !== 'de' ? translations[locale] : undefined

  return {
    id: event.id,
    slug: event.slug,
    title: t?.title?.trim() || event.title,
    subtitle: t?.subtitle?.trim() || event.subtitle,
    description: t?.description?.trim() || event.description,
    date: event.date.toISOString(),
    endDate: event.endDate?.toISOString() || null,
    time: event.time,
    endTime: event.endTime,
    location: event.location,
    category: event.category,
    ticketUrl: event.ticketUrl,
    price: t?.price?.trim() || event.price,
    // Nicht übersetzbar: ein Trailer ist derselbe Film, egal in welcher Sprache
    // die Seite gerade steht.
    trailerUrl: event.trailerUrl,
    imageUrl: event.imageUrl,
    featured: event.featured,
    highlights:
      t?.highlights && t.highlights.length > 0
        ? t.highlights
        : (event.highlights as string[]) || [],
  }
}

/** Übersetzbare Artikel-Felder; Kategorie, Autor, Bild und Tags bleiben DE. */
export type ArticleTranslation = {
  title?: string
  excerpt?: string
  content?: string
}

/**
 * Gilt ein Artikel in dieser Sprache als übersetzt? Titel und Inhalt müssen
 * gepflegt sein. Nur ein übersetzter Titel über deutschem Text wäre für
 * Suchmaschinen wieder dieselbe Seite zweimal.
 */
function isArticleTranslated(t: ArticleTranslation | undefined): boolean {
  return Boolean(t?.title?.trim() && t?.content?.trim())
}

// Transform DB article to frontend format
// Gleicher Locale-Overlay wie transformEvent: fehlende Felder fallen auf DE zurück.
export function transformArticle(article: Article, locale: DbLocale = 'de'): ArticleData {
  const translations = (article.translations ?? {}) as Record<string, ArticleTranslation>
  const t = locale !== 'de' ? translations[locale] : undefined
  const availableLocales: DbLocale[] = [
    'de',
    ...(isArticleTranslated(translations.en) ? (['en'] as const) : []),
  ]

  return {
    id: article.id,
    slug: article.slug,
    title: t?.title?.trim() || article.title,
    excerpt: t?.excerpt?.trim() || article.excerpt,
    content: t?.content?.trim() || article.content,
    category: article.category,
    author: article.author,
    publishedAt: article.publishedAt?.toISOString() || article.createdAt.toISOString(),
    imageUrl: article.imageUrl,
    tags: (article.tags as string[]) || [],
    featured: article.featured,
    availableLocales,
  }
}

// ============================================
// EVENT FUNCTIONS
// ============================================

export async function getAllEvents(locale: DbLocale = 'de'): Promise<EventData[]> {
  return safeDbQuery(async () => {
    const events = await prisma.event.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { date: 'asc' },
    })
    return events.map((e: Event) => transformEvent(e, locale))
  }, [])
}

export async function getUpcomingEvents(locale: DbLocale = 'de'): Promise<EventData[]> {
  return safeDbQuery(async () => {
    // Cutoff = Beginn des heutigen Tages (lokal), damit Events, die heute später
    // am Abend stattfinden (z.B. 20:00 Uhr), nicht herausgefiltert werden.
    // Das `date`-Feld speichert nur das Kalenderdatum; die genaue Uhrzeit liegt
    // im separaten String-Feld `time`.
    // Mehrtägige Termine zählen bis zu ihrem Ende dazu, nicht nur am ersten
    // Tag. Die Regel steht in src/lib/event-window.ts.
    const startOfToday = tagesbeginn()

    const events = await prisma.event.findMany({
      where: {
        status: 'PUBLISHED',
        ...nichtVorbeiFilter(startOfToday),
      },
      orderBy: { date: 'asc' },
    })
    return events.map((e: Event) => transformEvent(e, locale))
  }, [])
}

export async function getFeaturedEvents(locale: DbLocale = 'de'): Promise<EventData[]> {
  return safeDbQuery(async () => {
    const events = await prisma.event.findMany({
      where: {
        status: 'PUBLISHED',
        featured: true,
      },
      orderBy: { date: 'asc' },
    })
    return events.map((e: Event) => transformEvent(e, locale))
  }, [])
}

/** Ohne EN-Bio zeigt die englische Seite die deutsche. */
export function transformArtist(artist: Artist, locale: DbLocale = 'de'): ArtistData {
  const translations = (artist.translations ?? {}) as Record<string, { bio?: string }>
  const bio = locale !== 'de' ? translations[locale]?.bio?.trim() : undefined
  return {
    id: artist.id,
    slug: artist.slug,
    name: artist.name,
    imageUrl: artist.imageUrl,
    bio: bio || artist.bio,
    instagramUrl: artist.instagramUrl,
    websiteUrl: artist.websiteUrl,
  }
}

export async function getEventBySlug(slug: string, locale: DbLocale = 'de'): Promise<EventData | null> {
  return safeDbQuery(async () => {
    const event = await prisma.event.findUnique({
      where: { slug },
      include: {
        artists: { orderBy: { position: 'asc' }, include: { artist: true } },
      },
    })
    if (!event) return null
    const { artists, ...rest } = event as Event & { artists?: { artist: Artist }[] }
    return {
      ...transformEvent(rest, locale),
      artists: (artists ?? []).map((link) => transformArtist(link.artist, locale)),
    }
  }, null)
}

export async function getEventById(id: string, locale: DbLocale = 'de'): Promise<EventData | null> {
  return safeDbQuery(async () => {
    const event = await prisma.event.findUnique({
      where: { id },
    })
    return event ? transformEvent(event, locale) : null
  }, null)
}

export async function getEventsByMonth(year: number, month: number, locale: DbLocale = 'de'): Promise<EventData[]> {
  return safeDbQuery(async () => {
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0, 23, 59, 59)

    const events = await prisma.event.findMany({
      where: {
        status: 'PUBLISHED',
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: 'asc' },
    })
    return events.map((e: Event) => transformEvent(e, locale))
  }, [])
}

export async function getEventsByCategory(category: string, locale: DbLocale = 'de'): Promise<EventData[]> {
  return safeDbQuery(async () => {
    const events = await prisma.event.findMany({
      where: {
        status: 'PUBLISHED',
        category: category as any,
      },
      orderBy: { date: 'asc' },
    })
    return events.map((e: Event) => transformEvent(e, locale))
  }, [])
}

// ============================================
// ARTICLE FUNCTIONS
// ============================================

export async function getAllArticles(locale: DbLocale = 'de'): Promise<ArticleData[]> {
  return safeDbQuery(async () => {
    const articles = await prisma.article.findMany({
      where: { status: ContentStatus.PUBLISHED },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    })
    return articles.map((a: Article) => transformArticle(a, locale))
  }, [])
}

export async function getFeaturedArticles(locale: DbLocale = 'de'): Promise<ArticleData[]> {
  return safeDbQuery(async () => {
    const articles = await prisma.article.findMany({
      where: {
        status: ContentStatus.PUBLISHED,
        featured: true,
      },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    })
    return articles.map((a: Article) => transformArticle(a, locale))
  }, [])
}

export async function getRecentArticles(limit: number = 5, locale: DbLocale = 'de'): Promise<ArticleData[]> {
  return safeDbQuery(async () => {
    const articles = await prisma.article.findMany({
      where: { status: ContentStatus.PUBLISHED },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      take: limit,
    })
    return articles.map((a: Article) => transformArticle(a, locale))
  }, [])
}

export async function getArticleBySlug(slug: string, locale: DbLocale = 'de'): Promise<ArticleData | null> {
  return safeDbQuery(async () => {
    const article = await prisma.article.findFirst({
      where: { slug, status: ContentStatus.PUBLISHED },
    })
    return article ? transformArticle(article, locale) : null
  }, null)
}

export async function getArticlesByCategory(category: string, locale: DbLocale = 'de'): Promise<ArticleData[]> {
  return safeDbQuery(async () => {
    const articles = await prisma.article.findMany({
      where: {
        status: ContentStatus.PUBLISHED,
        category,
      },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    })
    return articles.map((a: Article) => transformArticle(a, locale))
  }, [])
}
