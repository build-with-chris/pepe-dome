/**
 * Newsletter preview endpoint
 * GET /api/admin/newsletters/[id]/preview
 */

import { NextRequest } from 'next/server'
import { errorResponse } from '@/lib/api-response'
import { getNewsletterWithContent } from '@/lib/newsletters'
import { renderEmailToHtml } from '@/lib/email-renderer'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // TODO: Add authentication check (Phase 5)

    const { id } = await params
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // Check if newsletter exists
    const newsletter = await getNewsletterWithContent(id)
    if (!newsletter) {
      return errorResponse('NOT_FOUND', 'Newsletter not found', 404)
    }

    // Transform newsletter content into sections for the template
    const contentSections = []

    if (newsletter.content && newsletter.content.length > 0) {
      // Group content by section heading
      const sections = new Map()

      // Collect all content IDs by type for batch fetching
      const eventIds: string[] = []
      const articleIds: string[] = []

      for (const item of newsletter.content) {
        if (item.contentId) {
          if (item.contentType === 'EVENT' || item.contentType === 'SHOW') {
            eventIds.push(item.contentId)
          } else if (item.contentType === 'ARTICLE') {
            articleIds.push(item.contentId)
          }
        }
      }

      // Batch fetch all events and articles
      // Note: contentId can be either UUID or slug, so we search by both
      const [events, articles] = await Promise.all([
        eventIds.length > 0
          ? prisma.event.findMany({
              where: {
                OR: [
                  { id: { in: eventIds } },
                  { slug: { in: eventIds } },
                ],
              },
            })
          : Promise.resolve([]),
        articleIds.length > 0
          ? prisma.article.findMany({
              where: {
                OR: [
                  { id: { in: articleIds } },
                  { slug: { in: articleIds } },
                ],
              },
            })
          : Promise.resolve([]),
      ])

      // Create lookup maps (by both id and slug for flexibility)
      const eventMap = new Map<string, typeof events[0]>()
      events.forEach((e: typeof events[0]) => {
        eventMap.set(e.id, e)
        eventMap.set(e.slug, e)
      })
      const articleMap = new Map<string, typeof articles[0]>()
      articles.forEach((a: typeof articles[0]) => {
        articleMap.set(a.id, a)
        articleMap.set(a.slug, a)
      })

      for (const item of newsletter.content) {
        // CUSTOM_SECTION items are standalone - each one is its own section
        if (item.contentType === 'CUSTOM_SECTION') {
          // Create a unique section for each custom content
          const customSection = {
            sectionHeading: item.sectionHeading || undefined,
            sectionDescription: item.sectionDescription || undefined,
            items: [], // No items - the heading/description IS the content
          }
          contentSections.push(customSection)
          continue
        }

        // For EVENT/ARTICLE items, group by section heading
        const key = item.sectionHeading || 'default'
        if (!sections.has(key)) {
          sections.set(key, {
            sectionHeading: item.sectionHeading || undefined,
            sectionDescription: item.sectionDescription || undefined,
            items: [],
          })
        }

        // Map content to template format based on content type
        if ((item.contentType === 'EVENT' || item.contentType === 'SHOW') && item.contentId) {
          const event = eventMap.get(item.contentId)
          if (event) {
            // Format the date in German
            const eventDate = new Date(event.date)
            const formattedDate = eventDate.toLocaleDateString('de-DE', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })

            // Convert event image URL to absolute
            const eventImageUrl = event.imageUrl
              ? (event.imageUrl.startsWith('http') ? event.imageUrl : `${baseUrl}${event.imageUrl}`)
              : undefined

            sections.get(key).items.push({
              type: 'event',
              data: {
                title: event.title,
                description: event.subtitle || event.description.substring(0, 150) + '...',
                date: formattedDate,
                time: event.time || '',
                location: event.location,
                eventUrl: `${baseUrl}/events/${event.slug}`,
                ctaUrl: event.ticketUrl || `${baseUrl}/events/${event.slug}`,
                ctaLabel: (() => {
                  if (!event.ticketUrl) return 'Mehr erfahren';
                  const isEmail = event.ticketUrl.includes('@') && !event.ticketUrl.startsWith('http');
                  return isEmail ? 'Anmelden via Mail' : 'Tickets kaufen';
                })(),
                imageUrl: eventImageUrl,
              },
            })
          }
        } else if (item.contentType === 'ARTICLE' && item.contentId) {
          const article = articleMap.get(item.contentId)
          if (article) {
            // Convert article image URL to absolute
            const articleImageUrl = article.imageUrl
              ? (article.imageUrl.startsWith('http') ? article.imageUrl : `${baseUrl}${article.imageUrl}`)
              : undefined

            sections.get(key).items.push({
              type: 'article',
              data: {
                title: article.title,
                excerpt: article.excerpt,
                articleUrl: `${baseUrl}/news/${article.slug}`,
                imageUrl: articleImageUrl,
                category: article.category,
              },
            })
          }
        }
      }

      contentSections.push(...Array.from(sections.values()))
    }

    // If no content, show a placeholder section
    if (contentSections.length === 0) {
      contentSections.push({
        sectionHeading: 'Vorschau-Inhalt',
        sectionDescription: 'Füge Inhalte hinzu, um sie hier zu sehen.',
        items: [],
      })
    }

    // Helper to convert relative URLs to absolute URLs
    const toAbsoluteUrl = (url: string | null | undefined): string | undefined => {
      if (!url) return undefined
      // Already absolute URL
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return url
      }
      // Relative URL - prepend base URL
      return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`
    }

    // Dynamic import to avoid bundling react-email in client build
    const NewsletterTemplate = (await import('@/components/email/templates/NewsletterTemplate')).default

    // Render the newsletter using React Email template
    const html = await renderEmailToHtml(NewsletterTemplate, {
      subject: newsletter.subject,
      preheader: newsletter.preheader || undefined,
      newsletterSlug: newsletter.slug,
      heroImageUrl: toAbsoluteUrl(newsletter.heroImageUrl),
      heroTitle: newsletter.heroTitle || undefined,
      heroSubtitle: newsletter.heroSubtitle || undefined,
      heroCTALabel: newsletter.heroCTALabel || undefined,
      heroCTAUrl: toAbsoluteUrl(newsletter.heroCTAUrl),
      introText: newsletter.introText || undefined,
      contentSections,
      subscriberId: 'preview-subscriber-id',
      subscriberEmail: 'preview@example.com',
      // No firstName = shows "Liebe Freunde von PEPE,"
    })

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    })
  } catch (error) {
    console.error('Preview error:', error)
    return errorResponse(
      'INTERNAL_ERROR',
      'An error occurred while generating preview.',
      500
    )
  }
}
