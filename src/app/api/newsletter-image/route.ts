/**
 * Bildaufbereitung für den Newsletter
 * GET /api/newsletter-image?src=<pfad|url>&w=1200&ratio=3:2
 *
 * Drei Probleme, die diese Route gleichzeitig löst:
 *
 * 1. Outlook für Windows kann kein WebP. Mehrere Event-Bilder liegen als
 *    .webp vor und erscheinen dort als kaputtes Platzhalter-Icon. Hier
 *    kommt immer JPEG zurück, das jeder Client seit Jahrzehnten kennt.
 * 2. Die Originale wiegen bis zu 1,8 MB. Bei vier Bildern pro Ausgabe lädt
 *    ein Empfänger im Mobilfunknetz mehrere Megabyte, bevor er etwas sieht.
 * 3. Hoch- und Querformate nebeneinander zerlegen jede Bildhierarchie. Der
 *    feste Zuschnitt sorgt dafür, dass ein Aufmacher auch wie einer wirkt
 *    und nicht zufällig den halben Bildschirm füllt.
 *
 * E-Mail-Clients können all das nicht selbst: object-fit wird von Outlook
 * ignoriert, srcset gibt es nicht. Der Zuschnitt muss deshalb serverseitig
 * passieren.
 */

import { NextRequest } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'
import {
  cropForEmail,
  isAllowedImageUrl,
  EMAIL_IMAGE_DEFAULT_WIDTH,
  EMAIL_IMAGE_MAX_WIDTH,
} from '@/lib/email-image'

export const runtime = 'nodejs'
// Einmal gerechnet, danach aus dem CDN: Ein Versand an 1700 Empfänger
// fragt dasselbe Bild sonst 1700 mal neu an.
export const revalidate = 31536000

async function loadSource(src: string): Promise<Buffer | null> {
  if (src.startsWith('http://') || src.startsWith('https://')) {
    // Allowlist liegt als reine, getestete Funktion in email-image.ts.
    if (!isAllowedImageUrl(src)) return null

    const response = await fetch(src, { signal: AbortSignal.timeout(8000) })
    if (!response.ok) return null
    return Buffer.from(await response.arrayBuffer())
  }

  // Lokaler Pfad unterhalb von /public. path.normalize plus Präfixprüfung
  // verhindert, dass ../ aus dem Verzeichnis herausführt.
  const publicDir = path.join(process.cwd(), 'public')
  const target = path.normalize(path.join(publicDir, src))
  if (!target.startsWith(publicDir + path.sep)) return null

  try {
    return await readFile(target)
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const src = params.get('src')

  if (!src) {
    return new Response('src fehlt', { status: 400 })
  }

  const width = Math.min(Number(params.get('w')) || EMAIL_IMAGE_DEFAULT_WIDTH, EMAIL_IMAGE_MAX_WIDTH)

  try {
    const source = await loadSource(src)
    if (!source) {
      return new Response('Bild nicht verfügbar', { status: 404 })
    }

    const output = await cropForEmail(source, { width, ratio: params.get('ratio') ?? '3:2' })

    return new Response(new Uint8Array(output), {
      headers: {
        'Content-Type': 'image/jpeg',
        'Content-Length': String(output.length),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('[newsletter-image] Aufbereitung fehlgeschlagen:', src, error)
    return new Response('Bild konnte nicht verarbeitet werden', { status: 500 })
  }
}
