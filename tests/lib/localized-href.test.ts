import { describe, it, expect } from 'vitest'
import { localizedHref } from '@/i18n/config'

describe('localizedHref', () => {
  it('setzt die Sprache vor lokalisierte Seiten', () => {
    expect(localizedHref('de', '/')).toBe('/de')
    expect(localizedHref('en', '/events')).toBe('/en/events')
    expect(localizedHref('de', '/training')).toBe('/de/training')
  })

  // Der Termin-Link im Hero der Startseite kam ohne Sprache heraus und lief
  // über die Weiterleitung der Middleware, die nach dem Browser entscheidet.
  it('setzt die Sprache auch vor Unterseiten', () => {
    expect(localizedHref('en', '/events/two-gather')).toBe('/en/events/two-gather')
    expect(localizedHref('de', '/news/ein-artikel')).toBe('/de/news/ein-artikel')
    expect(localizedHref('en', '/newsletter/2026-11')).toBe('/en/newsletter/2026-11')
  })

  it('lässt Pfade ausserhalb des Sprachbaums unverändert', () => {
    expect(localizedHref('de', '/admin')).toBe('/admin')
    expect(localizedHref('en', '/mithelfen')).toBe('/mithelfen')
    expect(localizedHref('de', '/unknown')).toBe('/unknown')
  })

  it('verwechselt keinen Pfad, der nur gleich anfängt', () => {
    expect(localizedHref('de', '/eventsarchiv')).toBe('/eventsarchiv')
  })

  it('setzt die Sprache nicht doppelt', () => {
    expect(localizedHref('en', '/de/events')).toBe('/de/events')
  })
})
