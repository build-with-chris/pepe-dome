/**
 * Database data utilities - replaces JSON-based data.ts for events/articles
 * Static content (homepage, about, etc.) still uses content.json
 */

import { prisma } from './prisma'
import type { Event, Article } from '@prisma/client'

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

// Transform DB event to frontend format
function transformEvent(event: Event): EventData {
  return {
    id: event.id,
    slug: event.slug,
    title: event.title,
    subtitle: event.subtitle,
    description: event.description,
    date: event.date.toISOString(),
    endDate: event.endDate?.toISOString() || null,
    time: event.time,
    location: event.location,
    category: event.category,
    ticketUrl: event.ticketUrl,
    price: event.price,
    imageUrl: event.imageUrl,
    featured: event.featured,
    highlights: (event.highlights as string[]) || [],
  }
}

// Transform DB article to frontend format
function transformArticle(article: Article): ArticleData {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    content: article.content,
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

export async function getAllEvents(): Promise<EventData[]> {
  return safeDbQuery(async () => {
    const events = await prisma.event.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { date: 'asc' },
    })
    return events.map(transformEvent)
  }, [])
}

export async function getUpcomingEvents(): Promise<EventData[]> {
  return safeDbQuery(async () => {
    const events = await prisma.event.findMany({
      where: {
        status: 'PUBLISHED',
        date: { gte: new Date() },
      },
      orderBy: { date: 'asc' },
    })
    return events.map(transformEvent)
  }, [])
}

export async function getFeaturedEvents(): Promise<EventData[]> {
  return safeDbQuery(async () => {
    const events = await prisma.event.findMany({
      where: {
        status: 'PUBLISHED',
        featured: true,
      },
      orderBy: { date: 'asc' },
    })
    return events.map(transformEvent)
  }, [])
}

export async function getEventBySlug(slug: string): Promise<EventData | null> {
  return safeDbQuery(async () => {
    const event = await prisma.event.findUnique({
      where: { slug },
    })
    return event ? transformEvent(event) : null
  }, null)
}

export async function getEventById(id: string): Promise<EventData | null> {
  return safeDbQuery(async () => {
    const event = await prisma.event.findUnique({
      where: { id },
    })
    return event ? transformEvent(event) : null
  }, null)
}

export async function getEventsByMonth(year: number, month: number): Promise<EventData[]> {
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
    return events.map(transformEvent)
  }, [])
}

export async function getEventsByCategory(category: string): Promise<EventData[]> {
  return safeDbQuery(async () => {
    const events = await prisma.event.findMany({
      where: {
        status: 'PUBLISHED',
        category: category as any,
      },
      orderBy: { date: 'asc' },
    })
    return events.map(transformEvent)
  }, [])
}

// ============================================
// ARTICLE FUNCTIONS
// ============================================

export async function getAllArticles(): Promise<ArticleData[]> {
  return safeDbQuery(async () => {
    const articles = await prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
    })
    return articles.map(transformArticle)
  }, [])
}

export async function getFeaturedArticles(): Promise<ArticleData[]> {
  return safeDbQuery(async () => {
    const articles = await prisma.article.findMany({
      where: {
        status: 'PUBLISHED',
        featured: true,
      },
      orderBy: { publishedAt: 'desc' },
    })
    return articles.map(transformArticle)
  }, [])
}

export async function getRecentArticles(limit: number = 5): Promise<ArticleData[]> {
  return safeDbQuery(async () => {
    const articles = await prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      take: limit,
    })
    return articles.map(transformArticle)
  }, [])
}

export async function getArticleBySlug(slug: string): Promise<ArticleData | null> {
  return safeDbQuery(async () => {
    const article = await prisma.article.findUnique({
      where: { slug },
    })
    return article ? transformArticle(article) : null
  }, null)
}

export async function getArticlesByCategory(category: string): Promise<ArticleData[]> {
  return safeDbQuery(async () => {
    const articles = await prisma.article.findMany({
      where: {
        status: 'PUBLISHED',
        category,
      },
      orderBy: { publishedAt: 'desc' },
    })
    return articles.map(transformArticle)
  }, [])
}
