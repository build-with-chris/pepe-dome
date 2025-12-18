/**
 * Send Newsletter Immediately
 * POST /api/admin/newsletters/[id]/send
 */

import { NextRequest } from 'next/server'
import {
  successResponse,
  errorResponse,
} from '@/lib/api-response'
import { getNewsletterWithContent, markNewsletterSent } from '@/lib/newsletters'
import { prisma } from '@/lib/prisma'

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

    // Get active subscribers
    const subscribers = await prisma.subscriber.findMany({
      where: { status: 'ACTIVE' },
      select: { id: true, email: true },
    })

    if (subscribers.length === 0) {
      return errorResponse(
        'NO_SUBSCRIBERS',
        'No active subscribers to send to',
        400
      )
    }

    // TODO: In Phase 4, implement actual sending via Resend
    // For now, just mark as sent
    // await sendNewsletterToSubscribers(newsletter, subscribers)

    // Update newsletter status
    await markNewsletterSent(newsletterId, subscribers.length)

    return successResponse({
      message: 'Newsletter sent successfully',
      recipientCount: subscribers.length,
    })
  } catch (error: unknown) {
    console.error('Newsletter send error:', error)
    return errorResponse(
      'INTERNAL_ERROR',
      'An error occurred while sending the newsletter.',
      500
    )
  }
}
