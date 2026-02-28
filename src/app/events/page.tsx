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
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'

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
        dotCloudIcon="events"
      />

      {/* Programm Section */}
      <section className="py-12 md:py-16 bg-[var(--pepe-black)]">
        <div className="stage-container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-4 text-center">
              Programm
            </h2>
            <p className="text-lg text-[var(--pepe-t80)] leading-relaxed text-center">
              Unser Programm setzt sich aus selbsttragenden und geförderten Projekten zusammen sowie internationalen, regionalen und städtischen Festivalbeteiligungen.
            </p>
          </div>
        </div>
      </section>

      {/* Geplante Projekte 2026 Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-[var(--pepe-black)] via-[var(--pepe-ink)]/30 to-[var(--pepe-black)]">
        <div className="stage-container">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-6 text-center">
              Für 2026 in Planung
            </h2>
            <p className="text-[var(--pepe-t64)] text-center mb-12">
              Aktuell finden noch Umbauarbeiten statt, aber wir planen hochmotiviert eine neue Saison.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* David Eisele */}
              <a
                href="http://www.davideisele.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-xl p-6 hover:border-[var(--pepe-gold)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.35),0_0_8px_var(--pepe-gold-glow)] transition-all duration-300 ease-out group"
              >
                <h3 className="text-lg font-bold text-[var(--pepe-white)] mb-2 group-hover:text-[var(--pepe-gold)] transition-colors">
                  David Eisele - Tornados Eye
                </h3>
                <p className="text-sm text-[var(--pepe-t64)] mb-3">zeitgenössischer Zirkus - Solo</p>
                <p className="text-xs text-[var(--pepe-t48)]">davideisele.com</p>
              </a>

              {/* Zirkuswerkstatt Stuttgart */}
              <a
                href="https://www.kreativhaltig.de/zirkuswerk"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-xl p-6 hover:border-[var(--pepe-gold)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.35),0_0_8px_var(--pepe-gold-glow)] transition-all duration-300 ease-out group"
              >
                <h3 className="text-lg font-bold text-[var(--pepe-white)] mb-2 group-hover:text-[var(--pepe-gold)] transition-colors">
                  Zirkuswerkstatt Stuttgart
                </h3>
                <p className="text-xs text-[var(--pepe-t48)]">kreativhaltig.de</p>
              </a>

              {/* Saucisson - taigi Cirkas */}
              <a
                href="https://taigicirkas.com/saucisson/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-xl p-6 hover:border-[var(--pepe-gold)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.35),0_0_8px_var(--pepe-gold-glow)] transition-all duration-300 ease-out group"
              >
                <h3 className="text-lg font-bold text-[var(--pepe-white)] mb-2 group-hover:text-[var(--pepe-gold)] transition-colors">
                  Saucisson - taigi Cirkas
                </h3>
                <p className="text-sm text-[var(--pepe-t64)] mb-3">Litauen - Circus Next Laureat</p>
                <p className="text-xs text-[var(--pepe-t48)]">taigicirkas.com</p>
              </a>

              {/* Daniela Maier und Jakob Vöckler */}
              <a
                href="https://www.danimisima.de/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-xl p-6 hover:border-[var(--pepe-gold)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.35),0_0_8px_var(--pepe-gold-glow)] transition-all duration-300 ease-out group"
              >
                <h3 className="text-lg font-bold text-[var(--pepe-white)] mb-2 group-hover:text-[var(--pepe-gold)] transition-colors">
                  Daniela Maier und Jakob Vöckler
                </h3>
                <p className="text-sm text-[var(--pepe-t64)] mb-3">gefördert durch das Kulturreferat München - Solo Präsentationen</p>
                <p className="text-xs text-[var(--pepe-t48)]">danimisima.de</p>
              </a>

              {/* Wunder. Punkt Festival */}
              <a
                href="https://figurentheater-gfp.de/festival/festival-2024.php"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-xl p-6 hover:border-[var(--pepe-gold)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.35),0_0_8px_var(--pepe-gold-glow)] transition-all duration-300 ease-out group"
              >
                <h3 className="text-lg font-bold text-[var(--pepe-white)] mb-2 group-hover:text-[var(--pepe-gold)] transition-colors">
                  Wunder. Punkt Festival
                </h3>
                <p className="text-xs text-[var(--pepe-t48)]">figurentheater-gfp.de</p>
              </a>

              {/* Zeit für Zirkus */}
              <a
                href="https://zeitfuerzirkus.de/info"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-xl p-6 hover:border-[var(--pepe-gold)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.35),0_0_8px_var(--pepe-gold-glow)] transition-all duration-300 ease-out group"
              >
                <h3 className="text-lg font-bold text-[var(--pepe-white)] mb-2 group-hover:text-[var(--pepe-gold)] transition-colors">
                  Zeit für Zirkus
                </h3>
                <p className="text-xs text-[var(--pepe-t48)]">zeitfuerzirkus.de</p>
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="stage-container py-20 md:py-32">
        {/* Month Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8 mb-16 p-8 bg-[var(--pepe-ink)]/40 backdrop-blur-md rounded-3xl border border-[var(--pepe-line)] shadow-xl">
          <div className="text-center sm:text-left">
            <div className="flex items-center gap-3 mb-2 justify-center sm:justify-start">
              <CalendarIcon className="w-6 h-6 text-[var(--pepe-gold)]" />
              <h2 className="text-2xl md:text-4xl font-bold text-[var(--pepe-white)] capitalize">
                {monthName}
              </h2>
            </div>
            <p className="text-[var(--pepe-t64)] text-lg">
              {loading ? 'Laden...' : `${filteredEvents.length} ${filteredEvents.length === 1 ? 'Event' : 'Events'} im Fokus`}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="secondary" size="icon" onClick={goToPreviousMonth} className="rounded-full w-12 h-12">
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button variant="ghost" onClick={goToToday} className="px-6 font-semibold hover:text-[var(--pepe-gold)]">
              Heute
            </Button>
            <Button variant="secondary" size="icon" onClick={goToNextMonth} className="rounded-full w-12 h-12">
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 mb-16">
          {/* Category Filter (Task 3.2.1) */}
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id)
                  setVisibleCount(ITEMS_PER_PAGE)
                }}
                className={cn(
                  'px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ease-out',
                  'border backdrop-blur-sm',
                  selectedCategory === cat.id
                    ? 'bg-[var(--pepe-gold)] text-white border-[var(--pepe-gold)] shadow-[0_0_16px_var(--pepe-gold-glow),0_4px_12px_rgba(0,0,0,0.3)]'
                    : 'bg-[var(--pepe-ink)]/80 text-[var(--pepe-t80)] border-[var(--pepe-line)] hover:border-[var(--pepe-gold)]/60 hover:text-[var(--pepe-gold)] hover:shadow-[0_0_12px_var(--pepe-gold-glow)] hover:bg-[var(--pepe-gold)]/5'
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
              'px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ease-out',
              'border backdrop-blur-sm',
              showPast
                ? 'bg-[var(--pepe-surface)] text-[var(--pepe-white)] border-[var(--pepe-gold)]/40 shadow-[0_0_8px_var(--pepe-gold-glow)]'
                : 'bg-[var(--pepe-ink)]/80 text-[var(--pepe-t64)] border-[var(--pepe-line)] hover:border-[var(--pepe-gold)]/40 hover:text-[var(--pepe-t80)] hover:shadow-[0_0_8px_var(--pepe-gold-glow)]'
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
          <div className="text-center py-20 bg-[var(--pepe-ink)] rounded-2xl border border-[var(--pepe-line)]">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--pepe-gold)]/10 flex items-center justify-center">
              <span className="text-[var(--pepe-gold)] text-4xl">&#128197;</span>
            </div>
            <h3 className="text-xl font-bold text-[var(--pepe-white)] mb-3">
              Keine Events gefunden
            </h3>
            <p className="text-[var(--pepe-t64)] text-lg mb-8 max-w-md mx-auto">
              In diesem Monat sind keine Events geplant. Schau in einen anderen Monat oder entferne die Filter.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" onClick={goToToday}>
                Aktueller Monat
              </Button>
              {selectedCategory !== 'all' && (
                <Button variant="secondary" onClick={() => setSelectedCategory('all')}>
                  Alle Kategorien
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
