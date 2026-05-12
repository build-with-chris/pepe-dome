/**
 * Newsletter Signup Page — localized (DE / EN)
 *
 * Archive zeigt die in der DB gespeicherten Newsletter (deren Inhalt
 * weiterhin auf Deutsch ist — das ist gewollt für den MVP-Stand).
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getPublishedNewsletters } from '@/lib/newsletters'
import SignupForm from '@/components/custom/SignupForm'
import HeroSection from '@/components/custom/HeroSection'
import { isLocale, localizedHref, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/get-dictionary'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang: rawLang } = await params
  if (!isLocale(rawLang)) return {}
  const dict = await getDictionary(rawLang)
  return {
    title: dict.newsletter.meta.title,
    description: dict.newsletter.meta.description,
    alternates: { canonical: `https://www.pepe-dome.de/${rawLang}/newsletter` },
  }
}

export const dynamic = 'force-dynamic'

export default async function NewsletterPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang: rawLang } = await params
  if (!isLocale(rawLang)) notFound()
  const lang: Locale = rawLang
  const dict = await getDictionary(lang)
  const t = dict.newsletter
  const dateLocale = lang === 'en' ? 'en-US' : 'de-DE'

  let publishedNewsletters: Awaited<ReturnType<typeof getPublishedNewsletters>> = []
  try {
    publishedNewsletters = await getPublishedNewsletters()
  } catch (error) {
    console.error('Failed to fetch published newsletters:', error)
  }

  type PublishedNewsletter = (typeof publishedNewsletters)[number]
  const newslettersByYear = publishedNewsletters.reduce(
    (acc: Record<number, PublishedNewsletter[]>, newsletter: PublishedNewsletter) => {
      const year = new Date(newsletter.sentAt!).getFullYear()
      if (!acc[year]) acc[year] = []
      acc[year].push(newsletter)
      return acc
    },
    {} as Record<number, PublishedNewsletter[]>,
  )

  const years = Object.keys(newslettersByYear).sort((a, b) => Number(b) - Number(a))
  const newsletterBase = localizedHref(lang, '/newsletter')

  return (
    <div className="min-h-screen bg-[var(--pepe-black)]">
      <HeroSection title={t.hero.title} subtitle={t.hero.subtitle} size="sm" />

      <div className="stage-container py-20 md:py-28">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-[var(--pepe-t80)] text-lg leading-relaxed">{t.intro}</p>
        </div>

        <div className="max-w-2xl mx-auto mb-20">
          <SignupForm variant="extended" lang={lang} />
        </div>

        {/* Benefits */}
        <div className="max-w-4xl mx-auto mb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] text-center mb-10">
            {t.benefits.title}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {t.benefits.items.map((item, i) => (
              <div
                key={i}
                className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-xl p-6 text-center hover:border-[var(--pepe-gold)] transition-colors duration-300"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--pepe-gold)]/10 flex items-center justify-center">
                  <span className="text-[var(--pepe-gold)] text-3xl">{item.icon}</span>
                </div>
                <h3 className="text-lg font-bold text-[var(--pepe-white)] mb-2">{item.title}</h3>
                <p className="text-[var(--pepe-t64)] text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Archive */}
        {publishedNewsletters.length > 0 && (
          <section>
            <div className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-2">
                {t.archive.title}
              </h2>
              <p className="text-[var(--pepe-t64)]">{t.archive.subtitle}</p>

              {years.length > 1 && (
                <div className="flex items-center gap-2 mt-6">
                  <label htmlFor="year-filter" className="text-sm font-medium text-[var(--pepe-t80)]">
                    {t.archive.yearLabel}
                  </label>
                  <select
                    id="year-filter"
                    className="px-4 py-2 rounded-lg bg-[var(--pepe-ink)] border border-[var(--pepe-line)] text-[var(--pepe-t80)] focus:outline-none focus:ring-2 focus:ring-[var(--pepe-gold)]/40 focus:border-[var(--pepe-gold)]"
                  >
                    <option value="">{t.archive.allYears}</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {publishedNewsletters.map((newsletter: PublishedNewsletter) => (
                <Link key={newsletter.id} href={`${newsletterBase}/${newsletter.slug}`} className="group">
                  <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-xl p-6 h-full hover:border-[var(--pepe-gold)] transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[var(--pepe-gold)]/20 text-[var(--pepe-gold)] border border-[var(--pepe-gold)]/40">
                        {new Date(newsletter.sentAt!).toLocaleDateString(dateLocale, {
                          month: 'long',
                          year: 'numeric',
                          day: 'numeric',
                        })}
                      </span>
                      <span className="text-xs text-[var(--pepe-t48)]">{t.archive.sent}</span>
                    </div>

                    <h3 className="text-lg font-bold text-[var(--pepe-white)] mb-3 group-hover:text-[var(--pepe-gold)] transition-colors">
                      {newsletter.heroTitle || newsletter.subject}
                    </h3>

                    {(newsletter.heroSubtitle || newsletter.preheader) && (
                      <p className="text-[var(--pepe-t64)] text-sm mb-4 line-clamp-2">
                        {newsletter.heroSubtitle || newsletter.preheader}
                      </p>
                    )}

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
      </div>
    </div>
  )
}
