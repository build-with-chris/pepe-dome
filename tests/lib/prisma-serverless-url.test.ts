import { describe, it, expect } from 'vitest'
import { serverlessUrl } from '@/lib/prisma'

const POOLER = 'postgresql://user:pw@aws-0-eu.pooler.supabase.com:6543/postgres?sslmode=require'
const DIREKT = 'postgresql://user:pw@db.example.supabase.co:5432/postgres'

describe('serverlessUrl', () => {
  it('begrenzt auf Vercel auf eine Verbindung und schaltet den Pooler-Modus an', () => {
    const u = new URL(serverlessUrl(POOLER, true))
    expect(u.searchParams.get('connection_limit')).toBe('1')
    expect(u.searchParams.get('pgbouncer')).toBe('true')
    expect(u.searchParams.get('sslmode')).toBe('require')
  })

  it('lässt einen ausdrücklich gesetzten Wert stehen', () => {
    const u = new URL(serverlessUrl(`${POOLER}&connection_limit=3`, true))
    expect(u.searchParams.get('connection_limit')).toBe('3')
  })

  it('setzt pgbouncer nur beim Pooler-Port', () => {
    const u = new URL(serverlessUrl(DIREKT, true))
    expect(u.searchParams.get('connection_limit')).toBe('1')
    expect(u.searchParams.has('pgbouncer')).toBe(false)
  })

  it('ändert lokal nichts', () => {
    expect(serverlessUrl(POOLER, false)).toBe(POOLER)
  })
})
