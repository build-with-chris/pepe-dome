import '@testing-library/jest-dom'
import { afterAll, afterEach, beforeEach } from 'vitest'
import { prisma } from '../src/lib/prisma'
import { assertSafeTestDatabase } from './db-guard'

// SICHERHEIT: Läuft beim Laden dieser Setup-Datei, also VOR jedem Test.
// Zeigt DATABASE_URL auf eine echte (z. B. Produktions-)Datenbank, wirft das
// hier und bricht den gesamten Lauf ab, bevor irgendein `deleteMany` läuft.
// Ergebnis merken: nur eine sichere, konfigurierte DB wird tatsächlich geräumt.
const dbGuard = assertSafeTestDatabase()

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
  // Ohne sichere, konfigurierte DB nichts löschen. Der Guard oben hätte einen
  // unsicheren Prod-Zugriff bereits abgebrochen; dieser Check schützt zusätzlich
  // den Fall "keine DB gesetzt" (Prisma-Mock), in dem Cleanup schlicht entfällt.
  if (!dbGuard.hasDatabase || !dbGuard.safe) {
    return
  }

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
  // Ohne DATABASE_URL ist `prisma` der Mock aus src/lib/prisma.ts und hat kein
  // $disconnect. Nur trennen, wenn es die Methode wirklich gibt.
  const disconnect = (prisma as { $disconnect?: () => Promise<void> }).$disconnect
  if (typeof disconnect === 'function') {
    await disconnect.call(prisma)
  }
})
