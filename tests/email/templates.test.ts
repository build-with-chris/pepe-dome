/**
 * Email Template Tests
 *
 * Tests for email rendering and template generation
 */

import { describe, it, expect } from 'vitest'
import { renderEmailToHtml, replaceTemplateVariables, generateUnsubscribeUrl, generateNewsletterUrl } from '@/lib/email-renderer'
import ConfirmationEmail from '@/components/email/templates/ConfirmationEmail'
import WelcomeEmail from '@/components/email/templates/WelcomeEmail'
import NewsletterTemplate from '@/components/email/templates/NewsletterTemplate'

describe('Email Rendering', () => {
  it('should render ConfirmationEmail with required props', async () => {
    const html = await renderEmailToHtml(ConfirmationEmail, {
      confirmationUrl: 'https://example.com/confirm?token=abc123',
      subscriberEmail: 'test@example.com',
      firstName: 'Max',
    })

    expect(html).toBeTruthy()
    expect(html).toContain('Bestätige deine Newsletter-Anmeldung')
    expect(html).toContain('Hallo Max!')
    expect(html).toContain('https://example.com/confirm?token=abc123')
    expect(html).toContain('test@example.com')
  })

  it('should render WelcomeEmail after confirmation', async () => {
    const html = await renderEmailToHtml(WelcomeEmail, {
      subscriberId: 'test-subscriber-123',
      subscriberEmail: 'test@example.com',
      firstName: 'Anna',
      upcomingEventsUrl: 'https://example.com/events',
      newsletterArchiveUrl: 'https://example.com/newsletter',
    })

    expect(html).toBeTruthy()
    expect(html).toContain('Willkommen')
    expect(html).toContain('Anna')
    expect(html).toContain('https://example.com/events')
    expect(html).toContain('PEPE Dome Community')
  })

  it('should render NewsletterTemplate with hero image and content sections', async () => {
    const html = await renderEmailToHtml(NewsletterTemplate, {
      subject: 'November Newsletter',
      preheader: 'Die neuesten Events im PEPE Dome',
      newsletterSlug: '2025-11-newsletter',
      heroImageUrl: 'https://example.com/hero.jpg',
      heroTitle: 'Das passiert im November',
      heroSubtitle: 'Shows, Events & mehr',
      heroCTALabel: 'Jetzt ansehen',
      heroCTAUrl: 'https://example.com/events',
      contentSections: [
        {
          sectionHeading: 'Upcoming Shows',
          sectionDescription: 'Die besten Shows diesen Monat',
          items: [
            {
              type: 'event',
              data: {
                title: 'Comedy Night',
                date: '15. November 2025',
                time: '20:00 Uhr',
                location: 'PEPE Dome, München',
                description: 'Eine unvergessliche Comedy-Show',
                ctaUrl: 'https://example.com/event/comedy-night',
                ctaLabel: 'Tickets sichern',
              },
            },
          ],
        },
      ],
      subscriberId: 'test-subscriber-456',
      subscriberEmail: 'subscriber@example.com',
      firstName: 'Julia',
    })

    expect(html).toBeTruthy()
    expect(html).toContain('Das passiert im November')
    expect(html).toContain('Upcoming Shows')
    expect(html).toContain('Comedy Night')
    expect(html).toContain('Julia')
  })

  it('should include unsubscribe link in newsletter footer', async () => {
    const html = await renderEmailToHtml(NewsletterTemplate, {
      subject: 'Test Newsletter',
      newsletterSlug: 'test-newsletter',
      contentSections: [],
      subscriberId: 'test-subscriber-789',
      subscriberEmail: 'test@example.com',
    })

    expect(html).toContain('unsubscribe')
    expect(html).toContain('test-subscriber-789')
  })

  it('should replace template variables in HTML', () => {
    const template = '<p>Hello {{name}}! Visit {{url}} to continue.</p>'
    const result = replaceTemplateVariables(template, {
      name: 'John',
      url: 'https://example.com',
    })

    expect(result).toBe('<p>Hello John! Visit https://example.com to continue.</p>')
  })

  it('should generate correct unsubscribe URL', () => {
    const url = generateUnsubscribeUrl('subscriber-123', 'https://pepedome.com')
    expect(url).toBe('https://pepedome.com/api/subscribers/unsubscribe?id=subscriber-123')
  })

  it('should generate correct newsletter view URL', () => {
    const url = generateNewsletterUrl('2025-11-dome-premiere', 'https://pepedome.com')
    expect(url).toBe('https://pepedome.com/newsletter/2025-11-dome-premiere')
  })
})
