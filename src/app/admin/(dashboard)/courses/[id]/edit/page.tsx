import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import CourseForm, { type CourseFormData } from '@/components/admin/forms/CourseForm'
import DeleteCourseButton from '@/components/admin/DeleteCourseButton'
import { canEdit, isSuperAdmin } from '@/lib/roles.server'
import prisma from '@/lib/prisma'
import type { Course, CourseSlot } from '@prisma/client'

/** Siehe src/lib/db-courses.ts: der exportierte prisma-Client ist als `any` typisiert. */
type CourseRow = Course & { slots: CourseSlot[] }

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((entry): entry is string => typeof entry === 'string')
}

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  if (!(await canEdit())) {
    redirect('/admin/courses')
  }

  const { id } = await params
  const course = (await prisma.course.findUnique({
    where: { id },
    include: { slots: true },
  })) as CourseRow | null

  if (!course) notFound()

  const darfLoeschen = await isSuperAdmin()

  const initial: Partial<CourseFormData> = {
    id: course.id,
    slug: course.slug,
    title: course.title,
    sub: course.sub ?? '',
    description: course.description,
    inhalte: toStringArray(course.inhalte),
    alter: course.alter ?? '',
    fuerWen: course.fuerWen,
    target: course.target as CourseFormData['target'],
    trainer: course.trainer,
    bookingUrl: course.bookingUrl ?? '',
    bookingLabel: course.bookingLabel ?? '',
    bookingNote: course.bookingNote ?? '',
    status: course.status as CourseFormData['status'],
    sortOrder: course.sortOrder,
    slots: [...course.slots]
      .sort((a, b) => a.weekday - b.weekday || a.startTime.localeCompare(b.startTime))
      .map((slot) => ({
        weekday: slot.weekday,
        startTime: slot.startTime,
        endTime: slot.endTime,
      })),
  }

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/courses"
          className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-[#016dca] transition-colors mb-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Zurück zu Kurse
        </Link>
        <h1 className="text-xl font-semibold text-white">{course.title}</h1>
        <p className="text-white/50 mt-1">
          Adresse auf der Website:{' '}
          <code className="text-white/70">?kurs={course.slug}</code>. Sie bleibt beim
          Umbenennen gleich, damit geteilte Links weiter funktionieren.
        </p>
      </div>

      <CourseForm mode="edit" initial={initial} />

      {darfLoeschen && (
        <div className="bg-[#111113] border border-red-500/20 rounded-xl p-6">
          <h2 className="text-[13px] font-semibold text-white uppercase tracking-wider mb-3">
            Kurs löschen
          </h2>
          <p className="text-sm leading-relaxed text-white/50 mb-4">
            Löschen entfernt Beschreibung, Inhalte und alle Termine endgültig. Wenn
            der Kurs nur gerade nicht stattfindet, ist &bdquo;Pausiert&ldquo; der richtige Weg:
            Der Kurs verschwindet von der Website und bleibt hier vollständig
            erhalten.
          </p>
          <DeleteCourseButton courseId={course.id} courseTitle={course.title} />
        </div>
      )}
    </div>
  )
}
