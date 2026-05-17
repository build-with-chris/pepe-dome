/**
 * Mark Subscribers as Already-Sent for a Newsletter
 * POST /api/admin/newsletters/[id]/mark-sent
 *
 * Used to backfill the "already received this newsletter" list when the initial
 * send happened outside of our SENT-event tracking (e.g. an old send before this
 * feature existed, or a partial Resend Free-tier delivery).
 *
 * Body: { emails: string[] }  — list of email addresses (one per line / comma / semicolon)
 * Behaviour:
 *  - Looks up subscribers by lowercase email
 *  - Creates a SENT NewsletterEvent for each that doesn't already have one
 *  - Returns counts of matched / created / unknown
 */

import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api-response'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ id: string }>
}

function parseEmails(input: unknown): string[] {
  if (Array.isArray(input)) {
    return input
      .filter((e): e is string => typeof e === 'string')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
  }
  if (typeof input === 'string') {
    return input
      .split(/[\s,;]+/)
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
  }
  return []
}

export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id: newsletterId } = await params

    const newsletter = await prisma.newsletter.findUnique({
      where: { id: newsletterId },
      select: { id: true },
    })

    if (!newsletter) {
      return errorResponse('NOT_FOUND', 'Newsletter not found', 404)
    }

    const body = await request.json().catch(() => ({}))
    const emails = parseEmails(body?.emails)

    if (emails.length === 0) {
      return errorResponse('VALIDATION_ERROR', 'No emails provided', 400)
    }

    // Deduplicate input emails
    const uniqueEmails = Array.from(new Set(emails))

    // Look up matching subscribers (Subscriber.email has @unique index)
    const subscribers = await prisma.subscriber.findMany({
      where: { email: { in: uniqueEmails } },
      select: { id: true, email: true },
    })

    const foundEmailSet = new Set(subscribers.map((s: { email: string }) => s.email.toLowerCase()))
    const notFoundEmails = uniqueEmails.filter((e: string) => !foundEmailSet.has(e))

    // Find which of the matched subscribers already have a SENT event for this newsletter
    const subscriberIds: string[] = subscribers.map((s: { id: string }) => s.id)
    const existingEvents = subscriberIds.length > 0
      ? await prisma.newsletterEvent.findMany({
          where: {
            newsletterId,
            eventType: 'SENT',
            subscriberId: { in: subscriberIds },
          },
          select: { subscriberId: true },
        })
      : []

    const existingIdSet = new Set(
      existingEvents
        .map((e: { subscriberId: string | null }) => e.subscriberId)
        .filter((id: string | null): id is string => id !== null)
    )

    const idsToCreate = subscriberIds.filter((id: string) => !existingIdSet.has(id))

    if (idsToCreate.length > 0) {
      await prisma.newsletterEvent.createMany({
        data: idsToCreate.map((subscriberId: string) => ({
          newsletterId,
          subscriberId,
          eventType: 'SENT' as const,
          eventData: { source: 'manual_import' },
        })),
      })
    }

    return successResponse({
      providedCount: uniqueEmails.length,
      matchedCount: subscribers.length,
      createdCount: idsToCreate.length,
      alreadyMarkedCount: subscribers.length - idsToCreate.length,
      notFoundCount: notFoundEmails.length,
      notFoundEmails: notFoundEmails.slice(0, 50), // cap for response size
    })
  } catch (error: unknown) {
    console.error('Mark-sent error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return errorResponse('INTERNAL_ERROR', message, 500)
  }
}
