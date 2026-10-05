/**
 * Einzelnen Artist lesen, ändern, löschen.
 *
 * Löschen geht ab `editor`, anders als bei Kursen. Ein Artist ist eine Bio
 * von wenigen Sätzen, und die Verknüpfungen zu Events verschwinden per
 * onDelete: Cascade mit. Die Events selbst bleiben unberührt. Die Rückfrage
 * mit der Zahl der betroffenen Events stellt das Admin-Formular.
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireApiRole } from '@/lib/roles.server'
import { ROLES } from '@/lib/roles'
import prisma from '@/lib/prisma'
import { artistSchema, toArtistData } from '@/lib/artist-validation'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireApiRole(ROLES.VIEWER)
  if (guard.response) return guard.response

  const { id } = await params
  const artist = await prisma.artist.findUnique({
    where: { id },
    include: { _count: { select: { events: true } } },
  })

  if (!artist) {
    return NextResponse.json({ error: 'Artist nicht gefunden' }, { status: 404 })
  }

  const { _count, ...rest } = artist
  return NextResponse.json({ artist: { ...rest, eventCount: _count.events } })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireApiRole(ROLES.EDITOR)
  if (guard.response) return guard.response

  const { id } = await params

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

  const existing = await prisma.artist.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: 'Artist nicht gefunden' }, { status: 404 })
  }

  // Der Slug bleibt beim Umbenennen gleich, damit eine spätere Profil-URL
  // nicht bricht.
  const artist = await prisma.artist.update({
    where: { id },
    data: toArtistData(parsed.data, existing.translations),
  })

  return NextResponse.json({ artist })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireApiRole(ROLES.EDITOR)
  if (guard.response) return guard.response

  const { id } = await params

  const existing = await prisma.artist.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: 'Artist nicht gefunden' }, { status: 404 })
  }

  // EventArtist-Zeilen gehen per onDelete: Cascade mit.
  await prisma.artist.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
