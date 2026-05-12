import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma, type Event } from '@prisma/client'

type Locale = 'de' | 'en'

function pick<T>(de: T, en: T | null | undefined, locale: Locale): T {
  if (locale === 'en' && en !== null && en !== undefined) return en
  return de
}

function transform(event: Event, locale: Locale) {
  return {
    id: event.id,
    slug: event.slug,
    title:       pick(event.title,       event.titleEn,       locale),
    subtitle:    pick(event.subtitle,    event.subtitleEn,    locale),
    description: pick(event.description, event.descriptionEn, locale),
    date: event.date.toISOString(),
    endDate: event.endDate?.toISOString() || null,
    time: event.time,
    location:    pick(event.location,    event.locationEn,    locale),
    category: event.category,
    ticketUrl: event.ticketUrl,
    price:       pick(event.price,       event.priceEn,       locale),
    imageUrl: event.imageUrl,
    featured: event.featured,
    highlights:  pick(
      (event.highlights as string[]) || [],
      (event.highlightsEn as string[] | null) ?? null,
      locale
    ),
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const year = searchParams.get('year')
  const month = searchParams.get('month')
  const rawLocale = searchParams.get('locale')
  const locale: Locale = rawLocale === 'en' ? 'en' : 'de'

  try {
    const whereClause: Prisma.EventWhereInput = { status: 'PUBLISHED' }

    if (year && month) {
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1)
      const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59)
      whereClause.date = {
        gte: startDate,
        lte: endDate,
      }
    }

    const events = await prisma.event.findMany({
      where: whereClause,
      orderBy: { date: 'asc' },
    })

    const transformedEvents = events.map((e: Event) => transform(e, locale))
    return NextResponse.json(transformedEvents)
  } catch (error) {
    console.error('Failed to fetch events:', error)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}
