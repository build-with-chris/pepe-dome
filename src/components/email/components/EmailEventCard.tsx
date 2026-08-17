import 'server-only'

/**
 * Drei Darstellungen für Veranstaltungen
 *
 * Der frühere Newsletter hat jeden Termin in dieselbe Karte mit demselben
 * blauen Button gepackt. Bei sieben Veranstaltungen liest sich das wie ein
 * Datenbankexport, und der Empfänger muss selbst entscheiden, was wichtig
 * ist. Diese drei Stufen nehmen ihm die Entscheidung ab:
 *
 *   EmailLeadEvent    Aufmacher: großes Bild, Text, ein primärer Button
 *   EmailFeatureEvent zweite Reihe: kleineres Bild, Kurztext, Sekundärlink
 *   EmailEventRow     weitere Termine: Datumsfeld, Titel, Ort, kein Bild
 */

import { Section, Row, Column, Img, Text, Link, Hr } from '@react-email/components'
import { EmailButton, EmailInlineLink } from './EmailButton'
import { emailTheme, emailText } from '../theme'
import type { NewsletterEventItem } from '@/lib/newsletter-content'

const CONTENT_WIDTH = emailTheme.size.container - emailTheme.size.gutter * 2

/** "Sa, 15. August · 20:00 Uhr" */
function metaLine(event: NewsletterEventItem): string {
  const parts = [event.dateLabel]
  if (event.time) parts.push(event.time)
  return parts.join(' · ')
}

export function EmailLeadEvent({ event }: { event: NewsletterEventItem }) {
  return (
    <Section
      style={{
        backgroundColor: emailTheme.color.surfaceRaised,
        borderRadius: '14px',
        overflow: 'hidden',
        border: `1px solid ${emailTheme.color.line}`,
      }}
    >
      {event.imageUrl && (
        <Link href={event.detailUrl}>
          <Img
            src={event.imageUrl}
            alt={event.title}
            width={CONTENT_WIDTH}
            style={{
              display: 'block',
              width: '100%',
              maxWidth: '100%',
              border: 'none',
              outline: 'none',
            }}
          />
        </Link>
      )}

      <Section style={{ padding: '26px 24px 28px 24px' }}>
        {event.categoryLabel && <Text style={emailText.eyebrow}>{event.categoryLabel}</Text>}

        <Text style={emailText.leadTitle}>
          <Link href={event.detailUrl} style={{ color: emailTheme.color.textStrong, textDecoration: 'none' }}>
            {event.title}
          </Link>
        </Text>

        <Text
          style={{
            fontSize: '15px',
            fontWeight: '600',
            lineHeight: '1.5',
            color: emailTheme.color.accentText,
            margin: '0 0 4px 0',
          }}
        >
          {metaLine(event)}
        </Text>

        {event.location && (
          <Text style={{ ...emailText.meta, margin: '0 0 16px 0' }}>{event.location}</Text>
        )}

        {event.teaser && (
          <Text style={{ ...emailText.body, margin: '0 0 22px 0' }}>{event.teaser}</Text>
        )}

        <EmailButton href={event.ctaUrl} variant="primary">
          {event.ctaLabel}
        </EmailButton>

        {event.price && (
          <Text style={{ ...emailText.small, margin: '12px 0 0 0' }}>{event.price}</Text>
        )}
      </Section>
    </Section>
  )
}

export function EmailFeatureEvent({ event }: { event: NewsletterEventItem }) {
  return (
    <Section
      style={{
        backgroundColor: emailTheme.color.surface,
        borderRadius: '12px',
        border: `1px solid ${emailTheme.color.lineSoft}`,
        marginBottom: '14px',
      }}
    >
      {event.imageUrl && (
        <Section style={{ padding: '14px 14px 0 14px' }}>
          <Link href={event.detailUrl}>
            <Img
              src={event.imageUrl}
              alt={event.title}
              width={CONTENT_WIDTH - 28}
              style={{
                display: 'block',
                width: '100%',
                maxWidth: '100%',
                borderRadius: '8px',
                border: 'none',
                outline: 'none',
              }}
            />
          </Link>
        </Section>
      )}

      <Section style={{ padding: '18px 20px 20px 20px' }}>
        <Text style={emailText.cardTitle}>
          <Link href={event.detailUrl} style={{ color: emailTheme.color.textStrong, textDecoration: 'none' }}>
            {event.title}
          </Link>
        </Text>

        <Text
          style={{
            fontSize: '14px',
            fontWeight: '600',
            lineHeight: '1.5',
            color: emailTheme.color.accentText,
            margin: '0 0 4px 0',
          }}
        >
          {metaLine(event)}
        </Text>

        {event.location && (
          <Text style={{ ...emailText.meta, margin: '0 0 14px 0' }}>{event.location}</Text>
        )}

        {event.teaser && (
          <Text style={{ ...emailText.body, fontSize: '15px', margin: '0 0 16px 0' }}>
            {event.teaser}
          </Text>
        )}

        <EmailInlineLink href={event.ctaUrl}>{event.ctaLabel}</EmailInlineLink>
      </Section>
    </Section>
  )
}

/**
 * Terminzeile ohne Bild.
 *
 * Zweispaltige Tabelle statt Flexbox: das feste Datumsfeld links bleibt
 * auch in Outlook und in schmalen mobilen Clients an seinem Platz, ohne
 * dass ein Umbruch nötig wäre.
 */
export function EmailEventRow({ event, isLast = false }: { event: NewsletterEventItem; isLast?: boolean }) {
  return (
    <>
      <Row style={{ marginBottom: '0' }}>
        <Column
          width={64}
          style={{
            width: '64px',
            verticalAlign: 'top',
            paddingTop: '14px',
            paddingBottom: '14px',
          }}
        >
          <Section
            style={{
              backgroundColor: emailTheme.color.accentSoft,
              borderRadius: '8px',
              padding: '8px 0',
              textAlign: 'center',
              width: '56px',
            }}
          >
            <Text
              style={{
                fontSize: '20px',
                fontWeight: '700',
                lineHeight: '1.1',
                color: emailTheme.color.textStrong,
                margin: '0',
                textAlign: 'center',
              }}
            >
              {event.dayLabel}
            </Text>
            <Text
              style={{
                fontSize: '11px',
                fontWeight: '700',
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                lineHeight: '1.2',
                color: emailTheme.color.accentText,
                margin: '2px 0 0 0',
                textAlign: 'center',
              }}
            >
              {event.monthLabel}
            </Text>
          </Section>
        </Column>

        <Column
          style={{
            verticalAlign: 'top',
            paddingTop: '16px',
            paddingBottom: '16px',
            paddingLeft: '14px',
          }}
        >
          <Text style={emailText.rowTitle}>
            <Link href={event.detailUrl} style={{ color: emailTheme.color.textStrong, textDecoration: 'none' }}>
              {event.title}
            </Link>
          </Text>

          <Text style={{ ...emailText.meta, fontSize: '13px', margin: '0 0 8px 0' }}>
            {[event.spanLabel || event.weekdayLabel, event.time, event.location]
              .filter(Boolean)
              .join(' · ')}
          </Text>

          <EmailInlineLink href={event.ctaUrl}>{event.ctaLabel}</EmailInlineLink>
        </Column>
      </Row>

      {!isLast && (
        <Hr style={{ border: 'none', borderTop: `1px solid ${emailTheme.color.lineSoft}`, margin: '0' }} />
      )}
    </>
  )
}
