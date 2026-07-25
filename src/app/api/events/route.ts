import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma, type Event } from '@prisma/client'
import { transformEvent, type DbLocale } from '@/lib/db-data'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const year = searchParams.get('year')
  const month = searchParams.get('month')
  const locale: DbLocale = searchParams.get('locale') === 'en' ? 'en' : 'de'

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

    return NextResponse.json(events.map((e: Event) => transformEvent(e, locale)))
  } catch (error) {
    const code = error instanceof Prisma.PrismaClientKnownRequestError ? error.code : undefined
    const message = error instanceof Error ? error.message : String(error)
    console.error('[api/events] DB query failed', {
      code,
      message,
      year,
      month,
      hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
    })
    // Die Einzelheiten stehen oben im Log. Nach draussen geht nur, dass es
    // schiefging.
    //
    // Vorher enthielt die Antwort die rohe Prisma-Meldung und obendrein
    // hasDatabaseUrl. Prisma-Fehlertexte nennen Host, Port, Datenbank- und
    // Benutzernamen — an einem unangemeldeten Aufrufer, der nur /api/events
    // aufrufen muss. Das ist eine fertige Landkarte der Infrastruktur.
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}
