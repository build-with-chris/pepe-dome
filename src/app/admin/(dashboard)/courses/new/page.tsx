import Link from 'next/link'
import { redirect } from 'next/navigation'
import CourseForm from '@/components/admin/forms/CourseForm'
import { canEdit } from '@/lib/roles.server'

export default async function NewCoursePage() {
  if (!(await canEdit())) {
    redirect('/admin/courses')
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
        <h1 className="text-xl font-semibold text-white">Neuen Kurs anlegen</h1>
        <p className="text-white/50 mt-1">
          Ein Kurs mit allen seinen Wochenterminen. Läuft er mehrmals pro Woche,
          kommen mehrere Termine in denselben Kurs statt mehrerer Kurse.
        </p>
      </div>

      <CourseForm mode="create" />
    </div>
  )
}
