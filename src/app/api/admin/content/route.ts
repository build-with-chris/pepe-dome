/**
 * Content selection endpoint for newsletter builder
 * GET /api/admin/content - Fetch events, articles, shows for selection
 */

import { NextRequest } from 'next/server'
import { contentFilterSchema } from '@/lib/validation'
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response'
import { prisma } from '@/lib/prisma'
import { ContentStatus, EventCategory, Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check (Phase 5)

    // Parse and validate query parameters
    const searchParams = Object.fromEntries(request.nextUrl.searchParams)
    const validation = contentFilterSchema.safeParse(searchParams)

    if (!validation.success) {
      return validationErrorResponse(validation.error)
    }

    const { startDate, endDate, category, tags } = validation.data

    // Build event query filters
    // Include both PUBLISHED and DRAFT for admin selection
    const eventWhere: Prisma.EventWhereInput = {
      status: { in: [ContentStatus.PUBLISHED, ContentStatus.DRAFT] },
    }

    if (startDate) {
      eventWhere.date = { ...eventWhere.date as object, gte: new Date(startDate) }
    }
    if (endDate) {
      eventWhere.date = { ...eventWhere.date as object, lte: new Date(endDate) }
    }
    if (category && Object.values(EventCategory).includes(category as EventCategory)) {
      eventWhere.category = category as EventCategory
    }

    // Fetch events from database
    const events = await prisma.event.findMany({
      where: eventWhere,
      orderBy: { date: 'desc' },
    })

    // Build article query filters
    // Include both PUBLISHED and DRAFT for admin selection
    const articleWhere: Prisma.ArticleWhereInput = {
      status: { in: [ContentStatus.PUBLISHED, ContentStatus.DRAFT] },
    }

    if (category) {
      articleWhere.category = category
    }
    if (tags) {
      const tagList = tags.split(',').map((t) => t.trim())
      // Filter by tags - articles have tags as JSON array
      articleWhere.OR = tagList.map(tag => ({
        tags: {
          array_contains: [tag],
        },
      }))
    }

    // Fetch articles from database
    const articles = await prisma.article.findMany({
      where: articleWhere,
      orderBy: { publishedAt: 'desc' },
    })

    // Format content for newsletter builder
    const content = [
      ...events.map((event: {
        id: string
        title: string
        subtitle: string | null
        description: string
        imageUrl: string | null
        date: Date
        category: string
        featured: boolean
      }) => ({
        id: event.id,
        type: 'EVENT' as const,
        title: event.title,
        subtitle: event.subtitle,
        description: event.description,
        imageUrl: event.imageUrl,
        date: event.date.toISOString(),
        category: event.category,
        featured: event.featured,
      })),
      ...articles.map((article: {
        id: string
        title: string
        excerpt: string
        imageUrl: string | null
        publishedAt: Date | null
        category: string
        featured: boolean
      }) => ({
        id: article.id,
        type: 'ARTICLE' as const,
        title: article.title,
        excerpt: article.excerpt,
        imageUrl: article.imageUrl,
        publishedAt: article.publishedAt?.toISOString(),
        category: article.category,
        featured: article.featured,
      })),
    ]

    // Sort by date (newest first)
    content.sort((a, b) => {
      const dateA = new Date('date' in a ? a.date : (a.publishedAt || ''))
      const dateB = new Date('date' in b ? b.date : (b.publishedAt || ''))
      return dateB.getTime() - dateA.getTime()
    })

    return successResponse(content, {
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Content fetch error:', error)
    return errorResponse(
      'INTERNAL_ERROR',
      'An error occurred while fetching content.',
      500
    )
  }
}
