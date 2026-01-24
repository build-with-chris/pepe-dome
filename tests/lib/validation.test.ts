/**
 * Validation Schema Tests
 * Tests for Zod validation schemas in src/lib/validation.ts
 */

import { describe, it, expect } from 'vitest'
import {
  subscriberSignupSchema,
  subscriberConfirmSchema,
  subscriberUnsubscribeSchema,
  createNewsletterSchema,
  updateNewsletterSchema,
  scheduleNewsletterSchema,
  addContentSchema,
  reorderContentSchema,
  paginationSchema,
  subscriberListSchema,
  adminCreateSubscriberSchema,
  adminUpdateSubscriberSchema,
  newsletterListSchema,
  contentFilterSchema,
} from '@/lib/validation'

describe('Validation Schemas', () => {
  describe('subscriberSignupSchema', () => {
    it('should accept valid email only', () => {
      const result = subscriberSignupSchema.safeParse({ email: 'test@example.com' })
      expect(result.success).toBe(true)
    })

    it('should accept email with firstName', () => {
      const result = subscriberSignupSchema.safeParse({
        email: 'test@example.com',
        firstName: 'Max',
      })
      expect(result.success).toBe(true)
    })

    it('should accept email with interests', () => {
      const result = subscriberSignupSchema.safeParse({
        email: 'test@example.com',
        interests: ['shows-events', 'workshops'],
      })
      expect(result.success).toBe(true)
    })

    it('should reject invalid email format', () => {
      const result = subscriberSignupSchema.safeParse({ email: 'invalid' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Invalid email format')
      }
    })

    it('should reject missing email', () => {
      const result = subscriberSignupSchema.safeParse({})
      expect(result.success).toBe(false)
    })

    it('should reject empty email', () => {
      const result = subscriberSignupSchema.safeParse({ email: '' })
      expect(result.success).toBe(false)
    })
  })

  describe('subscriberConfirmSchema', () => {
    it('should accept valid token', () => {
      const result = subscriberConfirmSchema.safeParse({ token: 'abc123' })
      expect(result.success).toBe(true)
    })

    it('should reject empty token', () => {
      const result = subscriberConfirmSchema.safeParse({ token: '' })
      expect(result.success).toBe(false)
    })

    it('should reject missing token', () => {
      const result = subscriberConfirmSchema.safeParse({})
      expect(result.success).toBe(false)
    })
  })

  describe('subscriberUnsubscribeSchema', () => {
    it('should accept valid email', () => {
      const result = subscriberUnsubscribeSchema.safeParse({ email: 'test@example.com' })
      expect(result.success).toBe(true)
    })

    it('should accept valid UUID id', () => {
      const result = subscriberUnsubscribeSchema.safeParse({
        id: '550e8400-e29b-41d4-a716-446655440000',
      })
      expect(result.success).toBe(true)
    })

    it('should reject when neither email nor id provided', () => {
      const result = subscriberUnsubscribeSchema.safeParse({})
      expect(result.success).toBe(false)
    })

    it('should accept both email and id', () => {
      const result = subscriberUnsubscribeSchema.safeParse({
        email: 'test@example.com',
        id: '550e8400-e29b-41d4-a716-446655440000',
      })
      expect(result.success).toBe(true)
    })

    it('should reject invalid UUID format', () => {
      const result = subscriberUnsubscribeSchema.safeParse({ id: 'not-a-uuid' })
      expect(result.success).toBe(false)
    })
  })

  describe('createNewsletterSchema', () => {
    it('should accept minimal valid data', () => {
      const result = createNewsletterSchema.safeParse({ subject: 'Test Newsletter' })
      expect(result.success).toBe(true)
    })

    it('should accept full valid data', () => {
      const result = createNewsletterSchema.safeParse({
        subject: 'Monthly Update',
        preheader: 'Check out what happened',
        introText: 'Welcome to our newsletter',
        heroImageUrl: '/images/hero.jpg',
        heroTitle: 'Big News',
        heroSubtitle: 'Exciting things happened',
        heroCTALabel: 'Read More',
        heroCTAUrl: 'https://example.com',
        createdBy: 'admin',
      })
      expect(result.success).toBe(true)
    })

    it('should reject empty subject', () => {
      const result = createNewsletterSchema.safeParse({ subject: '' })
      expect(result.success).toBe(false)
    })

    it('should reject subject longer than 200 chars', () => {
      const result = createNewsletterSchema.safeParse({ subject: 'a'.repeat(201) })
      expect(result.success).toBe(false)
    })

    it('should accept URL starting with /', () => {
      const result = createNewsletterSchema.safeParse({
        subject: 'Test',
        heroImageUrl: '/images/hero.jpg',
      })
      expect(result.success).toBe(true)
    })

    it('should accept URL starting with https://', () => {
      const result = createNewsletterSchema.safeParse({
        subject: 'Test',
        heroCTAUrl: 'https://example.com',
      })
      expect(result.success).toBe(true)
    })

    it('should reject invalid URL format', () => {
      const result = createNewsletterSchema.safeParse({
        subject: 'Test',
        heroImageUrl: 'invalid-url',
      })
      expect(result.success).toBe(false)
    })

    it('should accept empty string for optional URL fields', () => {
      const result = createNewsletterSchema.safeParse({
        subject: 'Test',
        heroImageUrl: '',
        heroCTAUrl: '',
      })
      expect(result.success).toBe(true)
    })
  })

  describe('updateNewsletterSchema', () => {
    it('should accept partial updates', () => {
      const result = updateNewsletterSchema.safeParse({ subject: 'Updated Subject' })
      expect(result.success).toBe(true)
    })

    it('should accept empty object (no updates)', () => {
      const result = updateNewsletterSchema.safeParse({})
      expect(result.success).toBe(true)
    })

    it('should accept nullable introText', () => {
      const result = updateNewsletterSchema.safeParse({ introText: null })
      expect(result.success).toBe(true)
    })

    it('should reject introText longer than 2000 chars', () => {
      const result = updateNewsletterSchema.safeParse({ introText: 'a'.repeat(2001) })
      expect(result.success).toBe(false)
    })
  })

  describe('scheduleNewsletterSchema', () => {
    it('should accept valid datetime string', () => {
      const result = scheduleNewsletterSchema.safeParse({
        scheduledAt: '2025-12-01T10:00:00.000Z',
      })
      expect(result.success).toBe(true)
    })

    it('should accept Date object', () => {
      const result = scheduleNewsletterSchema.safeParse({
        scheduledAt: new Date('2025-12-01'),
      })
      expect(result.success).toBe(true)
    })

    it('should reject invalid date string', () => {
      const result = scheduleNewsletterSchema.safeParse({
        scheduledAt: 'not-a-date',
      })
      expect(result.success).toBe(false)
    })

    it('should reject missing scheduledAt', () => {
      const result = scheduleNewsletterSchema.safeParse({})
      expect(result.success).toBe(false)
    })
  })

  describe('addContentSchema', () => {
    it('should accept valid content data', () => {
      const result = addContentSchema.safeParse({
        contentType: 'EVENT',
        contentId: '550e8400-e29b-41d4-a716-446655440000',
        orderPosition: 0,
      })
      expect(result.success).toBe(true)
    })

    it('should accept CUSTOM_SECTION without contentId', () => {
      const result = addContentSchema.safeParse({
        contentType: 'CUSTOM_SECTION',
        sectionHeading: 'Custom Heading',
        sectionDescription: 'Some description',
        orderPosition: 1,
      })
      expect(result.success).toBe(true)
    })

    it('should accept all content types', () => {
      const types = ['EVENT', 'ARTICLE', 'SHOW', 'CUSTOM_SECTION']
      types.forEach((type) => {
        const result = addContentSchema.safeParse({
          contentType: type,
          orderPosition: 0,
        })
        expect(result.success).toBe(true)
      })
    })

    it('should reject invalid content type', () => {
      const result = addContentSchema.safeParse({
        contentType: 'INVALID',
        orderPosition: 0,
      })
      expect(result.success).toBe(false)
    })

    it('should reject negative orderPosition', () => {
      const result = addContentSchema.safeParse({
        contentType: 'EVENT',
        orderPosition: -1,
      })
      expect(result.success).toBe(false)
    })
  })

  describe('reorderContentSchema', () => {
    it('should accept valid content reorder', () => {
      const result = reorderContentSchema.safeParse({
        content: [
          { contentType: 'EVENT', orderPosition: 0 },
          { contentType: 'ARTICLE', orderPosition: 1 },
        ],
      })
      expect(result.success).toBe(true)
    })

    it('should accept empty content array', () => {
      const result = reorderContentSchema.safeParse({ content: [] })
      expect(result.success).toBe(true)
    })

    it('should accept content with nullable fields', () => {
      const result = reorderContentSchema.safeParse({
        content: [
          {
            contentType: 'CUSTOM_SECTION',
            contentId: null,
            sectionHeading: 'Test',
            sectionDescription: null,
            orderPosition: 0,
          },
        ],
      })
      expect(result.success).toBe(true)
    })
  })

  describe('paginationSchema', () => {
    it('should accept valid page and limit', () => {
      const result = paginationSchema.safeParse({ page: 1, limit: 20 })
      expect(result.success).toBe(true)
    })

    it('should coerce string numbers', () => {
      const result = paginationSchema.safeParse({ page: '2', limit: '10' })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.page).toBe(2)
        expect(result.data.limit).toBe(10)
      }
    })

    it('should use defaults when not provided', () => {
      const result = paginationSchema.safeParse({})
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.page).toBe(1)
        expect(result.data.limit).toBe(20)
      }
    })

    it('should reject page less than 1', () => {
      const result = paginationSchema.safeParse({ page: 0 })
      expect(result.success).toBe(false)
    })

    it('should reject limit greater than 100', () => {
      const result = paginationSchema.safeParse({ limit: 101 })
      expect(result.success).toBe(false)
    })
  })

  describe('subscriberListSchema', () => {
    it('should accept valid status filter', () => {
      const result = subscriberListSchema.safeParse({ status: 'ACTIVE' })
      expect(result.success).toBe(true)
    })

    it('should accept all valid statuses', () => {
      const statuses = ['PENDING', 'ACTIVE', 'UNSUBSCRIBED', 'BOUNCED']
      statuses.forEach((status) => {
        const result = subscriberListSchema.safeParse({ status })
        expect(result.success).toBe(true)
      })
    })

    it('should reject invalid status', () => {
      const result = subscriberListSchema.safeParse({ status: 'INVALID' })
      expect(result.success).toBe(false)
    })

    it('should accept interests as comma-separated string', () => {
      const result = subscriberListSchema.safeParse({ interests: 'shows,workshops' })
      expect(result.success).toBe(true)
    })
  })

  describe('adminCreateSubscriberSchema', () => {
    it('should accept valid subscriber data', () => {
      const result = adminCreateSubscriberSchema.safeParse({
        email: 'admin@example.com',
        firstName: 'Admin',
        status: 'ACTIVE',
      })
      expect(result.success).toBe(true)
    })

    it('should default status to ACTIVE', () => {
      const result = adminCreateSubscriberSchema.safeParse({ email: 'test@example.com' })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.status).toBe('ACTIVE')
      }
    })

    it('should default skipConfirmation to true', () => {
      const result = adminCreateSubscriberSchema.safeParse({ email: 'test@example.com' })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.skipConfirmation).toBe(true)
      }
    })

    it('should only accept PENDING or ACTIVE status', () => {
      const result = adminCreateSubscriberSchema.safeParse({
        email: 'test@example.com',
        status: 'UNSUBSCRIBED',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('adminUpdateSubscriberSchema', () => {
    it('should accept partial updates', () => {
      const result = adminUpdateSubscriberSchema.safeParse({ firstName: 'Updated' })
      expect(result.success).toBe(true)
    })

    it('should accept status update', () => {
      const result = adminUpdateSubscriberSchema.safeParse({ status: 'BOUNCED' })
      expect(result.success).toBe(true)
    })

    it('should accept interests update', () => {
      const result = adminUpdateSubscriberSchema.safeParse({
        interests: ['shows-events'],
      })
      expect(result.success).toBe(true)
    })
  })

  describe('newsletterListSchema', () => {
    it('should accept valid newsletter status filter', () => {
      const statuses = ['DRAFT', 'SCHEDULED', 'SENDING', 'SENT']
      statuses.forEach((status) => {
        const result = newsletterListSchema.safeParse({ status })
        expect(result.success).toBe(true)
      })
    })

    it('should include pagination defaults', () => {
      const result = newsletterListSchema.safeParse({})
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.page).toBe(1)
        expect(result.data.limit).toBe(20)
      }
    })
  })

  describe('contentFilterSchema', () => {
    it('should accept valid date range', () => {
      const result = contentFilterSchema.safeParse({
        startDate: '2025-01-01',
        endDate: '2025-12-31',
      })
      expect(result.success).toBe(true)
    })

    it('should accept category filter', () => {
      const result = contentFilterSchema.safeParse({ category: 'SHOW' })
      expect(result.success).toBe(true)
    })

    it('should accept comma-separated tags', () => {
      const result = contentFilterSchema.safeParse({ tags: 'comedy,music,dance' })
      expect(result.success).toBe(true)
    })

    it('should accept empty object', () => {
      const result = contentFilterSchema.safeParse({})
      expect(result.success).toBe(true)
    })
  })
})
