/**
 * Mithelfen: Aufgaben für Helferinnen und Helfer im Pepe Dome.
 *
 * Die Aufgaben stehen in src/data/mithelfen.json (Quelle: pepe-dome-mithelfen/
 * daten/aufgaben.json). Zeiten und Texte sind Schätzungen, die Bereiche prüfen
 * sie noch. Ansprechpersonen und E-Mail-Adressen sind noch leer. Solange eine
 * Adresse fehlt, geht die Meldung nur an die Sammeladresse.
 *
 * Diese Datei ist bewusst frei von Server-Code, damit Seite, Route und Tests
 * dieselbe Filterlogik nutzen.
 */

import { z } from 'zod'
import daten from '@/data/mithelfen.json'

export type Ort = 'ort' | 'remote'
export type OrtWahl = Ort | 'beides'

export interface Bereich {
  id: string
  name: string
  ansprechperson: string
  email: string
}

export interface Aufgabe {
  id: string
  bereich: string
  ort: Ort
  dauerMinuten: number
  rhythmus: string
  titel: string
  schritte: string[]
  voraussetzung: string
}

export const BEREICHE: Bereich[] = daten.bereiche
export const AUFGABEN: Aufgabe[] = daten.aufgaben as Aufgabe[]

export const ZEIT_OPTIONEN = [
  { minuten: 60, label: 'Bis 1 Stunde' },
  { minuten: 180, label: 'Bis 3 Stunden' },
  { minuten: 300, label: 'Ein halber Tag' },
  { minuten: Infinity, label: 'Egal' },
] as const

export function bereichVon(id: string): Bereich | undefined {
  return BEREICHE.find((b) => b.id === id)
}

export function aufgabeVon(id: string): Aufgabe | undefined {
  return AUFGABEN.find((a) => a.id === id)
}

/** "Ansprechperson Café" solange kein Name eingetragen ist. */
export function werAntwortet(b: Bereich): string {
  return b.ansprechperson.trim() || `Die Ansprechperson für ${b.name}`
}

export function ortPasst(a: Aufgabe, ort: OrtWahl | null): boolean {
  return !ort || ort === 'beides' || a.ort === ort
}

/** Dauer für die Abrisskarte: 90 → ["1,5", "Std"], 30 → ["30", "Min"]. */
export function dauerTeile(minuten: number): [string, string] {
  if (minuten < 60) return [String(minuten), 'Min']
  return [String(minuten / 60).replace('.', ','), 'Std']
}

/**
 * Aufgaben zu den drei Antworten, kürzeste zuerst.
 *
 * Passt im Zeitrahmen nichts, kommen die Aufgaben aus Ort und Bereichen
 * trotzdem, mit `gelockert: true`. Eine leere Liste nach drei Fragen wäre
 * eine Sackgasse.
 */
export function treffer(
  ort: OrtWahl | null,
  bereiche: string[],
  maxMinuten: number
): { liste: Aufgabe[]; gelockert: boolean } {
  const basis = AUFGABEN.filter(
    (a) => ortPasst(a, ort) && (bereiche.length === 0 || bereiche.includes(a.bereich))
  )
  const genau = basis.filter((a) => a.dauerMinuten <= maxMinuten)
  const liste = (genau.length ? genau : basis).slice().sort((a, b) => a.dauerMinuten - b.dauerMinuten)
  return { liste, gelockert: genau.length === 0 && basis.length > 0 }
}

const AUFGABEN_IDS = new Set(AUFGABEN.map((a) => a.id))

export function istEmail(kontakt: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(kontakt.trim())
}

export const helferMeldungSchema = z.object({
  name: z.string().trim().min(2, 'Bitte trag deinen Namen ein.').max(100),
  kontakt: z
    .string()
    .trim()
    .max(200)
    .refine((k) => istEmail(k) || k.replace(/\D/g, '').length >= 6, {
      message: 'Bitte gib eine E-Mail-Adresse oder Telefonnummer an, unter der wir dich erreichen.',
    }),
  aufgaben: z
    .array(z.string())
    .min(1, 'Bitte wähle mindestens eine Aufgabe.')
    .max(AUFGABEN.length)
    .refine((ids) => ids.every((id) => AUFGABEN_IDS.has(id)), { message: 'Unbekannte Aufgabe.' }),
  notiz: z.string().trim().max(1000).optional().or(z.literal('')),
  einwilligung: z.boolean().refine((v) => v === true, {
    message: 'Bitte stimme der Verarbeitung deiner Angaben zu.',
  }),
  website: z.string().max(500).optional(),
  fillMs: z.number().nonnegative().optional(),
})

export type HelferMeldung = z.infer<typeof helferMeldungSchema>

/** Bereiche der gewählten Aufgaben, in der Reihenfolge aus der Datendatei. */
export function bereicheDerAuswahl(aufgabenIds: string[]): Bereich[] {
  const ids = new Set(aufgabenIds.map((id) => aufgabeVon(id)?.bereich).filter(Boolean))
  return BEREICHE.filter((b) => ids.has(b.id))
}

/**
 * Empfänger der Meldung: die Sammeladresse plus jede eingetragene Adresse der
 * betroffenen Bereiche. Doppelte fallen raus.
 */
export function empfaenger(aufgabenIds: string[], sammeladresse: string): string[] {
  const bereichsAdressen = bereicheDerAuswahl(aufgabenIds)
    .map((b) => b.email.trim())
    .filter(Boolean)
  return [...new Set([sammeladresse, ...bereichsAdressen])]
}

export function meldungsText(m: HelferMeldung): string {
  const zeilen = [
    'Neue Helfermeldung über pepe-dome.de/mithelfen',
    '',
    `Name: ${m.name}`,
    `Kontakt: ${m.kontakt}`,
    ...(m.notiz?.trim() ? [`Wann passt es: ${m.notiz.trim()}`] : []),
    '',
    'Interesse an:',
  ]
  for (const b of bereicheDerAuswahl(m.aufgaben)) {
    zeilen.push('', `${b.name} (${werAntwortet(b)} antwortet)`)
    for (const id of m.aufgaben) {
      const a = aufgabeVon(id)
      if (a?.bereich === b.id) zeilen.push(`- ${a.titel} (${dauerTeile(a.dauerMinuten).join(' ')}, ${a.rhythmus})`)
    }
  }
  zeilen.push('', 'Bitte innerhalb von 48 Stunden melden. Die Helferin oder der Helfer hat diese Zusage bekommen.')
  return zeilen.join('\n')
}

export function bestaetigungsText(m: HelferMeldung): string {
  const vorname = m.name.trim().split(/\s+/)[0]
  const zeilen = [
    `Hallo ${vorname},`,
    '',
    'danke, dass du im Pepe Dome mithelfen willst. Deine Meldung ist angekommen.',
    '',
    'Du hast dir gemerkt:',
    ...m.aufgaben.map((id) => aufgabeVon(id)).filter(Boolean).map((a) => `- ${a!.titel}`),
    '',
    'Innerhalb von 48 Stunden meldet sich jemand bei dir. Bis dahin musst du nichts tun. Termin und Einweisung klärt ihr im Gespräch.',
    '',
    'Viele Grüße',
    'Pepe Dome',
  ]
  return zeilen.join('\n')
}
