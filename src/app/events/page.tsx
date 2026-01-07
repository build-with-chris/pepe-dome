/**
 * Phase 3 Task 3.2: Events Pages Rebuild
 *
 * Features:
 * - Task 3.2.1: Rebuild events listing page (grid layout, category filter, month/date filter)
 * - Task 3.2.2: Add pagination to events (load more button)
 */

'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import EventCard from '@/components/custom/EventCard'
import HeroSection from '@/components/custom/HeroSection'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

type EventData = {
  id: string
  slug: string
  title: string
  subtitle: string | null
  description: string
  date: string
  endDate: string | null
  time: string | null
  location: string
  category: string
  ticketUrl: string | null
  price: string | null
  imageUrl: string | null
  featured: boolean
  highlights: string[]
}

const CATEGORIES = [
  { id: 'all', label: 'Alle' },
  { id: 'SHOW', label: 'Shows' },
  { id: 'PREMIERE', label: 'Premieren' },
  { id: 'FESTIVAL', label: 'Festivals' },
  { id: 'WORKSHOP', label: 'Workshops' },
  { id: 'TRAINING', label: 'Training' },
  { id: 'BUSINESS', label: 'Business' },
]

const ITEMS_PER_PAGE = 9

export default function EventsPage() {
  const now = new Date()
  const [events, setEvents] = useState<EventData[]>([])
  const [loading, setLoading] = useState(true)
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showPast, setShowPast] = useState(false)
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)

  // Fetch events for the selected month
  useEffect(() => {
    async function fetchEvents() {
      setLoading(true)
      try {
        const res = await fetch(`/api/events?year=${year}&month=${month}`)
        if (res.ok) {
          const data = await res.json()
          setEvents(data)
        }
      } catch (error) {
        console.error('Failed to fetch events:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [year, month])

  // Filter events by category
  const filteredEvents = useMemo(() => {
    let filtered = events

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(e => e.category.toUpperCase() === selectedCategory)
    }

    // Filter past/future events
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (!showPast) {
      filtered = filtered.filter(e => new Date(e.date) >= today)
    }

    return filtered
  }, [events, selectedCategory, showPast])

  // Paginated events
  const displayedEvents = filteredEvents.slice(0, visibleCount)
  const hasMore = visibleCount < filteredEvents.length

  const monthName = new Date(year, month - 1).toLocaleDateString('de-DE', {
    month: 'long',
    year: 'numeric'
  })

  const goToPreviousMonth = () => {
    if (month === 1) {
      setMonth(12)
      setYear(year - 1)
    } else {
      setMonth(month - 1)
    }
    setVisibleCount(ITEMS_PER_PAGE)
  }

  const goToNextMonth = () => {
    if (month === 12) {
      setMonth(1)
      setYear(year + 1)
    } else {
      setMonth(month + 1)
    }
    setVisibleCount(ITEMS_PER_PAGE)
  }

  const goToToday = () => {
    setYear(now.getFullYear())
    setMonth(now.getMonth() + 1)
    setVisibleCount(ITEMS_PER_PAGE)
  }

  const loadMore = () => {
    setVisibleCount(prev => prev + ITEMS_PER_PAGE)
  }

  return (
    <div className="min-h-screen bg-[var(--pepe-black)]">
      {/* Hero Section */}
      <HeroSection
        title="Event-Kalender"
        subtitle="Entdecke Shows, Workshops, Festivals und mehr im Pepe Dome"
        size="sm"
      />

      <div className="stage-container py-20 md:py-28">
        {/* Month Navigation */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] capitalize">
              {monthName}
            </h2>
            <p className="text-[var(--pepe-t64)]">
              {loading ? 'Laden...' : `${filteredEvents.length} ${filteredEvents.length === 1 ? 'Event' : 'Events'} gefunden`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={goToPreviousMonth}>
              Zuruck
            </Button>
            <Button variant="secondary" size="sm" onClick={goToToday}>
              Heute
            </Button>
            <Button variant="ghost" size="sm" onClick={goToNextMonth}>
              Weiter
            </Button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          {/* Category Filter (Task 3.2.1) */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id)
                  setVisibleCount(ITEMS_PER_PAGE)
                }}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                  'border',
                  selectedCategory === cat.id
                    ? 'bg-[var(--pepe-gold)] text-[var(--pepe-black)] border-[var(--pepe-gold)]'
                    : 'bg-transparent text-[var(--pepe-t80)] border-[var(--pepe-line)] hover:border-[var(--pepe-gold)] hover:text-[var(--pepe-gold)]'
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Past Events Toggle */}
          <button
            onClick={() => setShowPast(!showPast)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              'border',
              showPast
                ? 'bg-[var(--pepe-surface)] text-[var(--pepe-white)] border-[var(--pepe-line)]'
                : 'bg-transparent text-[var(--pepe-t64)] border-[var(--pepe-line)] hover:text-[var(--pepe-t80)]'
            )}
          >
            {showPast ? 'Vergangene ausblenden' : 'Vergangene anzeigen'}
          </button>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div
                key={i}
                className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-xl overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-[var(--pepe-surface)]" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-[var(--pepe-surface)] rounded w-1/4" />
                  <div className="h-6 bg-[var(--pepe-surface)] rounded w-3/4" />
                  <div className="h-4 bg-[var(--pepe-surface)] rounded w-full" />
                  <div className="h-4 bg-[var(--pepe-surface)] rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : displayedEvents.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedEvents.map((event, index) => (
                <EventCard
                  key={event.id}
                  title={event.title}
                  description={event.description}
                  date={new Date(event.date).toLocaleDateString('de-DE', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                  category={event.category}
                  image={event.imageUrl || undefined}
                  href={`/events/${event.id}`}
                  featured={event.featured && index < 2}
                />
              ))}
            </div>

            {/* Task 3.2.2: Pagination - Load More Button */}
            {hasMore && (
              <div className="text-center mt-12">
                <Button variant="secondary" size="lg" onClick={loadMore}>
                  Weitere Events laden ({filteredEvents.length - visibleCount} verbleibend)
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-[var(--pepe-ink)] rounded-xl border border-[var(--pepe-line)]">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--pepe-surface)] flex items-center justify-center">
              <span className="text-[var(--pepe-t32)] text-3xl">📅</span>
            </div>
            <p className="text-[var(--pepe-t64)] text-lg mb-4">
              Keine Events in diesem Monat gefunden.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="secondary" onClick={goToToday}>
                Zuruck zum aktuellen Monat
              </Button>
              {selectedCategory !== 'all' && (
                <Button variant="ghost" onClick={() => setSelectedCategory('all')}>
                  Alle Kategorien anzeigen
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
