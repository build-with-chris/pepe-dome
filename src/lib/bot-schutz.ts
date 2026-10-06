/**
 * Erkennt automatisierte Newsletter-Anmeldungen.
 *
 * Anlass: Ab Oktober 2026 kamen täglich Anmeldungen mit fremden Adressen und
 * Vornamen wie "Ifvmrmps". Bestätigt hat davon niemand, denn die Adressen
 * gehören Leuten, die sich nie angemeldet haben. Jede dieser Anmeldungen
 * schickt trotzdem eine Bestätigungsmail an ein fremdes Postfach, und das
 * schadet dem Ruf unserer Absenderdomain.
 *
 * Zwei einfache Merkmale, die ein Mensch im Browser nie zeigt:
 *
 * - Das Feld `website` ist für Menschen unsichtbar. Wer es füllt, ist ein
 *   Programm, das jedes Feld ausfüllt, das es findet.
 * - `fillMs` ist die Zeit zwischen dem Anzeigen des Formulars und dem
 *   Absenden. Unter anderthalb Sekunden tippt niemand eine Adresse. Fehlt der
 *   Wert ganz, kam die Anfrage nicht aus unserem Formular.
 *
 * Erkannte Bots bekommen dieselbe Antwort wie alle anderen. Eine abweichende
 * Antwort würde ihnen nur zeigen, woran sie gescheitert sind.
 */

export const MINDESTZEIT_MS = 1500

export type BotGrund = 'honeypot' | 'zu-schnell' | 'ohne-formular'

export function botGrund(data: { website?: string; fillMs?: number }): BotGrund | null {
  if (data.website && data.website.trim() !== '') return 'honeypot'
  if (typeof data.fillMs !== 'number') return 'ohne-formular'
  if (data.fillMs < MINDESTZEIT_MS) return 'zu-schnell'
  return null
}
