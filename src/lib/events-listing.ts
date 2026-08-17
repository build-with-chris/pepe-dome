/**
 * Die Terminliste, gemeinsame Quelle für Seite und API.
 *
 * Die Seite /events lieferte früher ein Skelett aus und holte die Termine erst
 * im Browser, mit zwei Abrufen nacheinander: erst welcher Monat überhaupt
 * Termine hat, dann die Termine dieses Monats. Wer aus einer Anzeige kommt, sah
 * dadurch zuerst pulsierende Platzhalter, auf mobilem Netz lange.
 *
 * Beides passiert jetzt beim Rendern auf dem Server. Die Routen unter
 * /api/events bleiben, sie bedienen das Blättern und benutzen dieselben
 * Funktionen, damit die Liste nicht an zwei Orten unterschiedlich entsteht.
 */

import 'server-only'
import type { Event } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { transformEvent, type DbLocale, type EventData } from '@/lib/db-data'
import { imMonatFilter, nichtVorbeiFilter, tagesbeginn } from '@/lib/event-window'

export interface ListingMonth {
  year: number
  /** 1 bis 12, nicht der Monatsindex von JavaScript. */
  month: number
}

/**
 * Der Monat, mit dem die Liste aufgeht.
 *
 * Nicht zwingend der aktuelle: steht im laufenden Monat nichts mehr an, wäre
 * die Seite beim Aufschlagen leer. Gezeigt wird deshalb der Monat des nächsten
 * Termins, und nur wenn gar keiner ansteht der aktuelle.
 */
export async function resolveListingMonth(now: Date = new Date()): Promise<ListingMonth> {
  // Ab Mitternacht, sonst fällt ein Termin von heute Morgen aus der Liste.
  const heute = tagesbeginn(now)

  // Ein mehrtägiger Termin, der gerade läuft, zählt als der nächste. Sonst
  // schlägt die Seite im Folgemonat auf, während im Dome noch etwas stattfindet.
  const nextEvent = await prisma.event.findFirst({
    where: { status: 'PUBLISHED', ...nichtVorbeiFilter(heute) },
    orderBy: { date: 'asc' },
    select: { date: true },
  })

  const stichtag = nextEvent?.date ?? heute
  return { year: stichtag.getFullYear(), month: stichtag.getMonth() + 1 }
}

/** Alle veröffentlichten Termine eines Monats, aufsteigend nach Datum. */
export async function getEventsForMonth(
  year: number,
  month: number,
  locale: DbLocale = 'de'
): Promise<EventData[]> {
  const start = new Date(year, month - 1, 1)
  const ende = new Date(year, month, 0, 23, 59, 59)

  const events = await prisma.event.findMany({
    where: { status: 'PUBLISHED', ...imMonatFilter(start, ende) },
    orderBy: { date: 'asc' },
  })

  // Die Annotation ist nötig, weil `prisma` ohne DATABASE_URL ein Mock ist und
  // der Rückgabetyp dadurch weit wird. Siehe src/lib/prisma.ts.
  return events.map((event: Event) => transformEvent(event, locale))
}
