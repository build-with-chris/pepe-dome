/**
 * Einzelnen Kurs lesen, ändern, löschen.
 *
 * Löschen verlangt `super_admin`, obwohl Ändern ab `editor` geht. Ein
 * gelöschter Kurs nimmt seine Beschreibung mit, und die ist Arbeit von
 * jemandem gewesen. Wer einen Kurs loswerden will, setzt ihn auf „pausiert" —
 * das ist im Formular auch der angebotene Weg.
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireApiRole } from '@/lib/roles.server'
import { ROLES } from '@/lib/roles'
import prisma from '@/lib/prisma'
import type { PrismaClient } from '@prisma/client'
import { courseUpdateSchema, isValidBookingUrl } from '@/lib/course-validation'
import { revalidateTraining } from '@/lib/revalidate-training'

/**
 * Siehe src/lib/db-courses.ts: der exportierte prisma-Client ist als `any`
 * typisiert, deshalb kommt auch der Transaktions-Client untypisiert an.
 */
type Tx = Omit<PrismaClient, '$transaction' | '$connect' | '$disconnect' | '$on' | '$use' | '$extends'>

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireApiRole(ROLES.VIEWER)
  if (guard.response) return guard.response

  const { id } = await params
  const course = await prisma.course.findUnique({
    where: { id },
    include: { slots: true },
  })

  if (!course) {
    return NextResponse.json({ error: 'Kurs nicht gefunden' }, { status: 404 })
  }

  return NextResponse.json({
    course: {
      ...course,
      slots: [...course.slots].sort(
        (a, b) => a.weekday - b.weekday || a.startTime.localeCompare(b.startTime)
      ),
    },
  })
}

export async function PATCH(
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

  const parsed = courseUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validierung fehlgeschlagen', details: parsed.error.issues },
      { status: 400 }
    )
  }

  const existing = await prisma.course.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: 'Kurs nicht gefunden' }, { status: 404 })
  }

  const { slots, ...felder } = parsed.data

  if (felder.bookingUrl !== undefined && !isValidBookingUrl(felder.bookingUrl)) {
    return NextResponse.json(
      { error: 'Buchungslink muss mit http://, https:// oder mailto: beginnen' },
      { status: 400 }
    )
  }

  // Slots komplett ersetzen statt einzeln abzugleichen. Sie haben keine
  // eigene Bedeutung ausserhalb ihres Kurses und haengen an nichts, also ist
  // Loeschen und Neuanlegen hier ehrlicher als ein Diff, der danebengreifen
  // kann. In einer Transaktion, damit ein Kurs nie ohne Termine dasteht.
  const course = await prisma.$transaction(async (tx: Tx) => {
    if (slots) {
      await tx.courseSlot.deleteMany({ where: { courseId: id } })
      await tx.courseSlot.createMany({
        data: slots.map((slot) => ({ ...slot, courseId: id })),
      })
    }
    return tx.course.update({
      where: { id },
      data: felder,
      include: { slots: true },
    })
  })

  await revalidateTraining()

  return NextResponse.json({ course })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireApiRole(ROLES.SUPER_ADMIN)
  if (guard.response) return guard.response

  const { id } = await params

  const existing = await prisma.course.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: 'Kurs nicht gefunden' }, { status: 404 })
  }

  // Slots gehen per onDelete: Cascade mit.
  await prisma.course.delete({ where: { id } })

  await revalidateTraining()

  return NextResponse.json({ success: true })
}
