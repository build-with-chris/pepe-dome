/**
 * API Response Utility Tests
 * Tests for standardized API response functions
 */

import { describe, it, expect } from 'vitest'
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  addRateLimitHeaders,
} from '@/lib/api-response'

describe('API Response Utilities', () => {
  describe('successResponse', () => {
    it('should create a success response with data', async () => {
      const response = successResponse({ id: '123', name: 'Test' })
      const body = await response.json()

      expect(response.status).toBe(200)
      expect(body.data).toEqual({ id: '123', name: 'Test' })
      expect(body.error).toBeNull()
    })

    it('should accept custom status code', async () => {
      const response = successResponse({ created: true }, undefined, 201)
      expect(response.status).toBe(201)
    })

    it('should include meta data when provided', async () => {
      const meta = {
        pagination: { page: 1, limit: 10, total: 50, totalPages: 5 },
      }
      const response = successResponse([1, 2, 3], meta)
      const body = await response.json()

      expect(body.meta).toEqual(meta)
    })

    it('should handle null data', async () => {
      const response = successResponse(null)
      const body = await response.json()

      expect(body.data).toBeNull()
      expect(body.error).toBeNull()
    })

    it('should handle array data', async () => {
      const items = [{ id: 1 }, { id: 2 }]
      const response = successResponse(items)
      const body = await response.json()

      expect(body.data).toEqual(items)
    })
  })

  describe('errorResponse', () => {
    it('should create error response with code and message', async () => {
      const response = errorResponse('NOT_FOUND', 'Resource not found', 404)
      const body = await response.json()

      expect(response.status).toBe(404)
      expect(body.data).toBeNull()
      expect(body.error.code).toBe('NOT_FOUND')
      expect(body.error.message).toBe('Resource not found')
    })

    it('should default to 400 status', async () => {
      const response = errorResponse('BAD_REQUEST', 'Invalid input')
      expect(response.status).toBe(400)
    })

    it('should include details when provided', async () => {
      const details = [
        { field: 'email', message: 'Invalid email' },
        { field: 'name', message: 'Required' },
      ]
      const response = errorResponse('VALIDATION_ERROR', 'Validation failed', 400, details)
      const body = await response.json()

      expect(body.error.details).toEqual(details)
    })

    it('should handle 500 server error', async () => {
      const response = errorResponse('SERVER_ERROR', 'Internal error', 500)
      expect(response.status).toBe(500)
    })
  })

  describe('validationErrorResponse', () => {
    it('should format Zod-style errors', async () => {
      const zodErrors = {
        issues: [
          { path: ['email'], message: 'Invalid email format' },
          { path: ['firstName'], message: 'Required' },
        ],
      }

      const response = validationErrorResponse(zodErrors)
      const body = await response.json()

      expect(response.status).toBe(400)
      expect(body.error.code).toBe('VALIDATION_ERROR')
      expect(body.error.message).toBe('Validation failed')
      expect(body.error.details).toEqual([
        { field: 'email', message: 'Invalid email format' },
        { field: 'firstName', message: 'Required' },
      ])
    })

    it('should handle nested paths', async () => {
      const zodErrors = {
        issues: [
          { path: ['address', 'city'], message: 'Required' },
        ],
      }

      const response = validationErrorResponse(zodErrors)
      const body = await response.json()

      expect(body.error.details[0].field).toBe('address.city')
    })

    it('should handle empty issues array', async () => {
      const zodErrors = { issues: [] }
      const response = validationErrorResponse(zodErrors)
      const body = await response.json()

      expect(body.error.details).toEqual([])
    })
  })

  describe('addRateLimitHeaders', () => {
    it('should add rate limit headers to response', () => {
      const originalResponse = Response.json({ data: 'test' })
      const resetAt = Date.now() + 3600000

      const response = addRateLimitHeaders(originalResponse, 5, 3, resetAt)

      expect(response.headers.get('X-RateLimit-Limit')).toBe('5')
      expect(response.headers.get('X-RateLimit-Remaining')).toBe('3')
      expect(response.headers.get('X-RateLimit-Reset')).toBe(new Date(resetAt).toISOString())
    })

    it('should preserve original status code', () => {
      const originalResponse = new Response(null, { status: 201 })
      const response = addRateLimitHeaders(originalResponse, 5, 4, Date.now() + 3600000)

      expect(response.status).toBe(201)
    })

    it('should preserve original response body', async () => {
      const originalResponse = Response.json({ data: 'preserved' })
      const response = addRateLimitHeaders(originalResponse, 5, 4, Date.now() + 3600000)
      const body = await response.json()

      expect(body.data).toBe('preserved')
    })

    it('should handle zero remaining', () => {
      const originalResponse = Response.json({ data: null })
      const response = addRateLimitHeaders(originalResponse, 5, 0, Date.now() + 3600000)

      expect(response.headers.get('X-RateLimit-Remaining')).toBe('0')
    })
  })
})
