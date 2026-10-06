import { describe, it, expect } from 'vitest'
import { versandBasis, quote } from '@/lib/newsletter-rates'

describe('versandBasis', () => {
  it('nimmt die Empfängerzahl am Newsletter, wenn sie gesetzt ist', () => {
    expect(versandBasis(1600, { sentCount: 1600, deliveredCount: 1590 })).toBe(1600)
  })

  it('fällt auf die Statistik zurück, wenn der Versand abgebrochen ist', () => {
    // So sah "Nudeln mit Banane" aus: Mails draussen, recipientCount 0.
    expect(versandBasis(0, { sentCount: 0, deliveredCount: 1580 })).toBe(1580)
    expect(versandBasis(0, { sentCount: 800 })).toBe(800)
  })

  it('ist 0 ohne jede Angabe', () => {
    expect(versandBasis(0, null)).toBe(0)
  })
})

describe('quote', () => {
  it('rechnet Prozent mit einer Nachkommastelle', () => {
    expect(quote(400, 1600)).toBe('25.0')
  })

  it('gibt null statt 0 % zurück, wenn es keine Basis gibt', () => {
    expect(quote(12, 0)).toBeNull()
  })
})
