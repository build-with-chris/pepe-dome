'use client'

/**
 * Kursliste im Admin.
 *
 * Zeigt anders als die Event-Liste keine Seitenzahlen: es sind acht Kurse und
 * werden absehbar keine hundert. Dafür steht die Terminübersicht in der
 * Tabelle, weil „läuft montags und mittwochs" die Frage ist, die man beim
 * Draufschauen hat.
 */

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import DataTable, { type Column } from '@/components/admin/DataTable'
import { PageHeader } from '@/components/admin/PageHeader'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { Button } from '@/components/ui/Button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { weekdayName } from '@/lib/course-types'
import ScheduleNotesPanel from '@/components/admin/ScheduleNotesPanel'

type Slot = { id: string; weekday: number; startTime: string; endTime: string }

type Course = {
  id: string
  slug: string
  title: string
  target: string
  trainer: string
  status: string
  sortOrder: number
  slots: Slot[]
}

const ZIELGRUPPE_LABELS: Record<string, string> = {
  kinder: 'Kinder',
  teens: 'Jugendliche',
  erwachsene: 'Erwachsene',
}

/** „Mo 17:15, Mo 18:15, Mi 17:00" — kurz genug für eine Tabellenzelle. */
function terminZeile(slots: Slot[]): string {
  if (slots.length === 0) return 'Keine Termine'
  return slots
    .map((slot) => `${weekdayName(slot.weekday).slice(0, 2)} ${slot.startTime}`)
    .join(', ')
}

export default function CoursesAdminPage() {
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')

  const fetchCourses = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.set('status', statusFilter)
      const res = await fetch(`/api/admin/courses?${params}`)
      if (!res.ok) throw new Error('Kurse konnten nicht geladen werden')
      const body = await res.json()
      setCourses(body.courses ?? [])
    } catch (error) {
      console.error('Fehler beim Laden der Kurse:', error)
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  const columns: Column<Course>[] = [
    {
      header: 'Kurs',
      accessorKey: 'title',
      sortable: true,
      cell: (row) => (
        <div>
          <span className="font-medium text-white">{row.title}</span>
          <span className="block text-[11px] text-white/40">
            {ZIELGRUPPE_LABELS[row.target] ?? row.target} · {row.trainer}
          </span>
        </div>
      ),
    },
    {
      header: 'Termine',
      accessorKey: 'slots',
      hideOnMobile: true,
      cell: (row) => (
        <span className="text-white/60">
          {terminZeile(row.slots)}
          {row.slots.length > 1 && (
            <span className="text-white/30"> ({row.slots.length}×)</span>
          )}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      cell: (row) => <StatusBadge status={row.status} />,
    },
  ]

  const actions = (row: Course) => (
    <div className="flex items-center justify-end gap-2">
      <Link href={`/admin/courses/${row.id}/edit`}>
        <Button variant="ghost" size="xs">
          Bearbeiten
        </Button>
      </Link>
    </div>
  )

  const aktiv = courses.filter((course) => course.status === 'PUBLISHED').length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kurse"
        description={
          statusFilter === 'all'
            ? `${courses.length} Kurse, davon ${aktiv} auf der Website`
            : `${courses.length} Kurse`
        }
        action={
          <Link href="/admin/courses/new">
            <Button variant="primary" size="sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Neuer Kurs
            </Button>
          </Link>
        }
      />

      <div className="flex flex-wrap items-center gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle</SelectItem>
            <SelectItem value="PUBLISHED">Auf der Website</SelectItem>
            <SelectItem value="ARCHIVED">Pausiert</SelectItem>
            <SelectItem value="DRAFT">Entwurf</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        data={courses}
        columns={columns}
        getRowKey={(row) => row.id}
        loading={loading}
        emptyMessage="Keine Kurse gefunden"
        actions={actions}
        searchable
        searchPlaceholder="Kurse suchen…"
        searchKeys={['title', 'trainer']}
        onRowClick={(row) => router.push(`/admin/courses/${row.id}/edit`)}
      />

      <ScheduleNotesPanel />
    </div>
  )
}
