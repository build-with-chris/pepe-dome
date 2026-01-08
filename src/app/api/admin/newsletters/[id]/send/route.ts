/**
 * Send Newsletter Immediately
 * POST /api/admin/newsletters/[id]/send
 */

import { NextRequest } from 'next/server'
import {
  successResponse,
  errorResponse,
} from '@/lib/api-response'
import { getNewsletterWithContent } from '@/lib/newsletters'
import { sendNewsletter } from '@/lib/email-send'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // TODO: Add authentication check (Phase 5)

    const { id: newsletterId } = await params

    // Fetch newsletter
    const newsletter = await getNewsletterWithContent(newsletterId)

    if (!newsletter) {
      return errorResponse('NOT_FOUND', 'Newsletter not found', 404)
    }

    // Validate newsletter can be sent
    if (newsletter.status !== 'DRAFT' && newsletter.status !== 'SCHEDULED') {
      return errorResponse(
        'INVALID_STATUS',
        'Newsletter must be in DRAFT or SCHEDULED status to send',
        400
      )
    }

    // Send newsletter to all active subscribers via Resend
    const result = await sendNewsletter(newsletterId)

    return successResponse({
      message: 'Newsletter sent successfully',
      recipientCount: result.success,
      failedCount: result.failed,
      total: result.total,
    })
  } catch (error: unknown) {
    console.error('Newsletter send error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return errorResponse(
      'INTERNAL_ERROR',
      `An error occurred while sending the newsletter: ${message}`,
      500
    )
  }
}
