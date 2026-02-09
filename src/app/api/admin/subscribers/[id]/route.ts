/**
 * Subscriber Detail API
 * GET /api/admin/subscribers/[id]
 *
 * Returns detailed subscriber information including activity history
 * Requires Super Admin role
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isSuperAdmin } from '@/lib/roles.server'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Check Super Admin permission
    const isAdmin = await isSuperAdmin()
    if (!isAdmin) {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'Keine Berechtigung' } },
        { status: 403 }
      )
    }

    const { id } = await params

    // Fetch subscriber with activity history
    const subscriber = await prisma.subscriber.findUnique({
      where: { id },
      include: {
        newsletterEvents: {
          orderBy: { createdAt: 'desc' },
          take: 50, // Last 50 events
          include: {
            newsletter: {
              select: {
                id: true,
                subject: true,
                slug: true,
              },
            },
          },
        },
      },
    })

    if (!subscriber) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Subscriber nicht gefunden' } },
        { status: 404 }
      )
    }

    // Format response
    const response = {
      id: subscriber.id,
      email: subscriber.email,
      firstName: subscriber.firstName,
      status: subscriber.status,
      interests: subscriber.interests,
      confirmedAt: subscriber.confirmedAt,
      unsubscribedAt: subscriber.unsubscribedAt,
      createdAt: subscriber.createdAt,
      lastOpenAt: subscriber.lastOpenAt,
      lastClickAt: subscriber.lastClickAt,
      metadata: subscriber.metadata,
      activity: subscriber.newsletterEvents.map((event: {
        id: string
        eventType: string
        createdAt: Date
        eventData: Record<string, unknown> | null
        newsletter: {
          id: string
          subject: string
          slug: string
        } | null
      }) => ({
        id: event.id,
        eventType: event.eventType,
        createdAt: event.createdAt,
        newsletter: event.newsletter
          ? {
              id: event.newsletter.id,
              subject: event.newsletter.subject,
              slug: event.newsletter.slug,
            }
          : null,
        eventData: event.eventData,
      })),
    }

    return NextResponse.json({ data: response })
  } catch (error) {
    console.error('Get subscriber detail error:', error)
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Fehler beim Laden der Subscriber-Details',
        },
      },
      { status: 500 }
    )
  }
}
