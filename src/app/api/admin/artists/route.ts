/**
 * Artists verwalten: auflisten und anlegen.
 *
 * Rollen wie bei Events: lesen ab `viewer`, schreiben ab `editor`.
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireApiRole } from '@/lib/roles.server'
import { ROLES } from '@/lib/roles'
import prisma from '@/lib/prisma'
import type { Artist } from '@prisma/client'
import { artistSchema, generateArtistSlug, toArtistData } from '@/lib/artist-validation'

/** Siehe src/lib/db-courses.ts: der exportierte prisma-Client ist als `any` typisiert. */
type ArtistRow = Artist & { _count: { events: number } }

export async function GET() {
  const guard = await requireApiRole(ROLES.VIEWER)
  if (guard.response) return guard.response

  const artists = (await prisma.artist.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { events: true } } },
  })) as ArtistRow[]

  return NextResponse.json({
    artists: artists.map(({ _count, ...artist }) => ({
      ...artist,
      eventCount: _count.events,
    })),
  })
}

export async function POST(request: NextRequest) {
  const guard = await requireApiRole(ROLES.EDITOR)
  if (guard.response) return guard.response

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Ungültiges JSON' }, { status: 400 })
  }

  const parsed = artistSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Validierung fehlgeschlagen', details: parsed.error.issues },
      { status: 400 }
    )
  }

  const basis = generateArtistSlug(parsed.data.name)
  if (!basis) {
    return NextResponse.json(
      { error: 'Aus dem Namen lässt sich kein Slug bilden' },
      { status: 400 }
    )
  }

  // Zwei Personen mit gleichem Namen sind möglich, also anhängen statt fehlschlagen.
  let slug = basis
  for (let i = 2; await prisma.artist.findUnique({ where: { slug } }); i += 1) {
    slug = `${basis}-${i}`
  }

  const artist = await prisma.artist.create({
    data: { ...toArtistData(parsed.data), slug },
  })

  return NextResponse.json({ artist }, { status: 201 })
}
