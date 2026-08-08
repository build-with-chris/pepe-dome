import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma, type Event } from '@prisma/client'
import { transformEvent, type DbLocale } from '@/lib/db-data'
import { getEventsForMonth } from '@/lib/events-listing'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const year = searchParams.get('year')
  const month = searchParams.get('month')
  const locale: DbLocale = searchParams.get('locale') === 'en' ? 'en' : 'de'

  try {
    // Ein Monat wird über dieselbe Funktion geladen, die die Seite /events beim
    // Rendern benutzt. Sonst entsteht dieselbe Liste an zwei Orten und läuft
    // irgendwann auseinander.
    if (year && month) {
      const events = await getEventsForMonth(parseInt(year), parseInt(month), locale)
      return NextResponse.json(events)
    }

    const events = await prisma.event.findMany({
      where: { status: 'PUBLISHED' },
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
