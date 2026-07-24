/**
 * Bildaufbereitung für E-Mails
 *
 * Die eigentliche Rechenarbeit hinter /api/newsletter-image, ausgelagert,
 * damit sie auch aus Skripten und Tests heraus aufrufbar ist.
 */

import sharp from 'sharp'

export const EMAIL_IMAGE_MAX_WIDTH = 1600
export const EMAIL_IMAGE_DEFAULT_WIDTH = 1200
const JPEG_QUALITY = 78

export interface CropOptions {
  /** Zielbreite in Pixeln, wird auf EMAIL_IMAGE_MAX_WIDTH begrenzt */
  width?: number
  /** Seitenverhältnis wie "3:2". null oder "original" lässt es unverändert */
  ratio?: string | null
}

function hostFromUrl(raw: string | undefined | null): string | null {
  if (!raw) return null
  try {
    return new URL(raw).host.toLowerCase()
  } catch {
    return null
  }
}

/**
 * Darf diese Remote-URL für die Bildaufbereitung geladen werden?
 *
 * Zugelassen: jede Supabase-Storage-Domain (dort liegen alle Uploads) sowie
 * der explizit konfigurierte Supabase-/App-Host. Alles andere wird blockiert,
 * damit die Route kein offener Proxy ins Servernetz ist. Nur https.
 *
 * Als reine Funktion mit übergebener Env, damit sie ohne laufenden Server
 * testbar ist und nicht erneut still kaputtgehen kann.
 */
export function isAllowedImageUrl(
  rawUrl: string,
  env: Record<string, string | undefined> = process.env
): boolean {
  let url: URL
  try {
    url = new URL(rawUrl)
  } catch {
    return false
  }
  if (url.protocol !== 'https:') return false

  const hostname = url.hostname.toLowerCase()
  if (hostname.endsWith('.supabase.co') || hostname.endsWith('.supabase.in')) {
    return true
  }

  const allowed = [
    hostFromUrl(env.NEXT_PUBLIC_SUPABASE_URL),
    hostFromUrl(env.SUPABASE_URL),
    hostFromUrl(env.NEXT_PUBLIC_APP_URL),
  ].filter((entry): entry is string => Boolean(entry))

  return allowed.includes(url.host.toLowerCase())
}

export function parseRatio(value: string | null | undefined): number | null {
  if (!value || value === 'original') return null
  const [w, h] = value.split(':').map(Number)
  if (!w || !h || !Number.isFinite(w) || !Number.isFinite(h)) return null
  return w / h
}

/**
 * Skaliert, schneidet zu und gibt immer JPEG zurück.
 *
 * JPEG statt WebP, weil Outlook für Windows WebP bis heute nicht darstellt
 * und mehrere Event-Bilder in diesem Projekt als .webp vorliegen.
 */
export async function cropForEmail(source: Buffer, options: CropOptions = {}): Promise<Buffer> {
  const width = Math.min(options.width || EMAIL_IMAGE_DEFAULT_WIDTH, EMAIL_IMAGE_MAX_WIDTH)
  const ratio = parseRatio(options.ratio ?? '3:2')

  // rotate() ohne Argument wendet die EXIF-Orientierung an. Ohne das
  // stehen Handyfotos in E-Mail-Clients auf dem Kopf.
  const image = sharp(source).rotate()

  if (!ratio) {
    return image.resize({ width, withoutEnlargement: true }).jpeg({ quality: JPEG_QUALITY, progressive: true }).toBuffer()
  }

  return image
    .resize({
      width,
      height: Math.round(width / ratio),
      fit: 'cover',
      position: await cropPosition(source, ratio),
    })
    .jpeg({ quality: JPEG_QUALITY, progressive: true })
    .toBuffer()
}

/**
 * Wo beim Zuschnitt weggeschnitten wird.
 *
 * Bei Hochformaten muss oben und unten viel weg. Die automatische
 * Motiverkennung von sharp trifft dabei zuverlässig die falsche Stelle und
 * schneidet Köpfe ab, weil sie Kontrast und Struktur höher gewichtet als
 * die Person. Bei Bühnenfotos steht der Kopf fast immer im oberen Drittel,
 * deshalb wird dort von oben ausgeschnitten.
 *
 * Muss dagegen seitlich gekürzt werden, ist die Motiverkennung die bessere
 * Wahl: Was links und rechts wegfällt, ist meist Bühnenrand oder Publikum.
 */
async function cropPosition(source: Buffer, targetRatio: number): Promise<string> {
  try {
    const { width, height } = await sharp(source).metadata()
    if (!width || !height) return 'attention'

    const sourceRatio = width / height
    // Quellbild schmaler als das Ziel: es wird vertikal beschnitten
    if (sourceRatio < targetRatio) return 'top'
    return 'attention'
  } catch {
    return 'attention'
  }
}
