/**
 * Send Newsletter to Missing Recipients
 * POST /api/admin/newsletters/[id]/send-missing
 *
 * Sends the newsletter only to ACTIVE subscribers who do NOT yet have a SENT
 * NewsletterEvent for it. Use this after the initial send had partial failures
 * (e.g. Resend Free-tier daily limit), or after marking already-delivered
 * recipients via /mark-sent.
 *
 * Unlike /send, this endpoint works on newsletters with status === 'SENT'.
 */

import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api-response'
import { getNewsletterWithContent } from '@/lib/newsletters'
import { sendNewsletter } from '@/lib/email-send'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function POST(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id: newsletterId } = await params

    const newsletter = await getNewsletterWithContent(newsletterId)

    if (!newsletter) {
      return errorResponse('NOT_FOUND', 'Newsletter not found', 404)
    }

    const result = await sendNewsletter(newsletterId, { resumeMissing: true })

    return successResponse({
      message: 'Resend to missing recipients completed',
      recipientCount: result.success,
      failedCount: result.failed,
      total: result.total,
    })
  } catch (error: unknown) {
    console.error('Newsletter send-missing error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'

    // Distinguish "nothing to do" from real errors so the UI can show a friendly message
    if (message === 'No recipients found') {
      return errorResponse(
        'NO_MISSING_RECIPIENTS',
        'Alle aktiven Empfänger haben den Newsletter bereits erhalten.',
        409
      )
    }

    return errorResponse('INTERNAL_ERROR', message, 500)
  }
}
