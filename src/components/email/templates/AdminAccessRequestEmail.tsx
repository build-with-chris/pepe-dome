import 'server-only'

/**
 * Freigabe-Anfrage für das Admin-Panel
 *
 * Eine interne Mail, kein Marketing. Deshalb bewusst ohne Footer mit
 * Abmeldelink: Wer diese Mail bekommt, ist der Betreiber, nicht ein Abonnent.
 *
 * Der Button führt nur auf die Freigabe-Seite, er vergibt selbst keine Rechte.
 * Mailprogramme und Virenscanner öffnen Links in Mails ungefragt im
 * Hintergrund — ein Link, der direkt freischaltet, würde dadurch von allein
 * ausgelöst und der Zugang wäre offen, ohne dass jemand geklickt hat.
 */

import {
  Html as EmailHtml,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Link,
  Hr,
} from '@react-email/components'
import { EmailHeader } from '../components/EmailHeader'
import { EmailButton } from '../components/EmailButton'
import { emailTheme, emailText } from '../theme'

interface AdminAccessRequestEmailProps {
  requesterEmail: string
  requesterName?: string
  reviewUrl: string
  expiresInDays: number
}

export default function AdminAccessRequestEmail({
  requesterEmail,
  requesterName,
  reviewUrl,
  expiresInDays,
}: AdminAccessRequestEmailProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3004'
  const gutter = `${emailTheme.size.gutter}px`

  return (
    <EmailHtml lang="de">
      <Head>
        <title>Zugriff auf das Admin-Panel angefragt</title>
        <meta name="color-scheme" content="dark" />
        <meta name="supported-color-schemes" content="dark" />
        <style
          dangerouslySetInnerHTML={{
            __html: `:root { color-scheme: dark; supported-color-schemes: dark; } a { text-decoration: none; }`,
          }}
        />
      </Head>

      <Preview>{`${requesterEmail} möchte Zugriff auf das Admin-Panel`}</Preview>

      <Body
        style={{
          backgroundColor: emailTheme.color.page,
          fontFamily: emailTheme.font.stack,
          margin: 0,
          padding: 0,
        }}
      >
        <Container
          style={{
            width: '100%',
            maxWidth: `${emailTheme.size.container}px`,
            margin: '0 auto',
            backgroundColor: emailTheme.color.canvas,
          }}
        >
          <EmailHeader
            logoUrl={`${baseUrl}/images/pepe-dome-logo-light.png`}
            homeUrl={baseUrl}
          />

          <Section style={{ padding: `24px ${gutter} 8px ${gutter}` }}>
            <Text style={emailText.eyebrow}>Freigabe nötig</Text>

            <Text style={{ ...emailText.heroTitle, fontSize: '26px' }}>
              Jemand möchte ins Admin-Panel
            </Text>

            <Text style={emailText.body}>
              Dieser Account hat sich angemeldet und wartet auf eine Freigabe. Solange du
              nichts vergibst, sieht er nichts und kann nichts ändern.
            </Text>

            <Section
              style={{
                backgroundColor: emailTheme.color.surface,
                border: `1px solid ${emailTheme.color.line}`,
                borderRadius: '10px',
                padding: '16px 18px',
                margin: '20px 0 24px 0',
              }}
            >
              {requesterName && (
                <Text style={{ ...emailText.rowTitle, margin: '0 0 4px 0' }}>
                  {requesterName}
                </Text>
              )}
              <Text
                style={{
                  ...emailText.body,
                  margin: 0,
                  color: emailTheme.color.textMuted,
                  wordBreak: 'break-all',
                }}
              >
                {requesterEmail}
              </Text>
            </Section>

            <Section style={{ margin: '0 0 24px 0' }}>
              <EmailButton href={reviewUrl} variant="primary" fullWidth>
                Anfrage ansehen
              </EmailButton>
            </Section>

            <Text style={{ ...emailText.small, margin: '0 0 20px 0' }}>
              Auf der Seite wählst du die Rolle: Viewer nur lesen, Editor Inhalte pflegen,
              Super Admin alles inklusive Abonnenten und Versand. Ablehnen geht dort ebenfalls.
              Du musst dafür selbst als Super Admin eingeloggt sein.
            </Text>

            <Hr
              style={{
                border: 'none',
                borderTop: `1px solid ${emailTheme.color.line}`,
                margin: '24px 0',
              }}
            />

            <Text style={{ ...emailText.small, margin: '0 0 8px 0' }}>
              Falls der Button nicht reagiert, kopiere diesen Link in deinen Browser:
            </Text>
            <Text style={{ ...emailText.small, margin: '0 0 20px 0' }}>
              <Link
                href={reviewUrl}
                style={{ color: emailTheme.color.accentText, wordBreak: 'break-all' }}
              >
                {reviewUrl}
              </Link>
            </Text>

            <Text style={{ ...emailText.small, margin: '0 0 24px 0' }}>
              Kennst du den Absender nicht? Dann ignoriere die Mail. Ohne Freigabe bleibt der
              Account ohne Rechte, der Link verfällt nach {expiresInDays} Tagen von selbst.
            </Text>
          </Section>
        </Container>
      </Body>
    </EmailHtml>
  )
}
