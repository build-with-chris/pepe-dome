import 'server-only'

/**
 * Willkommensmail
 *
 * Wird nach bestätigter Anmeldung verschickt und ist die Mail mit der
 * höchsten Aufmerksamkeit, die der Newsletter je bekommt: Der Empfänger
 * hat gerade aktiv zugestimmt. Deshalb steht hier eine echte Handlung und
 * nicht nur ein Dankeschön.
 *
 * Bewusst kurz gehalten: Wer noch nichts über den Dome weiß, liest keine
 * Textwand. Die drei Punkte sagen, was kommt, dann führt ein Weg weiter.
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

interface WelcomeEmailProps {
  subscriberId: string
  subscriberEmail: string
  firstName?: string
  upcomingEventsUrl?: string
  newsletterArchiveUrl?: string
  /**
   * Fertiger Abmeldelink.
   *
   * Muss von aussen kommen und darf nicht hier aus der subscriberId gebaut
   * werden: Die Abmeldung braucht das persönliche Token des Abonnenten. Die
   * ID ist kein Geheimnis, und der frühere Pfad aus der ID zeigte auf eine
   * Route, die es nie gab.
   */
  unsubscribeUrl: string
}

/** Ein Punkt aus "Was dich erwartet" */
function Promise_({ title, text }: { title: string; text: string }) {
  return (
    <Section style={{ marginBottom: '16px' }}>
      <Text
        style={{
          fontSize: '15px',
          fontWeight: '700',
          lineHeight: '1.4',
          color: emailTheme.color.accentText,
          margin: '0 0 2px 0',
        }}
      >
        {title}
      </Text>
      <Text style={{ ...emailText.body, fontSize: '15px', margin: '0' }}>{text}</Text>
    </Section>
  )
}

export default function WelcomeEmail({
  subscriberId,
  subscriberEmail,
  firstName,
  upcomingEventsUrl,
  newsletterArchiveUrl,
  unsubscribeUrl,
}: WelcomeEmailProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3004'
  const gutter = `${emailTheme.size.gutter}px`
  const eventsUrl = upcomingEventsUrl || `${baseUrl}/events`
  const archiveUrl = newsletterArchiveUrl || `${baseUrl}/newsletter`

  return (
    <EmailHtml lang="de">
      <Head>
        <title>Willkommen beim Pepe Dome</title>
        <meta name="color-scheme" content="dark" />
        <meta name="supported-color-schemes" content="dark" />
        <style
          dangerouslySetInnerHTML={{
            __html: `:root { color-scheme: dark; supported-color-schemes: dark; } a { text-decoration: none; }`,
          }}
        />
      </Head>

      <Preview>Du bist dabei. Das erwartet dich im Pepe Dome</Preview>

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

          <Section style={{ padding: `24px ${gutter} 4px ${gutter}` }}>
            <Text style={{ ...emailText.heroTitle, fontSize: '26px' }}>
              {firstName ? `Willkommen, ${firstName}` : 'Willkommen im Dome'}
            </Text>

            <Text style={emailText.body}>
              Schön, dass du dabei bist. Der Pepe Dome ist eine geodätische Kuppel im
              Münchner Ostpark: 200 Plätze, kurze Wege zur Bühne und ein Programm aus
              zeitgenössischem Zirkus, Shows und Workshops.
            </Text>
          </Section>

          <Section style={{ padding: `12px ${gutter} 0 ${gutter}` }}>
            <Hr
              style={{
                border: 'none',
                borderTop: `1px solid ${emailTheme.color.line}`,
                margin: '0 0 22px 0',
              }}
            />

            <Text style={{ ...emailText.sectionTitle, margin: '0 0 16px 0' }}>
              Was dich erwartet
            </Text>

            <Promise_
              title="Das Programm, bevor es ausverkauft ist"
              text="Etwa einmal im Monat schicken wir dir, was ansteht."
            />
            <Promise_
              title="Blicke hinter den Vorhang"
              text="Wer bei uns auftritt, wie ein Abend entsteht, was gerade gebaut wird."
            />
            <Promise_
              title="Gelegentlich etwas vorab"
              text="Karten für besondere Abende, bevor sie öffentlich zu haben sind."
            />
          </Section>

          <Section style={{ padding: `20px ${gutter} 32px ${gutter}` }}>
            <EmailButton href={eventsUrl} variant="primary">
              Programm ansehen
            </EmailButton>

            <Text style={{ ...emailText.small, margin: '20px 0 0 0' }}>
              Neugierig, wie unsere Newsletter aussehen? Im{' '}
              <Link href={archiveUrl} style={{ color: emailTheme.color.accentText }}>
                Archiv
              </Link>{' '}
              stehen die vergangenen Ausgaben.
            </Text>
          </Section>

          <EmailFooter
            unsubscribeUrl={unsubscribeUrl}
            privacyUrl={`${baseUrl}/datenschutz`}
            imprintUrl={`${baseUrl}/impressum`}
            instagramUrl={INSTAGRAM_URL}
            subscriberEmail={subscriberEmail}
          />
        </Container>
      </Body>
    </EmailHtml>
  )
}
