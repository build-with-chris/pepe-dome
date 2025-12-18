import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  date: z.string().transform((val) => new Date(val)),
  endDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
  time: z.string().optional(),
  location: z.string().min(1, 'Location is required'),
  category: z.enum(['SHOW', 'PREMIERE', 'FESTIVAL', 'WORKSHOP', 'OPEN_TRAINING', 'KINDERTRAINING', 'BUSINESS', 'OPEN_AIR', 'EVENT']),
  ticketUrl: z.string().url().optional().or(z.literal('')),
  price: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  featured: z.boolean().default(false),
  highlights: z.array(z.string()).default([]),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  recurrence: z.enum(['DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY']).optional(),
  recurrenceEnd: z.string().optional().transform((val) => val ? new Date(val) : undefined),
})

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

// GET - List all events
export async function GET(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const status = searchParams.get('status')
  const category = searchParams.get('category')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')

  const where: Record<string, unknown> = {}
  if (status) where.status = status
  if (category) where.category = category

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      orderBy: { date: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        articles: {
          include: { article: { select: { id: true, title: true } } }
        }
      }
    }),
    prisma.event.count({ where }),
  ])

  return NextResponse.json({
    events,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  })
}

// POST - Create new event
export async function POST(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const data = eventSchema.parse(body)

    // Generate unique slug
    let slug = generateSlug(data.title)
    const existing = await prisma.event.findUnique({ where: { slug } })
    if (existing) {
      slug = `${slug}-${Date.now()}`
    }

    const event = await prisma.event.create({
      data: {
        slug,
        title: data.title,
        subtitle: data.subtitle || null,
        description: data.description,
        date: data.date,
        endDate: data.endDate || null,
        time: data.time || null,
        location: data.location,
        category: data.category,
        ticketUrl: data.ticketUrl || null,
        price: data.price || null,
        imageUrl: data.imageUrl || null,
        featured: data.featured,
        highlights: data.highlights,
        status: data.status,
        recurrence: data.recurrence || null,
        recurrenceEnd: data.recurrenceEnd || null,
        createdBy: userId,
      },
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.issues }, { status: 400 })
    }
    console.error('Error creating event:', error)
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}
