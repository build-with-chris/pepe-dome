/**
 * Newsletter preview endpoint
 * GET /api/admin/newsletters/[id]/preview
 */

import { NextRequest } from 'next/server'
import { errorResponse } from '@/lib/api-response'
import { getNewsletterWithContent } from '@/lib/newsletters'
import { renderEmailToHtml } from '@/lib/email-renderer'

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

      for (const item of newsletter.content) {
        const key = item.sectionHeading || 'default'
        if (!sections.has(key)) {
          sections.set(key, {
            sectionHeading: item.sectionHeading || undefined,
            sectionDescription: item.sectionDescription || undefined,
            items: [],
          })
        }

        // Map content to template format
        // Note: In a real implementation, you would fetch the actual content
        // from the database using contentId and contentType
        sections.get(key).items.push({
          type: item.contentType.toLowerCase(),
          data: {
            // Placeholder data - replace with actual content fetch
            title: `${item.contentType} - ${item.contentId || 'Sample'}`,
            description: item.sectionDescription || 'Preview content description',
            ctaUrl: '#',
            ctaLabel: 'Mehr erfahren',
            // For events
            date: 'TBD',
            time: 'TBD',
            location: 'PEPE Dome, Munchen',
            // For articles
            excerpt: 'Preview excerpt...',
            articleUrl: '#',
            category: item.contentType,
          },
        })
      }

      contentSections.push(...Array.from(sections.values()))
    }

    // If no content, show a placeholder section
    if (contentSections.length === 0) {
      contentSections.push({
        sectionHeading: 'Vorschau-Inhalt',
        sectionDescription: 'Fuge Inhalte hinzu, um sie hier zu sehen.',
        items: [],
      })
    }

    // Dynamic import to avoid bundling react-email in client build
    const NewsletterTemplate = (await import('@/components/email/templates/NewsletterTemplate')).default

    // Render the newsletter using React Email template
    const html = await renderEmailToHtml(NewsletterTemplate, {
      subject: newsletter.subject,
      preheader: newsletter.preheader || undefined,
      newsletterSlug: newsletter.slug,
      heroImageUrl: newsletter.heroImageUrl || undefined,
      heroTitle: newsletter.heroTitle || undefined,
      heroSubtitle: newsletter.heroSubtitle || undefined,
      heroCTALabel: newsletter.heroCTALabel || undefined,
      heroCTAUrl: newsletter.heroCTAUrl || undefined,
      contentSections,
      subscriberId: 'preview-subscriber-id',
      subscriberEmail: 'preview@example.com',
      firstName: 'Vorschau',
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
