/**
 * Validierung für Artists.
 *
 * Liegt getrennt von den Routen, weil POST und PUT dieselben Regeln brauchen
 * und das Formular dieselben Grenzen anzeigen soll (BIO_MAX).
 *
 * Instagram und Website landen auf der Eventseite in einem href. Deshalb wird
 * hier normalisiert und streng geprüft: Instagram immer als volle Profil-URL,
 * Website nur https. Ein `javascript:` oder ein http-Link, den der Browser
 * als unsicher markiert, kommt so gar nicht erst in die Datenbank.
 */

import { z } from 'zod'

export const BIO_MAX = 600

/** Instagram-Handles: Buchstaben, Ziffern, Punkt, Unterstrich, max. 30 Zeichen. */
const HANDLE = /^[A-Za-z0-9._]{1,30}$/

/**
 * "@pepe.dome", "pepe.dome", "instagram.com/pepe.dome" und
 * "https://www.instagram.com/pepe.dome/?hl=de" werden alle zu
 * "https://www.instagram.com/pepe.dome/". Alles andere ergibt null.
 */
export function normalizeInstagram(raw: string): string | null {
  const value = raw.trim()
  if (!value) return null

  let handle: string | undefined
  const url = value.match(/^(?:https?:\/\/)?(?:www\.)?instagram\.com\/([^/?#]+)\/?(?:[?#].*)?$/i)
  if (url) {
    handle = url[1]
  } else {
    handle = value.replace(/^@/, '')
  }

  if (!HANDLE.test(handle)) return null
  return `https://www.instagram.com/${handle}/`
}

/** Leere Eingaben werden zu null, damit "Feld geleert" auch gespeichert wird. */
const optionalText = z
  .string()
  .trim()
  .optional()
  .nullable()
  .transform((value) => value || null)

const instagram = optionalText.transform((value, ctx) => {
  if (!value) return null
  const normalized = normalizeInstagram(value)
  if (!normalized) {
    ctx.addIssue({
      code: 'custom',
      message: 'Instagram als @handle oder als Link auf instagram.com angeben',
    })
    return z.NEVER
  }
  return normalized
})

const website = optionalText.refine(
  (value) => !value || /^https:\/\/[^\s]+\.[^\s]+$/i.test(value),
  'Website muss mit https:// beginnen'
)

/** Wie bei Kursbildern: projekteigene Pfade oder https, nichts anderes. */
const bild = optionalText.refine(
  (value) => !value || value.startsWith('/') || /^https:\/\//i.test(value),
  'Foto muss ein Pfad wie /images/… oder eine https-Adresse sein'
)

export const artistSchema = z.object({
  name: z.string().trim().min(1, 'Name ist Pflicht'),
  imageUrl: bild,
  bio: z
    .string()
    .trim()
    .min(1, 'Bio ist Pflicht')
    .max(BIO_MAX, `Bio darf höchstens ${BIO_MAX} Zeichen haben`),
  bioEn: z
    .string()
    .trim()
    .max(BIO_MAX, `Bio (EN) darf höchstens ${BIO_MAX} Zeichen haben`)
    .optional()
    .nullable()
    .transform((value) => value || null),
  instagramUrl: instagram,
  websiteUrl: website,
})

export type ArtistInput = z.infer<typeof artistSchema>

/**
 * Formt die geprüfte Eingabe in Datenbankfelder. Die EN-Bio liegt wie bei
 * Events in `translations`, andere Sprachen bleiben dabei erhalten.
 */
export function toArtistData(input: ArtistInput, existingTranslations: unknown = {}) {
  const { bioEn, ...felder } = input
  const translations = {
    ...((existingTranslations ?? {}) as Record<string, unknown>),
    en: { bio: bioEn ?? '' },
  }
  return { ...felder, translations }
}

export function generateArtistSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[äÄ]/g, 'ae')
    .replace(/[öÖ]/g, 'oe')
    .replace(/[üÜ]/g, 'ue')
    .replace(/[ß]/g, 'ss')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Artist-IDs aus dem Event-Formular. Die Reihenfolge im Array ist die
 * Reihenfolge auf der Eventseite; doppelte IDs werden still entfernt.
 */
export const artistIdsSchema = z
  .array(z.string().min(1))
  .transform((ids) => [...new Set(ids)])
