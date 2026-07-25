import { NextRequest, NextResponse } from 'next/server'
import { requireApiRole } from '@/lib/roles.server'
import { ROLES } from '@/lib/roles'
import prisma from '@/lib/prisma'

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[äÄ]/g, 'ae')
    .replace(/[öÖ]/g, 'oe')
    .replace(/[üÜ]/g, 'ue')
    .replace(/[ß]/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// POST - Duplicate an event
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireApiRole(ROLES.EDITOR)
  if (guard.response) return guard.response

  const { id } = await params

  try {
    const original = await prisma.event.findUnique({ where: { id } })

    if (!original) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Generate unique slug
    let slug = generateSlug(original.title)
    const existing = await prisma.event.findUnique({ where: { slug } })
    if (existing) {
      slug = `${slug}-${Date.now()}`
    }

    const duplicate = await prisma.event.create({
      data: {
        slug,
        title: original.title,
        subtitle: original.subtitle,
        description: original.description,
        date: original.date,
        endDate: original.endDate,
        time: original.time,
        location: original.location,
        category: original.category,
        ticketUrl: null,        // Ticket-Link entfernen
        price: original.price,
        imageUrl: original.imageUrl,
        featured: false,        // Nicht automatisch featured
        highlights: original.highlights ?? [],
        status: 'DRAFT',        // Immer als Entwurf speichern
        recurrence: original.recurrence,
        recurrenceEnd: original.recurrenceEnd,
        createdBy: guard.userId,
      },
    })

    return NextResponse.json(duplicate, { status: 201 })
  } catch (error) {
    console.error('Error duplicating event:', error)
    return NextResponse.json({ error: 'Failed to duplicate event' }, { status: 500 })
  }
}
