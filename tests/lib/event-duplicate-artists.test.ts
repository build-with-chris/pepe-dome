/**
 * „Duplizieren" nimmt die Artists mit.
 *
 * Folgetermine entstehen über Duplizieren, und dort tritt meist dasselbe
 * Ensemble auf. Läuft gegen einen Prisma-Mock, nicht gegen eine Datenbank.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('@/lib/roles.server', () => ({
  requireApiRole: vi.fn().mockResolvedValue({ role: 'editor', userId: 'user-1', response: null }),
}))

vi.mock('@/lib/prisma', () => {
  const prisma = {
    event: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  }
  return { default: prisma, prisma }
})

const { POST } = await import('@/app/api/admin/events/[id]/duplicate/route')
const { prisma } = await import('@/lib/prisma')
const mock = prisma as unknown as {
  event: { findUnique: ReturnType<typeof vi.fn>; create: ReturnType<typeof vi.fn> }
}

const original = {
  id: 'evt-1',
  slug: 'circus-poetry',
  title: 'Circus & Poetry',
  subtitle: null,
  description: 'Ein Abend.',
  date: new Date('2026-10-08T00:00:00.000Z'),
  endDate: null,
  time: '20:00',
  endTime: null,
  location: 'Pepe Dome',
  category: 'SHOW',
  ticketUrl: 'https://tickets.example',
  price: '20 €',
  trailerUrl: null,
  imageUrl: null,
  featured: true,
  highlights: [],
  status: 'PUBLISHED',
  recurrence: null,
  recurrenceEnd: null,
  artists: [
    { id: 'l1', eventId: 'evt-1', artistId: 'artist-b', position: 0 },
    { id: 'l2', eventId: 'evt-1', artistId: 'artist-a', position: 1 },
  ],
}

function call() {
  return POST(new NextRequest('http://localhost/api/admin/events/evt-1/duplicate', { method: 'POST' }), {
    params: Promise.resolve({ id: 'evt-1' }),
  })
}

describe('POST /api/admin/events/[id]/duplicate', () => {
  beforeEach(() => {
    mock.event.findUnique.mockReset()
    mock.event.create.mockReset()
    mock.event.findUnique.mockImplementation(({ where }: { where: { id?: string; slug?: string } }) =>
      Promise.resolve(where.id === 'evt-1' ? original : null)
    )
    mock.event.create.mockImplementation(({ data }: { data: unknown }) =>
      Promise.resolve({ id: 'evt-2', ...(data as object) })
    )
  })

  it('kopiert die Artists in derselben Reihenfolge', async () => {
    const res = await call()
    expect(res.status).toBe(201)

    expect(mock.event.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'evt-1' },
        include: { artists: { orderBy: { position: 'asc' } } },
      })
    )
    const { data } = mock.event.create.mock.calls[0][0]
    expect(data.artists).toEqual({
      create: [
        { artistId: 'artist-b', position: 0 },
        { artistId: 'artist-a', position: 1 },
      ],
    })
    expect(data.status).toBe('DRAFT')
  })

  it('kommt mit einem Event ohne Artists zurecht', async () => {
    mock.event.findUnique.mockImplementation(({ where }: { where: { id?: string } }) =>
      Promise.resolve(where.id === 'evt-1' ? { ...original, artists: [] } : null)
    )
    const res = await call()
    expect(res.status).toBe(201)
    expect(mock.event.create.mock.calls[0][0].data.artists).toEqual({ create: [] })
  })
})
