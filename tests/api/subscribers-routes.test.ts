/**
 * Subscriber API Route Handler Tests
 * Direct tests for subscriber route handlers without needing a running server
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { SubscriberStatus } from '@prisma/client'
import { POST } from '@/app/api/subscribers/route'
import { GET } from '@/app/api/subscribers/confirm/route'

// Mock email sending to avoid actual Resend calls
vi.mock('@/lib/email-send', () => ({
  sendConfirmationEmail: vi.fn().mockResolvedValue({ id: 'mock-id' }),
  sendWelcomeEmail: vi.fn().mockResolvedValue({ id: 'mock-id' }),
}))

describe('POST /api/subscribers', () => {
  it('should create a new subscriber with valid email', async () => {
    const request = new NextRequest('http://localhost:3000/api/subscribers', {
      method: 'POST',
      body: JSON.stringify({ email: 'route-test@example.com' }),
      headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '10.0.1.1' },
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(201)
    expect(body.data.email).toBe('route-test@example.com')
    expect(body.data.status).toBe('PENDING')
    expect(body.error).toBeNull()
  })

  it('should accept email with firstName and interests', async () => {
    const request = new NextRequest('http://localhost:3000/api/subscribers', {
      method: 'POST',
      body: JSON.stringify({
        email: 'full-signup@example.com',
        firstName: 'Max',
        interests: ['shows-events'],
      }),
      headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '10.0.2.1' },
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(201)
    expect(body.data.firstName).toBe('Max')
  })

  it('should reject invalid email format', async () => {
    const request = new NextRequest('http://localhost:3000/api/subscribers', {
      method: 'POST',
      body: JSON.stringify({ email: 'not-an-email' }),
      headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '10.0.3.1' },
    })

    const response = await POST(request)
    expect(response.status).toBe(400)
  })

  it('should reject empty email', async () => {
    const request = new NextRequest('http://localhost:3000/api/subscribers', {
      method: 'POST',
      body: JSON.stringify({ email: '' }),
      headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '10.0.3.2' },
    })

    const response = await POST(request)
    expect(response.status).toBe(400)
  })

  it('should reject duplicate active subscriber', async () => {
    await prisma.subscriber.create({
      data: {
        email: 'duplicate-active@example.com',
        status: SubscriberStatus.ACTIVE,
        confirmedAt: new Date(),
      },
    })

    const request = new NextRequest('http://localhost:3000/api/subscribers', {
      method: 'POST',
      body: JSON.stringify({ email: 'duplicate-active@example.com' }),
      headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '10.0.4.1' },
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body.error.code).toBe('ALREADY_SUBSCRIBED')
  })

  it('should reject pending subscriber', async () => {
    await prisma.subscriber.create({
      data: {
        email: 'pending-dup@example.com',
        status: SubscriberStatus.PENDING,
        doubleOptInToken: 'some-token',
      },
    })

    const request = new NextRequest('http://localhost:3000/api/subscribers', {
      method: 'POST',
      body: JSON.stringify({ email: 'pending-dup@example.com' }),
      headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '10.0.5.1' },
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body.error.code).toBe('CONFIRMATION_PENDING')
  })

  it('should reject previously unsubscribed email', async () => {
    await prisma.subscriber.create({
      data: {
        email: 'unsub-dup@example.com',
        status: SubscriberStatus.UNSUBSCRIBED,
        unsubscribedAt: new Date(),
      },
    })

    const request = new NextRequest('http://localhost:3000/api/subscribers', {
      method: 'POST',
      body: JSON.stringify({ email: 'unsub-dup@example.com' }),
      headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '10.0.6.1' },
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body.error.code).toBe('PREVIOUSLY_UNSUBSCRIBED')
  })

  it('should include rate limit headers', async () => {
    const request = new NextRequest('http://localhost:3000/api/subscribers', {
      method: 'POST',
      body: JSON.stringify({ email: 'rate-limit-test@example.com' }),
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '192.168.99.99',
      },
    })

    const response = await POST(request)
    expect(response.headers.get('X-RateLimit-Limit')).toBe('5')
    expect(response.headers.get('X-RateLimit-Remaining')).toBeDefined()
  })

  it('should not expose doubleOptInToken in response', async () => {
    const request = new NextRequest('http://localhost:3000/api/subscribers', {
      method: 'POST',
      body: JSON.stringify({ email: 'no-token-exposed@example.com' }),
      headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '10.0.8.1' },
    })

    const response = await POST(request)
    const body = await response.json()

    expect(body.data.doubleOptInToken).toBeUndefined()
  })
})

describe('GET /api/subscribers/confirm', () => {
  it('should confirm subscriber with valid token', async () => {
    const subscriber = await prisma.subscriber.create({
      data: {
        email: 'confirm-route@example.com',
        status: SubscriberStatus.PENDING,
        doubleOptInToken: 'valid-confirm-token-123',
        doubleOptInSentAt: new Date(),
      },
    })

    const request = new NextRequest(
      'http://localhost:3000/api/subscribers/confirm?token=valid-confirm-token-123',
      { method: 'GET' }
    )

    const response = await GET(request)

    // Should redirect (302)
    expect(response.status).toBe(302)
    const location = response.headers.get('location')
    expect(location).toContain('success=true')
    expect(location).toContain('email=confirm-route%40example.com')

    // Verify database updated
    const updated = await prisma.subscriber.findUnique({
      where: { id: subscriber.id },
    })
    expect(updated?.status).toBe('ACTIVE')
    expect(updated?.confirmedAt).toBeDefined()
  })

  it('should redirect to error page for invalid token', async () => {
    const request = new NextRequest(
      'http://localhost:3000/api/subscribers/confirm?token=nonexistent-token',
      { method: 'GET' }
    )

    const response = await GET(request)

    expect(response.status).toBe(302)
    const location = response.headers.get('location')
    expect(location).toContain('success=false')
  })

  it('should reject missing token parameter', async () => {
    const request = new NextRequest(
      'http://localhost:3000/api/subscribers/confirm',
      { method: 'GET' }
    )

    const response = await GET(request)
    expect(response.status).toBe(400)
  })

  it('should reject empty token', async () => {
    const request = new NextRequest(
      'http://localhost:3000/api/subscribers/confirm?token=',
      { method: 'GET' }
    )

    const response = await GET(request)
    expect(response.status).toBe(400)
  })
})
