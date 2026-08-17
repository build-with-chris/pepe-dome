/**
 * Mehrtägige Termine bleiben bis zum letzten Tag sichtbar.
 *
 * Anlass: Der "Dome Crew Mitmachzirkus" lief vom 15. bis 21. August und war ab
 * dem 16. von der Terminseite verschwunden, weil überall nur das Startdatum
 * verglichen wurde. Sieben Tage Programm, sechs davon unsichtbar.
 */

import { describe, it, expect } from 'vitest'
import {
  endeVon,
  formatEventDateRange,
  imMonatFilter,
  laeuftNoch,
  nichtVorbeiFilter,
  tagesbeginn,
} from '@/lib/event-window'

const mitmachzirkus = { date: '2026-08-15T00:00:00.000Z', endDate: '2026-08-21T00:00:00.000Z' }
const eintaegig = { date: '2026-08-15T00:00:00.000Z', endDate: null }

describe('tagesbeginn', () => {
  it('schneidet die Uhrzeit ab', () => {
    const t = tagesbeginn(new Date('2026-08-16T19:30:00'))
    expect(t.getHours()).toBe(0)
    expect(t.getMinutes()).toBe(0)
    expect(t.getDate()).toBe(16)
  })
})

describe('endeVon', () => {
  it('nimmt endDate, wenn eins da ist', () => {
    expect(endeVon(mitmachzirkus).toISOString()).toBe('2026-08-21T00:00:00.000Z')
  })

  it('faellt ohne endDate auf das Startdatum zurueck', () => {
    expect(endeVon(eintaegig).toISOString()).toBe('2026-08-15T00:00:00.000Z')
  })
})

describe('laeuftNoch', () => {
  it('zeigt einen mehrtaegigen Termin auch nach dem ersten Tag', () => {
    // Genau der gemeldete Fall.
    expect(laeuftNoch(mitmachzirkus, new Date('2026-08-16T00:00:00.000Z'))).toBe(true)
  })

  it('zeigt ihn noch am letzten Tag', () => {
    expect(laeuftNoch(mitmachzirkus, new Date('2026-08-21T00:00:00.000Z'))).toBe(true)
  })

  it('blendet ihn am Tag nach dem Ende aus', () => {
    expect(laeuftNoch(mitmachzirkus, new Date('2026-08-22T00:00:00.000Z'))).toBe(false)
  })

  it('behandelt eintaegige Termine wie bisher', () => {
    expect(laeuftNoch(eintaegig, new Date('2026-08-15T00:00:00.000Z'))).toBe(true)
    expect(laeuftNoch(eintaegig, new Date('2026-08-16T00:00:00.000Z'))).toBe(false)
  })
})

describe('nichtVorbeiFilter', () => {
  it('fragt endDate ab und faengt eintaegige Termine ueber endDate null ab', () => {
    // Ohne den null-Zweig traefe ein gte auf leerer Spalte nichts und alle
    // eintaegigen Termine waeren verschwunden.
    const stichtag = new Date('2026-08-16T00:00:00.000Z')
    expect(nichtVorbeiFilter(stichtag)).toEqual({
      OR: [
        { endDate: { gte: stichtag } },
        { endDate: null, date: { gte: stichtag } },
      ],
    })
  })
})

describe('formatEventDateRange', () => {
  it('nennt den Zeitraum, nicht nur den ersten Tag', () => {
    // Auf der Karte stand vorher bloss "15. Aug. 2026", obwohl der Termin die
    // ganze Woche laeuft.
    expect(formatEventDateRange(mitmachzirkus, 'de-DE')).toBe('15. bis 21. Aug. 2026')
  })

  it('nennt den Monat zweimal, wenn er wechselt', () => {
    const ueberMonatsgrenze = { date: '2026-08-30T00:00:00.000Z', endDate: '2026-09-03T00:00:00.000Z' }
    expect(formatEventDateRange(ueberMonatsgrenze, 'de-DE')).toBe(
      '30. Aug. 2026 bis 3. Sept. 2026'
    )
  })

  it('bleibt bei eintaegigen Terminen bei der alten Ausgabe', () => {
    expect(formatEventDateRange(eintaegig, 'de-DE')).toBe('15. Aug. 2026')
  })

  it('behandelt endDate am selben Tag wie eintaegig', () => {
    const gleicherTag = { date: '2026-08-15T00:00:00.000Z', endDate: '2026-08-15T00:00:00.000Z' }
    expect(formatEventDateRange(gleicherTag, 'de-DE')).toBe('15. Aug. 2026')
  })

  it('schreibt auf Englisch beide Seiten voll aus', () => {
    // Im Englischen steht der Monat vorn. Die deutsche Kurzform ergaebe hier
    // "15 to Aug 21, 2026" und damit keinen Satz.
    expect(formatEventDateRange(mitmachzirkus, 'en-US')).toBe('Aug 15, 2026 to Aug 21, 2026')
  })

  it('benutzt keinen Gedankenstrich', () => {
    const text = formatEventDateRange(mitmachzirkus, 'de-DE')
    expect(text).not.toMatch(/[—–]/)
  })

  it('rechnet in UTC, damit das Datum nicht westlich von Greenwich verrutscht', () => {
    // Die Termine liegen als Mitternacht UTC in der Datenbank. Ohne feste
    // Zeitzone sah ein Besucher in New York den 14. statt den 15.
    expect(formatEventDateRange(eintaegig, 'de-DE')).toContain('15.')
  })
})

describe('imMonatFilter', () => {
  it('greift ueber Ueberschneidung, nicht ueber den Beginn', () => {
    const start = new Date('2026-09-01T00:00:00.000Z')
    const ende = new Date('2026-09-30T23:59:59.000Z')
    expect(imMonatFilter(start, ende)).toEqual({
      date: { lte: ende },
      OR: [
        { endDate: { gte: start } },
        { endDate: null, date: { gte: start } },
      ],
    })
  })

  it('holt einen Termin vom 30.8. bis 3.9. in den September', () => {
    // Gegenprobe zur Bedingung oben, von Hand nachgerechnet.
    const start = new Date('2026-09-01T00:00:00.000Z')
    const ende = new Date('2026-09-30T23:59:59.000Z')
    const termin = { date: new Date('2026-08-30T00:00:00.000Z'), endDate: new Date('2026-09-03T00:00:00.000Z') }
    expect(termin.date <= ende && termin.endDate >= start).toBe(true)
  })
})
