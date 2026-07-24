/**
 * Regressionstest für die DB-Schutzschranke.
 *
 * Reine Logik, kein Datenbankzugriff. Läuft daher auch ohne Test-DB
 * (z. B. mit leerer DATABASE_URL). Sichert ab, dass gehostete Anbieter
 * niemals als destruktives Ziel durchrutschen — auch nicht mit Override.
 */

import { describe, it, expect } from 'vitest'
import { evaluateDatabaseUrl, assertSafeTestDatabase } from './db-guard'

describe('evaluateDatabaseUrl', () => {
  it('sperrt die Produktions-Supabase', () => {
    const r = evaluateDatabaseUrl('postgresql://u:pw@db.wwawsyhykrbvfgvhqbev.supabase.co:5432/postgres')
    expect(r.safe).toBe(false)
    expect(r.hasDatabase).toBe(true)
  })

  it('sperrt gehostete Anbieter auch mit Override', () => {
    expect(evaluateDatabaseUrl('postgresql://u:pw@db.x.supabase.co:5432/postgres', true).safe).toBe(false)
    expect(evaluateDatabaseUrl('postgresql://u:pw@aws-0.pooler.supabase.com:6543/postgres', true).safe).toBe(false)
    expect(evaluateDatabaseUrl('postgresql://u:pw@ep-x.neon.tech:5432/db', true).safe).toBe(false)
  })

  it('erlaubt localhost', () => {
    expect(evaluateDatabaseUrl('postgresql://u:pw@localhost:5432/postgres').safe).toBe(true)
    expect(evaluateDatabaseUrl('postgresql://u:pw@127.0.0.1:5432/x').safe).toBe(true)
  })

  it('erlaubt Datenbanknamen, die als Test erkennbar sind', () => {
    expect(evaluateDatabaseUrl('postgresql://u:pw@db.example.com:5432/pepe_test').safe).toBe(true)
    expect(evaluateDatabaseUrl('postgresql://u:pw@db.example.com:5432/tests').safe).toBe(true)
  })

  it('erlaubt Fremd-Hosts nur mit explizitem Override', () => {
    const url = 'postgresql://u:pw@db.example.com:5432/pepe'
    expect(evaluateDatabaseUrl(url, false).safe).toBe(false)
    expect(evaluateDatabaseUrl(url, true).safe).toBe(true)
  })

  it('behandelt fehlende und kaputte URLs als nicht destruktiv', () => {
    expect(evaluateDatabaseUrl(undefined).hasDatabase).toBe(false)
    expect(evaluateDatabaseUrl('kaputt').safe).toBe(false)
  })
})

describe('assertSafeTestDatabase', () => {
  it('wirft bei einer Produktions-URL', () => {
    expect(() =>
      assertSafeTestDatabase({
        DATABASE_URL: 'postgresql://u:pw@db.wwawsyhykrbvfgvhqbev.supabase.co:5432/postgres',
      })
    ).toThrow(/ABGEBROCHEN/)
  })

  it('wirft nicht ohne DATABASE_URL (Prisma-Mock)', () => {
    expect(() => assertSafeTestDatabase({})).not.toThrow()
  })

  it('wirft nicht bei einer lokalen Test-DB', () => {
    expect(() =>
      assertSafeTestDatabase({
        DATABASE_URL: 'postgresql://u:pw@localhost:5432/pepe_test',
      })
    ).not.toThrow()
  })
})
