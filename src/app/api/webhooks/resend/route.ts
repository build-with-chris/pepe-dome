/**
 * Resend Webhook Endpoint
 *
 * Handles email events from Resend (opens, clicks, bounces, etc.)
 * Docs: https://resend.com/docs/dashboard/webhooks/event-types
 */

import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { isPermanentlyUnprocessable } from '@/lib/webhook-errors'

/**
 * Resend webhook event types
 */
type ResendWebhookEvent =
  | 'email.sent'
  | 'email.delivered'
  | 'email.delivery_delayed'
  | 'email.complained'
  | 'email.bounced'
  | 'email.opened'
  | 'email.clicked'

/**
 * Tags kommen je nach Kontext in zwei Formen: als Array (so werden sie beim
 * Versand gesetzt) oder als Objekt-Map (so liefert Resend sie im Webhook).
 */
type ResendTags = Array<{ name?: string; value?: string }> | Record<string, unknown> | null | undefined

interface ResendWebhookPayload {
  type: ResendWebhookEvent
  created_at: string
  data: {
    email_id: string
    from: string
    to: string[]
    subject: string
    created_at: string
    tags?: ResendTags
    // Event-specific fields
    click?: {
      link: string
      timestamp: string
    }
    bounce?: {
      bounceType: 'Hard' | 'Soft'
    }
  }
}

/**
 * Verify webhook signature.
 *
 * Resend signiert Webhooks über Svix. Header: `svix-id`, `svix-timestamp`,
 * `svix-signature`. Signatur = base64(HMAC-SHA256(secret, "id.timestamp.body")),
 * wobei das Secret der base64-Teil hinter `whsec_` ist. Der Header kann mehrere
 * space-getrennte "v1,<sig>"-Einträge enthalten; einer muss passen.
 *
 * Wichtig: Es muss der ROH-Body signiert/geprüft werden (nicht neu serialisiert).
 */
function verifyWebhookSignature(request: NextRequest, rawBody: string): boolean {
  const secret = process.env.RESEND_WEBHOOK_SECRET

  // Ohne Secret: nur lokal durchwinken, in Produktion abweisen.
  //
  // Vorher galt das Durchwinken überall. Fehlt die Variable in Vercel — sei es
  // durch einen Tippfehler, ein neues Preview-Deployment oder eine gelöschte
  // Einstellung —, akzeptiert der Endpunkt unsignierte Requests von jedem.
  // Wer das ausnutzt, meldet fremde Adressen als "bounced" oder "complained"
  // und löscht sie damit still aus dem Verteiler.
  //
  // Fail-open ist bei einem Sicherheitscheck die falsche Richtung: Ein
  // Konfigurationsfehler soll auffallen, nicht die Prüfung abschalten.
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      console.error(
        '[resend-webhook] RESEND_WEBHOOK_SECRET fehlt — Request abgewiesen. ' +
          'Ohne Secret ist keine Prüfung möglich und der Endpunkt stünde jedem offen.'
      )
      return false
    }

    console.warn('RESEND_WEBHOOK_SECRET not configured - skipping signature verification (nur lokal)')
    return true
  }

  const svixId = request.headers.get('svix-id')
  const svixTimestamp = request.headers.get('svix-timestamp')
  const svixSignature = request.headers.get('svix-signature')

  if (!svixId || !svixTimestamp || !svixSignature) {
    console.error('[resend-webhook] Svix-Header fehlen', {
      hasId: Boolean(svixId),
      hasTimestamp: Boolean(svixTimestamp),
      hasSignature: Boolean(svixSignature),
    })
    return false
  }

  // Replay-Schutz: Timestamp darf max. 5 Minuten abweichen
  const now = Math.floor(Date.now() / 1000)
  const ts = parseInt(svixTimestamp, 10)
  if (!Number.isFinite(ts) || Math.abs(now - ts) > 300) {
    console.error('[resend-webhook] Timestamp außerhalb der Toleranz')
    return false
  }

  const secretBytes = Buffer.from(secret.replace(/^whsec_/, ''), 'base64')
  const signedContent = `${svixId}.${svixTimestamp}.${rawBody}`
  const expected = crypto.createHmac('sha256', secretBytes).update(signedContent).digest('base64')
  const expectedBuf = Buffer.from(expected)

  // Header: "v1,<sig> v1,<sig2> ..." — einer muss timing-safe passen
  return svixSignature.split(' ').some((part) => {
    const comma = part.indexOf(',')
    const sig = comma === -1 ? part : part.slice(comma + 1)
    const sigBuf = Buffer.from(sig)
    return sigBuf.length === expectedBuf.length && crypto.timingSafeEqual(sigBuf, expectedBuf)
  })
}

/**
 * Tag-Wert aus dem Webhook-Payload lesen.
 *
 * Achtung: Beim Versand werden Tags als Array [{ name, value }] gesetzt,
 * im Webhook-Payload liefert Resend sie aber als Objekt { name: value }.
 * Beide Formen werden unterstützt — alles andere wird ignoriert statt zu
 * crashen (ein Fehler hier kostete zuvor jedes einzelne Event).
 */
function getTagValue(tags: ResendTags, key: string): string | null {
  if (!tags) return null

  if (Array.isArray(tags)) {
    const tag = tags.find((t) => t && typeof t === 'object' && t.name === key)
    return typeof tag?.value === 'string' ? tag.value : null
  }

  if (typeof tags === 'object') {
    const value = (tags as Record<string, unknown>)[key]
    return typeof value === 'string' ? value : null
  }

  return null
}

function getSubscriberIdFromTags(tags: ResendTags): string | null {
  return getTagValue(tags, 'subscriber_id')
}

function getNewsletterIdFromTags(tags: ResendTags): string | null {
  return getTagValue(tags, 'newsletter_id')
}

/**
 * POST /api/webhooks/resend
 *
 * Handle Resend webhook events
 */
export async function POST(request: NextRequest) {
  try {
    // Roh-Body lesen (für die Signaturprüfung nötig) und erst danach parsen
    const rawBody = await request.text()

    if (!verifyWebhookSignature(request, rawBody)) {
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      )
    }

    const payload: ResendWebhookPayload = JSON.parse(rawBody)
    const { type, data } = payload

    let subscriberId = getSubscriberIdFromTags(data.tags)
    let newsletterId = getNewsletterIdFromTags(data.tags)

    // Fallback: Wenn Resend keine Tags mitschickt, über die beim Versand
    // gespeicherte Resend-email_id zuordnen (SENT-Event → subscriber/newsletter).
    if ((!subscriberId || !newsletterId) && data.email_id) {
      const sentEvent = await prisma.newsletterEvent.findFirst({
        where: { resendEventId: data.email_id, eventType: 'SENT' },
        select: { subscriberId: true, newsletterId: true },
      })
      if (sentEvent) {
        subscriberId = subscriberId || sentEvent.subscriberId
        newsletterId = newsletterId || sentEvent.newsletterId
      } else if (type === 'email.opened' || type === 'email.clicked' || type === 'email.delivered') {
        console.warn('[resend-webhook] Event nicht zuordenbar (keine Tags, kein SENT-Event)', {
          type,
          emailId: data.email_id,
        })
      }
    }

    // Die IDs stammen aus den Tags der Mail. Resend spielt die zurück, wie sie
    // beim Versand gesetzt wurden — auch Monate später und auch dann, wenn der
    // Newsletter inzwischen gelöscht wurde. Ungeprüft in newsletterEvent.create
    // gereicht, verletzten sie den Fremdschlüssel, der Handler warf, und die
    // Route antwortete mit 500. Resend wertet 500 als "später nochmal
    // versuchen" und stellte dasselbe Event endlos erneut zu.
    ;({ subscriberId, newsletterId } = await keepOnlyExistingIds(
      subscriberId,
      newsletterId,
      { type, emailId: data.email_id }
    ))

    console.log('Resend webhook received:', {
      type,
      emailId: data.email_id,
      subscriberId,
      newsletterId,
    })

    // Handle different event types
    switch (type) {
      case 'email.opened':
        await handleEmailOpened(subscriberId, newsletterId, data.email_id)
        break

      case 'email.clicked':
        await handleEmailClicked(subscriberId, newsletterId, data.email_id, data.click?.link)
        break

      case 'email.bounced':
        await handleEmailBounced(subscriberId, newsletterId, data.email_id, data.bounce?.bounceType)
        break

      case 'email.complained':
        await handleEmailComplained(subscriberId, newsletterId, data.email_id)
        break

      case 'email.delivered':
        // Track delivery for stats
        if (newsletterId) {
          await incrementNewsletterStat(newsletterId, 'deliveredCount')
        }
        break

      case 'email.sent':
        // Already tracked in send function
        break

      default:
        console.log('Unhandled webhook event type:', type)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    // Zwischen "kommt nie durch" und "gleich nochmal probieren" unterscheiden.
    //
    // Resend wiederholt jeden Webhook, den wir mit 5xx quittieren. Für einen
    // Payload, der dauerhaft nicht verarbeitbar ist (verwaiste ID in den Tags),
    // heißt das: derselbe Fehler im Minutentakt, für immer. Solche Fälle werden
    // protokolliert und mit 200 bestätigt — verarbeitet haben wir sie nicht,
    // aber ein erneuter Versuch würde exakt dasselbe Ergebnis liefern.
    //
    // Alles andere (Datenbank weg, Timeout) bleibt 5xx, denn dort ist ein
    // späterer Versuch genau richtig.
    if (isPermanentlyUnprocessable(error)) {
      console.warn('[resend-webhook] Event dauerhaft nicht verarbeitbar, wird bestätigt', {
        code: (error as { code?: string }).code,
        message: error instanceof Error ? error.message.split('\n')[0] : String(error),
      })
      return NextResponse.json({ received: true, processed: false })
    }

    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

/**
 * Behält nur IDs, zu denen es die Zeile auch wirklich gibt.
 *
 * Die Werte kommen aus den Tags der Mail und sind damit so alt wie der Versand.
 * Wird ein Newsletter oder eine Abonnentin danach gelöscht, zeigt der Tag ins
 * Leere. Alles, was hier durchfällt, wird zu null — die Handler prüfen ohnehin
 * auf null und überspringen dann den jeweiligen Schritt, statt mitten im
 * Schreiben zu scheitern.
 *
 * Bewusst vor dem ersten Schreibzugriff: der Bounce-Handler trägt zuerst die
 * Person aus und legt dann das Ereignis an. Bräche er beim zweiten Schritt ab,
 * wäre jemand ausgetragen, ohne dass der Grund dokumentiert ist.
 */
async function keepOnlyExistingIds(
  subscriberId: string | null,
  newsletterId: string | null,
  context: { type: string; emailId: string }
): Promise<{ subscriberId: string | null; newsletterId: string | null }> {
  const [subscriber, newsletter] = await Promise.all([
    subscriberId
      ? prisma.subscriber.findUnique({ where: { id: subscriberId }, select: { id: true } })
      : Promise.resolve(null),
    newsletterId
      ? prisma.newsletter.findUnique({ where: { id: newsletterId }, select: { id: true } })
      : Promise.resolve(null),
  ])

  if (subscriberId && !subscriber) {
    console.warn('[resend-webhook] Abonnent:in aus den Tags existiert nicht mehr', {
      ...context,
      subscriberId,
    })
  }
  if (newsletterId && !newsletter) {
    console.warn('[resend-webhook] Newsletter aus den Tags existiert nicht mehr', {
      ...context,
      newsletterId,
    })
  }

  return {
    subscriberId: subscriber ? subscriberId : null,
    newsletterId: newsletter ? newsletterId : null,
  }
}

/**
 * Handle email opened event
 */
async function handleEmailOpened(
  subscriberId: string | null,
  newsletterId: string | null,
  emailId: string
) {
  // Update subscriber last open timestamp
  if (subscriberId) {
    await prisma.subscriber.update({
      where: { id: subscriberId },
      data: { lastOpenAt: new Date() },
    })
  }

  // Update newsletter stats
  if (newsletterId) {
    await incrementNewsletterStat(newsletterId, 'openCount')

    // Track unique opens in events table
    const existingEvent = await prisma.newsletterEvent.findFirst({
      where: {
        newsletterId,
        subscriberId: subscriberId || undefined,
        eventType: 'OPENED',
      },
    })

    if (!existingEvent) {
      await incrementNewsletterStat(newsletterId, 'uniqueOpenCount')
    }
  }

  // Create event record
  if (subscriberId && newsletterId) {
    await prisma.newsletterEvent.create({
      data: {
        newsletterId,
        subscriberId,
        eventType: 'OPENED',
        eventData: { emailId },
      },
    })
  }
}

/**
 * Handle email clicked event
 */
async function handleEmailClicked(
  subscriberId: string | null,
  newsletterId: string | null,
  emailId: string,
  link?: string
) {
  // Update subscriber last click timestamp
  if (subscriberId) {
    await prisma.subscriber.update({
      where: { id: subscriberId },
      data: { lastClickAt: new Date() },
    })
  }

  // Update newsletter stats
  if (newsletterId) {
    await incrementNewsletterStat(newsletterId, 'clickCount')

    // Track unique clicks
    const existingEvent = await prisma.newsletterEvent.findFirst({
      where: {
        newsletterId,
        subscriberId: subscriberId || undefined,
        eventType: 'CLICKED',
      },
    })

    if (!existingEvent) {
      await incrementNewsletterStat(newsletterId, 'uniqueClickCount')
    }
  }

  // Create event record
  if (subscriberId && newsletterId) {
    await prisma.newsletterEvent.create({
      data: {
        newsletterId,
        subscriberId,
        eventType: 'CLICKED',
        eventData: { emailId, link },
      },
    })
  }
}

/**
 * Handle email bounced event
 */
async function handleEmailBounced(
  subscriberId: string | null,
  newsletterId: string | null,
  emailId: string,
  bounceType?: 'Hard' | 'Soft'
) {
  // Statistik auch dann führen, wenn die Person nicht auflösbar ist
  if (newsletterId) {
    await incrementNewsletterStat(newsletterId, 'bounceCount')
  }

  if (!subscriberId) return

  const isHard = bounceType === 'Hard'
  const timestamp = new Date()

  // Metadaten zusammenführen statt überschreiben — der frühere Code setzte
  // das Objekt zweimal neu und löschte damit u.a. den Austragungsgrund.
  const existing = await prisma.subscriber.findUnique({
    where: { id: subscriberId },
    select: { metadata: true },
  })
  const meta = mergeableMetadata(existing?.metadata)

  await prisma.subscriber.update({
    where: { id: subscriberId },
    data: {
      // Nur Hard Bounces austragen; Soft Bounces sind oft temporär
      ...(isHard ? { status: 'UNSUBSCRIBED' as const, unsubscribedAt: timestamp } : {}),
      metadata: {
        ...meta,
        ...(isHard ? { unsubscribeReason: 'hard_bounce' } : {}),
        lastBounce: { type: bounceType ?? 'unknown', emailId, timestamp: timestamp.toISOString() },
      },
    },
  })

  if (newsletterId) {
    await prisma.newsletterEvent.create({
      data: {
        newsletterId,
        subscriberId,
        eventType: 'BOUNCED',
        eventData: { emailId, bounceType: bounceType ?? 'unknown' },
        resendEventId: emailId,
      },
    })
  }

  if (isHard) {
    console.log(`Subscriber ${subscriberId} unsubscribed due to hard bounce`)
  }
}

/**
 * Handle email complained event (spam report)
 */
async function handleEmailComplained(
  subscriberId: string | null,
  newsletterId: string | null,
  emailId: string
) {
  if (newsletterId) {
    await incrementNewsletterStat(newsletterId, 'complaintCount')
  }

  if (!subscriberId) return

  const timestamp = new Date()
  const existing = await prisma.subscriber.findUnique({
    where: { id: subscriberId },
    select: { metadata: true },
  })
  const meta = mergeableMetadata(existing?.metadata)

  // Beschwerde führt immer zum Austrag
  await prisma.subscriber.update({
    where: { id: subscriberId },
    data: {
      status: 'UNSUBSCRIBED',
      unsubscribedAt: timestamp,
      metadata: {
        ...meta,
        unsubscribeReason: 'spam_complaint',
        lastComplaint: { emailId, timestamp: timestamp.toISOString() },
      },
    },
  })

  if (newsletterId) {
    await prisma.newsletterEvent.create({
      data: {
        newsletterId,
        subscriberId,
        eventType: 'COMPLAINED',
        eventData: { emailId },
        resendEventId: emailId,
      },
    })
  }

  console.log(`Subscriber ${subscriberId} unsubscribed due to spam complaint`)
}

/**
 * Increment newsletter stat counter
 */
/** Vorhandene Metadaten als mergefähiges Objekt zurückgeben */
function mergeableMetadata(metadata: unknown): Record<string, unknown> {
  return metadata && typeof metadata === 'object' && !Array.isArray(metadata)
    ? (metadata as Record<string, unknown>)
    : {}
}

async function incrementNewsletterStat(
  newsletterId: string,
  field:
    | 'openCount'
    | 'clickCount'
    | 'deliveredCount'
    | 'uniqueOpenCount'
    | 'uniqueClickCount'
    | 'bounceCount'
    | 'complaintCount'
) {
  try {
    // Check if newsletter exists first
    const newsletter = await prisma.newsletter.findUnique({
      where: { id: newsletterId },
      select: { id: true },
    })

    if (!newsletter) {
      console.warn(`Newsletter ${newsletterId} not found, skipping stat update`)
      return
    }

    // Upsert stats record
    await prisma.newsletterStats.upsert({
      where: { newsletterId },
      create: {
        newsletterId,
        sentCount: 0,
        deliveredCount: field === 'deliveredCount' ? 1 : 0,
        openCount: field === 'openCount' ? 1 : 0,
        clickCount: field === 'clickCount' ? 1 : 0,
        uniqueOpenCount: field === 'uniqueOpenCount' ? 1 : 0,
        uniqueClickCount: field === 'uniqueClickCount' ? 1 : 0,
        bounceCount: field === 'bounceCount' ? 1 : 0,
        complaintCount: field === 'complaintCount' ? 1 : 0,
      },
      update: {
        [field]: { increment: 1 },
      },
    })
  } catch (error) {
    console.error(`Failed to update newsletter stat for ${newsletterId}:`, error)
  }
}
