import { describe, it, expect } from 'vitest'
import { isPermanentlyUnprocessable, PERMANENT_PRISMA_CODES } from '@/lib/webhook-errors'

/**
 * Hintergrund: Live liefen im Minutentakt 500er auf /api/webhooks/resend, weil
 * die `newsletter_id` in den Tags einer Mail auf einen gelöschten Newsletter
 * zeigte. Der Fremdschlüssel schlug an, die Route antwortete 500, Resend wertete
 * das als "später nochmal" und stellte dasselbe Ereignis endlos erneut zu.
 *
 * Diese Regel entscheidet, ob ein Fehler wiederholbar ist. Sie falsch zu ziehen
 * kostet in beide Richtungen etwas:
 *   zu weit  → echte Ereignisse werden still verworfen
 *   zu eng   → eine Endlosschleife wie oben
 */
describe('isPermanentlyUnprocessable', () => {
  describe('dauerhaft: bestätigen und nicht erneut zustellen lassen', () => {
    it('erkennt P2003 (Fremdschlüssel verletzt) — der Fall aus der Produktion', () => {
      const error = Object.assign(
        new Error('Foreign key constraint violated on the constraint: `newsletter_events_newsletter_id_fkey`'),
        { code: 'P2003', clientVersion: '6.19.0' }
      )
      expect(isPermanentlyUnprocessable(error)).toBe(true)
    })

    it('erkennt P2025 (Datensatz nicht gefunden)', () => {
      const error = Object.assign(new Error('Record to update not found.'), { code: 'P2025' })
      expect(isPermanentlyUnprocessable(error)).toBe(true)
    })
  })

  describe('vorübergehend: 5xx zurückgeben, damit Resend erneut zustellt', () => {
    it.each([
      ['P1001', 'Datenbank nicht erreichbar'],
      ['P1002', 'Zeitüberschreitung beim Verbindungsaufbau'],
      ['P1008', 'Operations timed out'],
      ['P2024', 'Timeout beim Holen einer Verbindung aus dem Pool'],
    ])('behandelt %s (%s) als wiederholbar', (code) => {
      expect(isPermanentlyUnprocessable(Object.assign(new Error('x'), { code }))).toBe(false)
    })

    it('behandelt einen gewöhnlichen Fehler ohne code als wiederholbar', () => {
      expect(isPermanentlyUnprocessable(new Error('irgendwas ging schief'))).toBe(false)
    })

    it('behandelt einen TypeError im Handler als wiederholbar', () => {
      expect(isPermanentlyUnprocessable(new TypeError('a.find is not a function'))).toBe(false)
    })
  })

  describe('robust gegen alles, was sonst im catch landen kann', () => {
    it.each([
      ['null', null],
      ['undefined', undefined],
      ['String', 'P2003'],
      ['Zahl', 42],
      ['leeres Objekt', {}],
      ['Objekt mit nicht-String-code', { code: 2003 }],
    ])('wirft bei %s nicht und meldet nicht dauerhaft', (_label, value) => {
      expect(() => isPermanentlyUnprocessable(value)).not.toThrow()
      expect(isPermanentlyUnprocessable(value)).toBe(false)
    })
  })

  describe('Umfang der Liste', () => {
    it('enthält genau die zwei begründeten Codes', () => {
      // Absichtlich streng: jeder zusätzliche Code bedeutet, dass Ereignisse
      // still verworfen werden. Das soll auffallen, nicht durchrutschen.
      expect([...PERMANENT_PRISMA_CODES].sort()).toEqual(['P2003', 'P2025'])
    })
  })
})
