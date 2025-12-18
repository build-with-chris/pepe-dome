/**
 * Content selection endpoint for newsletter builder
 * GET /api/admin/content - Fetch events, articles, shows for selection
 */

import { NextRequest } from 'next/server'
import { contentFilterSchema } from '@/lib/validation'
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response'
import { getAllEvents, getAllNews } from '@/lib/data'

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

    // Fetch events
    let events = getAllEvents()

    // Apply filters
    if (startDate) {
      events = events.filter((e) => new Date(e.date) >= new Date(startDate))
    }
    if (endDate) {
      events = events.filter((e) => new Date(e.date) <= new Date(endDate))
    }
    if (category) {
      events = events.filter((e) => e.category === category)
    }

    // Fetch news articles
    let articles = getAllNews()

    if (category) {
      articles = articles.filter((a) => a.category === category)
    }
    if (tags) {
      const tagList = tags.split(',').map((t) => t.trim())
      articles = articles.filter((a) =>
        a.tags.some((tag) => tagList.includes(tag))
      )
    }

    // Format content for newsletter builder
    const content = [
      ...events.map((event) => ({
        id: event.id,
        type: 'EVENT' as const,
        title: event.title,
        subtitle: event.subtitle,
        description: event.description,
        imageUrl: event.imageUrl,
        date: event.date,
        category: event.category,
        featured: event.featured,
      })),
      ...articles.map((article) => ({
        id: article.id,
        type: 'ARTICLE' as const,
        title: article.title,
        excerpt: article.excerpt,
        imageUrl: article.imageUrl,
        publishedAt: article.publishedAt,
        category: article.category,
        featured: article.featured,
      })),
    ]

    // Sort by date (newest first)
    content.sort((a, b) => {
      const dateA = new Date('date' in a ? a.date : a.publishedAt)
      const dateB = new Date('date' in b ? b.date : b.publishedAt)
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
