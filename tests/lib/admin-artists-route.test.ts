/**
 * Admin-API für Artists: was abgelehnt wird und wie Instagram gespeichert
 * wird. Läuft gegen einen Prisma-Mock, nicht gegen eine Datenbank.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('@/lib/roles.server', () => ({
  requireApiRole: vi.fn().mockResolvedValue({ role: 'editor', userId: 'user-1', response: null }),
}))

vi.mock('@/lib/prisma', () => {
  const prisma = {
    artist: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  }
  return { default: prisma, prisma }
})

const { POST } = await import('@/app/api/admin/artists/route')
const { prisma } = await import('@/lib/prisma')
const mock = prisma as unknown as {
  artist: { findUnique: ReturnType<typeof vi.fn>; create: ReturnType<typeof vi.fn> }
}

function post(body: unknown) {
  return POST(
    new NextRequest('http://localhost/api/admin/artists', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    })
  )
}

const gueltig = { name: 'Jana', bio: 'Luftakrobatin aus München.' }

describe('POST /api/admin/artists', () => {
  beforeEach(() => {
    mock.artist.findUnique.mockReset().mockResolvedValue(null)
    mock.artist.create.mockReset().mockImplementation(({ data }: { data: object }) =>
      Promise.resolve({ id: 'a1', ...data })
    )
  })

  it.each([
    ['ohne Namen', { ...gueltig, name: '' }],
    ['mit über 600 Zeichen Bio', { ...gueltig, bio: 'a'.repeat(601) }],
    ['mit http://-Website', { ...gueltig, websiteUrl: 'http://jana.example' }],
  ])('lehnt einen Artist %s mit 400 ab', async (_fall, body) => {
    const res = await post(body)
    expect(res.status).toBe(400)
    expect(mock.artist.create).not.toHaveBeenCalled()
  })

  it('speichert @pepe.dome als volle Instagram-URL', async () => {
    const res = await post({ ...gueltig, instagramUrl: '@pepe.dome' })
    expect(res.status).toBe(201)
    const { data } = mock.artist.create.mock.calls[0][0]
    expect(data.instagramUrl).toBe('https://www.instagram.com/pepe.dome/')
    expect(data.slug).toBe('jana')
  })

  it('hängt bei gleichem Namen eine Zahl an den Slug', async () => {
    mock.artist.findUnique.mockImplementation(({ where }: { where: { slug: string } }) =>
      Promise.resolve(where.slug === 'jana' ? { id: 'x' } : null)
    )
    await post(gueltig)
    expect(mock.artist.create.mock.calls[0][0].data.slug).toBe('jana-2')
  })
})
