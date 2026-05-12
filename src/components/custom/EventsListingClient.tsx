'use client'

/**
 * EventsListingClient — interaktiver Event-Kalender (Client Component).
 *
 * Erhält das geladene Dictionary + die aktuelle Locale per Props, damit
 * alle Texte (Hero, Empty-State, Pagination, …) ohne i18next-Hook
 * lokalisiert werden können.
 */

import { useState, useEffect, useMemo, useRef } from 'react'
import EventCard from '@/components/custom/EventCard'
import HeroSection from '@/components/custom/HeroSection'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import { localizedHref, type Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/get-dictionary'

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

const ITEMS_PER_PAGE = 9

export default function EventsListingClient({
  lang,
  dict,
}: {
  lang: Locale
  dict: Dictionary
}) {
  const t = dict.events
  const dateLocale = lang === 'en' ? 'en-US' : 'de-DE'

  const now = new Date()
  const [events, setEvents] = useState<EventData[]>([])
  const [loading, setLoading] = useState(true)
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showPast] = useState(false)
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)
  const [showStickyNav, setShowStickyNav] = useState(false)
  const monthNavRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = monthNavRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyNav(!entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

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

  const filteredEvents = useMemo(() => {
    let filtered = events
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((e) => e.category.toUpperCase() === selectedCategory)
    }
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (!showPast) {
      filtered = filtered.filter((e) => new Date(e.date) >= today)
    }
    return filtered
  }, [events, selectedCategory, showPast])

  const displayedEvents = filteredEvents.slice(0, visibleCount)
  const hasMore = visibleCount < filteredEvents.length

  const monthName = new Date(year, month - 1).toLocaleDateString(dateLocale, {
    month: 'long',
    year: 'numeric',
  })

  const goToPreviousMonth = () => {
    if (month === 1) { setMonth(12); setYear(year - 1) } else { setMonth(month - 1) }
    setVisibleCount(ITEMS_PER_PAGE)
  }
  const goToNextMonth = () => {
    if (month === 12) { setMonth(1); setYear(year + 1) } else { setMonth(month + 1) }
    setVisibleCount(ITEMS_PER_PAGE)
  }
  const goToToday = () => {
    setYear(now.getFullYear()); setMonth(now.getMonth() + 1)
    setVisibleCount(ITEMS_PER_PAGE)
  }
  const loadMore = () => setVisibleCount((p) => p + ITEMS_PER_PAGE)

  const eventLabel = (count: number) =>
    count === 1 ? t.listing.eventSingular : t.listing.eventPlural

  const eventsBaseHref = localizedHref(lang, '/events')

  return (
    <div className="min-h-screen bg-[var(--pepe-black)]">
      {/* Hero Section */}
      <HeroSection
        title={t.hero.title}
        subtitle={t.hero.subtitle}
        size="sm"
        dotCloudIcon="events"
      />

      {/* Sticky Month Navigation */}
      <div
        className={cn(
          'fixed top-16 left-0 right-0 z-40 transition-all duration-300',
          showStickyNav
            ? 'translate-y-0 opacity-100'
            : '-translate-y-full opacity-0 pointer-events-none'
        )}
      >
        <div className="bg-[var(--pepe-black)]/90 backdrop-blur-lg border-b border-[var(--pepe-line)]">
          <div className="stage-container flex items-center justify-between py-3">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-[var(--pepe-gold)]" />
              <span className="text-sm md:text-base font-bold text-[var(--pepe-white)] capitalize">
                {monthName}
              </span>
              <span className="text-xs text-[var(--pepe-t64)] ml-1">
                {!loading && `${filteredEvents.length} ${eventLabel(filteredEvents.length)}`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={goToPreviousMonth} className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--pepe-ink)] border border-[var(--pepe-line)] text-[var(--pepe-t80)] hover:border-[var(--pepe-gold)] hover:text-[var(--pepe-gold)] transition-all">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1 text-xs font-bold text-[var(--pepe-white)] capitalize min-w-[100px] text-center">
                {monthName}
              </span>
              <button onClick={goToNextMonth} className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--pepe-ink)] border border-[var(--pepe-line)] text-[var(--pepe-t80)] hover:border-[var(--pepe-gold)] hover:text-[var(--pepe-gold)] transition-all">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Events + Monatsfilter */}
      <div className="stage-container py-10 md:py-16">
        <div ref={monthNavRef} className="flex flex-col sm:flex-row items-center justify-between gap-8 mb-16 p-8 bg-[var(--pepe-ink)]/40 backdrop-blur-md rounded-3xl border border-[var(--pepe-line)] shadow-xl">
          <div className="text-center sm:text-left">
            <div className="flex items-center gap-3 mb-2 justify-center sm:justify-start">
              <CalendarIcon className="w-6 h-6 text-[var(--pepe-gold)]" />
              <h2 className="text-2xl md:text-4xl font-bold text-[var(--pepe-white)] capitalize">
                {monthName}
              </h2>
            </div>
            <p className="text-[var(--pepe-t64)] text-lg">
              {loading
                ? t.listing.loading
                : `${filteredEvents.length} ${eventLabel(filteredEvents.length)} ${t.listing.inFocus}`}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="secondary" size="icon" onClick={goToPreviousMonth} className="rounded-full w-12 h-12">
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <span className="text-lg font-bold text-[var(--pepe-white)] capitalize min-w-[140px] text-center">
              {monthName}
            </span>
            <Button variant="secondary" size="icon" onClick={goToNextMonth} className="rounded-full w-12 h-12">
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-3xl mx-auto">
            {[1, 2, 3, 4, 5, 6].map((i) => (
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-3xl mx-auto">
              {displayedEvents.map((event) => (
                <EventCard
                  key={event.id}
                  title={event.title}
                  description={event.description}
                  date={new Date(event.date).toLocaleDateString(dateLocale, {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                  category={event.category}
                  image={event.imageUrl || undefined}
                  href={`${eventsBaseHref}/${event.slug}`}
                />
              ))}
            </div>

            {hasMore && (
              <div className="text-center mt-12">
                <Button variant="secondary" size="lg" onClick={loadMore}>
                  {t.listing.loadMore} ({filteredEvents.length - visibleCount} {t.listing.remaining})
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
              {t.listing.emptyTitle}
            </h3>
            <p className="text-[var(--pepe-t64)] text-lg mb-8 max-w-md mx-auto">
              {t.listing.emptyText}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" onClick={goToToday}>
                {t.listing.currentMonth}
              </Button>
              {selectedCategory !== 'all' && (
                <Button variant="secondary" onClick={() => setSelectedCategory('all')}>
                  {t.listing.allCategories}
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Monats-Schnellwahl */}
        <div className="mt-16 flex flex-col items-center gap-4">
          <p className="text-sm text-[var(--pepe-t64)] font-medium">{t.listing.monthQuickSelect}</p>
          <div className="flex flex-wrap justify-center gap-2">
            {Array.from({ length: 12 }, (_, i) => {
              const m = i + 1
              const label = new Date(year, i).toLocaleDateString(dateLocale, { month: 'short' })
              const isActive = m === month
              return (
                <button
                  key={m}
                  onClick={() => {
                    setMonth(m)
                    setVisibleCount(ITEMS_PER_PAGE)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 border',
                    isActive
                      ? 'bg-[var(--pepe-gold)] text-white border-[var(--pepe-gold)] shadow-[0_0_12px_var(--pepe-gold-glow)]'
                      : 'bg-[var(--pepe-ink)]/80 text-[var(--pepe-t80)] border-[var(--pepe-line)] hover:border-[var(--pepe-gold)]/60 hover:text-[var(--pepe-gold)]'
                  )}
                >
                  {label}
                </button>
              )
            })}
          </div>
          <span className="text-sm font-bold text-[var(--pepe-t64)] mt-1">{year}</span>
        </div>
      </div>

      {/* Programm Section */}
      <section className="py-12 md:py-16 bg-[var(--pepe-black)]">
        <div className="stage-container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-4 text-center">
              {t.programme.title}
            </h2>
            <p className="text-lg text-[var(--pepe-t80)] leading-relaxed text-center">
              {t.programme.text}
            </p>
          </div>
        </div>
      </section>

      {/* Geplante Projekte */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-[var(--pepe-black)] via-[var(--pepe-ink)]/30 to-[var(--pepe-black)]">
        <div className="stage-container">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-6 text-center">
              {t.planned.title}
            </h2>
            <p className="text-[var(--pepe-t64)] text-center mb-12">
              {t.planned.text}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { href: 'https://www.tornadoseye.com',        host: 'tornadoseye.com',     ...t.planned.items.tornadosEye },
                { href: 'https://taigicirkas.com/saucisson/', host: 'taigicirkas.com',     ...t.planned.items.saucisson },
                { href: 'https://www.danimisima.de/',         host: 'danimisima.de',       ...t.planned.items.danielaJakob },
                { href: 'https://zeitfuerzirkus.de/info',     host: 'zeitfuerzirkus.de',   ...t.planned.items.zeitFuer },
              ].map((p, i) => (
                <a
                  key={i}
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-xl p-6 hover:border-[var(--pepe-gold)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.35),0_0_8px_var(--pepe-gold-glow)] transition-all duration-300 ease-out group"
                >
                  <h3 className="text-lg font-bold text-[var(--pepe-white)] mb-2 group-hover:text-[var(--pepe-gold)] transition-colors">
                    {p.title}
                  </h3>
                  {p.sub && (
                    <p className="text-sm text-[var(--pepe-t64)] mb-3">{p.sub}</p>
                  )}
                  <p className="text-xs text-[var(--pepe-t48)]">{p.host}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
