/**
 * Vom gespeicherten Vertrag zum Dokument.
 *
 * Die Routen kennen nur diese eine Funktion. Welche Vorlage zu welchem
 * Vertragstyp gehört, steht hier und sonst nirgends.
 *
 * Die Daten gehen vor dem Zeichnen noch einmal durch die Validierung. Ein
 * Entwurf, der vor einer Erweiterung des Formulars gespeichert wurde, bekommt
 * so für neue Felder deren Standardwert, statt beim PDF abzubrechen.
 */

import type { Dokument } from './dokument'
import { vertragSchema, vertragstitel, type VertragEingabe } from './validation'
import { angebotDokument } from './vorlage-angebot'
import { auftrittDokument } from './vorlage-auftritt'
import { mieteDokument } from './vorlage-miete'

export function dokumentAus(vertrag: VertragEingabe): Dokument {
  const titel = vertragstitel(vertrag)
  switch (vertrag.type) {
    case 'MIETE':
      return mieteDokument(vertrag, vertrag.data, titel)
    case 'ANGEBOT':
      return angebotDokument(vertrag.data, titel)
    case 'KUENSTLER':
    case 'VERANSTALTER':
      return auftrittDokument(vertrag.type, vertrag, vertrag.data, titel)
  }
}

/** Form einer Zeile aus `contracts`, soweit die Vorlagen sie brauchen. */
export type VertragZeile = {
  type: string
  partnerName: string
  partnerEmail: string | null
  partnerPhone: string | null
  partnerAddress: string | null
  eventDate: Date | string | null
  data: unknown
}

/** Der Tag ohne Uhrzeit, so wie das Formular ihn schickt und anzeigt. */
export function datumAlsEingabe(wert: Date | string | null): string | null {
  if (!wert) return null
  return (wert instanceof Date ? wert.toISOString() : wert).slice(0, 10)
}

/** Wirft, wenn die gespeicherten Daten nicht mehr zur Validierung passen. */
export function dokumentAusZeile(zeile: VertragZeile): Dokument {
  return dokumentAus(
    vertragSchema.parse({
      type: zeile.type,
      partnerName: zeile.partnerName,
      partnerEmail: zeile.partnerEmail,
      partnerPhone: zeile.partnerPhone,
      partnerAddress: zeile.partnerAddress,
      eventDate: datumAlsEingabe(zeile.eventDate),
      data: zeile.data,
    })
  )
}
