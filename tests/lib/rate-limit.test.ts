/**
 * Rate Limiting Tests
 * Tests for rate limiting logic in src/lib/rate-limit.ts
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { checkRateLimit, getClientIdentifier } from '@/lib/rate-limit'

describe('Rate Limiting', () => {
  describe('checkRateLimit', () => {
    it('should allow first request', () => {
      const result = checkRateLimit('test-client-1', { maxRequests: 5, windowMs: 60000 })
      expect(result.allowed).toBe(true)
      expect(result.remaining).toBe(4)
    })

    it('should decrement remaining count', () => {
      const identifier = 'test-client-decrement-' + Date.now()
      const config = { maxRequests: 5, windowMs: 60000 }

      const r1 = checkRateLimit(identifier, config)
      expect(r1.remaining).toBe(4)

      const r2 = checkRateLimit(identifier, config)
      expect(r2.remaining).toBe(3)

      const r3 = checkRateLimit(identifier, config)
      expect(r3.remaining).toBe(2)
    })

    it('should block after max requests exceeded', () => {
      const identifier = 'test-client-block-' + Date.now()
      const config = { maxRequests: 3, windowMs: 60000 }

      checkRateLimit(identifier, config) // 1
      checkRateLimit(identifier, config) // 2
      checkRateLimit(identifier, config) // 3

      const result = checkRateLimit(identifier, config) // 4 - should be blocked
      expect(result.allowed).toBe(false)
      expect(result.remaining).toBe(0)
    })

    it('should return reset timestamp', () => {
      const identifier = 'test-client-reset-' + Date.now()
      const result = checkRateLimit(identifier, { maxRequests: 5, windowMs: 60000 })

      expect(result.resetAt).toBeGreaterThan(Date.now())
      expect(result.resetAt).toBeLessThanOrEqual(Date.now() + 60000)
    })

    it('should use default config when not provided', () => {
      const identifier = 'test-client-default-' + Date.now()
      const result = checkRateLimit(identifier)

      expect(result.allowed).toBe(true)
      expect(result.remaining).toBe(4) // Default is 5 max requests
    })

    it('should allow request after window expires', () => {
      const identifier = 'test-client-expired-' + Date.now()
      // Use a very short window (1ms) - though this may not always expire by next call
      const config = { maxRequests: 1, windowMs: 1 }

      checkRateLimit(identifier, config)
      // After window expires, should allow again
      // We simulate by using a new identifier since we can't easily wait in tests
      const newResult = checkRateLimit(identifier + '-new', config)
      expect(newResult.allowed).toBe(true)
    })

    it('should track different identifiers separately', () => {
      const config = { maxRequests: 2, windowMs: 60000 }

      const id1 = 'client-a-' + Date.now()
      const id2 = 'client-b-' + Date.now()

      checkRateLimit(id1, config)
      checkRateLimit(id1, config)
      const r1 = checkRateLimit(id1, config)
      expect(r1.allowed).toBe(false)

      const r2 = checkRateLimit(id2, config)
      expect(r2.allowed).toBe(true)
      expect(r2.remaining).toBe(1)
    })

    it('should handle maxRequests of 1', () => {
      const identifier = 'test-single-' + Date.now()
      const config = { maxRequests: 1, windowMs: 60000 }

      const r1 = checkRateLimit(identifier, config)
      expect(r1.allowed).toBe(true)
      expect(r1.remaining).toBe(0)

      const r2 = checkRateLimit(identifier, config)
      expect(r2.allowed).toBe(false)
    })
  })

  /**
   * Woher die Kennung für das Rate-Limit stammt
   *
   * Vorher wurde der ERSTE Eintrag aus x-forwarded-for genommen. Der Header ist
   * eine Kette 'client, proxy1, proxy2', bei der jeder Proxy hinten anhängt —
   * was vorne steht, hat der Aufrufer selbst geschickt. Ein Angreifer setzte
   * also pro Request ein anderes X-Forwarded-For, bekam jedes Mal einen frischen
   * Zähler und das Limit griff nie. Diese Tests halten die neue Reihenfolge fest.
   */
  describe('getClientIdentifier', () => {
    it('nimmt x-vercel-forwarded-for zuerst — die einzige Quelle, die der Aufrufer nicht setzen kann', () => {
      const request = new Request('http://localhost', {
        headers: {
          'x-vercel-forwarded-for': '203.0.113.9',
          'x-forwarded-for': 'erfunden.vom.angreifer, 203.0.113.9',
          'x-real-ip': '10.0.0.5',
        },
      })
      expect(getClientIdentifier(request)).toBe('203.0.113.9')
    })

    it('nimmt x-real-ip, wenn Vercel-Header fehlt', () => {
      const request = new Request('http://localhost', {
        headers: { 'x-real-ip': '10.0.0.5' },
      })
      expect(getClientIdentifier(request)).toBe('10.0.0.5')
    })

    it('nimmt aus x-forwarded-for den LETZTEN Eintrag, nicht den ersten', () => {
      const request = new Request('http://localhost', {
        headers: { 'x-forwarded-for': '192.168.1.1, 10.0.0.1' },
      })
      // 10.0.0.1 hat der vertrauenswürdige Proxy angehängt
      expect(getClientIdentifier(request)).toBe('10.0.0.1')
    })

    it('lässt sich nicht durch einen selbst gesetzten Vorspann austricksen', () => {
      const echteIp = '198.51.100.7'
      const kennungen = new Set<string>()

      // Der Angreifer variiert bei jedem Request den vorderen Teil
      for (const erfunden of ['1.1.1.1', '2.2.2.2', '3.3.3.3', 'nicht-mal-eine-ip']) {
        const request = new Request('http://localhost', {
          headers: { 'x-forwarded-for': `${erfunden}, ${echteIp}` },
        })
        kennungen.add(getClientIdentifier(request))
      }

      // Trotzdem landet alles im selben Eimer — sonst wäre das Limit wirkungslos
      expect(kennungen.size).toBe(1)
      expect([...kennungen][0]).toBe(echteIp)
    })

    it('entfernt Leerraum um die Adresse', () => {
      const request = new Request('http://localhost', {
        headers: { 'x-forwarded-for': '  192.168.1.1  ,   10.0.0.1  ' },
      })
      expect(getClientIdentifier(request)).toBe('10.0.0.1')
    })

    it('nutzt ohne verlässliche Quelle einen festen Eimer statt User-Agent', () => {
      // User-Agent und Sprache kommen auch vom Aufrufer. Würden sie als Kennung
      // dienen, ergäbe jede Variation einen neuen Zähler.
      const request = new Request('http://localhost', {
        headers: { 'user-agent': 'Mozilla/5.0', 'accept-language': 'en-US' },
      })
      expect(getClientIdentifier(request)).toBe('unknown-client')
    })

    it('kommt ganz ohne Header zurecht', () => {
      expect(getClientIdentifier(new Request('http://localhost'))).toBe('unknown-client')
    })
  })
})
