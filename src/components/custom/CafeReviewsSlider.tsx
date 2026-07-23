'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'

/**
 * CafeReviewsSlider — Testimonial-Slider für Google-Bewertungen.
 *
 * Holt die Reviews zur Laufzeit selbst über /api/cafe-reviews (mit Cache).
 * Bewusst client-seitig: so greift jede Konfigurationsänderung sofort,
 * ohne dass die statische Café-Seite neu gebaut werden muss.
 *
 * Autoplay mit Pause bei Hover/Fokus, Pfeile + Punkte. Rendert nichts,
 * solange keine Reviews geladen sind.
 */

type Review = {
  author: string
  text: string
  rating: number
  relativeTime?: string
  profilePhoto?: string
}

interface CafeReviewsSliderProps {
  lang: 'de' | 'en'
  title: string
  subtitle?: string
  viaLabel: string
  /** z.B. "Bewertungen bei Google" / "reviews on Google" */
  reviewsWord: string
}

const AUTOPLAY_MS = 6500

export default function CafeReviewsSlider({
  lang,
  title,
  subtitle,
  viaLabel,
  reviewsWord,
}: CafeReviewsSliderProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [rating, setRating] = useState<number | null>(null)
  const [total, setTotal] = useState<number | null>(null)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    let active = true
    fetch(`/api/cafe-reviews?lang=${lang}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!active || !data) return
        setReviews(Array.isArray(data.reviews) ? data.reviews : [])
        setRating(typeof data.rating === 'number' ? data.rating : null)
        setTotal(typeof data.total === 'number' ? data.total : null)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [lang])

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

  const active = reviews[Math.min(index, count - 1)]
  const ratingLine =
    rating != null
      ? `${rating.toLocaleString(lang === 'en' ? 'en-US' : 'de-DE', {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        })}${total ? ` · ${total} ${reviewsWord}` : ''}`
      : subtitle

  return (
    <div>
      <h3 className="text-xl md:text-2xl font-bold text-[var(--pepe-white)] mb-1">{title}</h3>
      {ratingLine && <p className="text-[var(--pepe-gold)] font-medium text-sm mb-5">★★★★★ {ratingLine}</p>}

      <div
        className="relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
        role="group"
        aria-roledescription="Karussell"
        aria-label={title}
      >
        <div
          className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl px-6 py-7 md:px-8 md:py-8"
          aria-live="polite"
        >
          <div className="flex items-center gap-1 mb-4" aria-label={`${active.rating} von 5 Sternen`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={
                  i < Math.round(active.rating)
                    ? 'w-4 h-4 fill-[var(--pepe-gold)] text-[var(--pepe-gold)]'
                    : 'w-4 h-4 text-[var(--pepe-line)]'
                }
              />
            ))}
          </div>

          <blockquote className="text-base md:text-lg text-[var(--pepe-t80)] leading-relaxed italic line-clamp-6">
            „{active.text}“
          </blockquote>

          <div className="mt-5 flex items-center gap-3">
            {active.profilePhoto && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={active.profilePhoto}
                alt=""
                className="w-9 h-9 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            )}
            <div>
              <div className="text-sm font-semibold text-[var(--pepe-white)]">{active.author}</div>
              <div className="text-xs text-[var(--pepe-t64)]">
                {active.relativeTime ? `${active.relativeTime} · ` : ''}
                {viaLabel}
              </div>
            </div>
          </div>
        </div>

        {count > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Bewertung ${i + 1} von ${count}`}
                  aria-current={i === index}
                  className={
                    i === index
                      ? 'h-2 w-5 rounded-full bg-[var(--pepe-gold)] transition-all'
                      : 'h-2 w-2 rounded-full bg-[var(--pepe-line)] hover:bg-[var(--pepe-t64)] transition-all'
                  }
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => go(index - 1)}
                aria-label="Vorherige Bewertung"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--pepe-ink)] border border-[var(--pepe-line)] text-[var(--pepe-t80)] hover:border-[var(--pepe-gold)] hover:text-[var(--pepe-gold)] transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => go(index + 1)}
                aria-label="Nächste Bewertung"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--pepe-ink)] border border-[var(--pepe-line)] text-[var(--pepe-t80)] hover:border-[var(--pepe-gold)] hover:text-[var(--pepe-gold)] transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
