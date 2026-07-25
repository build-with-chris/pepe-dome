/**
 * Resend Webhook Tests
 *
 * Tests for webhook event handling
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { prisma } from '@/lib/prisma'
import { POST } from '@/app/api/webhooks/resend/route'
import { NextRequest } from 'next/server'

describe('Resend Webhooks - Email Events', () => {
  let subscriber: any
  let newsletter: any

  beforeEach(async () => {
    // Use unique identifiers per test run to avoid conflicts
    const testId = Date.now().toString()

    subscriber = await prisma.subscriber.create({
      data: {
        email: `webhook-test-${testId}@example.com`,
        status: 'ACTIVE',
      },
    })

    newsletter = await prisma.newsletter.create({
      data: {
        slug: `webhook-test-newsletter-${testId}`,
        subject: 'Test Newsletter',
        status: 'SENT',
        sentAt: new Date(),
      },
    })

    // Create initial stats with the newsletter
    await prisma.newsletterStats.create({
      data: {
        newsletterId: newsletter.id,
        sentCount: 10,
      },
    })
  })

  it('should handle email opened event', async () => {
    const payload = {
      type: 'email.opened',
      created_at: new Date().toISOString(),
      data: {
        email_id: 'test-email-id',
        from: 'newsletter@pepe-dome.de',
        to: [subscriber.email],
        subject: 'Test',
        created_at: new Date().toISOString(),
        tags: [
          { name: 'subscriber_id', value: subscriber.id },
          { name: 'newsletter_id', value: newsletter.id },
        ],
      },
    }

    const request = new NextRequest('http://localhost:3000/api/webhooks/resend', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: new Headers({
        'Content-Type': 'application/json',
        'resend-signature': process.env.RESEND_WEBHOOK_SECRET || 'test-signature',
      }),
    })

    const response = await POST(request)
    expect(response.status).toBe(200)

    // Verify subscriber lastOpenAt was updated
    const updated = await prisma.subscriber.findUnique({
      where: { id: subscriber.id },
    })
    expect(updated?.lastOpenAt).toBeTruthy()

    // Verify newsletter stats were incremented
    const stats = await prisma.newsletterStats.findUnique({
      where: { newsletterId: newsletter.id },
    })
    expect(stats?.openCount).toBe(1)
    expect(stats?.uniqueOpenCount).toBe(1)

    // Verify event was recorded
    const event = await prisma.newsletterEvent.findFirst({
      where: {
        newsletterId: newsletter.id,
        subscriberId: subscriber.id,
        eventType: 'OPENED',
      },
    })
    expect(event).toBeTruthy()
  })

  it('should handle email clicked event', async () => {
    const payload = {
      type: 'email.clicked',
      created_at: new Date().toISOString(),
      data: {
        email_id: 'test-email-id',
        from: 'newsletter@pepe-dome.de',
        to: [subscriber.email],
        subject: 'Test',
        created_at: new Date().toISOString(),
        tags: [
          { name: 'subscriber_id', value: subscriber.id },
          { name: 'newsletter_id', value: newsletter.id },
        ],
        click: {
          link: 'https://pepe-dome.de/events',
          timestamp: new Date().toISOString(),
        },
      },
    }

    const request = new NextRequest('http://localhost:3000/api/webhooks/resend', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: new Headers({
        'Content-Type': 'application/json',
        'resend-signature': process.env.RESEND_WEBHOOK_SECRET || 'test-signature',
      }),
    })

    const response = await POST(request)
    expect(response.status).toBe(200)

    // Verify subscriber lastClickAt was updated
    const updated = await prisma.subscriber.findUnique({
      where: { id: subscriber.id },
    })
    expect(updated?.lastClickAt).toBeTruthy()

    // Verify newsletter stats
    const stats = await prisma.newsletterStats.findUnique({
      where: { newsletterId: newsletter.id },
    })
    expect(stats?.clickCount).toBe(1)
    expect(stats?.uniqueClickCount).toBe(1)
  })

  it('should unsubscribe on hard bounce', async () => {
    const payload = {
      type: 'email.bounced',
      created_at: new Date().toISOString(),
      data: {
        email_id: 'test-email-id',
        from: 'newsletter@pepe-dome.de',
        to: [subscriber.email],
        subject: 'Test',
        created_at: new Date().toISOString(),
        tags: [{ name: 'subscriber_id', value: subscriber.id }],
        bounce: {
          bounceType: 'Hard' as const,
        },
      },
    }

    const request = new NextRequest('http://localhost:3000/api/webhooks/resend', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: new Headers({
        'Content-Type': 'application/json',
        'resend-signature': process.env.RESEND_WEBHOOK_SECRET || 'test-signature',
      }),
    })

    const response = await POST(request)
    expect(response.status).toBe(200)

    // Verify subscriber was unsubscribed
    const updated = await prisma.subscriber.findUnique({
      where: { id: subscriber.id },
    })
    expect(updated?.status).toBe('UNSUBSCRIBED')
    expect(updated?.unsubscribedAt).toBeTruthy()
  })

  it('should unsubscribe on spam complaint', async () => {
    const payload = {
      type: 'email.complained',
      created_at: new Date().toISOString(),
      data: {
        email_id: 'test-email-id',
        from: 'newsletter@pepe-dome.de',
        to: [subscriber.email],
        subject: 'Test',
        created_at: new Date().toISOString(),
        tags: [{ name: 'subscriber_id', value: subscriber.id }],
      },
    }

    const request = new NextRequest('http://localhost:3000/api/webhooks/resend', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: new Headers({
        'Content-Type': 'application/json',
        'resend-signature': process.env.RESEND_WEBHOOK_SECRET || 'test-signature',
      }),
    })

    const response = await POST(request)
    expect(response.status).toBe(200)

    // Verify subscriber was unsubscribed
    const updated = await prisma.subscriber.findUnique({
      where: { id: subscriber.id },
    })
    expect(updated?.status).toBe('UNSUBSCRIBED')
    expect(updated?.unsubscribedAt).toBeTruthy()
  })

  /**
   * Der Fall, der live im Minutentakt 500er erzeugt hat.
   *
   * In den Tags einer Mail steckt die newsletter_id vom Tag des Versands.
   * Resend spielt sie bei jedem Ereignis zurück, auch wenn der Newsletter
   * inzwischen gelöscht wurde. Ungeprüft weitergereicht verletzte sie den
   * Fremdschlüssel newsletter_events_newsletter_id_fkey, die Route antwortete
   * 500, und Resend stellte dasselbe Ereignis endlos erneut zu.
   */
  describe('verwaiste IDs in den Tags', () => {
    const NICHT_EXISTENT = '00000000-0000-4000-8000-000000000000'

    function requestWith(payload: unknown) {
      return new NextRequest('http://localhost:3000/api/webhooks/resend', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: new Headers({
          'Content-Type': 'application/json',
          'resend-signature': process.env.RESEND_WEBHOOK_SECRET || 'test-signature',
        }),
      })
    }

    it('quittiert ein Event mit gelöschtem Newsletter, statt 500 zu werfen', async () => {
      const response = await POST(
        requestWith({
          type: 'email.opened',
          created_at: new Date().toISOString(),
          data: {
            email_id: 'verwaist-newsletter',
            from: 'newsletter@pepe-dome.de',
            to: [subscriber.email],
            subject: 'Test',
            created_at: new Date().toISOString(),
            tags: [
              { name: 'subscriber_id', value: subscriber.id },
              { name: 'newsletter_id', value: NICHT_EXISTENT },
            ],
          },
        })
      )

      // 200, sonst wiederholt Resend bis in alle Ewigkeit
      expect(response.status).toBe(200)

      // Und es darf keine Zeile mit der toten Referenz entstanden sein
      const events = await prisma.newsletterEvent.count({
        where: { newsletterId: NICHT_EXISTENT },
      })
      expect(events).toBe(0)
    })

    it('quittiert ein Event mit gelöschter Abonnentin', async () => {
      const response = await POST(
        requestWith({
          type: 'email.clicked',
          created_at: new Date().toISOString(),
          data: {
            email_id: 'verwaist-subscriber',
            from: 'newsletter@pepe-dome.de',
            to: ['weg@example.com'],
            subject: 'Test',
            created_at: new Date().toISOString(),
            click: { link: 'https://www.pepe-dome.de', timestamp: new Date().toISOString() },
            tags: [
              { name: 'subscriber_id', value: NICHT_EXISTENT },
              { name: 'newsletter_id', value: newsletter.id },
            ],
          },
        })
      )

      expect(response.status).toBe(200)
      const events = await prisma.newsletterEvent.count({
        where: { subscriberId: NICHT_EXISTENT },
      })
      expect(events).toBe(0)
    })

    it('trägt bei einem Bounce mit totem Newsletter trotzdem nicht halb aus', async () => {
      // Der Bounce-Handler trägt zuerst die Person aus und legt dann das
      // Ereignis an. Bräche er beim zweiten Schritt ab, wäre jemand ausgetragen
      // ohne dokumentierten Grund. Deshalb wird vorher geprüft.
      const response = await POST(
        requestWith({
          type: 'email.bounced',
          created_at: new Date().toISOString(),
          data: {
            email_id: 'verwaist-bounce',
            from: 'newsletter@pepe-dome.de',
            to: [subscriber.email],
            subject: 'Test',
            created_at: new Date().toISOString(),
            bounce: { bounceType: 'Hard' },
            tags: [
              { name: 'subscriber_id', value: subscriber.id },
              { name: 'newsletter_id', value: NICHT_EXISTENT },
            ],
          },
        })
      )

      expect(response.status).toBe(200)

      // Austragen soll weiterhin passieren, das hängt nicht am Newsletter
      const updated = await prisma.subscriber.findUnique({ where: { id: subscriber.id } })
      expect(updated?.status).toBe('UNSUBSCRIBED')

      const meta = (updated?.metadata ?? {}) as Record<string, unknown>
      expect(meta.unsubscribeReason).toBe('hard_bounce')
    })
  })
})
