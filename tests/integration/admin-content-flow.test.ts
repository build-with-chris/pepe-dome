/**
 * Integration Test: Admin Content Management Flow
 * Tests the full flow of creating events, articles, and newsletters in admin
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { NewsletterStatus, ContentType } from '@prisma/client'

// Mock Clerk auth
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn().mockResolvedValue({ userId: 'test-admin-user' }),
}))

// Mock email sending
vi.mock('@/lib/email-send', () => ({
  sendNewsletter: vi.fn().mockResolvedValue({
    success: 2,
    failed: 0,
    total: 2,
    results: [],
  }),
  sendConfirmationEmail: vi.fn().mockResolvedValue({ id: 'mock-id' }),
}))

import { POST as createEvent } from '@/app/api/admin/events/route'
import { POST as createArticle } from '@/app/api/admin/articles/route'

describe('Integration: Admin Content Management Flow', () => {
  it('should create event, article, and newsletter with content', async () => {
    // STEP 1: Create an event
    const eventRequest = new NextRequest('http://localhost:3000/api/admin/events', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Integration Comedy Night',
        description: 'A fun comedy night for testing',
        date: '2025-06-15T20:00:00.000Z',
        location: 'PEPE Dome',
        category: 'SHOW',
        status: 'PUBLISHED',
      }),
      headers: { 'Content-Type': 'application/json' },
    })

    const eventResponse = await createEvent(eventRequest)
    expect(eventResponse.status).toBe(201)
    const event = await eventResponse.json()
    expect(event.title).toBe('Integration Comedy Night')

    // STEP 2: Create an article about the event
    const articleRequest = new NextRequest('http://localhost:3000/api/admin/articles', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Preview: Comedy Night',
        excerpt: 'What to expect at the comedy night',
        content: 'Full article content about the upcoming comedy night...',
        category: 'Preview',
        author: 'Admin',
        status: 'PUBLISHED',
        eventIds: [event.id],
      }),
      headers: { 'Content-Type': 'application/json' },
    })

    const articleResponse = await createArticle(articleRequest)
    expect(articleResponse.status).toBe(201)
    const article = await articleResponse.json()
    expect(article.events).toHaveLength(1)

    // STEP 3: Create a newsletter with both content items
    const newsletter = await prisma.newsletter.create({
      data: {
        slug: 'integration-newsletter-2025-06',
        subject: 'June Events at PEPE Dome',
        preheader: 'Check out our upcoming events',
        status: NewsletterStatus.DRAFT,
        heroTitle: 'What\'s happening in June',
      },
    })

    // Add event to newsletter
    await prisma.newsletterContent.create({
      data: {
        newsletterId: newsletter.id,
        contentType: ContentType.EVENT,
        contentId: event.id,
        sectionHeading: 'Upcoming Shows',
        orderPosition: 0,
      },
    })

    // Add article to newsletter
    await prisma.newsletterContent.create({
      data: {
        newsletterId: newsletter.id,
        contentType: ContentType.ARTICLE,
        contentId: article.id,
        sectionHeading: 'Latest News',
        orderPosition: 1,
      },
    })

    // STEP 4: Verify newsletter has correct content
    const fullNewsletter = await prisma.newsletter.findUnique({
      where: { id: newsletter.id },
      include: {
        content: { orderBy: { orderPosition: 'asc' } },
      },
    })

    expect(fullNewsletter?.content).toHaveLength(2)
    expect(fullNewsletter?.content[0].contentType).toBe('EVENT')
    expect(fullNewsletter?.content[0].sectionHeading).toBe('Upcoming Shows')
    expect(fullNewsletter?.content[1].contentType).toBe('ARTICLE')
    expect(fullNewsletter?.content[1].sectionHeading).toBe('Latest News')
  })

  it('should handle newsletter scheduling workflow', async () => {
    // Create newsletter
    const newsletter = await prisma.newsletter.create({
      data: {
        slug: 'schedule-flow-test',
        subject: 'Schedule Flow Test',
        status: NewsletterStatus.DRAFT,
      },
    })

    // Schedule it
    const futureDate = new Date(Date.now() + 86400000)
    await prisma.newsletter.update({
      where: { id: newsletter.id },
      data: {
        status: NewsletterStatus.SCHEDULED,
        scheduledAt: futureDate,
      },
    })

    // Verify scheduled
    const scheduled = await prisma.newsletter.findUnique({ where: { id: newsletter.id } })
    expect(scheduled?.status).toBe('SCHEDULED')
    expect(scheduled?.scheduledAt).toEqual(futureDate)

    // Cancel scheduling (back to draft)
    await prisma.newsletter.update({
      where: { id: newsletter.id },
      data: {
        status: NewsletterStatus.DRAFT,
        scheduledAt: null,
      },
    })

    const unscheduled = await prisma.newsletter.findUnique({ where: { id: newsletter.id } })
    expect(unscheduled?.status).toBe('DRAFT')
    expect(unscheduled?.scheduledAt).toBeNull()
  })

  it('should handle content reordering in newsletter', async () => {
    const newsletter = await prisma.newsletter.create({
      data: {
        slug: 'reorder-flow-test',
        subject: 'Reorder Test',
        status: NewsletterStatus.DRAFT,
      },
    })

    // Add 3 content items
    const items = await Promise.all([
      prisma.newsletterContent.create({
        data: {
          newsletterId: newsletter.id,
          contentType: ContentType.CUSTOM_SECTION,
          sectionHeading: 'Section A',
          orderPosition: 0,
        },
      }),
      prisma.newsletterContent.create({
        data: {
          newsletterId: newsletter.id,
          contentType: ContentType.CUSTOM_SECTION,
          sectionHeading: 'Section B',
          orderPosition: 1,
        },
      }),
      prisma.newsletterContent.create({
        data: {
          newsletterId: newsletter.id,
          contentType: ContentType.CUSTOM_SECTION,
          sectionHeading: 'Section C',
          orderPosition: 2,
        },
      }),
    ])

    // Reorder: C -> A -> B
    await prisma.$transaction([
      prisma.newsletterContent.update({
        where: { id: items[2].id },
        data: { orderPosition: 0 },
      }),
      prisma.newsletterContent.update({
        where: { id: items[0].id },
        data: { orderPosition: 1 },
      }),
      prisma.newsletterContent.update({
        where: { id: items[1].id },
        data: { orderPosition: 2 },
      }),
    ])

    // Verify new order
    const content = await prisma.newsletterContent.findMany({
      where: { newsletterId: newsletter.id },
      orderBy: { orderPosition: 'asc' },
    })

    expect(content[0].sectionHeading).toBe('Section C')
    expect(content[1].sectionHeading).toBe('Section A')
    expect(content[2].sectionHeading).toBe('Section B')
  })

  it('should prevent deletion of sent newsletter', async () => {
    const newsletter = await prisma.newsletter.create({
      data: {
        slug: 'no-delete-sent',
        subject: 'Cannot Delete',
        status: NewsletterStatus.SENT,
        sentAt: new Date(),
        recipientCount: 50,
      },
    })

    // Should not be able to delete
    const { deleteNewsletter } = await import('@/lib/newsletters')
    await expect(deleteNewsletter(newsletter.id)).rejects.toThrow(
      'Can only delete draft newsletters'
    )

    // Newsletter should still exist
    const exists = await prisma.newsletter.findUnique({ where: { id: newsletter.id } })
    expect(exists).toBeDefined()
  })
})
