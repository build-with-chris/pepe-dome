/**
 * Die eigene Seite der Verträge. Steht in jeder Vorlage fest, wählbar ist
 * sie nicht.
 *
 * Vertragspartei ist der Trägerverein, nicht „der Pepe Dome“: Der Dome ist
 * ein Ort und kann keinen Vertrag schließen. Im Text heißt die eigene Seite
 * danach trotzdem „Pepe Dome“, so wie alle ihn nennen. Die Klammer „im
 * Folgenden“ im ersten Satz macht daraus eine saubere Bezeichnung.
 *
 * Name und Anschrift des Vereins stehen öffentlich im Impressum
 * (src/app/[lang]/impressum/page.tsx) und auf der Spendenseite.
 *
 * Entschieden von Chris am 27.11.2026, nach dem Muster seines Partners:
 * Verein mit zwei Vertretern, für alle Vertragstypen. Vorher stand in den
 * Vorlagen „Pepe Dome, vertreten durch Christoph Hermann“.
 */

import { fett, type Baustein } from './dokument'

export const VEREIN = 'Circus Akademie München e.V.'
const ANSCHRIFT = 'Ranhazweg 18, 85521 Ottobrunn'
export const VERTRETER = ['Michael Heiduk', 'Christoph Hermann'] as const

/** Steht auf jeder Seite unten. */
export const FUSSZEILE = `Pepe Dome · ${VEREIN} · Ostpark München · www.pepe-dome.de`

/** Der erste Satz jedes Vertrags: wer die eigene Seite ist und wie sie im Text heißt. */
export function eigeneSeite(): Baustein {
  return {
    art: 'absatz',
    text: [
      fett('Zwischen'),
      ` der ${VEREIN}, ${ANSCHRIFT}, Träger des Pepe Dome, vertreten durch ${VERTRETER.join(' und ')}, im Folgenden „Pepe Dome“,`,
    ],
  }
}

/** Unterschriftsfelder der eigenen Seite, eines je Vertreter. */
export function unterschriftenEigeneSeite(): string[] {
  return VERTRETER.map((person) => `Ort, Datum\n${person}, ${VEREIN}`)
}
