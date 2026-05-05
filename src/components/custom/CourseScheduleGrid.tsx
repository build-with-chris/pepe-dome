'use client'

/**
 * CourseScheduleGrid
 * Interaktives Raster mit allen Kurs-Tagen.
 * Klick auf eine Kurskarte öffnet ein Detail-Modal mit Anmeldeformular.
 *
 * URL-Sharing: Beim Öffnen wird ?kurs=<slug> in die URL geschrieben
 * (per history.replaceState — keine Navigation). Beim Laden mit so einer
 * URL wird automatisch das passende Modal geöffnet.
 */

import { useEffect, useState } from 'react'
import CourseDetailModal from './CourseDetailModal'

// ── Typen ────────────────────────────────────────────────────────────────

const COLORS = {
  kinder:     { dot: '#c4a767', border: 'rgba(196,167,103,0.45)', bg: 'rgba(196,167,103,0.08)' },
  teens:      { dot: '#f59e0b', border: 'rgba(245,158,11,0.45)',  bg: 'rgba(245,158,11,0.08)' },
  erwachsene: { dot: '#38bdf8', border: 'rgba(56,189,248,0.45)',  bg: 'rgba(56,189,248,0.08)' },
} as const

export type Target = keyof typeof COLORS

export type Kurs = {
  slug: string
  time: string
  title: string
  sub?: string
  target: Target
  trainer: string
  day: string
  description: string
  inhalte: string[]
  fuerWen: string
  termine?: Termin[]       // optional: konkrete Datums-Liste (Sonntags-Flow-Arts)
  termineTitel?: string    // Überschrift für die Termin-Liste im Modal
  /** Wenn gesetzt: Buchung läuft NICHT über Eversports, sondern hier direkt
   *  (https://… oder mailto:…). Im Modal erscheint dann der entsprechende Button. */
  bookingUrl?: string
  /** Optionaler Button-Label für bookingUrl (Default: „Direkt buchen"). */
  bookingLabel?: string
  /** Optionaler Hinweistext über dem Buchungs-Button im Modal. */
  bookingNote?: string
}

export type Termin = {
  date: string       // "03.05.2026" oder "03.05."
  title: string      // z.B. "Schnupperkurs Doppelstäbe"
  trainer?: string   // z.B. "Tina"
  sub?: string       // z.B. "Spendenbasis 5–15 €"
  highlight?: boolean // visuell hervorheben (Gold-Akzent + Badge)
  badge?: string     // z.B. "Schnuppern" oder "Spendenbasis"
}

export type Tag = {
  day: string
  trainer: string
  kurse: Kurs[]
  note?: string
  termine?: Termin[]
  termineTitel?: string  // Überschrift für die Termine-Liste
}

// ── Kurs-Karte (kompakt, klickbar) ──────────────────────────────────────
// Single-Row Layout: [● Dot] [Zeit] [Titel + Sub] [→]

function KursKarte({ kurs, onClick }: { kurs: Kurs; onClick: () => void }) {
  const c = COLORS[kurs.target]
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left rounded-lg px-3 py-2.5 transition-all duration-150 hover:bg-[var(--pepe-surface)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--pepe-gold)] cursor-pointer group"
      style={{ borderLeft: `3px solid ${c.dot}` }}
      aria-label={`Details zu ${kurs.title} anzeigen`}
    >
      <div className="flex items-center gap-3">
        {/* Zeit */}
        <span className="text-[var(--pepe-t80)] text-xs font-bold tabular-nums whitespace-nowrap min-w-[5.5rem]">
          {kurs.time}
        </span>

        {/* Titel + optionaler Sub */}
        <div className="flex-1 min-w-0">
          <p className="text-[var(--pepe-white)] font-semibold text-sm leading-snug truncate group-hover:text-[var(--pepe-gold)] transition-colors">
            {kurs.title}
          </p>
          {kurs.sub && (
            <p className="text-[var(--pepe-t48)] text-xs leading-snug truncate">
              {kurs.sub}
            </p>
          )}
        </div>

        {/* Chevron */}
        <span
          className="text-[var(--pepe-t48)] text-sm flex-shrink-0 group-hover:text-[var(--pepe-gold)] group-hover:translate-x-0.5 transition-all"
          aria-hidden="true"
        >
          ›
        </span>
      </div>
    </button>
  )
}

// ── Tag-Karte (kompakt) ─────────────────────────────────────────────────

function TagKarte({ tag, onKursClick }: { tag: Tag; onKursClick: (k: Kurs) => void }) {
  const hasKurse = tag.kurse.length > 0
  return (
    <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-xl overflow-hidden">
      {/* Tag-Header — kompakt */}
      <div className="px-4 py-2.5 border-b border-[var(--pepe-line)] flex items-baseline justify-between gap-3 bg-[var(--pepe-surface)]/40">
        <h4 className="text-[var(--pepe-white)] font-bold text-base uppercase tracking-wide">
          {tag.day}
        </h4>
        {hasKurse && (
          <span className="text-[var(--pepe-t48)] text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
            {tag.kurse.length} {tag.kurse.length === 1 ? 'Kurs' : 'Kurse'}
          </span>
        )}
      </div>

      {hasKurse && (
        <div className="p-2 space-y-1">
          {tag.kurse.map((kurs) => (
            <KursKarte key={kurs.slug} kurs={kurs} onClick={() => onKursClick(kurs)} />
          ))}
        </div>
      )}

      {tag.termine && tag.termine.length > 0 && (
        <div className="px-5 py-4 border-t border-[var(--pepe-line)] bg-[var(--pepe-surface)]/40">
          <p className="text-[var(--pepe-t64)] text-xs uppercase tracking-wider font-bold mb-3">
            {tag.termineTitel ?? 'Termine'}
          </p>
          <ul className="space-y-2">
            {tag.termine.map((t, i) =>
              t.highlight ? (
                // Hervorgehobener Termin: eigene Karte mit Gold-Akzent + Badge
                <li key={i}>
                  <div
                    className="rounded-lg p-3 mb-1"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(196,167,103,0.18), rgba(196,167,103,0.06))',
                      border: '1px solid rgba(196,167,103,0.45)',
                    }}
                  >
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <span className="text-[var(--pepe-gold)] font-bold tabular-nums">
                        {t.date}
                      </span>
                      {t.badge && (
                        <span
                          className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest"
                          style={{
                            backgroundColor: 'var(--pepe-gold)',
                            color: 'var(--pepe-black)',
                          }}
                        >
                          {t.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[var(--pepe-white)] font-semibold leading-snug">
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
                // Standard-Eintrag (kompakt)
                <li key={i} className="flex items-start gap-3 text-sm py-1">
                  <span className="text-[var(--pepe-t80)] font-bold tabular-nums whitespace-nowrap pt-px min-w-[3.5rem]">
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

      {tag.note && (
        <div className="px-5 py-5">
          <p className="text-[var(--pepe-t48)] text-sm italic">{tag.note}</p>
        </div>
      )}
    </div>
  )
}

// ── Haupt-Komponente ─────────────────────────────────────────────────────

export default function CourseScheduleGrid({ woche }: { woche: Tag[] }) {
  const [selectedKurs, setSelectedKurs] = useState<Kurs | null>(null)

  // Flachgelegte Kurs-Liste für Slug-Lookup
  const allKurse = woche.flatMap((t) => t.kurse)

  // ── URL ←→ Modal-State Synchronisation ────────────────────────────────
  // Beim Mount: prüfen ob ?kurs=<slug> in der URL steht und entsprechend
  // das Modal öffnen. Außerdem auf Browser-Back/Forward (popstate) reagieren.
  useEffect(() => {
    const syncFromUrl = () => {
      const params = new URLSearchParams(window.location.search)
      const slug = params.get('kurs')
      if (slug) {
        const found = allKurse.find((k) => k.slug === slug)
        if (found) {
          setSelectedKurs(found)
          return
        }
      }
      setSelectedKurs(null)
    }
    syncFromUrl()
    window.addEventListener('popstate', syncFromUrl)
    return () => window.removeEventListener('popstate', syncFromUrl)
    // allKurse bewusst nicht in deps — Daten sind statisch nach Mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Modal öffnen → URL aktualisieren (ohne Navigation)
  const openKurs = (kurs: Kurs) => {
    setSelectedKurs(kurs)
    const url = new URL(window.location.href)
    url.searchParams.set('kurs', kurs.slug)
    window.history.replaceState({}, '', url.toString())
  }

  // Modal schließen → URL säubern
  const closeKurs = () => {
    setSelectedKurs(null)
    const url = new URL(window.location.href)
    url.searchParams.delete('kurs')
    window.history.replaceState({}, '', url.toString())
  }

  const tageMitKursen = woche.filter((t) => t.kurse.length > 0)
  const tageOhneKurse = woche.filter((t) => t.kurse.length === 0)

  // Smooth-Scroll zum Buchungs-Widget
  const scrollToBuchung = () => {
    const target = document.getElementById('buchung')
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      {/* Globaler Eversports-Hinweis */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="flex items-center gap-3 rounded-xl bg-[var(--pepe-gold)]/10 border border-[var(--pepe-gold)]/30 px-4 py-3 text-sm">
          <span className="text-xl leading-none flex-shrink-0" aria-hidden="true">🎟</span>
          <p className="text-[var(--pepe-t80)] flex-1">
            Alle Kurse buchst du direkt über das{' '}
            <button
              type="button"
              onClick={scrollToBuchung}
              className="text-[var(--pepe-gold)] font-bold underline-offset-2 hover:underline"
            >
              Eversports-Widget oben
            </button>
            . Klick auf einen Kurs für Details.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
        {tageMitKursen.map((tag) => (
          <TagKarte key={tag.day} tag={tag} onKursClick={openKurs} />
        ))}
      </div>

      {tageOhneKurse.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {tageOhneKurse.map((tag) => (
            <TagKarte key={tag.day} tag={tag} onKursClick={openKurs} />
          ))}
        </div>
      )}

      <CourseDetailModal kurs={selectedKurs} onClose={closeKurs} />
    </>
  )
}
