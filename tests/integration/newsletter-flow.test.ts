/**
 * Integration Test: Newsletter Creation and Send Flow
 *
 * Tests the complete admin workflow from creation to sending
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { prisma } from '@/lib/prisma'
import { sendNewsletter } from '@/lib/email-send'
import { POST as createPOST, GET as listGET } from '@/app/api/admin/newsletters/route'
import { PUT, DELETE } from '@/app/api/admin/newsletters/[id]/route'
import { NextRequest } from 'next/server'

describe('Integration: Newsletter Creation and Send Flow', () => {
  let activeSubscribers: any[] = []

  beforeEach(async () => {
    // Create test subscribers
    activeSubscribers = await Promise.all([
      prisma.subscriber.create({
        data: {
          email: 'subscriber1@example.com',
          status: 'ACTIVE',
          confirmedAt: new Date(),
        },
      }),
      prisma.subscriber.create({
        data: {
          email: 'subscriber2@example.com',
          status: 'ACTIVE',
          confirmedAt: new Date(),
        },
      }),
      prisma.subscriber.create({
        data: {
          email: 'subscriber3@example.com',
          status: 'ACTIVE',
          confirmedAt: new Date(),
        },
      }),
    ])

    // Create unsubscribed subscriber (should not receive)
    await prisma.subscriber.create({
      data: {
        email: 'unsubscribed@example.com',
        status: 'UNSUBSCRIBED',
        unsubscribedAt: new Date(),
      },
    })
  })

  it('should complete full newsletter creation and send workflow', async () => {
    // STEP 1: Admin creates draft newsletter
    const createRequest = new NextRequest('http://localhost:3000/api/admin/newsletters', {
      method: 'POST',
      body: JSON.stringify({
        slug: 'workflow-test-newsletter',
        subject: 'Workflow Test Newsletter',
        preheader: 'Testing the complete workflow',
        heroTitle: 'November im PEPE Dome',
        heroSubtitle: 'Shows, Events & More',
        heroCTALabel: 'View All Events',
        heroCTAUrl: '/events',
      }),
    })

    const createResponse = await createPOST(createRequest)
    expect(createResponse.status).toBe(201)

    const createData = await createResponse.json()
    const newsletterId = createData.newsletter.id

    // Verify newsletter created with DRAFT status
    let newsletter = await prisma.newsletter.findUnique({
      where: { id: newsletterId },
    })

    expect(newsletter).toBeTruthy()
    expect(newsletter!.status).toBe('DRAFT')
    expect(newsletter!.subject).toBe('Workflow Test Newsletter')

    // STEP 2: Admin adds content to newsletter
    const contentItem1 = await prisma.newsletterContent.create({
      data: {
        newsletterId,
        contentType: 'EVENT',
        contentData: {
          title: 'Comedy Show',
          date: '2025-11-20',
          url: '/events/comedy-show',
        },
        sectionHeading: 'Kommende Shows',
        orderPosition: 1,
      },
    })

    const contentItem2 = await prisma.newsletterContent.create({
      data: {
        newsletterId,
        contentType: 'ARTICLE',
        contentData: {
          title: 'Behind the Scenes',
          excerpt: 'A look backstage',
          url: '/news/behind-the-scenes',
        },
        sectionHeading: 'Aus dem Dome',
        orderPosition: 2,
      },
    })

    // Verify content added
    const contentItems = await prisma.newsletterContent.findMany({
      where: { newsletterId },
      orderBy: { orderPosition: 'asc' },
    })

    expect(contentItems).toHaveLength(2)
    expect(contentItems[0].orderPosition).toBe(1)
    expect(contentItems[1].orderPosition).toBe(2)

    // STEP 3: Admin updates newsletter (edit hero, etc.)
    const updateRequest = new NextRequest(
      `http://localhost:3000/api/admin/newsletters/${newsletterId}`,
      {
        method: 'PUT',
        body: JSON.stringify({
          heroImageUrl: 'https://example.com/hero.jpg',
          heroTitle: 'Updated Title',
        }),
      }
    )

    const updateResponse = await PUT(updateRequest, {
      params: { id: newsletterId },
    })
    expect(updateResponse.status).toBe(200)

    // Verify updates applied
    newsletter = await prisma.newsletter.findUnique({
      where: { id: newsletterId },
    })

    expect(newsletter!.heroImageUrl).toBe('https://example.com/hero.jpg')
    expect(newsletter!.heroTitle).toBe('Updated Title')

    // STEP 4: Send newsletter (test mode with dry run)
    const sendResult = await sendNewsletter(newsletterId, {
      dryRun: true,
    })

    expect(sendResult.success).toBe(3) // 3 active subscribers
    expect(sendResult.failed).toBe(0)
    expect(sendResult.total).toBe(3)

    // STEP 5: Actually send newsletter (without dry run)
    const actualSendResult = await sendNewsletter(newsletterId)

    expect(actualSendResult.success).toBe(3)
    expect(actualSendResult.total).toBe(3)

    // Verify newsletter status updated to SENT
    newsletter = await prisma.newsletter.findUnique({
      where: { id: newsletterId },
      include: { stats: true },
    })

    expect(newsletter!.status).toBe('SENT')
    expect(newsletter!.sentAt).toBeTruthy()
    expect(newsletter!.recipientCount).toBe(3)

    // Verify stats created
    expect(newsletter!.stats).toBeTruthy()
    expect(newsletter!.stats!.sentCount).toBe(3)

    // STEP 6: Verify unsubscribed user did not receive
    // This is implicit - sendResult shows 3 recipients, not 4
  })

  it('should handle newsletter with no subscribers gracefully', async () => {
    // Delete all subscribers
    await prisma.subscriber.deleteMany()

    // Create newsletter
    const newsletter = await prisma.newsletter.create({
      data: {
        slug: 'no-subscribers-newsletter',
        subject: 'No Subscribers Test',
        status: 'DRAFT',
      },
    })

    // Try to send
    await expect(sendNewsletter(newsletter.id)).rejects.toThrow('No recipients found')

    // Verify status still DRAFT
    const stillDraft = await prisma.newsletter.findUnique({
      where: { id: newsletter.id },
    })

    expect(stillDraft!.status).toBe('DRAFT')
    expect(stillDraft!.sentAt).toBeNull()
  })

  it('should prevent sending already sent newsletter', async () => {
    // Create sent newsletter
    const newsletter = await prisma.newsletter.create({
      data: {
        slug: 'already-sent-newsletter',
        subject: 'Already Sent',
        status: 'SENT',
        sentAt: new Date(),
      },
    })

    // Try to send again
    await expect(sendNewsletter(newsletter.id)).rejects.toThrow('already sent')
  })

  it('should prevent deletion of sent newsletter', async () => {
    // Create sent newsletter
    const newsletter = await prisma.newsletter.create({
      data: {
        slug: 'sent-delete-test',
        subject: 'Sent Newsletter',
        status: 'SENT',
        sentAt: new Date(),
      },
    })

    // Try to delete
    const deleteRequest = new NextRequest(
      `http://localhost:3000/api/admin/newsletters/${newsletter.id}`,
      { method: 'DELETE' }
    )

    const deleteResponse = await DELETE(deleteRequest, {
      params: { id: newsletter.id },
    })

    expect(deleteResponse.status).toBe(400)

    // Verify newsletter still exists
    const stillExists = await prisma.newsletter.findUnique({
      where: { id: newsletter.id },
    })

    expect(stillExists).toBeTruthy()
  })

  it('should allow deletion of draft newsletter', async () => {
    // Create draft
    const newsletter = await prisma.newsletter.create({
      data: {
        slug: 'draft-delete-test',
        subject: 'Draft Newsletter',
        status: 'DRAFT',
      },
    })

    // Delete it
    const deleteRequest = new NextRequest(
      `http://localhost:3000/api/admin/newsletters/${newsletter.id}`,
      { method: 'DELETE' }
    )

    const deleteResponse = await DELETE(deleteRequest, {
      params: { id: newsletter.id },
    })

    expect(deleteResponse.status).toBe(200)

    // Verify deleted
    const deleted = await prisma.newsletter.findUnique({
      where: { id: newsletter.id },
    })

    expect(deleted).toBeNull()
  })

  it('should list newsletters with correct filtering', async () => {
    // Create mix of newsletters
    await prisma.newsletter.createMany({
      data: [
        { slug: 'draft-1', subject: 'Draft 1', status: 'DRAFT' },
        { slug: 'sent-1', subject: 'Sent 1', status: 'SENT', sentAt: new Date() },
        { slug: 'scheduled-1', subject: 'Scheduled 1', status: 'SCHEDULED', scheduledAt: new Date() },
      ],
    })

    // List all
    const listRequest = new NextRequest('http://localhost:3000/api/admin/newsletters', {
      method: 'GET',
    })

    const listResponse = await listGET(listRequest)
    expect(listResponse.status).toBe(200)

    const listData = await listResponse.json()
    expect(listData.newsletters.length).toBeGreaterThanOrEqual(3)

    // Verify includes all statuses
    const statuses = listData.newsletters.map((n: any) => n.status)
    expect(statuses).toContain('DRAFT')
    expect(statuses).toContain('SENT')
    expect(statuses).toContain('SCHEDULED')
  })
})
