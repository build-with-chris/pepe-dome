/**
 * Subscriber management utilities
 */

import { prisma } from './prisma'
import { SubscriberStatus, Prisma } from '@prisma/client'
import crypto from 'crypto'

/**
 * Generate a secure token for double opt-in
 */
export function generateOptInToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Dauerhaftes Geheimnis für den Abmeldelink.
 *
 * Getrennt vom Opt-in-Token, weil dieses hier nicht verfällt und nach der
 * Bestätigung nicht gelöscht wird: Der Abmeldelink muss auch in einer zwei
 * Jahre alten Mail noch funktionieren.
 */
export function generateUnsubscribeToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Get active subscribers, optionally filtered by interests
 */
export async function getActiveSubscribers(interests?: string[]) {
  const where: Prisma.SubscriberWhereInput = {
    status: SubscriberStatus.ACTIVE,
  }

  // If interests provided, filter by them
  if (interests && interests.length > 0) {
    where.OR = interests.map((interest) => ({
      interests: {
        path: '$',
        array_contains: interest,
      },
    }))
  }

  return await prisma.subscriber.findMany({
    where,
    select: {
      id: true,
      email: true,
      firstName: true,
      interests: true,
    },
  })
}

/**
 * Create a new subscriber with pending status
 */
export async function createSubscriber(data: {
  email: string
  firstName?: string
  interests?: string[]
}) {
  const token = generateOptInToken()

  return await prisma.subscriber.create({
    data: {
      email: data.email,
      firstName: data.firstName,
      interests: data.interests || [],
      status: SubscriberStatus.PENDING,
      doubleOptInToken: token,
      doubleOptInSentAt: new Date(),
      unsubscribeToken: generateUnsubscribeToken(),
    },
  })
}

/**
 * Confirm a subscriber's email address
 */
export async function confirmSubscriber(token: string) {
  const subscriber = await prisma.subscriber.findUnique({
    where: { doubleOptInToken: token },
  })

  if (!subscriber) {
    throw new Error('Invalid or expired confirmation token')
  }

  if (subscriber.status === SubscriberStatus.ACTIVE) {
    return subscriber // Already confirmed
  }

  // Check if token is not too old (e.g., 7 days)
  const tokenAge = Date.now() - (subscriber.doubleOptInSentAt?.getTime() || 0)
  const maxAge = 7 * 24 * 60 * 60 * 1000 // 7 days
  if (tokenAge > maxAge) {
    throw new Error('Confirmation token has expired')
  }

  return await prisma.subscriber.update({
    where: { id: subscriber.id },
    data: {
      status: SubscriberStatus.ACTIVE,
      confirmedAt: new Date(),
      doubleOptInToken: null, // Clear token after use
    },
  })
}

/**
 * Unsubscribe a subscriber
 */
export async function unsubscribeSubscriber(token: string) {
  // Ausschliesslich über das Token. Vorher suchte diese Funktion per
  // OR: [{ email }, { id }] — damit genügte die bloße Kenntnis einer fremden
  // Adresse, um sie auszutragen, und der komplette Verteiler war mit einer
  // Adressliste leerräumbar.
  if (!token) {
    throw new Error('Missing unsubscribe token')
  }

  const subscriber = await prisma.subscriber.findUnique({
    where: { unsubscribeToken: token },
  })

  if (!subscriber) {
    throw new Error('Subscriber not found')
  }

  if (subscriber.status === SubscriberStatus.UNSUBSCRIBED) {
    return subscriber // Already unsubscribed
  }

  return await prisma.subscriber.update({
    where: { id: subscriber.id },
    data: {
      status: SubscriberStatus.UNSUBSCRIBED,
      unsubscribedAt: new Date(),
    },
  })
}

/**
 * Get subscriber statistics
 */
export async function getSubscriberStats() {
  const [total, active, pending, unsubscribed] = await Promise.all([
    prisma.subscriber.count(),
    prisma.subscriber.count({ where: { status: SubscriberStatus.ACTIVE } }),
    prisma.subscriber.count({ where: { status: SubscriberStatus.PENDING } }),
    prisma.subscriber.count({ where: { status: SubscriberStatus.UNSUBSCRIBED } }),
  ])

  return {
    total,
    active,
    pending,
    unsubscribed,
  }
}
