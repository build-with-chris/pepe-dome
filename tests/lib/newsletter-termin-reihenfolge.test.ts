/**
 * Editor und Speichern nutzen dieselbe Reihenfolge wie die Mail.
 * Läuft gegen einen Prisma-Mock.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/prisma', () => {
  const prisma = { event: { findMany: vi.fn() }, article: { findMany: vi.fn() } }
  return { default: prisma, prisma }
})

const { terminReihenfolge, inhalteFuerEditor } = await import('@/lib/newsletter-content')
const { prisma } = await import('@/lib/prisma')
const db = prisma as unknown as {
  event: { findMany: ReturnType<typeof vi.fn> }
  article: { findMany: ReturnType<typeof vi.fn> }
}

const termin = (id: string, tag: string, time = '20:00') => ({
  id, slug: id, title: id, imageUrl: null, date: new Date(`${tag}T00:00:00Z`), time,
})
const block = (contentType: string, contentId: string | null, orderPosition: number) => ({
  contentType, contentId, sectionHeading: null, sectionDescription: null, orderPosition,
})

beforeEach(() => {
  db.event.findMany.mockResolvedValue([
    termin('samhain', '2026-10-31'),
    termin('open-stage', '2026-10-16'),
    termin('poetry', '2026-10-09'),
  ])
  db.article.findMany.mockResolvedValue([{ id: 'art', slug: 'art', title: 'Artikel', imageUrl: null }])
})

describe('terminReihenfolge', () => {
  it('liefert die alten Positionen in Datumsreihenfolge, Text bleibt stehen', async () => {
    const reihenfolge = await terminReihenfolge([
      block('EVENT', 'samhain', 0),
      block('CUSTOM_SECTION', null, 1),
      block('EVENT', 'open-stage', 2),
      block('EVENT', 'poetry', 3),
    ])
    // Platz 0, 2, 3 sind Termine: poetry (3), open-stage (2), samhain (0)
    expect(reihenfolge).toEqual([3, 1, 2, 0])
  })
})

describe('inhalteFuerEditor', () => {
  const inhalte = [block('EVENT', 'samhain', 0), block('ARTICLE', 'art', 1), block('EVENT', 'poetry', 2)]

  it('sortiert Entwürfe nach Datum und hängt Titel und Datum an', async () => {
    const liste = await inhalteFuerEditor(inhalte, 'DRAFT')

    expect(liste.map((b) => b.contentId)).toEqual(['poetry', 'art', 'samhain'])
    expect(liste.map((b) => b.orderPosition)).toEqual([0, 1, 2])
    expect(liste[0]._metadata).toMatchObject({ title: 'poetry', date: '2026-10-09T00:00:00.000Z' })
    expect(liste[1]._metadata).toMatchObject({ title: 'Artikel' })
  })

  it('lässt versendete Ausgaben in ihrer Reihenfolge', async () => {
    const liste = await inhalteFuerEditor(inhalte, 'SENT')
    expect(liste.map((b) => b.contentId)).toEqual(['samhain', 'art', 'poetry'])
  })
})
