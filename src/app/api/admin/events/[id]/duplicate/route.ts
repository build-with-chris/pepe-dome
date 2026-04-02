import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
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
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

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
        createdBy: userId,
      },
    })

    return NextResponse.json(duplicate, { status: 201 })
  } catch (error) {
    console.error('Error duplicating event:', error)
    return NextResponse.json({ error: 'Failed to duplicate event' }, { status: 500 })
  }
}
