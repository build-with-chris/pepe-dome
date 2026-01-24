/**
 * Cron Job: Send Scheduled Newsletters Tests
 * Tests for the scheduled newsletter sending cron endpoint
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { NewsletterStatus, SubscriberStatus } from '@prisma/client'

// Mock email sending
vi.mock('@/lib/email-send', () => ({
  sendNewsletter: vi.fn().mockResolvedValue({
    success: 5,
    failed: 0,
    total: 5,
    results: [],
  }),
}))

import { GET, POST } from '@/app/api/cron/send-scheduled-newsletters/route'

describe('Cron: Send Scheduled Newsletters', () => {
  beforeEach(async () => {
    // Create some active subscribers for the newsletter send
    await prisma.subscriber.createMany({
      data: [
        { email: 'cron-sub1@example.com', status: SubscriberStatus.ACTIVE, confirmedAt: new Date() },
        { email: 'cron-sub2@example.com', status: SubscriberStatus.ACTIVE, confirmedAt: new Date() },
      ],
    })
  })

  it('should send newsletters scheduled for the past', async () => {
    // Create a scheduled newsletter with past date
    await prisma.newsletter.create({
      data: {
        slug: 'cron-test-past',
        subject: 'Past Scheduled',
        status: NewsletterStatus.SCHEDULED,
        scheduledAt: new Date(Date.now() - 60000), // 1 minute ago
      },
    })

    const request = new NextRequest(
      'http://localhost:3000/api/cron/send-scheduled-newsletters',
      { headers: { 'x-vercel-cron': 'true' } }
    )

    const response = await GET(request)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.success).toBe(true)
    expect(body.sent).toBe(1)
  })

  it('should not send newsletters scheduled for the future', async () => {
    await prisma.newsletter.create({
      data: {
        slug: 'cron-test-future',
        subject: 'Future Scheduled',
        status: NewsletterStatus.SCHEDULED,
        scheduledAt: new Date(Date.now() + 86400000), // Tomorrow
      },
    })

    const request = new NextRequest(
      'http://localhost:3000/api/cron/send-scheduled-newsletters',
      { headers: { 'x-vercel-cron': 'true' } }
    )

    const response = await GET(request)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.sent).toBe(0)
    expect(body.message).toBe('No newsletters scheduled')
  })

  it('should not send draft newsletters', async () => {
    await prisma.newsletter.create({
      data: {
        slug: 'cron-test-draft',
        subject: 'Draft Newsletter',
        status: NewsletterStatus.DRAFT,
      },
    })

    const request = new NextRequest(
      'http://localhost:3000/api/cron/send-scheduled-newsletters',
      { headers: { 'x-vercel-cron': 'true' } }
    )

    const response = await GET(request)
    const body = await response.json()

    expect(body.sent).toBe(0)
  })

  it('should handle multiple scheduled newsletters', async () => {
    await prisma.newsletter.createMany({
      data: [
        {
          slug: 'cron-multi-1',
          subject: 'Multi 1',
          status: NewsletterStatus.SCHEDULED,
          scheduledAt: new Date(Date.now() - 120000),
        },
        {
          slug: 'cron-multi-2',
          subject: 'Multi 2',
          status: NewsletterStatus.SCHEDULED,
          scheduledAt: new Date(Date.now() - 60000),
        },
      ],
    })

    const request = new NextRequest(
      'http://localhost:3000/api/cron/send-scheduled-newsletters',
      { headers: { 'x-vercel-cron': 'true' } }
    )

    const response = await GET(request)
    const body = await response.json()

    expect(body.sent).toBe(2)
  })

  it('should reject unauthorized requests without cron header', async () => {
    // Set CRON_SECRET to simulate production
    const originalSecret = process.env.CRON_SECRET
    process.env.CRON_SECRET = 'test-secret'

    const request = new NextRequest(
      'http://localhost:3000/api/cron/send-scheduled-newsletters'
    )

    const response = await GET(request)
    expect(response.status).toBe(401)

    // Restore
    process.env.CRON_SECRET = originalSecret
  })

  it('should accept Bearer token authorization', async () => {
    const originalSecret = process.env.CRON_SECRET
    process.env.CRON_SECRET = 'test-secret-123'

    const request = new NextRequest(
      'http://localhost:3000/api/cron/send-scheduled-newsletters',
      { headers: { authorization: 'Bearer test-secret-123' } }
    )

    const response = await GET(request)
    expect(response.status).toBe(200)

    process.env.CRON_SECRET = originalSecret
  })

  it('should support POST method (manual trigger)', async () => {
    await prisma.newsletter.create({
      data: {
        slug: 'cron-post-test',
        subject: 'POST Test',
        status: NewsletterStatus.SCHEDULED,
        scheduledAt: new Date(Date.now() - 60000),
      },
    })

    const request = new NextRequest(
      'http://localhost:3000/api/cron/send-scheduled-newsletters',
      {
        method: 'POST',
        headers: { 'x-vercel-cron': 'true' },
      }
    )

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.sent).toBe(1)
  })
})
