import { NextRequest, NextResponse } from 'next/server'
import { requireApiRole } from '@/lib/roles.server'
import { ROLES } from '@/lib/roles'
import prisma from '@/lib/prisma'
import { z } from 'zod'

/**
 * Ein einzelnes Reel ändern.
 *
 * Der Statuswechsel setzt die zugehörigen Zeitstempel selbst. Der Puffer zählt
 * die Reels im Status "geschnitten", und wenn jemand den Status umstellt, aber
 * das Datum vergisst, stimmt die Zahl trotzdem. Umgekehrt wäre der Puffer eine
 * Zahl, die von der Sorgfalt beim Ausfüllen abhängt, und genau darauf soll man
 * sich wöchentlich verlassen können.
 */

const nullableInt = z.number().int().min(0).nullable().optional()

const updateSchema = z.object({
  artist: z.string().min(1).optional(),
  discipline: z.string().min(1).optional(),
  status: z.enum(['PLANNED', 'FILMED', 'EDITED', 'PUBLISHED']).optional(),
  shootDate: z.string().nullable().optional(),
  plannedFor: z.string().nullable().optional(),
  publishedAt: z.string().nullable().optional(),
  shares48: nullableInt,
  saves48: nullableInt,
  shares72: nullableInt,
  saves72: nullableInt,
  budgetReleased: z.boolean().optional(),
  spendCents: nullableInt,
  results: nullableInt,
  notes: z.string().nullable().optional(),
})

function toDate(value: string | null | undefined): Date | null | undefined {
  if (value === undefined) return undefined
  if (value === null || value === '') return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? undefined : parsed
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireApiRole(ROLES.EDITOR)
  if (guard.response) return guard.response

  const { id } = await params

  try {
    const data = updateSchema.parse(await request.json())

    const current = await prisma.contentReel.findUnique({ where: { id } })
    if (!current) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const now = new Date()
    const update: Record<string, unknown> = {}

    if (data.artist !== undefined) update.artist = data.artist
    if (data.discipline !== undefined) update.discipline = data.discipline
    if (data.shares48 !== undefined) update.shares48 = data.shares48
    if (data.saves48 !== undefined) update.saves48 = data.saves48
    if (data.shares72 !== undefined) update.shares72 = data.shares72
    if (data.saves72 !== undefined) update.saves72 = data.saves72
    if (data.spendCents !== undefined) update.spendCents = data.spendCents
    if (data.results !== undefined) update.results = data.results
    if (data.notes !== undefined) update.notes = data.notes

    const shootDate = toDate(data.shootDate)
    if (shootDate !== undefined) update.shootDate = shootDate
    const plannedFor = toDate(data.plannedFor)
    if (plannedFor !== undefined) update.plannedFor = plannedFor
    const publishedAt = toDate(data.publishedAt)
    if (publishedAt !== undefined) update.publishedAt = publishedAt

    if (data.status !== undefined) {
      update.status = data.status

      // Zeitstempel nur setzen, wenn noch keiner da ist. Wer versehentlich
      // zurück auf "geschnitten" stellt und wieder vor, soll nicht das
      // ursprüngliche Veröffentlichungsdatum verlieren.
      if (data.status === 'EDITED' && !current.editedAt) {
        update.editedAt = now
      }
      if (data.status === 'PUBLISHED' && !current.publishedAt && publishedAt === undefined) {
        update.publishedAt = now
      }
    }

    if (data.budgetReleased !== undefined) {
      // Die Freigabe ist ein Zeitpunkt, kein Häkchen: Ohne Datum ließe sich
      // später nicht mehr belegen, ob die 48 Stunden eingehalten wurden.
      update.budgetReleasedAt = data.budgetReleased ? (current.budgetReleasedAt ?? now) : null
    }

    const reel = await prisma.contentReel.update({ where: { id }, data: update })
    return NextResponse.json(reel)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.issues }, { status: 400 })
    }
    console.error('Error updating reel:', error)
    return NextResponse.json({ error: 'Failed to update reel' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireApiRole(ROLES.SUPER_ADMIN)
  if (guard.response) return guard.response

  const { id } = await params

  try {
    await prisma.contentReel.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting reel:', error)
    return NextResponse.json({ error: 'Failed to delete reel' }, { status: 500 })
  }
}
