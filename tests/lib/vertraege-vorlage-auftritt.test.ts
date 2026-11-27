/**
 * Vorlage für Künstlervertrag und Veranstaltervertrag.
 *
 * Die Vorlage ist ein Grundgerüst. Fest im Vertrag steht nur, was Chris
 * festgelegt hat: Aufteilung der Ticketeinnahmen oder Gage, Grundlage und
 * Mehrwertsteuer, Gastronomie, Abrechnung und Zahlung. Alles andere ist Freitext und erscheint nur, wenn etwas eingetragen
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
    expect(text).toContain('Zwischen der Circus Akademie München e.V., Ranhazweg 18, 85521 Ottobrunn, Träger des Pepe Dome,')
    expect(text).toContain('vertreten durch Michael Heiduk und Christoph Hermann, im Folgenden „Pepe Dome“,')
    expect(text).toContain('Duo Beispiel, E-Mail: duo@example.org')
    expect(text).toContain('[Unterschrift] Ort, Datum, Michael Heiduk, Circus Akademie München e.V.')
    expect(text).toContain('[Unterschrift] Ort, Datum, Christoph Hermann, Circus Akademie München e.V.')
    expect(text).toContain('[Unterschrift] Ort, Datum, Duo Beispiel')
  })

  it('besteht ohne Freitext aus Veranstaltung, Einnahmen, Abrechnung, höherer Gewalt und Unterschriften', () => {
    expect(titel).toEqual([
      '1. Veranstaltung',
      '2. Einnahmen',
      '3. Abrechnung und Zahlung',
      '4. Höhere Gewalt',
      'Unterschriften',
    ])
  })

  it('sucht bei höherer Gewalt zuerst einen Ersatztermin und lässt dann beide zurücktreten', () => {
    expect(text).toContain('suchen beide Seiten zuerst einen Ersatztermin.')
    expect(text).toContain('Findet sich kein Ersatztermin, können beide Seiten vom Vertrag zurücktreten. Bereits Gezahltes wird erstattet.')
    expect(text).toContain('Weitergehende Ansprüche sind ausgeschlossen, soweit gesetzlich zulässig.')
  })

  it('lässt Getränke und Speisen über den Pepe Dome laufen, mit Ausnahmen nur schriftlich vorab', () => {
    expect(text).toContain('Getränke und Speisen werden vom Pepe Dome angeboten. Die Einnahmen daraus gehen an den Pepe Dome.')
    expect(text).toContain('Ausnahmen sind möglich, wenn sie vorher schriftlich vereinbart werden.')
  })

  it('teilt netto, ohne Ticketgebühren, und sagt, was mit der Mehrwertsteuer ist', () => {
    expect(text).toContain('Grundlage sind die Netto-Ticketeinnahmen ohne Ticketgebühren.')
    expect(text).toContain('Duo Beispiel rechnet ohne Mehrwertsteuer ab und erhält den Anteil ohne Aufschlag.')

    const mitMwst = bauen(type, { mitMwst: true }).text
    expect(mitMwst).toContain('Grundlage sind die Netto-Ticketeinnahmen ohne Ticketgebühren.')
    expect(mitMwst).toContain('Duo Beispiel rechnet mit Mehrwertsteuer ab. Die Mehrwertsteuer kommt auf den Anteil hinzu.')
    expect(mitMwst).not.toContain('ohne Aufschlag')
  })

  it('rechnet in der Woche danach ab und zahlt spätestens 14 Tage nach der Veranstaltung', () => {
    expect(text).toContain('Der Pepe Dome rechnet die Ticketeinnahmen in der Woche nach der Veranstaltung ab.')
    expect(text).toContain('Die Zahlung erfolgt spätestens 14 Tage nach der Veranstaltung.')
  })

  it('nennt Termin und nur die eingetragenen Zeiten', () => {
    expect(text).toContain('Beispielshow im Pepe Dome, Ostpark München.')
    expect(text).toContain('Samstag, 17.05.2031.')
    expect(text).toContain('Aufbau ab 15:00 Uhr, Einlass 19:00 Uhr, Beginn 20:00 Uhr.')
    expect(text).not.toContain('Ende')
  })

  it('teilt die Ticketeinnahmen', () => {
    expect(text).toContain('Die Ticketeinnahmen werden geteilt: 55 % für Duo Beispiel, 45 % für den Pepe Dome.')
  })

  it('behauptet nichts zu den Punkten, die noch nicht geklärt sind', () => {
    // „Ausfalls der Technik“ steht als Beispiel in der Klausel zur höheren Gewalt.
    for (const wort of ['Ausfall und Absage', 'Absage', 'Storno', 'Hausordnung', 'Haftung', 'Versicherung', 'Gage']) {
      expect(text).not.toContain(wort)
    }
  })

  it('macht aus jedem ausgefüllten Freitext einen eigenen, nummerierten Abschnitt', () => {
    const voll = bauen(type, {
      ausfall: 'Erster Absatz.\n\nZweiter Absatz.',
      bedingungen: 'Text zu den Bedingungen.',
      erwartungen: 'Text zu den Erwartungen.',
      sonderabsprache: 'Sonstiges.',
    })
    expect(voll.titel).toEqual([
      '1. Veranstaltung',
      '2. Einnahmen',
      '3. Abrechnung und Zahlung',
      '4. Höhere Gewalt',
      '5. Ausfall und Absage',
      '6. Bedingungen vor Ort',
      '7. Was der Pepe Dome erwartet',
      '8. Sonderabsprache',
      'Unterschriften',
    ])
    expect(voll.text).toContain('5. Ausfall und Absage\nErster Absatz.\nZweiter Absatz.')
  })

  it('nummeriert ohne Lücke, wenn nur ein Freitext ausgefüllt ist', () => {
    expect(bauen(type, { bedingungen: 'Text.' }).titel).toEqual([
      '1. Veranstaltung',
      '2. Einnahmen',
      '3. Abrechnung und Zahlung',
      '4. Höhere Gewalt',
      '5. Bedingungen vor Ort',
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
    expect(titel).toEqual(['1. Veranstaltung', '2. Gage', '3. Abrechnung und Zahlung', '4. Höhere Gewalt', 'Unterschriften'])
    expect(text).toContain('Duo Beispiel erhält für den Auftritt eine feste Gage von 777,50 €.')
    expect(text).toContain('Die Gage wird aus der Förderung „Beispielförderung“ bezahlt.')
    expect(text).toContain('Getränke und Speisen werden vom Pepe Dome angeboten. Die Einnahmen daraus gehen an den Pepe Dome.')
    expect(text).not.toContain('werden geteilt')
    expect(text).not.toContain('Grundlage')
  })

  it('gibt die Ticketeinnahmen an den Pepe Dome', () => {
    expect(text).toContain('Die Ticketeinnahmen gehen an den Pepe Dome.')
  })

  it('zahlt die Gage spätestens 14 Tage nach der Veranstaltung', () => {
    expect(text).toContain('Die Gage wird spätestens 14 Tage nach der Veranstaltung gezahlt.')
    expect(text).not.toContain('rechnet die Ticketeinnahmen')
  })

  it('nennt die Gage ohne Mehrwertsteuer als Endbetrag', () => {
    expect(text).toContain('Duo Beispiel rechnet ohne Mehrwertsteuer ab. Die Gage ist der Endbetrag.')
    expect(text).not.toContain('kommt auf die Gage hinzu')
  })

  it('schlägt die Mehrwertsteuer auf die Gage, wenn mit Mehrwertsteuer abgerechnet wird', () => {
    const mitMwst = bauen('KUENSTLER', { verguetung: 'gage', gage: '777', mitMwst: true }).text
    expect(mitMwst).toContain('Duo Beispiel rechnet mit Mehrwertsteuer ab. Die Mehrwertsteuer kommt auf die Gage hinzu.')
    expect(mitMwst).not.toContain('Endbetrag')
  })

  it('nennt im Vertrag keinen Paragrafen', () => {
    expect(text).not.toContain('§')
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
