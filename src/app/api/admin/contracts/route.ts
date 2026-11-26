/**
 * Verträge verwalten: auflisten und anlegen.
 *
 * Nur für `super_admin`, lesend wie schreibend. Die Tabelle enthält Namen,
 * Anschriften und Preise der Gegenseite, deshalb sieht sie auch ein Editor
 * oder Viewer nicht.
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireApiRole } from '@/lib/roles.server'
import { ROLES } from '@/lib/roles'
import prisma from '@/lib/prisma'
import { vertragSchema, vertragstitel } from '@/lib/vertraege/validation'

export async function GET() {
  const guard = await requireApiRole(ROLES.SUPER_ADMIN)
  if (guard.response) return guard.response

  // Die Liste braucht weder die Formularwerte noch den Snapshot.
  const contracts = await prisma.contract.findMany({
    orderBy: [{ eventDate: { sort: 'desc', nulls: 'last' } }, { createdAt: 'desc' }],
    select: {
      id: true,
      type: true,
      status: true,
      title: true,
      partnerName: true,
      eventDate: true,
      sentAt: true,
      createdAt: true,
    },
  })

  return NextResponse.json({ contracts })
}

export async function POST(request: NextRequest) {
  const guard = await requireApiRole(ROLES.SUPER_ADMIN)
  if (guard.response) return guard.response

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Ungültiges JSON' }, { status: 400 })
  }

  const parsed = vertragSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Validierung fehlgeschlagen', details: parsed.error.issues },
      { status: 400 }
    )
  }

  const { type, eventDate, data, ...gegenseite } = parsed.data
  const contract = await prisma.contract.create({
    data: {
      type,
      title: vertragstitel(parsed.data),
      ...gegenseite,
      eventDate: eventDate ? new Date(eventDate) : null,
      data,
      createdBy: guard.userId,
    },
  })

  return NextResponse.json({ contract }, { status: 201 })
}
