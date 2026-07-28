/**
 * Validierung für Kurse und Zeitslots.
 *
 * Liegt getrennt von den Routen, weil POST und PATCH dieselben Regeln
 * brauchen und die Formularseite dieselben Fehlermeldungen zeigen soll.
 *
 * Zeiten werden hier strenger genommen als bei Events: `toStoredTime` lässt
 * dort Freitext durch, weil im Altbestand Sachen wie „ab 20 Uhr" stehen. Ein
 * Kursslot wird sortiert und verglichen, deshalb muss „HH:MM" gelten. Eine
 * krumme Eingabe soll abgelehnt werden statt still durchzurutschen.
 */

import { z } from 'zod'
import { normalizeTime } from './event-time'

/**
 * "9:5" wird zu "09:05"; alles Unbrauchbare wird abgelehnt.
 *
 * Prüfung im transform statt per .refine danach, damit als Ergebnistyp
 * `string` herauskommt und nicht `string | null`. Sonst müsste jede
 * Aufrufstelle einen Fall behandeln, den die Validierung schon ausschließt.
 */
const zeit = z.string().transform((raw, ctx) => {
  const normalized = normalizeTime(raw)
  if (normalized === null) {
    ctx.addIssue({ code: 'custom', message: 'Zeit muss als HH:MM angegeben sein' })
    return z.NEVER
  }
  return normalized
})

export const slotSchema = z
  .object({
    weekday: z
      .number()
      .int()
      .min(1, 'Wochentag muss zwischen 1 (Montag) und 7 (Sonntag) liegen')
      .max(7, 'Wochentag muss zwischen 1 (Montag) und 7 (Sonntag) liegen'),
    startTime: zeit,
    endTime: zeit,
  })
  // Ein Kurs, der laut Eingabe um 18:00 anfaengt und um 17:00 aufhoert, ist
  // ein Tippfehler. Auf der Website wuerde daraus eine unsinnige Zeitangabe,
  // deshalb hier abfangen und nicht erst im Formular.
  .refine((slot) => slot.startTime < slot.endTime, {
    message: 'Ende muss nach dem Beginn liegen',
    path: ['endTime'],
  })

/**
 * Ein Kursbild.
 *
 * Erlaubt sind nur projekteigene Pfade („/kurse/…") und https-Adressen.
 * Kein `javascript:` und kein `data:` — der Wert landet in einem src-Attribut.
 * Fremde http-Adressen fliegen raus, weil sie auf einer https-Seite ohnehin
 * blockiert würden und dann als kaputtes Bild dastehen.
 */
export const bildSchema = z.object({
  url: z
    .string()
    .trim()
    .min(1, 'Bildadresse fehlt')
    .refine(
      (value) => value.startsWith('/') || /^https:\/\//i.test(value),
      'Bild muss ein Pfad wie /kurse/… oder eine https-Adresse sein'
    ),
  alt: z.string().trim().default(''),
})

export const courseBaseSchema = z.object({
  title: z.string().trim().min(1, 'Titel ist Pflicht'),
  sub: z.string().trim().optional().nullable(),
  description: z.string().trim().min(1, 'Beschreibung ist Pflicht'),
  inhalte: z.array(z.string().trim().min(1)).default([]),
  alter: z.string().trim().optional().nullable(),
  fuerWen: z.string().trim().min(1, '„Für wen" ist Pflicht'),
  target: z.enum(['kinder', 'teens', 'erwachsene']),
  trainer: z.string().trim().min(1, 'Trainer:in ist Pflicht'),
  bookingUrl: z.string().trim().optional().nullable(),
  bookingLabel: z.string().trim().optional().nullable(),
  bookingNote: z.string().trim().optional().nullable(),
  images: z.array(bildSchema).default([]),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  sortOrder: z.number().int().default(0),
})

export const courseCreateSchema = courseBaseSchema.extend({
  /** Optional: wird sonst aus dem Titel erzeugt. */
  slug: z.string().trim().optional(),
  slots: z.array(slotSchema).min(1, 'Mindestens ein Termin ist nötig'),
})

/**
 * Beim Ändern ist alles optional, aber `slug` fehlt bewusst ganz: der Slug
 * hängt an geteilten Links und wird nach dem Anlegen nicht mehr angefasst,
 * auch nicht wenn sich der Titel ändert.
 */
export const courseUpdateSchema = courseBaseSchema.partial().extend({
  slots: z.array(slotSchema).min(1, 'Mindestens ein Termin ist nötig').optional(),
})

export const scheduleNoteSchema = z.object({
  weekday: z.number().int().min(1).max(7),
  /** Leerer Text löscht den Hinweis. */
  text: z.string().trim(),
})

export function generateCourseSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[äÄ]/g, 'ae')
    .replace(/[öÖ]/g, 'oe')
    .replace(/[üÜ]/g, 'ue')
    .replace(/[ß]/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Ein Buchungslink landet auf der Website in einem href. Wir lassen deshalb
 * nur http(s) und mailto zu — javascript: hätte dort nichts verloren.
 */
export function isValidBookingUrl(value: string | null | undefined): boolean {
  if (!value) return true
  return /^(https?:\/\/|mailto:)/i.test(value.trim())
}
