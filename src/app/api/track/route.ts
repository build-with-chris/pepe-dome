/**
 * Meta Conversions API Endpunkt
 * POST /api/track
 *
 * Nimmt ein Conversion-Ereignis vom Browser entgegen und meldet es
 * serverseitig an Meta. Zusammen mit dem Browser-Pixel, das dieselbe
 * `eventId` sendet, dedupliziert Meta beide Meldungen zu einer.
 *
 * Warum überhaupt doppelt: Adblocker, Safari ITP und iOS-Tracking-Schutz
 * verschlucken einen erheblichen Teil der Pixel-Aufrufe. Der Serverweg
 * ist davon nicht betroffen. Meta gibt für die Kombination rund 13 Prozent
 * bessere Kosten pro Ergebnis an.
 *
 * DSGVO: Der Serverweg umgeht die technische Blockade, nicht die rechtliche.
 * Ohne Marketing-Einwilligung wird hier nichts gesendet. Der Client ruft
 * diese Route zwar ohnehin nur mit Einwilligung auf, aber eine Route, die
 * sich auf ihren eigenen Aufrufer verlässt, ist keine Prüfung.
 */

import { NextRequest } from 'next/server'
import { z } from 'zod'
import { successResponse, errorResponse } from '@/lib/api-response'
import { checkRateLimit, getClientIdentifier } from '@/lib/rate-limit'
import { TRACKED_EVENTS } from '@/lib/tracking-events'
import { sendCapiEvent } from '@/lib/meta-capi'

/**
 * Vergleicht zwei Hostnamen und behandelt `www.` als bedeutungslos.
 *
 * Nötig, weil die Seite kanonisch auf www.pepe-dome.de ausgeliefert wird,
 * NEXT_PUBLIC_APP_URL aber ohne www gesetzt ist. Ein exakter Vergleich hätte
 * jedes Ereignis eines echten Besuchers als fremde Quelle abgewiesen, und
 * zwar lautlos: der Browser-Pixel hätte weiter gemeldet, der Serverweg nie.
 */
function sameSite(a: string, b: string): boolean {
  const ohneWww = (host: string) => host.replace(/^www\./i, '').toLowerCase()
  return ohneWww(a) === ohneWww(b)
}

const trackSchema = z.object({
  event: z.enum(TRACKED_EVENTS),
  eventId: z.string().min(8).max(100),
  sourceUrl: z.string().url().max(2000),
  /** Bereits im Browser gehasht. Klartext-Adressen nimmt diese Route nicht an. */
  emailHash: z
    .string()
    .regex(/^[a-f0-9]{64}$/, 'Muss ein SHA-256-Hex-Hash sein')
    .nullable()
    .optional(),
  customData: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
})

export async function POST(request: NextRequest) {
  try {
    // Missbrauchsschutz: die Route ist öffentlich und schreibt in ein fremdes System.
    const identifier = getClientIdentifier(request)
    const rateLimit = checkRateLimit(`capi:${identifier}`, {
      maxRequests: 60,
      windowMs: 60 * 1000,
    })

    if (!rateLimit.allowed) {
      return errorResponse('RATE_LIMIT_EXCEEDED', 'Zu viele Anfragen.', 429)
    }

    const body = await request.json()
    const validation = trackSchema.safeParse(body)

    if (!validation.success) {
      return errorResponse('VALIDATION_ERROR', 'Ungültiges Ereignis.', 400)
    }

    const { event, eventId, sourceUrl, emailHash, customData } = validation.data

    // Nur Ereignisse von der eigenen Domain annehmen.
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL
    if (appUrl) {
      try {
        if (!sameSite(new URL(sourceUrl).hostname, new URL(appUrl).hostname)) {
          return errorResponse('INVALID_SOURCE', 'Fremde Quelle.', 400)
        }
      } catch {
        return errorResponse('INVALID_SOURCE', 'Ungültige Quell-URL.', 400)
      }
    }

    // Erst ab hier ist die Anfrage geprüft. Das Melden selbst liegt in
    // src/lib/meta-capi.ts, weil die Bestätigungsroute denselben Weg nutzt.
    // _fbp und _fbc setzt das Pixel selbst, sie sind der stärkste Hebel für die
    // Event Match Quality und gehen deshalb mit.
    const result = await sendCapiEvent({
      event,
      eventId,
      sourceUrl,
      emailHash,
      fbp: request.cookies.get('_fbp')?.value,
      fbc: request.cookies.get('_fbc')?.value,
      clientIp: identifier !== 'unknown-client' ? identifier : undefined,
      userAgent: request.headers.get('user-agent'),
      customData,
    })

    if (!result.forwarded) {
      return successResponse({ forwarded: false, reason: result.reason })
    }

    return successResponse({ forwarded: true, eventId })
  } catch (error) {
    console.error('[capi] Weiterleitung fehlgeschlagen:', error)
    // Bewusst 200: Tracking-Fehler dürfen im Browser nichts auslösen.
    return successResponse({ forwarded: false, reason: 'internal_error' })
  }
}
