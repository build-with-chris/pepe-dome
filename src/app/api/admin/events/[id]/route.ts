import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const eventUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  subtitle: z.string().optional().nullable(),
  description: z.string().min(1).optional(),
  date: z.string().transform((val) => val ? new Date(val) : undefined).optional(),
  endDate: z.string().optional().nullable().transform((val) => (val && val !== '') ? new Date(val) : null),
  time: z.string().optional().nullable(),
  location: z.string().min(1).optional(),
  category: z.enum(['SHOW', 'PREMIERE', 'FESTIVAL', 'WORKSHOP', 'OPEN_TRAINING', 'KINDERTRAINING', 'BUSINESS', 'OPEN_AIR', 'EVENT']).optional(),
  ticketUrl: z.string().optional().nullable().or(z.literal('')),
  price: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable().or(z.literal('')),
  featured: z.boolean().optional(),
  highlights: z.array(z.string()).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  recurrence: z.enum(['DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY']).optional().nullable().or(z.literal('')),
  recurrenceEnd: z.string().optional().nullable().transform((val) => (val && val !== '') ? new Date(val) : null),
})

// GET - Get single event
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      articles: {
        include: { article: { select: { id: true, title: true, slug: true } } }
      },
      childEvents: { select: { id: true, date: true, status: true } },
    },
  })

  if (!event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 })
  }

  return NextResponse.json(event)
}

// PUT - Update event
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    const body = await request.json()
    const data = eventUpdateSchema.parse(body)

    // Clean up empty strings to null
    const cleanData: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(data)) {
      if (value === '') {
        cleanData[key] = null
      } else if (value !== undefined) {
        cleanData[key] = value
      }
    }

    const event = await prisma.event.update({
      where: { id },
      data: cleanData,
    })

    return NextResponse.json(event)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.issues }, { status: 400 })
    }
    console.error('Error updating event:', error)
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 })
  }
}

// DELETE - Delete event
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    await prisma.event.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting event:', error)
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 })
  }
}
