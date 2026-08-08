/**
 * Der nächste Termin gehört auf den ersten Bildschirm.
 *
 * Oberhalb der Falte stand bisher nur Titel, Untertitel und zwei Buttons, also
 * nichts Konkretes: kein Datum, kein Preis. Wer aus einer Anzeige kommt, will
 * genau das zuerst wissen. Die Daten liegen im Server-Render ohnehin bereit.
 */

import { describe, it, expect } from 'vitest'
import { heroTeaser } from '@/lib/hero-teaser'

const JETZT = new Date('2026-08-08T12:00:00.000Z')

function event(overrides: Record<string, unknown> = {}) {
  return {
    slug: 'one-united-in-diversity',
    title: 'OnE, United in Diversity',
    date: '2026-08-14T00:00:00.000Z',
    time: '20:00',
    price: 'Eintritt frei',
    ...overrides,
  }
}

describe('heroTeaser', () => {
  it('nennt Wochentag, Datum und Uhrzeit des nächsten Termins', () => {
    const teaser = heroTeaser([event()], 'de', JETZT)

    expect(teaser).not.toBeNull()
    expect(teaser!.slug).toBe('one-united-in-diversity')
    expect(teaser!.when).toBe('Freitag, 14. August, 20:00 Uhr')
  })

  it('überspringt Termine, die schon vorbei sind', () => {
    const teaser = heroTeaser(
      [
        event({ slug: 'vorbei', date: '2026-08-01T00:00:00.000Z' }),
        event({ slug: 'kommt', date: '2026-08-20T00:00:00.000Z' }),
      ],
      'de',
      JETZT
    )

    expect(teaser!.slug).toBe('kommt')
  })

  it('nimmt einen Termin von heute noch mit', () => {
    // Ein Termin heute Abend ist die beste Nachricht, die die Seite hat.
    const teaser = heroTeaser([event({ date: '2026-08-08T00:00:00.000Z' })], 'de', JETZT)

    expect(teaser).not.toBeNull()
    expect(teaser!.when).toContain('8. August')
  })

  it('lässt die Uhrzeit weg, wenn keine hinterlegt ist', () => {
    const teaser = heroTeaser([event({ time: null })], 'de', JETZT)

    expect(teaser!.when).toBe('Freitag, 14. August')
  })

  it('erkennt freien Eintritt', () => {
    expect(heroTeaser([event()], 'de', JETZT)!.free).toBe(true)
    expect(heroTeaser([event({ price: 'ab 12 Euro' })], 'de', JETZT)!.free).toBe(false)
  })

  it('gibt null zurück, wenn kein Termin ansteht', () => {
    expect(heroTeaser([], 'de', JETZT)).toBeNull()
    expect(heroTeaser([event({ date: '2026-01-01T00:00:00.000Z' })], 'de', JETZT)).toBeNull()
  })

  it('schreibt auf Englisch englisch', () => {
    const teaser = heroTeaser([event()], 'en', JETZT)

    expect(teaser!.when).toContain('Friday')
    expect(teaser!.when).toContain('August')
  })
})
