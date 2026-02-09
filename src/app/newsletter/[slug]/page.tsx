/**
 * Task 8.1.3, 8.1.4, 8.1.5: Individual newsletter public page
 *
 * Features:
 * - Fetch newsletter and content from database
 * - Render same HTML as email (reuse template structure)
 * - Add web-specific enhancements (responsive, better fonts)
 * - Include signup CTA at bottom
 * - SEO meta tags (Task 8.1.4)
 * - Static generation with ISR (Task 8.1.5)
 */

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getNewsletterBySlug } from '@/lib/newsletters'
import { getEventById, getNewsBySlug } from '@/lib/data'
import SignupForm from '@/components/newsletter/SignupForm'

interface NewsletterPageProps {
  params: Promise<{
    slug: string
  }>
}

export const dynamic = 'force-dynamic'

/**
 * Task 8.1.4: Generate SEO metadata for newsletter
 */
export async function generateMetadata({ params }: NewsletterPageProps): Promise<Metadata> {
  const { slug } = await params

  try {
    const newsletter = await getNewsletterBySlug(slug)

    if (!newsletter) {
      return {
        title: 'Newsletter nicht gefunden',
      }
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const newsletterUrl = `${baseUrl}/newsletter/${newsletter.slug}`

    return {
      title: newsletter.subject,
      description: newsletter.preheader || newsletter.heroSubtitle || `Newsletter vom ${new Date(newsletter.sentAt!).toLocaleDateString('de-DE')}`,
      openGraph: {
        title: newsletter.subject,
        description: newsletter.preheader || newsletter.heroSubtitle || '',
        url: newsletterUrl,
        siteName: 'PEPE Dome',
        images: newsletter.heroImageUrl ? [
          {
            url: newsletter.heroImageUrl,
            width: 1200,
            height: 630,
            alt: newsletter.heroTitle || newsletter.subject,
          },
        ] : [],
        type: 'article',
        publishedTime: newsletter.sentAt?.toISOString(),
      },
      twitter: {
        card: 'summary_large_image',
        title: newsletter.subject,
        description: newsletter.preheader || newsletter.heroSubtitle || '',
        images: newsletter.heroImageUrl ? [newsletter.heroImageUrl] : [],
      },
      alternates: {
        canonical: newsletterUrl,
      },
    }
  } catch (error) {
    console.error('Failed to generate metadata for newsletter:', error)
    return {
      title: 'Newsletter',
    }
  }
}

/**
 * Task 8.1.5: Revalidate every hour
 */
export const revalidate = 3600

/**
 * Newsletter page component
 */
export default async function NewsletterSlugPage({ params }: NewsletterPageProps) {
  const { slug } = await params

  let newsletter
  try {
    newsletter = await getNewsletterBySlug(slug)
  } catch (error) {
    console.error('Failed to fetch newsletter:', error)
    notFound()
  }

  if (!newsletter) {
    notFound()
  }

  // Group content by sections
  const contentSections: {
    heading?: string
    description?: string
    items: Array<{ type: string; data: unknown }>
  }[] = []

  let currentSection: typeof contentSections[0] | null = null

  for (const item of newsletter.content) {
    // Check if this item starts a new section
    if (item.sectionHeading) {
      if (currentSection && currentSection.items.length > 0) {
        contentSections.push(currentSection)
      }
      currentSection = {
        heading: item.sectionHeading,
        description: item.sectionDescription || undefined,
        items: [],
      }
    }

    if (!currentSection) {
      currentSection = {
        items: [],
      }
    }

    // Fetch the actual content data based on contentId and contentType
    let contentData = null
    if (item.contentId) {
      try {
        if (item.contentType === 'EVENT') {
          contentData = getEventById(item.contentId)
        } else if (item.contentType === 'ARTICLE') {
          contentData = getNewsBySlug(item.contentId)
        }
      } catch (error) {
        console.error(`Failed to fetch content ${item.contentId}:`, error)
      }
    }

    if (contentData || item.contentType === 'CUSTOM_SECTION') {
      currentSection.items.push({
        type: item.contentType.toLowerCase(),
        data: contentData || {},
      })
    }
  }

  // Add the last section
  if (currentSection && currentSection.items.length > 0) {
    contentSections.push(currentSection)
  }

  return (
    <div className="section">
      <div className="stage-container max-w-4xl">
        {/* Newsletter Header */}
        <header className="mb-12 text-center">
          <div className="mb-4">
            <Link
              href="/newsletter"
              className="text-sm text-pepe-gold hover:text-pepe-gold/80 transition-colors"
            >
              ← Zurück zum Archiv
            </Link>
          </div>

          <p className="text-sm text-pepe-t64 mb-2">
            Versendet am {new Date(newsletter.sentAt!).toLocaleDateString('de-DE', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </p>

          <h1 className="display-2 mb-4">{newsletter.subject}</h1>

          {newsletter.preheader && (
            <p className="lead text-pepe-t80 max-w-2xl mx-auto">
              {newsletter.preheader}
            </p>
          )}
        </header>

        {/* Hero Section */}
        {(newsletter.heroImageUrl || newsletter.heroTitle) && (
          <section className="mb-12 rounded-2xl overflow-hidden bg-pepe-bg-secondary">
            {newsletter.heroImageUrl && (
              <img
                src={newsletter.heroImageUrl}
                alt={newsletter.heroTitle || newsletter.subject}
                className="w-full h-auto max-h-96 object-cover"
              />
            )}

            {newsletter.heroTitle && (
              <div className="p-8 md:p-12">
                <h2 className="h1 mb-4">{newsletter.heroTitle}</h2>

                {newsletter.heroSubtitle && (
                  <p className="text-xl text-pepe-t80 mb-6">
                    {newsletter.heroSubtitle}
                  </p>
                )}

                {newsletter.heroCTALabel && newsletter.heroCTAUrl && (
                  <Link
                    href={newsletter.heroCTAUrl}
                    className="btn-primary inline-block"
                  >
                    {newsletter.heroCTALabel}
                  </Link>
                )}
              </div>
            )}
          </section>
        )}

        {/* Content Sections */}
        {contentSections.map((section, sectionIndex) => (
          <section key={sectionIndex} className="mb-16">
            {section.heading && (
              <div className="mb-8">
                <h2 className="h2 mb-2">{section.heading}</h2>
                {section.description && (
                  <p className="text-pepe-t64">{section.description}</p>
                )}
              </div>
            )}

            <div className="space-y-8">
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex} className="card p-6 md:p-8">
                  {/* Event Content */}
                  {item.type === 'event' && item.data && (
                    <div className="flex flex-col md:flex-row gap-6">
                      {item.data.imageUrl && (
                        <div className="md:w-1/3">
                          <img
                            src={item.data.imageUrl}
                            alt={item.data.title}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="h3 mb-2">{item.data.title}</h3>
                        {item.data.subtitle && (
                          <p className="text-pepe-gold mb-3">{item.data.subtitle}</p>
                        )}
                        <p className="text-pepe-t80 mb-4">{item.data.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-pepe-t64 mb-4">
                          <span>📅 {new Date(item.data.date).toLocaleDateString('de-DE')}</span>
                          <span>🕐 {item.data.time}</span>
                          <span>📍 {item.data.location}</span>
                        </div>
                        {item.data.ticketUrl && (() => {
                          const isEmail = item.data.ticketUrl.includes('@') && !item.data.ticketUrl.startsWith('http');
                          const href = isEmail && !item.data.ticketUrl.startsWith('mailto:') 
                            ? `mailto:${item.data.ticketUrl}` 
                            : item.data.ticketUrl;
                          const label = isEmail ? 'Anmelden via Mail' : 'Tickets sichern';
                          
                          return (
                            <Link href={href} className="btn-secondary">
                              {label}
                            </Link>
                          );
                        })()}
                      </div>
                    </div>
                  )}

                  {/* Article Content */}
                  {item.type === 'article' && item.data && (
                    <div className="flex flex-col md:flex-row gap-6">
                      {item.data.imageUrl && (
                        <div className="md:w-1/3">
                          <img
                            src={item.data.imageUrl}
                            alt={item.data.title}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="h3 mb-2">{item.data.title}</h3>
                        <p className="text-pepe-t80 mb-4">{item.data.excerpt}</p>
                        <Link href={`/news/${item.data.slug}`} className="text-pepe-gold hover:text-pepe-gold/80">
                          Weiterlesen →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Closing Message */}
        <section className="mb-16 text-center py-12 bg-pepe-bg-secondary rounded-2xl">
          <p className="text-xl text-pepe-t80 mb-4">
            Bis bald im PEPE Dome!
          </p>
          <p className="text-pepe-t64 mb-6">
            Folge uns für tägliche Updates und Behind-the-Scenes-Momente
          </p>
          <div className="flex justify-center gap-6">
            <a
              href="https://instagram.com/pepedome"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pepe-gold hover:text-pepe-gold/80 transition-colors"
            >
              Instagram
            </a>
            <a
              href="https://facebook.com/pepedome"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pepe-gold hover:text-pepe-gold/80 transition-colors"
            >
              Facebook
            </a>
          </div>
        </section>

        {/* Signup CTA */}
        <section className="mb-12 py-12 bg-gradient-to-b from-pepe-bg-secondary to-pepe-bg rounded-2xl">
          <div className="max-w-2xl mx-auto px-6">
            <h2 className="h2 text-center mb-4">
              Verpasse keine Highlights mehr
            </h2>
            <p className="text-center text-pepe-t64 mb-8">
              Abonniere unseren Newsletter und erhalte monatlich Updates zu Events, Shows und Workshops.
            </p>
            <SignupForm variant="simple" />
          </div>
        </section>

        {/* JSON-LD Structured Data (Task 8.1.4) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'NewsArticle',
              headline: newsletter.subject,
              description: newsletter.preheader || newsletter.heroSubtitle || '',
              image: newsletter.heroImageUrl || '',
              datePublished: newsletter.sentAt?.toISOString(),
              author: {
                '@type': 'Organization',
                name: 'PEPE Dome',
              },
              publisher: {
                '@type': 'Organization',
                name: 'PEPE Dome',
                logo: {
                  '@type': 'ImageObject',
                  url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/PEPE_logos_dome.svg`,
                },
              },
            }),
          }}
        />
      </div>
    </div>
  )
}
