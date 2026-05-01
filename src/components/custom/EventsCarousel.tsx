'use client'

/**
 * EventsCarousel
 * Horizontale Galerie für die nächsten Events. Snap-Scroll + Pfeil-Buttons.
 * Auf Desktop sind 3 Cards gleichzeitig sichtbar (jede ~1/3 Breite),
 * auf Tablet 2, auf Mobile 1. Mit Pfeilen scrollt man kartenweise.
 */

import { useEffect, useRef, useState } from 'react'
import EventCard from './EventCard'

export type CarouselEvent = {
  id: string
  slug: string
  title: string
  description: string
  date: string  // ISO
  category: string
  imageUrl: string | null
}

export default function EventsCarousel({ events }: { events: CarouselEvent[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  // Buttons disablen wenn am Anfang/Ende des Scrolls
  const updateScrollState = () => {
    const el = trackRef.current
    if (!el) return
    setCanPrev(el.scrollLeft > 8)
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8)
  }

  useEffect(() => {
    updateScrollState()
    const el = trackRef.current
    if (!el) return
    el.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState)
    return () => {
      el.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [events.length])

  const scrollByCard = (dir: 1 | -1) => {
    const el = trackRef.current
    if (!el) return
    const firstChild = el.querySelector<HTMLElement>('[data-carousel-item]')
    const cardWidth = firstChild?.offsetWidth ?? el.clientWidth * 0.8
    const gap = 20 // gap-5
    el.scrollBy({ left: (cardWidth + gap) * dir, behavior: 'smooth' })
  }

  if (events.length === 0) return null

  return (
    <div className="relative">
      {/* Pfeil-Buttons — auf Desktop neben dem Track, auf Mobile darüber */}
      <div className="absolute -top-14 right-0 flex gap-2 z-10">
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          disabled={!canPrev}
          aria-label="Vorheriges Event"
          className="w-10 h-10 rounded-full bg-[var(--pepe-ink)] border border-[var(--pepe-line)] text-[var(--pepe-t80)] hover:border-[var(--pepe-gold)] hover:text-[var(--pepe-gold)] disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[var(--pepe-gold)]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          disabled={!canNext}
          aria-label="Nächstes Event"
          className="w-10 h-10 rounded-full bg-[var(--pepe-ink)] border border-[var(--pepe-line)] text-[var(--pepe-t80)] hover:border-[var(--pepe-gold)] hover:text-[var(--pepe-gold)] disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[var(--pepe-gold)]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Scroll-Track */}
      <div
        ref={trackRef}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 -mx-4 px-4 md:mx-0 md:px-0"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {events.map((event) => (
          <div
            key={event.id}
            data-carousel-item
            className="snap-start flex-shrink-0 w-[85%] sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)]"
          >
            <EventCard
              title={event.title}
              description={event.description}
              date={new Date(event.date).toLocaleDateString('de-DE', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
              category={event.category}
              image={event.imageUrl || undefined}
              href={`/events/${event.slug}`}
            />
          </div>
        ))}
      </div>

      {/* Webkit-Scrollbar verstecken */}
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
