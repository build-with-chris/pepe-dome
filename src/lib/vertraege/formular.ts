/**
 * Zustand des Vertragsformulars: alles als Text oder Schalter, so wie es in
 * den Eingabefeldern steht.
 *
 * Gespeicherte Verträge haben Beträge als Zahlen (siehe validation.ts). Die
 * Funktionen hier machen daraus wieder Text fürs Formular und füllen alles,
 * was fehlt, mit dem Startwert. Dieselben Funktionen bauen auch das leere
 * Formular für einen neuen Vertrag: Sie bekommen dann nur die Betragsfelder
 * des letzten Vertrags desselben Typs, oder nichts.
 *
 * Startwerte enthalten keine Preise. Die Zeilen der Zusatzleistungen und die
 * Leistungen im Angebot starten mit ihren Bezeichnungen, die Preise dazu
 * bleiben leer, bis ein früherer Vertrag sie mitbringt. Einzige Zahl ist der
 * Anteil der Anzahlung, siehe ANZAHLUNG_PROZENT.
 */

import { KLAUSELN, PREIS_ENTHALTEN, type Klausel } from './klauseln'
import {
  betragAlsEingabe,
  PREISMODELLE,
  UMSATZSTEUER,
  VERGUETUNGEN,
  ZAHLUNGSWEGE,
  type Preismodell,
  type Umsatzsteuer,
  type Verguetung,
  type Zahlungsweg,
} from './validation'

export type Zusatzzeile = { leistung: string; preis: string }
export type KlauselFeld = { an: boolean; text: string }
export type EigenerAbschnitt = { titel: string; text: string; oben: boolean }

export { PREIS_ENTHALTEN }

export type MieteFelder = {
  ueberschrift: string
  anlass: string
  vertretenDurch: string
  termin: string
  aufbauAb: string
  beginn: string
  ende: string
  ablauf: string
  gaesteGeplant: string
  gaesteMax: string
  preismodell: Preismodell
  showName: string
  ticketQuote: string
  preisBezeichnung: string
  preisRegulaer: string
  preisVereinbart: string
  preisEnthalten: string
  umsatzsteuer: Umsatzsteuer
  anzahlungProzent: string
  anzahlungFrist: string
  restFrist: string
  zahlungsweg: Zahlungsweg
  verwendungszweck: string
  einweisung: string
  minderjaehrig: boolean
  zusatzleistungen: boolean
  material: boolean
  bier: boolean
  aufsichtsperson: boolean
  feuer: boolean
  jugendschutz: boolean
  lautstaerkeHervorgehoben: boolean
  kaution: boolean
  zusatzleistungenZeilen: Zusatzzeile[]
  werkzeugGebuehr: string
  verbrauchsmaterial: string
  bierPreis: string
  kautionBetrag: string
  kautionFrist: string
  klauseln: Record<Klausel, KlauselFeld>
  eigeneAbschnitte: EigenerAbschnitt[]
  sonderabsprache: string
}

export type AngebotFelder = {
  veranstaltung: string
  datum: string
  uhrzeit: string
  reservierung: string
  gaeste: string
  leistungen: string[]
  preisRegulaerBezeichnung: string
  preisRegulaer: string
  preisAngebot: string
  getraenke: string
  stand: string
}

/** Künstlervertrag und Veranstaltervertrag teilen sich die Felder. */
export type AuftrittFelder = {
  titel: string
  termin: string
  aufbauAb: string
  einlass: string
  beginn: string
  ende: string
  verguetung: Verguetung
  anteilGegenseite: string
  mitMwst: boolean
  gage: string
  foerderung: string
  bedingungen: string
  erwartungen: string
  sonderabsprache: string
}

const ZUSATZLEISTUNGEN = [
  'Nutzung der Luftpunkte',
  'Showvorbereitung (Lichter einstellen, Vorbereitungen)',
  'Ansprechperson vor Ort bei Problemen mit Strom, Heizung o. Ä.',
]

const LEISTUNGEN = [
  'Nutzung des Pepe Dome',
  'Der Dome ist zur Veranstaltung beheizt',
  'Getränke: Sie können Getränke bei uns vor Ort beziehen. Abgerechnet wird nach Verbrauch.',
]

/**
 * Regel des Hauses: Die Hälfte ist zwei Wochen vor der Veranstaltung fällig.
 * Ein Anteil und eine Frist, kein Preis, deshalb darf beides hier stehen.
 */
export const ANZAHLUNG_PROZENT = '50'
export const ANZAHLUNG_TAGE_VORHER = 14

/**
 * Das Datum, das `tage` vor dem Tag der Veranstaltung liegt. Nimmt den Tag
 * als JJJJ-MM-TT, so wie das Datumsfeld ihn liefert, und gibt TT.MM.JJJJ
 * zurück. Ohne gültiges Datum kommt ein leerer String.
 */
export function fristVor(datum: string, tage = ANZAHLUNG_TAGE_VORHER): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(datum)) return ''
  // In UTC rechnen, sonst rutscht der Tag je nach Zeitzone des Browsers.
  const tag = new Date(`${datum}T00:00:00Z`)
  if (Number.isNaN(tag.getTime())) return ''
  tag.setUTCDate(tag.getUTCDate() - tage)
  const zwei = (wert: number) => String(wert).padStart(2, '0')
  return `${zwei(tag.getUTCDate())}.${zwei(tag.getUTCMonth() + 1)}.${tag.getUTCFullYear()}`
}

type Roh = Record<string, unknown>

const alsObjekt = (wert: unknown): Roh =>
  wert && typeof wert === 'object' && !Array.isArray(wert) ? (wert as Roh) : {}

const text = (wert: unknown, start = ''): string => (typeof wert === 'string' ? wert : start)

/** Zahl aus der Datenbank oder Text aus einer früheren Eingabe. */
const betrag = (wert: unknown): string =>
  typeof wert === 'number' ? betragAlsEingabe(wert) : text(wert)

const schalter = (wert: unknown): boolean => wert === true

function auswahl<T extends string>(wert: unknown, erlaubt: readonly T[], start: T): T {
  return (erlaubt as readonly unknown[]).includes(wert) ? (wert as T) : start
}

export function mieteFelder(daten?: unknown): MieteFelder {
  const d = alsObjekt(daten)
  const zeilen = Array.isArray(d.zusatzleistungenZeilen)
    ? d.zusatzleistungenZeilen.map((zeile) => {
        const z = alsObjekt(zeile)
        return { leistung: text(z.leistung), preis: text(z.preis) }
      })
    : ZUSATZLEISTUNGEN.map((leistung) => ({ leistung, preis: '' }))

  const gespeicherteKlauseln = alsObjekt(d.klauseln)
  const klauseln = Object.fromEntries(
    KLAUSELN.map((schluessel) => {
      const k = alsObjekt(gespeicherteKlauseln[schluessel])
      return [schluessel, { an: schalter(k.an), text: text(k.text) }]
    })
  ) as Record<Klausel, KlauselFeld>

  const eigeneAbschnitte = Array.isArray(d.eigeneAbschnitte)
    ? d.eigeneAbschnitte.map((eintrag) => {
        const e = alsObjekt(eintrag)
        return { titel: text(e.titel), text: text(e.text), oben: schalter(e.oben) }
      })
    : []

  return {
    ueberschrift: text(d.ueberschrift),
    anlass: text(d.anlass),
    vertretenDurch: text(d.vertretenDurch),
    termin: text(d.termin),
    aufbauAb: text(d.aufbauAb),
    beginn: text(d.beginn),
    ende: text(d.ende),
    ablauf: text(d.ablauf),
    gaesteGeplant: text(d.gaesteGeplant),
    gaesteMax: text(d.gaesteMax),
    preismodell: (PREISMODELLE as readonly unknown[]).includes(d.preismodell)
      ? (d.preismodell as Preismodell)
      : 'pauschale',
    showName: text(d.showName),
    ticketQuote: betrag(d.ticketQuote),
    preisBezeichnung: text(d.preisBezeichnung),
    preisRegulaer: betrag(d.preisRegulaer),
    preisVereinbart: betrag(d.preisVereinbart),
    // Wie bei der Anzahlung: Fehlt der Wert, gilt der bisherige Satz.
    preisEnthalten: text(d.preisEnthalten, PREIS_ENTHALTEN),
    umsatzsteuer: auswahl(d.umsatzsteuer, UMSATZSTEUER, 'keine'),
    // Fehlt der Wert, gilt die Hausregel. Ein bewusst geleertes Feld ist als
    // null gespeichert und bleibt leer: dann gibt es keine Anzahlung.
    anzahlungProzent:
      d.anzahlungProzent === undefined ? ANZAHLUNG_PROZENT : betrag(d.anzahlungProzent),
    anzahlungFrist: text(d.anzahlungFrist),
    restFrist: text(d.restFrist),
    zahlungsweg: auswahl(d.zahlungsweg, ZAHLUNGSWEGE, 'barOderSpende'),
    verwendungszweck: text(d.verwendungszweck),
    einweisung: text(d.einweisung),
    minderjaehrig: schalter(d.minderjaehrig),
    zusatzleistungen: schalter(d.zusatzleistungen),
    material: schalter(d.material),
    bier: schalter(d.bier),
    aufsichtsperson: schalter(d.aufsichtsperson),
    feuer: schalter(d.feuer),
    jugendschutz: schalter(d.jugendschutz),
    lautstaerkeHervorgehoben: schalter(d.lautstaerkeHervorgehoben),
    kaution: schalter(d.kaution),
    zusatzleistungenZeilen: zeilen,
    werkzeugGebuehr: betrag(d.werkzeugGebuehr),
    verbrauchsmaterial: text(d.verbrauchsmaterial),
    bierPreis: betrag(d.bierPreis),
    kautionBetrag: betrag(d.kautionBetrag),
    kautionFrist: text(d.kautionFrist),
    klauseln,
    eigeneAbschnitte,
    sonderabsprache: text(d.sonderabsprache),
  }
}

/** `heute` als TT.MM.JJJJ. Wird nur als Startwert für „Stand“ benutzt. */
export function angebotFelder(daten?: unknown, heute = ''): AngebotFelder {
  const d = alsObjekt(daten)
  return {
    veranstaltung: text(d.veranstaltung),
    datum: text(d.datum),
    uhrzeit: text(d.uhrzeit),
    reservierung: text(d.reservierung),
    gaeste: text(d.gaeste),
    leistungen: Array.isArray(d.leistungen)
      ? d.leistungen.map((zeile) => text(zeile))
      : [...LEISTUNGEN],
    preisRegulaerBezeichnung: text(d.preisRegulaerBezeichnung),
    preisRegulaer: betrag(d.preisRegulaer),
    preisAngebot: betrag(d.preisAngebot),
    getraenke: text(d.getraenke, 'nach Verbrauch'),
    stand: text(d.stand, heute),
  }
}

export function auftrittFelder(daten?: unknown): AuftrittFelder {
  const d = alsObjekt(daten)
  return {
    titel: text(d.titel),
    termin: text(d.termin),
    aufbauAb: text(d.aufbauAb),
    einlass: text(d.einlass),
    beginn: text(d.beginn),
    ende: text(d.ende),
    verguetung: (VERGUETUNGEN as readonly unknown[]).includes(d.verguetung)
      ? (d.verguetung as Verguetung)
      : 'ticketanteil',
    anteilGegenseite: betrag(d.anteilGegenseite),
    mitMwst: schalter(d.mitMwst),
    gage: betrag(d.gage),
    foerderung: text(d.foerderung),
    bedingungen: text(d.bedingungen),
    erwartungen: text(d.erwartungen),
    sonderabsprache: text(d.sonderabsprache),
  }
}
