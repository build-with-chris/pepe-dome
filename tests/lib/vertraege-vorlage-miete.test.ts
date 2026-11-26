/**
 * Vorlage der Mietvereinbarung: welche Abschnitte bei welchen Schaltern im
 * Dokument stehen, wie nummeriert wird und was aus fehlenden Werten wird.
 *
 * Alle Namen und Beträge hier sind erfunden.
 */

import { describe, it, expect } from 'vitest'
import { dokumentAlsText, ueberschriften, type Baustein } from '@/lib/vertraege/dokument'
import { fristVor, mieteFelder } from '@/lib/vertraege/formular'
import {
  BETRAGSFELDER,
  betraegeAus,
  leseBetrag,
  leseStandardpreise,
  mitStandardpreis,
  vertragSchema,
  vertragstitel,
} from '@/lib/vertraege/validation'
import { dokumentAus } from '@/lib/vertraege/vorlage'

const ALLE_SCHALTER = {
  minderjaehrig: true,
  zusatzleistungen: true,
  material: true,
  bier: true,
  aufsichtsperson: true,
  feuer: true,
  jugendschutz: true,
  lautstaerkeHervorgehoben: false,
  kaution: true,
}

const voll = {
  type: 'MIETE',
  partnerName: 'Jana Beispiel',
  eventDate: '2031-05-17',
  data: {
    anlass: 'Feier zum Abschluss',
    termin: 'Samstag, 17.05.2031',
    aufbauAb: '14:00',
    beginn: '17:00 Uhr',
    ende: '1:00',
    gaesteGeplant: 'etwa 60',
    gaesteMax: '90',
    preismodell: 'pauschale',
    preisBezeichnung: 'Sonderpreis',
    preisRegulaer: '333',
    preisVereinbart: '222',
    anzahlungProzent: '50',
    anzahlungFrist: 'bis 03.05.2031',
    einweisung: 'Samstag, 10.05.2031',
    ...ALLE_SCHALTER,
    zusatzleistungenZeilen: [
      { leistung: 'Erste Leistung', preis: '11 €' },
      { leistung: 'Zweite Leistung', preis: '22 € für den Abend' },
      { leistung: '', preis: '' },
    ],
    werkzeugGebuehr: '3',
    verbrauchsmaterial: 'zum Einkaufspreis',
    bierPreis: '17,50',
    kautionBetrag: '444',
    sonderabsprache: '',
  },
}

function bauen(aenderung: Record<string, unknown> = {}, kopf: Record<string, unknown> = {}) {
  const dokument = dokumentAus(
    vertragSchema.parse({ ...voll, ...kopf, data: { ...voll.data, ...aenderung } })
  )
  return { dokument, text: dokumentAlsText(dokument), titel: ueberschriften(dokument) }
}

function unterschriften(bausteine: Baustein[]): string[] {
  return bausteine.flatMap((baustein) =>
    baustein.art === 'gruppe'
      ? unterschriften(baustein.bausteine)
      : baustein.art === 'unterschriften'
        ? baustein.felder.flat()
        : []
  )
}

describe('Mietvereinbarung mit allen Schaltern', () => {
  const { dokument, text, titel } = bauen()

  it('nummeriert die Abschnitte fortlaufend und hängt die Erklärungen an', () => {
    expect(titel).toEqual([
      '1. Termin und Zeit',
      '2. Gäste',
      '3. Preis',
      '4. Zusatzleistungen (nur nach vorheriger Absprache)',
      '5. Material vor Ort',
      '6. Getränke: Bier',
      '7. Regeln',
      '8. Zahlung',
      'Verantwortliche erwachsene Aufsichtsperson',
      'Aufsichtsperson für das offene Feuer',
      'Unterschriften',
    ])
  })

  it('trägt Logo, Akzentfarbe und Fußzeile', () => {
    expect(dokument.bausteine[0]).toMatchObject({ art: 'kopf', logo: true })
    expect(dokument.akzent).toBe(true)
    expect(dokument.fuss).toBe('Pepe Dome · Ostpark München · www.pepe-dome.de')
  })

  it('nennt die eigene Seite, die Gegenseite und den Anlass', () => {
    expect(text).toContain('Vereinbarung zur Nutzung des Pepe Dome')
    expect(text).toContain('Feier zum Abschluss')
    expect(text).toContain('Zwischen dem Pepe Dome, vertreten durch Christoph Hermann,')
    expect(text).toContain('Jana Beispiel, geboren am ____')
    expect(text).toContain('vertreten durch die erziehungsberechtigte Person ____')
  })

  it('setzt Zeiten ohne doppeltes „Uhr“', () => {
    expect(text).toContain('Aufbau ab 14:00 Uhr.')
    expect(text).toContain('Veranstaltung von 17:00 bis 1:00 Uhr. Um 1:00 Uhr sind alle Gäste draußen.')
  })

  it('zeigt den vereinbarten und den regulären Preis und verweist auf die Regeln', () => {
    expect(text).toContain('Sonderpreis: 222 € pauschal (regulärer Preis: 333 €).')
    expect(text).toContain('dass die Regeln aus Punkt 7 eingehalten werden')
    expect(text).toContain('Jugendschutzregeln aus Punkt 7')
  })

  it('enthält jede Regel', () => {
    for (const regel of [
      'Erwachsene Aufsichtsperson',
      'Einweisung eine Woche vorher: Samstag, 10.05.2031.',
      'Es gilt die Hausordnung des Pepe Dome.',
      'Rauchen nur draußen.',
      'Offenes Feuer nur an der dafür vorgesehenen Stelle',
      'Lautstärke: Nach 22:00 Uhr gemäßigt.',
      'Jugendschutz: Gäste unter 16 Jahren',
      'Der Raum wird besenrein übergeben. Schäden werden ersetzt.',
    ]) {
      expect(text).toContain(regel)
    }
  })

  it('rechnet Anzahlung und Rest aus und nennt die Bankverbindung', () => {
    expect(text).toContain('Anzahlung 50 % (111 €) zwei Wochen vorher: bis 03.05.2031.')
    expect(text).toContain('Kaution 444 €, fällig mit der Anzahlung.')
    expect(text).toContain('Rest (111 € zuzüglich Bier, Zusatzleistungen und Material)')
    expect(text).toContain('Kontoinhaber | Circus Akademie München e.V.')
    expect(text).toContain('IBAN | DE36 4306 0967 1379 5914 00')
  })

  it('führt die Zusatzleistungen zum Ankreuzen auf und lässt leere Zeilen weg', () => {
    const tabelle = dokument.bausteine.find(
      (baustein) => baustein.art === 'tabelle' && baustein.ankreuzen
    )
    expect(tabelle).toMatchObject({
      zeilen: [
        ['Erste Leistung', '11 €'],
        ['Zweite Leistung', '22 € für den Abend'],
      ],
    })
  })

  it('schreibt Beträge mit Komma und zwei Nachkommastellen', () => {
    expect(text).toContain('zu 17,50 € pro Kasten')
    expect(text).toContain('Werkzeug: 3 € Leihgebühr pro Werkzeug.')
  })

  it('hat fünf Unterschriftsfelder: zwei Erklärungen, beide Seiten, Erziehungsberechtigte', () => {
    expect(unterschriften(dokument.bausteine)).toEqual([
      'Ort, Datum, Unterschrift Aufsichtsperson',
      'Ort, Datum, Unterschrift Aufsichtsperson',
      'Ort, Datum\nChristoph Hermann, Pepe Dome',
      'Ort, Datum\nJana Beispiel',
      'Ort, Datum\nErziehungsberechtigte Person',
    ])
  })

  it('bildet den Titel aus Anlass und Name', () => {
    expect(dokument.titel).toBe('Vereinbarung Feier zum Abschluss Jana Beispiel')
    expect(vertragstitel(vertragSchema.parse(voll))).toBe(dokument.titel)
  })
})

describe('Mietvereinbarung ohne Schalter', () => {
  const aus = Object.fromEntries(Object.keys(ALLE_SCHALTER).map((schalter) => [schalter, false]))
  const { dokument, text, titel } = bauen(aus, { partnerPhone: '0000 123', partnerAddress: 'Musterweg 1' })

  it('lässt die Abschnitte weg und nummeriert ohne Lücke', () => {
    expect(titel).toEqual([
      '1. Termin und Zeit',
      '2. Gäste',
      '3. Preis',
      '4. Regeln',
      '5. Zahlung',
      'Unterschriften',
    ])
    expect(text).toContain('dass die Regeln aus Punkt 4 eingehalten werden')
  })

  it('lässt die Regeln und Beträge der ausgeschalteten Bausteine weg', () => {
    for (const fehlt of ['Kaution', 'Offenes Feuer', 'Jugendschutz', 'Aufsichtsperson', 'Kasten', 'Werkzeug', 'geboren am']) {
      expect(text).not.toContain(fehlt)
    }
    expect(text).toContain('Rest (111 €) innerhalb von 14 Tagen')
  })

  it('macht die Gegenseite ohne Aufsichtsperson zur Ansprechperson', () => {
    expect(text).toContain('ist während der gesamten Feier vor Ort und Ansprechperson für Polizei')
  })

  it('zeigt Telefon und Anschrift, wenn sie eingetragen sind', () => {
    expect(text).toContain('Jana Beispiel, Telefon: 0000 123')
    expect(text).toContain('Anschrift: Musterweg 1')
  })

  it('hat nur die zwei Unterschriften der beiden Seiten', () => {
    expect(unterschriften(dokument.bausteine)).toHaveLength(2)
  })
})

describe('Varianten der Mietvereinbarung', () => {
  it('Showbesuch: Ticketregel und Heizpauschale statt Miete', () => {
    const { text, titel } = bauen({
      preismodell: 'showbesuch',
      showName: 'Beispielshow',
      ticketQuote: '70',
      preisVereinbart: '88',
      preisRegulaer: '',
    })
    expect(titel).toContain('3. Tickets und Heizung')
    expect(text).toContain('Die Gruppe besucht die Show „Beispielshow“')
    expect(text).toContain('Ticketregel: Mindestens 70 % der Gäste')
    expect(text).toContain('Heizung: 88 € pauschal')
    expect(text).toContain('Eine Miete fällt nicht an.')
    expect(text).toContain('Tickets bezahlt jede:r Gast beim Kauf zum regulären Preis.')
    expect(text).toContain('Anzahlung 50 % (44 €)')
    expect(text).not.toContain('Enthalten sind Miete und Heizung')
  })

  it('Showbesuch ohne Namen der Show wird abgelehnt', () => {
    const ergebnis = vertragSchema.safeParse({
      ...voll,
      data: { ...voll.data, preismodell: 'showbesuch', showName: '' },
    })
    expect(ergebnis.success).toBe(false)
  })

  it('hervorgehobene Lautstärke: eigener Abschnitt als Hinweis, kein Punkt unter den Regeln', () => {
    const { dokument, text, titel } = bauen({ lautstaerkeHervorgehoben: true })
    expect(titel).toContain('7. Wichtigste Regel: Lautstärke')
    expect(titel).toContain('8. Weitere Regeln')
    expect(titel).toContain('9. Zahlung')
    expect(dokument.bausteine.some((baustein) => baustein.art === 'hinweis')).toBe(true)
    expect(text).toContain('Jana Beispiel sorgt dafür, dass sich alle Gäste daran halten')
    expect(text).not.toContain('Lautstärke: Nach 22:00 Uhr gemäßigt.')
    // Die Verweise zeigen auf die Regeln, nicht auf den Hinweis.
    expect(text).toContain('dass die Regeln aus Punkt 8 eingehalten werden')
  })

  it('Sonderabsprache steht als letzter Abschnitt, Leerzeilen trennen Absätze', () => {
    const { text, titel } = bauen({ sonderabsprache: 'Erster Absatz.\n\nZweiter Absatz.' })
    expect(titel).toContain('9. Sonderabsprache')
    expect(text).toContain('9. Sonderabsprache\nErster Absatz.\nZweiter Absatz.')
  })

  it('ohne Anzahlung heißt der letzte Punkt „Zahlung“ und nennt den vollen Preis', () => {
    const { text } = bauen({ anzahlungProzent: '', kaution: true })
    expect(text).not.toContain('Anzahlung ')
    expect(text).toContain('Zahlung (222 € zuzüglich')
    expect(text).toContain('Kaution 444 €, fällig vor der Veranstaltung.')
  })

  it('ohne Sonderpreis gilt der reguläre Preis, auch für Anzahlung und Rest', () => {
    const { text } = bauen({ preisVereinbart: '', preisBezeichnung: '' })
    expect(text).toContain('Preis: 333 € pauschal. Enthalten sind Miete und Heizung')
    expect(text).not.toContain('regulärer Preis')
    expect(text).not.toContain('Dieser Preis gilt unter der Voraussetzung')
    expect(text).toContain('Anzahlung 50 % (166,50 €) zwei Wochen vorher: bis 03.05.2031.')
    expect(text).toContain('Rest (166,50 € zuzüglich')
    expect(text).not.toContain('________ €')
  })

  it('mit Sonderpreis ohne eigene Bezeichnung heißt er „Vereinbarter Preis“', () => {
    const { text } = bauen({ preisBezeichnung: '' })
    expect(text).toContain('Vereinbarter Preis: 222 € pauschal (regulärer Preis: 333 €).')
    expect(text).toContain('Anzahlung 50 % (111 €)')
  })

  it('beim Showbesuch zählt nur die Heizpauschale, nie der reguläre Mietpreis', () => {
    const { text } = bauen({ preismodell: 'showbesuch', showName: 'Beispielshow', preisVereinbart: '', preisRegulaer: '333' })
    expect(text).toContain('Heizung: ________ € pauschal')
    expect(text).toContain('Anzahlung 50 % (________ €)')
  })

  it('ohne Rabatt entfällt der Verweis auf die Regeln', () => {
    const { text } = bauen({ preisRegulaer: '222' })
    expect(text).toContain('Sonderpreis: 222 € pauschal. Enthalten')
    expect(text).not.toContain('Dieser Preis gilt unter der Voraussetzung')
  })

  it('fehlende Beträge und Angaben werden zu Linien zum Ausfüllen', () => {
    const { text } = bauen({
      preisVereinbart: '',
      preisRegulaer: '',
      kautionBetrag: '',
      bierPreis: '',
      gaesteMax: '',
      ende: '',
    })
    expect(text).toContain('Sonderpreis: ________ € pauschal.')
    expect(text).toContain('Kaution ________ €')
    expect(text).toContain('zu ________ € pro Kasten')
    expect(text).toContain('höchstens ________ Personen')
    expect(text).toContain('Anzahlung 50 % (________ €)')
    expect(text).toContain('bis ________ Uhr')
  })
})

describe('Pflichtfelder und Beträge', () => {
  it.each([
    ['ohne Namen der Gegenseite', { partnerName: ' ' }, {}],
    ['ohne Anlass', {}, { anlass: '' }],
    ['ohne Termin', {}, { termin: '' }],
    ['mit Text im Betragsfeld', {}, { preisVereinbart: 'viel' }],
    ['mit mehr als 100 Prozent Anzahlung', {}, { anzahlungProzent: '120' }],
    ['mit kaputter Mailadresse', { partnerEmail: 'jana@' }, {}],
    ['mit kaputtem Datum', { eventDate: '17.05.2031' }, {}],
  ])('lehnt eine Mietvereinbarung %s ab', (_fall, kopf, daten) => {
    const ergebnis = vertragSchema.safeParse({ ...voll, ...kopf, data: { ...voll.data, ...daten } })
    expect(ergebnis.success).toBe(false)
  })

  it('kommt mit den drei Pflichtfeldern aus', () => {
    const ergebnis = vertragSchema.safeParse({
      type: 'MIETE',
      partnerName: 'Jana Beispiel',
      data: { anlass: 'Feier', termin: 'offen' },
    })
    expect(ergebnis.success).toBe(true)
  })

  it.each([
    ['120', 120],
    ['120,5', 120.5],
    ['120.50', 120.5],
    ['1.200', 1200],
    ['1.200,50', 1200.5],
    [' 99 € ', 99],
    // Was Menschen dazuschreiben, wird überlesen.
    ['50 %', 50],
    ['50%', 50],
    ['120,-', 120],
    ['120,- €', 120],
    ['120.-', 120],
    ['120 Euro', 120],
    ['120 EUR', 120],
    ['1.200,- €', 1200],
    [77, 77],
    ['', null],
    [null, null],
  ])('liest %j als %j', (eingabe, erwartet) => {
    expect(leseBetrag(eingabe)).toBe(erwartet)
  })

  it.each(['viel', '12abc', '-5', '1,2,3'])('erkennt %j nicht als Betrag', (eingabe) => {
    expect(leseBetrag(eingabe)).toBeUndefined()
  })
})

describe('Vorbelegung aus dem letzten Vertrag', () => {
  const gespeichert = vertragSchema.parse(voll).data

  it('übernimmt nur Beträge, keine Namen, Termine oder Schalter', () => {
    const betraege = betraegeAus('MIETE', gespeichert)
    expect(Object.keys(betraege).sort()).toEqual(
      [...BETRAGSFELDER.MIETE].filter((feld) => feld !== 'ticketQuote').sort()
    )
    expect(betraege).toMatchObject({ preisVereinbart: 222, kautionBetrag: 444, bierPreis: 17.5 })
  })

  it('füllt ein neues Formular mit den Beträgen und lässt den Rest leer', () => {
    const felder = mieteFelder(betraegeAus('MIETE', gespeichert))
    expect(felder).toMatchObject({
      preisRegulaer: '333',
      preisVereinbart: '222',
      bierPreis: '17,50',
      kautionBetrag: '444',
      anlass: '',
      termin: '',
      kaution: false,
    })
    expect(felder.zusatzleistungenZeilen[0]).toEqual({ leistung: 'Erste Leistung', preis: '11 €' })
  })

  it('ohne früheren Vertrag sind alle Preisfelder leer', () => {
    const felder = mieteFelder(undefined)
    for (const feld of ['preisRegulaer', 'preisVereinbart', 'ticketQuote', 'werkzeugGebuehr', 'verbrauchsmaterial', 'bierPreis', 'kautionBetrag'] as const) {
      expect(felder[feld]).toBe('')
    }
    expect(felder.zusatzleistungenZeilen.length).toBeGreaterThan(0)
    expect(felder.zusatzleistungenZeilen.every((zeile) => zeile.preis === '')).toBe(true)
  })
})

describe('Anzahlung nach Hausregel', () => {
  it('startet mit der Hälfte', () => {
    expect(mieteFelder(undefined).anzahlungProzent).toBe('50')
  })

  it('lässt ein bewusst geleertes Feld leer', () => {
    expect(mieteFelder({ anzahlungProzent: null }).anzahlungProzent).toBe('')
    expect(mieteFelder({ anzahlungProzent: 30 }).anzahlungProzent).toBe('30')
  })

  it.each([
    ['2031-05-17', '03.05.2031'],
    ['2031-03-10', '24.02.2031'],
    ['2031-01-05', '22.12.2030'],
    ['2032-03-14', '29.02.2032'],
  ])('legt die Frist für den %s auf den %s, zwei Wochen vorher', (datum, frist) => {
    expect(fristVor(datum)).toBe(frist)
  })

  it.each(['', '17.05.2031', '2031-13-40', 'morgen'])('ergibt für %j keine Frist', (datum) => {
    expect(fristVor(datum)).toBe('')
  })
})

describe('Standardpreise', () => {
  it('liest gespeicherte Werte und lässt Fehlendes leer', () => {
    expect(leseStandardpreise({ halbtag: 111, ganztag: '222,50', ticketanteil: '55 %' })).toEqual({
      halbtag: 111,
      ganztag: 222.5,
      ticketanteil: 55,
    })
    // Eine Zeile aus der Zeit vor dem Ticketanteil bleibt lesbar.
    expect(leseStandardpreise({ halbtag: 111, ganztag: 222 })).toEqual({ halbtag: 111, ganztag: 222, ticketanteil: null })
    const leer = { halbtag: null, ganztag: null, ticketanteil: null }
    expect(leseStandardpreise(undefined)).toEqual(leer)
    expect(leseStandardpreise({ halbtag: 'viel' })).toEqual(leer)
  })

  it('setzt den regulären Preis eines neuen Vertrags auf den halben Tag', () => {
    const vorbelegung = mitStandardpreis(
      { MIETE: { preisRegulaer: 999, kautionBetrag: 444 } },
      { halbtag: 111, ganztag: 222, ticketanteil: null }
    )
    expect(vorbelegung.MIETE).toEqual({ preisRegulaer: 111, kautionBetrag: 444 })
    expect(vorbelegung.ANGEBOT).toEqual({ preisRegulaer: 111 })
    expect(vorbelegung.KUENSTLER).toEqual({})
  })

  it('setzt den Ticketanteil in Künstler- und Veranstaltervertrag, nicht in der Miete', () => {
    const vorbelegung = mitStandardpreis(
      { KUENSTLER: { anteilGegenseite: 70 } },
      { halbtag: null, ganztag: null, ticketanteil: 55 }
    )
    expect(vorbelegung.KUENSTLER).toEqual({ anteilGegenseite: 55 })
    expect(vorbelegung.VERANSTALTER).toEqual({ anteilGegenseite: 55 })
    expect(vorbelegung.MIETE).toEqual({})
  })

  it('ändert ohne gepflegten Standardpreis nichts', () => {
    const vorher = { MIETE: { preisRegulaer: 999 } }
    expect(mitStandardpreis(vorher, { halbtag: null, ganztag: 222, ticketanteil: null })).toBe(vorher)
  })
})
