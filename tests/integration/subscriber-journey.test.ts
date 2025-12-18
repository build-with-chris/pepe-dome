/**
 * Integration Test: Complete Subscriber Journey
 *
 * Tests the full end-to-end flow from signup to unsubscribe
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { prisma } from '@/lib/prisma'
import { sendConfirmationEmail, sendWelcomeEmail, sendNewsletter } from '@/lib/email-send'
import { POST as signupPOST } from '@/app/api/subscribers/route'
import { GET as confirmGET } from '@/app/api/subscribers/confirm/route'
import { POST as unsubscribePOST } from '@/app/api/subscribers/unsubscribe/route'
import { NextRequest } from 'next/server'

describe('Integration: Complete Subscriber Journey', () => {
  const testEmail = 'journey-test@example.com'
  let subscriberId: string
  let confirmToken: string

  beforeEach(async () => {
    // Clean up any existing test data
    await prisma.subscriber.deleteMany({
      where: { email: testEmail },
    })
  })

  it('should complete full subscriber lifecycle', async () => {
    // STEP 1: User signs up via form
    const signupRequest = new NextRequest('http://localhost:3000/api/subscribers', {
      method: 'POST',
      body: JSON.stringify({
        email: testEmail,
        firstName: 'Integration',
        interests: ['Shows & Events'],
      }),
    })

    const signupResponse = await signupPOST(signupRequest)
    expect(signupResponse.status).toBe(201)

    const signupData = await signupResponse.json()
    expect(signupData.success).toBe(true)

    // Verify subscriber created with PENDING status
    const pendingSubscriber = await prisma.subscriber.findUnique({
      where: { email: testEmail },
    })

    expect(pendingSubscriber).toBeTruthy()
    expect(pendingSubscriber!.status).toBe('PENDING')
    expect(pendingSubscriber!.doubleOptInToken).toBeTruthy()
    expect(pendingSubscriber!.firstName).toBe('Integration')

    subscriberId = pendingSubscriber!.id
    confirmToken = pendingSubscriber!.doubleOptInToken!

    // STEP 2: Confirmation email sent (simulated)
    // In production, this would be triggered by signup endpoint
    // For testing, we verify the function works
    const confirmEmailResult = await sendConfirmationEmail(subscriberId)
    expect(confirmEmailResult.error).toBeUndefined()

    // STEP 3: User clicks confirmation link
    const confirmRequest = new NextRequest(
      `http://localhost:3000/api/subscribers/confirm?token=${confirmToken}`,
      { method: 'GET' }
    )

    const confirmResponse = await confirmGET(confirmRequest)
    // API redirects to success page
    expect(confirmResponse.status).toBe(302)

    // Verify subscriber now ACTIVE
    const activeSubscriber = await prisma.subscriber.findUnique({
      where: { id: subscriberId },
    })

    expect(activeSubscriber!.status).toBe('ACTIVE')
    expect(activeSubscriber!.confirmedAt).toBeTruthy()
    expect(activeSubscriber!.doubleOptInToken).toBeNull()

    // STEP 4: Welcome email sent
    const welcomeEmailResult = await sendWelcomeEmail(subscriberId)
    expect(welcomeEmailResult.error).toBeUndefined()

    // STEP 5: Create and send a newsletter
    const newsletter = await prisma.newsletter.create({
      data: {
        slug: 'integration-test-newsletter',
        subject: 'Integration Test Newsletter',
        status: 'DRAFT',
      },
    })

    // Send newsletter to subscriber
    const sendResult = await sendNewsletter(newsletter.id, {
      testRecipients: [testEmail],
      dryRun: true, // Don't actually send in tests
    })

    expect(sendResult.success).toBeGreaterThan(0)
    expect(sendResult.total).toBe(1)

    // STEP 6: User clicks unsubscribe
    const unsubscribeRequest = new NextRequest(
      'http://localhost:3000/api/subscribers/unsubscribe',
      {
        method: 'POST',
        body: JSON.stringify({
          subscriberId,
        }),
      }
    )

    const unsubscribeResponse = await unsubscribePOST(unsubscribeRequest)
    expect(unsubscribeResponse.status).toBe(200)

    // Verify subscriber unsubscribed
    const unsubscribedSubscriber = await prisma.subscriber.findUnique({
      where: { id: subscriberId },
    })

    expect(unsubscribedSubscriber!.status).toBe('UNSUBSCRIBED')
    expect(unsubscribedSubscriber!.unsubscribedAt).toBeTruthy()

    // STEP 7: Verify unsubscribed user doesn't receive newsletters
    const secondNewsletter = await prisma.newsletter.create({
      data: {
        slug: 'second-integration-test-newsletter',
        subject: 'Second Test Newsletter',
        status: 'DRAFT',
      },
    })

    const secondSendResult = await sendNewsletter(secondNewsletter.id, {
      dryRun: true,
    })

    // Should be 0 recipients because subscriber is unsubscribed
    expect(secondSendResult.total).toBe(0)
  })

  it('should handle invalid confirmation token', async () => {
    // Create pending subscriber
    const subscriber = await prisma.subscriber.create({
      data: {
        email: 'invalid-token-test@example.com',
        status: 'PENDING',
        doubleOptInToken: 'valid-token-123',
      },
    })

    // Try to confirm with invalid token
    const confirmRequest = new NextRequest(
      'http://localhost:3000/api/subscribers/confirm?token=invalid-token',
      { method: 'GET' }
    )

    const confirmResponse = await confirmGET(confirmRequest)
    // API redirects to error page even on invalid token
    expect(confirmResponse.status).toBe(302)

    // Verify subscriber still PENDING
    const stillPending = await prisma.subscriber.findUnique({
      where: { id: subscriber.id },
    })

    expect(stillPending!.status).toBe('PENDING')
    expect(stillPending!.confirmedAt).toBeNull()
  })

  it('should prevent duplicate email signups', async () => {
    // First signup
    const firstRequest = new NextRequest('http://localhost:3000/api/subscribers', {
      method: 'POST',
      body: JSON.stringify({
        email: testEmail,
      }),
    })

    const firstResponse = await signupPOST(firstRequest)
    expect(firstResponse.status).toBe(201)

    // Second signup with same email
    const secondRequest = new NextRequest('http://localhost:3000/api/subscribers', {
      method: 'POST',
      body: JSON.stringify({
        email: testEmail,
      }),
    })

    const secondResponse = await signupPOST(secondRequest)
    expect(secondResponse.status).toBe(400)

    const errorData = await secondResponse.json()
    expect(errorData.error).toContain('already')
  })
})
