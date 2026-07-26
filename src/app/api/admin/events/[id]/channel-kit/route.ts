import { NextRequest, NextResponse } from 'next/server'
import { requireApiRole } from '@/lib/roles.server'
import { ROLES } from '@/lib/roles'
import prisma from '@/lib/prisma'
import { buildChannelKit } from '@/lib/channel-kit/build'

/**
 * GET /api/admin/events/[id]/channel-kit
 *
 * Liefert die fertigen Portaltexte für alle Zielkanäle plus den Stand der
 * Verteilung. Es wird nichts gespeichert und nichts nach außen geschickt: die
 * Texte entstehen bei jedem Aufruf frisch aus dem Event, deshalb reicht die
 * Leserolle.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireApiRole(ROLES.VIEWER)
  if (guard.response) return guard.response

  const { id } = await params

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      // Serientermine gehören in die Terminliste des Elternevents, nicht in
      // sechsundzwanzig eigene Kits.
      childEvents: {
        where: { status: { not: 'ARCHIVED' } },
        select: { id: true, date: true, time: true, endTime: true },
        orderBy: { date: 'asc' },
      },
      distributions: {
        select: {
          channel: true,
          status: true,
          externalUrl: true,
          completedAt: true,
        },
      },
    },
  })

  if (!event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 })
  }

  const kit = buildChannelKit({
    id: event.id,
    slug: event.slug,
    title: event.title,
    subtitle: event.subtitle,
    description: event.description,
    date: event.date,
    time: event.time,
    endTime: event.endTime,
    location: event.location,
    category: event.category,
    ticketUrl: event.ticketUrl,
    price: event.price,
    imageUrl: event.imageUrl,
    parentEventId: event.parentEventId,
    childEvents: event.childEvents,
  })

  return NextResponse.json({ kit, distributions: event.distributions })
}
