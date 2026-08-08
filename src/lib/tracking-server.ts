/**
 * Conversions, die auf dem Server entstehen.
 *
 * Der Browser meldet, was im Browser passiert (src/lib/tracking.ts). Manches
 * passiert aber nicht dort: der Klick auf den Bestätigungslink landet meist in
 * der Mail-App, also in einem Browser, der die Einwilligung nicht kennt und
 * deshalb nichts meldet. Solche Ereignisse gehören hierher.
 */

import 'server-only'
import { prisma } from '@/lib/prisma'
import { hashEmail, newEventId, sendCapiEvent } from '@/lib/meta-capi'

/**
 * Was das Anmeldeformular in `subscriber.metadata.tracking` hinterlassen hat.
 *
 * `marketingConsent` ist die Erlaubnis, die beim Anmelden im Browser vorlag.
 * Sie steht hier, weil sie beim Bestätigen nicht mehr abrufbar ist.
 */
export interface TrackingMetadata {
  marketingConsent?: boolean
  fbp?: string
  fbc?: string
  /** Herkunft der Anmeldung, etwa "startseite" oder "newsletter-page". */
  source?: string
  /** Zeitpunkt der Anmeldung. */
  at?: string
  /** Zeitpunkt der Meldung an Meta. Verhindert doppeltes Zählen. */
  reportedAt?: string
}

/** Liest den Tracking-Teil aus den Metadaten, ohne an fremden Feldern zu rühren. */
export function readTrackingMetadata(metadata: unknown): TrackingMetadata | null {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) return null
  const tracking = (metadata as Record<string, unknown>).tracking
  if (!tracking || typeof tracking !== 'object' || Array.isArray(tracking)) return null
  return tracking as TrackingMetadata
}

interface ConfirmedSubscriber {
  id: string
  email: string
  metadata?: unknown
}

/**
 * Meldet eine bestätigte Anmeldung an Meta. Wirft nie.
 *
 * Gemeldet wird nur mit gespeicherter Einwilligung und nur einmal: der Vermerk
 * `reportedAt` hält den zweiten Klick auf denselben Link davon ab, ein zweites
 * Ereignis auszulösen.
 *
 * Bekannte Lücke: Wer zwischen Anmeldung und Bestätigung widerspricht, wird
 * hier noch einmal gemeldet. Die Einwilligung lag beim Erheben vor, und die
 * Alternative wäre, die Zahl ganz aufzugeben.
 */
export async function reportConfirmedSignup(
  subscriber: ConfirmedSubscriber,
  context: { sourceUrl: string; userAgent?: string | null; clientIp?: string | null }
): Promise<void> {
  try {
    const tracking = readTrackingMetadata(subscriber.metadata)

    if (!tracking?.marketingConsent) return
    if (tracking.reportedAt) return

    const result = await sendCapiEvent({
      event: 'CompleteRegistration',
      eventId: newEventId(),
      sourceUrl: context.sourceUrl,
      emailHash: hashEmail(subscriber.email),
      fbp: tracking.fbp,
      fbc: tracking.fbc,
      userAgent: context.userAgent,
      clientIp: context.clientIp,
      customData: {
        content_name: tracking.source ?? 'double-opt-in',
        status: 'confirmed',
      },
    })

    // Nur eine tatsächlich angekommene Meldung wird vermerkt. Sonst würde ein
    // fehlgeschlagener Versuch die Zahl dauerhaft verschlucken.
    if (!result.forwarded) return

    const metadata =
      subscriber.metadata && typeof subscriber.metadata === 'object' && !Array.isArray(subscriber.metadata)
        ? (subscriber.metadata as Record<string, unknown>)
        : {}

    await prisma.subscriber.update({
      where: { id: subscriber.id },
      data: {
        metadata: {
          ...metadata,
          tracking: { ...tracking, reportedAt: new Date().toISOString() },
        },
      },
    })
  } catch (error) {
    // Eine bestätigte Anmeldung bleibt bestätigt, auch wenn das Melden scheitert.
    console.error('[tracking] CompleteRegistration nicht gemeldet:', error)
  }
}
