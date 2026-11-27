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
 * Geburtsdatum, Erziehungsberechtigte und Aufsichtspersonen werden nicht
 * erfasst. Sie bleiben Linien im PDF und werden von Hand eingetragen.
 *
 * Ist ein Vertrag verschickt, ändert eine neue Fassung dieser Datei ihn nicht
 * mehr: Sein Dokument liegt dann eingefroren in `contracts.snapshot`.
 */

import { fett, linie, type Baustein, type Dokument, type Inhalt } from './dokument'
import { eigeneSeite, FUSSZEILE, unterschriftenEigeneSeite } from './partei'
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

const LUECKE = '________'

const euro = (betrag: number | null) => `${betrag === null ? LUECKE : betragAlsText(betrag)} €`
const oder = (wert: string, ersatz = LUECKE) => wert || ersatz

/** Hängt einen Punkt an, wenn der Text nicht schon mit einem Satzzeichen endet. */
const satz = (wert: string) => (/[.!?]$/.test(wert) ? wert : `${wert}.`)

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
  const reihenfolge = [
    'termin',
    'gaeste',
    'preis',
    ...(d.zusatzleistungen ? ['zusatz'] : []),
    ...(d.material ? ['material'] : []),
    ...(d.bier ? ['bier'] : []),
    ...(d.lautstaerkeHervorgehoben ? ['lautstaerke'] : []),
    'regeln',
    'zahlung',
    ...(d.sonderabsprache ? ['sonderabsprache'] : []),
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
        showbesuch
          ? `Die Gruppe besucht die Show „${oder(d.showName)}“ und feiert im Anschluss im Dome, bis spätestens ${oder(d.ende)} Uhr.`
          : `Veranstaltung von ${oder(d.beginn)} bis ${oder(d.ende)} Uhr. Um ${oder(d.ende)} Uhr sind alle Gäste draußen.`,
      ],
    },
  ])

  // ── Gäste ───────────────────────────────────────────────────────────
  abschnitt('gaeste', 'Gäste', [
    {
      art: 'liste',
      punkte: [
        [
          `Geplant sind ${oder(d.gaesteGeplant)} Personen, höchstens `,
          fett(`${oder(d.gaesteMax)} Personen`),
          '.',
        ],
        d.aufsichtsperson
          ? `${name} veranstaltet die Feier und ist für alle Gäste verantwortlich.`
          : `${name} veranstaltet die Feier und ist für alle Gäste verantwortlich, ist während der gesamten Feier vor Ort und Ansprechperson für Polizei, Rettungsdienst und Notarzt.`,
      ],
    },
  ])

  // ── Preis ───────────────────────────────────────────────────────────
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
          ' Enthalten sind Miete und Heizung für die Veranstaltung.',
        ],
      },
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
          'Was genutzt wurde, wird nach der Feier gemeinsam aufgeschrieben.',
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

  // ── Lautstärke als eigene, hervorgehobene Regel ─────────────────────
  if (d.lautstaerkeHervorgehoben) {
    abschnitt('lautstaerke', 'Wichtigste Regel: Lautstärke', [
      {
        art: 'hinweis',
        text: `Ab 22:00 Uhr wird es leiser. Der Pepe Dome unterliegt der Grünflächenverordnung. Erlaubt ist eine Lautstärke wie bei unseren Shows, mehr nicht. ${name} sorgt dafür, dass sich alle Gäste daran halten, auch draußen. Wird es zu laut, kann der Pepe Dome die Musik leiser stellen oder die Feier vorzeitig beenden.`,
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
                ` ${betragAlsText(d.anzahlungProzent as number)} % (${euro(anzahlung)}) zwei Wochen vorher${d.anzahlungFrist ? `: bis ${d.anzahlungFrist}` : ''}.`,
              ],
            ]
          : []),
        ...(d.kaution
          ? [
              [
                fett('Kaution'),
                ` ${euro(d.kautionBetrag)}, fällig ${mitAnzahlung ? 'mit der Anzahlung' : 'vor der Veranstaltung'}. Sie wird nach der Abnahme des Raums zurückgezahlt oder mit Schäden und offenen Beträgen verrechnet.`,
              ],
            ]
          : []),
        [
          fett(mitAnzahlung ? 'Rest' : 'Zahlung'),
          ` (${euro(rest)}${extras ? ` zuzüglich ${extras}` : ''}) innerhalb von 14 Tagen nach der Veranstaltung, in bar oder als Spende auf dieses Konto:`,
        ],
      ],
    },
    {
      art: 'tabelle',
      kompakt: true,
      breiten: [22, 78],
      zeilen: BANK.map(([bezeichnung, wert]) => [bezeichnung, fett(wert)]),
    },
  ])

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

  // ── Parteien ────────────────────────────────────────────────────────
  const anschrift: Baustein = gegenseite.partnerAddress
    ? { art: 'absatz', text: `Anschrift: ${gegenseite.partnerAddress}` }
    : { art: 'ausfuellen', teile: ['Anschrift:', linie()] }
  const kontakt = [
    ...(gegenseite.partnerPhone ? [`Telefon: ${gegenseite.partnerPhone}`] : []),
    ...(gegenseite.partnerEmail ? [`E-Mail: ${gegenseite.partnerEmail}`] : []),
  ].join(', ')

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
            ? { art: 'absatz', text: `${name}, ${kontakt}` }
            : { art: 'ausfuellen', teile: [`${name}, Telefon:`, linie()] },
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
    {
      art: 'gruppe',
      bausteine: [
        { art: 'ueberschrift', text: 'Unterschriften' },
        {
          art: 'unterschriften',
          // Erste Zeile die eigene Seite, zweite die Gegenseite.
          felder: [
            unterschriftenEigeneSeite(),
            [
              `Ort, Datum\n${name}`,
              ...(d.minderjaehrig ? ['Ort, Datum\nErziehungsberechtigte Person'] : []),
            ],
          ],
        },
      ],
    },
  ]

  return {
    titel,
    akzent: true,
    fuss: FUSSZEILE,
    bausteine: [
      {
        art: 'kopf',
        titel: 'Vereinbarung zur Nutzung des Pepe Dome',
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
  }
}
