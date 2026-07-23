'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'

/**
 * CafeReviewsSlider — Testimonial-Slider für Google-Bewertungen.
 *
 * Bekommt fertige Reviews per Prop (serverseitig aus der Places API oder
 * aus dem Dictionary). Autoplay mit Pause bei Hover/Fokus, Pfeile + Punkte.
 * Rendert nichts, wenn keine Reviews vorhanden sind.
 */

export type SliderReview = {
  author: string
  text: string
  rating: number
  relativeTime?: string
  profilePhoto?: string
}

interface CafeReviewsSliderProps {
  reviews: SliderReview[]
  title: string
  subtitle?: string
  /** z.B. "4,9 · 120 Bewertungen bei Google" */
  ratingLine?: string
  viaLabel: string
}

const AUTOPLAY_MS = 6500

export default function CafeReviewsSlider({
  reviews,
  title,
  subtitle,
  ratingLine,
  viaLabel,
}: CafeReviewsSliderProps) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = reviews.length

  const go = useCallback((next: number) => setIndex((next + count) % count), [count])

  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  useEffect(() => {
    if (paused || count <= 1) return
    timer.current = setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS)
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [paused, count])

  if (count === 0) return null

  const active = reviews[index]

  return (
    <div className="text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-3">{title}</h2>
      {ratingLine ? (
        <p className="text-[var(--pepe-gold)] font-medium mb-1">★★★★★ {ratingLine}</p>
      ) : (
        subtitle && <p className="text-[var(--pepe-gold)] font-medium mb-1">★★★★★ {subtitle}</p>
      )}

      <div
        className="relative max-w-3xl mx-auto mt-10"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
        role="group"
        aria-roledescription="Karussell"
        aria-label={title}
      >
        <div
          className="min-h-[240px] md:min-h-[220px] bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl px-6 py-8 md:px-12 md:py-10 flex flex-col items-center"
          aria-live="polite"
        >
          {/* Sterne */}
          <div className="flex items-center gap-1 mb-5" aria-label={`${active.rating} von 5 Sternen`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={
                  i < Math.round(active.rating)
                    ? 'w-5 h-5 fill-[var(--pepe-gold)] text-[var(--pepe-gold)]'
                    : 'w-5 h-5 text-[var(--pepe-line)]'
                }
              />
            ))}
          </div>

          {/* Zitat */}
          <blockquote className="text-lg md:text-xl text-[var(--pepe-t80)] leading-relaxed italic max-w-2xl">
            „{active.text}“
          </blockquote>

          {/* Autor */}
          <div className="mt-6 flex items-center gap-3">
            {active.profilePhoto && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={active.profilePhoto}
                alt=""
                className="w-10 h-10 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            )}
            <div className="text-left">
              <div className="text-sm font-semibold text-[var(--pepe-white)]">{active.author}</div>
              <div className="text-xs text-[var(--pepe-t64)]">
                {active.relativeTime ? `${active.relativeTime} · ` : ''}
                {viaLabel}
              </div>
            </div>
          </div>
        </div>

        {/* Pfeile */}
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Vorherige Bewertung"
              className="absolute -left-2 md:-left-5 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--pepe-ink)] border border-[var(--pepe-line)] text-[var(--pepe-t80)] hover:border-[var(--pepe-gold)] hover:text-[var(--pepe-gold)] transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Nächste Bewertung"
              className="absolute -right-2 md:-right-5 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--pepe-ink)] border border-[var(--pepe-line)] text-[var(--pepe-t80)] hover:border-[var(--pepe-gold)] hover:text-[var(--pepe-gold)] transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Punkte */}
      {count > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {reviews.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Bewertung ${i + 1} von ${count}`}
              aria-current={i === index}
              className={
                i === index
                  ? 'h-2.5 w-6 rounded-full bg-[var(--pepe-gold)] transition-all'
                  : 'h-2.5 w-2.5 rounded-full bg-[var(--pepe-line)] hover:bg-[var(--pepe-t64)] transition-all'
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}
