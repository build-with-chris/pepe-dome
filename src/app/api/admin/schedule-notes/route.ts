/**
 * Tageshinweise im Wochenplan.
 *
 * Das sind die Zeilen für Tage ohne Kurse: „Tricking & Breaking in Planung,
 * Termine folgen." Ohne diese Route müsste für so einen Satz weiter jemand
 * an den Code, und genau das soll die Umstellung abschaffen.
 *
 * Ein leerer Text löscht den Hinweis, statt eine leere Zeile anzuzeigen.
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireApiRole } from '@/lib/roles.server'
import { ROLES } from '@/lib/roles'
import prisma from '@/lib/prisma'
import { scheduleNoteSchema } from '@/lib/course-validation'
import { revalidateTraining } from '@/lib/revalidate-training'

export async function GET() {
  const guard = await requireApiRole(ROLES.VIEWER)
  if (guard.response) return guard.response

  const notes = await prisma.scheduleNote.findMany({ orderBy: { weekday: 'asc' } })
  return NextResponse.json({ notes })
}

export async function PUT(request: NextRequest) {
  const guard = await requireApiRole(ROLES.EDITOR)
  if (guard.response) return guard.response

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Ungültiges JSON' }, { status: 400 })
  }

  const parsed = scheduleNoteSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validierung fehlgeschlagen', details: parsed.error.issues },
      { status: 400 }
    )
  }

  const { weekday, text } = parsed.data

  if (text.length === 0) {
    await prisma.scheduleNote.deleteMany({ where: { weekday } })
  } else {
    await prisma.scheduleNote.upsert({
      where: { weekday },
      create: { weekday, text },
      update: { text },
    })
  }

  await revalidateTraining()

  return NextResponse.json({ success: true })
}
