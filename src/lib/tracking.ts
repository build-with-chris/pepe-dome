/**
 * Conversion-Tracking für Meta Ads und GA4
 *
 * Jedes Ereignis wird zweimal gemeldet: einmal aus dem Browser (Pixel) und
 * einmal vom Server (Conversions API). Beide tragen dieselbe `eventId`,
 * darüber dedupliziert Meta. Das ist kein doppeltes Zählen, sondern der
 * empfohlene Weg: der Browser-Weg wird von Adblockern und ITP blockiert,
 * der Server-Weg nicht.
 *
 * Alle Funktionen sind No-Ops ohne Marketing-Einwilligung. Der Server
 * prüft zusätzlich selbst — verlass dich nie allein auf den Client.
 */

import { hasConsent } from '@/lib/consent'
import { isCustomEvent, type TrackedEvent } from '@/lib/tracking-events'

export type { TrackedEvent }

interface TrackOptions {
  /** Klartext-E-Mail. Wird NUR gehasht an den Server geschickt. */
  email?: string
  /** Landet in Metas custom_data und in den GA4-Parametern. */
  customData?: Record<string, string | number | boolean | undefined>
}

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

function newEventId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`
}

/** SHA-256 als Hex. Meta erwartet gehashte Identifikatoren in Kleinschreibung. */
async function sha256(value: string): Promise<string | null> {
  if (typeof crypto === 'undefined' || !crypto.subtle) return null
  try {
    const bytes = new TextEncoder().encode(value.trim().toLowerCase())
    const digest = await crypto.subtle.digest('SHA-256', bytes)
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  } catch {
    return null
  }
}

/** Entfernt undefined, damit weder Meta noch GA4 leere Felder sehen. */
function clean(data?: Record<string, unknown>): Record<string, unknown> {
  if (!data) return {}
  return Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined && v !== ''))
}

/**
 * Meldet ein Ereignis an Pixel, Conversions API und GA4.
 *
 * Wirft nie. Tracking darf niemals ein Formular kaputt machen: wenn die
 * Anmeldung durch ist, ist sie durch, auch wenn Meta gerade nicht erreichbar ist.
 */
export async function trackEvent(event: TrackedEvent, options: TrackOptions = {}): Promise<void> {
  if (typeof window === 'undefined') return
  if (!hasConsent('marketing')) return

  const eventId = newEventId()
  const customData = clean(options.customData)

  // 1. Browser-Pixel
  try {
    if (typeof window.fbq === 'function') {
      window.fbq(isCustomEvent(event) ? 'trackCustom' : 'track', event, customData, {
        eventID: eventId,
      })
    }
  } catch {
    // ignorieren
  }

  // 2. GA4, damit dieselben Conversions auch ohne Meta auswertbar bleiben
  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', event, customData)
    }
  } catch {
    // ignorieren
  }

  // 3. Conversions API. Fire and forget, das Ergebnis interessiert den Nutzer nicht.
  try {
    const emailHash = options.email ? await sha256(options.email) : null

    await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        event,
        eventId,
        sourceUrl: window.location.href,
        emailHash,
        customData,
      }),
    })
  } catch {
    // ignorieren
  }
}

/** Newsletter-Anmeldung oder Kursinteresse. */
export function trackLead(params: {
  leadType: 'newsletter' | 'course' | 'contact'
  email?: string
  /** z. B. Kurs-Slug oder Herkunftsseite */
  source?: string
}): void {
  void trackEvent('Lead', {
    email: params.email,
    customData: {
      lead_type: params.leadType,
      content_name: params.source,
    },
  })
}

/** Bestätigte Double-Opt-in-Anmeldung. Das ist die Zahl, die wirklich zählt. */
export function trackCompleteRegistration(params: { email?: string; source?: string }): void {
  void trackEvent('CompleteRegistration', {
    email: params.email,
    customData: { content_name: params.source, status: 'confirmed' },
  })
}

/** Aufruf einer Event- oder Kursdetailseite. Baut die Retargeting-Zielgruppe auf. */
export function trackViewContent(params: {
  contentName: string
  contentId?: string
  contentCategory?: string
}): void {
  void trackEvent('ViewContent', {
    customData: {
      content_name: params.contentName,
      content_ids: params.contentId,
      content_category: params.contentCategory,
      content_type: 'product',
    },
  })
}

/**
 * Klick auf einen externen Ticketlink.
 *
 * Der Kauf passiert auf rausgegangen.de, also auf einer fremden Domain, auf
 * der wir kein Purchase-Ereignis feuern können. Dieser Klick ist deshalb
 * unsere beste verfügbare Näherung an einen Kauf.
 */
export function trackTicketClick(params: {
  eventTitle: string
  eventSlug?: string
  price?: string
  destination?: string
}): void {
  let destinationHost: string | undefined
  if (params.destination) {
    try {
      destinationHost = new URL(params.destination).hostname
    } catch {
      destinationHost = undefined
    }
  }

  void trackEvent('TicketClick', {
    customData: {
      content_name: params.eventTitle,
      content_ids: params.eventSlug,
      price: params.price,
      destination: destinationHost,
    },
  })
}
