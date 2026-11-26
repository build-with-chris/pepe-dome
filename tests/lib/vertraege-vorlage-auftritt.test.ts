/**
 * Vorlage für Künstlervertrag und Veranstaltervertrag.
 *
 * Die Vorlage ist ein Grundgerüst. Fest im Vertrag stehen nur die Aufteilung
 * der Ticketeinnahmen oder die Gage und dass die Gastronomie beim Pepe Dome
 * bleibt. Alles andere ist Freitext und erscheint nur, wenn etwas eingetragen
 * ist. Diese Tests halten vor allem fest, dass die Vorlage zu den offenen
 * Punkten nichts von sich aus behauptet.
 *
 * Alle Namen und Zahlen hier sind erfunden.
 */

import { describe, it, expect } from 'vitest'
import { dokumentAlsText, ueberschriften } from '@/lib/vertraege/dokument'
import { auftrittFelder } from '@/lib/vertraege/formular'
import { betraegeAus, vertragSchema } from '@/lib/vertraege/validation'
import { dokumentAus } from '@/lib/vertraege/vorlage'

const basis = {
  partnerName: 'Duo Beispiel',
  partnerEmail: 'duo@example.org',
  eventDate: '2031-05-17',
  data: {
    titel: 'Beispielshow',
    termin: 'Samstag, 17.05.2031',
    aufbauAb: '15:00',
    einlass: '19:00 Uhr',
    beginn: '20:00',
    ende: '',
    anteilGegenseite: '55',
  },
}

function bauen(type: 'KUENSTLER' | 'VERANSTALTER', aenderung: Record<string, unknown> = {}) {
  const dokument = dokumentAus(
    vertragSchema.parse({ ...basis, type, data: { ...basis.data, ...aenderung } })
  )
  return { dokument, text: dokumentAlsText(dokument), titel: ueberschriften(dokument) }
}

describe.each([
  ['KUENSTLER', 'Vereinbarung über einen Auftritt', 'Künstlervertrag Beispielshow Duo Beispiel'],
  ['VERANSTALTER', 'Vereinbarung über eine Veranstaltung', 'Veranstaltervertrag Beispielshow Duo Beispiel'],
] as const)('%s mit Ticketanteil', (type, kopf, dateititel) => {
  const { dokument, text, titel } = bauen(type)

  it('hat Kopf mit Logo, beide Parteien und zwei Unterschriften', () => {
    expect(dokument.bausteine[0]).toMatchObject({ art: 'kopf', titel: kopf, untertitel: 'Beispielshow', logo: true })
    expect(dokument.titel).toBe(dateititel)
    expect(dokument.akzent).toBe(true)
    expect(dokument.fuss).toContain('Pepe Dome')
    expect(text).toContain('Zwischen dem Pepe Dome, vertreten durch Christoph Hermann,')
    expect(text).toContain('Duo Beispiel, E-Mail: duo@example.org')
    expect(text).toContain('[Unterschrift] Ort, Datum, Christoph Hermann, Pepe Dome')
    expect(text).toContain('[Unterschrift] Ort, Datum, Duo Beispiel')
  })

  it('besteht ohne Freitext nur aus Veranstaltung, Einnahmen und Unterschriften', () => {
    expect(titel).toEqual(['1. Veranstaltung', '2. Einnahmen', 'Unterschriften'])
  })

  it('nennt Termin und nur die eingetragenen Zeiten', () => {
    expect(text).toContain('Beispielshow im Pepe Dome, Ostpark München.')
    expect(text).toContain('Samstag, 17.05.2031.')
    expect(text).toContain('Aufbau ab 15:00 Uhr, Einlass 19:00 Uhr, Beginn 20:00 Uhr.')
    expect(text).not.toContain('Ende')
  })

  it('teilt die Ticketeinnahmen und lässt die Gastronomie beim Pepe Dome', () => {
    expect(text).toContain('Die Ticketeinnahmen werden geteilt: 55 % für Duo Beispiel, 45 % für den Pepe Dome.')
    expect(text).toContain('Die Einnahmen aus der Gastronomie gehen an den Pepe Dome.')
  })

  it('behauptet nichts zu den Punkten, die noch nicht geklärt sind', () => {
    for (const wort of ['Ausfall', 'Absage', 'höhere Gewalt', 'Höhere Gewalt', 'Hausordnung', 'Abrechnung', 'Technik', 'Gage']) {
      expect(text).not.toContain(wort)
    }
  })

  it('macht aus jedem ausgefüllten Freitext einen eigenen, nummerierten Abschnitt', () => {
    const voll = bauen(type, {
      zahlung: 'Zahlung nach Absprache.',
      ausfall: 'Erster Absatz.\n\nZweiter Absatz.',
      hoehereGewalt: 'Text zur höheren Gewalt.',
      bedingungen: 'Text zu den Bedingungen.',
      erwartungen: 'Text zu den Erwartungen.',
      sonderabsprache: 'Sonstiges.',
    })
    expect(voll.titel).toEqual([
      '1. Veranstaltung',
      '2. Einnahmen',
      '3. Abrechnung und Zahlung',
      '4. Ausfall und Absage',
      '5. Höhere Gewalt',
      '6. Bedingungen vor Ort',
      '7. Was der Pepe Dome erwartet',
      '8. Sonderabsprache',
      'Unterschriften',
    ])
    expect(voll.text).toContain('4. Ausfall und Absage\nErster Absatz.\nZweiter Absatz.')
  })

  it('nummeriert ohne Lücke, wenn nur ein Freitext ausgefüllt ist', () => {
    expect(bauen(type, { bedingungen: 'Text.' }).titel).toEqual([
      '1. Veranstaltung',
      '2. Einnahmen',
      '3. Bedingungen vor Ort',
      'Unterschriften',
    ])
  })

  it('lässt beide Anteile offen, wenn keiner eingetragen ist', () => {
    expect(bauen(type, { anteilGegenseite: '' }).text).toContain(
      '________ % für Duo Beispiel, ________ % für den Pepe Dome'
    )
  })

  it.each([
    ['ohne Titel', { titel: '' }],
    ['ohne Termin', { termin: '' }],
    ['mit mehr als 100 Prozent Anteil', { anteilGegenseite: '130' }],
  ])('wird %s abgelehnt', (_fall, aenderung) => {
    const ergebnis = vertragSchema.safeParse({ ...basis, type, data: { ...basis.data, ...aenderung } })
    expect(ergebnis.success).toBe(false)
  })
})

describe('Künstlervertrag mit fester Gage', () => {
  const { text, titel } = bauen('KUENSTLER', { verguetung: 'gage', gage: '777,50', foerderung: 'Beispielförderung' })

  it('nennt Gage und Förderung statt einer Aufteilung', () => {
    expect(titel).toEqual(['1. Veranstaltung', '2. Gage', 'Unterschriften'])
    expect(text).toContain('Duo Beispiel erhält für den Auftritt eine feste Gage von 777,50 €.')
    expect(text).toContain('Die Gage wird aus der Förderung „Beispielförderung“ bezahlt.')
    expect(text).toContain('Die Einnahmen aus der Gastronomie gehen an den Pepe Dome.')
    expect(text).not.toContain('Ticketeinnahmen')
  })

  it('lässt den Satz zur Förderung weg, wenn keine eingetragen ist', () => {
    expect(bauen('KUENSTLER', { verguetung: 'gage', gage: '777' }).text).not.toContain('Förderung')
  })

  it('lässt eine fehlende Gage als Linie zum Ausfüllen', () => {
    expect(bauen('KUENSTLER', { verguetung: 'gage' }).text).toContain('feste Gage von ________ €')
  })
})

describe('Veranstaltervertrag', () => {
  it('kennt keine feste Gage', () => {
    const ergebnis = vertragSchema.safeParse({
      ...basis,
      type: 'VERANSTALTER',
      data: { ...basis.data, verguetung: 'gage', gage: '777' },
    })
    expect(ergebnis.success).toBe(false)
  })
})

describe('Vorbelegung', () => {
  it('übernimmt nur den Ticketanteil, nie die Gage', () => {
    const gespeichert = vertragSchema.parse({
      ...basis,
      type: 'KUENSTLER',
      data: { ...basis.data, verguetung: 'gage', gage: '777' },
    }).data
    expect(betraegeAus('KUENSTLER', gespeichert)).toEqual({ anteilGegenseite: 55 })
    expect(auftrittFelder(betraegeAus('KUENSTLER', gespeichert))).toMatchObject({
      anteilGegenseite: '55',
      gage: '',
      titel: '',
      verguetung: 'ticketanteil',
    })
  })

  it('startet ohne gepflegten Standard mit leerem Anteil', () => {
    expect(auftrittFelder(undefined).anteilGegenseite).toBe('')
  })
})
