/**
 * Klauseln, die sich im Formular ein- und ausschalten und frei umschreiben
 * lassen. Gedacht für Mietvereinbarungen, die über eine Feier hinausgehen:
 * mehrtägige Projekte, Veranstaltungen mit eigenem Publikum, fremde Technik.
 *
 * Die Texte hier sind nur Startwerte. Beim Einschalten landen sie im
 * Textfeld des Formulars, werden dort angepasst und mit dem Vertrag
 * gespeichert. Ins PDF kommt, was im Feld steht. Eine Änderung hier ändert
 * also keinen gespeicherten Vertrag.
 *
 * Vorbild ist der Mustervertrag für einen Veranstalter, den Chris am
 * 27.11.2026 gezeigt hat. Übernommen ist der Aufbau, nicht der Wortlaut mit
 * seinen Platzhaltern. Wo ein Wert fehlt, steht eine Linie.
 *
 * Die Datei ist frei von Server-Abhängigkeiten und darf im Browser landen.
 */

export const LUECKE = '________'

/** Steht hinter dem Preis der Mietvereinbarung, solange niemand etwas anderes einträgt. */
export const PREIS_ENTHALTEN = 'Miete und Heizung für die Veranstaltung'

/** Gastronomie, entschieden am 27.11.2026: alles über den Pepe Dome. */
export const GASTRO = [
  'Getränke und Speisen werden vom Pepe Dome angeboten. Die Einnahmen daraus gehen an den Pepe Dome.',
  'Ausnahmen sind möglich, wenn sie vorher schriftlich vereinbart werden.',
]

/**
 * Höhere Gewalt, entschieden am 27.11.2026: erst Ersatztermin, dann dürfen
 * beide Seiten zurücktreten. Die drei Beispiele sind die, die Chris so
 * bestätigt hat. Ob ein Ausfall der Technik rechtlich als höhere Gewalt
 * durchgeht, ist offen und gehört in die juristische Durchsicht.
 */
export const HOEHERE_GEWALT = [
  'Kann die Veranstaltung wegen höherer Gewalt nicht stattfinden, etwa wegen Sturm, einer behördlichen Anordnung oder eines Ausfalls der Technik, suchen beide Seiten zuerst einen Ersatztermin.',
  'Findet sich kein Ersatztermin, können beide Seiten vom Vertrag zurücktreten. Bereits Gezahltes wird erstattet. Weitergehende Ansprüche sind ausgeschlossen, soweit gesetzlich zulässig.',
]

export const KLAUSELN = [
  'ausstattung',
  'publikum',
  'technik',
  'gastro',
  'haftung',
  'hoehereGewalt',
  'uebergabe',
  'schluss',
  'anlagen',
] as const
export type Klausel = (typeof KLAUSELN)[number]

type Beschreibung = {
  /** Überschrift im PDF. */
  titel: string
  /** Kurzer Hinweis im Formular. */
  hinweis: string
  /**
   * Startwert des Textfelds. `name` ist die Gegenseite, wie sie im Formular
   * steht. Er steht nie am Satzende, sonst gibt „e.V.“ einen doppelten Punkt.
   */
  standard: (name: string) => string[]
}

export const KLAUSEL: Record<Klausel, Beschreibung> = {
  ausstattung: {
    titel: 'Mietgegenstand und Ausstattung',
    hinweis: 'Was genutzt wird: Raum, Ausstattung, Technik. Steht gleich nach Termin und Zeit.',
    standard: () => [
      'Genutzt wird der Pepe Dome im Ostpark München mit der vorhandenen Ausstattung und Technik.',
      'Maßgeblich ist der aktuelle Technical Rider des Pepe Dome. Sonderausstattung und zusätzliche Technik gehören nicht dazu.',
    ],
  },
  publikum: {
    titel: 'Veranstaltung mit Publikum',
    hinweis: 'Ticketing und Einlass, GEMA und KSK, Fluchtwege, Nebel, Untervermietung.',
    standard: (name) => [
      `${name} ist für Ticketverkauf, Kasse, Einlass und die Betreuung der Gäste selbst verantwortlich.`,
      `${name} übernimmt Anmeldungen und Gebühren, die aus der Veranstaltung entstehen, insbesondere GEMA und Künstlersozialabgabe.`,
      'Fluchtwege und Notausgänge bleiben frei. Es gelten die Vorgaben zu Brandschutz und Sicherheit und die Auflagen der Behörden.',
      'Pyrotechnik, Nebel und Hazer nur nach vorheriger schriftlicher Zustimmung des Pepe Dome.',
      'Eine Untervermietung oder Überlassung an Dritte ist nur mit vorheriger schriftlicher Zustimmung des Pepe Dome möglich.',
    ],
  },
  technik: {
    titel: 'Technik und Personal',
    hinweis: 'Einbauten, Rigging, eigene Technik, wer das Technikpersonal stellt.',
    standard: (name) => [
      'Einbauten, Hängungen und Eingriffe in die Technik des Pepe Dome nur nach Absprache mit der technischen Leitung des Pepe Dome und nach dem Technical Rider.',
      'Rigging und Lasten nur nach Freigabe durch den Pepe Dome und nur durch qualifiziertes Personal. Die zulässigen Lasten sind einzuhalten.',
      `Eigene Technik meldet ${name} vorher an. Sie muss betriebssicher sein (DGUV V3).`,
      `${name} stellt das technische Personal für Proben und Vorstellungen.`,
      `Ansprechperson für Produktion und Technik: ${LUECKE}`,
    ],
  },
  gastro: {
    titel: 'Getränke und Speisen',
    hinweis: 'Gastronomie über den Pepe Dome, Ausnahmen nur schriftlich.',
    standard: () => [...GASTRO],
  },
  haftung: {
    titel: 'Haftung und Versicherung',
    hinweis: 'Haftung beider Seiten und Nachweis einer Veranstalterhaftpflicht.',
    standard: (name) => [
      `${name} haftet für Schäden am Pepe Dome, an der Technik und am Gelände, die bei der Nutzung entstehen, auch wenn Mitwirkende, Gäste oder Beauftragte sie verursachen.`,
      `${name} weist bis ${LUECKE} eine Veranstalterhaftpflichtversicherung mit einer Deckungssumme von mindestens ${LUECKE} € nach.`,
      'Der Pepe Dome haftet nur für Vorsatz und grobe Fahrlässigkeit. Bei Schäden an Leben, Körper und Gesundheit und bei der Verletzung wesentlicher Vertragspflichten gilt das Gesetz.',
      'Mitgebrachte Gegenstände lagern auf eigene Gefahr.',
    ],
  },
  hoehereGewalt: {
    titel: 'Höhere Gewalt',
    hinweis: 'Erst Ersatztermin, sonst dürfen beide Seiten zurücktreten. Wie im Künstlervertrag.',
    standard: () => [...HOEHERE_GEWALT],
  },
  uebergabe: {
    titel: 'Besichtigung, Übergabe und Rückgabe',
    hinweis: 'Besichtigung vorher, Übergabe und Rückgabe mit Protokoll, verspäteter Abbau.',
    standard: () => [
      'Vor Beginn ist eine Besichtigung möglich. Den Termin stimmt der Pepe Dome ab.',
      'Der Pepe Dome wird zu Beginn mit Protokoll übergeben und am Ende mit Protokoll zurückgegeben.',
      'Dauert der Abbau länger als vereinbart, kann die zusätzliche Zeit berechnet werden.',
    ],
  },
  schluss: {
    titel: 'Schlussbestimmungen',
    hinweis: 'Textform, Teilunwirksamkeit, Recht und Gerichtsstand.',
    standard: () => [
      'Änderungen und Ergänzungen brauchen die Textform.',
      'Ist eine Bestimmung unwirksam, bleiben die übrigen wirksam.',
      'Es gilt deutsches Recht. Gerichtsstand ist, soweit zulässig, München.',
    ],
  },
  anlagen: {
    titel: 'Anlagen',
    hinweis: 'Liste der Anlagen. Steht als letzter Abschnitt vor den Unterschriften.',
    standard: () => [
      'Anlage 1: Kostenaufstellung',
      'Anlage 2: Technical Rider des Pepe Dome',
      'Anlage 3: Belegungs- und Zeitplan',
    ],
  },
}

/** Der Startwert fürs Textfeld. Ohne Namen steht dort eine Linie. */
export function klauselStandard(klausel: Klausel, name: string): string {
  return KLAUSEL[klausel].standard(name.trim() || LUECKE).join('\n')
}

/**
 * Zerlegt den Text eines Felds in Punkte: jede Zeile ein Punkt. Ein
 * vorangestellter Spiegelstrich oder Aufzählungspunkt fällt weg, leere
 * Zeilen auch.
 */
export function zeilenAus(text: string): string[] {
  return text
    .split('\n')
    .map((zeile) => zeile.trim().replace(/^[-–•*]\s+/, ''))
    .filter(Boolean)
}
