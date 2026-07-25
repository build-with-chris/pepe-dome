/**
 * Einheitliche Uhrzeiten für Events
 *
 * Die Uhrzeit eines Events liegt als Text in der Datenbank (`time`, neu auch
 * `endTime`), nicht als echter Zeitwert. Das Datumsfeld `date` trägt nur den
 * Kalendertag. Entsprechend stand in der Redaktion bisher alles Mögliche drin:
 *
 *   "20:00"      "20:00 Uhr"      "ab 20"      "20"      "19.30 Uhr"
 *
 * Auf der Website führte das zu Karten mit "20:00" neben Karten mit
 * "17:00 Uhr", im Newsletter zu wieder anderen Schreibweisen, und die
 * strukturierten Daten für Google mussten raten.
 *
 * Ab jetzt gilt: gespeichert wird ausschließlich "HH:MM", ausgegeben wird
 * überall über die Formatierer hier. Altbestand wird beim Lesen mitgeparst,
 * damit nichts verschwindet, solange die Daten noch nicht nachgezogen sind.
 */

/** Vereinheitlicht Schreibweisen vor dem Parsen. */
function clean(raw: string): string {
  return raw
    .replace(/ /g, ' ') // geschütztes Leerzeichen aus Word-Copy-Paste
    .trim()
    .replace(/\s+/g, ' ')
}

/**
 * Bringt eine Freitext-Uhrzeit auf "HH:MM".
 *
 * Gibt `null` zurück, wenn sich keine plausible Uhrzeit finden lässt. Das ist
 * bewusst kein Fehler: Werte wie "nach Vereinbarung" sollen erhalten bleiben
 * und werden von den Formatierern unverändert durchgereicht.
 */
export function normalizeTime(raw: string | null | undefined): string | null {
  if (!raw) return null
  const text = clean(raw)
  if (text.length === 0) return null

  // "20:00", "19.30", "9:5" — Stunde und Minute stehen zusammen
  const withMinutes = text.match(/(?<!\d)(\d{1,2})[:.](\d{1,2})(?!\d)/)
  if (withMinutes) {
    const h = Number(withMinutes[1])
    const m = Number(withMinutes[2])
    if (h >= 0 && h <= 23 && m >= 0 && m <= 59) {
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
    }
  }

  // "ab 20", "20 Uhr", "20h" — nur die volle Stunde
  const hourOnly = text.match(/(?<!\d)(\d{1,2})(?!\d)/)
  if (hourOnly) {
    const h = Number(hourOnly[1])
    if (h >= 0 && h <= 23) return `${String(h).padStart(2, '0')}:00`
  }

  return null
}

/**
 * Was in die Datenbank geschrieben wird.
 *
 * Parsbares wird auf "HH:MM" vereinheitlicht, alles andere bleibt wie es ist.
 * Das Formular liefert ohnehin nur "HH:MM"; die Nachsicht hier gilt Seed-
 * Skripten und dem Altbestand, der beim Bearbeiten nicht verstümmelt werden soll.
 */
export function toStoredTime(raw: string | null | undefined): string | null {
  const normalized = normalizeTime(raw)
  if (normalized) return normalized
  const fallback = raw ? clean(raw) : ''
  return fallback.length > 0 ? fallback : null
}

/** Ist der Wert bereits eine saubere "HH:MM"-Angabe? */
export function isNormalizedTime(raw: string | null | undefined): boolean {
  if (!raw) return false
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(raw.trim())
}

/**
 * Kurzform für Karten und Listen: "20:00".
 *
 * Nicht parsbarer Altbestand wird unverändert zurückgegeben, ein angehängtes
 * "Uhr" fällt weg, damit die Datums-Badges einheitlich bleiben.
 */
export function formatTimeShort(raw: string | null | undefined): string | null {
  const normalized = normalizeTime(raw)
  if (normalized) return normalized
  if (!raw) return null
  const fallback = clean(raw).replace(/\s*uhr\s*$/i, '')
  return fallback.length > 0 ? fallback : null
}

type TimeLocale = 'de' | 'en'

/**
 * Lange Form für Detailseite und Newsletter.
 *
 * Mit Endzeit: "20:00 bis 22:00 Uhr" (EN: "20:00 to 22:00").
 * Ohne Endzeit: "20:00 Uhr" (EN: "20:00").
 *
 * "Uhr" wird nur an geparste Werte gehängt. Sonst stünde bei einem alten
 * Eintrag wie "20:00 Uhr, Einlass 19:30" am Ende zweimal "Uhr".
 */
export function formatTimeRange(
  start: string | null | undefined,
  end: string | null | undefined,
  locale: TimeLocale = 'de'
): string | null {
  const startNormalized = normalizeTime(start)
  const endNormalized = normalizeTime(end)

  if (!startNormalized) {
    // Altbestand oder Freitext: unverändert ausgeben, nichts anhängen.
    if (!start) return null
    const fallback = clean(start)
    return fallback.length > 0 ? fallback : null
  }

  if (endNormalized && endNormalized !== startNormalized) {
    return locale === 'en'
      ? `${startNormalized} to ${endNormalized}`
      : `${startNormalized} bis ${endNormalized} Uhr`
  }

  return locale === 'en' ? startNormalized : `${startNormalized} Uhr`
}
