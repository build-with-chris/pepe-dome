/**
 * Newsletter API Tests
 * Tests for newsletter CRUD, scheduling, and test send operations
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { prisma } from '../../src/lib/prisma'
import { NewsletterStatus } from '@prisma/client'

describe('Newsletter API', () => {
  describe('POST /api/admin/newsletters (create draft)', () => {
    it('should create a new newsletter draft', async () => {
      const response = await fetch('http://localhost:3000/api/admin/newsletters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: 'Test Newsletter',
          preheader: 'Test preheader',
          heroTitle: 'Welcome',
          heroSubtitle: 'To our newsletter',
        }),
      })

      expect(response.status).toBe(201)
      const data = await response.json()
      expect(data.data).toBeDefined()
      expect(data.data.subject).toBe('Test Newsletter')
      expect(data.data.status).toBe('DRAFT')
      expect(data.data.slug).toBeDefined()
    })

    it('should validate required fields', async () => {
      const response = await fetch('http://localhost:3000/api/admin/newsletters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toBeDefined()
    })
  })

  describe('PUT /api/admin/newsletters/[id] (update)', () => {
    it('should update newsletter draft', async () => {
      const newsletter = await prisma.newsletter.create({
        data: {
          subject: 'Original Subject',
          slug: '2025-01-original',
          status: NewsletterStatus.DRAFT,
        },
      })

      const response = await fetch(
        `http://localhost:3000/api/admin/newsletters/${newsletter.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subject: 'Updated Subject',
            heroTitle: 'Updated Title',
          }),
        }
      )

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.data.subject).toBe('Updated Subject')
      expect(data.data.heroTitle).toBe('Updated Title')
    })

    it('should prevent updating sent newsletter', async () => {
      const newsletter = await prisma.newsletter.create({
        data: {
          subject: 'Sent Newsletter',
          slug: '2025-01-sent',
          status: NewsletterStatus.SENT,
          sentAt: new Date(),
        },
      })

      const response = await fetch(
        `http://localhost:3000/api/admin/newsletters/${newsletter.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subject: 'Updated' }),
        }
      )

      expect(response.status).toBe(403)
    })
  })

  describe('POST /api/admin/newsletters/[id]/schedule', () => {
    it('should schedule newsletter for future send', async () => {
      const newsletter = await prisma.newsletter.create({
        data: {
          subject: 'Schedule Test',
          slug: '2025-01-schedule-test',
          status: NewsletterStatus.DRAFT,
        },
      })

      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000) // Tomorrow

      const response = await fetch(
        `http://localhost:3000/api/admin/newsletters/${newsletter.id}/schedule`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ scheduledAt: futureDate.toISOString() }),
        }
      )

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.data.status).toBe('SCHEDULED')
      expect(data.data.scheduledAt).toBeDefined()
    })

    it('should reject past schedule time', async () => {
      const newsletter = await prisma.newsletter.create({
        data: {
          subject: 'Past Schedule Test',
          slug: '2025-01-past-test',
          status: NewsletterStatus.DRAFT,
        },
      })

      const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000) // Yesterday

      const response = await fetch(
        `http://localhost:3000/api/admin/newsletters/${newsletter.id}/schedule`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ scheduledAt: pastDate.toISOString() }),
        }
      )

      expect(response.status).toBe(400)
    })
  })

  describe('GET /api/admin/newsletters/[id]/preview', () => {
    it('should generate HTML preview of newsletter', async () => {
      const newsletter = await prisma.newsletter.create({
        data: {
          subject: 'Preview Test',
          slug: '2025-01-preview',
          status: NewsletterStatus.DRAFT,
          heroTitle: 'Test Hero',
          heroSubtitle: 'Test Subtitle',
        },
      })

      const response = await fetch(
        `http://localhost:3000/api/admin/newsletters/${newsletter.id}/preview`
      )

      expect(response.status).toBe(200)
      expect(response.headers.get('content-type')).toContain('text/html')
      const html = await response.text()
      expect(html).toContain('Test Hero')
    })
  })

  describe('POST /api/admin/newsletters/[id]/test-send', () => {
    it('should send test email to test recipients', async () => {
      // Create test recipient
      await prisma.testRecipient.create({
        data: {
          email: 'test@example.com',
          name: 'Test User',
        },
      })

      const newsletter = await prisma.newsletter.create({
        data: {
          subject: 'Test Send',
          slug: '2025-01-test-send',
          status: NewsletterStatus.DRAFT,
        },
      })

      const response = await fetch(
        `http://localhost:3000/api/admin/newsletters/${newsletter.id}/test-send`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }
      )

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.data.sent).toBeGreaterThan(0)

      // Verify newsletter status hasn't changed
      const updated = await prisma.newsletter.findUnique({
        where: { id: newsletter.id },
      })
      expect(updated?.status).toBe('DRAFT')
    })
  })
})
