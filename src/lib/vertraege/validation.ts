/**
 * Validierung für Verträge: Pflichtfelder und Formate je Vertragstyp.
 *
 * Liegt getrennt von den Routen, weil POST und PATCH dieselben Regeln
 * brauchen und das Formular dieselben Typen nutzt. Die Datei ist frei von
 * Server-Abhängigkeiten und darf im Browser landen.
 *
 * Pflicht ist bewusst wenig: Name der Gegenseite, Anlass oder Veranstaltung,
 * bei der Mietvereinbarung der Termin. Alles andere darf leer bleiben und
 * erscheint im PDF als Linie zum Ausfüllen von Hand. So lässt sich ein Entwurf
 * speichern, bevor jede Zahl feststeht.
 *
 * Beträge stehen nie im Code. Sie sind Formularfelder, liegen in der Spalte
 * `contracts.data` und werden für einen neuen Vertrag aus dem letzten
 * Vertrag desselben Typs vorbelegt (siehe `betraegeAus`).
 */

import { z } from 'zod'

export const VERTRAGSTYPEN = ['MIETE', 'ANGEBOT', 'KUENSTLER', 'VERANSTALTER'] as const
export type Vertragstyp = (typeof VERTRAGSTYPEN)[number]

export const VERTRAGSSTATUS = ['ENTWURF', 'VERSCHICKT', 'UNTERSCHRIEBEN', 'BEZAHLT'] as const
export type Vertragsstatus = (typeof VERTRAGSSTATUS)[number]

export const TYP_LABEL: Record<Vertragstyp, string> = {
  MIETE: 'Mietvereinbarung',
  ANGEBOT: 'Angebot',
  KUENSTLER: 'Künstlervertrag',
  VERANSTALTER: 'Veranstaltervertrag',
}

export const STATUS_LABEL: Record<Vertragsstatus, string> = {
  ENTWURF: 'Entwurf',
  VERSCHICKT: 'Verschickt',
  UNTERSCHRIEBEN: 'Unterschrieben',
  BEZAHLT: 'Bezahlt',
}

// ── Bausteine der Schemas ───────────────────────────────────────────────

/** Freitext, der leer bleiben darf. Fehlt das Feld, wird es zum leeren String. */
const text = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Höchstens ${max} Zeichen`)
    .nullish()
    .transform((wert) => wert ?? '')

const pflicht = (name: string, max: number) =>
  z
    .string({ error: `${name} ist Pflicht` })
    .trim()
    .min(1, `${name} ist Pflicht`)
    .max(max, `${name}: höchstens ${max} Zeichen`)

/** „15:00 Uhr“ wird zu „15:00“. Das Wort „Uhr“ setzt die Vorlage selbst. */
const uhrzeit = text(40).transform((wert) => wert.replace(/\s*Uhr\.?$/i, ''))

const schalter = z
  .boolean()
  .nullish()
  .transform((wert) => wert === true)

/**
 * Liest einen Betrag aus einer Eingabe. Versteht „120“, „120,50“, „120.50“,
 * „1.200“ und „1.200,50“. Was Menschen dazuschreiben, wird überlesen: „€“,
 * „Euro“, „EUR“, „%“ und ein angehängtes „,-“. Leer ergibt null.
 * Gibt `undefined` zurück, wenn sich keine Zahl ergibt.
 *
 * Großzügig mit Absicht: Ein abgelehntes „50 %“ im Feld für die Anzahlung hat
 * beim ersten echten Vertrag das Speichern verhindert.
 */
export function leseBetrag(eingabe: unknown): number | null | undefined {
  if (eingabe === null || eingabe === undefined) return null
  if (typeof eingabe === 'number') return Number.isFinite(eingabe) && eingabe >= 0 ? eingabe : undefined
  if (typeof eingabe !== 'string') return undefined

  let wert = eingabe.replace(/€|euro?|%|\s/gi, '').replace(/[.,][-–—]+$/, '')
  if (!wert) return null
  if (wert.includes(',')) {
    wert = wert.replace(/\./g, '').replace(',', '.')
  } else if (/^\d{1,3}(\.\d{3})+$/.test(wert)) {
    wert = wert.replace(/\./g, '')
  }
  if (!/^\d+(\.\d+)?$/.test(wert)) return undefined
  return Number(wert)
}

const zahl = (meldung: string, max?: number) =>
  // .optional() davor, sonst lehnt zod 4 einen fehlenden Schlüssel ab, bevor
  // die Umwandlung ihn zu null machen kann.
  z
    .unknown()
    .optional()
    .transform((eingabe, ctx) => {
      const wert = leseBetrag(eingabe)
      if (wert === undefined || (max !== undefined && wert !== null && wert > max)) {
        ctx.addIssue({ code: 'custom', message: meldung })
        return z.NEVER
      }
      return wert
    })

const betrag = zahl('Betrag als Zahl angeben, etwa 120 oder 120,50')
const prozent = zahl('Prozent als Zahl zwischen 0 und 100 angeben', 100)

// ── Gegenseite, für alle Vertragstypen gleich ───────────────────────────

const gegenseite = {
  partnerName: pflicht('Name der Gegenseite', 160),
  partnerEmail: text(200)
    .refine((wert) => !wert || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(wert), 'E-Mail-Adresse prüfen')
    .transform((wert) => wert || null),
  partnerPhone: text(60).transform((wert) => wert || null),
  partnerAddress: text(300).transform((wert) => wert || null),
  /** Tag der Veranstaltung als JJJJ-MM-TT, nur zum Sortieren der Liste. */
  eventDate: text(10)
    .refine(
      (wert) => !wert || (/^\d{4}-\d{2}-\d{2}$/.test(wert) && !Number.isNaN(Date.parse(wert))),
      'Datum als JJJJ-MM-TT angeben'
    )
    .transform((wert) => wert || null),
}

// ── Mietvereinbarung ────────────────────────────────────────────────────

export const PREISMODELLE = ['pauschale', 'showbesuch'] as const
export type Preismodell = (typeof PREISMODELLE)[number]

const zusatzleistung = z.object({
  leistung: text(200),
  /** Freitext, damit auch ein Zusatz wie „für den Abend“ geht. */
  preis: text(60),
})

export const mieteDatenSchema = z
  .object({
    /** Untertitel des Vertrags, etwa „Feier zum 18. Geburtstag“. */
    anlass: pflicht('Anlass', 120),
    /** Termin als Text, weil er auch „Freitag oder Samstag“ lauten kann. */
    termin: pflicht('Termin', 300),
    aufbauAb: uhrzeit,
    beginn: uhrzeit,
    ende: uhrzeit,
    gaesteGeplant: text(60),
    gaesteMax: text(60),

    preismodell: z
      .enum(PREISMODELLE)
      .nullish()
      .transform((wert) => wert ?? 'pauschale'),
    /** Nur Showbesuch: Name der Show und Anteil der Gäste mit regulärem Ticket. */
    showName: text(120),
    ticketQuote: prozent,
    /** Nur Mietpauschale, etwa „Freundschaftspreis zum 18. Geburtstag“. */
    preisBezeichnung: text(120),
    preisRegulaer: betrag,
    /** Mietpauschale oder, beim Showbesuch, die Heizpauschale. */
    preisVereinbart: betrag,
    anzahlungProzent: prozent,
    anzahlungFrist: text(200).transform((wert) => wert.replace(/^bis\s+/i, '')),
    einweisung: text(200),

    minderjaehrig: schalter,
    zusatzleistungen: schalter,
    material: schalter,
    bier: schalter,
    aufsichtsperson: schalter,
    feuer: schalter,
    jugendschutz: schalter,
    lautstaerkeHervorgehoben: schalter,
    kaution: schalter,

    zusatzleistungenZeilen: z
      .array(zusatzleistung)
      .max(12, 'Höchstens 12 Zusatzleistungen')
      .nullish()
      .transform((zeilen) => (zeilen ?? []).filter((zeile) => zeile.leistung)),
    werkzeugGebuehr: betrag,
    /** Regel für Verbrauchsmaterial als Text, etwa „zum Einkaufspreis“. */
    verbrauchsmaterial: text(120),
    bierPreis: betrag,
    kautionBetrag: betrag,

    sonderabsprache: text(4000),
  })
  .superRefine((daten, ctx) => {
    if (daten.preismodell === 'showbesuch' && !daten.showName) {
      ctx.addIssue({
        code: 'custom',
        path: ['showName'],
        message: 'Beim Showbesuch gehört der Name der Show dazu',
      })
    }
  })

export type MieteDaten = z.infer<typeof mieteDatenSchema>

// ── Angebot ─────────────────────────────────────────────────────────────

export const angebotDatenSchema = z.object({
  veranstaltung: pflicht('Veranstaltung', 120),
  datum: text(120),
  uhrzeit: text(120),
  reservierung: text(200),
  gaeste: text(120),
  leistungen: z
    .array(text(300))
    .max(20, 'Höchstens 20 Leistungen')
    .nullish()
    .transform((zeilen) => (zeilen ?? []).filter(Boolean)),
  /** Beschriftung der Zeile mit dem regulären Preis. */
  preisRegulaerBezeichnung: text(120),
  preisRegulaer: betrag,
  preisAngebot: betrag,
  /** Etwa „nach Verbrauch“. Leer heißt: keine Zeile zu Getränken. */
  getraenke: text(120),
  /** Datum des Angebots als Text, etwa „19.11.2026“. */
  stand: text(40),
})

export type AngebotDaten = z.infer<typeof angebotDatenSchema>

// ── Künstlervertrag und Veranstaltervertrag ─────────────────────────────

/**
 * Grundgerüst, Stand 26.11.2026. Beide Verträge teilen sich die Felder.
 *
 * Fest steht bisher: die Aufteilung der Ticketeinnahmen (meist 60 zu 40
 * zugunsten der Gegenseite) auf Grundlage der Netto-Ticketeinnahmen ohne
 * Ticketgebühren, dass die Gastronomie immer beim Pepe Dome bleibt, bei
 * Künstler:innen die feste Gage als zweite Möglichkeit, wenn eine Förderung
 * dahintersteht, und wann abgerechnet und gezahlt wird.
 *
 * Fest stehen seit dem 27.11.2026 außerdem die Regel zur höheren Gewalt
 * (erst Ersatztermin, dann dürfen beide zurücktreten) und zur Gastronomie
 * (alles über den Pepe Dome, Ausnahmen nur schriftlich vorab).
 *
 * Noch nicht geklärt und deshalb ohne festen Wortlaut: Ausfall und Absage,
 * Bedingungen vor Ort, was der Pepe Dome als Gastgeber erwartet. Dafür gibt es je ein Freitextfeld. Was dort steht, wird ein
 * eigener Abschnitt, ein leeres Feld erzeugt keinen. Sobald die Regeln
 * feststehen, werden aus den Feldern feste Klauseln mit Schaltern, wie in der
 * Mietvereinbarung.
 */
export const VERGUETUNGEN = ['ticketanteil', 'gage'] as const
export type Verguetung = (typeof VERGUETUNGEN)[number]

export const auftrittDatenSchema = z.object({
  /** Titel der Show oder Veranstaltung, Untertitel des Vertrags. */
  titel: pflicht('Titel der Veranstaltung', 160),
  termin: pflicht('Termin', 300),
  aufbauAb: uhrzeit,
  einlass: uhrzeit,
  beginn: uhrzeit,
  ende: uhrzeit,

  verguetung: z
    .enum(VERGUETUNGEN)
    .nullish()
    .transform((wert) => wert ?? 'ticketanteil'),
  /** Anteil der Gegenseite an den Ticketeinnahmen. Der Rest bleibt beim Pepe Dome. */
  anteilGegenseite: prozent,
  /**
   * Rechnet die Gegenseite mit Mehrwertsteuer ab? Dann kommt sie auf den
   * Anteil oder die Gage obendrauf. Ohne, etwa nach § 19 UStG, ist der Anteil
   * oder die Gage der Endbetrag. Geteilt wird in beiden Fällen netto.
   */
  mitMwst: schalter,
  /** Nur bei fester Gage. */
  gage: betrag,
  /** Nur bei fester Gage: Name der Förderung, aus der sie bezahlt wird. */
  foerderung: text(200),

  // Noch offene Regelungen, siehe Kommentar oben.
  ausfall: text(4000),
  bedingungen: text(4000),
  erwartungen: text(4000),

  sonderabsprache: text(4000),
})

export type AuftrittDaten = z.infer<typeof auftrittDatenSchema>

// ── Ganzer Vertrag ──────────────────────────────────────────────────────

export const vertragSchema = z.discriminatedUnion(
  'type',
  [
    z.object({ type: z.literal('MIETE'), ...gegenseite, data: mieteDatenSchema }),
    z.object({ type: z.literal('ANGEBOT'), ...gegenseite, data: angebotDatenSchema }),
    z.object({ type: z.literal('KUENSTLER'), ...gegenseite, data: auftrittDatenSchema }),
    z.object({
      type: z.literal('VERANSTALTER'),
      ...gegenseite,
      // Eine feste Gage gibt es nur im Künstlervertrag.
      data: auftrittDatenSchema.refine((daten) => daten.verguetung === 'ticketanteil', {
        path: ['verguetung'],
        message: 'Im Veranstaltervertrag gibt es nur die Aufteilung der Ticketeinnahmen',
      }),
    }),
  ],
  { error: 'Vertragstyp fehlt oder ist unbekannt' }
)

export type VertragEingabe = z.infer<typeof vertragSchema>

export const statusSchema = z.enum(VERTRAGSSTATUS, { error: 'Unbekannter Status' })

/** Titel für Liste, PDF-Eigenschaften und Dateiname. */
export function vertragstitel(vertrag: VertragEingabe): string {
  switch (vertrag.type) {
    case 'MIETE':
      return `Vereinbarung ${vertrag.data.anlass} ${vertrag.partnerName}`
    case 'ANGEBOT':
      return `Angebot ${vertrag.data.veranstaltung}`
    case 'KUENSTLER':
      return `Künstlervertrag ${vertrag.data.titel} ${vertrag.partnerName}`
    case 'VERANSTALTER':
      return `Veranstaltervertrag ${vertrag.data.titel} ${vertrag.partnerName}`
  }
}

// ── Standardpreise ──────────────────────────────────────────────────────

/**
 * Standardwerte fürs Vertragsformular: reguläre Mietpreise für einen halben
 * und einen ganzen Tag und der übliche Anteil der Gegenseite an den
 * Ticketeinnahmen. Sie liegen in der Tabelle `contract_settings` und werden
 * im Admin gepflegt, nicht hier: Das Repo ist öffentlich, Mietpreise und
 * Konditionen stehen bewusst nicht auf der Website.
 */
export const STANDARDPREISE_SCHLUESSEL = 'standardpreise'

export const standardpreiseSchema = z.object({
  halbtag: betrag,
  ganztag: betrag,
  /** Anteil der Gegenseite an den Ticketeinnahmen in Prozent. */
  ticketanteil: prozent,
})

export type Standardpreise = z.infer<typeof standardpreiseSchema>

/** Liest die gespeicherten Standardpreise. Fehlt etwas, bleibt der Wert leer. */
export function leseStandardpreise(wert: unknown): Standardpreise {
  const ergebnis = standardpreiseSchema.safeParse(wert ?? {})
  return ergebnis.success ? ergebnis.data : { halbtag: null, ganztag: null, ticketanteil: null }
}

// ── Vorbelegung ─────────────────────────────────────────────────────────

/**
 * Felder, die ein neuer Vertrag vom letzten Vertrag desselben Typs übernimmt.
 * Das sind die Beträge und die Zeilen der Zusatzleistungen mit ihren Preisen.
 * Namen, Termine und Schalter werden nie übernommen.
 */
export const BETRAGSFELDER = {
  MIETE: [
    'preisRegulaer',
    'preisVereinbart',
    'anzahlungProzent',
    'ticketQuote',
    'zusatzleistungenZeilen',
    'werkzeugGebuehr',
    'verbrauchsmaterial',
    'bierPreis',
    'kautionBetrag',
  ],
  ANGEBOT: ['preisRegulaer', 'preisAngebot'],
  // Die Gage ist jedes Mal eine andere und wird nicht übernommen.
  KUENSTLER: ['anteilGegenseite'],
  VERANSTALTER: ['anteilGegenseite'],
} as const satisfies Record<Vertragstyp, readonly string[]>

/**
 * Zieht die Betragsfelder aus den gespeicherten Daten eines Vertrags. Was
 * fehlt oder nicht lesbar ist, bleibt weg, dann startet das Feld leer.
 */
export function betraegeAus(type: Vertragstyp, data: unknown): Record<string, unknown> {
  if (!data || typeof data !== 'object') return {}
  const quelle = data as Record<string, unknown>
  const betraege: Record<string, unknown> = {}
  for (const feld of BETRAGSFELDER[type]) {
    const wert = quelle[feld]
    if (wert !== null && wert !== undefined && wert !== '') betraege[feld] = wert
  }
  return betraege
}

/**
 * Setzt in einem neuen Vertrag die gepflegten Standardwerte: den regulären
 * Preis auf den halben Tag, den Ticketanteil der Gegenseite auf den üblichen
 * Satz. Alle anderen Beträge bleiben die des letzten Vertrags. Ein nicht
 * gepflegter Standardwert ändert nichts.
 */
export function mitStandardpreis(
  vorbelegung: Partial<Record<Vertragstyp, Record<string, unknown>>>,
  standardpreise: Standardpreise
): Partial<Record<Vertragstyp, Record<string, unknown>>> {
  if (standardpreise.halbtag === null && standardpreise.ticketanteil === null) return vorbelegung
  const preis = standardpreise.halbtag === null ? {} : { preisRegulaer: standardpreise.halbtag }
  const anteil =
    standardpreise.ticketanteil === null ? {} : { anteilGegenseite: standardpreise.ticketanteil }
  return {
    MIETE: { ...vorbelegung.MIETE, ...preis },
    ANGEBOT: { ...vorbelegung.ANGEBOT, ...preis },
    KUENSTLER: { ...vorbelegung.KUENSTLER, ...anteil },
    VERANSTALTER: { ...vorbelegung.VERANSTALTER, ...anteil },
  }
}

// ── Darstellung von Beträgen ────────────────────────────────────────────

/** 120 wird „120“, 120.5 wird „120,50“, 1200 wird „1.200“. */
export function betragAlsText(betrag: number): string {
  return betrag.toLocaleString('de-DE', {
    minimumFractionDigits: Number.isInteger(betrag) ? 0 : 2,
    maximumFractionDigits: 2,
  })
}

/** Für ein Eingabefeld: ohne Tausenderpunkt, damit die Eingabe eindeutig bleibt. */
export function betragAlsEingabe(betrag: unknown): string {
  if (typeof betrag !== 'number' || !Number.isFinite(betrag)) return ''
  return Number.isInteger(betrag) ? String(betrag) : betrag.toFixed(2).replace('.', ',')
}
