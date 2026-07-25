/**
 * Kostenlose Events erkennen
 *
 * Das Preisfeld eines Events ist ein Freitextfeld (prisma/schema.prisma,
 * `price String?`). Die Redaktion trägt dort ein, was gerade passt: "Eintritt
 * frei", "Kostenlos", "ab 22 €", "20 bis 35 €", "Free entry".
 *
 * Vorher wurde an drei Stellen im Code auf Gleichheit geprüft:
 *
 *   event.price === 'Eintritt frei'                          (EventDetail)
 *   event.price === 'Eintritt frei' || 'Free entry'          (Detailseite)
 *
 * Damit fiel jedes Event durch, dessen Preis anders geschrieben war. Das ist
 * kein Randfall: das Seed-Skript für Januar/Februar 2026 schreibt "Kostenlos",
 * und genau dieses Event wurde deshalb nicht als kostenlos erkannt.
 *
 * Diese Funktion ist ab jetzt die einzige Stelle, die das entscheidet.
 *
 * ── Warum Präfix-Muster und nicht "enthält frei" ──────────────────────────
 * Ein reines `includes('frei')` würde auch greifen bei
 *
 *   "22 €, frei für Kinder unter 6"   → kostet Geld
 *   "Freiwillige Spende"              → es wird eine Zahlung erwartet
 *
 * Beides würde fälschlich einen Gratis-Sticker bekommen, und ein falsches
 * "kostenlos" am Eingang ist teurer als ein fehlendes. Die Muster sind deshalb
 * am Stringanfang verankert: der Preis muss *mit* der Gratis-Aussage beginnen.
 * Zusätze dahinter sind erlaubt, etwa "Kostenlos (wissenschaftliche Arbeit)"
 * oder "Eintritt frei, Spenden willkommen".
 */

/**
 * Die Muster sind an den Werten geprüft, die tatsächlich in der Datenbank
 * stehen. Beim ersten Entwurf fehlten `umsonst` (fünf Veranstaltungen) und
 * `freier Eintritt (Spenden erwünscht)` (zwei) — von acht kostenlosen Events
 * wäre genau eines erkannt worden. Wer hier etwas ergänzt, sollte vorher einmal
 * `SELECT DISTINCT price FROM events` ansehen.
 */
const FREE_PATTERNS: RegExp[] = [
  // "Eintritt frei", "Eintritt: frei", "Der Eintritt ist frei"
  /^(der\s+)?eintritt\s*:?\s*(ist\s+)?frei\b/,
  // "freier Eintritt (Spenden erwünscht)", "Freie Eintritt"
  /^frei(er|e|es)?\s+eintritt\b/,
  /^(kostenloser?|kostenfreier?)\s+eintritt\b/,
  /^eintritt\s+(kostenlos|kostenfrei|umsonst)\b/,
  /^kostenlos\b/,
  /^kostenfrei\b/,
  /^gratis\b/,
  // Bayerisch-umgangssprachlich, in den Daten der häufigste Fall
  /^umsonst\b/,
  /^free\s*(entry|admission|of\s+charge)?\b/,
  /^no\s+charge\b/,
  // "0", "0 €", "0,00 EUR", "0.00 euro"
  /^0([.,]0{1,2})?\s*(€|eur|euro)?\s*$/,
]

/** Vereinheitlicht Schreibweisen, damit die Muster verlässlich greifen. */
function normalize(price: string): string {
  return price
    .replace(/ /g, ' ') // geschütztes Leerzeichen, kommt beim Copy-Paste aus Word mit
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
}

/**
 * Ist der Eintritt kostenlos?
 *
 * Ein leeres oder fehlendes Preisfeld gilt bewusst als *nicht* kostenlos: es
 * bedeutet "Preis steht noch nicht fest", nicht "gratis".
 */
export function isFreeEntry(price: string | null | undefined): boolean {
  if (!price) return false
  const normalized = normalize(price)
  if (normalized.length === 0) return false
  return FREE_PATTERNS.some((pattern) => pattern.test(normalized))
}
