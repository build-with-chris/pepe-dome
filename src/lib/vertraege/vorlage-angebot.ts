/**
 * Vorlage des unverbindlichen Angebots: Formularwerte hinein, Bausteine heraus.
 *
 * Reine Funktion, wie vorlage-miete.ts. Das Angebot ist eine Seite mit Logo,
 * in der Sie-Form, und endet mit dem Stand statt mit Unterschriften.
 *
 * Der reguläre Preis erscheint durchgestrichen über dem Angebotspreis. Fehlt
 * er oder ist er gleich dem Angebotspreis, entfällt die Zeile samt dem Satz
 * über das Entgegenkommen.
 */

import { fett, grau, type Baustein, type Dokument, type Inhalt } from './dokument'
import { betragAlsText, type AngebotDaten } from './validation'

const VERTRETEN_DURCH = 'Christoph Hermann'

const euro = (betrag: number | null) => `${betrag === null ? '________' : betragAlsText(betrag)} €`

export function angebotDokument(d: AngebotDaten, titel: string): Dokument {
  const veranstaltung = `„${d.veranstaltung}“`
  const rabatt = d.preisRegulaer !== null && d.preisRegulaer !== d.preisAngebot

  const eckdaten: Inhalt[][] = [
    ['Veranstaltung', d.veranstaltung],
    ['Datum', d.datum],
    ['Uhrzeit', d.uhrzeit],
    ['Reservierung', d.reservierung],
    ['Gäste', d.gaeste],
  ]
    .filter(([, wert]) => wert)
    .map(([bezeichnung, wert]) => [grau(bezeichnung), fett(wert)])

  const preise: Inhalt[][] = [
    ...(rabatt
      ? [
          [
            d.preisRegulaerBezeichnung || 'Regulärer Preis',
            { text: euro(d.preisRegulaer), durchgestrichen: true },
          ],
        ]
      : []),
    [fett(`Ihr Preis für ${veranstaltung}`), fett(euro(d.preisAngebot))],
    ...(d.getraenke ? [['Getränke', d.getraenke]] : []),
  ]

  const bausteine: Baustein[] = [
    {
      art: 'kopf',
      titel: 'Unverbindliches Angebot',
      untertitel: `Raumnutzung für die Veranstaltung ${veranstaltung}`,
      logo: true,
    },
    {
      art: 'absatz',
      text: `Vielen Dank für Ihre Anfrage. Gerne stellen wir Ihnen den Pepe Dome für ${veranstaltung} zur Verfügung. Hier finden Sie unser Angebot im Überblick.`,
    },

    { art: 'ueberschrift', text: 'Eckdaten' },
    { art: 'tabelle', linien: true, breiten: [23, 77], zeilen: eckdaten },

    ...(d.leistungen.length > 0
      ? ([
          { art: 'ueberschrift', text: 'Leistungen' },
          { art: 'liste', punkte: d.leistungen },
        ] satisfies Baustein[])
      : []),

    { art: 'ueberschrift', text: 'Preis' },
    {
      art: 'tabelle',
      linien: true,
      rechts: true,
      betont: [rabatt ? 1 : 0],
      breiten: [72, 28],
      zeilen: preise,
    },
    ...(rabatt
      ? [
          {
            art: 'absatz',
            text: 'Wir freuen uns über die Veranstaltung und kommen Ihnen deshalb beim Preis entgegen.',
          } satisfies Baustein,
        ]
      : []),

    { art: 'ueberschrift', text: 'Nächste Schritte' },
    {
      art: 'absatz',
      text: 'Dieses Angebot ist unverbindlich. Passt es für Sie, geben Sie uns kurz Bescheid. Dann schicken wir Ihnen eine Vereinbarung mit den Details zu Ablauf, Hausordnung und Zahlung.',
    },

    { art: 'abstand', hoehe: 14 },
    { art: 'absatz', text: 'Mit freundlichen Grüßen' },
    { art: 'abstand', hoehe: 4 },
    { art: 'absatz', text: [fett(VERTRETEN_DURCH), '\nPepe Dome'] },

    ...(d.stand
      ? ([
          { art: 'abstand', hoehe: 18 },
          { art: 'absatz', klein: true, text: `Stand: ${d.stand}` },
        ] satisfies Baustein[])
      : []),
  ]

  return { titel, akzent: true, bausteine }
}
