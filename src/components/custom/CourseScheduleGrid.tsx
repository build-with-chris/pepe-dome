'use client'

/**
 * CourseScheduleGrid
 * Zwei Sichten auf dasselbe Kursangebot:
 *
 *   „Kurse"      — Katalog. Ein Kurs = eine Karte, egal wie oft er in der
 *                  Woche stattfindet. Das ist die Frage, mit der Leute
 *                  ankommen: was gibt es und passt das zu mir.
 *   „Wochenplan" — Beantwortet: wann kann ich kommen. Pro Wochentag ein
 *                  Abschnitt mit Kurskacheln. Bewusst keine Tabelle mehr:
 *                  feste Zeitspalten lasen sich wie ein Fahrplan, und ein
 *                  Kursprogramm soll Lust machen statt Auskunft geben.
 *
 * Die Zielgruppen-Legende ist kein reiner Farbschlüssel, sondern filtert
 * beide Sichten.
 *
 * Die Daten kommen fertig gruppiert aus src/lib/db-courses.ts. Früher lagen
 * die Kurse tagweise und mehrfach vor und wurden hier zusammengefasst; seit
 * sie in der Datenbank stehen, ist ein Kurs eine Zeile mit mehreren Terminen.
 *
 * URL-Sharing: Beim Öffnen wird ?kurs=<slug> in die URL geschrieben
 * (per history.replaceState — keine Navigation). Beim Laden mit so einer
 * URL wird automatisch das passende Modal geöffnet.
 */

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import CourseDetailModal from './CourseDetailModal'
import {
  kartenBild,
  resolveSlug,
  weekdayAdverb,
  weekdayName,
  zeitspanne,
  type Kurs,
  type Kursprogramm,
  type Slot,
  type Tag,
  type Target,
} from '@/lib/course-types'

// ── Farben ───────────────────────────────────────────────────────────────

const COLORS: Record<Target, { dot: string; border: string; bg: string }> = {
  kinder:     { dot: '#c4a767', border: 'rgba(196,167,103,0.45)', bg: 'rgba(196,167,103,0.08)' },
  teens:      { dot: '#f59e0b', border: 'rgba(245,158,11,0.45)',  bg: 'rgba(245,158,11,0.08)' },
  erwachsene: { dot: '#38bdf8', border: 'rgba(56,189,248,0.45)',  bg: 'rgba(56,189,248,0.08)' },
}

type View = 'kurse' | 'woche'
type Filter = Target | 'alle'

// ── Labels ───────────────────────────────────────────────────────────────
// Die Kursinhalte selbst sind nur auf Deutsch gepflegt, die Oberfläche
// dieser Komponente lässt sich aber billig zweisprachig halten.

type Labels = {
  viewKurse: string
  viewWoche: string
  filterAlle: string
  filterKinder: string
  filterTeens: string
  filterErwachsene: string
  details: string
  mit: string
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
    // „Jugendliche" statt „Teens": die Kursdaten sprechen so, und es klingt
    // für Eltern weniger nach Marketing.
    filterTeens: 'Jugendliche',
    filterErwachsene: 'Erwachsene',
    details: 'Mehr über den Kurs',
    mit: 'mit',
    kursEiner: 'Kurs',
    kursMehrere: 'Kurse',
    leer: 'Für diese Auswahl läuft gerade kein Kurs. Schau gern bei einer anderen Gruppe vorbei.',
    leerReset: 'Alle Kurse zeigen',
    hinweisA: 'Klick auf einen Kurs, dann siehst du alles dazu. Gebucht wird weiter unten über das',
    hinweisLink: 'Eversports-Widget',
    hinweisB: 'Schnuppern geht jederzeit.',
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
    details: 'More about this class',
    mit: 'with',
    kursEiner: 'class',
    kursMehrere: 'classes',
    leer: 'No class runs for this selection right now. Feel free to look at another group.',
    leerReset: 'Show all classes',
    hinweisA: 'Click a class to see everything about it. Booking happens below through the',
    hinweisLink: 'Eversports widget',
    hinweisB: 'You can always come try a session first.',
    detailsZu: (t: string) => `Show details for ${t}`,
    gruppeFilter: 'Filter by age group',
    ansichtWechseln: 'Switch view',
  },
}

// ── Textaufbereitung ────────────────────────────────────────────────────

/**
 * Macht aus den Wochenterminen lesbare Zeilen, eine pro Tag:
 *   ein Termin  → „Dienstags, 16:15 bis 17:15 Uhr"
 *   mehrere     → „Montags, 17:15 und 18:15 Uhr"
 *
 * Bei mehreren Terminen am selben Tag stehen nur die Startzeiten, sonst wird
 * die Zeile unlesbar lang. Die vollständigen Zeitfenster stehen im Modal.
 */
function zeitenProTag(slots: Slot[], lang: 'de' | 'en'): string[] {
  const proTag = new Map<number, Slot[]>()
  for (const slot of slots) {
    const liste = proTag.get(slot.weekday)
    if (liste) liste.push(slot)
    else proTag.set(slot.weekday, [slot])
  }

  return [...proTag.entries()].map(([weekday, tagesSlots]) => {
    const label = weekdayAdverb(weekday, lang)
    if (tagesSlots.length === 1) {
      const spanne = zeitspanne(tagesSlots[0], lang)
      return lang === 'de' ? `${label}, ${spanne} Uhr` : `${label}, ${spanne}`
    }
    const starts = tagesSlots.map((slot) => slot.startTime)
    const letzte = starts[starts.length - 1]
    const davor = starts.slice(0, -1).join(', ')
    const verbunden = lang === 'de' ? `${davor} und ${letzte}` : `${davor} and ${letzte}`
    return lang === 'de' ? `${label}, ${verbunden} Uhr` : `${label}, ${verbunden}`
  })
}

/**
 * Erster Satz der Kursbeschreibung, als Vorgeschmack auf der Karte.
 *
 * Doppelpunkt zählt als Ende: mehrere Beschreibungen führen erst lang ein
 * und zählen dann nach einem „:" auf. Der Teil davor ist genau der Satz,
 * der auf die Karte gehört.
 */
function ersterSatz(text: string): string {
  const match = text.match(/^[\s\S]*?[.!?:](?=\s|$)/)
  const satz = (match ? match[0] : text).trim().replace(/:$/, '.')
  // Auf der Karte reicht ein Vorgeschmack. Kuerzer als das Zeilenlimit der
  // Karte, damit der Text an einer Wortgrenze endet statt am CSS-Abschnitt.
  if (satz.length <= 130) return satz
  const hart = satz.slice(0, 128)
  const grenze = hart.lastIndexOf(' ')
  return (grenze > 90 ? hart.slice(0, grenze) : hart).trimEnd() + '…'
}

// ── Kurs-Karte für die Katalog-Ansicht ───────────────────────────────────

function KursKarte({
  kurs,
  onClick,
  t,
  targetLabel,
  lang,
}: {
  kurs: Kurs
  onClick: () => void
  t: Labels
  targetLabel: string
  lang: 'de' | 'en'
}) {
  const c = COLORS[kurs.target]
  const zeilen = zeitenProTag(kurs.slots, lang)
  const bild = kartenBild(kurs)

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={t.detailsZu(kurs.title)}
      className="group h-full w-full text-left rounded-3xl bg-[var(--pepe-ink)] border border-[var(--pepe-line)] overflow-hidden flex flex-col transition-all duration-200 hover:border-[var(--pepe-line-light)] hover:bg-[var(--pepe-surface)]/60 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[var(--pepe-gold)] cursor-pointer"
    >
      {/* Bildbereich. Kurse ohne Foto bekommen ein ruhiges Farbband in der
          Kursfarbe statt eines fremden Fotos: die Karten behalten dieselbe
          Höhe, und niemand sieht ein Bild, das den Kurs nicht zeigt. */}
      <div className="relative w-full aspect-[4/3] bg-[var(--pepe-surface)] overflow-hidden">
        {bild ? (
          <Image
            src={bild.url}
            alt={bild.alt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(120% 90% at 50% 0%, ${c.bg}, transparent 70%), linear-gradient(160deg, ${c.bg}, transparent)`,
            }}
            aria-hidden="true"
          />
        )}
        {/* Verlauf nach unten, damit der Kartenrand nicht hart abschneidet */}
        <div
          className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
          style={{ background: 'linear-gradient(to top, var(--pepe-ink), transparent)' }}
          aria-hidden="true"
        />
      </div>

      <div className="p-6 md:p-7 flex flex-col gap-4 flex-1">
      {/* Für wen. Steht ganz oben, weil das die erste Frage ist. */}
      <p className="flex items-center gap-2 text-sm font-semibold" style={{ color: c.dot }}>
        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: c.dot }} aria-hidden="true" />
        {kurs.alter ?? targetLabel}
      </p>

      <div>
        <h4 className="text-[var(--pepe-white)] font-bold text-xl md:text-2xl leading-tight group-hover:text-[var(--pepe-accent-text)] transition-colors">
          {kurs.title}
        </h4>
        {/* line-clamp haelt die Karten in einer Reihe gleich hoch, auch wenn
            eine Beschreibung mal laenger ausfaellt. */}
        <p className="text-[var(--pepe-t80)] text-[15px] leading-relaxed mt-2 line-clamp-4">
          {ersterSatz(kurs.description)}
        </p>
      </div>

      {/* Wann, als Satz statt als Tabelle */}
      <div className="mt-auto pt-1 space-y-1">
        {zeilen.map((zeile, i) => (
          <p key={i} className="text-[var(--pepe-white)] text-[15px] font-medium">
            {zeile}
          </p>
        ))}
        <p className="text-[var(--pepe-t48)] text-sm">
          {t.mit} {kurs.trainer}
        </p>
      </div>

      <span className="text-[var(--pepe-accent-text)] text-sm font-semibold">
        {t.details}
        <span className="inline-block ml-1.5 group-hover:translate-x-1 transition-transform" aria-hidden="true">
          →
        </span>
      </span>
      </div>
    </button>
  )
}

// ── Kurs-Kachel für den Wochenplan ──────────────────────────────────────

/**
 * Ein Kurs an einem Termin.
 *
 * War vorher eine Tabellenzeile mit fester Zeitspalte. Das las sich wie ein
 * Fahrplan, und ein Kursprogramm ist kein Fahrplan: es soll Lust machen. Jetzt
 * eine Kachel mit Bild, farbiger Uhrzeit und Anfasser zum Draufklicken.
 */
function KursKachel({
  kurs,
  slot,
  onClick,
  lang,
}: {
  kurs: Kurs
  slot: Slot
  onClick: () => void
  lang: 'de' | 'en'
}) {
  const c = COLORS[kurs.target]
  const bild = kartenBild(kurs)

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Details zu ${kurs.title} anzeigen`}
      className="group relative flex items-center gap-4 w-full text-left rounded-2xl p-3 pr-4 border transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[var(--pepe-gold)] cursor-pointer"
      style={{ backgroundColor: c.bg, borderColor: c.border }}
    >
      {/* Bild, sonst ein Farbfeld in der Kursfarbe. Beides gleich gross,
          damit die Kacheln einer Reihe nicht auseinanderlaufen. */}
      <span
        className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-xl overflow-hidden"
        style={{ backgroundColor: c.bg }}
        aria-hidden="true"
      >
        {bild ? (
          <Image
            src={bild.url}
            alt=""
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="80px"
          />
        ) : (
          <span
            className="absolute inset-0"
            style={{ background: `linear-gradient(140deg, ${c.dot}55, transparent)` }}
          />
        )}
      </span>

      <span className="flex-1 min-w-0">
        {/* Die Uhrzeit fuehrt, in Kursfarbe: im Wochenplan sucht man zuerst,
            wann etwas laeuft. */}
        <span className="block font-bold text-lg leading-none" style={{ color: c.dot }}>
          {slot.startTime}
          {/* Das Leerzeichen ist kein Schoenheitsfehler: der Abstand kommt
              optisch von ml-2, ohne es liest ein Screenreader aber
              „17:15bis 18:15" in einem Wort. */}{' '}
          <span className="text-[var(--pepe-t48)] font-medium text-xs ml-2">
            {lang === 'de' ? `bis ${slot.endTime}` : `to ${slot.endTime}`}
          </span>
        </span>

        <span className="block text-[var(--pepe-white)] font-bold text-base leading-snug mt-1.5 group-hover:text-[var(--pepe-accent-text)] transition-colors">
          {kurs.title}
        </span>

        {kurs.sub && (
          <span className="block text-[var(--pepe-t64)] text-xs leading-snug mt-0.5">
            {kurs.sub}
          </span>
        )}
      </span>

      <span
        className="text-[var(--pepe-t48)] flex-shrink-0 group-hover:text-[var(--pepe-accent-text)] group-hover:translate-x-1 transition-all"
        aria-hidden="true"
      >
        →
      </span>
    </button>
  )
}

// ── Wochenplan: Tagesabschnitte statt Tabellenzeilen ────────────────────

function Wochenplan({
  woche,
  onKursClick,
  t,
  lang,
}: {
  woche: Tag[]
  onKursClick: (kurs: Kurs) => void
  t: Labels
  lang: 'de' | 'en'
}) {
  return (
    <div className="space-y-8">
      {woche.map((tag) => {
        const hatKurse = tag.eintraege.length > 0
        return (
          <section key={tag.weekday}>
            {/* Tagesueberschrift. Frueher eine Tabellenspalte, jetzt eine
                Ueberschrift mit Luft darum. */}
            <div className="flex items-baseline gap-3 mb-3">
              <h4
                className={`font-bold text-xl md:text-2xl ${
                  hatKurse ? 'text-[var(--pepe-white)]' : 'text-[var(--pepe-t48)]'
                }`}
              >
                {weekdayName(tag.weekday, lang)}
              </h4>
              {hatKurse && (
                <span className="text-[var(--pepe-t48)] text-sm">
                  {tag.eintraege.length}{' '}
                  {tag.eintraege.length === 1 ? t.kursEiner : t.kursMehrere}
                </span>
              )}
              <span className="flex-1 h-px bg-[var(--pepe-line)]" aria-hidden="true" />
            </div>

            {hatKurse ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {tag.eintraege.map((eintrag, i) => (
                  <KursKachel
                    key={`${eintrag.kurs.id}-${i}`}
                    kurs={eintrag.kurs}
                    slot={eintrag.slot}
                    lang={lang}
                    onClick={() => onKursClick(eintrag.kurs)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-[var(--pepe-t48)] text-sm italic">{tag.note ?? '—'}</p>
            )}

            {hatKurse && tag.note && (
              <p className="text-[var(--pepe-t48)] text-xs italic mt-3">{tag.note}</p>
            )}
          </section>
        )
      })}
    </div>
  )
}

// ── Haupt-Komponente ─────────────────────────────────────────────────────

export default function CourseScheduleGrid({
  programm,
  lang = 'de',
}: {
  programm: Kursprogramm
  lang?: 'de' | 'en'
}) {
  const t = LABELS[lang]
  const [view, setView] = useState<View>('kurse')
  const [filter, setFilter] = useState<Filter>('alle')
  const [selectedKurs, setSelectedKurs] = useState<Kurs | null>(null)

  const { kurse, woche } = programm

  const counts = useMemo(() => {
    const base = { alle: kurse.length, kinder: 0, teens: 0, erwachsene: 0 }
    for (const kurs of kurse) base[kurs.target] += 1
    return base
  }, [kurse])

  const sichtbareKurse =
    filter === 'alle' ? kurse : kurse.filter((kurs) => kurs.target === filter)

  // Wochenplan gefiltert. Tage ohne Treffer fliegen raus, solange gefiltert
  // wird — sonst stehen bei „Kinder" fünf leere Zeilen im Plan.
  const sichtbareWoche = useMemo(() => {
    if (filter === 'alle') return woche
    return woche
      .map((tag) => ({
        ...tag,
        eintraege: tag.eintraege.filter((eintrag) => eintrag.kurs.target === filter),
      }))
      .filter((tag) => tag.eintraege.length > 0)
  }, [woche, filter])

  const nichtsGefunden =
    filter !== 'alle' &&
    (view === 'kurse' ? sichtbareKurse.length === 0 : sichtbareWoche.length === 0)

  // ── URL ←→ Modal-State Synchronisation ────────────────────────────────
  useEffect(() => {
    const syncFromUrl = () => {
      const params = new URLSearchParams(window.location.search)
      const slug = params.get('kurs')
      if (slug) {
        // resolveSlug faengt die vier alten Luftakrobatik-Links ab, die vor
        // der Zusammenfassung geteilt wurden.
        const gesucht = resolveSlug(slug)
        const found = kurse.find((kurs) => kurs.slug === gesucht)
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
    // kurse bewusst nicht in deps — die Daten sind nach dem Mount statisch
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const openKurs = (kurs: Kurs) => {
    setSelectedKurs(kurs)
    const url = new URL(window.location.href)
    url.searchParams.set('kurs', kurs.slug)
    window.history.replaceState({}, '', url.toString())
  }

  const closeKurs = () => {
    setSelectedKurs(null)
    const url = new URL(window.location.href)
    url.searchParams.delete('kurs')
    window.history.replaceState({}, '', url.toString())
  }

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
          {sichtbareKurse.map((kurs) => (
            <KursKarte
              key={kurs.id}
              kurs={kurs}
              t={t}
              lang={lang}
              targetLabel={targetLabel[kurs.target]}
              onClick={() => openKurs(kurs)}
            />
          ))}
        </div>
      ) : (
        <Wochenplan
          woche={sichtbareWoche}
          onKursClick={openKurs}
          t={t}
          lang={lang}
        />
      )}

      <CourseDetailModal kurs={selectedKurs} lang={lang} onClose={closeKurs} />
    </>
  )
}
