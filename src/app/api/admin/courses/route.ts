/**
 * Kurse verwalten: auflisten und anlegen.
 *
 * Rollen wie bei Events: lesen ab `viewer`, schreiben ab `editor`.
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireApiRole } from '@/lib/roles.server'
import { ROLES } from '@/lib/roles'
import prisma from '@/lib/prisma'
import type { Course, CourseSlot } from '@prisma/client'
import {
  courseCreateSchema,
  generateCourseSlug,
  isValidBookingUrl,
} from '@/lib/course-validation'
import { revalidateTraining } from '@/lib/revalidate-training'

/** Siehe src/lib/db-courses.ts: der exportierte prisma-Client ist als `any` typisiert. */
type CourseRow = Course & { slots: CourseSlot[] }

export async function GET(request: NextRequest) {
  const guard = await requireApiRole(ROLES.VIEWER)
  if (guard.response) return guard.response

  const status = request.nextUrl.searchParams.get('status')

  const courses = (await prisma.course.findMany({
    where: status && status !== 'all' ? { status: status as never } : undefined,
    include: { slots: true },
    orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
  })) as CourseRow[]

  return NextResponse.json({
    courses: courses.map((course) => ({
      ...course,
      slots: [...course.slots].sort(
        (a, b) => a.weekday - b.weekday || a.startTime.localeCompare(b.startTime)
      ),
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

  const parsed = courseCreateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validierung fehlgeschlagen', details: parsed.error.issues },
      { status: 400 }
    )
  }

  const { slots, slug: slugInput, ...felder } = parsed.data

  if (!isValidBookingUrl(felder.bookingUrl)) {
    return NextResponse.json(
      { error: 'Buchungslink muss mit http://, https:// oder mailto: beginnen' },
      { status: 400 }
    )
  }

  const basis = generateCourseSlug(slugInput || felder.title)
  if (!basis) {
    return NextResponse.json(
      { error: 'Aus dem Titel lässt sich kein Slug bilden' },
      { status: 400 }
    )
  }

  // Bei Titel-Dubletten anhaengen statt fehlschlagen: "Kinder Akrobatik" gibt
  // es womoeglich zweimal in verschiedenen Altersgruppen.
  let slug = basis
  for (let i = 2; await prisma.course.findUnique({ where: { slug } }); i += 1) {
    slug = `${basis}-${i}`
  }

  const course = await prisma.course.create({
    data: {
      ...felder,
      slug,
      createdBy: guard.userId ?? undefined,
      slots: { create: slots },
    },
    include: { slots: true },
  })

  await revalidateTraining()

  return NextResponse.json({ course }, { status: 201 })
}
