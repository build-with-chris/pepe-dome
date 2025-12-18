import '@testing-library/jest-dom'
import { afterAll, afterEach, beforeEach } from 'vitest'
import { prisma } from '../src/lib/prisma'

// Mock IntersectionObserver for Framer Motion
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return []
  }
  unobserve() {}
} as any

// Helper to clean database
async function cleanDatabase() {
  // Clean in correct order to respect foreign key constraints
  try {
    await prisma.newsletterEvent.deleteMany({})
    await prisma.newsletterStats.deleteMany({})
    await prisma.newsletterContent.deleteMany({})
    await prisma.articleEvent.deleteMany({})
    await prisma.newsletter.deleteMany({})
    await prisma.article.deleteMany({})
    await prisma.event.deleteMany({})
    await prisma.subscriber.deleteMany({})
    await prisma.testRecipient.deleteMany({})
  } catch (error) {
    // Ignore cleanup errors
    console.warn('Cleanup warning:', error)
  }
}

// Clean database before each test for isolation
beforeEach(async () => {
  await cleanDatabase()
})

// Clean up database after each test
afterEach(async () => {
  await cleanDatabase()
})

afterAll(async () => {
  await prisma.$disconnect()
})
