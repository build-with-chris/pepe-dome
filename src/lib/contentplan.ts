/**
 * Rechenregeln für den Contentplan.
 *
 * Der Plan über 12 Wochen hat genau drei Zahlen, an denen Entscheidungen
 * hängen, und alle drei werden hier berechnet statt in der Seite:
 *
 *  1. Der Puffer, also wie viele Reels fertig geschnitten und noch ungepostet
 *     sind. Fällt er unter das Soll, muss in derselben Woche ein zusätzlicher
 *     Schnitt-Slot her.
 *  2. Die Baseline, also der Median der ersten fünf Reels. Daraus wird einmalig
 *     die Gewinner-Schwelle abgeleitet.
 *  3. Die Kosten pro Ergebnis je Creative, das Endergebnis des Projekts.
 *
 * Bewusst ohne Prisma-Import: So laufen die Tests dieser Datei mit `npm test`
 * ohne Datenbank, und die Regeln lassen sich prüfen, ohne eine Zeile zu
 * speichern.
 */

/** Wo ein Reel im Produktionsweg steht. */
export type ReelStatus = 'PLANNED' | 'FILMED' | 'EDITED' | 'PUBLISHED'

export const REEL_STATUS_LABELS: Record<ReelStatus, string> = {
  PLANNED: 'Geplant',
  FILMED: 'Gedreht',
  EDITED: 'Geschnitten',
  PUBLISHED: 'Veröffentlicht',
}

/** Reihenfolge im Produktionsweg, für Sortierung und für die nächste Stufe. */
export const REEL_STATUS_ORDER: readonly ReelStatus[] = [
  'PLANNED',
  'FILMED',
  'EDITED',
  'PUBLISHED',
]

/**
 * Die Felder, die gerechnet werden. Absichtlich ein eigener Typ und nicht das
 * Prisma-Modell: Diese Datei soll ohne generierten Client benutzbar bleiben.
 */
export interface ReelMetrics {
  position: number
  status: ReelStatus
  publishedAt: Date | null
  shares48: number | null
  saves48: number | null
  shares72: number | null
  saves72: number | null
  budgetReleasedAt: Date | null
  spendCents: number | null
  results: number | null
}

/**
 * Wie viele Reels die Baseline bilden.
 *
 * Fünf, weil der Median einer geraden Anzahl zwischen zwei Werten mittelt und
 * bei so kleinen Stichproben schon ein einzelner Ausreißer die Schwelle
 * verschiebt.
 */
export const BASELINE_SAMPLE_SIZE = 5

/**
 * Gewinner ab dem Doppelten des Medians.
 *
 * Nur ein Vorschlag für die Eingabemaske. Verbindlich ist die Zahl, die einmal
 * von Hand fixiert wird, denn sonst wandert die Schwelle mit jedem neuen Reel,
 * das den Median verschiebt, und niemand kann später sagen, wogegen im
 * September eigentlich gemessen wurde.
 */
export const THRESHOLD_FACTOR = 2

/**
 * Innerhalb dieser Frist nach der Veröffentlichung fällt die Budgetentscheidung.
 * Bei einem Post am Donnerstag 18:00 also Samstag 18:00.
 */
export const BUDGET_DECISION_HOURS = 48

/**
 * Aufbaupfad für den Puffer.
 *
 * Der Sollwert von 4 gilt nicht ab Tag eins. Um nach dem ersten Post bei 4 zu
 * stehen, müssten zwischen Drehtag am Montag und Post am Donnerstag fünf Reels
 * fertig geschnitten sein, also rund 7,5 Stunden Schnitt in drei Tagen. Bei
 * einem Wochenbudget von 5 bis 6 Stunden geht das nicht. Ohne diesen Pfad wäre
 * die Regel ab der ersten Woche verletzt, und ein Kriterium, das immer rot ist,
 * wird nach zwei Wochen ignoriert.
 *
 * Die Zeitzone steht ausdrücklich dran: Alle Stichtage liegen im August, also
 * in der Sommerzeit. Ohne Offset läge die Grenze je nach Serverzeitzone zwei
 * Stunden daneben, und der Puffer wäre am Sonntagabend kurzzeitig zu klein.
 */
export const BUFFER_LADDER: ReadonlyArray<{ deadline: string; target: number }> = [
  { deadline: '2026-08-09T23:59:59+02:00', target: 1 },
  { deadline: '2026-08-16T23:59:59+02:00', target: 2 },
  { deadline: '2026-08-23T23:59:59+02:00', target: 3 },
  { deadline: '2026-08-30T23:59:59+02:00', target: 4 },
]

/** Sollwert nach Abschluss des Aufbaupfads. */
export const BUFFER_TARGET = 4

/** Median einer Zahlenreihe. Leere Reihe ergibt null statt NaN. */
export function median(values: number[]): number | null {
  if (values.length === 0) return null
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 1 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

/**
 * Shares plus Saves nach 48 Stunden.
 *
 * Null, sobald eine der beiden Zahlen fehlt. Eine halbe Summe sähe aus wie ein
 * schwaches Reel und würde die Baseline nach unten ziehen.
 */
export function engagement48(reel: Pick<ReelMetrics, 'shares48' | 'saves48'>): number | null {
  if (reel.shares48 === null || reel.saves48 === null) return null
  return reel.shares48 + reel.saves48
}

/** Dasselbe nach 72 Stunden, nur als Vergleichsgröße im Tracker. */
export function engagement72(reel: Pick<ReelMetrics, 'shares72' | 'saves72'>): number | null {
  if (reel.shares72 === null || reel.saves72 === null) return null
  return reel.shares72 + reel.saves72
}

/**
 * Median der ersten fünf veröffentlichten Reels, gemessen nach 48 Stunden.
 *
 * Der Messpunkt ist bewusst 48 und nicht 72 Stunden, obwohl der ursprüngliche
 * Plan an einer Stelle 72 nennt. An der Schwelle hängt die Budgetfreigabe, und
 * die soll binnen 48 Stunden fallen. Ein 48-Stunden-Wert gegen einen
 * 72-Stunden-Median zu halten würde die Schwelle systematisch zu hoch setzen,
 * weil ein Reel in den zusätzlichen 24 Stunden weiter Shares sammelt. Der
 * 72-Stunden-Wert wird trotzdem erfasst, er steht nur nicht in dieser Rechnung.
 *
 * Gibt null zurück, solange weniger als fünf Reels vollständige Zahlen haben.
 * Eine Baseline aus drei Reels wäre eine Zahl ohne Aussage, und mit ihr würde
 * Budget auf einer Schätzung fließen.
 */
export function baselineMedian(reels: ReelMetrics[]): number | null {
  const sample = [...reels]
    .filter((reel) => reel.status === 'PUBLISHED' && engagement48(reel) !== null)
    .sort((a, b) => a.position - b.position)
    .slice(0, BASELINE_SAMPLE_SIZE)

  if (sample.length < BASELINE_SAMPLE_SIZE) return null

  return median(sample.map((reel) => engagement48(reel) as number))
}

/** Vorschlag für die Eingabemaske, sobald die Baseline steht. */
export function suggestedThreshold(baseline: number | null): number | null {
  if (baseline === null) return null
  return Math.round(baseline * THRESHOLD_FACTOR)
}

/**
 * Reißt das Reel die Schwelle?
 *
 * Ohne fixierte Schwelle immer null und nicht false. False hieße "geprüft und
 * durchgefallen", und danach würde niemand mehr nachsehen, ob überhaupt schon
 * eine Schwelle existiert.
 */
export function isWinner(reel: ReelMetrics, threshold: number | null): boolean | null {
  if (threshold === null) return null
  const value = engagement48(reel)
  if (value === null) return null
  return value >= threshold
}

/** Anzahl fertig geschnittener, noch nicht veröffentlichter Reels. */
export function bufferCount(reels: Pick<ReelMetrics, 'status'>[]): number {
  return reels.filter((reel) => reel.status === 'EDITED').length
}

/**
 * Welcher Puffer muss zu diesem Zeitpunkt bereits stehen?
 *
 * Eine Stufe zählt erst, wenn ihr Stichtag vorbei ist. Am 09.08. selbst ist
 * also noch nichts fällig, ab dem 10.08. mindestens 1. Sonst wäre die Regel
 * schon an dem Tag verletzt, an dem sie erfüllt werden soll.
 */
export function bufferTargetOn(now: Date): number {
  let target = 0
  for (const step of BUFFER_LADDER) {
    if (now.getTime() > new Date(step.deadline).getTime()) {
      target = step.target
    }
  }
  return target
}

/** Nächste noch offene Stufe des Aufbaupfads, für den Hinweis in der Seite. */
export function nextBufferStep(now: Date): { deadline: Date; target: number } | null {
  for (const step of BUFFER_LADDER) {
    const deadline = new Date(step.deadline)
    if (now.getTime() <= deadline.getTime()) {
      return { deadline, target: step.target }
    }
  }
  return null
}

export interface BufferStatus {
  /** Wie viele Reels liegen fertig geschnitten bereit */
  count: number
  /** Wie viele es zu diesem Zeitpunkt mindestens sein müssten */
  required: number
  /** Erfüllt oder nicht */
  ok: boolean
  /** Nächste Stufe, solange der Aufbaupfad läuft */
  next: { deadline: Date; target: number } | null
}

export function bufferStatus(reels: Pick<ReelMetrics, 'status'>[], now: Date): BufferStatus {
  const count = bufferCount(reels)
  const required = bufferTargetOn(now)
  return {
    count,
    required,
    ok: count >= required,
    next: nextBufferStep(now),
  }
}

/** Wann die Budgetentscheidung spätestens fällt. */
export function budgetDeadline(publishedAt: Date | null): Date | null {
  if (!publishedAt) return null
  return new Date(publishedAt.getTime() + BUDGET_DECISION_HOURS * 60 * 60 * 1000)
}

/**
 * Überfällige Budgetentscheidung: veröffentlicht, Gewinner, aber kein Budget
 * freigegeben und die 48 Stunden sind vorbei.
 *
 * Das ist die einzige Warnung, die auf ein einzelnes Reel zeigt statt auf den
 * Plan. Ein verpasster Gewinner ist der teuerste Fehler in diesen zwölf
 * Wochen, weil das Reel danach im Feed versinkt und das Budget nichts mehr
 * findet, worauf es aufsetzen könnte.
 */
export function budgetOverdue(reel: ReelMetrics, threshold: number | null, now: Date): boolean {
  if (reel.status !== 'PUBLISHED') return false
  if (reel.budgetReleasedAt !== null) return false
  if (isWinner(reel, threshold) !== true) return false

  const deadline = budgetDeadline(reel.publishedAt)
  if (!deadline) return false

  return now.getTime() > deadline.getTime()
}

/**
 * Kosten pro Ergebnis in Euro.
 *
 * Ausgaben liegen in Cent in der Datenbank, damit sich nichts an Rundung
 * verliert. Null Ergebnisse ergeben null und nicht Unendlich: Eine Kampagne
 * ohne Ergebnis hat keinen Preis pro Ergebnis, sie hat ein Problem.
 */
export function costPerResult(spendCents: number | null, results: number | null): number | null {
  if (spendCents === null || results === null || results <= 0) return null
  return spendCents / 100 / results
}

/**
 * Wie viele Reels wurden bereits mit Budget skaliert?
 *
 * Das ist der Erfolgsmaßstab des ganzen Plans: mindestens 5 von 12.
 */
export function scaledCount(reels: Pick<ReelMetrics, 'budgetReleasedAt'>[]): number {
  return reels.filter((reel) => reel.budgetReleasedAt !== null).length
}

/** Zielwert für skalierte Creatives am Ende der zwölf Wochen. */
export const SCALED_TARGET = 5

/** Anzahl Reels, die der Plan insgesamt vorsieht. */
export const PLANNED_REELS = 12
