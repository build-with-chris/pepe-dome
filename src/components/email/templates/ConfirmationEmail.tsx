/**
 * Confirmation Email Template
 *
 * Sent for double opt-in confirmation when a user subscribes to the newsletter
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

interface ConfirmationEmailProps {
  confirmationUrl: string;
  subscriberEmail: string;
  firstName?: string;
}

export default function ConfirmationEmail({
  confirmationUrl,
  subscriberEmail,
  firstName,
}: ConfirmationEmailProps) {
  const previewText = 'Bestatige deine Newsletter-Anmeldung fur PEPE Dome';

  return (
    <EmailHtml lang="de">
      <Head>
        <title>Bestatige deine Newsletter-Anmeldung</title>
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
                fontSize: '24px',
                fontWeight: '700',
                lineHeight: '1.3',
                color: '#0F0520',
                margin: '0 0 24px 0',
                textAlign: 'center',
              }}
            >
              {firstName ? `Hallo ${firstName}!` : 'Hallo!'}
            </Text>

            {/* Body Text */}
            <Text
              style={{
                fontSize: '16px',
                lineHeight: '1.6',
                color: '#333333',
                margin: '0 0 24px 0',
              }}
            >
              Vielen Dank fur dein Interesse an unserem Newsletter! Um deine Anmeldung
              abzuschliessen, bestatige bitte deine E-Mail-Adresse.
            </Text>

            {/* CTA Button */}
            <Section
              style={{
                textAlign: 'center',
                margin: '32px 0',
              }}
            >
              <EmailButton href={confirmationUrl}>
                Jetzt bestatigen
              </EmailButton>
            </Section>

            <Hr
              style={{
                border: 'none',
                borderTop: '1px solid #E5E5E5',
                margin: '32px 0',
              }}
            />

            {/* Alternative Link */}
            <Text
              style={{
                fontSize: '14px',
                lineHeight: '1.6',
                color: '#666666',
                margin: '0',
              }}
            >
              Falls der Button nicht funktioniert, kopiere bitte diesen Link in deinen
              Browser:
              <br />
              <a
                href={confirmationUrl}
                style={{
                  color: '#D4A574',
                  wordBreak: 'break-all',
                }}
              >
                {confirmationUrl}
              </a>
            </Text>

            {/* Info Text */}
            <Text
              style={{
                fontSize: '14px',
                lineHeight: '1.6',
                color: '#999999',
                margin: '24px 0 0 0',
              }}
            >
              Du hast dich nicht fur unseren Newsletter angemeldet? Dann ignoriere
              diese E-Mail einfach.
            </Text>
          </Section>

          {/* Footer */}
          <EmailFooter
            unsubscribeUrl="#"
            subscriberEmail={subscriberEmail}
          />
        </Container>
      </Body>
    </EmailHtml>
  );
}
