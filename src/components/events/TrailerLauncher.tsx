'use client'

import { useEffect, useRef, useState } from 'react'
import TrailerPlayer, { type TrailerLabels } from './TrailerPlayer'
import type { EventTrailer } from '@/lib/event-trailer'

/**
 * Trailer-Knopf auf der Event-Karte
 *
 * Auf der Übersicht entscheidet sich in zwei Sekunden, ob ein Event
 * interessant ist. Titel und Standbild reichen dafür oft nicht, ein Trailer
 * schon. Er soll aber niemanden aus der Übersicht werfen: der Knopf öffnet
 * deshalb ein Fenster über der Liste, statt zur Detailseite zu springen. Wer
 * schliesst, steht wieder genau da, wo er war, samt Monat und Filter.
 *
 * Der Knopf liegt bewusst nicht innerhalb des Karten-Links. Ein <button> in
 * einem <a> ist ungültiges HTML, und Browser behandeln den Klick dann
 * unterschiedlich: mal öffnet das Fenster, mal navigiert die Karte weg. Die
 * Karte hängt den Knopf deshalb neben den Link und legt ihn per Position
 * darüber.
 */

export interface TrailerCardLabels extends TrailerLabels {
  /** Beschriftung des Knopfs auf der Karte */
  badge: string
  /** Beschriftung des Schliessen-Knopfs im Fenster */
  close: string
}

export default function TrailerLauncher({
  trailer,
  poster,
  title,
  labels,
  privacyHref,
}: {
  trailer: EventTrailer
  poster?: string | null
  title: string
  labels: TrailerCardLabels
  privacyHref: string
}) {
  const [open, setOpen] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handler)

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Ohne das bleibt der Fokus auf dem Knopf hinter dem Fenster: die Tastatur
    // läuft dann durch die Karten darunter weiter, während vorne ein Fenster
    // steht.
    closeRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = originalOverflow
    }
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        // Grosszügiger Knopf statt einer schmalen Pille: auf dem Telefon wird
        // hier mit dem Daumen getroffen, direkt neben einem Link, der die
        // Karte öffnet. Ein Fehlgriff kostet den Platz in der Liste.
        className="inline-flex min-h-[38px] items-center gap-2 rounded-full bg-black/70 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-[var(--pepe-gold)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pepe-gold)]"
        aria-haspopup="dialog"
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.29-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14z" />
        </svg>
        {labels.badge}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`${labels.badge}: ${title}`}
          onClick={() => setOpen(false)}
        >
          {/* Breite bewusst als Inline-Style.
              `max-w-3xl` wäre hier eine Falle: das Projekt überschreibt in
              src/styling/tokens.css `--container-3xl` mit 1920px (eine
              Bildschirmgrösse, nicht Tailwinds 48rem). Die Klasse hätte das
              Fenster also über die ganze Breite gezogen.

              Die zweite Grenze rechnet vom Bildschirm zurück: der Player ist
              16:9, also darf er nur so breit werden, dass diese Höhe plus
              Kopfzeile noch auf den Schirm passt. Ohne das schiebt ein
              flaches Fenster den Hinweis unter die Kante. */}
          <div
            className="relative w-full"
            style={{
              width: 'min(56rem, 100%)',
              maxWidth: 'calc((100dvh - 13rem) * 16 / 9)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between gap-4">
              <h2 className="text-base font-semibold text-white">{title}</h2>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pepe-gold)]"
                aria-label={labels.close}
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Eigene Dateien starten sofort: der Klick auf den Karten-Knopf war
                schon die Entscheidung, und es geht kein Byte an Dritte. Bei
                YouTube und Vimeo bleibt der Hinweis mit dem zweiten Klick. */}
            <TrailerPlayer
              trailer={trailer}
              poster={poster}
              title={title}
              labels={labels}
              privacyHref={privacyHref}
              autoStart
            />
          </div>
        </div>
      )}
    </>
  )
}
