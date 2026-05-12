/**
 * News Article Detail Page — localized (DE / EN)
 *
 * Artikel-Daten kommen aus der DB (zur Zeit nur Deutsch). UI-Chrome
 * (Breadcrumbs, Sidebar-Labels, Newsletter-Block, Related-Sektion)
 * ist lokalisiert.
 */

import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getArticleBySlug, getRecentArticles, getUpcomingEvents } from '@/lib/db-data'
import { Button } from '@/components/ui/Button'
import EventCard from '@/components/custom/EventCard'
import SignupForm from '@/components/custom/SignupForm'
import ShareButtons from '@/components/custom/ShareButtons'
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import { isLocale, localizedHref, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/get-dictionary'

const BASE_URL = 'https://www.pepe-dome.de'

function getReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
  const { lang: rawLang, slug } = await params
  if (!isLocale(rawLang)) return {}
  const article = await getArticleBySlug(slug)
  const dict = await getDictionary(rawLang)

  if (!article) {
    return { title: `${dict.news.detail.notFound} - Pepe Dome` }
  }

  const title = article.title
  const description = article.excerpt.slice(0, 160)
  const url = `${BASE_URL}/${rawLang}/news/${article.slug}`

  return {
    title,
    description,
    keywords: [article.category, 'Pepe Dome', 'München', ...(article.tags || [])],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Pepe Dome',
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.author],
      ...(article.imageUrl && { images: [{ url: article.imageUrl, width: 1200, height: 630, alt: article.title }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(article.imageUrl && { images: [article.imageUrl] }),
    },
  }
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang: rawLang, slug } = await params
  if (!isLocale(rawLang)) notFound()
  const lang: Locale = rawLang
  const dict = await getDictionary(lang)
  const t = dict.news.detail
  const dateLocale = lang === 'en' ? 'en-US' : 'de-DE'

  const article = await getArticleBySlug(slug)
  if (!article) notFound()

  const [upcomingEvents, recentArticles] = await Promise.all([
    getUpcomingEvents(),
    getRecentArticles(4),
  ])

  const relatedArticles = recentArticles.filter((a) => a.id !== article.id).slice(0, 3)
  const relatedEvents = upcomingEvents.slice(0, 3)

  const readingTime = getReadingTime(article.content)
  const formattedDate = new Date(article.publishedAt).toLocaleDateString(dateLocale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const homeHref = localizedHref(lang, '/')
  const newsHref = localizedHref(lang, '/news')
  const eventsHref = localizedHref(lang, '/events')

  return (
    <div className="min-h-screen bg-[var(--pepe-black)]">
      <ArticleJsonLd
        headline={article.title}
        description={article.excerpt}
        author={article.author}
        datePublished={article.publishedAt}
        image={article.imageUrl}
        url={`/${lang}/news/${article.slug}`}
        tags={article.tags}
      />
      <BreadcrumbJsonLd
        items={[
          { name: t.breadcrumbHome, url: `/${lang}` },
          { name: t.breadcrumbNews, url: `/${lang}/news` },
          { name: article.title, url: `/${lang}/news/${article.slug}` },
        ]}
      />

      {/* Hero Image */}
      <section className="relative h-[45vh] min-h-[350px] max-h-[500px] overflow-hidden">
        {article.imageUrl ? (
          <>
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--pepe-black)] via-[var(--pepe-black)]/60 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--pepe-black)] to-[var(--pepe-ink)]" />
        )}

        <nav className="absolute top-8 left-0 right-0 z-10">
          <div className="stage-container">
            <div className="flex items-center gap-2 text-sm text-[var(--pepe-t64)]">
              <Link href={homeHref} className="hover:text-[var(--pepe-white)] transition-colors">
                {t.breadcrumbHome}
              </Link>
              <span>/</span>
              <Link href={newsHref} className="hover:text-[var(--pepe-white)] transition-colors">
                {t.breadcrumbNews}
              </Link>
              <span>/</span>
              <span className="text-[var(--pepe-white)] truncate max-w-[200px]">{article.title}</span>
            </div>
          </div>
        </nav>
      </section>

      <div className="stage-container py-20 md:py-28">
        <div className="grid lg:grid-cols-[1fr_300px] gap-12 lg:gap-16">
          <article>
            <header className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-[var(--pepe-gold)]/20 text-[var(--pepe-gold)] border border-[var(--pepe-gold)]/40">
                  {article.category}
                </span>
                <span className="text-sm text-[var(--pepe-t64)]">
                  {readingTime} {t.readingTime}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--pepe-white)] mb-4 leading-tight">
                {article.title}
              </h1>

              <p className="text-xl text-[var(--pepe-t80)] mb-6 leading-relaxed">
                {article.excerpt}
              </p>

              <div className="flex items-center gap-6 text-sm text-[var(--pepe-t64)] border-b border-[var(--pepe-line)] pb-6">
                <div>
                  <span className="text-[var(--pepe-t48)]">{t.by}</span>
                  <span className="text-[var(--pepe-white)] font-medium">{article.author}</span>
                </div>
                <div>{formattedDate}</div>
              </div>
            </header>

            <div className="prose prose-invert prose-lg max-w-none mb-8">
              {article.content.split('\n\n').map((paragraph, index) => {
                if (paragraph.startsWith('## ')) {
                  return (
                    <h2 key={index} className="text-2xl font-bold text-[var(--pepe-white)] mt-8 mb-4">
                      {paragraph.replace('## ', '')}
                    </h2>
                  )
                }
                if (paragraph.startsWith('### ')) {
                  return (
                    <h3 key={index} className="text-xl font-bold text-[var(--pepe-white)] mt-6 mb-3">
                      {paragraph.replace('### ', '')}
                    </h3>
                  )
                }
                return (
                  <p key={index} className="text-lg text-[var(--pepe-t80)] mb-6 leading-relaxed">
                    {paragraph}
                  </p>
                )
              })}
            </div>

            {article.tags && article.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-[var(--pepe-line)]">
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-sm bg-[var(--pepe-surface)] text-[var(--pepe-t64)] border border-[var(--pepe-line)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-12 pt-8 border-t border-[var(--pepe-line)]">
              <div className="max-w-xl">
                <h3 className="text-xl font-bold text-[var(--pepe-white)] mb-4">
                  {t.newsletterTitle}
                </h3>
                <p className="text-[var(--pepe-t64)] mb-4">{t.newsletterText}</p>
                <SignupForm variant="simple" />
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-8">
            {relatedArticles.length > 0 && (
              <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-xl p-6">
                <h3 className="text-lg font-bold text-[var(--pepe-white)] mb-6">
                  {t.moreArticles}
                </h3>
                <div className="space-y-4">
                  {relatedArticles.map((a) => (
                    <Link key={a.id} href={`${newsHref}/${a.slug}`} className="group block">
                      <div className="flex gap-3">
                        {a.imageUrl && (
                          <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-[var(--pepe-surface)]">
                            <Image
                              src={a.imageUrl}
                              alt={a.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="80px"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <span className="text-xs text-[var(--pepe-gold)] uppercase tracking-wide">
                            {a.category}
                          </span>
                          <h4 className="text-sm font-medium text-[var(--pepe-white)] line-clamp-2 group-hover:text-[var(--pepe-gold)] transition-colors">
                            {a.title}
                          </h4>
                          <p className="text-xs text-[var(--pepe-t48)] mt-1">
                            {new Date(a.publishedAt).toLocaleDateString(dateLocale, {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link href={newsHref} className="block mt-6">
                  <Button variant="secondary" size="sm" className="w-full">
                    {t.allNews}
                  </Button>
                </Link>
              </div>
            )}

            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-xl p-6">
              <h3 className="text-lg font-bold text-[var(--pepe-white)] mb-4">{t.share}</h3>
              <ShareButtons title={article.title} />
            </div>
          </aside>
        </div>

        {relatedEvents.length > 0 && (
          <section className="mt-16 pt-12 border-t border-[var(--pepe-line)]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-[var(--pepe-white)]">
                {t.upcomingEvents}
              </h2>
              <Link href={eventsHref}>
                <Button variant="ghost" size="sm">{t.allEvents}</Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedEvents.map((event) => (
                <EventCard
                  key={event.id}
                  title={event.title}
                  description={event.description}
                  date={new Date(event.date).toLocaleDateString(dateLocale, {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                  category={event.category}
                  image={event.imageUrl || undefined}
                  href={`${eventsHref}/${event.slug}`}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
