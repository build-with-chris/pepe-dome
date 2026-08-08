/**
 * Der Sprachwechsel darf die Kampagnenparameter nicht verlieren.
 *
 * Wer über eine Anzeige kommt, trägt utm_source und Verwandte in der URL. Der
 * Umschalter baute den neuen Pfad allein aus dem Pfadnamen, die Query fiel weg.
 * Damit war jeder Besuch, der einmal die Sprache wechselt, für die Auswertung
 * anonym. Die Middleware macht es richtig, deshalb hier nur die Pfadlogik.
 */

import { describe, it, expect } from 'vitest'
import { switchLocalePath } from '@/lib/locale-path'

describe('switchLocalePath', () => {
  it('tauscht den Sprachteil und behält die Query', () => {
    expect(switchLocalePath('/de/events', 'utm_source=instagram&utm_campaign=august', 'en')).toBe(
      '/en/events?utm_source=instagram&utm_campaign=august'
    )
  })

  it('kommt ohne Query zurecht', () => {
    expect(switchLocalePath('/de/events', '', 'en')).toBe('/en/events')
    expect(switchLocalePath('/de/events', null, 'en')).toBe('/en/events')
  })

  it('behält tiefe Pfade', () => {
    expect(switchLocalePath('/de/events/qigong-am-morgen', 'utm_source=meta', 'en')).toBe(
      '/en/events/qigong-am-morgen?utm_source=meta'
    )
  })

  it('funktioniert auf der Startseite', () => {
    expect(switchLocalePath('/de', 'utm_source=meta', 'en')).toBe('/en?utm_source=meta')
  })

  it('lässt ein vorangestelltes Fragezeichen nicht doppelt werden', () => {
    expect(switchLocalePath('/de', '?utm_source=meta', 'en')).toBe('/en?utm_source=meta')
  })
})
