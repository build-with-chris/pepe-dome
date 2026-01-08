/**
 * Newsletter Template
 *
 * Main newsletter template with hero section, content sections, and footer
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
} from '@react-email/components';
import { EmailHeader } from '../components/EmailHeader';
import { EmailFooter } from '../components/EmailFooter';
import { EmailButton } from '../components/EmailButton';
import { EmailEventCard } from '../components/EmailEventCard';
import { EmailNewsCard } from '../components/EmailNewsCard';

interface NewsletterContentSection {
  sectionHeading?: string;
  sectionDescription?: string;
  items: Array<{
    type: 'event' | 'article' | 'custom';
    data: unknown;
  }>;
}

interface NewsletterTemplateProps {
  // Newsletter metadata
  subject: string;
  preheader?: string;
  newsletterSlug: string;

  // Hero section
  heroImageUrl?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroCTALabel?: string;
  heroCTAUrl?: string;

  // Intro text (shown after hero, before content)
  introText?: string;

  // Content sections
  contentSections: NewsletterContentSection[];

  // Subscriber info
  subscriberId: string;
  subscriberEmail: string;
  firstName?: string;
}

export default function NewsletterTemplate({
  subject,
  preheader,
  newsletterSlug,
  heroImageUrl,
  heroTitle,
  heroSubtitle,
  heroCTALabel,
  heroCTAUrl,
  introText,
  contentSections,
  subscriberId,
  subscriberEmail,
  firstName,
}: NewsletterTemplateProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3004';
  const unsubscribeUrl = `${baseUrl}/api/subscribers/unsubscribe?id=${subscriberId}`;
  const viewInBrowserUrl = `${baseUrl}/newsletter/${newsletterSlug}`;

  return (
    <EmailHtml lang="de">
      <Head>
        <title>{subject}</title>
      </Head>
      <Preview>{preheader || subject}</Preview>
      <Body
        style={{
          backgroundColor: '#FFFFFF',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          margin: 0,
          padding: 0,
        }}
      >
        <Container
          style={{
            maxWidth: '90%',
            width: '90%',
            margin: '0 auto',
            backgroundColor: '#161616',
          }}
        >
          {/* Header */}
          <EmailHeader />

          {/* Hero Section - Always show with subject as fallback title */}
          <Section
            style={{
              backgroundColor: '#0F0520',
            }}
          >
            {/* Hero Image - using actual Img tag for email client compatibility */}
            {heroImageUrl && (
              <Img
                src={heroImageUrl}
                alt={heroTitle || subject}
                width="100%"
                style={{
                  display: 'block',
                  width: '100%',
                  maxHeight: '300px',
                  objectFit: 'cover',
                }}
              />
            )}

            {/* Hero Text Content */}
            <Section
              style={{
                padding: '32px',
                backgroundColor: '#0F0520',
              }}
            >
              <Text
                style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  lineHeight: '1.2',
                  color: '#FFFFFF',
                  margin: '0 0 12px 0',
                  textAlign: 'center',
                }}
              >
                {heroTitle || subject}
              </Text>

              {heroSubtitle && (
                <Text
                  style={{
                    fontSize: '16px',
                    lineHeight: '1.5',
                    color: '#FFD700',
                    margin: '0 0 20px 0',
                    textAlign: 'center',
                  }}
                >
                  {heroSubtitle}
                </Text>
              )}

              {heroCTALabel && heroCTAUrl && (
                <Section
                  style={{
                    textAlign: 'center',
                  }}
                >
                  <EmailButton href={heroCTAUrl}>
                    {heroCTALabel}
                  </EmailButton>
                </Section>
              )}
            </Section>
          </Section>

          {/* Intro Text */}
          {introText && (
            <Section
              style={{
                padding: '16px 32px 0 32px',
              }}
            >
              <Text
                style={{
                  fontSize: '16px',
                  lineHeight: '1.7',
                  color: '#CCCCCC',
                  margin: '0',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {introText}
              </Text>
            </Section>
          )}

          {/* Content Sections */}
          {contentSections.map((section, sectionIndex) => (
            <Section
              key={sectionIndex}
              style={{
                padding: '32px',
              }}
            >
              {/* Section Heading */}
              {section.sectionHeading && (
                <>
                  <Text
                    style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      lineHeight: '1.3',
                      color: '#FFFFFF',
                      margin: '0 0 12px 0',
                    }}
                  >
                    {section.sectionHeading}
                  </Text>

                  {section.sectionDescription && (
                    <Text
                      style={{
                        fontSize: '16px',
                        lineHeight: '1.6',
                        color: '#AAAAAA',
                        margin: '0 0 24px 0',
                      }}
                    >
                      {section.sectionDescription}
                    </Text>
                  )}
                </>
              )}

              {/* Section Items */}
              {section.items.map((item, itemIndex) => {
                const itemData = item.data as Record<string, string | undefined>;

                if (item.type === 'event') {
                  return (
                    <EmailEventCard
                      key={itemIndex}
                      title={itemData.title || ''}
                      description={itemData.description}
                      date={itemData.date || ''}
                      time={itemData.time}
                      location={itemData.location}
                      ctaUrl={itemData.eventUrl || itemData.ctaUrl || '#'}
                      imageUrl={itemData.imageUrl}
                    />
                  );
                } else if (item.type === 'article') {
                  return (
                    <EmailNewsCard
                      key={itemIndex}
                      title={itemData.title || ''}
                      excerpt={itemData.excerpt}
                      articleUrl={itemData.articleUrl || '#'}
                      imageUrl={itemData.imageUrl}
                      category={itemData.category}
                    />
                  );
                } else if (item.type === 'custom') {
                  // Custom section with text and optional image
                  const customImageUrl = itemData.imageUrl;
                  const customTitle = itemData.title;
                  const customText = itemData.text;
                  const customCtaUrl = itemData.ctaUrl;
                  const customCtaLabel = itemData.ctaLabel;

                  return (
                    <Section
                      key={itemIndex}
                      style={{
                        backgroundColor: '#1a1a1a',
                        borderRadius: '12px',
                        padding: '24px',
                        marginBottom: '24px',
                      }}
                    >
                      {customImageUrl && (
                        <Img
                          src={customImageUrl}
                          alt={customTitle || 'Custom content'}
                          width="100%"
                          height="auto"
                          style={{
                            display: 'block',
                            borderRadius: '8px',
                            marginBottom: '16px',
                          }}
                        />
                      )}

                      {customTitle && (
                        <Text
                          style={{
                            fontSize: '20px',
                            fontWeight: '700',
                            lineHeight: '1.3',
                            color: '#FFFFFF',
                            margin: '0 0 12px 0',
                          }}
                        >
                          {customTitle}
                        </Text>
                      )}

                      {customText && (
                        <Text
                          style={{
                            fontSize: '16px',
                            lineHeight: '1.6',
                            color: '#CCCCCC',
                            margin: '0 0 16px 0',
                          }}
                        >
                          {customText}
                        </Text>
                      )}

                      {customCtaUrl && customCtaLabel && (
                        <EmailButton href={customCtaUrl} variant="secondary">
                          {customCtaLabel}
                        </EmailButton>
                      )}
                    </Section>
                  );
                }
                return null;
              })}

              {/* Section Divider (except for last section) */}
              {sectionIndex < contentSections.length - 1 && (
                <Hr
                  style={{
                    border: 'none',
                    borderTop: '2px solid #333333',
                    margin: '32px 0 0 0',
                  }}
                />
              )}
            </Section>
          ))}

          {/* Closing Section */}
          <Section
            style={{
              padding: '32px',
              backgroundColor: '#FFFFFF',
            }}
          >
            <Text
              style={{
                fontSize: '16px',
                lineHeight: '1.6',
                color: '#000000',
                margin: '0 0 16px 0',
                textAlign: 'center',
              }}
            >
              Bis bald im PEPE Dome!
            </Text>

            <Text
              style={{
                fontSize: '14px',
                lineHeight: '1.6',
                color: '#333333',
                margin: '0',
                textAlign: 'center',
              }}
            >
              Folge uns für tägliche Updates und Behind-the-Scenes-Momente
            </Text>

            {/* Social Links Placeholder */}
            <Section
              style={{
                textAlign: 'center',
                margin: '20px 0 0 0',
              }}
            >
              <Link
                href="https://instagram.com/pepedome"
                style={{
                  color: '#016dca',
                  textDecoration: 'none',
                  margin: '0 12px',
                  fontSize: '14px',
                }}
              >
                Instagram
              </Link>
              <Link
                href="https://facebook.com/pepedome"
                style={{
                  color: '#016dca',
                  textDecoration: 'none',
                  margin: '0 12px',
                  fontSize: '14px',
                }}
              >
                Facebook
              </Link>
            </Section>
          </Section>

          {/* Footer */}
          <EmailFooter
            unsubscribeUrl={unsubscribeUrl}
            viewInBrowserUrl={viewInBrowserUrl}
            subscriberEmail={subscriberEmail}
          />
        </Container>
      </Body>
    </EmailHtml>
  );
}
