'use client'

/**
 * CourseDetailModal
 * Zeigt die Details eines Kurses. Buchung läuft über das Eversports-Widget
 * im Buchungsbereich (#buchung) der Trainings-Seite.
 */

import { useEffect, useState } from 'react'
import { weekdayName, zeitspanne, type Kurs } from '@/lib/course-types'

type CopyState = 'idle' | 'copied'

export default function CourseDetailModal({
  kurs,
  lang = 'de',
  onClose,
}: {
  /** Trägt seine Wochentermine selbst, siehe src/lib/course-types.ts. */
  kurs: Kurs | null
  lang?: 'de' | 'en'
  onClose: () => void
}) {
  const [copyState, setCopyState] = useState<CopyState>('idle')

  // ESC schließt das Modal
  useEffect(() => {
    if (!kurs) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)

    // Body-Scroll sperren solange Modal offen ist
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = originalOverflow
    }
  }, [kurs, onClose])

  // Reset State, wenn Modal neu geöffnet wird
  useEffect(() => {
    if (kurs) {
      setCopyState('idle')
    }
  }, [kurs])

  if (!kurs) return null

  // Shareable URL für diesen Kurs (nutzt window.location.origin)
  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/training?kurs=${kurs.slug}#kursprogramm`
      : ''

  async function handleCopyLink() {
    if (!kurs) return
    const url = `${window.location.origin}/training?kurs=${kurs.slug}#kursprogramm`
    try {
      await navigator.clipboard.writeText(url)
      setCopyState('copied')
      setTimeout(() => setCopyState('idle'), 2000)
    } catch {
      // Fallback: Prompt mit der URL zum manuellen Kopieren
      window.prompt('URL zum Kopieren:', url)
    }
  }

  // Modal schließen + zum Eversports-Widget scrollen
  function handleBookingClick() {
    onClose()
    // Kurzer Timeout, damit das Modal erst sauber zu ist bevor wir scrollen
    setTimeout(() => {
      const target = document.getElementById('buchung')
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="course-modal-title"
      onClick={onClose}
    >
      <div
        className="relative bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top-Right Buttons: Link teilen + Schließen */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyLink}
            className="h-10 px-3.5 rounded-full bg-[var(--pepe-surface)] hover:bg-[var(--pepe-line)] flex items-center gap-2 text-[var(--pepe-t80)] hover:text-[var(--pepe-white)] text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--pepe-gold)]"
            aria-label="Link zu diesem Kurs kopieren"
            title={shareUrl}
          >
            {copyState === 'copied' ? (
              <>
                <span aria-hidden="true">✓</span>
                <span>Kopiert</span>
              </>
            ) : (
              <>
                <svg
                  width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  strokeLinejoin="round" aria-hidden="true"
                >
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                <span>Link teilen</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-[var(--pepe-surface)] hover:bg-[var(--pepe-line)] flex items-center justify-center text-[var(--pepe-white)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--pepe-gold)]"
            aria-label="Schließen"
          >
            <span className="text-xl leading-none" aria-hidden="true">×</span>
          </button>
        </div>

        {/* Kurs-Details */}
        <div className="p-6 md:p-8 border-b border-[var(--pepe-line)]">
          <span className="text-[var(--pepe-t48)] text-xs">mit {kurs.trainer}</span>
          <h2
            id="course-modal-title"
            className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mt-2 mb-4"
          >
            {kurs.title}
          </h2>

          {/* Termine dieses Kurses. Läuft er mehrmals pro Woche, stehen hier
              alle Slots, nicht nur der angeklickte. */}
          <div className="flex flex-wrap gap-2 mb-5">
            {kurs.slots.map((slot, i) => (
              <span
                key={i}
                className="inline-flex items-baseline gap-2 px-3 py-1.5 rounded-lg bg-[var(--pepe-surface)] border border-[var(--pepe-line)] text-sm"
              >
                <span className="text-[var(--pepe-accent-text)] font-bold">
                  {weekdayName(slot.weekday, lang)}
                </span>
                <span className="text-[var(--pepe-t80)] tabular-nums">
                  {zeitspanne(slot, lang)}
                </span>
              </span>
            ))}
          </div>

          <p className="text-[var(--pepe-t80)] leading-relaxed mb-6">{kurs.description}</p>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <p className="text-[var(--pepe-accent-text)] text-xs font-semibold uppercase tracking-widest mb-2">
                Inhalte
              </p>
              <ul className="space-y-1.5 text-[var(--pepe-t80)] text-sm">
                {kurs.inhalte.map((inhalt) => (
                  <li key={inhalt} className="flex items-start gap-2">
                    <span className="text-[var(--pepe-accent-text)] mt-0.5">·</span>
                    <span>{inhalt}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[var(--pepe-accent-text)] text-xs font-semibold uppercase tracking-widest mb-2">
                Für wen
              </p>
              <p className="text-[var(--pepe-t80)] text-sm leading-relaxed">{kurs.fuerWen}</p>
            </div>
          </div>

        </div>

        {/* Buchungs-CTA — entweder externer Buchungs-Link (mailto/https)
            oder Standard: zum Eversports-Widget oben scrollen. */}
        <div className="p-6 md:p-8 bg-gradient-to-br from-[var(--pepe-gold)]/10 to-transparent">
          {kurs.bookingUrl ? (
            // ─── Externer Buchungs-Flow (z.B. Aircrobatics, Holi Poldini) ───
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-[var(--pepe-white)] mb-1">
                  {kurs.bookingUrl.startsWith('mailto:') ? 'Per E-Mail anmelden' : 'Direkt beim Anbieter buchen'}
                </h3>
                <p className="text-[var(--pepe-t64)] text-sm">
                  {kurs.bookingNote ?? `Dieser Kurs läuft nicht über Eversports. Buchung direkt hier:`}
                </p>
                <p className="text-[var(--pepe-accent-text)] text-sm font-mono mt-1 break-all">
                  {kurs.bookingUrl.replace(/^mailto:/, '').replace(/^https?:\/\//, '')}
                </p>
              </div>
              <a
                href={kurs.bookingUrl}
                target={kurs.bookingUrl.startsWith('mailto:') ? undefined : '_blank'}
                rel={kurs.bookingUrl.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--pepe-gold)] text-[var(--pepe-black)] rounded-full font-bold hover:bg-[var(--pepe-gold-hover)] active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--pepe-gold)] focus:ring-offset-2 focus:ring-offset-[var(--pepe-ink)] whitespace-nowrap"
              >
                <span aria-hidden="true">{kurs.bookingUrl.startsWith('mailto:') ? '✉️' : '↗'}</span>
                <span>{kurs.bookingLabel ?? 'Direkt buchen'}</span>
              </a>
            </div>
          ) : (
            // ─── Standard: Eversports-Widget (alle anderen Kurse) ───
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-[var(--pepe-white)] mb-1">
                  Bereit zum Mitmachen?
                </h3>
                <p className="text-[var(--pepe-t64)] text-sm">
                  Buche diesen Kurs direkt über Eversports: Schnupperstunde, Einzelstunde oder Karte.
                </p>
              </div>
              <button
                type="button"
                onClick={handleBookingClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--pepe-gold)] text-[var(--pepe-black)] rounded-full font-bold hover:bg-[var(--pepe-gold-hover)] active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--pepe-gold)] focus:ring-offset-2 focus:ring-offset-[var(--pepe-ink)] whitespace-nowrap"
              >
                <span aria-hidden="true">🎟</span>
                <span>Zur Buchung</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
