'use client'

/**
 * CourseScheduleGrid
 * Interaktives Raster mit allen Kurs-Tagen.
 * Klick auf eine Kurskarte öffnet ein Detail-Modal mit Anmeldeformular.
 */

import { useState } from 'react'
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
}

export type Termin = {
  date: string       // "03.05.2026" oder "03.05."
  title: string      // z.B. "Schnupperkurs Doppelstäbe"
  trainer?: string   // z.B. "Tina"
  sub?: string       // z.B. "Spendenbasis 5–15 €"
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
          <ul className="space-y-2.5">
            {tag.termine.map((t, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="text-[var(--pepe-gold)] font-bold tabular-nums whitespace-nowrap pt-px">
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
            ))}
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

  const tageMitKursen = woche.filter((t) => t.kurse.length > 0)
  const tageOhneKurse = woche.filter((t) => t.kurse.length === 0)

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
        {tageMitKursen.map((tag) => (
          <TagKarte key={tag.day} tag={tag} onKursClick={setSelectedKurs} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        {tageOhneKurse.map((tag) => (
          <TagKarte key={tag.day} tag={tag} onKursClick={setSelectedKurs} />
        ))}
      </div>

      <CourseDetailModal
        kurs={selectedKurs}
        onClose={() => setSelectedKurs(null)}
      />
    </>
  )
}
