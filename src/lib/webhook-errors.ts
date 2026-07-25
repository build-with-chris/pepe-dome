/**
 * Wann darf ein Webhook mit 5xx quittiert werden?
 *
 * Resend wiederholt jeden Zustellversuch, den wir mit einem 5xx beantworten.
 * Das ist richtig, solange ein späterer Versuch eine Chance hat — Datenbank
 * kurz weg, Timeout, Deployment läuft gerade.
 *
 * Es ist falsch, sobald der Payload selbst nicht verarbeitbar ist. Genau das
 * passierte live: In den Tags einer Mail steckt die `newsletter_id` vom Tag des
 * Versands. Wird der Newsletter danach gelöscht, zeigt der Tag ins Leere,
 * `newsletterEvent.create` verletzt den Fremdschlüssel, die Route antwortete
 * mit 500 — und Resend stellte dasselbe Ereignis immer wieder zu. Ein Fehler,
 * der sich nie von selbst auflöst, in einer Schleife, die nie endet.
 *
 * Diese Unterscheidung liegt in einem eigenen Modul, weil sie sich so ohne
 * Datenbank testen lässt: die Webhook-Route selbst wird nur in den DB-Tests
 * ausgeführt (siehe tests/README.md), diese Regel dagegen in jedem `npm test`.
 */

/**
 * Prisma-Fehlercodes, bei denen ein erneuter Zustellversuch dasselbe Ergebnis
 * liefern würde.
 *
 * P2003  Fremdschlüssel verletzt — die referenzierte Zeile existiert nicht
 * P2025  Zu ändernder Datensatz nicht gefunden
 *
 * Bewusst kurz gehalten. Jeder weitere Code hier bedeutet, dass ein Ereignis
 * still verworfen wird; das gehört einzeln begründet und nicht pauschal.
 * Insbesondere P1001/P1002 (Datenbank nicht erreichbar) gehören NICHT hierher:
 * dort ist der erneute Versuch genau das Richtige.
 */
export const PERMANENT_PRISMA_CODES: ReadonlySet<string> = new Set(['P2003', 'P2025'])

/**
 * Ist dieser Fehler dauerhaft, der Payload also nicht verarbeitbar?
 *
 * Prüft auf die `code`-Eigenschaft, die Prisma an seine bekannten Fehler hängt,
 * statt auf den Klassennamen. Der Klassenname wechselt zwischen Prisma-Versionen
 * und über Modulgrenzen hinweg ist `instanceof` unzuverlässig.
 */
export function isPermanentlyUnprocessable(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) return false
  const code = (error as { code?: unknown }).code
  return typeof code === 'string' && PERMANENT_PRISMA_CODES.has(code)
}
