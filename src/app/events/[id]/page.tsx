import { notFound } from 'next/navigation'
import { getAllEvents, getEventById } from '@/lib/data'
import EventDetail from '@/components/events/EventDetail'

export async function generateStaticParams() {
  const events = getAllEvents()
  return events.map((event) => ({
    id: event.id,
  }))
}

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const event = getEventById(id)

  if (!event) {
    notFound()
  }

  return <EventDetail event={event} />
}
