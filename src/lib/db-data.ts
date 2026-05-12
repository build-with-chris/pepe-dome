/**
 * Database data utilities - replaces JSON-based data.ts for events/articles
 * Static content (homepage, about, etc.) still uses content.json
 */

import { prisma } from './prisma'
import type { Event, Article } from '@prisma/client'
import { ContentStatus } from '@prisma/client'

// Safe database query wrapper - returns fallback on error
async function safeDbQuery<T>(
  queryFn: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await queryFn()
  } catch (error) {
    console.error('Database query error:', error)
    return fallback
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
  time: string | null
  location: string
  category: string
  ticketUrl: string | null
  price: string | null
  imageUrl: string | null
  featured: boolean
  highlights: string[]
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
}

/**
 * Locale-Type für Events/Article-Queries.
 * Default ist 'de' — wenn ein englisches Feld in der DB null ist, fällt
 * der Transformer auf das deutsche Feld zurück (so können Übersetzungen
 * Stück für Stück nachgepflegt werden).
 */
export type DbLocale = 'de' | 'en'

function pick<T>(de: T, en: T | null | undefined, locale: DbLocale): T {
  if (locale === 'en' && en !== null && en !== undefined) return en
  return de
}

// Transform DB event to frontend format (mit Locale-Auswahl)
function transformEvent(event: Event, locale: DbLocale = 'de'): EventData {
  return {
    id: event.id,
    slug: event.slug,
    title:       pick(event.title,       event.titleEn,       locale),
    subtitle:    pick(event.subtitle,    event.subtitleEn,    locale),
    description: pick(event.description, event.descriptionEn, locale),
    date: event.date.toISOString(),
    endDate: event.endDate?.toISOString() || null,
    time: event.time,
    location:    pick(event.location,    event.locationEn,    locale),
    category: event.category,
    ticketUrl: event.ticketUrl,
    price:       pick(event.price,       event.priceEn,       locale),
    imageUrl: event.imageUrl,
    featured: event.featured,
    highlights:  pick(
      (event.highlights as string[]) || [],
      (event.highlightsEn as string[] | null) ?? null,
      locale
    ),
  }
}

// Transform DB article to frontend format (mit Locale-Auswahl)
function transformArticle(article: Article, locale: DbLocale = 'de'): ArticleData {
  return {
    id: article.id,
    slug: article.slug,
    title:   pick(article.title,   article.titleEn,   locale),
    excerpt: pick(article.excerpt, article.excerptEn, locale),
    content: pick(article.content, article.contentEn, locale),
    category: article.category,
    author: article.author,
    publishedAt: article.publishedAt?.toISOString() || article.createdAt.toISOString(),
    imageUrl: article.imageUrl,
    tags: (article.tags as string[]) || [],
    featured: article.featured,
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
    const events = await prisma.event.findMany({
      where: {
        status: 'PUBLISHED',
        date: { gte: new Date() },
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

export async function getEventBySlug(slug: string, locale: DbLocale = 'de'): Promise<EventData | null> {
  return safeDbQuery(async () => {
    const event = await prisma.event.findUnique({
      where: { slug },
    })
    return event ? transformEvent(event, locale) : null
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
