/**
 * Email Footer Component
 *
 * Legal information, address, unsubscribe link, social links
 */

import {
  Section,
  Text,
  Link,
  Hr,
} from '@react-email/components';

interface EmailFooterProps {
  unsubscribeUrl: string;
  viewInBrowserUrl?: string;
  subscriberEmail?: string;
}

export function EmailFooter({
  unsubscribeUrl,
  viewInBrowserUrl,
  subscriberEmail,
}: EmailFooterProps) {
  return (
    <Section
      style={{
        backgroundColor: '#F5F5F5',
        padding: '40px 20px',
      }}
    >
      {/* View in Browser Link */}
      {viewInBrowserUrl && (
        <Text
          style={{
            fontSize: '14px',
            lineHeight: '1.6',
            color: '#666666',
            textAlign: 'center',
            margin: '0 0 20px 0',
          }}
        >
          <Link
            href={viewInBrowserUrl}
            style={{
              color: '#016dca',
              textDecoration: 'none',
            }}
          >
            Im Browser ansehen
          </Link>
        </Text>
      )}

      <Hr
        style={{
          border: 'none',
          borderTop: '1px solid #DDDDDD',
          margin: '20px 0',
        }}
      />

      {/* Legal Footer */}
      <Text
        style={{
          fontSize: '14px',
          lineHeight: '1.6',
          color: '#666666',
          textAlign: 'center',
          margin: '0 0 12px 0',
        }}
      >
        <strong>PEPE Dome</strong>
        <br />
        Ein einzigartiger Veranstaltungsort in München
        <br />
        München, Germany
      </Text>

      {/* Privacy & Unsubscribe */}
      <Text
        style={{
          fontSize: '12px',
          lineHeight: '1.6',
          color: '#999999',
          textAlign: 'center',
          margin: '0 0 12px 0',
        }}
      >
        Du erhältst diese E-Mail, weil du dich für unseren Newsletter angemeldet hast.
        {subscriberEmail && (
          <>
            <br />
            Gesendet an: {subscriberEmail}
          </>
        )}
      </Text>

      <Text
        style={{
          fontSize: '12px',
          lineHeight: '1.6',
          color: '#999999',
          textAlign: 'center',
          margin: '0',
        }}
      >
        <Link
          href={unsubscribeUrl}
          style={{
            color: '#016dca',
            textDecoration: 'underline',
          }}
        >
          Vom Newsletter abmelden
        </Link>
        {' · '}
        <Link
          href={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/privacy`}
          style={{
            color: '#016dca',
            textDecoration: 'underline',
          }}
        >
          Datenschutz
        </Link>
      </Text>

      {/* GDPR Compliance Notice */}
      <Text
        style={{
          fontSize: '11px',
          lineHeight: '1.5',
          color: '#AAAAAA',
          textAlign: 'center',
          margin: '20px 0 0 0',
        }}
      >
        © {new Date().getFullYear()} PEPE Dome. Alle Rechte vorbehalten.
      </Text>
    </Section>
  );
}
