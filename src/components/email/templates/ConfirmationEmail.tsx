import 'server-only'

/**
 * Bestätigungsmail (Double Opt-in)
 *
 * Die wichtigste Mail im ganzen System: Wer hier nicht klickt, bekommt nie
 * einen Newsletter. Deshalb bewusst sehr reduziert. Genau eine Handlung,
 * keine Navigation, keine Nebenangebote, kein Bildmaterial, das erst
 * geladen werden muss, bevor der Button verständlich ist.
 *
 * Der Erwartungssatz ("etwa einmal im Monat") steht bewusst vor dem Klick.
 * Wer weiß, worauf er sich einlässt, meldet sich später seltener wieder ab
 * und markiert die Mail seltener als Spam.
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
import { EmailFooter } from '../components/EmailFooter'
import { EmailButton } from '../components/EmailButton'
import { emailTheme, emailText } from '../theme'

const INSTAGRAM_URL = 'https://www.instagram.com/pepe_arts/'

interface ConfirmationEmailProps {
  confirmationUrl: string
  subscriberEmail: string
  firstName?: string
}

export default function ConfirmationEmail({
  confirmationUrl,
  subscriberEmail,
  firstName,
}: ConfirmationEmailProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3004'
  const gutter = `${emailTheme.size.gutter}px`

  return (
    <EmailHtml lang="de">
      <Head>
        <title>Bestätige deine Anmeldung</title>
        <meta name="color-scheme" content="dark" />
        <meta name="supported-color-schemes" content="dark" />
        <style
          dangerouslySetInnerHTML={{
            __html: `:root { color-scheme: dark; supported-color-schemes: dark; } a { text-decoration: none; }`,
          }}
        />
      </Head>

      <Preview>Ein Klick fehlt noch, dann bist du dabei</Preview>

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
            <Text style={{ ...emailText.heroTitle, fontSize: '26px' }}>
              {firstName ? `Hallo ${firstName}, ` : 'Fast geschafft. '}
              ein Klick fehlt noch
            </Text>

            <Text style={emailText.body}>
              Bestätige kurz deine Adresse, dann schicken wir dir etwa einmal im Monat, was
              im Dome ansteht: Shows, Workshops und Abende, die man sonst leicht verpasst.
            </Text>

            <Section style={{ margin: '28px 0 24px 0' }}>
              <EmailButton href={confirmationUrl} variant="primary" fullWidth>
                Anmeldung bestätigen
              </EmailButton>
            </Section>

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
                href={confirmationUrl}
                style={{ color: emailTheme.color.accentText, wordBreak: 'break-all' }}
              >
                {confirmationUrl}
              </Link>
            </Text>

            <Text style={{ ...emailText.small, margin: '0' }}>
              Du hast dich nicht angemeldet? Dann ignoriere diese Mail einfach. Ohne
              Bestätigung passiert nichts weiter.
            </Text>
          </Section>

          <EmailFooter
            privacyUrl={`${baseUrl}/datenschutz`}
            imprintUrl={`${baseUrl}/impressum`}
            instagramUrl={INSTAGRAM_URL}
            subscriberEmail={subscriberEmail}
            reasonText="Du bekommst diese Mail, weil diese Adresse für den Newsletter des Pepe Dome eingetragen wurde."
          />
        </Container>
      </Body>
    </EmailHtml>
  )
}
