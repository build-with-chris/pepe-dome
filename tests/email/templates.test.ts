/**
 * Tests für das E-Mail-Rendering
 *
 * Prüfen, dass die drei Template-Typen ohne Fehler rendern und die für
 * Zustellbarkeit und Recht wichtigen Bestandteile enthalten sind.
 */

import { describe, it, expect } from 'vitest'
import {
  renderEmailToHtml,
  replaceTemplateVariables,
  generateUnsubscribeUrl,
  generateNewsletterUrl,
} from '@/lib/email-renderer'
import { buildViewModel } from '@/lib/newsletter-content'
import ConfirmationEmail from '@/components/email/templates/ConfirmationEmail'
import WelcomeEmail from '@/components/email/templates/WelcomeEmail'
import NewsletterTemplate from '@/components/email/templates/NewsletterTemplate'

const BASE = 'https://pepe-dome.de'

function demoViewModel(eventCount = 3) {
  const events = new Map()
  for (let index = 0; index < eventCount; index++) {
    events.set(`event-${index}`, {
      id: `event-${index}`,
      slug: `event-${index}`,
      title: `Comedy Night ${index}`,
      subtitle: null,
      description: 'Eine unvergessliche Comedy-Show mit einem sehr langen Beschreibungstext.',
      date: new Date('2026-11-15T19:00:00.000Z'),
      time: '20:00 Uhr',
      location: 'PEPE Dome, München',
      category: 'SHOW',
      ticketUrl: 'https://tickets.example.com/comedy',
      price: null,
      imageUrl: '/images/comedy.jpg',
    })
  }

  const newsletter = {
    slug: '2026-11-newsletter',
    subject: 'November im Dome',
    preheader: 'Die neuesten Events im PEPE Dome',
    introText: 'kurzer Einstieg in die Ausgabe.',
    heroImageUrl: '/images/hero.jpg',
    heroTitle: 'Das passiert im November',
    heroSubtitle: 'Shows, Events und mehr',
    heroCTALabel: 'Jetzt ansehen',
    heroCTAUrl: 'https://pepe-dome.de/events',
    content: Array.from({ length: eventCount }, (_, index) => ({
      contentType: 'EVENT',
      contentId: `event-${index}`,
      sectionHeading: 'Shows im November',
      sectionDescription: null,
      orderPosition: index,
    })),
  }

  return buildViewModel(newsletter as never, { events, articles: new Map() } as never, {
    baseUrl: BASE,
  })
}

describe('E-Mail-Rendering', () => {
  it('rendert die Bestätigungsmail mit einer klaren Handlung', async () => {
    const html = await renderEmailToHtml(ConfirmationEmail, {
      confirmationUrl: 'https://pepe-dome.de/newsletter/confirm?token=abc123',
      subscriberEmail: 'test@example.com',
      firstName: 'Max',
    })

    expect(html).toContain('Max')
    expect(html).toContain('https://pepe-dome.de/newsletter/confirm?token=abc123')
    // Bestätigungsmail hat bewusst keinen Abmeldelink
    expect(html).not.toContain('Newsletter abbestellen')
    // aber die gesetzliche Anbieterkennzeichnung
    expect(html).toContain('Impressum')
  })

  it('rendert die Willkommensmail nach der Bestätigung', async () => {
    const html = await renderEmailToHtml(WelcomeEmail, {
      subscriberId: 'sub-123',
      subscriberEmail: 'test@example.com',
      firstName: 'Anna',
      upcomingEventsUrl: 'https://pepe-dome.de/events',
      newsletterArchiveUrl: 'https://pepe-dome.de/newsletter',
      // Muss von aussen kommen: Die Abmeldung braucht das persönliche Token
      // des Abonnenten, nicht seine ID.
      unsubscribeUrl: 'https://pepe-dome.de/newsletter/unsubscribe/tok-abc',
    })

    expect(html).toContain('Anna')
    expect(html).toContain('https://pepe-dome.de/events')
    // Ab hier gibt es etwas abzubestellen
    expect(html).toContain('Newsletter abbestellen')
    // Und zwar über das Token, nicht über die Subscriber-ID
    expect(html).toContain('/newsletter/unsubscribe/tok-abc')
    expect(html).not.toContain('/newsletter/unsubscribe/sub-123')
  })

  it('rendert den Newsletter mit Hero und Inhalten', async () => {
    const html = await renderEmailToHtml(NewsletterTemplate, {
      viewModel: demoViewModel(3),
      subscriberId: 'sub-456',
      subscriberEmail: 'subscriber@example.com',
      firstName: 'Julia',
    })

    expect(html).toContain('Das passiert im November')
    expect(html).toContain('Shows im November')
    expect(html).toContain('Comedy Night 0')
    expect(html).toContain('Julia')
  })

  it('enthält einen personalisierten Abmeldelink im Footer', async () => {
    const html = await renderEmailToHtml(NewsletterTemplate, {
      viewModel: demoViewModel(1),
      subscriberId: 'sub-789',
      subscriberEmail: 'test@example.com',
      unsubscribeUrl: 'https://pepe-dome.de/newsletter/unsubscribe/sub-789',
    })

    expect(html).toContain('unsubscribe/sub-789')
  })

  it('setzt Dark-Mode-Meta, damit Clients die Farben nicht aufhellen', async () => {
    const html = await renderEmailToHtml(NewsletterTemplate, {
      viewModel: demoViewModel(1),
      subscriberId: 'sub-1',
      subscriberEmail: 'test@example.com',
    })

    expect(html).toContain('color-scheme')
  })

  it('trägt UTM-Parameter in die Ticket-Links', async () => {
    const html = await renderEmailToHtml(NewsletterTemplate, {
      viewModel: demoViewModel(1),
      subscriberId: 'sub-1',
      subscriberEmail: 'test@example.com',
    })

    expect(html).toContain('utm_campaign=2026-11-newsletter')
    expect(html).toContain('utm_content=lead_ticket')
  })

  it('ersetzt Template-Variablen im HTML', () => {
    const result = replaceTemplateVariables('<p>Hallo {{name}}! Besuche {{url}}.</p>', {
      name: 'John',
      url: 'https://example.com',
    })
    expect(result).toBe('<p>Hallo John! Besuche https://example.com.</p>')
  })

  /**
   * Der Abmeldelink trägt das persönliche Token, nicht die Subscriber-ID.
   * Die ID ist kein Geheimnis — sie steht in jedem Export und in jeder
   * Admin-Ansicht. Mit ihr als Parameter hätte jeder, der eine ID kennt, die
   * zugehörige Person austragen können.
   */
  it('erzeugt die Abmelde-URL über das Token, nicht über die ID', () => {
    const url = generateUnsubscribeUrl('tok-abc123', 'https://pepe-dome.de')

    expect(url).toBe('https://pepe-dome.de/api/subscribers/unsubscribe?token=tok-abc123')
    expect(url).not.toContain('?id=')
  })

  it('erzeugt die korrekte Newsletter-URL', () => {
    expect(generateNewsletterUrl('2026-11-premiere', 'https://pepe-dome.de')).toBe(
      'https://pepe-dome.de/newsletter/2026-11-premiere'
    )
  })
})
