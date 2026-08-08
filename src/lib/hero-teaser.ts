/**
 * Der nächste Termin für den ersten Bildschirm.
 *
 * Oberhalb der Falte stand bisher nichts Konkretes: Titel, Untertitel, zwei
 * Buttons. Wer aus einer Anzeige kommt, will als Erstes wissen, wann etwas
 * stattfindet und was es kostet. Die Termine liegen im Server-Render der
 * Startseite ohnehin bereit, es fehlte nur die Zeile.
 */

import { formatTimeRange } from '@/lib/event-time'
import { isFreeEntry } from '@/lib/event-price'

type TeaserLocale = 'de' | 'en'

/** Das Wenige, was die Zeile aus einem Termin braucht. */
export interface TeaserEvent {
  slug: string
  title: string
  /** ISO-Zeichenkette wie sie transformEvent liefert. */
  date: string
  time?: string | null
  price?: string | null
}

export interface HeroTeaser {
  slug: string
  title: string
  /** Fertig formatiert, etwa "Freitag, 14. August, 20:00 Uhr". */
  when: string
  free: boolean
}

/**
 * Nimmt den nächsten anstehenden Termin und formatiert ihn als Satzteil.
 *
 * Ein Termin von heute zählt noch dazu: ein Abendtermin am selben Tag ist die
 * beste Nachricht, die die Seite hat. `null`, wenn nichts ansteht, dann bleibt
 * die Zeile weg statt leer zu stehen.
 */
export function heroTeaser(
  events: TeaserEvent[],
  lang: TeaserLocale,
  now: Date = new Date()
): HeroTeaser | null {
  const heute = new Date(now)
  heute.setHours(0, 0, 0, 0)

  const naechster = events
    .filter((event) => new Date(event.date) >= heute)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0]

  if (!naechster) return null

  const dateLocale = lang === 'en' ? 'en-US' : 'de-DE'
  const tag = new Date(naechster.date).toLocaleDateString(dateLocale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  })
  const uhrzeit = formatTimeRange(naechster.time, null, lang)

  return {
    slug: naechster.slug,
    title: naechster.title,
    when: uhrzeit ? `${tag}, ${uhrzeit}` : tag,
    free: isFreeEntry(naechster.price),
  }
}
