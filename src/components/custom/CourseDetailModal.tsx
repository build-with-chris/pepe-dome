'use client'

/**
 * CourseDetailModal
 * Zeigt die Details eines Kurses. Buchung läuft über das Eversports-Widget
 * im Buchungsbereich (#buchung) der Trainings-Seite.
 */

import { useEffect, useState } from 'react'
import type { Kurs } from './CourseScheduleGrid'

type CopyState = 'idle' | 'copied'

export default function CourseDetailModal({
  kurs,
  onClose,
}: {
  kurs: Kurs | null
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
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <span className="text-[var(--pepe-gold)] text-xs font-semibold uppercase tracking-widest">
              {kurs.day} · {kurs.time}
            </span>
            <span className="text-[var(--pepe-t48)] text-xs">mit {kurs.trainer}</span>
          </div>
          <h2
            id="course-modal-title"
            className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-4"
          >
            {kurs.title}
          </h2>
          <p className="text-[var(--pepe-t80)] leading-relaxed mb-6">{kurs.description}</p>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <p className="text-[var(--pepe-gold)] text-xs font-semibold uppercase tracking-widest mb-2">
                Inhalte
              </p>
              <ul className="space-y-1.5 text-[var(--pepe-t80)] text-sm">
                {kurs.inhalte.map((inhalt) => (
                  <li key={inhalt} className="flex items-start gap-2">
                    <span className="text-[var(--pepe-gold)] mt-0.5">·</span>
                    <span>{inhalt}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[var(--pepe-gold)] text-xs font-semibold uppercase tracking-widest mb-2">
                Für wen
              </p>
              <p className="text-[var(--pepe-t80)] text-sm leading-relaxed">{kurs.fuerWen}</p>
            </div>
          </div>

          {/* Termine — wenn der Kurs konkrete Datums-Slots hat (z.B. Sonntags-Flow-Arts) */}
          {kurs.termine && kurs.termine.length > 0 && (
            <div className="mt-6 pt-6 border-t border-[var(--pepe-line)]">
              <p className="text-[var(--pepe-gold)] text-xs font-semibold uppercase tracking-widest mb-3">
                {kurs.termineTitel ?? 'Termine'}
              </p>
              <ul className="space-y-2">
                {kurs.termine.map((t, i) =>
                  t.highlight ? (
                    <li key={i}>
                      <div
                        className="rounded-lg p-3"
                        style={{
                          background:
                            'linear-gradient(135deg, rgba(196,167,103,0.18), rgba(196,167,103,0.06))',
                          border: '1px solid rgba(196,167,103,0.45)',
                        }}
                      >
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-[var(--pepe-gold)] font-bold tabular-nums">
                            {t.date}
                          </span>
                          {t.badge && (
                            <span
                              className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest"
                              style={{ backgroundColor: 'var(--pepe-gold)', color: 'var(--pepe-black)' }}
                            >
                              {t.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[var(--pepe-white)] font-semibold leading-snug text-sm">
                          {t.title}
                          {t.trainer && (
                            <span className="text-[var(--pepe-t64)] font-normal"> · {t.trainer}</span>
                          )}
                        </p>
                        {t.sub && (
                          <p className="text-[var(--pepe-gold)] text-xs font-medium mt-1 leading-snug">
                            {t.sub}
                          </p>
                        )}
                      </div>
                    </li>
                  ) : (
                    <li key={i} className="flex items-baseline gap-3 text-sm py-1">
                      <span className="text-[var(--pepe-t80)] font-bold tabular-nums whitespace-nowrap min-w-[3.5rem]">
                        {t.date}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[var(--pepe-white)] leading-snug">
                          {t.title}
                          {t.trainer && (
                            <span className="text-[var(--pepe-t48)]"> · {t.trainer}</span>
                          )}
                        </p>
                        {t.sub && (
                          <p className="text-[var(--pepe-t48)] text-xs mt-0.5 italic leading-snug">
                            {t.sub}
                          </p>
                        )}
                      </div>
                    </li>
                  )
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Buchungs-CTA — verweist auf Eversports-Widget oben */}
        <div className="p-6 md:p-8 bg-gradient-to-br from-[var(--pepe-gold)]/10 to-transparent">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-[var(--pepe-white)] mb-1">
                Bereit zum Mitmachen?
              </h3>
              <p className="text-[var(--pepe-t64)] text-sm">
                Buche diesen Kurs direkt über Eversports — Schnupperstunde, Einzelstunde oder Karte.
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
        </div>
      </div>
    </div>
  )
}
