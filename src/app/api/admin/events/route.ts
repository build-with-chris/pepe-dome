import { NextRequest, NextResponse } from 'next/server'
import { requireApiRole } from '@/lib/roles.server'
import { ROLES } from '@/lib/roles'
import prisma from '@/lib/prisma'
import { toStoredTime } from '@/lib/event-time'
import { z } from 'zod'

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  date: z.string().transform((val) => new Date(val)),
  endDate: z.string().optional().nullable().transform((val) => (val && val !== '') ? new Date(val) : undefined),
  time: z.string().optional(),
  endTime: z.string().optional(),
  location: z.string().min(1, 'Location is required'),
  category: z.enum(['SHOW', 'PREMIERE', 'FESTIVAL', 'WORKSHOP', 'OPEN_TRAINING', 'KINDERTRAINING', 'BUSINESS', 'OPEN_AIR', 'EVENT']),
  ticketUrl: z.string().optional().or(z.literal('')),
  price: z.string().optional(),
  imageUrl: z.string().optional().or(z.literal('')),
  featured: z.boolean().default(false),
  highlights: z.array(z.string()).default([]),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  recurrence: z.enum(['DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY']).optional().or(z.literal('')),
  recurrenceEnd: z.string().optional().nullable().transform((val) => (val && val !== '') ? new Date(val) : undefined),
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
  const guard = await requireApiRole(ROLES.VIEWER)
  if (guard.response) return guard.response

  const searchParams = request.nextUrl.searchParams
  const status = searchParams.get('status')
  const category = searchParams.get('category')
  // 'upcoming' (ab heute, nächstes zuerst) | 'past' (vor heute, jüngstes zuerst) | 'all'
  const timeframe = searchParams.get('timeframe') || 'all'
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')

  const where: Record<string, unknown> = {}
  if (status) where.status = status
  if (category) where.category = category

  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  if (timeframe === 'upcoming') where.date = { gte: startOfToday }
  else if (timeframe === 'past') where.date = { lt: startOfToday }

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      orderBy: { date: timeframe === 'upcoming' ? 'asc' : 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        articles: {
          include: { article: { select: { id: true, title: true } } }
        },
        // Für die Spalte "verteilt": auf wie vielen Kanälen steht das Event
        // bereits. Nur erfolgreiche Einträge zählen, ein Fehlversuch ist keine
        // Veröffentlichung.
        distributions: {
          where: { status: 'success' },
          select: { channel: true },
        },
      }
    }),
    prisma.event.count({ where }),
  ])

  // Die Zeilen selbst braucht die Liste nicht, nur ihre Anzahl.
  type EventRow = Record<string, unknown> & { distributions: unknown[] }
  const withDistribution = (events as EventRow[]).map(({ distributions, ...event }) => ({
    ...event,
    distributedCount: distributions.length,
  }))

  return NextResponse.json({
    events: withDistribution,
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
  const guard = await requireApiRole(ROLES.EDITOR)
  if (guard.response) return guard.response

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
        // Uhrzeiten laufen durch die Normalisierung, damit "ab 20" und
        // "20:00 Uhr" nicht als zwei verschiedene Werte in der DB landen.
        time: toStoredTime(data.time),
        endTime: toStoredTime(data.endTime),
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
        createdBy: guard.userId,
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
