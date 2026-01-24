/**
 * Newsletter Management Tests
 * Tests for newsletter utility functions in src/lib/newsletters.ts
 */

import { describe, it, expect } from 'vitest'
import { prisma } from '@/lib/prisma'
import { NewsletterStatus, ContentType } from '@prisma/client'
import {
  generateSlug,
  getNewsletterWithContent,
  createNewsletter,
  updateNewsletter,
  deleteNewsletter,
  addNewsletterContent,
  removeNewsletterContent,
  reorderNewsletterContent,
  replaceNewsletterContent,
  scheduleNewsletter,
  markNewsletterSent,
  getNewsletters,
  getPublishedNewsletters,
  getNewsletterBySlug,
} from '@/lib/newsletters'

describe('Newsletter Management', () => {
  describe('generateSlug', () => {
    it('should generate slug with year and month prefix', () => {
      const slug = generateSlug('Monthly Update', 2025, 3)
      expect(slug).toBe('2025-03-monthly-update')
    })

    it('should pad month with zero', () => {
      const slug = generateSlug('Test', 2025, 1)
      expect(slug).toBe('2025-01-test')
    })

    it('should not pad double-digit months', () => {
      const slug = generateSlug('Test', 2025, 12)
      expect(slug).toBe('2025-12-test')
    })

    it('should convert title to lowercase', () => {
      const slug = generateSlug('BIG TITLE', 2025, 5)
      expect(slug).toBe('2025-05-big-title')
    })

    it('should replace special characters with hyphens', () => {
      const slug = generateSlug('Hello! World @2025', 2025, 6)
      expect(slug).toBe('2025-06-hello-world-2025')
    })

    it('should remove leading and trailing hyphens from title part', () => {
      const slug = generateSlug('--test--', 2025, 1)
      expect(slug).toBe('2025-01-test')
    })

    it('should handle multiple consecutive special chars', () => {
      const slug = generateSlug('hello   world', 2025, 7)
      expect(slug).toBe('2025-07-hello-world')
    })
  })

  describe('createNewsletter', () => {
    it('should create newsletter with DRAFT status', async () => {
      const newsletter = await createNewsletter({ subject: 'Test Newsletter' })

      expect(newsletter.subject).toBe('Test Newsletter')
      expect(newsletter.status).toBe(NewsletterStatus.DRAFT)
      expect(newsletter.slug).toBeDefined()
    })

    it('should generate slug from subject', async () => {
      const newsletter = await createNewsletter({ subject: 'Amazing Events' })
      const now = new Date()
      const expectedPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

      expect(newsletter.slug).toContain(expectedPrefix)
      expect(newsletter.slug).toContain('amazing-events')
    })

    it('should create associated stats record', async () => {
      const newsletter = await createNewsletter({ subject: 'Stats Test' })

      const stats = await prisma.newsletterStats.findFirst({
        where: { newsletterId: newsletter.id },
      })

      expect(stats).toBeDefined()
      expect(stats?.newsletterId).toBe(newsletter.id)
    })

    it('should store optional fields', async () => {
      const newsletter = await createNewsletter({
        subject: 'Full Newsletter',
        preheader: 'Check out our events',
        heroTitle: 'Big Hero',
        heroSubtitle: 'Subtitle here',
        heroCTALabel: 'Read More',
        heroCTAUrl: 'https://example.com',
        createdBy: 'admin@example.com',
      })

      expect(newsletter.preheader).toBe('Check out our events')
      expect(newsletter.heroTitle).toBe('Big Hero')
      expect(newsletter.heroSubtitle).toBe('Subtitle here')
      expect(newsletter.heroCTALabel).toBe('Read More')
      expect(newsletter.heroCTAUrl).toBe('https://example.com')
      expect(newsletter.createdBy).toBe('admin@example.com')
    })
  })

  describe('updateNewsletter', () => {
    it('should update newsletter fields', async () => {
      const newsletter = await createNewsletter({ subject: 'Original' })

      const updated = await updateNewsletter(newsletter.id, {
        subject: 'Updated Subject',
        preheader: 'New preheader',
      })

      expect(updated.subject).toBe('Updated Subject')
      expect(updated.preheader).toBe('New preheader')
    })

    it('should allow setting introText to null', async () => {
      const newsletter = await createNewsletter({ subject: 'Nullable Test' })
      await updateNewsletter(newsletter.id, { introText: 'Some text' })
      const updated = await updateNewsletter(newsletter.id, { introText: null })

      expect(updated.introText).toBeNull()
    })
  })

  describe('deleteNewsletter', () => {
    it('should delete draft newsletter', async () => {
      const newsletter = await createNewsletter({ subject: 'To Delete' })
      await deleteNewsletter(newsletter.id)

      const found = await prisma.newsletter.findUnique({
        where: { id: newsletter.id },
      })
      expect(found).toBeNull()
    })

    it('should throw error for non-existent newsletter', async () => {
      await expect(
        deleteNewsletter('non-existent-id')
      ).rejects.toThrow('Newsletter not found')
    })

    it('should throw error when deleting sent newsletter', async () => {
      const newsletter = await createNewsletter({ subject: 'Sent Newsletter' })
      await prisma.newsletter.update({
        where: { id: newsletter.id },
        data: { status: NewsletterStatus.SENT, sentAt: new Date() },
      })

      await expect(
        deleteNewsletter(newsletter.id)
      ).rejects.toThrow('Can only delete draft newsletters')
    })

    it('should throw error when deleting scheduled newsletter', async () => {
      const newsletter = await createNewsletter({ subject: 'Scheduled' })
      await prisma.newsletter.update({
        where: { id: newsletter.id },
        data: {
          status: NewsletterStatus.SCHEDULED,
          scheduledAt: new Date(Date.now() + 86400000),
        },
      })

      await expect(
        deleteNewsletter(newsletter.id)
      ).rejects.toThrow('Can only delete draft newsletters')
    })
  })

  describe('addNewsletterContent', () => {
    it('should add content to newsletter', async () => {
      const newsletter = await createNewsletter({ subject: 'Content Test' })
      const event = await prisma.event.create({
        data: {
          slug: 'test-event-nl-content',
          title: 'Test Event',
          description: 'A test event for newsletter content',
          date: new Date(),
          location: 'PEPE Dome',
          category: 'SHOW',
          status: 'PUBLISHED',
        },
      })

      const content = await addNewsletterContent(newsletter.id, {
        contentType: ContentType.EVENT,
        contentId: event.id,
        orderPosition: 0,
      })

      expect(content.newsletterId).toBe(newsletter.id)
      expect(content.contentType).toBe(ContentType.EVENT)
      expect(content.contentId).toBe(event.id)
      expect(content.orderPosition).toBe(0)
    })

    it('should add custom section without contentId', async () => {
      const newsletter = await createNewsletter({ subject: 'Custom Section' })

      const content = await addNewsletterContent(newsletter.id, {
        contentType: ContentType.CUSTOM_SECTION,
        sectionHeading: 'Highlights',
        sectionDescription: 'Our top picks this month',
        orderPosition: 0,
      })

      expect(content.contentType).toBe(ContentType.CUSTOM_SECTION)
      expect(content.sectionHeading).toBe('Highlights')
      expect(content.sectionDescription).toBe('Our top picks this month')
    })
  })

  describe('removeNewsletterContent', () => {
    it('should remove content from newsletter', async () => {
      const newsletter = await createNewsletter({ subject: 'Remove Test' })
      const content = await addNewsletterContent(newsletter.id, {
        contentType: ContentType.CUSTOM_SECTION,
        sectionHeading: 'To Remove',
        orderPosition: 0,
      })

      await removeNewsletterContent(content.id)

      const found = await prisma.newsletterContent.findUnique({
        where: { id: content.id },
      })
      expect(found).toBeNull()
    })
  })

  describe('reorderNewsletterContent', () => {
    it('should update order positions', async () => {
      const newsletter = await createNewsletter({ subject: 'Reorder Test' })
      const content1 = await addNewsletterContent(newsletter.id, {
        contentType: ContentType.CUSTOM_SECTION,
        sectionHeading: 'First',
        orderPosition: 0,
      })
      const content2 = await addNewsletterContent(newsletter.id, {
        contentType: ContentType.CUSTOM_SECTION,
        sectionHeading: 'Second',
        orderPosition: 1,
      })

      // Swap order
      await reorderNewsletterContent(newsletter.id, [
        { id: content1.id, orderPosition: 1 },
        { id: content2.id, orderPosition: 0 },
      ])

      const updated1 = await prisma.newsletterContent.findUnique({ where: { id: content1.id } })
      const updated2 = await prisma.newsletterContent.findUnique({ where: { id: content2.id } })

      expect(updated1?.orderPosition).toBe(1)
      expect(updated2?.orderPosition).toBe(0)
    })
  })

  describe('replaceNewsletterContent', () => {
    it('should replace all content with new items', async () => {
      const newsletter = await createNewsletter({ subject: 'Replace Test' })
      await addNewsletterContent(newsletter.id, {
        contentType: ContentType.CUSTOM_SECTION,
        sectionHeading: 'Old',
        orderPosition: 0,
      })

      await replaceNewsletterContent(newsletter.id, [
        { contentType: ContentType.CUSTOM_SECTION, sectionHeading: 'New 1', orderPosition: 0 },
        { contentType: ContentType.CUSTOM_SECTION, sectionHeading: 'New 2', orderPosition: 1 },
      ])

      const content = await prisma.newsletterContent.findMany({
        where: { newsletterId: newsletter.id },
        orderBy: { orderPosition: 'asc' },
      })

      expect(content).toHaveLength(2)
      expect(content[0].sectionHeading).toBe('New 1')
      expect(content[1].sectionHeading).toBe('New 2')
    })

    it('should handle empty content array (clear all)', async () => {
      const newsletter = await createNewsletter({ subject: 'Clear Test' })
      await addNewsletterContent(newsletter.id, {
        contentType: ContentType.CUSTOM_SECTION,
        sectionHeading: 'Existing',
        orderPosition: 0,
      })

      await replaceNewsletterContent(newsletter.id, [])

      const content = await prisma.newsletterContent.findMany({
        where: { newsletterId: newsletter.id },
      })
      expect(content).toHaveLength(0)
    })
  })

  describe('scheduleNewsletter', () => {
    it('should schedule newsletter for future date', async () => {
      const newsletter = await createNewsletter({ subject: 'Schedule Test' })
      const futureDate = new Date(Date.now() + 86400000) // Tomorrow

      const scheduled = await scheduleNewsletter(newsletter.id, futureDate)

      expect(scheduled.status).toBe(NewsletterStatus.SCHEDULED)
      expect(scheduled.scheduledAt).toEqual(futureDate)
    })

    it('should throw error for past date', async () => {
      const newsletter = await createNewsletter({ subject: 'Past Date' })
      const pastDate = new Date(Date.now() - 86400000)

      await expect(
        scheduleNewsletter(newsletter.id, pastDate)
      ).rejects.toThrow('Scheduled time must be in the future')
    })
  })

  describe('markNewsletterSent', () => {
    it('should update status to SENT with recipient count', async () => {
      const newsletter = await createNewsletter({ subject: 'Send Test' })

      const sent = await markNewsletterSent(newsletter.id, 150)

      expect(sent.status).toBe(NewsletterStatus.SENT)
      expect(sent.sentAt).toBeDefined()
      expect(sent.recipientCount).toBe(150)
    })
  })

  describe('getNewsletterWithContent', () => {
    it('should return newsletter with content and stats', async () => {
      const newsletter = await createNewsletter({ subject: 'Full Load' })
      await addNewsletterContent(newsletter.id, {
        contentType: ContentType.CUSTOM_SECTION,
        sectionHeading: 'Test',
        orderPosition: 0,
      })

      const result = await getNewsletterWithContent(newsletter.id)

      expect(result).toBeDefined()
      expect(result?.content).toHaveLength(1)
      expect(result?.stats).toBeDefined()
    })

    it('should order content by position', async () => {
      const newsletter = await createNewsletter({ subject: 'Ordered' })
      await addNewsletterContent(newsletter.id, {
        contentType: ContentType.CUSTOM_SECTION,
        sectionHeading: 'Second',
        orderPosition: 1,
      })
      await addNewsletterContent(newsletter.id, {
        contentType: ContentType.CUSTOM_SECTION,
        sectionHeading: 'First',
        orderPosition: 0,
      })

      const result = await getNewsletterWithContent(newsletter.id)
      expect(result?.content[0].sectionHeading).toBe('First')
      expect(result?.content[1].sectionHeading).toBe('Second')
    })

    it('should return null for non-existent ID', async () => {
      const result = await getNewsletterWithContent('non-existent-id')
      expect(result).toBeNull()
    })
  })

  describe('getNewsletters', () => {
    it('should return paginated list', async () => {
      await createNewsletter({ subject: 'NL 1' })
      await createNewsletter({ subject: 'NL 2' })
      await createNewsletter({ subject: 'NL 3' })

      const result = await getNewsletters({ page: 1, limit: 2 })

      expect(result.newsletters).toHaveLength(2)
      expect(result.pagination.total).toBe(3)
      expect(result.pagination.totalPages).toBe(2)
    })

    it('should filter by status', async () => {
      await createNewsletter({ subject: 'Draft 1' })
      const nl2 = await createNewsletter({ subject: 'Sent 1' })
      await markNewsletterSent(nl2.id, 10)

      const drafts = await getNewsletters({ status: NewsletterStatus.DRAFT })
      expect(drafts.newsletters.every((n) => n.status === NewsletterStatus.DRAFT)).toBe(true)
    })

    it('should order by createdAt desc', async () => {
      await createNewsletter({ subject: 'Older' })
      await createNewsletter({ subject: 'Newer' })

      const result = await getNewsletters({})
      expect(result.newsletters[0].subject).toBe('Newer')
    })

    it('should default to page 1 with limit 20', async () => {
      await createNewsletter({ subject: 'Default' })
      const result = await getNewsletters({})

      expect(result.pagination.page).toBe(1)
      expect(result.pagination.limit).toBe(20)
    })

    it('should cap limit at 100', async () => {
      const result = await getNewsletters({ limit: 200 })
      expect(result.pagination.limit).toBe(100)
    })
  })

  describe('getPublishedNewsletters', () => {
    it('should return only SENT newsletters', async () => {
      const draft = await createNewsletter({ subject: 'Draft' })
      const sent = await createNewsletter({ subject: 'Published' })
      await markNewsletterSent(sent.id, 50)

      const published = await getPublishedNewsletters()
      expect(published.every((n) => n.subject !== 'Draft')).toBe(true)
      expect(published.some((n) => n.subject === 'Published')).toBe(true)
    })

    it('should order by sentAt desc', async () => {
      const nl1 = await createNewsletter({ subject: 'First Sent' })
      await markNewsletterSent(nl1.id, 10)

      // Small delay to ensure different sentAt
      await new Promise((r) => setTimeout(r, 50))

      const nl2 = await createNewsletter({ subject: 'Second Sent' })
      await markNewsletterSent(nl2.id, 20)

      const published = await getPublishedNewsletters()
      expect(published[0].subject).toBe('Second Sent')
    })

    it('should return selected fields only', async () => {
      const nl = await createNewsletter({ subject: 'Fields Test' })
      await markNewsletterSent(nl.id, 5)

      const [published] = await getPublishedNewsletters()
      expect(published).toHaveProperty('id')
      expect(published).toHaveProperty('slug')
      expect(published).toHaveProperty('subject')
      expect(published).toHaveProperty('sentAt')
    })
  })

  describe('getNewsletterBySlug', () => {
    it('should return sent newsletter by slug', async () => {
      const nl = await createNewsletter({ subject: 'Slug Test' })
      await markNewsletterSent(nl.id, 10)

      const result = await getNewsletterBySlug(nl.slug)
      expect(result).toBeDefined()
      expect(result?.subject).toBe('Slug Test')
    })

    it('should return null for draft newsletter slug', async () => {
      const nl = await createNewsletter({ subject: 'Draft Slug' })
      const result = await getNewsletterBySlug(nl.slug)
      expect(result).toBeNull()
    })

    it('should return null for non-existent slug', async () => {
      const result = await getNewsletterBySlug('non-existent-slug')
      expect(result).toBeNull()
    })

    it('should include content ordered by position', async () => {
      const nl = await createNewsletter({ subject: 'Slug Content' })
      await addNewsletterContent(nl.id, {
        contentType: ContentType.CUSTOM_SECTION,
        sectionHeading: 'B',
        orderPosition: 1,
      })
      await addNewsletterContent(nl.id, {
        contentType: ContentType.CUSTOM_SECTION,
        sectionHeading: 'A',
        orderPosition: 0,
      })
      await markNewsletterSent(nl.id, 5)

      const result = await getNewsletterBySlug(nl.slug)
      expect(result?.content[0].sectionHeading).toBe('A')
      expect(result?.content[1].sectionHeading).toBe('B')
    })
  })
})
