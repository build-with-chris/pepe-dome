'use client'

/**
 * CourseScheduleGrid
 * Zwei Sichten auf dasselbe Kursangebot:
 *
 *   „Kurse"      — Katalog. Ein Kurs = eine Karte, egal wie oft er in der
 *                  Woche stattfindet. Luftakrobatik läuft viermal, taucht
 *                  hier aber einmal auf, mit allen Terminen darunter.
 *                  Das ist die Frage, mit der Leute ankommen: was gibt es
 *                  und passt das zu mir.
 *   „Wochenplan" — Zeitliche Übersicht als eine zusammenhängende Tabelle
 *                  statt sieben einzelner Kacheln. Beantwortet: wann kann
 *                  ich kommen.
 *
 * Die Zielgruppen-Legende ist kein reiner Farbschlüssel mehr, sondern
 * filtert beide Sichten.
 *
 * URL-Sharing: Beim Öffnen wird ?kurs=<slug> in die URL geschrieben
 * (per history.replaceState — keine Navigation). Beim Laden mit so einer
 * URL wird automatisch das passende Modal geöffnet.
 */

import { useEffect, useMemo, useState } from 'react'
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

/** Ein Wochentermin eines Kurses. */
export type Slot = { day: string; time: string }

/** Ein Kurs mit allen seinen Wochenterminen zusammengefasst. */
type KursGruppe = {
  key: string
  kurs: Kurs        // Repräsentant für Titel, Beschreibung, Modal
  slots: Slot[]
}

type View = 'kurse' | 'woche'
type Filter = Target | 'alle'

// ── Labels ───────────────────────────────────────────────────────────────
// Die Kurs-Detailtexte sind im MVP nur auf Deutsch (siehe training-data.ts),
// die UI-Chrome dieser Komponente lässt sich aber billig zweisprachig halten.

type Labels = {
  viewKurse: string
  viewWoche: string
  filterAlle: string
  filterKinder: string
  filterTeens: string
  filterErwachsene: string
  termineEiner: string
  termineMehrere: string
  details: string
  kursEiner: string
  kursMehrere: string
  leer: string
  leerReset: string
  hinweisA: string
  hinweisLink: string
  hinweisB: string
  detailsZu: (titel: string) => string
  gruppeFilter: string
  ansichtWechseln: string
}

const LABELS: Record<'de' | 'en', Labels> = {
  de: {
    viewKurse: 'Kurse',
    viewWoche: 'Wochenplan',
    filterAlle: 'Alle',
    filterKinder: 'Kinder',
    filterTeens: 'Teens',
    filterErwachsene: 'Erwachsene',
    termineEiner: 'Termin pro Woche',
    termineMehrere: 'Termine pro Woche',
    details: 'Details ansehen',
    kursEiner: 'Kurs',
    kursMehrere: 'Kurse',
    leer: 'Für diese Auswahl läuft gerade kein Kurs. Schau bei einer anderen Gruppe vorbei.',
    leerReset: 'Alle Kurse zeigen',
    hinweisA: 'Gebucht wird über das',
    hinweisLink: 'Eversports-Widget weiter unten',
    hinweisB: 'Klick auf einen Kurs für alle Details.',
    detailsZu: (t: string) => `Details zu ${t} anzeigen`,
    gruppeFilter: 'Nach Zielgruppe filtern',
    ansichtWechseln: 'Ansicht wechseln',
  },
  en: {
    viewKurse: 'Classes',
    viewWoche: 'Weekly plan',
    filterAlle: 'All',
    filterKinder: 'Kids',
    filterTeens: 'Teens',
    filterErwachsene: 'Adults',
    termineEiner: 'session per week',
    termineMehrere: 'sessions per week',
    details: 'View details',
    kursEiner: 'class',
    kursMehrere: 'classes',
    leer: 'No class runs for this selection right now. Have a look at another group.',
    leerReset: 'Show all classes',
    hinweisA: 'Booking runs through the',
    hinweisLink: 'Eversports widget below',
    hinweisB: 'Click a class for all the details.',
    detailsZu: (t: string) => `Show details for ${t}`,
    gruppeFilter: 'Filter by age group',
    ansichtWechseln: 'Switch view',
  },
}

/** Lange Tagesnamen auf Kürzel, für die Termin-Zeilen in den Kurs-Karten. */
const SHORT_DAY: Record<string, string> = {
  Montag: 'Mo', Dienstag: 'Di', Mittwoch: 'Mi', Donnerstag: 'Do',
  Freitag: 'Fr', Samstag: 'Sa', Sonntag: 'So',
  Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed', Thursday: 'Thu',
  Friday: 'Fri', Saturday: 'Sat', Sunday: 'Sun',
}

const shortDay = (day: string) => SHORT_DAY[day] ?? day.slice(0, 2)

// ── Zielgruppen-Badge ────────────────────────────────────────────────────

function TargetBadge({ target, label }: { target: Target; label: string }) {
  const c = COLORS[target]
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap"
      style={{ backgroundColor: c.bg, color: c.dot, border: `1px solid ${c.border}` }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.dot }} aria-hidden="true" />
      {label}
    </span>
  )
}

// ── Kurs-Karte für die Katalog-Ansicht ───────────────────────────────────
// Ein Kurs, alle seine Wochentermine. Die ganze Karte ist der Button.

function KursKarte({
  gruppe,
  onClick,
  t,
  targetLabel,
}: {
  gruppe: KursGruppe
  onClick: () => void
  t: Labels
  targetLabel: string
}) {
  const { kurs, slots } = gruppe
  const c = COLORS[kurs.target]

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={t.detailsZu(kurs.title)}
      className="group h-full w-full text-left rounded-2xl bg-[var(--pepe-ink)] border border-[var(--pepe-line)] p-5 md:p-6 flex flex-col gap-4 transition-all duration-200 hover:border-[var(--pepe-line-light)] hover:bg-[var(--pepe-surface)]/70 focus:outline-none focus:ring-2 focus:ring-[var(--pepe-gold)] cursor-pointer"
      style={{ borderTop: `3px solid ${c.dot}` }}
    >
      {/* Kopf: Zielgruppe + Titel */}
      <div>
        <TargetBadge target={kurs.target} label={targetLabel} />
        <h4 className="text-[var(--pepe-white)] font-bold text-lg md:text-xl leading-tight mt-3 group-hover:text-[var(--pepe-accent-text)] transition-colors">
          {kurs.title}
        </h4>
        {kurs.sub && (
          <p className="text-[var(--pepe-t64)] text-sm leading-snug mt-1">{kurs.sub}</p>
        )}
      </div>

      {/* Termine — untereinander, Zeiten in einer Spalte ausgerichtet */}
      <div className="mt-auto">
        <p className="text-[var(--pepe-t48)] text-[10px] font-bold uppercase tracking-widest mb-2">
          {slots.length} {slots.length === 1 ? t.termineEiner : t.termineMehrere}
        </p>
        <ul className="space-y-1">
          {slots.map((s, i) => (
            <li key={i} className="flex items-baseline gap-3 text-sm">
              <span
                className="font-bold tabular-nums w-8 flex-shrink-0"
                style={{ color: c.dot }}
              >
                {shortDay(s.day)}
              </span>
              <span className="text-[var(--pepe-t80)] tabular-nums">{s.time}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Fuß */}
      <span className="text-[var(--pepe-t48)] text-xs font-semibold group-hover:text-[var(--pepe-accent-text)] transition-colors">
        {t.details}
        <span className="inline-block ml-1 group-hover:translate-x-0.5 transition-transform" aria-hidden="true">
          →
        </span>
      </span>
    </button>
  )
}

// ── Kurs-Zeile für den Wochenplan ────────────────────────────────────────
// Single-Row Layout: [Farbbalken] [Zeit] [Titel + Sub] [›]

function KursZeile({ kurs, onClick }: { kurs: Kurs; onClick: () => void }) {
  const c = COLORS[kurs.target]
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left rounded-lg px-3 py-2.5 transition-colors duration-150 hover:bg-[var(--pepe-surface)]/70 focus:outline-none focus:ring-2 focus:ring-[var(--pepe-gold)] cursor-pointer group"
      style={{ borderLeft: `3px solid ${c.dot}` }}
      aria-label={`Details zu ${kurs.title} anzeigen`}
    >
      <div className="flex items-center gap-3 sm:gap-5">
        <span className="text-[var(--pepe-t80)] text-xs font-bold tabular-nums whitespace-nowrap w-[6.5rem] flex-shrink-0">
          {kurs.time}
        </span>

        <div className="flex-1 min-w-0">
          <p className="text-[var(--pepe-white)] font-semibold text-sm leading-snug group-hover:text-[var(--pepe-accent-text)] transition-colors">
            {kurs.title}
          </p>
          {/* Kein truncate: auf dem Handy wurde sonst aus „mit Aircrobatics"
              ein „mit Airc…". Lieber umbrechen. */}
          {kurs.sub && (
            <p className="text-[var(--pepe-t48)] text-xs leading-snug">{kurs.sub}</p>
          )}
        </div>

        <span
          className="text-[var(--pepe-t48)] text-sm flex-shrink-0 group-hover:text-[var(--pepe-accent-text)] group-hover:translate-x-0.5 transition-all"
          aria-hidden="true"
        >
          ›
        </span>
      </div>
    </button>
  )
}

// ── Termin-Liste (konkrete Daten, z.B. Schnupper-Termine) ────────────────

function TerminListe({ termine, titel }: { termine: Termin[]; titel?: string }) {
  return (
    <div className="mt-3 pt-3 border-t border-[var(--pepe-line2)]">
      <p className="text-[var(--pepe-t64)] text-[10px] uppercase tracking-widest font-bold mb-2">
        {titel ?? 'Termine'}
      </p>
      <ul className="space-y-2">
        {termine.map((t, i) =>
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
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <span className="text-[var(--pepe-accent-text)] font-bold tabular-nums text-sm">
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
                  <p className="text-[var(--pepe-accent-text)] text-xs font-medium mt-1 leading-snug">
                    {t.sub}
                  </p>
                )}
              </div>
            </li>
          ) : (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span className="text-[var(--pepe-t80)] font-bold tabular-nums whitespace-nowrap w-14 flex-shrink-0">
                {t.date}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[var(--pepe-white)] leading-snug">
                  {t.title}
                  {t.trainer && <span className="text-[var(--pepe-t48)]"> · {t.trainer}</span>}
                </p>
                {t.sub && (
                  <p className="text-[var(--pepe-t48)] text-xs mt-0.5 italic leading-snug">{t.sub}</p>
                )}
              </div>
            </li>
          )
        )}
      </ul>
    </div>
  )
}

// ── Wochenplan: eine durchgehende Tabelle statt sieben Kacheln ───────────

function WochenTabelle({
  woche,
  onKursClick,
  t,
}: {
  woche: Tag[]
  onKursClick: (k: Kurs) => void
  t: Labels
}) {
  return (
    <div className="rounded-2xl border border-[var(--pepe-line)] bg-[var(--pepe-ink)] overflow-hidden">
      {woche.map((tag, index) => {
        const hasKurse = tag.kurse.length > 0
        return (
          <div
            key={tag.day}
            className={`sm:grid sm:grid-cols-[11rem_1fr] ${
              index > 0 ? 'border-t border-[var(--pepe-line)]' : ''
            } ${hasKurse ? '' : 'bg-[var(--pepe-surface)]/25'}`}
          >
            {/* Tagesspalte */}
            <div className="px-4 sm:px-5 pt-4 sm:py-5 sm:border-r sm:border-[var(--pepe-line)] flex sm:block items-baseline gap-3">
              <h4
                className={`font-bold text-sm uppercase tracking-wider ${
                  hasKurse ? 'text-[var(--pepe-white)]' : 'text-[var(--pepe-t48)]'
                }`}
              >
                {tag.day}
              </h4>
              {hasKurse && (
                <p className="text-[var(--pepe-t48)] text-[10px] font-bold uppercase tracking-widest sm:mt-1">
                  {tag.kurse.length} {tag.kurse.length === 1 ? t.kursEiner : t.kursMehrere}
                </p>
              )}
            </div>

            {/* Kursspalte */}
            <div className="px-2 sm:px-3 pb-4 pt-2 sm:py-3">
              {hasKurse ? (
                <div className="space-y-1">
                  {tag.kurse.map((kurs) => (
                    <KursZeile key={kurs.slug} kurs={kurs} onClick={() => onKursClick(kurs)} />
                  ))}
                </div>
              ) : (
                <p className="text-[var(--pepe-t48)] text-sm italic px-1 sm:py-1.5">
                  {tag.note ?? '—'}
                </p>
              )}

              {tag.termine && tag.termine.length > 0 && (
                <div className="px-1">
                  <TerminListe termine={tag.termine} titel={tag.termineTitel} />
                </div>
              )}

              {hasKurse && tag.note && (
                <p className="text-[var(--pepe-t48)] text-xs italic px-1 mt-2.5">{tag.note}</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Haupt-Komponente ─────────────────────────────────────────────────────

export default function CourseScheduleGrid({
  woche,
  lang = 'de',
}: {
  woche: Tag[]
  lang?: 'de' | 'en'
}) {
  const t = LABELS[lang]
  const [view, setView] = useState<View>('kurse')
  const [filter, setFilter] = useState<Filter>('alle')
  const [selectedKurs, setSelectedKurs] = useState<Kurs | null>(null)
  const [selectedSlots, setSelectedSlots] = useState<Slot[] | undefined>(undefined)

  // Flachgelegte Kurs-Liste für Slug-Lookup
  const allKurse = useMemo(() => woche.flatMap((tag) => tag.kurse), [woche])

  // Gleiche Kurse zusammenfassen: Luftakrobatik läuft viermal in der Woche,
  // ist für Besucher:innen aber ein Angebot, kein Vierfaches.
  const gruppen = useMemo<KursGruppe[]>(() => {
    const map = new Map<string, KursGruppe>()
    for (const tag of woche) {
      for (const kurs of tag.kurse) {
        const key = `${kurs.title}|${kurs.trainer}|${kurs.target}`
        const existing = map.get(key)
        if (existing) {
          existing.slots.push({ day: tag.day, time: kurs.time })
        } else {
          map.set(key, { key, kurs, slots: [{ day: tag.day, time: kurs.time }] })
        }
      }
    }
    return [...map.values()]
  }, [woche])

  // Anzahl pro Zielgruppe für die Filter-Chips
  const counts = useMemo(() => {
    const base = { alle: gruppen.length, kinder: 0, teens: 0, erwachsene: 0 }
    for (const g of gruppen) base[g.kurs.target] += 1
    return base
  }, [gruppen])

  const sichtbareGruppen =
    filter === 'alle' ? gruppen : gruppen.filter((g) => g.kurs.target === filter)

  // Wochenplan gefiltert. Tage ohne Treffer fliegen raus, solange gefiltert
  // wird — sonst stehen bei „Kinder" fünf leere Zeilen im Plan.
  const sichtbareWoche = useMemo(() => {
    if (filter === 'alle') return woche
    return woche
      .map((tag) => ({ ...tag, kurse: tag.kurse.filter((k) => k.target === filter) }))
      .filter((tag) => tag.kurse.length > 0)
  }, [woche, filter])

  const nichtsGefunden =
    filter !== 'alle' && (view === 'kurse' ? sichtbareGruppen.length === 0 : sichtbareWoche.length === 0)

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
          setSelectedSlots(undefined)
          return
        }
      }
      setSelectedKurs(null)
      setSelectedSlots(undefined)
    }
    syncFromUrl()
    window.addEventListener('popstate', syncFromUrl)
    return () => window.removeEventListener('popstate', syncFromUrl)
    // allKurse bewusst nicht in deps — Daten sind statisch nach Mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Modal öffnen → URL aktualisieren (ohne Navigation)
  const openKurs = (kurs: Kurs, slots?: Slot[]) => {
    setSelectedKurs(kurs)
    setSelectedSlots(slots)
    const url = new URL(window.location.href)
    url.searchParams.set('kurs', kurs.slug)
    window.history.replaceState({}, '', url.toString())
  }

  // Modal schließen → URL säubern
  const closeKurs = () => {
    setSelectedKurs(null)
    setSelectedSlots(undefined)
    const url = new URL(window.location.href)
    url.searchParams.delete('kurs')
    window.history.replaceState({}, '', url.toString())
  }

  // Smooth-Scroll zum Buchungs-Widget
  const scrollToBuchung = () => {
    const target = document.getElementById('buchung')
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const targetLabel: Record<Target, string> = {
    kinder: t.filterKinder,
    teens: t.filterTeens,
    erwachsene: t.filterErwachsene,
  }

  const filterChips: { value: Filter; label: string; count: number; dot?: string }[] = [
    { value: 'alle',       label: t.filterAlle,       count: counts.alle },
    { value: 'kinder',     label: t.filterKinder,     count: counts.kinder,     dot: COLORS.kinder.dot },
    { value: 'teens',      label: t.filterTeens,      count: counts.teens,      dot: COLORS.teens.dot },
    { value: 'erwachsene', label: t.filterErwachsene, count: counts.erwachsene, dot: COLORS.erwachsene.dot },
  ]

  return (
    <>
      {/* ── Steuerleiste: Ansicht + Zielgruppen-Filter ── */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-6">
        {/* Ansicht wechseln */}
        <div
          className="inline-flex self-start rounded-full border border-[var(--pepe-line)] bg-[var(--pepe-ink)] p-1"
          role="group"
          aria-label={t.ansichtWechseln}
        >
          {([
            { value: 'kurse' as View, label: t.viewKurse },
            { value: 'woche' as View, label: t.viewWoche },
          ]).map((option) => {
            const active = view === option.value
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setView(option.value)}
                aria-pressed={active}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--pepe-gold)] cursor-pointer ${
                  active
                    ? 'bg-[var(--pepe-gold)] text-white'
                    : 'text-[var(--pepe-t64)] hover:text-[var(--pepe-white)]'
                }`}
              >
                {option.label}
              </button>
            )
          })}
        </div>

        {/* Zielgruppen-Filter — früher nur Legende, jetzt anklickbar */}
        <div className="flex flex-wrap gap-2" role="group" aria-label={t.gruppeFilter}>
          {filterChips.map((chip) => {
            const active = filter === chip.value
            return (
              <button
                key={chip.value}
                type="button"
                onClick={() => setFilter(chip.value)}
                aria-pressed={active}
                disabled={chip.count === 0}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-medium border transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--pepe-gold)] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                  active
                    ? 'bg-[var(--pepe-surface)] border-[var(--pepe-line-light)] text-[var(--pepe-white)]'
                    : 'bg-transparent border-[var(--pepe-line)] text-[var(--pepe-t64)] hover:text-[var(--pepe-white)] hover:border-[var(--pepe-line-light)]'
                }`}
              >
                {chip.dot && (
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: chip.dot }}
                    aria-hidden="true"
                  />
                )}
                {chip.label}
                <span className="text-[var(--pepe-t48)] tabular-nums text-xs">{chip.count}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Buchungs-Hinweis, dezent ── */}
      <p className="text-[var(--pepe-t64)] text-sm mb-6">
        {t.hinweisA}{' '}
        <button
          type="button"
          onClick={scrollToBuchung}
          className="text-[var(--pepe-accent-text)] font-semibold underline-offset-2 hover:underline cursor-pointer"
        >
          {t.hinweisLink}
        </button>
        . {t.hinweisB}
      </p>

      {/* ── Inhalt ── */}
      {nichtsGefunden ? (
        <div className="rounded-2xl border border-[var(--pepe-line)] bg-[var(--pepe-ink)] px-6 py-12 text-center">
          <p className="text-[var(--pepe-t64)] mb-4">{t.leer}</p>
          <button
            type="button"
            onClick={() => setFilter('alle')}
            className="text-[var(--pepe-accent-text)] font-semibold hover:underline cursor-pointer"
          >
            {t.leerReset}
          </button>
        </div>
      ) : view === 'kurse' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {sichtbareGruppen.map((gruppe) => (
            <KursKarte
              key={gruppe.key}
              gruppe={gruppe}
              t={t}
              targetLabel={targetLabel[gruppe.kurs.target]}
              onClick={() => openKurs(gruppe.kurs, gruppe.slots)}
            />
          ))}
        </div>
      ) : (
        <WochenTabelle woche={sichtbareWoche} onKursClick={(k) => openKurs(k)} t={t} />
      )}

      <CourseDetailModal kurs={selectedKurs} slots={selectedSlots} onClose={closeKurs} />
    </>
  )
}
