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

// ── Kurs-Karte (klickbar) ───────────────────────────────────────────────

function KursKarte({ kurs, onClick }: { kurs: Kurs; onClick: () => void }) {
  const c = COLORS[kurs.target]
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left rounded-xl p-4 transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--pepe-gold)] cursor-pointer"
      style={{ border: `1px solid ${c.border}`, backgroundColor: c.bg }}
      aria-label={`Details zu ${kurs.title} anzeigen`}
    >
      <div className="flex items-center gap-2.5 mb-2">
        <span
          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: c.dot }}
        />
        <span className="text-[var(--pepe-t64)] text-xs font-semibold tracking-wide">
          {kurs.time}
        </span>
      </div>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <p className="text-[var(--pepe-white)] font-bold text-base leading-snug">{kurs.title}</p>
          {kurs.sub && (
            <p className="text-[var(--pepe-t48)] text-sm mt-1 leading-snug">{kurs.sub}</p>
          )}
        </div>
        <span className="text-[var(--pepe-t48)] text-xs mt-1 flex-shrink-0" aria-hidden="true">
          ›
        </span>
      </div>
    </button>
  )
}

// ── Tag-Karte ────────────────────────────────────────────────────────────

function TagKarte({ tag, onKursClick }: { tag: Tag; onKursClick: (k: Kurs) => void }) {
  const hasKurse = tag.kurse.length > 0
  return (
    <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-[var(--pepe-line)] flex items-center justify-between">
        <div>
          <h4 className="text-[var(--pepe-white)] font-bold text-lg">{tag.day}</h4>
          {tag.trainer && (
            <p className="text-[var(--pepe-t48)] text-sm mt-0.5">mit {tag.trainer}</p>
          )}
        </div>
        {hasKurse && (
          <span className="text-[var(--pepe-t48)] text-xs font-medium">
            {tag.kurse.length} {tag.kurse.length === 1 ? 'Kurs' : 'Kurse'}
          </span>
        )}
      </div>

      {hasKurse && (
        <div className="p-4 space-y-3">
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

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
        {tageMitKursen.map((tag) => (
          <TagKarte key={tag.day} tag={tag} onKursClick={openKurs} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        {tageOhneKurse.map((tag) => (
          <TagKarte key={tag.day} tag={tag} onKursClick={openKurs} />
        ))}
      </div>

      <CourseDetailModal kurs={selectedKurs} onClose={closeKurs} />
    </>
  )
}
