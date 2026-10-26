import { describe, it, expect } from 'vitest'
import { poolConfig } from '@/lib/prisma'

const POOLER = 'postgresql://user:pw@aws-0-eu.pooler.supabase.com:6543/postgres?sslmode=require'
const DIREKT = 'postgresql://user:pw@db.example.supabase.co:5432/postgres'

describe('poolConfig', () => {
  it('begrenzt auf Vercel auf eine Verbindung', () => {
    expect(poolConfig(POOLER, true).pool.max).toBe(1)
    expect(poolConfig(DIREKT, true).pool.max).toBe(1)
  })

  it('übernimmt connection_limit aus der URL und entfernt ihn dort', () => {
    const { pool } = poolConfig(`${POOLER}&connection_limit=3`, true)
    expect(pool.max).toBe(3)
    expect(new URL(pool.connectionString!).searchParams.has('connection_limit')).toBe(false)
  })

  it('lässt lokal ohne connection_limit die Standardgröße von pg', () => {
    expect(poolConfig(DIREKT, false).pool.max).toBeUndefined()
  })

  it('entfernt pgbouncer und reicht schema an den Adapter weiter', () => {
    const { pool, schema } = poolConfig(`${POOLER}&pgbouncer=true&schema=public`, false)
    const u = new URL(pool.connectionString!)
    expect(u.searchParams.has('pgbouncer')).toBe(false)
    expect(u.searchParams.has('schema')).toBe(false)
    expect(schema).toBe('public')
  })

  it('behält bei sslmode=require die libpq-Bedeutung', () => {
    const u = new URL(poolConfig(POOLER, false).pool.connectionString!)
    expect(u.searchParams.get('sslmode')).toBe('require')
    expect(u.searchParams.get('uselibpqcompat')).toBe('true')
  })

  it('lässt eine URL ohne SSL-Angabe unverändert', () => {
    expect(poolConfig(DIREKT, false).pool.connectionString).toBe(DIREKT)
  })
})
