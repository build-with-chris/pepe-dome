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
 * Startwerte enthalten keine Beträge. Die Zeilen der Zusatzleistungen und die
 * Leistungen im Angebot starten mit ihren Bezeichnungen, die Preise dazu
 * bleiben leer, bis ein früherer Vertrag sie mitbringt.
 */

import { betragAlsEingabe, PREISMODELLE, type Preismodell } from './validation'

export type Zusatzzeile = { leistung: string; preis: string }

export type MieteFelder = {
  anlass: string
  termin: string
  aufbauAb: string
  beginn: string
  ende: string
  gaesteGeplant: string
  gaesteMax: string
  preismodell: Preismodell
  showName: string
  ticketQuote: string
  preisBezeichnung: string
  preisRegulaer: string
  preisVereinbart: string
  anzahlungProzent: string
  anzahlungFrist: string
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

type Roh = Record<string, unknown>

const alsObjekt = (wert: unknown): Roh =>
  wert && typeof wert === 'object' && !Array.isArray(wert) ? (wert as Roh) : {}

const text = (wert: unknown, start = ''): string => (typeof wert === 'string' ? wert : start)

/** Zahl aus der Datenbank oder Text aus einer früheren Eingabe. */
const betrag = (wert: unknown): string =>
  typeof wert === 'number' ? betragAlsEingabe(wert) : text(wert)

const schalter = (wert: unknown): boolean => wert === true

export function mieteFelder(daten?: unknown): MieteFelder {
  const d = alsObjekt(daten)
  const zeilen = Array.isArray(d.zusatzleistungenZeilen)
    ? d.zusatzleistungenZeilen.map((zeile) => {
        const z = alsObjekt(zeile)
        return { leistung: text(z.leistung), preis: text(z.preis) }
      })
    : ZUSATZLEISTUNGEN.map((leistung) => ({ leistung, preis: '' }))

  return {
    anlass: text(d.anlass),
    termin: text(d.termin),
    aufbauAb: text(d.aufbauAb),
    beginn: text(d.beginn),
    ende: text(d.ende),
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
    anzahlungProzent: betrag(d.anzahlungProzent),
    anzahlungFrist: text(d.anzahlungFrist),
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
