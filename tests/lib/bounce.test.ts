/**
 * Bounce-Erkennung.
 *
 * Anlass: Der Webhook las ausschliesslich `bounce.bounceType` und verglich auf
 * 'Hard'. In allen sechs Bounces, die bis August 2026 eingingen, war das Feld
 * leer, gespeichert wurde jedes Mal "unknown". Jeder Bounce galt damit als
 * weich, ausgetragen wurde nie jemand, und tote Adressen blieben im Verteiler.
 */

import { describe, it, expect } from 'vitest'
import { bounceTyp, istHarterBounce } from '@/lib/bounce'

describe('bounceTyp', () => {
  it('liest bounceType', () => {
    expect(bounceTyp({ bounceType: 'Hard' })).toBe('Hard')
  })

  it('liest ersatzweise type', () => {
    expect(bounceTyp({ type: 'Permanent' })).toBe('Permanent')
  })

  it('liest ersatzweise subType', () => {
    expect(bounceTyp({ subType: 'General' })).toBe('General')
  })

  it('gibt undefined zurueck, wenn nichts ankommt', () => {
    // Genau dieser Fall trat sechsmal ein.
    expect(bounceTyp(undefined)).toBeUndefined()
    expect(bounceTyp(null)).toBeUndefined()
    expect(bounceTyp({})).toBeUndefined()
  })
})

describe('istHarterBounce', () => {
  it('erkennt Hard, egal wie geschrieben', () => {
    expect(istHarterBounce({ bounceType: 'Hard' })).toBe(true)
    expect(istHarterBounce({ bounceType: 'hard' })).toBe(true)
    expect(istHarterBounce({ type: 'HARD' })).toBe(true)
  })

  it('erkennt Permanent aus der SES-Sprache', () => {
    expect(istHarterBounce({ type: 'Permanent' })).toBe(true)
    expect(istHarterBounce({ subType: 'permanent' })).toBe(true)
  })

  it('laesst weiche Bounces in Ruhe', () => {
    // Ein volles Postfach ist morgen vielleicht wieder leer.
    expect(istHarterBounce({ bounceType: 'Soft' })).toBe(false)
    expect(istHarterBounce({ type: 'Transient' })).toBe(false)
  })

  it('traegt bei fehlender Angabe niemanden aus', () => {
    // Im Zweifel bleibt jemand im Verteiler, statt wegen eines unbekannten
    // Feldnamens zu fliegen.
    expect(istHarterBounce(undefined)).toBe(false)
    expect(istHarterBounce({})).toBe(false)
  })
})
