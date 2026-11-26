/**
 * Einzelnen Vertrag lesen, ändern, löschen. Nur für `super_admin`.
 *
 * PATCH kann zweierlei, einzeln oder zusammen:
 *
 *   Inhalt   (`data` im Body)    nur solange der Vertrag ein Entwurf ist
 *   Status   (`status` im Body)  jederzeit
 *
 * Verlässt ein Vertrag den Entwurf, wird sein Dokument als Bausteinliste in
 * `snapshot` eingefroren. Ab dann kommt das PDF aus dem Snapshot, auch wenn
 * die Vorlage im Code später anders lautet: Was verschickt wurde, bleibt, was
 * verschickt wurde. Zurück auf „Entwurf“ verwirft den Snapshot und gibt die
 * Bearbeitung wieder frei.
 *
 * Löschen geht nur bei Entwürfen. Ein verschickter Vertrag muss erst bewusst
 * zurück auf Entwurf gesetzt werden.
 */

import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { requireApiRole } from '@/lib/roles.server'
import { ROLES } from '@/lib/roles'
import prisma from '@/lib/prisma'
import { statusSchema, vertragSchema, vertragstitel } from '@/lib/vertraege/validation'
import { dokumentAusZeile } from '@/lib/vertraege/vorlage'

type Params = { params: Promise<{ id: string }> }

const nichtGefunden = () =>
  NextResponse.json({ error: 'Vertrag nicht gefunden' }, { status: 404 })

export async function GET(_request: NextRequest, { params }: Params) {
  const guard = await requireApiRole(ROLES.SUPER_ADMIN)
  if (guard.response) return guard.response

  const { id } = await params
  const contract = await prisma.contract.findUnique({ where: { id } })
  if (!contract) return nichtGefunden()

  return NextResponse.json({ contract })
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const guard = await requireApiRole(ROLES.SUPER_ADMIN)
  if (guard.response) return guard.response

  const { id } = await params

  let body: Record<string, unknown>
  try {
    const roh = await request.json()
    if (!roh || typeof roh !== 'object' || Array.isArray(roh)) throw new Error('kein Objekt')
    body = roh
  } catch {
    return NextResponse.json({ error: 'Ungültiges JSON' }, { status: 400 })
  }

  const hatInhalt = 'data' in body
  const hatStatus = 'status' in body
  if (!hatInhalt && !hatStatus) {
    return NextResponse.json({ error: 'Nichts zu ändern' }, { status: 400 })
  }

  const existing = await prisma.contract.findUnique({ where: { id } })
  if (!existing) return nichtGefunden()

  const update: Prisma.ContractUpdateInput = {}
  // Stand des Vertrags nach dieser Anfrage, für den Snapshot.
  let zeile = existing

  if (hatInhalt) {
    if (existing.status !== 'ENTWURF') {
      return NextResponse.json(
        { error: 'Der Vertrag ist gesperrt. Zum Ändern erst zurück auf „Entwurf“ setzen.' },
        { status: 409 }
      )
    }

    // Der Typ steht seit dem Anlegen fest, ein Angebot wird nicht zur Mietvereinbarung.
    const parsed = vertragSchema.safeParse({ ...body, type: existing.type })
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Validierung fehlgeschlagen', details: parsed.error.issues },
        { status: 400 }
      )
    }

    const { type: _type, eventDate, data, ...gegenseite } = parsed.data
    const inhalt = {
      title: vertragstitel(parsed.data),
      ...gegenseite,
      eventDate: eventDate ? new Date(eventDate) : null,
      data,
    }
    Object.assign(update, inhalt)
    zeile = { ...existing, ...inhalt }
  }

  if (hatStatus) {
    const status = statusSchema.safeParse(body.status)
    if (!status.success) {
      return NextResponse.json({ error: 'Unbekannter Status' }, { status: 400 })
    }

    if (status.data !== existing.status) {
      update.status = status.data

      if (status.data === 'ENTWURF') {
        update.snapshot = Prisma.DbNull
        update.sentAt = null
      } else if (existing.status === 'ENTWURF') {
        try {
          update.snapshot = dokumentAusZeile(zeile) as unknown as Prisma.InputJsonValue
        } catch (error) {
          console.error('Vertrag lässt sich nicht einfrieren:', error)
          return NextResponse.json(
            { error: 'Der Entwurf ist unvollständig. Bitte erst öffnen, prüfen und speichern.' },
            { status: 400 }
          )
        }
        update.sentAt = new Date()
      }
    }
  }

  const contract = await prisma.contract.update({ where: { id }, data: update })
  return NextResponse.json({ contract })
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const guard = await requireApiRole(ROLES.SUPER_ADMIN)
  if (guard.response) return guard.response

  const { id } = await params
  const existing = await prisma.contract.findUnique({ where: { id } })
  if (!existing) return nichtGefunden()

  if (existing.status !== 'ENTWURF') {
    return NextResponse.json(
      { error: 'Nur Entwürfe lassen sich löschen. Erst zurück auf „Entwurf“ setzen.' },
      { status: 409 }
    )
  }

  await prisma.contract.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
