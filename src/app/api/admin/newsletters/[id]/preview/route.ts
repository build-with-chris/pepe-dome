/**
 * Newsletter-Vorschau
 * GET /api/admin/newsletters/[id]/preview
 *
 * Nutzt exakt dasselbe Viewmodel und dasselbe Template wie der Versand.
 * Vorher lag hier eine zweite, eigenständige Aufbereitungslogik, die sich
 * vom Versand unterschied. Die Vorschau war damit keine verlässliche
 * Aussage darüber, was die Empfänger sehen.
 */

import { NextRequest } from 'next/server'
export const dynamic = 'force-dynamic'
import { errorResponse } from '@/lib/api-response'
import { getNewsletterViewModel } from '@/lib/newsletter-content'
import { renderEmailToHtml } from '@/lib/email-renderer'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const viewModel = await getNewsletterViewModel(id)
    if (!viewModel) {
      return errorResponse('NOT_FOUND', 'Newsletter not found', 404)
    }

    const NewsletterTemplate = (await import('@/components/email/templates/NewsletterTemplate')).default

    const html = await renderEmailToHtml(NewsletterTemplate, {
      viewModel,
      subscriberId: 'preview-subscriber-id',
      subscriberEmail: 'vorschau@pepe-dome.de',
      // Kein firstName: zeigt die neutrale Anrede, also den Fall, der für
      // die meisten Empfänger gilt, solange keine Vornamen erfasst sind
    })

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    })
  } catch (error) {
    console.error('Preview error:', error)
    return errorResponse('INTERNAL_ERROR', 'An error occurred while generating preview.', 500)
  }
}
