import 'server-only'

/**
 * Fußbereich
 *
 * Abmelden steht sichtbar und ohne Suchen erreichbar da. Ein versteckter
 * Abmeldelink erzeugt keine Treue, sondern Spam-Meldungen, und die kosten
 * Zustellbarkeit für alle anderen Empfänger.
 *
 * Anschrift und Impressum-Link stehen hier, weil Werbemail in Deutschland
 * eine Anbieterkennzeichnung braucht. Die Angaben stammen aus dem
 * Website-Footer und sind bewusst nicht frei formuliert.
 */

import { Section, Text, Link, Hr } from '@react-email/components'
import { emailTheme, emailText } from '../theme'

interface EmailFooterProps {
  /**
   * Ohne Abmelde-Link bei der Bestätigungsmail: Dort gibt es noch nichts
   * abzubestellen, ein Link ins Leere wirkt nur unseriös.
   */
  unsubscribeUrl?: string
  privacyUrl: string
  imprintUrl: string
  instagramUrl: string
  subscriberEmail?: string
  /** Erklärtext, warum die Mail ankommt. Je nach Mailart unterschiedlich. */
  reasonText?: string
}

export function EmailFooter({
  unsubscribeUrl,
  privacyUrl,
  imprintUrl,
  instagramUrl,
  subscriberEmail,
  reasonText = 'Du bekommst diese Mail, weil du dich für den Newsletter des Pepe Dome angemeldet hast.',
}: EmailFooterProps) {
  const linkStyle = {
    color: emailTheme.color.textMuted,
    fontFamily: emailTheme.font.stack,
    textDecoration: 'underline',
  }

  return (
    <Section
      style={{
        backgroundColor: emailTheme.color.page,
        padding: `28px ${emailTheme.size.gutter}px 36px ${emailTheme.size.gutter}px`,
      }}
    >
      <Text
        style={{
          ...emailText.meta,
          color: emailTheme.color.textBody,
          textAlign: 'center',
          margin: '0 0 6px 0',
        }}
      >
        <strong style={{ color: emailTheme.color.textStrong }}>PEPE Dome</strong>
      </Text>

      <Text style={{ ...emailText.small, textAlign: 'center', margin: '0 0 16px 0' }}>
        PEPE Arts, Ostpark, 81735 München
        <br />
        <Link href="mailto:info@pepe-dome.de" style={{ ...linkStyle, textDecoration: 'none' }}>
          info@pepe-dome.de
        </Link>
      </Text>

      <Text style={{ ...emailText.small, textAlign: 'center', margin: '0 0 18px 0' }}>
        <Link
          href={instagramUrl}
          style={{ ...linkStyle, textDecoration: 'none', color: emailTheme.color.accentText, fontWeight: '600' }}
        >
          Instagram
        </Link>
      </Text>

      <Hr
        style={{
          border: 'none',
          borderTop: `1px solid ${emailTheme.color.lineSoft}`,
          margin: '0 0 18px 0',
        }}
      />

      <Text style={{ ...emailText.small, fontSize: '12px', textAlign: 'center', margin: '0 0 10px 0' }}>
        {reasonText}
        {subscriberEmail && (
          <>
            <br />
            Gesendet an {subscriberEmail}
          </>
        )}
      </Text>

      <Text style={{ ...emailText.small, fontSize: '12px', textAlign: 'center', margin: '0' }}>
        {unsubscribeUrl && (
          <>
            <Link href={unsubscribeUrl} style={linkStyle}>
              Newsletter abbestellen
            </Link>
            {'   ·   '}
          </>
        )}
        <Link href={privacyUrl} style={linkStyle}>
          Datenschutz
        </Link>
        {'   ·   '}
        <Link href={imprintUrl} style={linkStyle}>
          Impressum
        </Link>
      </Text>

      <Text
        style={{
          ...emailText.small,
          fontSize: '11px',
          color: emailTheme.color.textFaint,
          textAlign: 'center',
          margin: '18px 0 0 0',
        }}
      >
        © {new Date().getFullYear()} PEPE Dome
      </Text>
    </Section>
  )
}
