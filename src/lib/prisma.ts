import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const hasDatabaseUrl = process.env.DATABASE_URL

function createPrismaClient() {
  if (!hasDatabaseUrl) {
    // Return a mock client if DATABASE_URL is not set
    return {
      event: {
        findMany: () => Promise.resolve([]),
        findUnique: () => Promise.resolve(null),
      },
      article: {
        findMany: () => Promise.resolve([]),
        findUnique: () => Promise.resolve(null),
      },
      subscriber: {
        findMany: () => Promise.resolve([]),
        findUnique: () => Promise.resolve(null),
        findFirst: () => Promise.resolve(null),
        create: () => Promise.reject(new Error('DATABASE_URL not configured')),
        update: () => Promise.reject(new Error('DATABASE_URL not configured')),
        count: () => Promise.resolve(0),
      },
      newsletter: {
        findMany: () => Promise.resolve([]),
        findUnique: () => Promise.resolve(null),
        findFirst: () => Promise.resolve(null),
        create: () => Promise.reject(new Error('DATABASE_URL not configured')),
        update: () => Promise.reject(new Error('DATABASE_URL not configured')),
        delete: () => Promise.reject(new Error('DATABASE_URL not configured')),
        count: () => Promise.resolve(0),
      },
      newsletterContent: {
        createMany: () => Promise.reject(new Error('DATABASE_URL not configured')),
        deleteMany: () => Promise.reject(new Error('DATABASE_URL not configured')),
        update: () => Promise.reject(new Error('DATABASE_URL not configured')),
      },
      newsletterStats: {
        create: () => Promise.reject(new Error('DATABASE_URL not configured')),
      },
      $transaction: async (callback: any) => {
        console.warn('Prisma $transaction called without DATABASE_URL. Mocking transaction.')
        return callback({
          newsletterContent: {
            deleteMany: () => Promise.resolve({ count: 0 }),
            createMany: () => Promise.resolve({ count: 0 }),
            update: () => Promise.reject(new Error('DATABASE_URL not configured')),
          },
          newsletterStats: {
            create: () => Promise.reject(new Error('DATABASE_URL not configured')),
          },
          newsletter: {
            update: () => Promise.reject(new Error('DATABASE_URL not configured')),
          },
          subscriber: {
            update: () => Promise.reject(new Error('DATABASE_URL not configured')),
          },
        })
      },
    } as any
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: serverlessUrl(process.env.DATABASE_URL as string),
      },
    },
  })
}

/**
 * Auf Vercel höchstens eine Verbindung pro Funktion.
 *
 * Prisma öffnet sonst mehrere Verbindungen je Instanz (Anzahl CPUs mal zwei
 * plus eins). Jede Vercel-Funktion ist eine eigene Instanz, und während eines
 * Newsletter-Versands laufen Hunderte Webhooks gleichzeitig. Zusammen war das
 * mehr, als der Pooler von Supabase hergibt: Im Oktober 2026 bekam der
 * Versand 60 Sekunden lang keine Verbindung und brach ab.
 *
 * Eine Verbindung ist die übliche Empfehlung für Serverless hinter einem
 * Pooler. Steht connection_limit schon in der URL, gilt dieser Wert.
 */
export function serverlessUrl(url: string, istVercel = Boolean(process.env.VERCEL)): string {
  if (!istVercel) return url
  try {
    const u = new URL(url)
    if (!u.searchParams.has('connection_limit')) u.searchParams.set('connection_limit', '1')
    // Pooler im Transaction-Modus (Port 6543) verträgt keine Prepared Statements.
    if (u.port === '6543' && !u.searchParams.has('pgbouncer')) u.searchParams.set('pgbouncer', 'true')
    return u.toString()
  } catch {
    return url
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

// Cache the Prisma instance globally to avoid exhausting DB connections
// in both development (hot-reload) and production (serverless).
globalForPrisma.prisma = prisma

export default prisma
