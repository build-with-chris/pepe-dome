/**
 * Der serverseitige Meldeweg zu Meta (Conversions API).
 *
 * Zwei Aufrufer teilen ihn:
 * - `/api/track` meldet weiter, was der Browser gemeldet hat. Beide tragen
 *   dieselbe `eventId`, darüber dedupliziert Meta.
 * - Die Bestätigungsroute meldet CompleteRegistration allein von hier aus. Der
 *   Bestätigungslink wird meist in der Mail-App geöffnet, dort kennt der
 *   Browser die Einwilligung nicht und meldet deshalb nichts.
 *
 * Diese Datei läuft ausschließlich auf dem Server. Das Zugriffstoken darf
 * niemals in ein Browser-Bundle geraten, deshalb der `server-only`-Riegel.
 */

import 'server-only'
import { createHash } from 'node:crypto'
import { META_PIXEL_ID } from '@/lib/meta-config'
import type { TrackedEvent } from '@/lib/tracking-events'

const GRAPH_API_VERSION = 'v21.0'

export type CapiReason = 'not_configured' | 'upstream_error' | 'internal_error'

export interface CapiResult {
  forwarded: boolean
  reason?: CapiReason
}

export interface CapiEvent {
  event: TrackedEvent
  /** Muss mit der eventId des Browser-Pixels übereinstimmen, sonst zählt Meta doppelt. */
  eventId: string
  /** Seite, auf der das Ereignis entstand. Nie mit Token oder anderen Geheimnissen. */
  sourceUrl: string
  /** SHA-256-Hex der Adresse, siehe hashEmail. Klartext gehört nicht zu Meta. */
  emailHash?: string | null
  fbp?: string | null
  fbc?: string | null
  clientIp?: string | null
  userAgent?: string | null
  customData?: Record<string, string | number | boolean>
}

/**
 * SHA-256-Hex einer E-Mail-Adresse, kleingeschrieben und getrimmt.
 *
 * Meta erwartet Identifikatoren normalisiert, sonst passt derselbe Mensch aus
 * zwei Quellen nicht zusammen. `null` bei leerer Eingabe, damit nie der Hash
 * einer leeren Zeichenkette verschickt wird.
 */
export function hashEmail(email: string | null | undefined): string | null {
  const normalisiert = (email ?? '').trim().toLowerCase()
  if (!normalisiert) return null
  return createHash('sha256').update(normalisiert).digest('hex')
}

/** Eine eventId für Ereignisse, die auf dem Server entstehen. */
export function newEventId(): string {
  return `srv_${crypto.randomUUID()}`
}

/**
 * Meldet ein Ereignis an Meta. Wirft nie.
 *
 * Ein Fehler beim Melden darf nie den Ablauf kippen, in dem er auftritt: eine
 * bestätigte Anmeldung bleibt bestätigt, auch wenn Meta gerade nicht erreichbar
 * ist.
 */
export async function sendCapiEvent(params: CapiEvent): Promise<CapiResult> {
  const pixelId = META_PIXEL_ID
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN

  // Ohne Konfiguration still aussteigen: lokal und in Vorschau-Deployments ist
  // das der Normalfall und kein Fehler.
  if (!pixelId || !accessToken) {
    return { forwarded: false, reason: 'not_configured' }
  }

  try {
    // _fbp und _fbc sind der stärkste Hebel für die Event Match Quality,
    // deshalb reichen wir sie mit durch, wenn der Aufrufer sie hat.
    const userData: Record<string, unknown> = {
      client_ip_address: params.clientIp ?? undefined,
      client_user_agent: params.userAgent ?? undefined,
      fbp: params.fbp ?? undefined,
      fbc: params.fbc ?? undefined,
      em: params.emailHash ? [params.emailHash] : undefined,
    }

    const payload: Record<string, unknown> = {
      data: [
        {
          event_name: params.event,
          event_time: Math.floor(Date.now() / 1000),
          event_id: params.eventId,
          event_source_url: params.sourceUrl,
          action_source: 'website',
          user_data: Object.fromEntries(
            Object.entries(userData).filter(([, v]) => v !== undefined)
          ),
          custom_data: params.customData ?? {},
        },
      ],
    }

    // Nur für die Testfunktion im Events Manager setzen, in Produktion leer lassen.
    if (process.env.META_CAPI_TEST_EVENT_CODE) {
      payload.test_event_code = process.env.META_CAPI_TEST_EVENT_CODE
    }

    const response = await fetch(
      `https://graph.facebook.com/${GRAPH_API_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    )

    if (!response.ok) {
      // Nur den Status loggen. Der Antworttext von Meta kann das Access-Token
      // enthalten, und die Logs sind kein sicherer Ort dafür.
      console.error(`[capi] Meta antwortete mit ${response.status} für ${params.event}`)
      return { forwarded: false, reason: 'upstream_error' }
    }

    return { forwarded: true }
  } catch (error) {
    console.error('[capi] Weiterleitung fehlgeschlagen:', error)
    return { forwarded: false, reason: 'internal_error' }
  }
}
