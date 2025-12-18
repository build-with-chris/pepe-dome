import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const year = searchParams.get('year')
  const month = searchParams.get('month')

  try {
    let whereClause: any = { status: 'PUBLISHED' }

    // If year and month provided, filter by month
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

    // Transform to frontend format
    const transformedEvents = events.map(event => ({
      id: event.id,
      slug: event.slug,
      title: event.title,
      subtitle: event.subtitle,
      description: event.description,
      date: event.date.toISOString(),
      endDate: event.endDate?.toISOString() || null,
      time: event.time,
      location: event.location,
      category: event.category,
      ticketUrl: event.ticketUrl,
      price: event.price,
      imageUrl: event.imageUrl,
      featured: event.featured,
      highlights: event.highlights || [],
    }))

    return NextResponse.json(transformedEvents)
  } catch (error) {
    console.error('Failed to fetch events:', error)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}
