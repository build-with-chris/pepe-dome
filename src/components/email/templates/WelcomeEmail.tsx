import 'server-only'

/**
 * Welcome Email Template
 *
 * Sent after successful double opt-in confirmation
 */

import {
  Html as EmailHtml,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Hr,
} from '@react-email/components';
import { EmailHeader } from '../components/EmailHeader';
import { EmailFooter } from '../components/EmailFooter';
import { EmailButton } from '../components/EmailButton';

interface WelcomeEmailProps {
  subscriberId: string;
  subscriberEmail: string;
  firstName?: string;
  upcomingEventsUrl?: string;
  newsletterArchiveUrl?: string;
}

export default function WelcomeEmail({
  subscriberId,
  subscriberEmail,
  firstName,
  upcomingEventsUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3004'}/events`,
  newsletterArchiveUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3004'}/newsletter`,
}: WelcomeEmailProps) {
  const previewText = 'Willkommen beim PEPE Dome Newsletter!';
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3004';
  const unsubscribeUrl = `${baseUrl}/api/subscribers/unsubscribe?id=${subscriberId}`;

  return (
    <EmailHtml lang="de">
      <Head>
        <title>Willkommen beim PEPE Dome Newsletter</title>
      </Head>
      <Preview>{previewText}</Preview>
      <Body
        style={{
          backgroundColor: '#F5F5F5',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          margin: 0,
          padding: 0,
        }}
      >
        <Container
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            backgroundColor: '#FFFFFF',
          }}
        >
          {/* Header */}
          <EmailHeader />

          {/* Main Content */}
          <Section
            style={{
              padding: '48px 32px',
            }}
          >
            {/* Greeting */}
            <Text
              style={{
                fontSize: '28px',
                fontWeight: '700',
                lineHeight: '1.3',
                color: '#0F0520',
                margin: '0 0 24px 0',
                textAlign: 'center',
              }}
            >
              Willkommen{firstName ? `, ${firstName}` : ''}!
            </Text>

            {/* Welcome Message */}
            <Text
              style={{
                fontSize: '18px',
                lineHeight: '1.6',
                color: '#333333',
                margin: '0 0 24px 0',
                textAlign: 'center',
              }}
            >
              Du bist jetzt Teil der PEPE Dome Community!
            </Text>

            <Text
              style={{
                fontSize: '16px',
                lineHeight: '1.6',
                color: '#333333',
                margin: '0 0 24px 0',
              }}
            >
              Vielen Dank fur deine Anmeldung. Ab sofort erhaltst du regelmassig Updates
              zu unseren Shows, Events, Workshops und allem, was im PEPE Dome passiert.
            </Text>

            <Hr
              style={{
                border: 'none',
                borderTop: '1px solid #E5E5E5',
                margin: '32px 0',
              }}
            />

            {/* What to Expect */}
            <Text
              style={{
                fontSize: '20px',
                fontWeight: '700',
                lineHeight: '1.3',
                color: '#0F0520',
                margin: '0 0 16px 0',
              }}
            >
              Was dich erwartet
            </Text>

            <Text
              style={{
                fontSize: '16px',
                lineHeight: '1.6',
                color: '#333333',
                margin: '0 0 12px 0',
              }}
            >
              <strong style={{ color: '#016dca' }}>Exklusive Ankundigungen</strong>
              <br />
              Sei der Erste, der von neuen Shows und Events erfahrt.
            </Text>

            <Text
              style={{
                fontSize: '16px',
                lineHeight: '1.6',
                color: '#333333',
                margin: '0 0 12px 0',
              }}
            >
              <strong style={{ color: '#016dca' }}>Backstage-Einblicke</strong>
              <br />
              Erfahre mehr uber die Kunstler und das Team hinter den Kulissen.
            </Text>

            <Text
              style={{
                fontSize: '16px',
                lineHeight: '1.6',
                color: '#333333',
                margin: '0 0 24px 0',
              }}
            >
              <strong style={{ color: '#016dca' }}>Special Offers</strong>
              <br />
              Erhalte gelegentlich besondere Angebote und Early-Bird-Tickets.
            </Text>

            <Hr
              style={{
                border: 'none',
                borderTop: '1px solid #E5E5E5',
                margin: '32px 0',
              }}
            />

            {/* Call to Action */}
            <Text
              style={{
                fontSize: '20px',
                fontWeight: '700',
                lineHeight: '1.3',
                color: '#0F0520',
                margin: '0 0 16px 0',
                textAlign: 'center',
              }}
            >
              Entdecke, was gerade lauft
            </Text>

            <Section
              style={{
                textAlign: 'center',
                margin: '24px 0',
              }}
            >
              <EmailButton href={upcomingEventsUrl}>
                Aktuelle Events ansehen
              </EmailButton>
            </Section>

            <Text
              style={{
                fontSize: '14px',
                lineHeight: '1.6',
                color: '#666666',
                margin: '24px 0 0 0',
                textAlign: 'center',
              }}
            >
              Du kannst auch unsere{' '}
              <a
                href={newsletterArchiveUrl}
                style={{
                  color: '#016dca',
                  textDecoration: 'none',
                }}
              >
                vergangenen Newsletter
              </a>{' '}
              durchstobern.
            </Text>
          </Section>

          {/* Footer */}
          <EmailFooter
            unsubscribeUrl={unsubscribeUrl}
            subscriberEmail={subscriberEmail}
          />
        </Container>
      </Body>
    </EmailHtml>
  );
}
