import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import type { PoolConfig } from 'pg'

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

  const { pool, schema } = poolConfig(process.env.DATABASE_URL as string)
  return new PrismaClient({
    adapter: new PrismaPg(pool, schema ? { schema } : undefined),
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

/**
 * Übersetzt die DATABASE_URL in die Pool-Einstellungen von node-postgres.
 *
 * Seit Prisma 7 baut nicht mehr die Prisma-Engine die Verbindung auf, sondern
 * der Treiber `pg`. Der kennt die Prisma-eigenen URL-Parameter nicht und würde
 * sie stillschweigend übergehen. Deshalb werden sie hier ausgelesen und aus der
 * URL entfernt:
 *
 * - `connection_limit` wird zur Poolgröße `max`.
 * - `schema` geht als Option an den Adapter.
 * - `pgbouncer` entfällt. Er schaltete in der Engine benannte Prepared
 *   Statements ab, `pg` nutzt ohnehin nur unbenannte.
 *
 * Auf Vercel höchstens eine Verbindung pro Funktion. Jede Vercel-Funktion ist
 * eine eigene Instanz, und während eines Newsletter-Versands laufen Hunderte
 * Webhooks gleichzeitig. Mit mehreren Verbindungen je Instanz war das mehr, als
 * der Pooler von Supabase hergibt: Im Oktober 2026 bekam der Versand 60 Sekunden
 * lang keine Verbindung und brach ab. Steht connection_limit schon in der URL,
 * gilt dieser Wert.
 *
 * `sslmode=require` behandelt `pg` als `verify-full` und prüft das Zertifikat
 * gegen die öffentlichen CAs. Supabase signiert mit einer eigenen CA, die
 * Verbindung bräche ab. `uselibpqcompat=true` stellt die libpq-Bedeutung her:
 * verschlüsselt, aber ohne Zertifikatsprüfung. So hat sich die Prisma-Engine
 * vorher auch verhalten.
 */
export function poolConfig(
  url: string,
  istVercel = Boolean(process.env.VERCEL),
): { pool: PoolConfig; schema?: string } {
  let u: URL
  try {
    u = new URL(url)
  } catch {
    return { pool: { connectionString: url } }
  }

  const limit = Number(u.searchParams.get('connection_limit'))
  const schema = u.searchParams.get('schema') ?? undefined
  for (const key of ['connection_limit', 'schema', 'pgbouncer']) u.searchParams.delete(key)

  const sslmode = u.searchParams.get('sslmode')
  if ((sslmode === 'require' || sslmode === 'prefer') && !u.searchParams.has('uselibpqcompat')) {
    u.searchParams.set('uselibpqcompat', 'true')
  }

  const pool: PoolConfig = { connectionString: u.toString() }
  if (limit > 0) pool.max = limit
  else if (istVercel) pool.max = 1

  return { pool, schema }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

// Cache the Prisma instance globally to avoid exhausting DB connections
// in both development (hot-reload) and production (serverless).
globalForPrisma.prisma = prisma

export default prisma
