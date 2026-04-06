/**
 * Email Sending Functions
 *
 * High-level functions for sending emails using Resend and React Email templates
 */

import { resend, DEFAULT_FROM_EMAIL, generateEmailUrls, batchSendEmails } from './resend'
import { prisma } from './prisma'

/**
 * Content item type (must match NewsletterTemplate's expected types)
 */
type ContentItemType = 'event' | 'article' | 'custom'

/**
 * Content section type for newsletter templates
 */
type EventDataForEmail = {
  title: string
  description?: string
  date?: string
  time?: string
  location?: string
  category?: string
  imageUrl?: string
  eventUrl?: string
  ctaUrl?: string
  ctaLabel?: string
}

type ArticleDataForEmail = {
  title: string
  excerpt?: string
  imageUrl?: string
  articleUrl?: string
  category?: string
}

type CustomDataForEmail = {
  title?: string
  text?: string
  imageUrl?: string
  ctaUrl?: string
  ctaLabel?: string
}

type ContentItemDataForEmail = EventDataForEmail | ArticleDataForEmail | CustomDataForEmail | Record<string, never>

interface ContentSection {
  sectionHeading: string
  sectionDescription?: string
  items: Array<{ type: ContentItemType; data: ContentItemDataForEmail }>
}

/**
 * Send double opt-in confirmation email
 *
 * @param subscriberId - Subscriber database ID
 * @param baseUrl - Optional: Basis-URL für den Bestätigungs-Link (z. B. aus Request, damit nicht localhost in der Mail steht)
 * @returns Resend email ID or error
 */
export async function sendConfirmationEmail(subscriberId: string, baseUrl?: string) {
  // Dynamic imports to avoid bundling react-email in client build
  const { render } = await import('@react-email/render')
  const ConfirmationEmail = (await import('@/components/email/templates/ConfirmationEmail')).default

  // Fetch subscriber
  const subscriber = await prisma.subscriber.findUnique({
    where: { id: subscriberId },
  })

  if (!subscriber) {
    throw new Error('Subscriber not found')
  }

  if (subscriber.status !== 'PENDING') {
    throw new Error('Subscriber is not in PENDING status')
  }

  if (!subscriber.doubleOptInToken) {
    throw new Error('Subscriber missing double opt-in token')
  }

  // Generate URLs (baseUrl aus Request nutzen, damit Bestätigungs-Link auf die echte Domain zeigt)
  const urls = generateEmailUrls(subscriber.id, subscriber.doubleOptInToken, baseUrl)

  // Render email template
  const emailHtml = await render(
    ConfirmationEmail({
      confirmationUrl: urls.confirm,
      subscriberEmail: subscriber.email,
      firstName: subscriber.firstName || undefined,
    })
  )

  // Send via Resend
  const result = await resend.emails.send({
    from: DEFAULT_FROM_EMAIL,
    to: subscriber.email,
    subject: 'Bestätige deine Newsletter-Anmeldung bei PEPE Dome',
    html: emailHtml,
    tags: [
      { name: 'type', value: 'confirmation' },
      { name: 'subscriber_id', value: subscriber.id },
    ],
  })

  // Resend SDK returns { data, error } instead of throwing
  if (result.error) {
    throw new Error(`Resend API error: ${result.error.message}`)
  }

  // Update subscriber record
  await prisma.subscriber.update({
    where: { id: subscriber.id },
    data: {
      doubleOptInSentAt: new Date(),
    },
  })

  return result
}

/**
 * Send welcome email after successful confirmation
 *
 * @param subscriberId - Subscriber database ID
 * @returns Resend email ID or error
 */
export async function sendWelcomeEmail(subscriberId: string) {
  // Dynamic imports to avoid bundling react-email in client build
  const { render } = await import('@react-email/render')
  const WelcomeEmail = (await import('@/components/email/templates/WelcomeEmail')).default

  // Fetch subscriber
  const subscriber = await prisma.subscriber.findUnique({
    where: { id: subscriberId },
  })

  if (!subscriber) {
    throw new Error('Subscriber not found')
  }

  if (subscriber.status !== 'ACTIVE') {
    throw new Error('Subscriber is not confirmed')
  }

  // Generate URLs
  const urls = generateEmailUrls(subscriber.id)

  // Render email template
  const emailHtml = await render(
    WelcomeEmail({
      subscriberId: subscriber.id,
      subscriberEmail: subscriber.email,
      firstName: subscriber.firstName || undefined,
      upcomingEventsUrl: `${urls.home}/events`,
      newsletterArchiveUrl: `${urls.home}/newsletter`,
    })
  )

  // Send via Resend
  const unsubscribeUrl = `${urls.home}/newsletter/unsubscribe/${subscriber.id}`
  const result = await resend.emails.send({
    from: DEFAULT_FROM_EMAIL,
    to: subscriber.email,
    subject: 'Willkommen beim PEPE Dome Newsletter!',
    html: emailHtml,
    headers: {
      'List-Unsubscribe': `<${unsubscribeUrl}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
    tags: [
      { name: 'type', value: 'welcome' },
      { name: 'subscriber_id', value: subscriber.id },
    ],
  })

  // Resend SDK returns { data, error } instead of throwing
  if (result.error) {
    throw new Error(`Resend API error: ${result.error.message}`)
  }

  return result
}

/**
 * Send newsletter to subscriber list with batching
 *
 * @param newsletterId - Newsletter database ID
 * @param options - Optional overrides for testing
 * @returns Send results with success/failure counts
 */
export async function sendNewsletter(
  newsletterId: string,
  options?: {
    /** Override recipients for testing */
    testRecipients?: string[]
    /** Dry run - render but don't send */
    dryRun?: boolean
  }
) {
  // Dynamic imports to avoid bundling react-email in client build
  const { render } = await import('@react-email/render')
  const NewsletterTemplate = (await import('@/components/email/templates/NewsletterTemplate')).default

  // Fetch newsletter with content
  const newsletter = await prisma.newsletter.findUnique({
    where: { id: newsletterId },
    include: {
      content: {
        orderBy: { orderPosition: 'asc' },
      },
    },
  })

  if (!newsletter) {
    throw new Error('Newsletter not found')
  }

  // Only block real sends for already-sent newsletters (allow test sends)
  if (newsletter.status === 'SENT' && !options?.testRecipients) {
    throw new Error('Newsletter already sent')
  }

  // Get recipients
  let recipients: Array<{ id: string; email: string; firstName: string | null }>

  if (options?.testRecipients) {
    // Test mode: use provided emails
    recipients = options.testRecipients.map((email, index) => ({
      id: `test-${index}`,
      email,
      firstName: null,
    }))
  } else {
    // Production: fetch active subscribers
    recipients = await prisma.subscriber.findMany({
      where: { status: 'ACTIVE' },
      select: { id: true, email: true, firstName: true },
    })
  }

  if (recipients.length === 0) {
    throw new Error('No recipients found')
  }

  // Collect all contentIds to fetch related data
  const eventIds: string[] = []
  const articleIds: string[] = []

  for (const item of newsletter.content) {
    if (item.contentId) {
      if (item.contentType === 'EVENT' || item.contentType === 'SHOW') {
        eventIds.push(item.contentId)
      } else if (item.contentType === 'ARTICLE') {
        articleIds.push(item.contentId)
      }
    }
  }

  // Fetch events and articles data (search by both ID and slug for flexibility)
  const [events, articles] = await Promise.all([
    eventIds.length > 0
      ? prisma.event.findMany({
          where: {
            OR: [
              { id: { in: eventIds } },
              { slug: { in: eventIds } },
            ],
          },
        })
      : Promise.resolve([]),
    articleIds.length > 0
      ? prisma.article.findMany({
          where: {
            OR: [
              { id: { in: articleIds } },
              { slug: { in: articleIds } },
            ],
          },
        })
      : Promise.resolve([]),
  ])

  // Create lookup maps (by both id and slug for flexibility)
  const eventsMap = new Map<string, typeof events[0]>()
  events.forEach((e: typeof events[0]) => {
    eventsMap.set(e.id, e)
    eventsMap.set(e.slug, e)
  })
  const articlesMap = new Map<string, typeof articles[0]>()
  articles.forEach((a: typeof articles[0]) => {
    articlesMap.set(a.id, a)
    articlesMap.set(a.slug, a)
  })

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3004'

  // Helper to convert relative URLs to absolute URLs
  const toAbsoluteUrl = (url: string | null | undefined): string | undefined => {
    if (!url) return undefined
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url
    }
    return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`
  }

  // Build content sections for template
  const contentSections: ContentSection[] = []

  // Group newsletter content by section
  const sectionMap = new Map<string, { description?: string; items: Array<{ type: ContentItemType; data: ContentItemDataForEmail }> }>()

  for (const item of newsletter.content) {
    // CUSTOM_SECTION items are standalone - each one is its own section (same as preview)
    if (item.contentType === 'CUSTOM_SECTION') {
      contentSections.push({
        sectionHeading: item.sectionHeading || '',
        sectionDescription: item.sectionDescription || undefined,
        items: [], // No items - the heading/description IS the content
      })
      continue
    }

    const sectionHeading = item.sectionHeading || 'Aktuelles'

    if (!sectionMap.has(sectionHeading)) {
      sectionMap.set(sectionHeading, {
        description: item.sectionDescription || undefined,
        items: [],
      })
    }

    // Get the actual data based on content type
    let data: ContentItemDataForEmail | null = null
    let type: ContentItemType = 'custom'

    if (item.contentId) {
      if (item.contentType === 'EVENT' || item.contentType === 'SHOW') {
        const event = eventsMap.get(item.contentId)
        if (event) {
          // Format the date in German (same as preview)
          const eventDate = new Date(event.date)
          const formattedDate = eventDate.toLocaleDateString('de-DE', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })

          type = 'event'
          data = {
            title: event.title,
            description: event.subtitle || event.description.substring(0, 150) + '...',
            date: formattedDate,
            time: event.time,
            location: event.location,
            category: event.category,
            imageUrl: toAbsoluteUrl(event.imageUrl),
            eventUrl: `${baseUrl}/events/${event.slug}`,
            ctaUrl: event.ticketUrl || `${baseUrl}/events/${event.slug}`,
            ctaLabel: (() => {
              if (!event.ticketUrl) return 'Mehr erfahren';
              const isEmail = event.ticketUrl.includes('@') && !event.ticketUrl.startsWith('http');
              return isEmail ? 'Anmelden via Mail' : 'Tickets kaufen';
            })(),
          }
        }
      } else if (item.contentType === 'ARTICLE') {
        const article = articlesMap.get(item.contentId)
        if (article) {
          type = 'article'
          data = {
            title: article.title,
            excerpt: article.excerpt,
            imageUrl: toAbsoluteUrl(article.imageUrl),
            articleUrl: `${baseUrl}/news/${article.slug}`,
            category: article.category,
          }
        }
      }
    }

    // If data was found, add to section
    if (data) {
      sectionMap.get(sectionHeading)!.items.push({ type, data })
    }
  }

  // Convert map to sections array
  for (const [heading, section] of sectionMap) {
    if (section.items.length > 0) {
      contentSections.push({
        sectionHeading: heading,
        sectionDescription: section.description,
        items: section.items,
      })
    }
  }

  // Render all emails first (fast: just string generation, no network)
  const emailPayloads: Array<{
    from: string
    to: string
    subject: string
    html: string
    headers: Record<string, string>
    tags: Array<{ name: string; value: string }>
  }> = []

  for (const recipient of recipients) {
    const emailHtml = await render(
      NewsletterTemplate({
        subject: newsletter.subject,
        preheader: newsletter.preheader || undefined,
        newsletterSlug: newsletter.slug,
        heroImageUrl: toAbsoluteUrl(newsletter.heroImageUrl),
        heroTitle: newsletter.heroTitle || undefined,
        heroSubtitle: newsletter.heroSubtitle || undefined,
        heroCTALabel: newsletter.heroCTALabel || undefined,
        heroCTAUrl: toAbsoluteUrl(newsletter.heroCTAUrl),
        introText: newsletter.introText || undefined,
        contentSections,
        subscriberId: recipient.id,
        subscriberEmail: recipient.email,
        firstName: recipient.firstName || undefined,
      })
    )

    const unsubscribeUrl = `${baseUrl}/newsletter/unsubscribe/${recipient.id}`

    emailPayloads.push({
      from: DEFAULT_FROM_EMAIL,
      to: recipient.email,
      subject: newsletter.subject,
      html: emailHtml,
      headers: {
        'List-Unsubscribe': `<${unsubscribeUrl}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
      tags: [
        { name: 'type', value: 'newsletter' },
        { name: 'newsletter_id', value: newsletter.id },
        { name: 'subscriber_id', value: recipient.id },
      ],
    })
  }

  if (options?.dryRun) {
    return {
      success: emailPayloads.length,
      failed: 0,
      total: emailPayloads.length,
      results: emailPayloads.map((e) => ({ success: true, email: e.to, id: 'dry-run' })),
    }
  }

  // Send via Resend Batch API (up to 100 per call, way faster than one-by-one)
  let successCount = 0
  let failureCount = 0
  const allResults: Array<{ success: boolean; email: string; error?: string; id?: string }> = []

  // Split into chunks of 100 (Resend batch limit)
  for (let i = 0; i < emailPayloads.length; i += 100) {
    const chunk = emailPayloads.slice(i, i + 100)
    try {
      const batchResult = await resend.batch.send(chunk)

      if (batchResult.error) {
        console.error('[EMAIL] Batch API error:', batchResult.error)
        // Mark all in this chunk as failed
        for (const email of chunk) {
          failureCount++
          allResults.push({ success: false, email: email.to, error: batchResult.error.message })
        }
      } else {
        // Mark all in this chunk as success
        const ids = batchResult.data?.data || []
        for (let j = 0; j < chunk.length; j++) {
          successCount++
          allResults.push({ success: true, email: chunk[j].to, id: ids[j]?.id })
        }
      }
    } catch (error) {
      console.error('[EMAIL] Batch send exception:', error)
      for (const email of chunk) {
        failureCount++
        allResults.push({ success: false, email: email.to, error: error instanceof Error ? error.message : 'Unknown error' })
      }
    }
  }

  // Update newsletter status
  if (!options?.dryRun && !options?.testRecipients) {
    await prisma.newsletter.update({
      where: { id: newsletterId },
      data: {
        status: 'SENT',
        sentAt: new Date(),
        recipientCount: successCount,
      },
    })

    // Create or update stats record (unique on newsletter_id – z. B. bei Test-Versand oder erneutem Versand)
    await prisma.newsletterStats.upsert({
      where: { newsletterId: newsletter.id },
      create: {
        newsletterId: newsletter.id,
        sentCount: successCount,
      },
      update: {
        sentCount: successCount,
        updatedAt: new Date(),
      },
    })
  }

  // Log any failures
  const failures = allResults.filter(r => !r.success)
  if (failures.length > 0) {
    console.error('Newsletter send failures:', failures)
  }

  return {
    success: successCount,
    failed: failureCount,
    total: recipients.length,
    results: allResults,
  }
}
