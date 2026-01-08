/**
 * Validation schemas using Zod
 */

import { z } from 'zod'

// Subscriber validation schemas
export const subscriberSignupSchema = z.object({
  email: z.string().email('Invalid email format'),
  firstName: z.string().optional(),
  interests: z.array(z.string()).optional(),
})

export const subscriberConfirmSchema = z.object({
  token: z.string().min(1, 'Token is required'),
})

export const subscriberUnsubscribeSchema = z.object({
  email: z.string().email('Invalid email format').optional(),
  id: z.string().uuid().optional(),
}).refine((data) => data.email || data.id, {
  message: 'Either email or id must be provided',
})

// Helper for URL or path validation (allows /path or https://...)
const urlOrPathSchema = z.string().refine(
  (val) => val === '' || val.startsWith('/') || val.startsWith('http://') || val.startsWith('https://'),
  { message: 'Must be a valid URL or path starting with /' }
).optional().or(z.literal(''))

// Newsletter validation schemas
export const createNewsletterSchema = z.object({
  subject: z.string().min(1, 'Subject is required').max(200),
  preheader: z.string().max(200).optional(),
  introText: z.string().max(2000).optional(),
  heroImageUrl: urlOrPathSchema,
  heroTitle: z.string().max(100).optional(),
  heroSubtitle: z.string().max(200).optional(),
  heroCTALabel: z.string().max(50).optional(),
  heroCTAUrl: urlOrPathSchema,
  createdBy: z.string().optional(),
})

export const updateNewsletterSchema = z.object({
  subject: z.string().min(1).max(200).optional(),
  preheader: z.string().max(200).optional(),
  introText: z.string().max(2000).optional().nullable(),
  heroImageUrl: urlOrPathSchema,
  heroTitle: z.string().max(100).optional(),
  heroSubtitle: z.string().max(200).optional(),
  heroCTALabel: z.string().max(50).optional(),
  heroCTAUrl: urlOrPathSchema,
})

export const scheduleNewsletterSchema = z.object({
  scheduledAt: z.string().datetime().or(z.date()),
})

export const addContentSchema = z.object({
  contentType: z.enum(['EVENT', 'ARTICLE', 'SHOW', 'CUSTOM_SECTION']),
  contentId: z.string().uuid().optional(),
  sectionHeading: z.string().max(100).optional(),
  sectionDescription: z.string().max(500).optional(),
  orderPosition: z.number().int().min(0),
})

export const reorderContentSchema = z.object({
  content: z.array(
    z.object({
      id: z.string().uuid().optional(),
      contentType: z.enum(['EVENT', 'ARTICLE', 'SHOW', 'CUSTOM_SECTION']),
      contentId: z.string().nullable().optional(),
      sectionHeading: z.string().max(100).nullable().optional(),
      sectionDescription: z.string().max(500).nullable().optional(),
      orderPosition: z.number().int().min(0),
    })
  ),
})

// Query parameter schemas
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

export const subscriberListSchema = paginationSchema.extend({
  status: z.enum(['PENDING', 'ACTIVE', 'UNSUBSCRIBED', 'BOUNCED']).optional(),
  interests: z.string().optional(), // Comma-separated list
})

// Admin subscriber management
export const adminCreateSubscriberSchema = z.object({
  email: z.string().email('Invalid email format'),
  firstName: z.string().optional(),
  interests: z.array(z.string()).optional(),
  status: z.enum(['PENDING', 'ACTIVE']).default('ACTIVE'),
  skipConfirmation: z.boolean().default(true), // Admin can add directly as active
})

export const adminUpdateSubscriberSchema = z.object({
  firstName: z.string().optional(),
  interests: z.array(z.string()).optional(),
  status: z.enum(['PENDING', 'ACTIVE', 'UNSUBSCRIBED', 'BOUNCED']).optional(),
})

export const newsletterListSchema = paginationSchema.extend({
  status: z.enum(['DRAFT', 'SCHEDULED', 'SENDING', 'SENT']).optional(),
})

export const contentFilterSchema = z.object({
  startDate: z.string().optional(), // Accepts YYYY-MM-DD or ISO datetime
  endDate: z.string().optional(),   // Accepts YYYY-MM-DD or ISO datetime
  category: z.string().optional(),
  status: z.string().optional(),
  tags: z.string().optional(), // Comma-separated list
})
