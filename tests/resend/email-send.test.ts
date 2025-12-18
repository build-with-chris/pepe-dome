/**
 * Email Sending Tests
 *
 * Tests for Resend integration and email sending functions
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { prisma } from '@/lib/prisma'
import { sendConfirmationEmail, sendWelcomeEmail, sendNewsletter } from '@/lib/email-send'

// Mock Resend client
vi.mock('@/lib/resend', () => ({
  resend: {
    emails: {
      send: vi.fn().mockResolvedValue({ id: 'mock-email-id' }),
    },
  },
  DEFAULT_FROM_EMAIL: 'PEPE Dome <newsletter@pepe-dome.de>',
  generateEmailUrls: (subscriberId: string, token?: string) => ({
    confirm: `http://localhost:3000/newsletter/confirm?token=${token || 'test-token'}`,
    unsubscribe: `http://localhost:3000/newsletter/unsubscribe/${subscriberId}`,
    webView: (newsletterId: string) => `http://localhost:3000/newsletter/${newsletterId}`,
    privacy: 'http://localhost:3000/privacy',
    home: 'http://localhost:3000',
  }),
  EMAIL_CONFIG: {
    MAX_BATCH_SIZE: 50,
    BATCH_DELAY_MS: 100,
    MAX_RETRIES: 3,
    BASE_URL: 'http://localhost:3000',
  },
  batchSendEmails: async (emails: any[], sendFn: Function) => {
    return await Promise.all(
      emails.map(async (email) => {
        try {
          const result = await sendFn(email)
          return { success: true, email, id: result.id }
        } catch (error) {
          return {
            success: false,
            email,
            error: error instanceof Error ? error.message : 'Unknown error',
          }
        }
      })
    )
  },
}))

describe('Email Sending - Confirmation Email', () => {
  let subscriber: any

  beforeEach(async () => {
    // Create test subscriber
    subscriber = await prisma.subscriber.create({
      data: {
        email: 'test-confirmation@example.com',
        firstName: 'Test',
        status: 'PENDING',
        doubleOptInToken: 'test-token-123',
      },
    })
  })

  it('should send confirmation email to pending subscriber', async () => {
    const result = await sendConfirmationEmail(subscriber.id)

    expect(result).toHaveProperty('id', 'mock-email-id')

    // Verify subscriber was updated
    const updated = await prisma.subscriber.findUnique({
      where: { id: subscriber.id },
    })
    expect(updated?.doubleOptInSentAt).toBeTruthy()
  })

  it('should reject sending to non-pending subscriber', async () => {
    await prisma.subscriber.update({
      where: { id: subscriber.id },
      data: { status: 'ACTIVE' },
    })

    await expect(sendConfirmationEmail(subscriber.id)).rejects.toThrow(
      'Subscriber is not in PENDING status'
    )
  })
})

describe('Email Sending - Welcome Email', () => {
  let subscriber: any

  beforeEach(async () => {
    subscriber = await prisma.subscriber.create({
      data: {
        email: 'test-welcome@example.com',
        firstName: 'Test',
        status: 'ACTIVE',
        confirmedAt: new Date(),
      },
    })
  })

  it('should send welcome email to active subscriber', async () => {
    const result = await sendWelcomeEmail(subscriber.id)

    expect(result).toHaveProperty('id', 'mock-email-id')
  })

  it('should reject sending to unconfirmed subscriber', async () => {
    await prisma.subscriber.update({
      where: { id: subscriber.id },
      data: { status: 'PENDING' },
    })

    await expect(sendWelcomeEmail(subscriber.id)).rejects.toThrow(
      'Subscriber is not confirmed'
    )
  })
})

describe('Email Sending - Newsletter with Batching', () => {
  let newsletter: any
  let subscribers: any[]

  beforeEach(async () => {
    // Create test newsletter
    newsletter = await prisma.newsletter.create({
      data: {
        slug: 'test-newsletter-2025-01',
        subject: 'Test Newsletter',
        preheader: 'Test preheader',
        status: 'DRAFT',
      },
    })

    // Create test subscribers
    subscribers = await Promise.all([
      prisma.subscriber.create({
        data: {
          email: 'subscriber1@example.com',
          status: 'ACTIVE',
        },
      }),
      prisma.subscriber.create({
        data: {
          email: 'subscriber2@example.com',
          status: 'ACTIVE',
        },
      }),
      prisma.subscriber.create({
        data: {
          email: 'subscriber3@example.com',
          status: 'PENDING', // This one should be skipped
        },
      }),
    ])
  })

  it('should send newsletter to active subscribers only', async () => {
    const result = await sendNewsletter(newsletter.id)

    expect(result.success).toBe(2) // Only 2 active subscribers
    expect(result.failed).toBe(0)
    expect(result.total).toBe(2)

    // Verify newsletter was marked as sent
    const updated = await prisma.newsletter.findUnique({
      where: { id: newsletter.id },
    })
    expect(updated?.status).toBe('SENT')
    expect(updated?.sentAt).toBeTruthy()
    expect(updated?.recipientCount).toBe(2)
  })

  it('should handle dry run mode without sending', async () => {
    const result = await sendNewsletter(newsletter.id, { dryRun: true })

    expect(result.success).toBe(2)

    // Newsletter should NOT be marked as sent in dry run
    const updated = await prisma.newsletter.findUnique({
      where: { id: newsletter.id },
    })
    expect(updated?.status).toBe('DRAFT')
    expect(updated?.sentAt).toBeNull()
  })

  it('should handle test recipients override', async () => {
    const result = await sendNewsletter(newsletter.id, {
      testRecipients: ['test@example.com'],
    })

    expect(result.total).toBe(1)
    expect(result.success).toBe(1)

    // Newsletter should NOT be marked as sent in test mode
    const updated = await prisma.newsletter.findUnique({
      where: { id: newsletter.id },
    })
    expect(updated?.status).toBe('DRAFT')
  })

  it('should reject sending already sent newsletter', async () => {
    await prisma.newsletter.update({
      where: { id: newsletter.id },
      data: { status: 'SENT', sentAt: new Date() },
    })

    await expect(sendNewsletter(newsletter.id)).rejects.toThrow(
      'Newsletter already sent'
    )
  })
})
