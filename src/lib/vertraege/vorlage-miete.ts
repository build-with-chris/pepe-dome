/**
 * Vorlage der Mietvereinbarung: Formularwerte hinein, Bausteine heraus.
 *
 * Reine Funktion ohne Datenbank und ohne PDF. Die Klauseln stehen hier im
 * Code, eine Textänderung läuft über einen Commit. Was von Vertrag zu Vertrag
 * wechselt, kommt aus dem Formular: Namen, Termine, alle Beträge und die
 * Schalter, die ganze Abschnitte ein- oder ausblenden.
 *
 * Abschnitte werden fortlaufend nummeriert. Verweise wie „Regeln aus Punkt 7“
 * rechnen mit, wenn davor ein Abschnitt wegfällt.
 *
 * Für Nutzungen über eine Feier hinaus, etwa mehrtägige Projekte mit eigenem
 * Publikum, gibt es Klauseln zum Einschalten (klauseln.ts) und eigene
 * Abschnitte. Deren Text kommt vollständig aus dem Formular.
 *
 * Geburtsdatum, Erziehungsberechtigte und Aufsichtspersonen werden nicht
 * erfasst. Sie bleiben Linien im PDF und werden von Hand eingetragen.
 *
 * Ist ein Vertrag verschickt, ändert eine neue Fassung dieser Datei ihn nicht
 * mehr: Sein Dokument liegt dann eingefroren in `contracts.snapshot`.
 */

import { fett, linie, mitSchluss, type Baustein, type Dokument, type Inhalt } from './dokument'
import { KLAUSEL, LUECKE, PREIS_ENTHALTEN, zeilenAus, type Klausel } from './klauseln'
import { eigeneSeite, FUSSZEILE, unterschriftEigeneSeite } from './partei'
import { betragAlsText, type MieteDaten } from './validation'

export type Gegenseite = {
  partnerName: string
  partnerEmail: string | null
  partnerPhone: string | null
  partnerAddress: string | null
}

/** Dieselbe Bankverbindung wie auf der Spendenseite (src/app/[lang]/spenden/page.tsx). */
const BANK: Array<[string, string]> = [
  ['Kontoinhaber', 'Circus Akademie München e.V.'],
  ['IBAN', 'DE36 4306 0967 1379 5914 00'],
  ['BIC', 'GENODEM1GLS'],
  ['Bank', 'GLS Gemeinschaftsbank eG'],
]

const UEBERSCHRIFT = 'Vereinbarung zur Nutzung des Pepe Dome'

const euro = (betrag: number | null) => `${betrag === null ? LUECKE : betragAlsText(betrag)} €`
const oder = (wert: string, ersatz = LUECKE) => wert || ersatz

/** Hängt einen Punkt an, wenn der Text nicht schon mit einem Satzzeichen endet. */
const satz = (wert: string) => (/[.!?]$/.test(wert) ? wert : `${wert}.`)

/**
 * Wann etwas fällig ist. Ein Datum wird zu „bis 04.12.2026“, ein Zeitpunkt
 * wie „bei Vertragsschluss“ bleibt, wie er ist.
 */
const faellig = (wert: string, ersatz: string) =>
  !wert ? ersatz : /^\d/.test(wert) ? `bis ${wert}` : wert

/** Text aus einem Feld: eine Zeile wird ein Absatz, mehrere werden eine Liste. */
function ausFeld(text: string): Baustein[] {
  const zeilen = zeilenAus(text)
  if (zeilen.length === 0) return []
  if (zeilen.length === 1) return [{ art: 'absatz', text: zeilen[0] }]
  return [{ art: 'liste', punkte: zeilen }]
}

function aufzaehlung(teile: string[]): string {
  if (teile.length <= 1) return teile.join('')
  return `${teile.slice(0, -1).join(', ')} und ${teile[teile.length - 1]}`
}

type Abschnitt = { schluessel: string; titel: string; bausteine: Baustein[] }

export function mieteDokument(gegenseite: Gegenseite, d: MieteDaten, titel: string): Dokument {
  const name = gegenseite.partnerName
  const showbesuch = d.preismodell === 'showbesuch'

  // Welcher Preis gilt: der Sonderpreis, wenn einer eingetragen ist, sonst der
  // reguläre. Beim Showbesuch gibt es nur die Heizpauschale. Mit diesem Betrag
  // rechnen auch Anzahlung und Rest.
  const preis = showbesuch ? d.preisVereinbart : (d.preisVereinbart ?? d.preisRegulaer)
  const sonderpreis =
    !showbesuch &&
    d.preisVereinbart !== null &&
    d.preisRegulaer !== null &&
    d.preisVereinbart !== d.preisRegulaer

  // Welche Abschnitte es gibt, steht vor den Texten fest. So kann der
  // Preis-Abschnitt auf die Nummer der Regeln verweisen, die erst später kommen.
  // Eingeschaltete Klauseln mit leerem Text erzeugen keinen Abschnitt.
  const klausel = (k: Klausel) => (d.klauseln[k].an && zeilenAus(d.klauseln[k].text).length > 0 ? [k] : [])
  const eigene = d.eigeneAbschnitte.map((eintrag, index) => ({ ...eintrag, schluessel: `eigen-${index}` }))
  const eigeneOben = eigene.filter((eintrag) => eintrag.oben)
  const eigeneUnten = eigene.filter((eintrag) => !eintrag.oben)

  const reihenfolge = [
    'termin',
    ...klausel('ausstattung'),
    ...eigeneOben.map((eintrag) => eintrag.schluessel),
    'gaeste',
    'preis',
    ...(d.zusatzleistungen ? ['zusatz'] : []),
    ...(d.material ? ['material'] : []),
    ...(d.bier ? ['bier'] : []),
    ...klausel('gastro'),
    ...(d.lautstaerkeHervorgehoben ? ['lautstaerke'] : []),
    'regeln',
    ...klausel('publikum'),
    ...klausel('technik'),
    ...klausel('haftung'),
    'zahlung',
    'absage',
    ...klausel('hoehereGewalt'),
    ...klausel('uebergabe'),
    ...eigeneUnten.map((eintrag) => eintrag.schluessel),
    ...(d.sonderabsprache ? ['sonderabsprache'] : []),
    ...klausel('schluss'),
    ...klausel('anlagen'),
  ]
  const nr = (schluessel: string) => reihenfolge.indexOf(schluessel) + 1

  const abschnitte: Abschnitt[] = []
  const abschnitt = (schluessel: string, ueberschrift: string, bausteine: Baustein[]) =>
    abschnitte.push({ schluessel, titel: `${nr(schluessel)}. ${ueberschrift}`, bausteine })

  // ── Termin ──────────────────────────────────────────────────────────
  abschnitt('termin', 'Termin und Zeit', [
    {
      art: 'liste',
      punkte: [
        satz(d.termin),
        ...(d.aufbauAb ? [`Aufbau ab ${d.aufbauAb} Uhr.`] : []),
        // Steht ein Ablauf da und keine Uhrzeit, regelt der Ablauf die Zeiten.
        ...(showbesuch
          ? [
              `Die Gruppe besucht die Show „${oder(d.showName)}“ und feiert im Anschluss im Dome, bis spätestens ${oder(d.ende)} Uhr.`,
            ]
          : d.ablauf && !d.beginn && !d.ende
            ? []
            : [
                `Veranstaltung von ${oder(d.beginn)} bis ${oder(d.ende)} Uhr. Um ${oder(d.ende)} Uhr sind alle Gäste draußen.`,
              ]),
        ...zeilenAus(d.ablauf),
      ],
    },
  ])

  // ── Klauseln aus dem Formular und eigene Abschnitte ─────────────────
  const ausKlausel = (k: Klausel) => {
    if (reihenfolge.includes(k)) abschnitt(k, KLAUSEL[k].titel, ausFeld(d.klauseln[k].text))
  }
  const ausEigenen = (liste: typeof eigene) => {
    for (const eintrag of liste) {
      abschnitt(eintrag.schluessel, eintrag.titel || 'Weitere Vereinbarung', ausFeld(eintrag.text))
    }
  }

  ausKlausel('ausstattung')
  ausEigenen(eigeneOben)

  // ── Gäste ───────────────────────────────────────────────────────────
  abschnitt('gaeste', 'Gäste', [
    {
      art: 'liste',
      punkte: [
        !d.gaesteGeplant && d.gaesteMax
          ? ['Höchstens ', fett(`${d.gaesteMax} Personen`), '.']
          : [
              `Geplant sind ${oder(d.gaesteGeplant)} Personen, höchstens `,
              fett(`${oder(d.gaesteMax)} Personen`),
              '.',
            ],
        d.aufsichtsperson
          ? `${name} trägt die Verantwortung für die Veranstaltung und alle Gäste.`
          : `${name} trägt die Verantwortung für die Veranstaltung und alle Gäste, ist während der gesamten Veranstaltung vor Ort und Ansprechperson für Polizei, Rettungsdienst und Notarzt.`,
      ],
    },
  ])

  // ── Preis ───────────────────────────────────────────────────────────
  const enthalten = d.preisEnthalten === null ? PREIS_ENTHALTEN : d.preisEnthalten
  const umsatzsteuer =
    d.umsatzsteuer === 'endbetrag'
      ? 'Der Betrag ist ein Endbetrag. Umsatzsteuer fällt nicht zusätzlich an.'
      : d.umsatzsteuer === 'zuzueglich'
        ? 'Alle Beträge verstehen sich zuzüglich der gesetzlichen Umsatzsteuer.'
        : null
  if (showbesuch) {
    abschnitt('preis', 'Tickets und Heizung', [
      {
        art: 'liste',
        punkte: [
          [
            fett('Ticketregel:'),
            ` Mindestens ${d.ticketQuote === null ? LUECKE : betragAlsText(d.ticketQuote)} % der Gäste kaufen ein reguläres Ticket für die Show über den Pepe Dome.`,
          ],
          `Endgültige Gästezahl: ${LUECKE}, davon mindestens ${LUECKE} reguläre Tickets.`,
          [
            fett('Heizung:'),
            ` ${euro(preis)} pauschal für die Veranstaltung. Eine Miete fällt nicht an.`,
          ],
          ...(umsatzsteuer ? [umsatzsteuer] : []),
        ],
      },
    ])
  } else {
    abschnitt('preis', 'Preis', [
      {
        art: 'absatz',
        text: [
          `${d.preisBezeichnung || (sonderpreis ? 'Vereinbarter Preis' : 'Preis')}: `,
          fett(`${euro(preis)} pauschal`),
          sonderpreis ? ` (regulärer Preis: ${euro(d.preisRegulaer)}).` : '.',
          ...(enthalten ? [` Enthalten sind ${satz(enthalten)}`] : []),
        ],
      },
      ...(umsatzsteuer ? [{ art: 'absatz', text: umsatzsteuer } satisfies Baustein] : []),
      ...(sonderpreis
        ? [
            {
              art: 'absatz',
              text: `Dieser Preis gilt unter der Voraussetzung, dass die Regeln aus Punkt ${nr('regeln')} eingehalten werden.`,
            } satisfies Baustein,
          ]
        : []),
    ])
  }

  // ── Zusatzleistungen ────────────────────────────────────────────────
  if (d.zusatzleistungen) {
    abschnitt('zusatz', 'Zusatzleistungen (nur nach vorheriger Absprache)', [
      ...(d.zusatzleistungenZeilen.length > 0
        ? [
            {
              art: 'tabelle',
              ankreuzen: true,
              linien: true,
              rechts: true,
              breiten: [70, 30],
              zeilen: d.zusatzleistungenZeilen.map((zeile) => [zeile.leistung, zeile.preis]),
            } satisfies Baustein,
            { art: 'absatz', text: 'Gewünschtes bitte ankreuzen.' } satisfies Baustein,
          ]
        : [
            {
              art: 'absatz',
              text: 'Zusatzleistungen werden einzeln abgesprochen.',
            } satisfies Baustein,
          ]),
    ])
  }

  // ── Material ────────────────────────────────────────────────────────
  if (d.material) {
    abschnitt('material', 'Material vor Ort', [
      {
        art: 'liste',
        punkte: [
          `Werkzeug: ${euro(d.werkzeugGebuehr)} Leihgebühr pro Werkzeug.`,
          `Verbrauchsmaterial (Tape usw.): ${satz(oder(d.verbrauchsmaterial))}`,
          'Was genutzt wurde, wird nach der Veranstaltung gemeinsam aufgeschrieben.',
        ],
      },
    ])
  }

  // ── Bier ────────────────────────────────────────────────────────────
  if (d.bier) {
    abschnitt('bier', 'Getränke: Bier', [
      {
        art: 'liste',
        punkte: [
          [
            'Bier wird ausschließlich vom Pepe Dome bezogen, zu ',
            fett(`${euro(d.bierPreis)} pro Kasten`),
            '.',
          ],
          `Abnahme von mindestens ${LUECKE} Kästen. Abgerechnet wird mit der Restzahlung.`,
          ...(d.jugendschutz
            ? [`Auch für das Bier gelten die Jugendschutzregeln aus Punkt ${nr('regeln')}.`]
            : []),
        ],
      },
    ])
  }

  ausKlausel('gastro')

  // ── Lautstärke als eigene, hervorgehobene Regel ─────────────────────
  if (d.lautstaerkeHervorgehoben) {
    abschnitt('lautstaerke', 'Wichtigste Regel: Lautstärke', [
      {
        art: 'hinweis',
        text: `Ab 22:00 Uhr wird es leiser. Der Pepe Dome unterliegt der Grünflächenverordnung. Erlaubt ist eine Lautstärke wie bei unseren Shows, mehr nicht. ${name} sorgt dafür, dass sich alle Gäste daran halten, auch draußen. Wird es zu laut, kann der Pepe Dome die Musik leiser stellen oder die Veranstaltung vorzeitig beenden.`,
      },
    ])
  }

  // ── Regeln ──────────────────────────────────────────────────────────
  const regeln: Inhalt[] = [
    ...(d.aufsichtsperson
      ? [
          [
            fett('Erwachsene Aufsichtsperson'),
            ': Weil viele Jugendliche zusammen feiern, ist während der gesamten Veranstaltung eine volljährige Person vor Ort, die nüchtern bleibt und die Verantwortung trägt. Sie ist Ansprechperson für Polizei, Rettungsdienst und Notarzt und übernimmt das schriftlich (siehe unten).',
          ],
        ]
      : []),
    d.einweisung
      ? [fett('Einweisung'), ` eine Woche vorher: ${satz(d.einweisung)}`]
      : [fett('Einweisung'), ' eine Woche vorher, Termin nach Absprache.'],
    'Es gilt die Hausordnung des Pepe Dome.',
    [fett('Rauchen'), ' nur draußen.'],
    ...(d.feuer
      ? [
          [
            fett('Offenes Feuer'),
            ' nur an der dafür vorgesehenen Stelle und nur mit einer benannten Aufsichtsperson. Sie ist allen Gästen bekannt und übernimmt schriftlich die Verantwortung (siehe unten).',
          ],
        ]
      : []),
    ...(d.lautstaerkeHervorgehoben
      ? []
      : [
          [
            fett('Lautstärke'),
            ': Nach 22:00 Uhr gemäßigt. Der Pepe Dome unterliegt der Grünflächenverordnung. Eine Lautstärke vergleichbar mit unseren Shows ist möglich.',
          ],
        ]),
    ...(d.jugendschutz
      ? [
          [
            fett('Jugendschutz'),
            ': Gäste unter 16 Jahren nur in Begleitung einer erziehungsberechtigten Person. Gäste unter 18 Jahren ohne Begleitung nur bis 24:00 Uhr. Kein Alkohol an Gäste unter 16, kein Schnaps an Gäste unter 18.',
          ],
        ]
      : []),
    'Der Raum wird besenrein übergeben. Schäden werden ersetzt.',
  ]
  abschnitt('regeln', d.lautstaerkeHervorgehoben ? 'Weitere Regeln' : 'Regeln', [
    { art: 'liste', punkte: regeln },
  ])

  ausKlausel('publikum')
  ausKlausel('technik')
  ausKlausel('haftung')

  // ── Zahlung ─────────────────────────────────────────────────────────
  const mitAnzahlung = d.anzahlungProzent !== null && d.anzahlungProzent > 0
  const anzahlung =
    mitAnzahlung && preis !== null
      ? Math.round(preis * (d.anzahlungProzent as number)) / 100
      : null
  const rest =
    preis === null
      ? null
      : mitAnzahlung
        ? Math.round((preis - (anzahlung as number)) * 100) / 100
        : preis
  const extras = aufzaehlung([
    ...(d.bier ? ['Bier'] : []),
    ...(d.zusatzleistungen ? ['Zusatzleistungen'] : []),
    ...(d.material ? ['Material'] : []),
  ])

  abschnitt('zahlung', 'Zahlung', [
    {
      art: 'liste',
      punkte: [
        ...(showbesuch
          ? [[fett('Tickets'), ' bezahlt jede:r Gast beim Kauf zum regulären Preis.']]
          : []),
        ...(mitAnzahlung
          ? [
              [
                fett('Anzahlung'),
                ` ${betragAlsText(d.anzahlungProzent as number)} % (${euro(anzahlung)}), fällig ${faellig(d.anzahlungFrist, 'zwei Wochen vor der Veranstaltung')}.`,
              ],
            ]
          : []),
        ...(d.kaution
          ? [
              [
                fett('Kaution'),
                ` ${euro(d.kautionBetrag)}, fällig ${faellig(d.kautionFrist, mitAnzahlung ? 'mit der Anzahlung' : 'vor der Veranstaltung')}. Sie wird nach der Abnahme des Raums zurückgezahlt oder mit Schäden und offenen Beträgen verrechnet.`,
              ],
            ]
          : []),
        [
          fett(mitAnzahlung ? 'Rest' : 'Zahlung'),
          ` (${euro(rest)}${extras ? ` zuzüglich ${extras}` : ''}) ${d.restFrist ? `fällig ${faellig(d.restFrist, '')}` : 'innerhalb von 14 Tagen nach der Veranstaltung'}, ${d.zahlungsweg === 'ueberweisung' ? 'per Überweisung' : 'in bar oder als Spende'} auf dieses Konto:`,
        ],
      ],
    },
    {
      art: 'tabelle',
      kompakt: true,
      breiten: [22, 78],
      zeilen: [
        ...BANK,
        ...(d.verwendungszweck ? [['Verwendungszweck', d.verwendungszweck] as [string, string]] : []),
      ].map(([bezeichnung, wert]) => [bezeichnung, fett(wert)]),
    },
  ])

  // ── Absage ──────────────────────────────────────────────────────────
  // Feste Hausregel, von Chris am 27.11.2026 bestätigt. Die Staffel folgt
  // dem, was Kulturhäuser üblicherweise ansetzen (Vorbild: Miet- und
  // Benutzungsbedingungen der Stadtteilkultureinrichtungen Hannover ab 2026).
  // Die beiden Sätze zu Ersatz und geringerem Schaden gehören dazu: Ohne sie
  // wäre die Staffel eine Pauschale ohne Ausweg.
  const grundlage = showbesuch ? 'der Heizpauschale' : 'des Preises'
  abschnitt('absage', 'Absage', [
    {
      art: 'liste',
      punkte: [
        `Bis 6 Wochen vor der Veranstaltung kann ${name} kostenfrei absagen. Die Absage muss schriftlich erfolgen, es zählt der Tag, an dem sie beim Pepe Dome eingeht.`,
        [
          'Bei einer späteren Absage werden fällig: 6 bis 3 Wochen vorher ',
          fett('25 %'),
          ', 3 bis 2 Wochen vorher ',
          fett('50 %'),
          ', ab 2 Wochen vorher ',
          fett('100 %'),
          ` ${grundlage} aus Punkt ${nr('preis')}.`,
        ],
        `Findet sich für den Termin ein Ersatz, entfällt die Zahlung. Weist ${name} nach, dass dem Pepe Dome ein geringerer Schaden entstanden ist, ist nur dieser zu zahlen.`,
      ],
    },
  ])

  ausKlausel('hoehereGewalt')
  ausKlausel('uebergabe')
  ausEigenen(eigeneUnten)

  // ── Sonderabsprache ─────────────────────────────────────────────────
  if (d.sonderabsprache) {
    abschnitt(
      'sonderabsprache',
      'Sonderabsprache',
      d.sonderabsprache
        .split(/\n\s*\n/)
        .map((absatz) => ({ art: 'absatz', text: absatz.trim() }) satisfies Baustein)
    )
  }

  ausKlausel('schluss')
  ausKlausel('anlagen')

  // ── Parteien ────────────────────────────────────────────────────────
  const anschrift: Baustein = gegenseite.partnerAddress
    ? { art: 'absatz', text: `Anschrift: ${gegenseite.partnerAddress}` }
    : { art: 'ausfuellen', teile: ['Anschrift:', linie()] }
  const kontakt = [
    ...(gegenseite.partnerPhone ? [`Telefon: ${gegenseite.partnerPhone}`] : []),
    ...(gegenseite.partnerEmail ? [`E-Mail: ${gegenseite.partnerEmail}`] : []),
  ].join(', ')

  const mitVertretung = d.vertretenDurch ? `${name}, vertreten durch ${d.vertretenDurch}` : name

  const parteien: Baustein[] = [
    eigeneSeite(),
    { art: 'abstand', hoehe: 3 },
    { art: 'absatz', text: fett('und') },
    ...(d.minderjaehrig
      ? ([
          { art: 'ausfuellen', teile: [`${name}, geboren am`, linie()] },
          anschrift,
          ...(kontakt ? [{ art: 'absatz', text: kontakt } satisfies Baustein] : []),
          {
            art: 'ausfuellen',
            teile: ['vertreten durch die erziehungsberechtigte Person', linie()],
          },
          { art: 'abstand', hoehe: 2 },
          {
            art: 'absatz',
            text: `Da ${name} bei Unterschrift noch nicht volljährig ist, unterschreibt zusätzlich eine erziehungsberechtigte Person.`,
          },
        ] satisfies Baustein[])
      : ([
          kontakt
            ? { art: 'absatz', text: `${mitVertretung}, ${kontakt}` }
            : { art: 'ausfuellen', teile: [`${mitVertretung}, Telefon:`, linie()] },
          anschrift,
        ] satisfies Baustein[])),
  ]

  // ── Erklärungen und Unterschriften ──────────────────────────────────
  const erklaerung = (ueberschrift: string, text: string): Baustein => ({
    art: 'gruppe',
    bausteine: [
      { art: 'ueberschrift', text: ueberschrift },
      { art: 'absatz', text },
      { art: 'abstand', hoehe: 4 },
      { art: 'ausfuellen', teile: ['Name:', linie()] },
      { art: 'ausfuellen', teile: ['Telefon (am Abend erreichbar):', linie()] },
      { art: 'unterschriften', felder: [['Ort, Datum, Unterschrift Aufsichtsperson']] },
    ],
  })

  const schluss: Baustein[] = [
    ...(d.aufsichtsperson
      ? [
          erklaerung(
            'Verantwortliche erwachsene Aufsichtsperson',
            'Ich bin volljährig, bin während der gesamten Veranstaltung vor Ort und bleibe nüchtern. Ich trage die Verantwortung für den Ablauf und bin Ansprechperson für Polizei, Rettungsdienst und Notarzt.'
          ),
        ]
      : []),
    ...(d.feuer
      ? [
          erklaerung(
            'Aufsichtsperson für das offene Feuer',
            'Ich übernehme am Abend die Aufsicht über das offene Feuer an der dafür vorgesehenen Stelle und trage dafür die Verantwortung.'
          ),
        ]
      : []),
  ]

  const unterschriften: Baustein = {
    art: 'gruppe',
    bausteine: [
      { art: 'ueberschrift', text: 'Unterschriften' },
      {
        art: 'unterschriften',
        felder: [
          [unterschriftEigeneSeite(), `Ort, Datum\n${name}`],
          ...(d.minderjaehrig ? [['Ort, Datum\nErziehungsberechtigte Person']] : []),
        ],
      },
    ],
  }

  return {
    titel,
    akzent: true,
    fuss: FUSSZEILE,
    bausteine: mitSchluss(
      [
        {
          art: 'kopf',
          titel: d.ueberschrift || UEBERSCHRIFT,
          untertitel: d.anlass,
          logo: true,
        },
        ...parteien,
        ...abschnitte.flatMap((eintrag): Baustein[] => [
          { art: 'ueberschrift', text: eintrag.titel },
          ...eintrag.bausteine,
        ]),
        ...schluss,
      ],
      unterschriften
    ),
  }
}
