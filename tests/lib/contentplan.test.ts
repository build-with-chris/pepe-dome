/**
 * Rechenregeln des Contentplans
 *
 * An diesen Zahlen hängen Entscheidungen mit Geld dahinter: ab wann Budget
 * fließt und wann ein zusätzlicher Schnitt-Slot fällig ist. Die Tests halten
 * vor allem die Fälle fest, in denen eine plausible Vereinfachung falsch wäre:
 * halbe Messwerte, eine zu kleine Stichprobe und der Aufbaupfad des Puffers.
 */

import { describe, it, expect } from 'vitest'
import {
  BUFFER_TARGET,
  baselineMedian,
  budgetOverdue,
  bufferCount,
  bufferStatus,
  bufferTargetOn,
  costPerResult,
  engagement48,
  isWinner,
  median,
  nextBufferStep,
  scaledCount,
  suggestedThreshold,
  type ReelMetrics,
  type ReelStatus,
} from '@/lib/contentplan'

function reel(position: number, overrides: Partial<ReelMetrics> = {}): ReelMetrics {
  return {
    position,
    status: 'PUBLISHED' as ReelStatus,
    publishedAt: new Date('2026-08-06T18:00:00+02:00'),
    shares48: 10,
    saves48: 20,
    shares72: 12,
    saves72: 24,
    budgetReleasedAt: null,
    spendCents: null,
    results: null,
    ...overrides,
  }
}

describe('median', () => {
  it('nimmt bei ungerader Anzahl den mittleren Wert', () => {
    expect(median([5, 1, 3])).toBe(3)
  })

  it('mittelt bei gerader Anzahl zwischen den beiden mittleren', () => {
    expect(median([1, 2, 3, 4])).toBe(2.5)
  })

  it('gibt bei leerer Reihe null statt NaN', () => {
    expect(median([])).toBeNull()
  })
})

describe('engagement48', () => {
  it('addiert Shares und Saves', () => {
    expect(engagement48({ shares48: 41, saves48: 88 })).toBe(129)
  })

  it('ist null, sobald eine der beiden Zahlen fehlt', () => {
    // Eine halbe Summe sähe aus wie ein schwaches Reel und würde die Baseline
    // nach unten ziehen.
    expect(engagement48({ shares48: 41, saves48: null })).toBeNull()
    expect(engagement48({ shares48: null, saves48: 88 })).toBeNull()
  })
})

describe('baselineMedian', () => {
  it('braucht fünf vollständige Reels', () => {
    const reels = [1, 2, 3, 4].map((position) => reel(position))
    expect(baselineMedian(reels)).toBeNull()
  })

  it('nimmt die ersten fünf nach Position, nicht die ersten fünf der Liste', () => {
    const reels = [
      reel(9, { shares48: 500, saves48: 500 }),
      reel(1, { shares48: 10, saves48: 10 }),
      reel(2, { shares48: 20, saves48: 20 }),
      reel(3, { shares48: 30, saves48: 30 }),
      reel(4, { shares48: 40, saves48: 40 }),
      reel(5, { shares48: 50, saves48: 50 }),
    ]
    // Median aus 20, 40, 60, 80, 100 ist 60. Das starke Reel 9 zählt nicht mit.
    expect(baselineMedian(reels)).toBe(60)
  })

  it('überspringt Reels ohne vollständige Zahlen', () => {
    const reels = [
      reel(1, { shares48: 10, saves48: 10 }),
      reel(2, { shares48: 20, saves48: null }),
      reel(3, { shares48: 30, saves48: 30 }),
      reel(4, { shares48: 40, saves48: 40 }),
      reel(5, { shares48: 50, saves48: 50 }),
    ]
    // Nur vier verwertbare Reels, also noch keine Baseline.
    expect(baselineMedian(reels)).toBeNull()
  })

  it('zählt nur veröffentlichte Reels', () => {
    const reels = [1, 2, 3, 4, 5].map((position) =>
      reel(position, { status: position === 3 ? 'EDITED' : 'PUBLISHED' })
    )
    expect(baselineMedian(reels)).toBeNull()
  })
})

describe('suggestedThreshold', () => {
  it('schlägt das Doppelte des Medians vor', () => {
    expect(suggestedThreshold(60)).toBe(120)
  })

  it('bleibt ohne Baseline null', () => {
    expect(suggestedThreshold(null)).toBeNull()
  })
})

describe('isWinner', () => {
  it('ist null, solange keine Schwelle fixiert ist', () => {
    // Nicht false: false hieße "geprüft und durchgefallen", und danach würde
    // niemand mehr nachsehen, ob überhaupt eine Schwelle existiert.
    expect(isWinner(reel(1), null)).toBeNull()
  })

  it('zählt Gleichstand als Gewinner', () => {
    expect(isWinner(reel(1, { shares48: 60, saves48: 60 }), 120)).toBe(true)
  })

  it('ist null, wenn die Zahlen noch fehlen', () => {
    expect(isWinner(reel(1, { shares48: null, saves48: null }), 120)).toBeNull()
  })
})

describe('bufferCount', () => {
  it('zählt nur fertig geschnittene, ungepostete Reels', () => {
    const reels = [
      { status: 'PLANNED' as ReelStatus },
      { status: 'FILMED' as ReelStatus },
      { status: 'EDITED' as ReelStatus },
      { status: 'EDITED' as ReelStatus },
      { status: 'PUBLISHED' as ReelStatus },
    ]
    expect(bufferCount(reels)).toBe(2)
  })
})

describe('bufferTargetOn', () => {
  it('verlangt in der ersten Woche noch nichts', () => {
    // Der Sollwert von 4 wäre rechnerisch unerreichbar, solange erst gedreht
    // und geschnitten werden muss.
    expect(bufferTargetOn(new Date('2026-08-05T12:00:00+02:00'))).toBe(0)
  })

  it('zählt eine Stufe erst nach ihrem Stichtag', () => {
    expect(bufferTargetOn(new Date('2026-08-09T20:00:00+02:00'))).toBe(0)
    expect(bufferTargetOn(new Date('2026-08-10T09:00:00+02:00'))).toBe(1)
  })

  it('steigt über den Aufbaupfad auf den Sollwert', () => {
    expect(bufferTargetOn(new Date('2026-08-17T09:00:00+02:00'))).toBe(2)
    expect(bufferTargetOn(new Date('2026-08-24T09:00:00+02:00'))).toBe(3)
    expect(bufferTargetOn(new Date('2026-08-31T09:00:00+02:00'))).toBe(BUFFER_TARGET)
  })

  it('bleibt danach beim Sollwert', () => {
    expect(bufferTargetOn(new Date('2026-10-20T09:00:00+02:00'))).toBe(BUFFER_TARGET)
  })
})

describe('nextBufferStep', () => {
  it('nennt die nächste offene Stufe', () => {
    const next = nextBufferStep(new Date('2026-08-11T09:00:00+02:00'))
    expect(next?.target).toBe(2)
  })

  it('ist nach dem Aufbaupfad null', () => {
    expect(nextBufferStep(new Date('2026-09-15T09:00:00+02:00'))).toBeNull()
  })
})

describe('bufferStatus', () => {
  it('meldet eine Unterdeckung', () => {
    const reels = [{ status: 'EDITED' as ReelStatus }]
    const status = bufferStatus(reels, new Date('2026-08-31T09:00:00+02:00'))
    expect(status.count).toBe(1)
    expect(status.required).toBe(4)
    expect(status.ok).toBe(false)
  })

  it('ist in der Aufbauphase auch mit leerem Puffer in Ordnung', () => {
    const status = bufferStatus([], new Date('2026-08-05T09:00:00+02:00'))
    expect(status.ok).toBe(true)
  })
})

describe('budgetOverdue', () => {
  const threshold = 100
  const published = new Date('2026-09-03T18:00:00+02:00')
  const winner = reel(6, { publishedAt: published, shares48: 60, saves48: 60 })

  it('schlägt an, wenn ein Gewinner nach 48 Stunden kein Budget hat', () => {
    const now = new Date('2026-09-05T19:00:00+02:00')
    expect(budgetOverdue(winner, threshold, now)).toBe(true)
  })

  it('schweigt innerhalb der 48 Stunden', () => {
    const now = new Date('2026-09-05T17:00:00+02:00')
    expect(budgetOverdue(winner, threshold, now)).toBe(false)
  })

  it('schweigt, wenn das Budget freigegeben ist', () => {
    const released = { ...winner, budgetReleasedAt: new Date('2026-09-04T10:00:00+02:00') }
    expect(budgetOverdue(released, threshold, new Date('2026-09-10T10:00:00+02:00'))).toBe(false)
  })

  it('schweigt ohne fixierte Schwelle', () => {
    // Solange keine Schwelle steht, läuft laut Plan gar kein Budget. Eine
    // Warnung wäre hier nur Rauschen.
    expect(budgetOverdue(winner, null, new Date('2026-09-10T10:00:00+02:00'))).toBe(false)
  })
})

describe('costPerResult', () => {
  it('rechnet Cent in Euro pro Ergebnis um', () => {
    expect(costPerResult(12000, 3000)).toBeCloseTo(0.04, 5)
  })

  it('ist ohne Ergebnisse null statt unendlich', () => {
    expect(costPerResult(12000, 0)).toBeNull()
    expect(costPerResult(12000, null)).toBeNull()
  })
})

describe('scaledCount', () => {
  it('zählt die Creatives mit Budget', () => {
    const reels = [
      { budgetReleasedAt: new Date() },
      { budgetReleasedAt: null },
      { budgetReleasedAt: new Date() },
    ]
    expect(scaledCount(reels)).toBe(2)
  })
})
