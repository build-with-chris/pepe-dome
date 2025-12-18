import { describe, it, expect } from 'vitest'
import { prisma } from '../../src/lib/prisma'
import { SubscriberStatus } from '@prisma/client'

describe('Subscriber Model', () => {
  it('should create a subscriber with double opt-in token', async () => {
    const subscriber = await prisma.subscriber.create({
      data: {
        email: 'test@example.com',
        firstName: 'Test',
        status: SubscriberStatus.PENDING,
        doubleOptInToken: 'test-token-123',
        doubleOptInSentAt: new Date(),
      },
    })

    expect(subscriber.id).toBeDefined()
    expect(subscriber.email).toBe('test@example.com')
    expect(subscriber.status).toBe(SubscriberStatus.PENDING)
    expect(subscriber.doubleOptInToken).toBe('test-token-123')
    expect(subscriber.confirmedAt).toBeNull()
  })

  it('should enforce unique email constraint', async () => {
    await prisma.subscriber.create({
      data: {
        email: 'duplicate@example.com',
        status: SubscriberStatus.PENDING,
      },
    })

    await expect(
      prisma.subscriber.create({
        data: {
          email: 'duplicate@example.com',
          status: SubscriberStatus.PENDING,
        },
      })
    ).rejects.toThrow()
  })

  it('should store and retrieve interests as JSONB', async () => {
    const interests = ['shows_events', 'workshops_community']
    const subscriber = await prisma.subscriber.create({
      data: {
        email: 'interests@example.com',
        status: SubscriberStatus.ACTIVE,
        interests,
      },
    })

    const retrieved = await prisma.subscriber.findUnique({
      where: { id: subscriber.id },
    })

    expect(retrieved?.interests).toEqual(interests)
  })

  it('should transition from pending to active status', async () => {
    const subscriber = await prisma.subscriber.create({
      data: {
        email: 'pending@example.com',
        status: SubscriberStatus.PENDING,
        doubleOptInToken: 'token-456',
      },
    })

    const updated = await prisma.subscriber.update({
      where: { id: subscriber.id },
      data: {
        status: SubscriberStatus.ACTIVE,
        confirmedAt: new Date(),
        doubleOptInToken: null,
      },
    })

    expect(updated.status).toBe(SubscriberStatus.ACTIVE)
    expect(updated.confirmedAt).not.toBeNull()
    expect(updated.doubleOptInToken).toBeNull()
  })

  it('should track last open and click timestamps', async () => {
    const subscriber = await prisma.subscriber.create({
      data: {
        email: 'tracking@example.com',
        status: SubscriberStatus.ACTIVE,
      },
    })

    const openTime = new Date()
    await prisma.subscriber.update({
      where: { id: subscriber.id },
      data: { lastOpenAt: openTime },
    })

    const clickTime = new Date()
    await prisma.subscriber.update({
      where: { id: subscriber.id },
      data: { lastClickAt: clickTime },
    })

    const updated = await prisma.subscriber.findUnique({
      where: { id: subscriber.id },
    })

    expect(updated?.lastOpenAt).toEqual(openTime)
    expect(updated?.lastClickAt).toEqual(clickTime)
  })
})
