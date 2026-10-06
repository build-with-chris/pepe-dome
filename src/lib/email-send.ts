/**
 * Email Sending Functions
 *
 * High-level functions for sending emails using Resend and React Email templates
 */

import { resend, DEFAULT_FROM_EMAIL, generateEmailUrls, batchSendEmails } from './resend'
import { prisma } from './prisma'
import { buildViewModelFromNewsletter } from './newsletter-content'
import { renderNewsletterText } from './newsletter-text'

/** Resend nimmt höchstens 100 Mails pro Batch-Aufruf. */
const NEWSLETTER_CHUNK_SIZE = 100

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
  const urls = generateEmailUrls(subscriber.unsubscribeToken, subscriber.doubleOptInToken, baseUrl)

  // Render email template — HTML + Plain-Text-Alternative.
  // Reine HTML-Mails ohne Text-Teil bekommen bei Gmail/Outlook einen höheren
  // Spam-Score; gerade die Bestätigungsmail muss aber zuverlässig ankommen.
  const confirmationEmail = ConfirmationEmail({
    confirmationUrl: urls.confirm,
    subscriberEmail: subscriber.email,
    firstName: subscriber.firstName || undefined,
  })
  const emailHtml = await render(confirmationEmail)
  const emailText = await render(confirmationEmail, { plainText: true })

  // Send via Resend
  // List-Unsubscribe-Header: von Gmail/Yahoo seit 2024 für Bulk-Mail gefordert.
  // Fehlt er (wie bisher bei der Bestätigung), landet schon die erste Mail
  // überdurchschnittlich oft im Spam — die Hauptursache der niedrigen
  // Bestätigungsrate.
  const result = await resend.emails.send({
    from: DEFAULT_FROM_EMAIL,
    to: subscriber.email,
    subject: 'Bestätige deine Newsletter-Anmeldung bei Pepe Dome',
    html: emailHtml,
    text: emailText,
    headers: {
      // One-Click-Variante: Der Provider schickt hierauf ein POST und erwartet
      // eine sofortige Abmeldung ohne Rückfrage (RFC 8058). Die Seite mit der
      // Rückfrage wäre hier falsch, sie würde nichts tun.
      'List-Unsubscribe': `<${urls.unsubscribeOneClick}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
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
  const urls = generateEmailUrls(subscriber.unsubscribeToken)

  // Render email template — HTML + Plain-Text-Alternative (Deliverability)
  const welcomeEmail = WelcomeEmail({
    subscriberId: subscriber.id,
    subscriberEmail: subscriber.email,
    firstName: subscriber.firstName || undefined,
    upcomingEventsUrl: `${urls.home}/events`,
    newsletterArchiveUrl: `${urls.home}/newsletter`,
    // Für Menschen: Seite mit Rückfrage, nicht der One-Click-Endpunkt
    unsubscribeUrl: urls.unsubscribe,
  })
  const emailHtml = await render(welcomeEmail)
  const emailText = await render(welcomeEmail, { plainText: true })

  // Send via Resend
  const unsubscribeUrl = urls.unsubscribeOneClick
  const result = await resend.emails.send({
    from: DEFAULT_FROM_EMAIL,
    to: subscriber.email,
    subject: 'Willkommen beim Pepe Dome Newsletter!',
    html: emailHtml,
    text: emailText,
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
    /** Resume mode: send only to ACTIVE subscribers who do NOT yet have a SENT NewsletterEvent for this newsletter. Allows status === 'SENT'. */
    resumeMissing?: boolean
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

  // Only block real sends for already-sent newsletters (allow test sends and resume-missing).
  // SENDING zählt mit: Ein abgebrochener Versand steht dort, und ein zweiter
  // voller Versand ginge an alle, die ihn schon bekommen haben.
  if (
    (newsletter.status === 'SENT' || newsletter.status === 'SENDING') &&
    !options?.testRecipients &&
    !options?.resumeMissing
  ) {
    throw new Error('Newsletter already sent')
  }

  // Get recipients
  let recipients: Array<{
    id: string
    email: string
    firstName: string | null
    /**
     * null bei Testempfängern: Sie stehen nicht in der Abonnententabelle und
     * haben deshalb kein Abmelde-Token. Ein Platzhalter wäre schlimmer als
     * nichts — er ergäbe einen Link, der aussieht wie ein Abmeldelink, aber
     * nie jemanden austrägt.
     */
    unsubscribeToken: string | null
  }>

  if (options?.testRecipients) {
    // Test mode: use provided emails
    recipients = options.testRecipients.map((email, index) => ({
      id: `test-${index}`,
      email,
      firstName: null,
      unsubscribeToken: null,
    }))
  } else {
    // Production: fetch active subscribers
    const allActive = await prisma.subscriber.findMany({
      where: { status: 'ACTIVE' },
      select: { id: true, email: true, firstName: true, unsubscribeToken: true },
    })

    if (options?.resumeMissing) {
      // Exclude subscribers who already have a SENT event for this newsletter
      const alreadySent = await prisma.newsletterEvent.findMany({
        where: {
          newsletterId,
          eventType: 'SENT',
          subscriberId: { not: null },
        },
        select: { subscriberId: true },
      })
      const sentIds = new Set(
        alreadySent
          .map((e: { subscriberId: string | null }) => e.subscriberId)
          .filter((id: string | null): id is string => id !== null)
      )
      recipients = allActive.filter((s: { id: string }) => !sentIds.has(s.id))
    } else {
      recipients = allActive
    }
  }

  if (recipients.length === 0) {
    throw new Error('No recipients found')
  }

  // Inhalt aufbereiten: gemeinsames Viewmodel, damit Versand und Vorschau
  // garantiert dieselbe Struktur und dieselbe Gewichtung verwenden.
  const viewModel = await buildViewModelFromNewsletter(newsletter)
  const baseUrl = viewModel.baseUrl

  type Recipient = (typeof recipients)[number]

  const buildPayload = async (recipient: Recipient) => {
    // Für Menschen: Seite mit Rückfrage. Für den Provider-Knopf: One-Click-POST.
    // Ohne Token (Testversand) zeigt der Fussbereich auf die Newsletter-Seite,
    // und der List-Unsubscribe-Header entfällt ganz.
    const unsubscribeUrl = recipient.unsubscribeToken
      ? `${baseUrl}/newsletter/unsubscribe/${recipient.unsubscribeToken}`
      : `${baseUrl}/newsletter`
    const unsubscribeOneClickUrl = recipient.unsubscribeToken
      ? `${baseUrl}/api/subscribers/unsubscribe?token=${recipient.unsubscribeToken}`
      : null

    const newsletterEmail = NewsletterTemplate({
      viewModel,
      subscriberId: recipient.id,
      subscriberEmail: recipient.email,
      firstName: recipient.firstName || undefined,
      unsubscribeUrl,
    })

    const emailHtml = await render(newsletterEmail)
    const emailText = renderNewsletterText(viewModel, {
      firstName: recipient.firstName || undefined,
      unsubscribeUrl,
      subscriberEmail: recipient.email,
    })

    return {
      from: DEFAULT_FROM_EMAIL,
      to: recipient.email,
      subject: newsletter.subject,
      html: emailHtml,
      text: emailText,
      // Der Header nur, wenn dahinter auch wirklich eine Abmeldung steht.
      // Ein One-Click-Knopf, der nichts tut, ist beim Empfänger schlimmer als
      // gar keiner: Er hält sich für abgemeldet und bekommt weiter Post.
      headers: unsubscribeOneClickUrl
        ? ({
            'List-Unsubscribe': `<${unsubscribeOneClickUrl}>`,
            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
          } as Record<string, string>)
        : ({} as Record<string, string>),
      tags: [
        { name: 'type', value: 'newsletter' },
        { name: 'newsletter_id', value: newsletter.id },
        { name: 'subscriber_id', value: recipient.id },
      ],
    }
  }

  if (options?.dryRun) {
    for (const recipient of recipients) await buildPayload(recipient)
    return {
      success: recipients.length,
      failed: 0,
      total: recipients.length,
      results: recipients.map((r) => ({ success: true, email: r.email, id: 'dry-run' })),
    }
  }

  const isRealSend = !options?.testRecipients

  /**
   * Echter Versand: erst sperren, dann blockweise senden und sofort buchen.
   *
   * Früher wurden alle Mails zuerst gebaut, dann verschickt, und erst ganz am
   * Ende standen Status, Empfängerzahl und SENT-Ereignisse in der Datenbank.
   * Brach die Funktion dazwischen ab, vermutlich an der Zeitgrenze von Vercel,
   * waren die Mails draußen, in der Datenbank stand aber nichts: Der
   * Newsletter blieb ein Entwurf mit 0 Empfängern, die Öffnungsrate damit bei
   * 0 %, und der Knopf "Senden" hätte alles ein zweites Mal verschickt. So
   * geschehen im August 2026 mit "Nudeln mit Banane".
   *
   * Jetzt ist der Stand nach jedem Block gespeichert. Bricht der Lauf ab,
   * steht der Newsletter auf SENDING, die bisherigen Empfänger sind gebucht,
   * und "An fehlende senden" macht genau dort weiter.
   */
  const originalStatus = newsletter.status
  if (isRealSend) {
    if (options?.resumeMissing) {
      await prisma.newsletter.update({
        where: { id: newsletter.id },
        data: { status: 'SENDING' },
      })
    } else {
      // Bedingtes Update als Sperre: Zwei gleichzeitige Klicks auf "Senden"
      // (oder Klick plus Cron) können nicht beide durchkommen.
      const claimed = await prisma.newsletter.updateMany({
        where: { id: newsletter.id, status: { in: ['DRAFT', 'SCHEDULED'] } },
        data: { status: 'SENDING', sentAt: new Date(), recipientCount: 0 },
      })
      if (claimed.count === 0) {
        throw new Error('Newsletter already sent')
      }
    }

    await prisma.newsletterStats.upsert({
      where: { newsletterId: newsletter.id },
      create: { newsletterId: newsletter.id, sentCount: 0 },
      // Ein neuer Versand zählt von vorn, ein Nachversand zählt weiter.
      update: options?.resumeMissing ? {} : { sentCount: 0, updatedAt: new Date() },
    })
  }

  let successCount = 0
  let failureCount = 0
  const allResults: Array<{ success: boolean; email: string; error?: string; id?: string }> = []

  // Resend Batch API: bis zu 100 Mails pro Aufruf
  for (let i = 0; i < recipients.length; i += NEWSLETTER_CHUNK_SIZE) {
    const chunkRecipients = recipients.slice(i, i + NEWSLETTER_CHUNK_SIZE)
    const chunk = []
    for (const recipient of chunkRecipients) chunk.push(await buildPayload(recipient))

    const chunkResults: Array<{ success: boolean; email: string; error?: string; id?: string }> = []
    try {
      const batchResult = await resend.batch.send(chunk)

      if (batchResult.error) {
        console.error('[EMAIL] Batch API error:', batchResult.error)
        for (const email of chunk) {
          chunkResults.push({ success: false, email: email.to, error: batchResult.error.message })
        }
      } else {
        const ids = batchResult.data?.data || []
        for (let j = 0; j < chunk.length; j++) {
          chunkResults.push({ success: true, email: chunk[j].to, id: ids[j]?.id })
        }
      }
    } catch (error) {
      console.error('[EMAIL] Batch send exception:', error)
      for (const email of chunk) {
        chunkResults.push({
          success: false,
          email: email.to,
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }

    const chunkSuccess = chunkResults.filter((r) => r.success).length
    successCount += chunkSuccess
    failureCount += chunkResults.length - chunkSuccess
    allResults.push(...chunkResults)

    if (isRealSend && chunkSuccess > 0) {
      // resendEventId = Resend email_id: nötig, damit der Webhook Opens/Clicks
      // auch dann zuordnen kann, wenn Resend keine Tags im Payload mitschickt.
      const sentRows = chunkResults
        .map((result, k) =>
          result.success
            ? {
                newsletterId: newsletter.id,
                subscriberId: chunkRecipients[k].id,
                eventType: 'SENT' as const,
                resendEventId: result.id ?? null,
              }
            : null
        )
        .filter((row): row is NonNullable<typeof row> => row !== null)

      await prisma.newsletterEvent.createMany({ data: sentRows })
      await prisma.newsletter.update({
        where: { id: newsletter.id },
        data: { recipientCount: { increment: chunkSuccess } },
      })
      await prisma.newsletterStats.update({
        where: { newsletterId: newsletter.id },
        data: { sentCount: { increment: chunkSuccess }, updatedAt: new Date() },
      })
    }
  }

  if (isRealSend) {
    // Ging gar nichts raus, zurück auf den alten Stand, damit sich der Versand
    // neu anstossen lässt. Sonst gilt der Newsletter als versendet.
    const nothingSent = successCount === 0 && !options?.resumeMissing
    await prisma.newsletter.update({
      where: { id: newsletter.id },
      data: nothingSent
        ? { status: originalStatus, sentAt: null }
        : { status: 'SENT' },
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
