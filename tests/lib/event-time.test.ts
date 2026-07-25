import { describe, it, expect } from 'vitest'
import {
  formatTimeRange,
  formatTimeShort,
  isNormalizedTime,
  normalizeTime,
  toStoredTime,
} from '@/lib/event-time'

/**
 * Die Beispiele stammen aus den Werten, die tatsächlich im Uhrzeit-Feld
 * standen, bevor das Formular einen Zeit-Picker bekommen hat.
 */
describe('normalizeTime', () => {
  it('nimmt saubere Zeiten unverändert an', () => {
    expect(normalizeTime('20:00')).toBe('20:00')
    expect(normalizeTime('09:30')).toBe('09:30')
  })

  it('entfernt Zusätze und füllt Stunden auf', () => {
    expect(normalizeTime('20:00 Uhr')).toBe('20:00')
    expect(normalizeTime('ab 20')).toBe('20:00')
    expect(normalizeTime('20 Uhr')).toBe('20:00')
    expect(normalizeTime('9:5')).toBe('09:05')
    expect(normalizeTime('19.30 Uhr')).toBe('19:30')
  })

  it('verträgt geschützte Leerzeichen aus Word-Copy-Paste', () => {
    expect(normalizeTime('20:00 Uhr')).toBe('20:00')
  })

  it('liefert null, wenn keine Uhrzeit drinsteht', () => {
    expect(normalizeTime(null)).toBeNull()
    expect(normalizeTime('')).toBeNull()
    expect(normalizeTime('   ')).toBeNull()
    expect(normalizeTime('nach Vereinbarung')).toBeNull()
  })

  it('weist unmögliche Uhrzeiten ab', () => {
    expect(normalizeTime('25:00')).toBeNull()
    expect(normalizeTime('99')).toBeNull()
  })
})

describe('isNormalizedTime', () => {
  it('trennt saubere Werte vom Altbestand', () => {
    expect(isNormalizedTime('20:00')).toBe(true)
    expect(isNormalizedTime('20:00 Uhr')).toBe(false)
    expect(isNormalizedTime('ab 20')).toBe(false)
    expect(isNormalizedTime(null)).toBe(false)
  })
})

describe('toStoredTime', () => {
  it('vereinheitlicht, was sich vereinheitlichen lässt', () => {
    expect(toStoredTime('ab 20 Uhr')).toBe('20:00')
    expect(toStoredTime('')).toBeNull()
  })

  it('lässt Freitext stehen, statt ihn zu verlieren', () => {
    expect(toStoredTime('nach Vereinbarung')).toBe('nach Vereinbarung')
  })
})

describe('formatTimeShort', () => {
  it('zeigt auf Karten nur die reine Zeit', () => {
    expect(formatTimeShort('20:00 Uhr')).toBe('20:00')
    expect(formatTimeShort('ab 17')).toBe('17:00')
  })

  it('reicht Freitext ohne Uhr-Suffix durch', () => {
    expect(formatTimeShort('nach Vereinbarung')).toBe('nach Vereinbarung')
    expect(formatTimeShort(null)).toBeNull()
  })
})

describe('formatTimeRange', () => {
  it('baut die Spanne mit "bis", nicht mit einem Strich', () => {
    expect(formatTimeRange('20:00', '22:00')).toBe('20:00 bis 22:00 Uhr')
  })

  it('lässt die Endzeit weg, wenn keine gepflegt ist', () => {
    expect(formatTimeRange('20:00', null)).toBe('20:00 Uhr')
    expect(formatTimeRange('20:00', '')).toBe('20:00 Uhr')
  })

  it('macht aus gleicher Start- und Endzeit keine Spanne', () => {
    expect(formatTimeRange('20:00', '20:00')).toBe('20:00 Uhr')
  })

  it('übersetzt für die englische Seite', () => {
    expect(formatTimeRange('20:00', '22:00', 'en')).toBe('20:00 to 22:00')
    expect(formatTimeRange('20:00', null, 'en')).toBe('20:00')
  })

  it('hängt an Freitext kein zweites "Uhr" an', () => {
    expect(formatTimeRange('nach Vereinbarung', null)).toBe('nach Vereinbarung')
  })

  it('normalisiert auch den Altbestand', () => {
    expect(formatTimeRange('ab 20', '22 Uhr')).toBe('20:00 bis 22:00 Uhr')
  })

  it('liefert null ohne Angabe', () => {
    expect(formatTimeRange(null, null)).toBeNull()
    expect(formatTimeRange(null, '22:00')).toBeNull()
  })
})
