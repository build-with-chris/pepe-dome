'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import DataTable, { type Column } from '@/components/admin/DataTable'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

/**
 * Events Admin Page
 *
 * Features:
 * - DataTable with columns: Title, Date, Category, Status, Actions
 * - Filters: Category, Status
 * - Search
 * - Delete confirmation dialog
 */

interface Event {
  id: string
  slug: string
  title: string
  date: string
  category: string
  status: string
  featured: boolean
}

interface PaginatedResponse {
  events: Event[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

const categoryLabels: Record<string, string> = {
  SHOW: 'Show',
  PREMIERE: 'Premiere',
  FESTIVAL: 'Festival',
  WORKSHOP: 'Workshop',
  OPEN_TRAINING: 'Open Training',
  KINDERTRAINING: 'Kindertraining',
  BUSINESS: 'Business',
  OPEN_AIR: 'Open Air',
  EVENT: 'Event',
}

const statusColors: Record<string, string> = {
  DRAFT: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  PUBLISHED: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  ARCHIVED: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
}

export default function EventsAdminPage() {
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 20 })
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchEvents = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' })
      if (statusFilter && statusFilter !== 'all') params.set('status', statusFilter)
      if (categoryFilter && categoryFilter !== 'all') params.set('category', categoryFilter)

      const res = await fetch(`/api/admin/events?${params}`)
      const data: PaginatedResponse = await res.json()
      setEvents(data.events)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }, [statusFilter, categoryFilter])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  async function handleDelete() {
    if (!eventToDelete) return

    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/events/${eventToDelete.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete event')
      setDeleteDialogOpen(false)
      setEventToDelete(null)
      fetchEvents(pagination.page)
    } catch (error) {
      console.error('Error deleting event:', error)
    } finally {
      setDeleting(false)
    }
  }

  function confirmDelete(event: Event) {
    setEventToDelete(event)
    setDeleteDialogOpen(true)
  }

  // Table columns
  const columns: Column<Event>[] = [
    {
      header: 'Titel',
      accessorKey: 'title',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{row.title}</span>
          {row.featured && (
            <Badge
              variant="outline"
              className="text-xs bg-[#D4A574]/10 text-[#D4A574] border-[#D4A574]/30"
            >
              Featured
            </Badge>
          )}
        </div>
      ),
    },
    {
      header: 'Datum',
      accessorKey: 'date',
      sortable: true,
      hideOnMobile: true,
      cell: (row) => new Date(row.date).toLocaleDateString('de-DE'),
    },
    {
      header: 'Kategorie',
      accessorKey: 'category',
      sortable: true,
      hideOnMobile: true,
      cell: (row) => categoryLabels[row.category] || row.category,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      cell: (row) => (
        <Badge variant="outline" className={cn('text-xs border', statusColors[row.status])}>
          {row.status}
        </Badge>
      ),
    },
  ]

  // Row actions
  const actions = (row: Event) => (
    <div className="flex items-center justify-end gap-2">
      <Link href={`/admin/events/${row.id}/edit`}>
        <Button variant="ghost" size="xs">
          Bearbeiten
        </Button>
      </Link>
      <Button
        variant="ghost"
        size="xs"
        className="text-red-400 hover:text-red-400 hover:bg-red-500/10"
        onClick={() => confirmDelete(row)}
      >
        Loschen
      </Button>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Events</h2>
          <p className="text-gray-400 mt-1">
            {pagination.total} {pagination.total === 1 ? 'Event' : 'Events'} insgesamt
          </p>
        </div>
        <Link href="/admin/events/new">
          <Button variant="primary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Neues Event
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Status</SelectItem>
            <SelectItem value="DRAFT">Entwurf</SelectItem>
            <SelectItem value="PUBLISHED">Veroffentlicht</SelectItem>
            <SelectItem value="ARCHIVED">Archiviert</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Kategorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Kategorien</SelectItem>
            {Object.entries(categoryLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Data Table */}
      <DataTable
        data={events}
        columns={columns}
        getRowKey={(row) => row.id}
        loading={loading}
        emptyMessage="Keine Events gefunden"
        actions={actions}
        searchable
        searchPlaceholder="Events suchen..."
        searchKeys={['title']}
        page={pagination.page}
        totalPages={pagination.pages}
        totalItems={pagination.total}
        onPageChange={(page) => fetchEvents(page)}
        onRowClick={(row) => router.push(`/admin/events/${row.id}/edit`)}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Event loschen</DialogTitle>
            <DialogDescription>
              Sind Sie sicher, dass Sie das Event &quot;{eventToDelete?.title}&quot; loschen mochten?
              Diese Aktion kann nicht ruckgangig gemacht werden.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleting}
            >
              Abbrechen
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? 'Loschen...' : 'Event loschen'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
