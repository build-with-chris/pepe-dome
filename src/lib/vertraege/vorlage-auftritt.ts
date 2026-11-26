/**
 * Vorlage für Künstlervertrag und Veranstaltervertrag: Formularwerte hinein,
 * Bausteine heraus. Reine Funktion, wie vorlage-miete.ts.
 *
 * GRUNDGERÜST, Stand 26.11.2026. Der Vertrag enthält nur, was feststeht:
 *
 *   - die Aufteilung der Ticketeinnahmen zwischen Gegenseite und Pepe Dome.
 *     Geteilt werden immer die Netto-Ticketeinnahmen ohne Ticketgebühren.
 *     Rechnet die Gegenseite mit Mehrwertsteuer ab, kommt die Mehrwertsteuer
 *     auf ihren Anteil obendrauf, sonst nicht.
 *   - bei Künstler:innen wahlweise eine feste Gage, wenn eine Förderung
 *     dahintersteht. Dann gehen die Ticketeinnahmen an den Pepe Dome. Welche
 *     der beiden Möglichkeiten gilt, steht vor dem Vertrag fest.
 *   - dass die Einnahmen aus der Gastronomie beim Pepe Dome bleiben
 *   - Abrechnung in der Woche nach der Veranstaltung, Zahlung spätestens
 *     14 Tage nach der Veranstaltung
 *
 * Für alles andere gibt es noch keinen abgestimmten Wortlaut, und hier wird
 * keiner erfunden. Die offenen Punkte sind Freitextfelder: Was im Formular
 * steht, erscheint als eigener Abschnitt, ein leeres Feld erzeugt keinen.
 *
 * Offen, mit Chris zu klären, bevor daraus feste Klauseln werden:
 *
 *   - Ausfall und Absage: wer trägt was, welche Fristen
 *   - höhere Gewalt: was darunter fällt und was dann gilt
 *   - Bedingungen vor Ort für Künstler:innen und Veranstalter:innen
 *     (Technik, Raum, Zeiten, Personal)
 *   - was der Pepe Dome als Gastgeber verlangen kann
 *   - ob eine feste Gage mit oder ohne Mehrwertsteuer gemeint ist
 *   - welche Ticketarten zählen (Freikarten, Ermäßigungen)
 *   - ob Hausordnung und Regeln der Mietvereinbarung hier ebenfalls gelten
 *
 * Bei neu formulierten Verträgen ist eine juristische Durchsicht sinnvoll
 * (docs/specs/vertragstool.md, Offene Punkte).
 */

import { fett, linie, type Baustein, type Dokument } from './dokument'
import { betragAlsText, type AuftrittDaten } from './validation'
import { FUSSZEILE, type Gegenseite } from './vorlage-miete'

const VERTRETEN_DURCH = 'Christoph Hermann'
const LUECKE = '________'

// Kurz gehalten, damit der Titel neben dem Logo in einer Zeile bleibt. Dass es
// um den Pepe Dome geht, sagen Logo und Abschnitt 1.
const TITEL = {
  KUENSTLER: 'Vereinbarung über einen Auftritt',
  VERANSTALTER: 'Vereinbarung über eine Veranstaltung',
} as const

const euro = (betrag: number | null) => `${betrag === null ? LUECKE : betragAlsText(betrag)} €`
const satz = (wert: string) => (/[.!?]$/.test(wert) ? wert : `${wert}.`)

/** Freitext wird an Leerzeilen in Absätze geteilt. */
const absaetze = (text: string): Baustein[] =>
  text
    .split(/\n\s*\n/)
    .map((absatz) => absatz.trim())
    .filter(Boolean)
    .map((absatz) => ({ art: 'absatz', text: absatz }))

export function auftrittDokument(
  art: 'KUENSTLER' | 'VERANSTALTER',
  gegenseite: Gegenseite,
  d: AuftrittDaten,
  titel: string
): Dokument {
  const name = gegenseite.partnerName
  const gage = art === 'KUENSTLER' && d.verguetung === 'gage'

  // Anteil des Pepe Dome ist der Rest zu 100. Ohne Angabe bleiben beide offen.
  const anteil = d.anteilGegenseite
  const anteilText = anteil === null ? LUECKE : betragAlsText(anteil)
  const restText = anteil === null ? LUECKE : betragAlsText(Math.round((100 - anteil) * 100) / 100)

  const abschnitte: Array<{ titel: string; bausteine: Baustein[] }> = []
  const abschnitt = (ueberschrift: string, bausteine: Baustein[]) =>
    abschnitte.push({ titel: `${abschnitte.length + 1}. ${ueberschrift}`, bausteine })

  // ── Veranstaltung ───────────────────────────────────────────────────
  const zeiten = [
    ...(d.aufbauAb ? [`Aufbau ab ${d.aufbauAb} Uhr`] : []),
    ...(d.einlass ? [`Einlass ${d.einlass} Uhr`] : []),
    ...(d.beginn ? [`Beginn ${d.beginn} Uhr`] : []),
    ...(d.ende ? [`Ende ${d.ende} Uhr`] : []),
  ]
  abschnitt('Veranstaltung', [
    {
      art: 'liste',
      punkte: [
        [fett(d.titel), ' im Pepe Dome, Ostpark München.'],
        satz(d.termin),
        ...(zeiten.length > 0 ? [`${zeiten.join(', ')}.`] : []),
      ],
    },
  ])

  // ── Vergütung oder Einnahmen ────────────────────────────────────────
  if (gage) {
    abschnitt('Gage', [
      {
        art: 'liste',
        punkte: [
          [`${name} erhält für den Auftritt eine `, fett(`feste Gage von ${euro(d.gage)}`), '.'],
          ...(d.foerderung ? [`Die Gage wird aus der Förderung „${d.foerderung}“ bezahlt.`] : []),
          'Die Ticketeinnahmen gehen an den Pepe Dome.',
          'Die Einnahmen aus der Gastronomie gehen an den Pepe Dome.',
        ],
      },
    ])
  } else {
    abschnitt('Einnahmen', [
      {
        art: 'liste',
        punkte: [
          [
            'Die Ticketeinnahmen werden geteilt: ',
            fett(`${anteilText} % für ${name}`),
            ', ',
            fett(`${restText} % für den Pepe Dome`),
            '.',
          ],
          'Grundlage sind die Netto-Ticketeinnahmen ohne Ticketgebühren.',
          d.mitMwst
            ? `${name} rechnet mit Mehrwertsteuer ab. Die Mehrwertsteuer kommt auf den Anteil hinzu.`
            : `${name} rechnet ohne Mehrwertsteuer ab und erhält den Anteil ohne Aufschlag.`,
          'Die Einnahmen aus der Gastronomie gehen an den Pepe Dome.',
        ],
      },
    ])
  }

  // ── Abrechnung und Zahlung ──────────────────────────────────────────
  abschnitt('Abrechnung und Zahlung', [
    {
      art: 'liste',
      punkte: gage
        ? ['Die Gage wird spätestens 14 Tage nach der Veranstaltung gezahlt.']
        : [
            'Der Pepe Dome rechnet die Ticketeinnahmen in der Woche nach der Veranstaltung ab.',
            'Die Zahlung erfolgt spätestens 14 Tage nach der Veranstaltung.',
          ],
    },
  ])

  // ── Die noch offenen Regelungen: nur, wenn etwas eingetragen ist ────
  const freitexte: Array<[string, string]> = [
    ['Ausfall und Absage', d.ausfall],
    ['Höhere Gewalt', d.hoehereGewalt],
    ['Bedingungen vor Ort', d.bedingungen],
    ['Was der Pepe Dome erwartet', d.erwartungen],
    ['Sonderabsprache', d.sonderabsprache],
  ]
  for (const [ueberschrift, text] of freitexte) {
    if (text) abschnitt(ueberschrift, absaetze(text))
  }

  // ── Parteien ────────────────────────────────────────────────────────
  const kontakt = [
    ...(gegenseite.partnerPhone ? [`Telefon: ${gegenseite.partnerPhone}`] : []),
    ...(gegenseite.partnerEmail ? [`E-Mail: ${gegenseite.partnerEmail}`] : []),
  ].join(', ')

  const parteien: Baustein[] = [
    {
      art: 'absatz',
      text: [fett('Zwischen'), ` dem Pepe Dome, vertreten durch ${VERTRETEN_DURCH},`],
    },
    { art: 'abstand', hoehe: 3 },
    { art: 'absatz', text: fett('und') },
    kontakt
      ? { art: 'absatz', text: `${name}, ${kontakt}` }
      : { art: 'ausfuellen', teile: [`${name}, Telefon:`, linie()] },
    gegenseite.partnerAddress
      ? { art: 'absatz', text: `Anschrift: ${gegenseite.partnerAddress}` }
      : { art: 'ausfuellen', teile: ['Anschrift:', linie()] },
  ]

  return {
    titel,
    akzent: true,
    fuss: FUSSZEILE,
    bausteine: [
      { art: 'kopf', titel: TITEL[art], untertitel: d.titel, logo: true },
      ...parteien,
      ...abschnitte.flatMap((eintrag): Baustein[] => [
        { art: 'ueberschrift', text: eintrag.titel },
        ...eintrag.bausteine,
      ]),
      {
        art: 'gruppe',
        bausteine: [
          { art: 'ueberschrift', text: 'Unterschriften' },
          {
            art: 'unterschriften',
            felder: [[`Ort, Datum\n${VERTRETEN_DURCH}, Pepe Dome`, `Ort, Datum\n${name}`]],
          },
        ],
      },
    ],
  }
}
