/**
 * Newsletter-Ausgabe als Webseite (DE / EN)
 *
 * Diese Seite ist der Rückfallweg für alles, was in E-Mail-Clients schief
 * gehen kann, und gleichzeitig das Archiv. Sie nutzt deshalb dasselbe
 * Viewmodel wie der Versand.
 *
 * Vorher las sie Events und Artikel aus statischen JSON-Dateien, während
 * Versand und Admin längst aus der Datenbank kamen. Jede Ausgabe mit
 * Events aus der Datenbank erschien hier deshalb ohne Inhalt.
 *
 * Die gespeicherten Inhalte selbst bleiben, wie sie in der Datenbank
 * liegen (in der Regel Deutsch). Lokalisiert ist die Seitenhülle.
 */

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getNewsletterBySlug } from '@/lib/newsletters'
import { jsonLdScriptContent } from '@/lib/json-ld'
import {
  buildViewModelFromNewsletter,
  type NewsletterEventItem,
  type NewsletterArticleItem,
  type NewsletterNoteItem,
} from '@/lib/newsletter-content'
import SignupForm from '@/components/custom/SignupForm'
import NewsletterMarkdown from '@/components/custom/NewsletterMarkdown'
import { isLocale, localizedHref, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/get-dictionary'
import { pageMetadata } from '@/lib/seo'

interface NewsletterPageProps {
  params: Promise<{ lang: string; slug: string }>
}

export const dynamic = 'force-dynamic'
export const revalidate = 3600

export async function generateMetadata({ params }: NewsletterPageProps): Promise<Metadata> {
  const { lang: rawLang, slug } = await params
  if (!isLocale(rawLang)) return {}
  const dict = await getDictionary(rawLang)
  const dateLocale = rawLang === 'en' ? 'en-US' : 'de-DE'

  try {
    const newsletter = await getNewsletterBySlug(slug)
    if (!newsletter) {
      return { title: dict.newsletter.issue.notFound }
    }

    // Fällt bewusst nicht mehr auf http://localhost:3000 zurück. Fehlte
    // NEXT_PUBLIC_APP_URL in der Produktion, landeten canonical- und og:url-Tag
    // auf localhost — für Google ein unerreichbares Ziel, und geteilte Links
    // zeigten ins Nichts. Die Live-Domain ist eine Konstante, kein Env-Wert.
    return pageMetadata({
      lang: rawLang,
      path: `/newsletter/${newsletter.slug}`,
      title: newsletter.subject,
      description:
        newsletter.preheader ||
        newsletter.heroSubtitle ||
        `${dict.newsletter.issue.sentOn} ${new Date(newsletter.sentAt!).toLocaleDateString(dateLocale)}`,
      article: { publishedTime: newsletter.sentAt?.toISOString() },
      images: newsletter.heroImageUrl
        ? [
            {
              url: newsletter.heroImageUrl,
              width: 1200,
              height: 630,
              alt: newsletter.heroTitle || newsletter.subject,
            },
          ]
        : undefined,
    })
  } catch (error) {
    console.error('Failed to generate metadata for newsletter:', error)
    return { title: 'Newsletter' }
  }
}

export default async function NewsletterSlugPage({ params }: NewsletterPageProps) {
  const { lang: rawLang, slug } = await params
  if (!isLocale(rawLang)) notFound()
  const lang: Locale = rawLang
  const dict = await getDictionary(lang)
  const t = dict.newsletter.issue
  const dateLocale = lang === 'en' ? 'en-US' : 'de-DE'

  let newsletter
  try {
    newsletter = await getNewsletterBySlug(slug)
  } catch (error) {
    console.error('Failed to fetch newsletter:', error)
    notFound()
  }
  if (!newsletter) notFound()

  const vm = await buildViewModelFromNewsletter(newsletter, { dateLocale, target: 'web' })

  const newsletterBase = localizedHref(lang, '/newsletter')
  const eventsBase = localizedHref(lang, '/events')
  const newsBase = localizedHref(lang, '/news')

  /** Interne Ziele ohne UTM: Auf der Website wäre das Selbstzuordnung. */
  const eventHref = (event: NewsletterEventItem) => localizedHref(lang, `/events/${event.slug}`)
  const articleHref = (article: NewsletterArticleItem) => `${newsBase}/${article.slug}`

  const ctaLabelFor = (event: NewsletterEventItem) =>
    event.isMailCta ? t.ticketMail : t.ticketBuy

  /**
   * Auf der Website ohne Kampagnenparameter verlinken. Wer hier klickt,
   * kommt nicht aus einer E-Mail; utm_source=newsletter wäre schlicht falsch.
   */
  const ctaHrefFor = (event: NewsletterEventItem) => event.ctaUrlPlain

  return (
    <div className="section">
      <div className="stage-container max-w-4xl">
        <header className="mb-10 text-center">
          <div className="mb-4">
            <Link href={newsletterBase} className="text-sm text-pepe-gold hover:text-pepe-gold/80 transition-colors">
              {t.backToArchive}
            </Link>
          </div>

          <p className="text-sm text-pepe-t64 mb-2">
            {t.sentOn}{' '}
            {new Date(newsletter.sentAt!).toLocaleDateString(dateLocale, {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>

          <h1 className="display-2 mb-4">{vm.hero.title}</h1>

          {vm.hero.subtitle && (
            <p className="lead text-pepe-t80 max-w-2xl mx-auto">{vm.hero.subtitle}</p>
          )}
        </header>

        {vm.hero.imageUrl && (
          <div className="mb-12 rounded-2xl overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={vm.hero.imageUrl}
              alt={vm.hero.title}
              className="w-full h-auto max-h-[28rem] object-cover"
            />
          </div>
        )}

        {vm.introText && (
          <div className="mb-14 max-w-2xl mx-auto">
            <NewsletterMarkdown source={vm.introText} />
          </div>
        )}

        {vm.sections.map((section, sectionIndex) => (
          <section key={sectionIndex} className="mb-14">
            {section.heading && (
              <div className="mb-8 border-b border-pepe-line pb-3">
                <h2 className="text-sm font-bold uppercase tracking-widest text-pepe-t64">
                  {section.heading}
                </h2>
                {section.description && (
                  <p className="text-pepe-t64 mt-2">{section.description}</p>
                )}
              </div>
            )}

            <div className="space-y-6">
              {section.items.map((item) => {
                if (item.kind === 'event') {
                  const event = item as NewsletterEventItem

                  // Aufmacher: großes Bild, ausführlicher Text, primärer Button
                  if (event.emphasis === 'lead') {
                    return (
                      <article key={event.id} className="card overflow-hidden">
                        {event.imageUrl && (
                          <Link href={eventHref(event)}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={event.imageUrl}
                              alt={event.title}
                              className="w-full h-64 md:h-80 object-cover"
                            />
                          </Link>
                        )}
                        <div className="p-6 md:p-8">
                          {event.categoryLabel && (
                            <p className="text-xs font-bold uppercase tracking-widest text-pepe-gold mb-3">
                              {event.categoryLabel}
                            </p>
                          )}
                          <h3 className="h2 mb-3">
                            <Link href={eventHref(event)} className="hover:text-pepe-gold transition-colors">
                              {event.title}
                            </Link>
                          </h3>
                          <p className="text-pepe-gold font-semibold mb-1">
                            {[event.dateLabel, event.time].filter(Boolean).join(' · ')}
                          </p>
                          {event.location && (
                            <p className="text-sm text-pepe-t64 mb-4">{event.location}</p>
                          )}
                          {event.teaser && <p className="text-pepe-t80 mb-6">{event.teaser}</p>}
                          <a href={ctaHrefFor(event)} className="btn-primary inline-block">
                            {ctaLabelFor(event)}
                          </a>
                        </div>
                      </article>
                    )
                  }

                  // Zweite Reihe: kleinere Karte, Textlink statt Button
                  if (event.emphasis === 'feature') {
                    return (
                      <article key={event.id} className="card p-5 md:p-6">
                        <div className="flex flex-col md:flex-row gap-5">
                          {event.imageUrl && (
                            <Link href={eventHref(event)} className="md:w-1/3 shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={event.imageUrl}
                                alt={event.title}
                                className="w-full h-40 object-cover rounded-lg"
                              />
                            </Link>
                          )}
                          <div className="flex-1">
                            <h3 className="h3 mb-2">
                              <Link href={eventHref(event)} className="hover:text-pepe-gold transition-colors">
                                {event.title}
                              </Link>
                            </h3>
                            <p className="text-pepe-gold text-sm font-semibold mb-1">
                              {[event.dateLabel, event.time].filter(Boolean).join(' · ')}
                            </p>
                            {event.location && (
                              <p className="text-sm text-pepe-t64 mb-3">{event.location}</p>
                            )}
                            {event.teaser && <p className="text-pepe-t80 mb-4">{event.teaser}</p>}
                            <a href={ctaHrefFor(event)} className="text-pepe-gold font-semibold hover:text-pepe-gold/80">
                              {ctaLabelFor(event)} ›
                            </a>
                          </div>
                        </div>
                      </article>
                    )
                  }

                  // Weitere Termine: kompakte Zeile mit Datumsfeld
                  return (
                    <article
                      key={event.id}
                      className="flex gap-4 items-start border-b border-pepe-line2 pb-6 last:border-0"
                    >
                      <div className="w-14 shrink-0 rounded-lg bg-pepe-surface text-center py-2">
                        <div className="text-xl font-bold leading-none">{event.dayLabel}</div>
                        <div className="text-[11px] font-bold uppercase tracking-wide text-pepe-gold mt-1">
                          {event.monthLabel}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-semibold mb-1">
                          <Link href={eventHref(event)} className="hover:text-pepe-gold transition-colors">
                            {event.title}
                          </Link>
                        </h3>
                        <p className="text-sm text-pepe-t64 mb-2">
                          {[event.weekdayLabel, event.time, event.location].filter(Boolean).join(' · ')}
                        </p>
                        <a href={ctaHrefFor(event)} className="text-sm text-pepe-gold font-semibold hover:text-pepe-gold/80">
                          {ctaLabelFor(event)} ›
                        </a>
                      </div>
                    </article>
                  )
                }

                if (item.kind === 'article') {
                  const article = item as NewsletterArticleItem
                  return (
                    <article key={article.id} className="border-l-2 border-pepe-gold pl-5">
                      {article.category && (
                        <p className="text-xs font-bold uppercase tracking-widest text-pepe-t64 mb-2">
                          {article.category}
                        </p>
                      )}
                      <h3 className="h3 mb-2">
                        <Link href={articleHref(article)} className="hover:text-pepe-gold transition-colors">
                          {article.title}
                        </Link>
                      </h3>
                      {article.teaser && <p className="text-pepe-t80 mb-3">{article.teaser}</p>}
                      <Link href={articleHref(article)} className="text-pepe-gold font-semibold hover:text-pepe-gold/80">
                        {t.readMore}
                      </Link>
                    </article>
                  )
                }

                const note = item as NewsletterNoteItem
                return (
                  <div key={note.position} className="card p-6">
                    {note.title && <h3 className="h3 mb-2">{note.title}</h3>}
                    {note.text && <NewsletterMarkdown source={note.text} />}
                  </div>
                )
              })}
            </div>
          </section>
        ))}

        <section className="mb-14 text-center py-10 border-t border-pepe-line">
          <p className="text-pepe-t64 mb-6">{t.closingText}</p>
          <Link href={eventsBase} className="btn-secondary inline-block">
            {t.allEvents}
          </Link>
        </section>

        <section className="mb-12 py-12 bg-pepe-bg-secondary rounded-2xl">
          <div className="max-w-2xl mx-auto px-6">
            <h2 className="h2 text-center mb-4">{t.ctaTitle}</h2>
            <p className="text-center text-pepe-t64 mb-8">{t.ctaText}</p>
            <SignupForm variant="simple" lang={lang} />
          </div>
        </section>

        {/*
          jsonLdScriptContent statt JSON.stringify: Betreff und Preheader kommen
          aus der Redaktion. Ein schliessendes Script-Tag darin wuerde den Block
          beenden und den Rest als JavaScript ausfuehren.
        */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLdScriptContent({
              '@context': 'https://schema.org',
              '@type': 'NewsArticle',
              headline: newsletter.subject,
              description: newsletter.preheader || newsletter.heroSubtitle || '',
              image: vm.hero.imageUrl || '',
              datePublished: newsletter.sentAt?.toISOString(),
              author: { '@type': 'Organization', name: 'PEPE Dome' },
              publisher: {
                '@type': 'Organization',
                name: 'PEPE Dome',
                logo: {
                  '@type': 'ImageObject',
                  url: `${vm.baseUrl}/PEPE_logos_dome.svg`,
                },
              },
            }),
          }}
        />
      </div>
    </div>
  )
}
