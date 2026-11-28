/**
 * Laengengrenzen fuer Newsletter-Inhalte.
 *
 * Eigene Datei ohne Abhaengigkeiten, weil Editor im Browser und Validierung
 * auf dem Server dieselbe Zahl brauchen. Vorher liess das Textfeld 1000
 * Zeichen zu, der Server nahm nur 500 an. Laengere Texte verschwanden beim
 * Speichern ohne Meldung, und mit ihnen jede Umsortierung, die im selben
 * Aufruf mitging.
 */

/** Text eines freien Blocks (CUSTOM_SECTION) oder Beschreibung einer Sektion. */
export const SECTION_TEXT_MAX = 1000

/** Ueberschrift eines Blocks. */
export const SECTION_HEADING_MAX = 100
