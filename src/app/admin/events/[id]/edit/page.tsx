import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import EventForm from '@/components/admin/forms/EventForm'
import { canEdit } from '@/lib/roles.server'

/**
 * Edit Event Page
 *
 * Features:
 * - Load existing event data
 * - EventForm component pre-filled with event data
 * - Role check (Editor+ required)
 */

interface PageProps {
  params: Promise<{ id: string }>
}

async function getEvent(id: string) {
  const event = await prisma.event.findUnique({
    where: { id },
  })

  if (!event) return null

  return {
    id: event.id,
    slug: event.slug,
    title: event.title,
    subtitle: event.subtitle,
    description: event.description,
    date: event.date.toISOString(),
    endDate: event.endDate?.toISOString() || null,
    time: event.time,
    location: event.location,
    category: event.category,
    ticketUrl: event.ticketUrl,
    price: event.price,
    imageUrl: event.imageUrl,
    featured: event.featured,
    highlights: (event.highlights as string[]) || [],
    status: event.status,
    recurrence: event.recurrence,
    recurrenceEnd: event.recurrenceEnd?.toISOString() || null,
  }
}

export default async function EditEventPage({ params }: PageProps) {
  // Check permissions
  const hasPermission = await canEdit()
  if (!hasPermission) {
    redirect('/admin/events')
  }

  const { id } = await params
  const event = await getEvent(id)

  if (!event) {
    notFound()
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/admin/events"
          className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-[#016dca] transition-colors mb-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Zurück zu Events
        </Link>
        <h1 className="text-xl font-semibold text-white">Event bearbeiten</h1>
        <p className="text-white/50 mt-1">
          Bearbeiten Sie das Event &quot;{event.title}&quot;.
        </p>
      </div>

      {/* Form */}
      <EventForm event={event} mode="edit" />
    </div>
  )
}
