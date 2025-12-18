/**
 * Newsletter management utilities
 */

import { prisma } from './prisma'
import { NewsletterStatus, ContentType } from '@prisma/client'

/**
 * Generate a URL-friendly slug from a title
 */
export function generateSlug(title: string, year: number, month: number): string {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return `${year}-${String(month).padStart(2, '0')}-${baseSlug}`
}

/**
 * Get newsletter with all related content
 */
export async function getNewsletterWithContent(newsletterId: string) {
  return await prisma.newsletter.findUnique({
    where: { id: newsletterId },
    include: {
      content: {
        orderBy: { orderPosition: 'asc' },
      },
      stats: true,
    },
  })
}

/**
 * Create a new newsletter draft
 */
export async function createNewsletter(data: {
  subject: string
  preheader?: string
  heroTitle?: string
  heroSubtitle?: string
  heroCTALabel?: string
  heroCTAUrl?: string
  createdBy?: string
}) {
  // Generate slug from subject
  const now = new Date()
  const slug = generateSlug(
    data.subject,
    now.getFullYear(),
    now.getMonth() + 1
  )

  const newsletter = await prisma.newsletter.create({
    data: {
      ...data,
      slug,
      status: NewsletterStatus.DRAFT,
    },
  })

  // Create empty stats record
  await prisma.newsletterStats.create({
    data: {
      newsletterId: newsletter.id,
    },
  })

  return newsletter
}

/**
 * Update newsletter
 */
export async function updateNewsletter(
  id: string,
  data: Partial<{
    subject: string
    preheader: string
    heroImageUrl: string
    heroTitle: string
    heroSubtitle: string
    heroCTALabel: string
    heroCTAUrl: string
  }>
) {
  return await prisma.newsletter.update({
    where: { id },
    data,
  })
}

/**
 * Delete a newsletter (only if draft)
 */
export async function deleteNewsletter(id: string) {
  const newsletter = await prisma.newsletter.findUnique({
    where: { id },
  })

  if (!newsletter) {
    throw new Error('Newsletter not found')
  }

  if (newsletter.status !== NewsletterStatus.DRAFT) {
    throw new Error('Can only delete draft newsletters')
  }

  return await prisma.newsletter.delete({
    where: { id },
  })
}

/**
 * Add content to newsletter
 */
export async function addNewsletterContent(
  newsletterId: string,
  content: {
    contentType: ContentType
    contentId?: string
    sectionHeading?: string
    sectionDescription?: string
    orderPosition: number
  }
) {
  return await prisma.newsletterContent.create({
    data: {
      newsletterId,
      ...content,
    },
  })
}

/**
 * Remove content from newsletter
 */
export async function removeNewsletterContent(contentId: string) {
  return await prisma.newsletterContent.delete({
    where: { id: contentId },
  })
}

/**
 * Reorder newsletter content
 */
export async function reorderNewsletterContent(
  newsletterId: string,
  contentOrder: { id: string; orderPosition: number }[]
) {
  // Update all positions in a transaction
  await prisma.$transaction(
    contentOrder.map((item) =>
      prisma.newsletterContent.update({
        where: { id: item.id },
        data: { orderPosition: item.orderPosition },
      })
    )
  )
}

/**
 * Schedule newsletter for sending
 */
export async function scheduleNewsletter(
  id: string,
  scheduledAt: Date
) {
  const now = new Date()
  if (scheduledAt <= now) {
    throw new Error('Scheduled time must be in the future')
  }

  return await prisma.newsletter.update({
    where: { id },
    data: {
      status: NewsletterStatus.SCHEDULED,
      scheduledAt,
    },
  })
}

/**
 * Mark newsletter as sent
 */
export async function markNewsletterSent(
  id: string,
  recipientCount: number
) {
  return await prisma.newsletter.update({
    where: { id },
    data: {
      status: NewsletterStatus.SENT,
      sentAt: new Date(),
      recipientCount,
    },
  })
}

/**
 * Get all newsletters with pagination
 */
export async function getNewsletters(params: {
  page?: number
  limit?: number
  status?: NewsletterStatus
}) {
  const page = params.page || 1
  const limit = Math.min(params.limit || 20, 100)
  const skip = (page - 1) * limit

  const where = params.status ? { status: params.status } : {}

  const [newsletters, total] = await Promise.all([
    prisma.newsletter.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        stats: true,
      },
    }),
    prisma.newsletter.count({ where }),
  ])

  return {
    newsletters,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}

/**
 * Task 8.1.6: Get published newsletters for public archive
 */
export async function getPublishedNewsletters() {
  return await prisma.newsletter.findMany({
    where: { status: NewsletterStatus.SENT },
    orderBy: { sentAt: 'desc' },
    select: {
      id: true,
      slug: true,
      subject: true,
      preheader: true,
      sentAt: true,
      heroTitle: true,
      heroSubtitle: true,
      heroImageUrl: true,
    },
  })
}

/**
 * Task 8.1.6: Get newsletter by slug (for public pages)
 * Fixed to properly filter by status after fetching
 */
export async function getNewsletterBySlug(slug: string) {
  const newsletter = await prisma.newsletter.findUnique({
    where: { slug },
    include: {
      content: {
        orderBy: { orderPosition: 'asc' },
      },
      stats: true,
    },
  })

  // Only return published newsletters
  if (newsletter && newsletter.status !== NewsletterStatus.SENT) {
    return null
  }

  return newsletter
}
