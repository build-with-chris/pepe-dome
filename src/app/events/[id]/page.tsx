/**
 * Phase 3 Task 3.2.3 & 3.2.4: Event Detail Page Rebuild
 *
 * Features:
 * - Task 3.2.3: Rebuild event detail page (hero image, event info, description, ticket CTA)
 * - Task 3.2.4: Add related content (related articles, similar events)
 */

import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getEventById, getUpcomingEvents } from '@/lib/db-data'
import { getRecentArticles } from '@/lib/db-data'
import { Button } from '@/components/ui/Button'
import EventCard from '@/components/custom/EventCard'
import { MarkdownText } from '@/components/ui/MarkdownText'
import NewsCard from '@/components/custom/NewsCard'
import SignupForm from '@/components/custom/SignupForm'
import { cn } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const event = await getEventById(id)

  if (!event) {
    notFound()
  }

  // Fetch related content (Task 3.2.4)
  const [upcomingEvents, recentArticles] = await Promise.all([
    getUpcomingEvents(),
    getRecentArticles(3),
  ])

  // Get similar events (same category, exclude current)
  const similarEvents = upcomingEvents
    .filter(e => e.category === event.category && e.id !== event.id)
    .slice(0, 3)

  // Format date
  const eventDate = new Date(event.date)
  const formattedDate = eventDate.toLocaleDateString('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  return (
    <div className="min-h-screen bg-[var(--pepe-black)]">
      {/* Hero Image Section */}
      <section className="relative h-[50vh] min-h-[400px] max-h-[600px] overflow-hidden">
        {event.imageUrl ? (
          <>
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--pepe-black)] via-[var(--pepe-black)]/50 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--pepe-black)] to-[var(--pepe-ink)]" />
        )}

        {/* Breadcrumbs */}
        <nav className="absolute top-8 left-0 right-0 z-10">
          <div className="stage-container">
            <div className="flex items-center gap-2 text-sm text-[var(--pepe-t64)]">
              <Link href="/" className="hover:text-[var(--pepe-white)] transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/events" className="hover:text-[var(--pepe-white)] transition-colors">
                Events
              </Link>
              <span>/</span>
              <span className="text-[var(--pepe-white)] truncate max-w-[200px]">{event.title}</span>
            </div>
          </div>
        </nav>

        {/* Event Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-10 pb-8">
          <div className="stage-container">
            {/* Category Badge */}
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-[var(--pepe-gold)]/20 text-[var(--pepe-gold)] border border-[var(--pepe-gold)]/40 mb-4">
              {event.category}
            </span>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--pepe-white)] mb-2 leading-tight">
              {event.title}
            </h1>

            {event.subtitle && (
              <p className="text-xl text-[var(--pepe-gold)] font-medium">
                {event.subtitle}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="stage-container py-20 md:py-28">
        <div className="grid lg:grid-cols-[1fr_380px] gap-12 lg:gap-16">
          {/* Left Column - Content */}
          <div>
            {/* Featured Badge */}
            {event.featured && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--pepe-gold)]/10 border border-[var(--pepe-gold)]/30 rounded-full mb-6">
                <span className="text-[var(--pepe-gold)] font-semibold">Highlight Event</span>
              </div>
            )}

            {/* Description */}
            <div className="prose prose-invert prose-lg max-w-none mb-8">
              <MarkdownText content={event.description} className="text-lg text-[var(--pepe-t80)] leading-relaxed space-y-4" />
            </div>

            {/* Highlights */}
            {event.highlights && event.highlights.length > 0 && (
              <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-xl p-6 mb-8">
                <h3 className="text-xl font-bold text-[var(--pepe-white)] mb-4">Highlights</h3>
                <ul className="space-y-3">
                  {event.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-[var(--pepe-gold)] mt-1">&#10003;</span>
                      <span className="text-[var(--pepe-t80)]">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Newsletter Signup */}
            <div className="mt-12 pt-8 border-t border-[var(--pepe-line)]">
              <div className="max-w-xl">
                <h3 className="text-xl font-bold text-[var(--pepe-white)] mb-4">
                  Bleib auf dem Laufenden
                </h3>
                <p className="text-[var(--pepe-t64)] mb-4">
                  Erhalte Updates zu ahnlichen Events und verpasse keine Highlights mehr.
                </p>
                <SignupForm variant="simple" />
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <aside className="space-y-6">
            {/* Event Info Card */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-xl p-6 sticky top-24">
              <h3 className="text-lg font-bold text-[var(--pepe-white)] mb-6">Event-Informationen</h3>

              <div className="space-y-5 mb-6">
                {/* Date */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--pepe-gold)]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-[var(--pepe-gold)]">📅</span>
                  </div>
                  <div>
                    <div className="text-xs text-[var(--pepe-t48)] mb-1 uppercase tracking-wide">Datum</div>
                    <div className="text-[var(--pepe-white)] font-medium">
                      {formattedDate}
                      {event.endDate && (
                        <span className="text-[var(--pepe-t64)]">
                          {' - '}{new Date(event.endDate).toLocaleDateString('de-DE', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Time */}
                {event.time && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--pepe-gold)]/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-[var(--pepe-gold)]">&#128336;</span>
                    </div>
                    <div>
                      <div className="text-xs text-[var(--pepe-t48)] mb-1 uppercase tracking-wide">Uhrzeit</div>
                      <div className="text-[var(--pepe-white)] font-medium">{event.time}</div>
                    </div>
                  </div>
                )}

                {/* Location */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--pepe-gold)]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-[var(--pepe-gold)]">📍</span>
                  </div>
                  <div>
                    <div className="text-xs text-[var(--pepe-t48)] mb-1 uppercase tracking-wide">Ort</div>
                    <div className="text-[var(--pepe-white)] font-medium">{event.location}</div>
                  </div>
                </div>

                {/* Price */}
                {event.price && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--pepe-gold)]/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-[var(--pepe-gold)]">&#128176;</span>
                    </div>
                    <div>
                      <div className="text-xs text-[var(--pepe-t48)] mb-1 uppercase tracking-wide">Preis</div>
                      <div className="text-[var(--pepe-gold)] font-bold text-lg">{event.price}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Ticket CTA Button (Gold) */}
              {event.ticketUrl ? (() => {
                const isEmail = event.ticketUrl.includes('@') && !event.ticketUrl.startsWith('http');
                const href = isEmail && !event.ticketUrl.startsWith('mailto:') 
                  ? `mailto:${event.ticketUrl}` 
                  : event.ticketUrl;
                const buttonText = isEmail ? 'Anmelden via Mail' : 'Tickets kaufen';

                return (
                  <a
                    href={href}
                    target={isEmail ? undefined : "_blank"}
                    rel={isEmail ? undefined : "noopener noreferrer"}
                    className="block"
                  >
                    <Button variant="primary" size="lg" className="w-full">
                      {buttonText}
                    </Button>
                  </a>
                );
              })() : (
                <Button variant="secondary" size="lg" className="w-full" disabled>
                  {event.price === 'Eintritt frei' ? 'Eintritt frei' : 'Tickets folgen'}
                </Button>
              )}

              <Link href="/contact" className="block mt-3">
                <Button variant="ghost" size="md" className="w-full">
                  Fragen? Kontakt aufnehmen
                </Button>
              </Link>
            </div>
          </aside>
        </div>

        {/* Task 3.2.4: Related Content */}
        {/* Similar Events Section */}
        {similarEvents.length > 0 && (
          <section className="mt-16 pt-12 border-t border-[var(--pepe-line)]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-[var(--pepe-white)]">
                Ähnliche Events
              </h2>
              <Link href="/events">
                <Button variant="ghost" size="sm">
                  Alle Events
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {similarEvents.map(e => (
                <EventCard
                  key={e.id}
                  title={e.title}
                  description={e.description}
                  date={new Date(e.date).toLocaleDateString('de-DE', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                  category={e.category}
                  image={e.imageUrl || undefined}
                  href={`/events/${e.id}`}
                />
              ))}
            </div>
          </section>
        )}

        {/* Related Articles Section */}
        {recentArticles.length > 0 && (
          <section className="mt-16 pt-12 border-t border-[var(--pepe-line)]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-[var(--pepe-white)]">
                Aktuelle News
              </h2>
              <Link href="/news">
                <Button variant="ghost" size="sm">
                  Alle News
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentArticles.map(article => (
                <NewsCard
                  key={article.id}
                  title={article.title}
                  excerpt={article.excerpt}
                  date={new Date(article.publishedAt).toLocaleDateString('de-DE', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                  author={article.author}
                  category={article.category}
                  image={article.imageUrl || undefined}
                  href={`/news/${article.slug}`}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
