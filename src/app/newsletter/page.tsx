/**
 * Phase 3 Task 3.4.1: Newsletter Signup Page Rebuild
 *
 * Features:
 * - Form: Name, Email, Interests
 * - GDPR checkbox
 * - Success/error handling
 * - Extended SignupForm variant
 * - Newsletter archive section
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getAllNewsletters, getNewsletterContent } from '@/lib/data'
import { getPublishedNewsletters } from '@/lib/newsletters'
import SignupForm from '@/components/custom/SignupForm'
import HeroSection from '@/components/custom/HeroSection'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'

export const metadata: Metadata = {
  title: 'Newsletter | Pepe Dome München',
  description: 'Melde dich für den Pepe Dome Newsletter an und erhalte monatliche Updates zu Shows, Workshops und Events.',
}

export const dynamic = 'force-dynamic'

export default async function NewsletterPage() {
  const mockNewsletters = getAllNewsletters()
  const content = getNewsletterContent()

  // Fetch published newsletters from database
  let publishedNewsletters: Awaited<ReturnType<typeof getPublishedNewsletters>> = []
  try {
    publishedNewsletters = await getPublishedNewsletters()
  } catch (error) {
    console.error('Failed to fetch published newsletters:', error)
  }

  // Group newsletters by year for filtering
  const newslettersByYear = publishedNewsletters.reduce((acc: Record<number, typeof publishedNewsletters>, newsletter: {
    id: string
    slug: string
    subject: string
    preheader: string | null
    sentAt: Date | null
    heroTitle: string | null
    heroSubtitle: string | null
    heroImageUrl: string | null
  }) => {
    const year = new Date(newsletter.sentAt!).getFullYear()
    if (!acc[year]) acc[year] = []
    acc[year].push(newsletter)
    return acc
  }, {} as Record<number, typeof publishedNewsletters>)

  const years = Object.keys(newslettersByYear).sort((a, b) => Number(b) - Number(a))

  return (
    <div className="min-h-screen bg-[var(--pepe-black)]">
      {/* Hero Section */}
      <HeroSection
        title="Newsletter"
        subtitle={content.signup.description}
        size="sm"
      />

      <div className="stage-container py-20 md:py-28">
        {/* Intro Text */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-[var(--pepe-t80)] text-lg leading-relaxed">
            Erhalte monatlich Updates zu Events, Shows und Workshops. Wähle deine Interessen
            und verpasse keine Highlights mehr.
          </p>
        </div>

        {/* Signup Form - Extended variant (Task 3.4.1) */}
        <div className="max-w-2xl mx-auto mb-20">
          <SignupForm variant="extended" />
        </div>

        {/* Benefits Section */}
        <div className="max-w-4xl mx-auto mb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] text-center mb-10">
            Was du bekommst
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-xl p-6 text-center hover:border-[var(--pepe-gold)] transition-colors duration-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--pepe-gold)]/10 flex items-center justify-center">
                <span className="text-[var(--pepe-gold)] text-3xl">📅</span>
              </div>
              <h3 className="text-lg font-bold text-[var(--pepe-white)] mb-2">Event-Vorschauen</h3>
              <p className="text-[var(--pepe-t64)] text-sm">
                Sei der Erste, der von neuen Shows, Workshops und Festivals erfährt.
              </p>
            </div>
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-xl p-6 text-center hover:border-[var(--pepe-gold)] transition-colors duration-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--pepe-gold)]/10 flex items-center justify-center">
                <span className="text-[var(--pepe-gold)] text-3xl">🎭</span>
              </div>
              <h3 className="text-lg font-bold text-[var(--pepe-white)] mb-2">Backstage Stories</h3>
              <p className="text-[var(--pepe-t64)] text-sm">
                Exklusive Einblicke hinter die Kulissen und Interviews mit Künstlern.
              </p>
            </div>
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-xl p-6 text-center hover:border-[var(--pepe-gold)] transition-colors duration-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--pepe-gold)]/10 flex items-center justify-center">
                <span className="text-[var(--pepe-gold)] text-3xl">&#10024;</span>
              </div>
              <h3 className="text-lg font-bold text-[var(--pepe-white)] mb-2">Special Offers</h3>
              <p className="text-[var(--pepe-t64)] text-sm">
                Early-Bird-Tickets und exklusive Angebote für Abonnenten.
              </p>
            </div>
          </div>
        </div>

        {/* Archive Section */}
        {publishedNewsletters.length > 0 && (
          <section>
            <div className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-2">
                Newsletter Archiv
              </h2>
              <p className="text-[var(--pepe-t64)]">
                Stöbere durch vergangene Newsletter und entdecke, was du verpasst hast.
              </p>

              {/* Year Filter */}
              {years.length > 1 && (
                <div className="flex items-center gap-2 mt-6">
                  <label htmlFor="year-filter" className="text-sm font-medium text-[var(--pepe-t80)]">
                    Jahr:
                  </label>
                  <select
                    id="year-filter"
                    className="px-4 py-2 rounded-lg bg-[var(--pepe-ink)] border border-[var(--pepe-line)] text-[var(--pepe-t80)] focus:outline-none focus:ring-2 focus:ring-[var(--pepe-gold)]/40 focus:border-[var(--pepe-gold)]"
                  >
                    <option value="">Alle Jahre</option>
                    {years.map(year => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Published Newsletters Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {publishedNewsletters.map((newsletter: {
                id: string
                slug: string
                subject: string
                preheader: string | null
                sentAt: Date | null
                heroTitle: string | null
                heroSubtitle: string | null
                heroImageUrl: string | null
              }) => (
                <Link key={newsletter.id} href={`/newsletter/${newsletter.slug}`} className="group">
                  <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-xl p-6 h-full hover:border-[var(--pepe-gold)] transition-all duration-300 hover:-translate-y-1">
                    {/* Date Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[var(--pepe-gold)]/20 text-[var(--pepe-gold)] border border-[var(--pepe-gold)]/40">
                        {new Date(newsletter.sentAt!).toLocaleDateString('de-DE', {
                          month: 'long',
                          year: 'numeric',
                          day: 'numeric'
                        })}
                      </span>
                      <span className="text-xs text-[var(--pepe-t48)]">
                        Versendet
                      </span>
                    </div>

                    {/* Newsletter Title */}
                    <h3 className="text-lg font-bold text-[var(--pepe-white)] mb-3 group-hover:text-[var(--pepe-gold)] transition-colors">
                      {newsletter.heroTitle || newsletter.subject}
                    </h3>

                    {/* Preheader/Subtitle */}
                    {(newsletter.heroSubtitle || newsletter.preheader) && (
                      <p className="text-[var(--pepe-t64)] text-sm mb-4 line-clamp-2">
                        {newsletter.heroSubtitle || newsletter.preheader}
                      </p>
                    )}

                    {/* Hero Image Preview */}
                    {newsletter.heroImageUrl && (
                      <div className="mt-4 rounded-lg overflow-hidden relative h-32">
                        <Image
                          src={newsletter.heroImageUrl}
                          alt={newsletter.heroTitle || newsletter.subject}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, 400px"
                        />
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Mock Newsletter Archive (fallback for development) */}
        {publishedNewsletters.length === 0 && mockNewsletters.length > 0 && (
          <section>
            <div className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-2">
                {content.archive.title}
              </h2>
              <p className="text-[var(--pepe-t64)]">{content.archive.description}</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mockNewsletters.map(newsletter => (
                <Link key={newsletter.id} href={`/newsletter/${newsletter.id}`} className="group">
                  <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-xl p-6 h-full hover:border-[var(--pepe-gold)] transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[var(--pepe-gold)]/20 text-[var(--pepe-gold)] border border-[var(--pepe-gold)]/40">
                        {new Date(newsletter.publishedAt).toLocaleDateString('de-DE', {
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                      {newsletter.sentAt && (
                        <span className="text-xs text-[var(--pepe-t48)]">
                          Versendet
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-[var(--pepe-white)] mb-3 group-hover:text-[var(--pepe-gold)] transition-colors">
                      {newsletter.title}
                    </h3>

                    <p className="text-[var(--pepe-t64)] text-sm mb-4 line-clamp-2">
                      {newsletter.intro}
                    </p>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[var(--pepe-t48)]">
                        {newsletter.events.length} Events
                      </span>
                      {newsletter.sentCount && (
                        <span className="text-[var(--pepe-t48)]">
                          {newsletter.sentCount} Empfänger
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
