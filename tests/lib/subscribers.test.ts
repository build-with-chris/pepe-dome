/**
 * Subscriber Management Tests
 * Tests for subscriber utility functions in src/lib/subscribers.ts
 */

import { describe, it, expect } from 'vitest'
import { prisma } from '@/lib/prisma'
import { SubscriberStatus } from '@prisma/client'
import {
  generateOptInToken,
  validateEmail,
  getActiveSubscribers,
  createSubscriber,
  confirmSubscriber,
  unsubscribeSubscriber,
  getSubscriberStats,
} from '@/lib/subscribers'

describe('Subscriber Management', () => {
  describe('generateOptInToken', () => {
    it('should generate a 64-character hex string', () => {
      const token = generateOptInToken()
      expect(token).toHaveLength(64) // 32 bytes = 64 hex chars
    })

    it('should generate unique tokens', () => {
      const token1 = generateOptInToken()
      const token2 = generateOptInToken()
      expect(token1).not.toBe(token2)
    })

    it('should only contain hex characters', () => {
      const token = generateOptInToken()
      expect(token).toMatch(/^[a-f0-9]+$/)
    })
  })

  describe('validateEmail', () => {
    it('should accept valid email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user.name@domain.co.uk')).toBe(true)
      expect(validateEmail('user+tag@example.org')).toBe(true)
    })

    it('should reject invalid email addresses', () => {
      expect(validateEmail('')).toBe(false)
      expect(validateEmail('invalid')).toBe(false)
      expect(validateEmail('@example.com')).toBe(false)
      expect(validateEmail('user@')).toBe(false)
      expect(validateEmail('user @domain.com')).toBe(false)
    })

    it('should reject emails with spaces', () => {
      expect(validateEmail('user name@domain.com')).toBe(false)
      expect(validateEmail('user@ domain.com')).toBe(false)
    })
  })

  describe('createSubscriber', () => {
    it('should create subscriber with PENDING status', async () => {
      const subscriber = await createSubscriber({
        email: 'new@example.com',
        firstName: 'Test',
      })

      expect(subscriber.email).toBe('new@example.com')
      expect(subscriber.firstName).toBe('Test')
      expect(subscriber.status).toBe(SubscriberStatus.PENDING)
      expect(subscriber.doubleOptInToken).toBeDefined()
      expect(subscriber.doubleOptInSentAt).toBeDefined()
    })

    it('should generate double opt-in token', async () => {
      const subscriber = await createSubscriber({ email: 'token@example.com' })
      expect(subscriber.doubleOptInToken).toHaveLength(64)
    })

    it('should store interests as array', async () => {
      const subscriber = await createSubscriber({
        email: 'interests@example.com',
        interests: ['shows-events', 'workshops'],
      })
      expect(subscriber.interests).toEqual(['shows-events', 'workshops'])
    })

    it('should default interests to empty array', async () => {
      const subscriber = await createSubscriber({ email: 'no-interests@example.com' })
      expect(subscriber.interests).toEqual([])
    })

    it('should reject duplicate emails', async () => {
      await createSubscriber({ email: 'dupe@example.com' })
      await expect(
        createSubscriber({ email: 'dupe@example.com' })
      ).rejects.toThrow()
    })
  })

  describe('confirmSubscriber', () => {
    it('should activate subscriber with valid token', async () => {
      const subscriber = await createSubscriber({ email: 'confirm-test@example.com' })
      const confirmed = await confirmSubscriber(subscriber.doubleOptInToken!)

      expect(confirmed.status).toBe(SubscriberStatus.ACTIVE)
      expect(confirmed.confirmedAt).toBeDefined()
      expect(confirmed.doubleOptInToken).toBeNull()
    })

    it('should return already active subscriber without changes', async () => {
      const subscriber = await createSubscriber({ email: 'already-active@example.com' })
      const token = subscriber.doubleOptInToken!

      // Manually set to active
      await prisma.subscriber.update({
        where: { id: subscriber.id },
        data: { status: SubscriberStatus.ACTIVE, confirmedAt: new Date() },
      })

      const result = await confirmSubscriber(token)
      expect(result.status).toBe(SubscriberStatus.ACTIVE)
    })

    it('should throw error for invalid token', async () => {
      await expect(
        confirmSubscriber('invalid-token-that-does-not-exist')
      ).rejects.toThrow('Invalid or expired confirmation token')
    })

    it('should throw error for expired token (older than 7 days)', async () => {
      const subscriber = await prisma.subscriber.create({
        data: {
          email: 'expired-token@example.com',
          status: SubscriberStatus.PENDING,
          doubleOptInToken: 'expired-token-123',
          doubleOptInSentAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
        },
      })

      await expect(
        confirmSubscriber('expired-token-123')
      ).rejects.toThrow('Confirmation token has expired')
    })
  })

  describe('unsubscribeSubscriber', () => {
    it('should unsubscribe by email', async () => {
      await prisma.subscriber.create({
        data: {
          email: 'unsub-email@example.com',
          status: SubscriberStatus.ACTIVE,
          confirmedAt: new Date(),
        },
      })

      const result = await unsubscribeSubscriber('unsub-email@example.com')
      expect(result.status).toBe(SubscriberStatus.UNSUBSCRIBED)
      expect(result.unsubscribedAt).toBeDefined()
    })

    it('should unsubscribe by ID', async () => {
      const subscriber = await prisma.subscriber.create({
        data: {
          email: 'unsub-id@example.com',
          status: SubscriberStatus.ACTIVE,
          confirmedAt: new Date(),
        },
      })

      const result = await unsubscribeSubscriber(subscriber.id)
      expect(result.status).toBe(SubscriberStatus.UNSUBSCRIBED)
    })

    it('should return already unsubscribed subscriber', async () => {
      await prisma.subscriber.create({
        data: {
          email: 'already-unsub@example.com',
          status: SubscriberStatus.UNSUBSCRIBED,
          unsubscribedAt: new Date(),
        },
      })

      const result = await unsubscribeSubscriber('already-unsub@example.com')
      expect(result.status).toBe(SubscriberStatus.UNSUBSCRIBED)
    })

    it('should throw error for non-existent subscriber', async () => {
      await expect(
        unsubscribeSubscriber('nonexistent@example.com')
      ).rejects.toThrow('Subscriber not found')
    })
  })

  describe('getActiveSubscribers', () => {
    it('should return only active subscribers', async () => {
      await prisma.subscriber.createMany({
        data: [
          { email: 'active1@example.com', status: SubscriberStatus.ACTIVE, confirmedAt: new Date() },
          { email: 'active2@example.com', status: SubscriberStatus.ACTIVE, confirmedAt: new Date() },
          { email: 'pending@example.com', status: SubscriberStatus.PENDING },
          { email: 'unsub@example.com', status: SubscriberStatus.UNSUBSCRIBED },
        ],
      })

      const active = await getActiveSubscribers()
      expect(active).toHaveLength(2)
      expect(active.every((s) => s.email.includes('active'))).toBe(true)
    })

    it('should return selected fields only', async () => {
      await prisma.subscriber.create({
        data: {
          email: 'fields@example.com',
          firstName: 'Test',
          status: SubscriberStatus.ACTIVE,
          confirmedAt: new Date(),
          interests: ['shows'],
        },
      })

      const [subscriber] = await getActiveSubscribers()
      expect(subscriber).toHaveProperty('id')
      expect(subscriber).toHaveProperty('email')
      expect(subscriber).toHaveProperty('firstName')
      expect(subscriber).toHaveProperty('interests')
    })

    it('should return empty array when no active subscribers', async () => {
      const active = await getActiveSubscribers()
      expect(active).toHaveLength(0)
    })
  })

  describe('getSubscriberStats', () => {
    it('should return correct counts', async () => {
      await prisma.subscriber.createMany({
        data: [
          { email: 's1@example.com', status: SubscriberStatus.ACTIVE, confirmedAt: new Date() },
          { email: 's2@example.com', status: SubscriberStatus.ACTIVE, confirmedAt: new Date() },
          { email: 's3@example.com', status: SubscriberStatus.PENDING },
          { email: 's4@example.com', status: SubscriberStatus.UNSUBSCRIBED },
        ],
      })

      const stats = await getSubscriberStats()
      expect(stats.total).toBe(4)
      expect(stats.active).toBe(2)
      expect(stats.pending).toBe(1)
      expect(stats.unsubscribed).toBe(1)
    })

    it('should return zeros when no subscribers exist', async () => {
      const stats = await getSubscriberStats()
      expect(stats).toEqual({ total: 0, active: 0, pending: 0, unsubscribed: 0 })
    })
  })
})
