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

/**
 * Grenzen für das Seitenverhältnis.
 *
 * Ohne sie war die Höhe unbegrenzt: Sie wird aus width/ratio berechnet, und
 * ratio kam ungeprüft aus der URL. `?w=1600&ratio=1:40` ergab ein Zielbild von
 * 1600x64000 Pixeln. Gemessen an diesem Projekt: 43 Sekunden Rechenzeit und
 * 5,9 GB Arbeitsspeicher für einen einzigen anonymen Request — mehr als jede
 * Vercel-Function hat. Vier Zeichen in der URL genügten für einen Ausfall.
 *
 * 0,25 bis 4 deckt alles ab, was im Newsletter vorkommt (1:1, 3:2, 16:9, 4:5).
 */
const MIN_RATIO = 0.25
const MAX_RATIO = 4

/** Harte Obergrenze für die Zielhöhe, unabhängig vom Seitenverhältnis. */
const MAX_TARGET_HEIGHT = EMAIL_IMAGE_MAX_WIDTH * 2

/**
 * Obergrenze für die Pixelzahl des *Quellbildes*.
 *
 * Schützt gegen Dekompressionsbomben: eine wenige Kilobyte grosse PNG-Datei
 * kann 50000x50000 Pixel deklarieren und beim Dekodieren den Speicher füllen.
 * Die Prüfung greift, bevor sharp die Bilddaten auspackt.
 */
const MAX_INPUT_PIXELS = 40_000_000

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
  if (w < 0 || h < 0) return null

  const ratio = w / h
  // Ausserhalb der Grenzen nicht etwa kappen, sondern das Verhältnis verwerfen
  // und unbeschnitten skalieren. Ein gekapptes Verhältnis würde ein Bild
  // liefern, das nach einem gewollten Zuschnitt aussieht, aber keiner ist.
  if (ratio < MIN_RATIO || ratio > MAX_RATIO) return null

  return ratio
}

/**
 * Skaliert, schneidet zu und gibt immer JPEG zurück.
 *
 * JPEG statt WebP, weil Outlook für Windows WebP bis heute nicht darstellt
 * und mehrere Event-Bilder in diesem Projekt als .webp vorliegen.
 */
export async function cropForEmail(source: Buffer, options: CropOptions = {}): Promise<Buffer> {
  // Untergrenze 1: Ein negatives oder null-Breite bringt sharp zum Werfen.
  const requestedWidth = Math.floor(options.width || EMAIL_IMAGE_DEFAULT_WIDTH)
  const width = Math.max(1, Math.min(requestedWidth, EMAIL_IMAGE_MAX_WIDTH))
  const ratio = parseRatio(options.ratio ?? '3:2')

  // rotate() ohne Argument wendet die EXIF-Orientierung an. Ohne das
  // stehen Handyfotos in E-Mail-Clients auf dem Kopf.
  const image = sharp(source, { limitInputPixels: MAX_INPUT_PIXELS }).rotate()

  if (!ratio) {
    return image.resize({ width, withoutEnlargement: true }).jpeg({ quality: JPEG_QUALITY, progressive: true }).toBuffer()
  }

  // Zweiter Riegel neben parseRatio: Selbst wenn cropForEmail direkt aus einem
  // Skript mit einem Fantasieverhältnis aufgerufen wird, entsteht kein Riesenbild.
  const height = Math.min(Math.round(width / ratio), MAX_TARGET_HEIGHT)

  return image
    .resize({
      width,
      height,
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
    const meta = await sharp(source, { limitInputPixels: MAX_INPUT_PIXELS }).metadata()

    // Masse NACH der EXIF-Drehung.
    //
    // cropForEmail ruft rotate() auf, arbeitet also am gedrehten Bild. metadata()
    // liefert dagegen die rohen Werte aus der Datei. Bei einem Hochkant-Handyfoto,
    // das nur per EXIF-Flag gedreht ist, stehen dort Breite und Höhe vertauscht —
    // die Entscheidung "oben abschneiden oder Motiverkennung" fiele dann genau
    // falsch herum und der Zuschnitt trennt Köpfe ab.
    const width = meta.autoOrient?.width ?? meta.width
    const height = meta.autoOrient?.height ?? meta.height
    if (!width || !height) return 'attention'

    const sourceRatio = width / height
    // Quellbild schmaler als das Ziel: es wird vertikal beschnitten
    if (sourceRatio < targetRatio) return 'top'
    return 'attention'
  } catch {
    return 'attention'
  }
}
