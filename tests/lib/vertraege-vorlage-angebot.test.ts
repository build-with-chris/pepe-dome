// @vitest-environment node
/**
 * Vorlage des Angebots und der Weg bis zum fertigen PDF.
 *
 * Läuft in der Node-Umgebung statt in jsdom: Die PDF-Bibliothek liest Schrift
 * und Logo von der Platte, so wie später auf dem Server.
 *
 * Alle Namen und Beträge hier sind erfunden.
 */

import { describe, it, expect } from 'vitest'
import { dokumentAlsText, ueberschriften, type Baustein } from '@/lib/vertraege/dokument'
import { angebotFelder } from '@/lib/vertraege/formular'
import { dokumentAlsPdf, pdfDateiname } from '@/lib/vertraege/pdf'
import { betraegeAus, vertragSchema } from '@/lib/vertraege/validation'
import { dokumentAus } from '@/lib/vertraege/vorlage'

const voll = {
  type: 'ANGEBOT',
  partnerName: 'Verein Beispiel',
  data: {
    veranstaltung: 'Lesung im Frühling',
    datum: 'Sonntag, 6. April 2031',
    uhrzeit: '10:00 bis 13:00 Uhr',
    reservierung: 'Halbtag',
    gaeste: 'ca. 40 Personen',
    leistungen: ['Nutzung des Raums', '', 'Der Raum ist beheizt'],
    preisRegulaerBezeichnung: 'Regulärer Satz',
    preisRegulaer: '333',
    preisAngebot: '222',
    getraenke: 'nach Verbrauch',
    stand: '01.03.2031',
  },
}

function bauen(aenderung: Record<string, unknown> = {}) {
  const dokument = dokumentAus(vertragSchema.parse({ ...voll, data: { ...voll.data, ...aenderung } }))
  return { dokument, text: dokumentAlsText(dokument) }
}

const tabellen = (bausteine: Baustein[]) =>
  bausteine.filter((baustein): baustein is Extract<Baustein, { art: 'tabelle' }> => baustein.art === 'tabelle')

describe('Angebot', () => {
  const { dokument, text } = bauen()

  it('hat Kopf mit Logo, Eckdaten, Leistungen, Preis, nächste Schritte und Stand', () => {
    expect(dokument.bausteine[0]).toMatchObject({
      art: 'kopf',
      titel: 'Unverbindliches Angebot',
      untertitel: 'Raumnutzung für die Veranstaltung „Lesung im Frühling“',
      logo: true,
    })
    expect(ueberschriften(dokument)).toEqual(['Eckdaten', 'Leistungen', 'Preis', 'Nächste Schritte'])
    expect(text).toContain('Dieses Angebot ist unverbindlich.')
    expect(text).toContain('Christoph Hermann\nPepe Dome')
    expect(text).toContain('Stand: 01.03.2031')
    expect(dokument.titel).toBe('Angebot Lesung im Frühling')
  })

  it('führt alle Eckdaten und nur die ausgefüllten Leistungen auf', () => {
    expect(text).toContain('Veranstaltung | Lesung im Frühling')
    expect(text).toContain('Datum | Sonntag, 6. April 2031')
    expect(text).toContain('Uhrzeit | 10:00 bis 13:00 Uhr')
    expect(text).toContain('Reservierung | Halbtag')
    expect(text).toContain('Gäste | ca. 40 Personen')
    expect(dokument.bausteine.find((baustein) => baustein.art === 'liste')).toMatchObject({
      punkte: ['Nutzung des Raums', 'Der Raum ist beheizt'],
    })
  })

  it('streicht den regulären Preis durch und hebt den Angebotspreis hervor', () => {
    const preise = tabellen(dokument.bausteine)[1]
    expect(preise.zeilen[0]).toEqual(['Regulärer Satz', { text: '333 €', durchgestrichen: true }])
    expect(preise.zeilen[1]).toEqual([
      { text: 'Ihr Preis für „Lesung im Frühling“', fett: true },
      { text: '222 €', fett: true },
    ])
    expect(preise.zeilen[2]).toEqual(['Getränke', 'nach Verbrauch'])
    expect(preise.betont).toEqual([1])
    expect(text).toContain('kommen Ihnen deshalb beim Preis entgegen')
  })

  it('ohne Angebotspreis gilt der reguläre Preis, ohne Streichung', () => {
    const regulaer = bauen({ preisAngebot: '' })
    const preise = tabellen(regulaer.dokument.bausteine)[1]
    expect(preise.zeilen[0]).toEqual([
      { text: 'Ihr Preis für „Lesung im Frühling“', fett: true },
      { text: '333 €', fett: true },
    ])
    expect(preise.betont).toEqual([0])
    expect(regulaer.text).not.toContain('entgegen')
  })

  it('trägt die Fußzeile', () => {
    expect(dokument.fuss).toBe('Pepe Dome · Ostpark München · www.pepe-dome.de')
  })

  it('ohne regulären Preis gibt es keine durchgestrichene Zeile und kein Entgegenkommen', () => {
    const ohne = bauen({ preisRegulaer: '', getraenke: '' })
    const preise = tabellen(ohne.dokument.bausteine)[1]
    expect(preise.zeilen).toHaveLength(1)
    expect(preise.betont).toEqual([0])
    expect(ohne.text).not.toContain('entgegen')
  })

  it('lässt leere Eckdaten, leere Leistungen und einen leeren Stand weg', () => {
    const karg = bauen({ datum: '', uhrzeit: '', reservierung: '', gaeste: '', leistungen: [], stand: '' })
    expect(tabellen(karg.dokument.bausteine)[0].zeilen).toHaveLength(1)
    expect(ueberschriften(karg.dokument)).toEqual(['Eckdaten', 'Preis', 'Nächste Schritte'])
    expect(karg.text).not.toContain('Stand:')
  })

  it('lehnt ein Angebot ohne Veranstaltung ab', () => {
    expect(vertragSchema.safeParse({ ...voll, data: { ...voll.data, veranstaltung: '' } }).success).toBe(false)
  })
})

describe('Vorbelegung des Angebots', () => {
  it('übernimmt nur die zwei Preise', () => {
    const betraege = betraegeAus('ANGEBOT', vertragSchema.parse(voll).data)
    expect(betraege).toEqual({ preisRegulaer: 333, preisAngebot: 222 })
    expect(angebotFelder(betraege, '02.03.2031')).toMatchObject({
      preisRegulaer: '333',
      preisAngebot: '222',
      veranstaltung: '',
      stand: '02.03.2031',
    })
  })

  it('ohne früheres Angebot sind die Preise leer', () => {
    expect(angebotFelder(undefined)).toMatchObject({ preisRegulaer: '', preisAngebot: '' })
  })
})

describe('PDF', () => {
  it('zeichnet das Angebot mit Logo als PDF', async () => {
    const pdf = await dokumentAlsPdf(bauen().dokument)
    expect(pdf.subarray(0, 5).toString('latin1')).toBe('%PDF-')
    // Schrift und Logo eingebettet: ein leeres PDF wäre nur wenige Kilobyte groß.
    expect(pdf.length).toBeGreaterThan(20_000)
  })

  it('zeichnet eine Mietvereinbarung mit Kästchen, Linien und Unterschriften', async () => {
    const dokument = dokumentAus(
      vertragSchema.parse({
        type: 'MIETE',
        partnerName: 'Jana Beispiel',
        data: {
          anlass: 'Feier',
          termin: 'Samstag, 17.05.2031',
          minderjaehrig: true,
          zusatzleistungen: true,
          zusatzleistungenZeilen: [{ leistung: 'Erste Leistung', preis: '11 €' }],
          lautstaerkeHervorgehoben: true,
          feuer: true,
        },
      })
    )
    const pdf = await dokumentAlsPdf(dokument)
    expect(pdf.subarray(0, 5).toString('latin1')).toBe('%PDF-')
  })

  it('bildet einen Dateinamen ohne Umlaute und Sonderzeichen', () => {
    expect(pdfDateiname('Angebot Lesung im Frühling „Süß & Groß“')).toBe(
      'Angebot_Lesung_im_Fruehling_Suess_Gross.pdf'
    )
    expect(pdfDateiname('  ')).toBe('Vertrag.pdf')
  })
})
