/**
 * Integration Test: Webhook Processing with Stats Aggregation
 *
 * Tests the complete webhook flow and stats tracking
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { prisma } from '@/lib/prisma'
import { POST } from '@/app/api/webhooks/resend/route'
import { NextRequest } from 'next/server'

describe('Integration: Webhook Processing and Stats', () => {
  let subscriber: any
  let newsletter: any
  let stats: any

  beforeEach(async () => {
    // Create test subscriber
    subscriber = await prisma.subscriber.create({
      data: {
        email: 'webhook-stats@example.com',
        status: 'ACTIVE',
        confirmedAt: new Date(),
      },
    })

    // Create sent newsletter
    newsletter = await prisma.newsletter.create({
      data: {
        slug: 'webhook-stats-test',
        subject: 'Webhook Stats Test',
        status: 'SENT',
        sentAt: new Date(),
        recipientCount: 1,
      },
    })

    // Create initial stats
    stats = await prisma.newsletterStats.create({
      data: {
        newsletterId: newsletter.id,
        sentCount: 1,
      },
    })
  })

  it('should process webhook events and aggregate stats correctly', async () => {
    // STEP 1: Process delivered event
    const deliveredPayload = {
      type: 'email.delivered',
      created_at: new Date().toISOString(),
      data: {
        email_id: 'test-email-delivered',
        from: 'newsletter@pepe-dome.de',
        to: [subscriber.email],
        subject: newsletter.subject,
        created_at: new Date().toISOString(),
        tags: [
          { name: 'newsletter_id', value: newsletter.id },
          { name: 'subscriber_id', value: subscriber.id },
        ],
      },
    }

    const deliveredRequest = new NextRequest('http://localhost:3000/api/webhooks/resend', {
      method: 'POST',
      body: JSON.stringify(deliveredPayload),
    })

    const deliveredResponse = await POST(deliveredRequest)
    expect(deliveredResponse.status).toBe(200)

    // Verify stats updated
    let updatedStats = await prisma.newsletterStats.findUnique({
      where: { newsletterId: newsletter.id },
    })

    expect(updatedStats!.deliveredCount).toBe(1)

    // STEP 2: Process opened event (first open)
    const openedPayload = {
      type: 'email.opened',
      created_at: new Date().toISOString(),
      data: {
        email_id: 'test-email-opened',
        from: 'newsletter@pepe-dome.de',
        to: [subscriber.email],
        subject: newsletter.subject,
        created_at: new Date().toISOString(),
        tags: [
          { name: 'newsletter_id', value: newsletter.id },
          { name: 'subscriber_id', value: subscriber.id },
        ],
      },
    }

    const openedRequest = new NextRequest('http://localhost:3000/api/webhooks/resend', {
      method: 'POST',
      body: JSON.stringify(openedPayload),
    })

    const openedResponse = await POST(openedRequest)
    expect(openedResponse.status).toBe(200)

    // Verify stats updated
    updatedStats = await prisma.newsletterStats.findUnique({
      where: { newsletterId: newsletter.id },
    })

    expect(updatedStats!.openCount).toBe(1)
    expect(updatedStats!.uniqueOpenCount).toBe(1)

    // Verify subscriber lastOpenAt updated
    let updatedSubscriber = await prisma.subscriber.findUnique({
      where: { id: subscriber.id },
    })

    expect(updatedSubscriber!.lastOpenAt).toBeTruthy()

    // Verify event recorded
    let events = await prisma.newsletterEvent.findMany({
      where: {
        newsletterId: newsletter.id,
        subscriberId: subscriber.id,
        eventType: 'OPENED',
      },
    })

    expect(events).toHaveLength(1)

    // STEP 3: Process opened event again (second open)
    const secondOpenedRequest = new NextRequest('http://localhost:3000/api/webhooks/resend', {
      method: 'POST',
      body: JSON.stringify(openedPayload),
    })

    await POST(secondOpenedRequest)

    // Verify openCount incremented but uniqueOpenCount stays at 1
    updatedStats = await prisma.newsletterStats.findUnique({
      where: { newsletterId: newsletter.id },
    })

    expect(updatedStats!.openCount).toBe(2)
    expect(updatedStats!.uniqueOpenCount).toBe(1) // Still 1!

    // STEP 4: Process clicked event (first click)
    const clickedPayload = {
      type: 'email.clicked',
      created_at: new Date().toISOString(),
      data: {
        email_id: 'test-email-clicked',
        from: 'newsletter@pepe-dome.de',
        to: [subscriber.email],
        subject: newsletter.subject,
        created_at: new Date().toISOString(),
        click: {
          link: 'https://pepe-dome.de/events',
          timestamp: new Date().toISOString(),
        },
        tags: [
          { name: 'newsletter_id', value: newsletter.id },
          { name: 'subscriber_id', value: subscriber.id },
        ],
      },
    }

    const clickedRequest = new NextRequest('http://localhost:3000/api/webhooks/resend', {
      method: 'POST',
      body: JSON.stringify(clickedPayload),
    })

    const clickedResponse = await POST(clickedRequest)
    expect(clickedResponse.status).toBe(200)

    // Verify stats updated
    updatedStats = await prisma.newsletterStats.findUnique({
      where: { newsletterId: newsletter.id },
    })

    expect(updatedStats!.clickCount).toBe(1)
    expect(updatedStats!.uniqueClickCount).toBe(1)

    // Verify subscriber lastClickAt updated
    updatedSubscriber = await prisma.subscriber.findUnique({
      where: { id: subscriber.id },
    })

    expect(updatedSubscriber!.lastClickAt).toBeTruthy()

    // Verify click event recorded with link
    events = await prisma.newsletterEvent.findMany({
      where: {
        newsletterId: newsletter.id,
        subscriberId: subscriber.id,
        eventType: 'CLICKED',
      },
    })

    expect(events).toHaveLength(1)
    expect(events[0].eventData).toHaveProperty('link')
    expect((events[0].eventData as any).link).toBe('https://pepe-dome.de/events')

    // STEP 5: Process clicked event again (second click)
    const secondClickedRequest = new NextRequest('http://localhost:3000/api/webhooks/resend', {
      method: 'POST',
      body: JSON.stringify(clickedPayload),
    })

    await POST(secondClickedRequest)

    // Verify clickCount incremented but uniqueClickCount stays at 1
    updatedStats = await prisma.newsletterStats.findUnique({
      where: { newsletterId: newsletter.id },
    })

    expect(updatedStats!.clickCount).toBe(2)
    expect(updatedStats!.uniqueClickCount).toBe(1) // Still 1!

    // FINAL VERIFICATION: Check complete stats
    const finalStats = await prisma.newsletterStats.findUnique({
      where: { newsletterId: newsletter.id },
    })

    expect(finalStats).toMatchObject({
      sentCount: 1,
      deliveredCount: 1,
      openCount: 2, // Two opens
      uniqueOpenCount: 1, // But only unique once
      clickCount: 2, // Two clicks
      uniqueClickCount: 1, // But only unique once
    })
  })

  it('should handle webhooks without subscriber or newsletter IDs gracefully', async () => {
    // Webhook without tags
    const payload = {
      type: 'email.delivered',
      created_at: new Date().toISOString(),
      data: {
        email_id: 'test-no-tags',
        from: 'newsletter@pepe-dome.de',
        to: ['unknown@example.com'],
        subject: 'Test',
        created_at: new Date().toISOString(),
      },
    }

    const request = new NextRequest('http://localhost:3000/api/webhooks/resend', {
      method: 'POST',
      body: JSON.stringify(payload),
    })

    const response = await POST(request)

    // Should still return 200 (acknowledged) even if no processing done
    expect(response.status).toBe(200)
  })

  it('should calculate open and click rates correctly', async () => {
    // Create newsletter with 10 recipients
    const newsletter = await prisma.newsletter.create({
      data: {
        slug: 'rate-calculation-test',
        subject: 'Rate Test',
        status: 'SENT',
        sentAt: new Date(),
        recipientCount: 10,
      },
    })

    const stats = await prisma.newsletterStats.create({
      data: {
        newsletterId: newsletter.id,
        sentCount: 10,
        deliveredCount: 9, // 1 bounced
        uniqueOpenCount: 6, // 6 unique opens
        uniqueClickCount: 3, // 3 unique clicks
      },
    })

    // Calculate rates
    const openRate = (stats.uniqueOpenCount / stats.deliveredCount) * 100
    const clickRate = (stats.uniqueClickCount / stats.uniqueOpenCount) * 100
    const clickToDeliveredRate = (stats.uniqueClickCount / stats.deliveredCount) * 100

    expect(openRate).toBeCloseTo(66.67, 1) // 6/9 = 66.67%
    expect(clickRate).toBeCloseTo(50, 1) // 3/6 = 50%
    expect(clickToDeliveredRate).toBeCloseTo(33.33, 1) // 3/9 = 33.33%
  })
})
