import { markdownToPlainText } from '@/lib/markdown'

/**
 * Kanal-Kit: Markdown zu Portaltext
 *
 * Die Event-Beschreibung ist Markdown. Portalformulare nehmen einfachen Text.
 * Zwischen beidem liegen drei Dinge, an denen so eine Umwandlung scheitert:
 * Syntaxreste, Gedankenstriche und das Kürzen auf ein Zeichenlimit.
 */

/** Auslassungszeichen ans Ende eines gekürzten Textes. Ein Zeichen, kein Dreipunkt. */
const ELLIPSIS = '…'

/** Ein Block, der nur aus Strichen besteht: eine Trennlinie, kein Inhalt. */
const RULE_ONLY = /^[—–\-*_\s]+$/

/**
 * Gedankenstriche raus.
 *
 * `markdownToPlainText` gibt eine Trennlinie als `—` aus, und in Copy soll
 * dieses Zeichen nicht vorkommen. Zwei Fälle, zwei Ersetzungen:
 *
 *   "Boden — und Kuppel"  →  "Boden, und Kuppel"   (Einschub)
 *   "10–12 Uhr"           →  "10-12 Uhr"           (Spanne)
 */
export function replaceDashes(text: string): string {
  return text
    .replace(/\s+[—–]+\s+/g, ', ')
    .replace(/[—–]+/g, '-')
}

/** Enthält der Text noch einen Gedankenstrich? Nur für Tests und Prüfungen. */
export function containsDash(text: string): boolean {
  return /[—–]/.test(text)
}

/**
 * Markdown zu Portaltext.
 *
 * Trennlinien fliegen ganz raus statt als Strichzeile stehen zu bleiben,
 * Absätze bleiben durch eine Leerzeile getrennt, mehr Struktur nimmt ohnehin
 * kein Portalfeld an.
 */
export function toPortalText(source: string | null | undefined): string {
  if (!source) return ''

  const blocks = markdownToPlainText(source)
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter((block) => block.length > 0 && !RULE_ONLY.test(block))
    .map(replaceDashes)

  return blocks.join('\n\n').trim()
}

/** Alles in eine Zeile, für Felder, die keinen Umbruch vertragen. */
export function toSingleLine(text: string): string {
  return text.replace(/\s+/g, ' ').trim()
}

/** Der erste Absatz. Basis für Kurzbeschreibungen und Teaser. */
export function firstParagraph(text: string): string {
  const [first] = text.split(/\n{2,}/)
  return (first ?? '').trim()
}

export interface TruncateResult {
  text: string
  /** An einer Wortgrenze gekürzt. */
  truncated: boolean
  /**
   * Zu lang und nicht kürzbar, ohne ein Wort oder eine URL zu zerschneiden.
   * Dann bleibt der Text ungekürzt stehen und das Panel markiert ihn rot:
   * Die Redaktion soll das sehen und entscheiden, nicht der Generator.
   */
  overLimit: boolean
}

/**
 * Kürzen an der Wortgrenze.
 *
 * Nie mitten in einem Wort und nie innerhalb einer URL. Beides fällt hier
 * zusammen: geschnitten wird ausschließlich an Leerraum, und eine URL enthält
 * keinen. Findet sich vor dem Limit keine Wortgrenze, wird nicht gekürzt.
 */
export function truncateAtWord(text: string, max: number | null): TruncateResult {
  const clean = text.trim()
  if (!max || max <= 0 || clean.length <= max) {
    return { text: clean, truncated: false, overLimit: false }
  }

  const room = max - ELLIPSIS.length
  if (room <= 0) return { text: clean, truncated: false, overLimit: true }

  // room + 1 Zeichen ansehen: liegt genau an der Grenze ein Leerzeichen,
  // darf der Text die vollen `room` Zeichen behalten.
  const window = clean.slice(0, room + 1)
  const upToLastSpace = window.match(/^[\s\S]*\s/)
  if (!upToLastSpace) {
    // Ein einziges langes Wort oder eine URL. Lieber sichtbar zu lang als kaputt.
    return { text: clean, truncated: false, overLimit: true }
  }

  const cut = upToLastSpace[0].replace(/[\s,;:.!?/-]+$/, '')
  if (cut.length === 0) return { text: clean, truncated: false, overLimit: true }

  return { text: cut + ELLIPSIS, truncated: true, overLimit: false }
}
