/**
 * Subscriber API Tests
 * Tests for subscriber signup, confirmation, unsubscribe, and admin list endpoints
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { prisma } from '../../src/lib/prisma'
import { generateOptInToken } from '../../src/lib/subscribers'

describe('Subscriber API', () => {
  describe('POST /api/subscribers (signup)', () => {
    it('should create a new subscriber with valid email', async () => {
      const response = await fetch('http://localhost:3000/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          firstName: 'Test User',
        }),
      })

      expect(response.status).toBe(201)
      const data = await response.json()
      expect(data.data).toBeDefined()
      expect(data.data.email).toBe('test@example.com')
      expect(data.data.status).toBe('PENDING')
    })

    it('should reject invalid email format', async () => {
      const response = await fetch('http://localhost:3000/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'invalid-email' }),
      })

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toBeDefined()
    })

    it('should reject duplicate email', async () => {
      const email = 'duplicate@example.com'
      await prisma.subscriber.create({
        data: {
          email,
          status: 'ACTIVE',
          doubleOptInToken: generateOptInToken(),
        },
      })

      const response = await fetch('http://localhost:3000/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      expect(response.status).toBe(400)
    })
  })

  describe('GET /api/subscribers/confirm (double opt-in)', () => {
    it('should confirm subscriber with valid token', async () => {
      const token = generateOptInToken()
      await prisma.subscriber.create({
        data: {
          email: 'confirm@example.com',
          status: 'PENDING',
          doubleOptInToken: token,
          doubleOptInSentAt: new Date(),
        },
      })

      const response = await fetch(
        `http://localhost:3000/api/subscribers/confirm?token=${token}`
      )

      expect(response.status).toBe(200)
      const subscriber = await prisma.subscriber.findFirst({
        where: { email: 'confirm@example.com' },
      })
      expect(subscriber?.status).toBe('ACTIVE')
      expect(subscriber?.confirmedAt).toBeDefined()
    })

    it('should reject invalid token', async () => {
      const response = await fetch(
        'http://localhost:3000/api/subscribers/confirm?token=invalid-token'
      )

      expect(response.status).toBe(404)
    })
  })

  describe('POST /api/subscribers/unsubscribe', () => {
    it('should unsubscribe active subscriber', async () => {
      const subscriber = await prisma.subscriber.create({
        data: {
          email: 'unsubscribe@example.com',
          status: 'ACTIVE',
          confirmedAt: new Date(),
        },
      })

      const response = await fetch('http://localhost:3000/api/subscribers/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: subscriber.email }),
      })

      expect(response.status).toBe(200)
      const updated = await prisma.subscriber.findUnique({
        where: { id: subscriber.id },
      })
      expect(updated?.status).toBe('UNSUBSCRIBED')
      expect(updated?.unsubscribedAt).toBeDefined()
    })
  })

  describe('GET /api/admin/subscribers (admin list)', () => {
    beforeEach(async () => {
      // Create test subscribers
      await prisma.subscriber.createMany({
        data: [
          {
            email: 'active1@example.com',
            status: 'ACTIVE',
            confirmedAt: new Date(),
          },
          {
            email: 'active2@example.com',
            status: 'ACTIVE',
            confirmedAt: new Date(),
          },
          {
            email: 'pending@example.com',
            status: 'PENDING',
            doubleOptInToken: generateOptInToken(),
          },
        ],
      })
    })

    it('should return paginated subscriber list', async () => {
      const response = await fetch(
        'http://localhost:3000/api/admin/subscribers?page=1&limit=10'
      )

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.data).toBeDefined()
      expect(data.meta.pagination).toBeDefined()
      expect(data.meta.pagination.total).toBeGreaterThan(0)
    })

    it('should filter by status', async () => {
      const response = await fetch(
        'http://localhost:3000/api/admin/subscribers?status=ACTIVE'
      )

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.data.every((s: any) => s.status === 'ACTIVE')).toBe(true)
    })
  })
})
