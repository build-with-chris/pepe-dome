import Link from 'next/link'
import EventForm from '@/components/admin/forms/EventForm'
import { canEdit } from '@/lib/roles.server'
import { redirect } from 'next/navigation'

/**
 * Create Event Page
 *
 * Features:
 * - EventForm component for creating new events
 * - Role check (Editor+ required)
 */

export default async function NewEventPage() {
  // Check permissions
  const hasPermission = await canEdit()
  if (!hasPermission) {
    redirect('/admin/events')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/admin/events"
          className="inline-flex items-center gap-2 text-sm text-[var(--pepe-t64)] hover:text-[var(--pepe-gold)] mb-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Zuruck zu Events
        </Link>
        <h2 className="text-2xl font-bold text-[var(--pepe-white)]">Neues Event erstellen</h2>
        <p className="text-[var(--pepe-t64)] mt-1">
          Erstellen Sie ein neues Event fur den PEPE Dome.
        </p>
      </div>

      {/* Form */}
      <EventForm mode="create" />
    </div>
  )
}
