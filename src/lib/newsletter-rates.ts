/**
 * Öffnungs- und Klickrate eines Newsletters.
 *
 * Geteilt wird durch die Zahl der Empfänger. Die steht an drei Stellen, und
 * keine davon ist allein verlässlich: `recipientCount` am Newsletter wurde
 * früher erst ganz am Ende des Versands gesetzt und blieb nach einem Abbruch
 * bei 0, obwohl die Mails draußen waren. `sentCount` in den Statistiken zählt
 * jetzt pro Block mit, `deliveredCount` kommt über den Webhook von Resend.
 *
 * Deshalb zählt die grösste der drei Zahlen. Eine Rate mit 0 im Nenner gibt
 * es nicht, dann kommt null zurück und die Oberfläche zeigt einen Strich
 * statt einer erfundenen 0 %.
 */

type StatsBasis =
  | {
      sentCount?: number | null
      deliveredCount?: number | null
    }
  | null
  | undefined

export function versandBasis(recipientCount: number | null | undefined, stats: StatsBasis): number {
  return Math.max(recipientCount ?? 0, stats?.sentCount ?? 0, stats?.deliveredCount ?? 0)
}

/** Anteil in Prozent mit einer Nachkommastelle, oder null ohne Basis. */
export function quote(anzahl: number | null | undefined, basis: number): string | null {
  if (basis <= 0) return null
  return (((anzahl ?? 0) / basis) * 100).toFixed(1)
}
