import Image from 'next/image'
import Link from 'next/link'
import { Event, formatDate, getCategoryColor, getUpcomingEvents } from '@/lib/data'
import Button from '@/components/ui/Button'
import EventCard from './EventCard'

interface EventDetailProps {
  event: Event
}

export default function EventDetail({ event }: EventDetailProps) {
  const categoryColor = getCategoryColor(event.category, 'events')
  const relatedEvents = getUpcomingEvents().filter(e => e.id !== event.id).slice(0, 3)

  return (
    <div className="section">
      <div className="stage-container">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-pepe-t64 mb-8">
          <Link href="/" className="hover:text-pepe-white transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/events" className="hover:text-pepe-white transition-colors">
            Events
          </Link>
          <span>/</span>
          <span className="text-pepe-white">{event.title}</span>
        </nav>

        <div className="grid lg:grid-cols-[1fr_380px] gap-12">
          {/* Main Content */}
          <div>
            {/* Header */}
            <header className="mb-8">
              <span className={`badge mb-4 bg-${categoryColor}/20 text-${categoryColor} border-${categoryColor}/40`}>
                {event.category}
              </span>

              <h1 className="display-1 mb-4">{event.title}</h1>

              {event.subtitle && (
                <p className="lead text-pepe-gold mb-6">
                  {event.subtitle}
                </p>
              )}

              {event.featured && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-pepe-gold/10 border border-pepe-gold/30 rounded-full mb-6">
                  <span className="text-pepe-gold font-semibold">★ Highlight Event</span>
                </div>
              )}
            </header>

            {/* Featured Image */}
            {event.imageUrl && (
              <div className="relative w-full h-96 mb-8 rounded-2xl overflow-hidden bg-pepe-surface">
                <Image
                  src={event.imageUrl}
                  alt={event.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 800px"
                  priority
                />
              </div>
            )}

            {/* Description */}
            <div className="prose prose-invert prose-lg max-w-none mb-8">
              <p className="body-lg">
                {event.description}
              </p>
            </div>

            {/* Highlights */}
            {event.highlights.length > 0 && (
              <div className="card p-6 mb-8">
                <h3 className="h4 mb-4">Highlights</h3>
                <ul className="space-y-2">
                  {event.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-pepe-gold mt-1">✓</span>
                      <span className="text-pepe-t80">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Event Info Card */}
            <div className="card p-6 sticky top-24">
              <h3 className="h4 mb-6">Event-Informationen</h3>

              <div className="space-y-4 mb-6">
                <div>
                  <div className="text-sm text-pepe-t48 mb-1">Datum</div>
                  <div className="text-pepe-white font-medium">
                    {formatDate(event.date)}
                    {event.endDate && ` - ${formatDate(event.endDate)}`}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-pepe-t48 mb-1">Uhrzeit</div>
                  <div className="text-pepe-white font-medium">{event.time}</div>
                </div>

                <div>
                  <div className="text-sm text-pepe-t48 mb-1">Ort</div>
                  <div className="text-pepe-white font-medium">{event.location}</div>
                </div>

                <div>
                  <div className="text-sm text-pepe-t48 mb-1">Preis</div>
                  <div className="text-pepe-gold font-semibold text-lg">{event.price}</div>
                </div>
              </div>

              {event.ticketUrl ? (
                <a
                  href={event.ticketUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary w-full"
                >
                  Tickets kaufen
                </a>
              ) : (
                <Button variant="secondary" className="w-full" disabled>
                  {event.price === 'Eintritt frei' ? 'Eintritt frei' : 'Auf Anfrage'}
                </Button>
              )}

              <Link href="/contact" className="btn btn-ghost w-full mt-2">
                Fragen? Kontakt
              </Link>
            </div>

            {/* Related Events */}
            {relatedEvents.length > 0 && (
              <div>
                <h3 className="h4 mb-4">Weitere Events</h3>
                <div className="space-y-4">
                  {relatedEvents.map(event => (
                    <EventCard key={event.id} event={event} variant="compact" />
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}
