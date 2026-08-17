/**
 * Die Terminliste wird auf dem Server geladen.
 *
 * Vorher lieferte /events ein Skelett aus und holte die Termine erst mit zwei
 * aufeinanderfolgenden Abrufen im Browser. Wer aus einer Anzeige kommt, sah
 * damit zuerst pulsierende Platzhalter. Diese Datei ist die gemeinsame Quelle
 * für Seite und API.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    event: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
    },
  },
}))

const { resolveListingMonth, getEventsForMonth } = await import('@/lib/events-listing')
const { prisma } = await import('@/lib/prisma')

function dbEvent(overrides: Record<string, unknown> = {}) {
  return {
    id: 'evt-1',
    slug: 'qigong-am-morgen',
    title: 'Qigong am Morgen',
    subtitle: null,
    description: 'Sanfte Bewegung unter der Kuppel.',
    date: new Date('2026-08-12T00:00:00.000Z'),
    endDate: null,
    time: '09:00',
    endTime: null,
    location: 'Pepe Dome',
    category: 'WORKSHOP',
    ticketUrl: null,
    price: 'Eintritt frei',
    trailerUrl: null,
    imageUrl: null,
    featured: false,
    highlights: [],
    translations: {},
    status: 'PUBLISHED',
    createdBy: null,
    createdAt: new Date('2026-07-01T00:00:00.000Z'),
    updatedAt: new Date('2026-07-01T00:00:00.000Z'),
    recurrence: null,
    recurrenceEnd: null,
    parentEventId: null,
    ...overrides,
  }
}

describe('resolveListingMonth', () => {
  beforeEach(() => vi.clearAllMocks())

  it('zeigt den Monat des nächsten Termins, nicht zwangsläufig den aktuellen', async () => {
    vi.mocked(prisma.event.findFirst).mockResolvedValue({
      date: new Date(2026, 9, 4),
    } as never)

    const result = await resolveListingMonth(new Date(2026, 7, 8))

    expect(result).toEqual({ year: 2026, month: 10 })
  })

  it('fragt nur veröffentlichte Termine ab Heute ab, gemessen am Ende', async () => {
    vi.mocked(prisma.event.findFirst).mockResolvedValue(null as never)

    await resolveListingMonth(new Date(2026, 7, 8, 14, 30))

    const arg = vi.mocked(prisma.event.findFirst).mock.calls[0][0] as {
      where: { status: string; OR: [{ endDate: { gte: Date } }, { date: { gte: Date } }] }
      orderBy: { date: string }
    }
    expect(arg.where.status).toBe('PUBLISHED')
    expect(arg.orderBy.date).toBe('asc')
    // Verglichen wird das Ende, damit ein laufender mehrtägiger Termin den
    // Startmonat bestimmt und die Seite nicht schon im Folgemonat aufschlägt.
    const stichtag = arg.where.OR[0].endDate.gte
    // Ab Mitternacht, sonst fällt ein Termin von heute Morgen aus der Liste.
    expect(stichtag.getHours()).toBe(0)
    expect(stichtag.getDate()).toBe(8)
    // Der zweite Zweig fängt die eintägigen Termine ab, bei denen endDate leer
    // ist. Ohne ihn träfe das gte oben nichts und sie fielen alle weg.
    expect(arg.where.OR[1].date.gte).toEqual(stichtag)
  })

  it('bleibt beim aktuellen Monat, wenn gar kein Termin ansteht', async () => {
    vi.mocked(prisma.event.findFirst).mockResolvedValue(null as never)

    const result = await resolveListingMonth(new Date(2026, 7, 8))

    expect(result).toEqual({ year: 2026, month: 8 })
  })
})

describe('getEventsForMonth', () => {
  beforeEach(() => vi.clearAllMocks())

  it('grenzt auf den angefragten Monat ein und sortiert nach Datum', async () => {
    vi.mocked(prisma.event.findMany).mockResolvedValue([dbEvent()] as never)

    await getEventsForMonth(2026, 8, 'de')

    const arg = vi.mocked(prisma.event.findMany).mock.calls[0][0] as {
      where: {
        status: string
        date: { lte: Date }
        OR: [{ endDate: { gte: Date } }, { date: { gte: Date } }]
      }
      orderBy: { date: string }
    }
    expect(arg.where.status).toBe('PUBLISHED')
    expect(arg.orderBy.date).toBe('asc')
    // Beginn vor Monatsende, Ende nach Monatsbeginn: eine Überschneidung, kein
    // Beginn im Monat. Sonst fehlt ein Termin vom 30.8. bis 3.9. im September.
    const monatsBeginn = arg.where.OR[0].endDate.gte
    expect(monatsBeginn.getMonth()).toBe(7)
    expect(monatsBeginn.getDate()).toBe(1)
    // Letzter Tag des Monats, hier der 31. August.
    expect(arg.where.date.lte.getMonth()).toBe(7)
    expect(arg.where.date.lte.getDate()).toBe(31)
  })

  it('gibt die Termine in der Form zurück, die die Liste erwartet', async () => {
    vi.mocked(prisma.event.findMany).mockResolvedValue([dbEvent()] as never)

    const events = await getEventsForMonth(2026, 8, 'de')

    expect(events).toHaveLength(1)
    expect(events[0]).toMatchObject({
      slug: 'qigong-am-morgen',
      title: 'Qigong am Morgen',
      category: 'WORKSHOP',
    })
    // Das Datum muss als Zeichenkette rausgehen, sonst kommt es nicht durch
    // die Server-Client-Grenze.
    expect(typeof events[0].date).toBe('string')
  })

  it('liefert eine leere Liste, wenn der Monat leer ist', async () => {
    vi.mocked(prisma.event.findMany).mockResolvedValue([] as never)

    await expect(getEventsForMonth(2026, 12, 'de')).resolves.toEqual([])
  })
})
