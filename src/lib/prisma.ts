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
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
