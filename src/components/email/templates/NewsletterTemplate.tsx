import 'server-only'

/**
 * Newsletter-Template
 *
 * Aufbau nach Wichtigkeit statt nach Datenbankreihenfolge:
 *
 *   1. Kopf mit Logo und Browser-Link
 *   2. Hero: worum es in dieser Ausgabe geht
 *   3. Persönliche Anrede und redaktioneller Einstieg, bewusst kurz
 *   4. Aufmacher-Veranstaltung mit dem einzigen primären Button
 *   5. Zweite Reihe als kleinere Karten mit Textlink
 *   6. Weitere Termine als kompakte Liste mit Datumsfeld
 *   7. Artikel als abgesetzter Lesebereich
 *   8. Ein abschließender Verweis auf den vollständigen Kalender
 *   9. Footer mit Abmeldung, Anschrift und Impressum
 *
 * Die Gewichtung der Veranstaltungen entsteht im Viewmodel aus der
 * Reihenfolge, die im Admin per Drag-and-drop festgelegt wird.
 */

import {
  Html as EmailHtml,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Img,
  Hr,
  Link,
} from '@react-email/components'
import { EmailHeader } from '../components/EmailHeader'
import { EmailFooter } from '../components/EmailFooter'
import { EmailButton } from '../components/EmailButton'
import { EmailLeadEvent, EmailFeatureEvent, EmailEventRow } from '../components/EmailEventCard'
import { EmailNewsCard } from '../components/EmailNewsCard'
import { EmailNote } from '../components/EmailNote'
import { EmailMarkdown } from '../components/EmailMarkdown'
import { emailTheme, emailText } from '../theme'
import type {
  NewsletterViewModel,
  NewsletterItem,
  NewsletterEventItem,
} from '@/lib/newsletter-content'

const INSTAGRAM_URL = 'https://www.instagram.com/pepe_arts/'

export interface NewsletterTemplateProps {
  viewModel: NewsletterViewModel
  subscriberId: string
  subscriberEmail: string
  firstName?: string
  /** Abmelde-Link; wird vom Versand gesetzt, damit er zum Empfänger passt */
  unsubscribeUrl?: string
}

const gutter = `${emailTheme.size.gutter}px`

function isCompactEvent(item: NewsletterItem): item is NewsletterEventItem {
  return item.kind === 'event' && item.emphasis === 'compact'
}

/**
 * Aufeinanderfolgende Kompakt-Termine werden zu einem Block zusammengefasst,
 * statt jeden einzeln zu rahmen. Das ist der eigentliche Hebel gegen den
 * Katalog-Effekt: eine Liste liest sich als eine Einheit, sieben Karten
 * lesen sich als sieben Forderungen.
 */
function groupItems(items: NewsletterItem[]): Array<NewsletterItem | NewsletterEventItem[]> {
  const groups: Array<NewsletterItem | NewsletterEventItem[]> = []
  let buffer: NewsletterEventItem[] = []

  for (const item of items) {
    if (isCompactEvent(item)) {
      buffer.push(item)
      continue
    }
    if (buffer.length > 0) {
      groups.push(buffer)
      buffer = []
    }
    groups.push(item)
  }
  if (buffer.length > 0) groups.push(buffer)

  return groups
}

export default function NewsletterTemplate({
  viewModel,
  subscriberId,
  subscriberEmail,
  firstName,
  unsubscribeUrl,
}: NewsletterTemplateProps) {
  const vm = viewModel
  // Fällt bewusst auf die Newsletter-Seite zurück statt auf einen aus der
  // subscriberId gebauten Pfad. Die Abmeldung braucht das persönliche Token;
  // ein Link aus der ID führte früher auf eine Route, die es nie gab, und
  // sähe im Fussbereich aus wie ein funktionierender Abmeldelink.
  const resolvedUnsubscribeUrl = unsubscribeUrl || `${vm.baseUrl}/newsletter`

  // Anrede nur bei echtem Vornamen. Ohne Namen würde ein generisches "Hallo,"
  // oft mit der Begrüßung im redaktionellen Einstieg kollidieren (z. B.
  // "Hallo," direkt über "Hi zusammen,"). Der Einstiegstext trägt die Ansprache
  // dann selbst.
  const greeting = firstName ? `Hallo ${firstName},` : null
  const hasIntro = Boolean(vm.introText)

  return (
    <EmailHtml lang="de">
      <Head>
        <title>{vm.subject}</title>
        {/*
          Ohne diese Angaben hellen Apple Mail und Outlook.com dunkle Mails
          eigenmächtig auf und zerlegen dabei den Kontrast. Mit ihnen
          respektieren sie die gesetzten Farben.
        */}
        <meta name="color-scheme" content="dark" />
        <meta name="supported-color-schemes" content="dark" />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root { color-scheme: dark; supported-color-schemes: dark; }
              a { text-decoration: none; }
              img { -ms-interpolation-mode: bicubic; }
              @media only screen and (max-width: 600px) {
                .pd-gutter { padding-left: 16px !important; padding-right: 16px !important; }
                .pd-hero-title { font-size: 26px !important; }
              }
            `,
          }}
        />
      </Head>

      <Preview>{vm.preheader || vm.subject}</Preview>

      <Body
        style={{
          backgroundColor: emailTheme.color.page,
          fontFamily: emailTheme.font.stack,
          margin: 0,
          padding: 0,
          WebkitTextSizeAdjust: '100%',
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
          <EmailHeader logoUrl={`${vm.baseUrl}/images/pepe-dome-logo-light.png`} homeUrl={vm.homeUrl} webViewUrl={vm.webViewUrl} />

          {/* Hero */}
          {vm.hero.imageUrl && (
            <Img
              src={vm.hero.imageUrl}
              alt={vm.hero.title}
              width={emailTheme.size.container}
              style={{
                display: 'block',
                width: '100%',
                maxWidth: '100%',
                border: 'none',
                outline: 'none',
              }}
            />
          )}

          <Section className="pd-gutter" style={{ padding: `28px ${gutter} 4px ${gutter}` }}>
            <Text className="pd-hero-title" style={emailText.heroTitle}>
              {vm.hero.title}
            </Text>

            {vm.hero.subtitle && (
              <Text style={{ ...emailText.body, color: emailTheme.color.textMuted, margin: '0 0 18px 0' }}>
                {vm.hero.subtitle}
              </Text>
            )}

            {vm.hero.ctaLabel && vm.hero.ctaUrl && (
              <Section style={{ margin: '0 0 8px 0' }}>
                <EmailButton href={vm.hero.ctaUrl} variant="secondary">
                  {vm.hero.ctaLabel}
                </EmailButton>
              </Section>
            )}
          </Section>

          {/* Redaktioneller Einstieg */}
          {hasIntro && (
            <Section className="pd-gutter" style={{ padding: `16px ${gutter} 4px ${gutter}` }}>
              {greeting && (
                <Text style={{ ...emailText.body, margin: '0 0 10px 0' }}>{greeting}</Text>
              )}
              {/* Einstiegstext als Markdown: Überschriften, Absätze, Listen
                  statt einer Fließtextwand. Reiner Text bleibt reiner Text. */}
              <EmailMarkdown source={vm.introText!} />
            </Section>
          )}

          {/* Inhalt */}
          {vm.sections.map((section, sectionIndex) => (
            <Section
              key={sectionIndex}
              className="pd-gutter"
              style={{ padding: `28px ${gutter} 0 ${gutter}` }}
            >
              {section.heading && (
                <>
                  <Text style={emailText.sectionTitle}>{section.heading}</Text>
                  {section.description && (
                    <Text style={{ ...emailText.meta, margin: '0 0 4px 0' }}>{section.description}</Text>
                  )}
                  <Hr
                    style={{
                      border: 'none',
                      borderTop: `1px solid ${emailTheme.color.line}`,
                      margin: '12px 0 20px 0',
                    }}
                  />
                </>
              )}

              {groupItems(section.items).map((group, groupIndex) => {
                // Zusammengefasste Terminliste
                if (Array.isArray(group)) {
                  return (
                    <Section
                      key={groupIndex}
                      style={{
                        backgroundColor: emailTheme.color.surface,
                        borderRadius: '12px',
                        padding: '2px 18px',
                        marginBottom: '14px',
                      }}
                    >
                      {group.map((event, rowIndex) => (
                        <EmailEventRow
                          key={event.id}
                          event={event}
                          isLast={rowIndex === group.length - 1}
                        />
                      ))}
                    </Section>
                  )
                }

                if (group.kind === 'event') {
                  return group.emphasis === 'lead' ? (
                    <Section key={group.id} style={{ marginBottom: '18px' }}>
                      <EmailLeadEvent event={group} />
                    </Section>
                  ) : (
                    <EmailFeatureEvent key={group.id} event={group} />
                  )
                }

                if (group.kind === 'article') {
                  return <EmailNewsCard key={group.id} article={group} />
                }

                return (
                  <Section key={groupIndex} style={{ marginBottom: '14px' }}>
                    <EmailNote note={group} />
                  </Section>
                )
              })}
            </Section>
          ))}

          {/* Abschluss: eine einzige weiterführende Handlung */}
          <Section className="pd-gutter" style={{ padding: `32px ${gutter} 36px ${gutter}`, textAlign: 'center' }}>
            <Hr
              style={{
                border: 'none',
                borderTop: `1px solid ${emailTheme.color.line}`,
                margin: '0 0 26px 0',
              }}
            />
            <Text
              style={{
                ...emailText.body,
                color: emailTheme.color.textMuted,
                textAlign: 'center',
                margin: '0 0 18px 0',
              }}
            >
              {vm.eventCount > 0
                ? 'Das war die Auswahl. Der vollständige Kalender steht auf der Website.'
                : 'Den vollständigen Kalender findest du auf der Website.'}
            </Text>
            <EmailButton href={vm.eventsUrl} variant="secondary">
              Alle Termine ansehen
            </EmailButton>
            <Text
              style={{
                ...emailText.small,
                textAlign: 'center',
                margin: '24px 0 0 0',
              }}
            >
              Bis bald im Dome
              <br />
              <Link
                href={vm.homeUrl}
                style={{ color: emailTheme.color.textMuted, textDecoration: 'none' }}
              >
                das Team vom Pepe Dome
              </Link>
            </Text>
          </Section>

          <EmailFooter
            unsubscribeUrl={resolvedUnsubscribeUrl}
            privacyUrl={`${vm.baseUrl}/datenschutz`}
            imprintUrl={`${vm.baseUrl}/impressum`}
            instagramUrl={INSTAGRAM_URL}
            subscriberEmail={subscriberEmail}
          />
        </Container>
      </Body>
    </EmailHtml>
  )
}
