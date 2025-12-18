import { describe, it, expect } from 'vitest'
import { prisma } from '../../src/lib/prisma'
import { NewsletterStatus, ContentType } from '@prisma/client'

describe('Newsletter Model', () => {
  it('should create a newsletter with default draft status', async () => {
    const newsletter = await prisma.newsletter.create({
      data: {
        slug: 'test-newsletter-2025-11',
        subject: 'Test Newsletter',
        preheader: 'This is a test',
      },
    })

    expect(newsletter.id).toBeDefined()
    expect(newsletter.status).toBe(NewsletterStatus.DRAFT)
    expect(newsletter.recipientCount).toBe(0)
    expect(newsletter.sentAt).toBeNull()
  })

  it('should transition newsletter status from draft to scheduled to sent', async () => {
    const newsletter = await prisma.newsletter.create({
      data: {
        slug: 'status-test-newsletter',
        subject: 'Status Test',
      },
    })

    expect(newsletter.status).toBe(NewsletterStatus.DRAFT)

    const scheduledAt = new Date(Date.now() + 3600000) // 1 hour from now
    const scheduled = await prisma.newsletter.update({
      where: { id: newsletter.id },
      data: {
        status: NewsletterStatus.SCHEDULED,
        scheduledAt,
      },
    })

    expect(scheduled.status).toBe(NewsletterStatus.SCHEDULED)
    expect(scheduled.scheduledAt).toEqual(scheduledAt)

    const sent = await prisma.newsletter.update({
      where: { id: newsletter.id },
      data: {
        status: NewsletterStatus.SENT,
        sentAt: new Date(),
        recipientCount: 100,
      },
    })

    expect(sent.status).toBe(NewsletterStatus.SENT)
    expect(sent.sentAt).not.toBeNull()
    expect(sent.recipientCount).toBe(100)
  })

  it('should associate content with newsletter and maintain order', async () => {
    const newsletter = await prisma.newsletter.create({
      data: {
        slug: 'content-test-newsletter',
        subject: 'Content Test',
      },
    })

    await prisma.newsletterContent.create({
      data: {
        newsletterId: newsletter.id,
        contentType: ContentType.EVENT,
        contentId: 'event-123',
        sectionHeading: 'Upcoming Shows',
        orderPosition: 0,
      },
    })

    await prisma.newsletterContent.create({
      data: {
        newsletterId: newsletter.id,
        contentType: ContentType.ARTICLE,
        contentId: 'article-456',
        sectionHeading: 'Latest News',
        orderPosition: 1,
      },
    })

    const withContent = await prisma.newsletter.findUnique({
      where: { id: newsletter.id },
      include: {
        content: {
          orderBy: { orderPosition: 'asc' },
        },
      },
    })

    expect(withContent?.content).toHaveLength(2)
    expect(withContent?.content[0].contentType).toBe(ContentType.EVENT)
    expect(withContent?.content[0].orderPosition).toBe(0)
    expect(withContent?.content[1].contentType).toBe(ContentType.ARTICLE)
    expect(withContent?.content[1].orderPosition).toBe(1)
  })

  it('should enforce unique slug constraint', async () => {
    await prisma.newsletter.create({
      data: {
        slug: 'duplicate-slug',
        subject: 'First Newsletter',
      },
    })

    await expect(
      prisma.newsletter.create({
        data: {
          slug: 'duplicate-slug',
          subject: 'Second Newsletter',
        },
      })
    ).rejects.toThrow()
  })

  it('should create newsletter stats relationship', async () => {
    const newsletter = await prisma.newsletter.create({
      data: {
        slug: 'stats-test-newsletter',
        subject: 'Stats Test',
      },
    })

    await prisma.newsletterStats.create({
      data: {
        newsletterId: newsletter.id,
        sentCount: 100,
        openCount: 50,
        uniqueOpenCount: 45,
        clickCount: 20,
        uniqueClickCount: 18,
      },
    })

    const withStats = await prisma.newsletter.findUnique({
      where: { id: newsletter.id },
      include: { stats: true },
    })

    expect(withStats?.stats).toBeDefined()
    expect(withStats?.stats?.sentCount).toBe(100)
    expect(withStats?.stats?.openCount).toBe(50)
    expect(withStats?.stats?.uniqueOpenCount).toBe(45)
  })

  it('should cascade delete content when newsletter is deleted', async () => {
    const newsletter = await prisma.newsletter.create({
      data: {
        slug: 'delete-test-newsletter',
        subject: 'Delete Test',
      },
    })

    await prisma.newsletterContent.create({
      data: {
        newsletterId: newsletter.id,
        contentType: ContentType.EVENT,
        contentId: 'event-789',
        orderPosition: 0,
      },
    })

    await prisma.newsletter.delete({
      where: { id: newsletter.id },
    })

    const content = await prisma.newsletterContent.findMany({
      where: { newsletterId: newsletter.id },
    })

    expect(content).toHaveLength(0)
  })
})
