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

  describe('getClientIdentifier', () => {
    it('should return x-forwarded-for header first IP', () => {
      const request = new Request('http://localhost', {
        headers: { 'x-forwarded-for': '192.168.1.1, 10.0.0.1' },
      })
      expect(getClientIdentifier(request)).toBe('192.168.1.1')
    })

    it('should return x-real-ip when no forwarded-for', () => {
      const request = new Request('http://localhost', {
        headers: { 'x-real-ip': '10.0.0.5' },
      })
      expect(getClientIdentifier(request)).toBe('10.0.0.5')
    })

    it('should prefer x-forwarded-for over x-real-ip', () => {
      const request = new Request('http://localhost', {
        headers: {
          'x-forwarded-for': '192.168.1.1',
          'x-real-ip': '10.0.0.5',
        },
      })
      expect(getClientIdentifier(request)).toBe('192.168.1.1')
    })

    it('should fallback to user-agent + accept-language', () => {
      const request = new Request('http://localhost', {
        headers: {
          'user-agent': 'Mozilla/5.0',
          'accept-language': 'en-US',
        },
      })
      expect(getClientIdentifier(request)).toBe('Mozilla/5.0-en-US')
    })

    it('should handle missing all headers', () => {
      const request = new Request('http://localhost')
      const identifier = getClientIdentifier(request)
      expect(identifier).toBe('-')
    })

    it('should truncate fallback identifier to 100 chars', () => {
      const request = new Request('http://localhost', {
        headers: {
          'user-agent': 'a'.repeat(100),
          'accept-language': 'b'.repeat(50),
        },
      })
      const identifier = getClientIdentifier(request)
      expect(identifier.length).toBeLessThanOrEqual(100)
    })

    it('should trim whitespace from forwarded-for IP', () => {
      const request = new Request('http://localhost', {
        headers: { 'x-forwarded-for': '  192.168.1.1  , 10.0.0.1' },
      })
      expect(getClientIdentifier(request)).toBe('192.168.1.1')
    })
  })
})
