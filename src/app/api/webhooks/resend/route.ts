/**
 * Resend Webhook Endpoint
 *
 * Handles email events from Resend (opens, clicks, bounces, etc.)
 * Docs: https://resend.com/docs/dashboard/webhooks/event-types
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

interface ResendWebhookPayload {
  type: ResendWebhookEvent
  created_at: string
  data: {
    email_id: string
    from: string
    to: string[]
    subject: string
    created_at: string
    tags?: Array<{ name: string; value: string }>
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
 * Verify webhook signature (if configured)
 * Note: Resend uses webhook secrets for verification
 */
function verifyWebhookSignature(request: NextRequest): boolean {
  const signature = request.headers.get('resend-signature')
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET

  // If no secret configured, skip verification (dev mode)
  if (!webhookSecret) {
    console.warn('RESEND_WEBHOOK_SECRET not configured - skipping signature verification')
    return true
  }

  // If secret is configured but no signature provided, reject
  if (!signature) {
    console.error('Webhook signature missing')
    return false
  }

  // TODO: Implement proper signature verification
  // Resend uses HMAC-SHA256 for webhook signatures
  // For now, we do basic comparison
  return signature === webhookSecret
}

/**
 * Extract subscriber ID from email tags
 */
function getSubscriberIdFromTags(tags?: Array<{ name: string; value: string }>): string | null {
  if (!tags) return null
  const subscriberTag = tags.find(tag => tag.name === 'subscriber_id')
  return subscriberTag?.value || null
}

/**
 * Extract newsletter ID from email tags
 */
function getNewsletterIdFromTags(tags?: Array<{ name: string; value: string }>): string | null {
  if (!tags) return null
  const newsletterTag = tags.find(tag => tag.name === 'newsletter_id')
  return newsletterTag?.value || null
}

/**
 * POST /api/webhooks/resend
 *
 * Handle Resend webhook events
 */
export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature
    if (!verifyWebhookSignature(request)) {
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      )
    }

    // Parse webhook payload
    const payload: ResendWebhookPayload = await request.json()
    const { type, data } = payload

    const subscriberId = getSubscriberIdFromTags(data.tags)
    const newsletterId = getNewsletterIdFromTags(data.tags)

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
        await handleEmailBounced(subscriberId, data.email_id, data.bounce?.bounceType)
        break

      case 'email.complained':
        await handleEmailComplained(subscriberId, data.email_id)
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
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
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
  emailId: string,
  bounceType?: 'Hard' | 'Soft'
) {
  if (!subscriberId) return

  // Hard bounces should unsubscribe the user
  if (bounceType === 'Hard') {
    await prisma.subscriber.update({
      where: { id: subscriberId },
      data: {
        status: 'UNSUBSCRIBED',
        unsubscribedAt: new Date(),
        metadata: {
          unsubscribeReason: 'hard_bounce',
          emailId,
        } as any,
      },
    })

    console.log(`Subscriber ${subscriberId} unsubscribed due to hard bounce`)
  }

  // Log bounce in metadata
  await prisma.subscriber.update({
    where: { id: subscriberId },
    data: {
      metadata: {
        lastBounce: {
          type: bounceType,
          emailId,
          timestamp: new Date().toISOString(),
        },
      } as any,
    },
  })
}

/**
 * Handle email complained event (spam report)
 */
async function handleEmailComplained(subscriberId: string | null, emailId: string) {
  if (!subscriberId) return

  // Automatically unsubscribe on spam complaint
  await prisma.subscriber.update({
    where: { id: subscriberId },
    data: {
      status: 'UNSUBSCRIBED',
      unsubscribedAt: new Date(),
      metadata: {
        unsubscribeReason: 'spam_complaint',
        emailId,
      } as any,
    },
  })

  console.log(`Subscriber ${subscriberId} unsubscribed due to spam complaint`)
}

/**
 * Increment newsletter stat counter
 */
async function incrementNewsletterStat(
  newsletterId: string,
  field: 'openCount' | 'clickCount' | 'deliveredCount' | 'uniqueOpenCount' | 'uniqueClickCount'
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
      },
      update: {
        [field]: { increment: 1 },
      },
    })
  } catch (error) {
    console.error(`Failed to update newsletter stat for ${newsletterId}:`, error)
  }
}
