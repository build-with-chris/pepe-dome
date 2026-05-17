/**
 * Get Send Status of a Newsletter
 * GET /api/admin/newsletters/[id]/send-status
 *
 * Returns counts of how many ACTIVE subscribers have already received the newsletter
 * (based on SENT NewsletterEvents) vs how many are still missing.
 *
 * Used by the "Wiederversand" UI to figure out how many emails would be sent
 * if the admin clicks "An fehlende senden".
 */

import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api-response'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id: newsletterId } = await params

    const newsletter = await prisma.newsletter.findUnique({
      where: { id: newsletterId },
      select: { id: true, recipientCount: true, status: true },
    })

    if (!newsletter) {
      return errorResponse('NOT_FOUND', 'Newsletter not found', 404)
    }

    // Total ACTIVE subscribers
    const activeSubscriberCount = await prisma.subscriber.count({
      where: { status: 'ACTIVE' },
    })

    // Unique subscriber IDs with a SENT event for this newsletter
    const alreadySentRows = await prisma.newsletterEvent.findMany({
      where: {
        newsletterId,
        eventType: 'SENT',
        subscriberId: { not: null },
      },
      select: { subscriberId: true },
      distinct: ['subscriberId'],
    })
    const alreadySentSubscriberCount = alreadySentRows.length

    // Active subscribers that have NOT yet received this newsletter
    const alreadySentIds = alreadySentRows
      .map((r: { subscriberId: string | null }) => r.subscriberId)
      .filter((id: string | null): id is string => id !== null)

    const missingCount = await prisma.subscriber.count({
      where: {
        status: 'ACTIVE',
        ...(alreadySentIds.length > 0 ? { id: { notIn: alreadySentIds } } : {}),
      },
    })

    return successResponse({
      newsletterId,
      status: newsletter.status,
      recipientCount: newsletter.recipientCount,
      activeSubscriberCount,
      alreadySentSubscriberCount,
      missingCount,
    })
  } catch (error: unknown) {
    console.error('Send-status error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return errorResponse('INTERNAL_ERROR', message, 500)
  }
}
