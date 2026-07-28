/**
 * Typen und reine Helfer für das Kursprogramm.
 *
 * Liegt bewusst getrennt von db-courses.ts: die Trainingsseite rendert die
 * Kurse in einer Client-Komponente, und die darf nichts importieren, was
 * Prisma mitzieht. Hier steht deshalb nur, was ohne Server läuft.
 *
 * Wochentage sind Zahlen (1 = Montag … 7 = Sonntag, ISO-8601), keine Strings.
 * Vorher hingen Übersetzung und Sortierung an deutschen Tagesnamen als
 * Schlüssel, was für die englische Seite eine eigene Mapping-Tabelle nötig
 * machte. Mit Zahlen fällt das weg.
 */

export type Target = 'kinder' | 'teens' | 'erwachsene'

export const TARGETS: readonly Target[] = ['kinder', 'teens', 'erwachsene']

export function isTarget(value: unknown): value is Target {
  return typeof value === 'string' && (TARGETS as readonly string[]).includes(value)
}

/** Ein wöchentlicher Termin eines Kurses. */
export type Slot = {
  /** 1 = Montag … 7 = Sonntag */
  weekday: number
  /** "HH:MM" */
  startTime: string
  /** "HH:MM" */
  endTime: string
}

/**
 * Ein Kurs als Angebot, mit allen seinen Wochenterminen.
 * Luftakrobatik läuft viermal pro Woche und ist trotzdem ein Kurs.
 */
export type Kurs = {
  id: string
  slug: string
  title: string
  sub: string | null
  description: string
  inhalte: string[]
  alter: string | null
  fuerWen: string
  target: Target
  trainer: string
  bookingUrl: string | null
  bookingLabel: string | null
  bookingNote: string | null
  slots: Slot[]
}

/** Eine Zeile im Wochenplan: ein Kurs zu einem bestimmten Termin. */
export type TagEintrag = { kurs: Kurs; slot: Slot }

export type Tag = {
  weekday: number
  /** Freitext für Tage ohne Kurse, z.B. „Tricking & Breaking in Planung". */
  note: string | null
  eintraege: TagEintrag[]
}

/** Beide Sichten auf dasselbe Programm, fertig gruppiert. */
export type Kursprogramm = {
  /** Katalog-Ansicht: ein Eintrag pro Kurs. */
  kurse: Kurs[]
  /** Wochenplan: sieben Tage, immer vollständig, auch die leeren. */
  woche: Tag[]
}

export const LEERES_PROGRAMM: Kursprogramm = { kurse: [], woche: [] }

/**
 * Alte Kurs-Slugs auf ihren heutigen Kurs.
 *
 * Luftakrobatik stand früher als vier getrennte Einträge im Code, einer pro
 * Wochentermin, jeder mit eigenem Slug. Für Besucher war das immer ein Kurs,
 * und in der Datenbank ist es jetzt auch einer. Wer noch einen der vier alten
 * Links geteilt hat, soll trotzdem beim richtigen Kurs landen.
 *
 * Einmaliger Altbestand aus der Umstellung, wächst nicht mit. Neue Kurse
 * behalten ihren Slug beim Umbenennen, deshalb entsteht hier nichts Neues.
 */
export const LEGACY_SLUGS: Readonly<Record<string, string>> = {
  'luftakrobatik-aircrobatics-mo-1715': 'luftakrobatik-aircrobatics',
  'luftakrobatik-aircrobatics-mo-1815': 'luftakrobatik-aircrobatics',
  'luftakrobatik-aircrobatics-mi-1700': 'luftakrobatik-aircrobatics',
  'luftakrobatik-aircrobatics-mi-1800': 'luftakrobatik-aircrobatics',
}

/** Löst einen geteilten Link auf den aktuellen Slug auf. */
export function resolveSlug(slug: string): string {
  return LEGACY_SLUGS[slug] ?? slug
}

// ── Wochentage ──────────────────────────────────────────────────────────────
// Index 0 bleibt leer, damit der Wochentag direkt als Index dient.

const WEEKDAY_NAMES: Record<'de' | 'en', readonly string[]> = {
  de: ['', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'],
  en: ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
}

const WEEKDAY_ADVERBS: Record<'de' | 'en', readonly string[]> = {
  de: ['', 'Montags', 'Dienstags', 'Mittwochs', 'Donnerstags', 'Freitags', 'Samstags', 'Sonntags'],
  en: ['', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays', 'Sundays'],
}

export function weekdayName(weekday: number, lang: 'de' | 'en' = 'de'): string {
  return WEEKDAY_NAMES[lang][weekday] ?? ''
}

/** „Montags" — für die Zeitzeile auf der Kurskarte. */
export function weekdayAdverb(weekday: number, lang: 'de' | 'en' = 'de'): string {
  return WEEKDAY_ADVERBS[lang][weekday] ?? ''
}

export function isWeekday(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= 7
}

/** "17:15 bis 18:15" bzw. "17:15 to 18:15" */
export function zeitspanne(slot: Slot, lang: 'de' | 'en' = 'de'): string {
  return `${slot.startTime} ${lang === 'de' ? 'bis' : 'to'} ${slot.endTime}`
}

/**
 * Sortiert Termine so, wie sie in der Woche liegen: erst nach Tag, dann nach
 * Startzeit. "HH:MM" lässt sich als String vergleichen, solange die Stunde
 * zweistellig ist — genau das erzwingt die API.
 */
export function sortSlots<T extends Slot>(slots: T[]): T[] {
  return [...slots].sort(
    (a, b) => a.weekday - b.weekday || a.startTime.localeCompare(b.startTime)
  )
}
