/**
 * Home Page — localized (DE / EN)
 *
 * Statische Texte stammen aus src/dictionaries/{lang}.json.
 * Dynamische Daten (Events/News) kommen weiterhin aus der DB.
 *
 * Migrations-Stand: HOME (erste lokalisierte Seite).
 */

import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import nextDynamic from 'next/dynamic'
import { isLocale, localizedHref, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/get-dictionary'
import {
  getFeaturedArticles,
  getRecentArticles,
  getUpcomingEvents,
  type EventData,
  type ArticleData,
} from '@/lib/db-data'
import EventsCarousel from '@/components/custom/EventsCarousel'
import NewsCard from '@/components/custom/NewsCard'
import SignupForm from '@/components/custom/SignupForm'
import { Button } from '@/components/ui/Button'
import HomeDotCloud from '@/components/custom/HomeDotCloud'
import HeroBackgroundVideo from '@/components/custom/HeroBackgroundVideo'

const VideoCarousel = nextDynamic(() => import('@/components/custom/VideoCarousel'), { ssr: true })

export const dynamic = 'force-dynamic'

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang: rawLang } = await params
  if (!isLocale(rawLang)) notFound()
  const lang: Locale = rawLang

  const dict = await getDictionary(lang)
  const t = dict.home

  let displayEvents: EventData[] = []
  let displayNews: ArticleData[] = []

  try {
    const [featuredArticles, recentArticles, upcomingEvents] = await Promise.all([
      getFeaturedArticles(lang),
      getRecentArticles(4, lang),
      getUpcomingEvents(lang),
    ])
    displayEvents = upcomingEvents.slice(0, 3)
    const merged = featuredArticles.length > 0
      ? [...featuredArticles, ...recentArticles.filter((a) => !featuredArticles.find((f) => f.id === a.id))]
      : recentArticles
    displayNews = merged
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 1)
  } catch (err) {
    console.error('HomePage data error:', err)
  }

  // Features — Reihenfolge + Icons sind fix, Texte lokalisiert
  const featureKeys: Array<'show' | 'training' | 'dome' | 'community'> = [
    'show',
    'training',
    'dome',
    'community',
  ]
  const featureImages: Record<string, string> = {
    show: '/images/shows/carmen-jonas-duo.jpg',
    training: '/images/Kategorien/Training.webp',
    dome: '/images/Kategorien/Location.webp',
    community: '/images/Kategorien/Community.webp',
  }
  const featureEmojis: Record<string, string> = {
    show: '🎭',
    training: '💪',
    dome: '🏛️',
    community: '🤝',
  }
  // Jede Karte führt zur passenden Seite — keine Sackgassen
  const featureLinks: Record<string, string> = {
    show: '/events',
    training: '/training',
    dome: '/about',
    community: '/news',
  }
  const dateLocale = lang === 'en' ? 'en-US' : 'de-DE'
  const pressQuotes = (t.press?.quotes ?? []) as { text: string; source: string }[]

  return (
    <>
      {/* ===== Hero Section ===== */}
      <section className="relative min-h-[100dvh] md:min-h-[90vh] flex flex-col overflow-hidden bg-[var(--pepe-black)] -mt-20 pt-20">
        <div className="absolute inset-0 pointer-events-none">
          <HeroBackgroundVideo />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--pepe-black)]/50 via-transparent to-[var(--pepe-black)]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--pepe-black)]/30 via-transparent to-[var(--pepe-black)]/30" />
        </div>

        <HomeDotCloud />

        <div className="stage-container relative z-10 flex-shrink-0 pt-[2.31rem] md:pt-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-[var(--pepe-white)] leading-tight [text-shadow:0_2px_16px_rgba(0,0,0,0.7)]">
              {t.hero.title}
            </h1>
            <p className="mt-5 text-lg md:text-2xl text-[var(--pepe-gold)] font-medium max-w-2xl mx-auto [text-shadow:0_1px_8px_rgba(0,0,0,0.8)]">
              {t.hero.subtitle}
            </p>
          </div>
        </div>

        <div className="relative z-10 flex-1 min-h-[1rem]" />

        <div className="relative z-10 h-[22vh] min-h-[160px] flex flex-col items-center justify-center pt-[5vh] md:pt-0 pb-6 md:pb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-4 sm:gap-6 justify-center">
            <Link href={localizedHref(lang, '/events')} className="w-full sm:w-auto flex justify-center sm:block">
              <Button variant="primary" size="xl" className="min-w-[200px] sm:min-w-[220px] w-full sm:w-auto">
                {t.hero.ctaPrimary}
              </Button>
            </Link>
            <Link href={localizedHref(lang, '/training')} className="w-full sm:w-auto flex justify-center sm:block">
              <Button variant="secondary" size="xl" className="min-w-[200px] sm:min-w-[220px] w-full sm:w-auto">
                {t.hero.ctaSecondary}
              </Button>
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--pepe-black)] to-transparent pointer-events-none" />
      </section>

      {/* ===== Kommende Events ===== */}
      <section className="py-12 md:py-16 bg-[var(--pepe-black)]">
        <div className="stage-container">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-2">
                {t.upcomingEvents.title}
              </h2>
              <p className="text-[var(--pepe-t64)] text-sm md:text-base">
                {t.upcomingEvents.subtitle}
              </p>
            </div>
            <Link href={localizedHref(lang, '/events')}>
              <Button variant="ghost" size="sm">
                {t.upcomingEvents.viewAll}
              </Button>
            </Link>
          </div>

          {displayEvents.length > 0 ? (
            <EventsCarousel
              events={displayEvents.map((e) => ({
                id: e.id,
                slug: e.slug,
                title: e.title,
                description: e.description,
                date: e.date,
                category: e.category,
                imageUrl: e.imageUrl,
              }))}
            />
          ) : (
            <div className="text-center py-10 bg-[var(--pepe-ink)] rounded-xl border border-[var(--pepe-line)]">
              <p className="text-[var(--pepe-t64)]">{t.upcomingEvents.empty}</p>
              <Link href={localizedHref(lang, '/events')} className="text-[var(--pepe-gold)] hover:underline mt-2 inline-block">
                {t.upcomingEvents.viewAll}
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ===== Features Grid ===== */}
      <section className="py-16 md:py-24 bg-[var(--pepe-black)]">
        <div className="stage-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-6">
              {t.features.title}
            </h2>
            <p className="text-lg text-[var(--pepe-t64)] max-w-2xl mx-auto leading-relaxed">
              {t.features.subtitle}
            </p>
          </div>

          <div className="features-grid">
            {featureKeys.map((key) => {
              const feature = t.features.items[key]
              return (
                <Link
                  key={key}
                  href={localizedHref(lang, featureLinks[key])}
                  className="group min-w-0 block bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl overflow-hidden hover:border-[var(--pepe-gold)] transition-all duration-500 ease-out shadow-lg hover:shadow-[0_20px_40px_rgba(0,0,0,0.4),0_0_15px_var(--pepe-gold-glow)]"
                >
                  <div className="relative aspect-video w-full overflow-hidden">
                    <Image
                      src={featureImages[key] || '/TheDome.png'}
                      alt={feature.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      loading="lazy"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--pepe-ink)] to-transparent" />
                    <div className="absolute bottom-4 left-4 w-12 h-12 rounded-xl bg-[var(--pepe-gold)]/20 backdrop-blur-md flex items-center justify-center border border-[var(--pepe-gold)]/30">
                      <span className="text-[var(--pepe-gold)] text-2xl leading-none">
                        {featureEmojis[key]}
                      </span>
                    </div>
                  </div>

                  <div className="p-8 text-center lg:text-left">
                    <h3 className="text-xl font-bold text-[var(--pepe-white)] mb-4 group-hover:text-[var(--pepe-gold)] transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-[var(--pepe-t64)] leading-relaxed mb-4">
                      {feature.description}
                    </p>
                    <span className="text-sm font-semibold text-[var(--pepe-gold)]">
                      {t.features.more} →
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== Café Section ===== */}
      <section className="py-14 md:py-20 bg-gradient-to-b from-[var(--pepe-black)] to-[var(--pepe-ink)]">
        <div className="stage-container">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest bg-[var(--pepe-gold)]/20 text-[var(--pepe-gold)] border border-[var(--pepe-gold)]/40 mb-5">
              {t.cafe.eyebrow}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-4 leading-tight">
              {t.cafe.titleA}<span className="text-[var(--pepe-gold)]">{t.cafe.titleB}</span>
            </h2>
            <p className="text-base md:text-lg text-[var(--pepe-t80)] leading-relaxed mb-10 max-w-xl mx-auto">
              {t.cafe.text}
            </p>

            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-4 md:p-5 max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 text-left">
                <div className="relative w-full sm:w-44 sm:h-32 aspect-[4/3] sm:aspect-auto flex-shrink-0 rounded-xl overflow-hidden bg-[var(--pepe-surface)]">
                  <Image
                    src="/Coffee.png"
                    alt={t.cafe.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 90vw, 176px"
                    unoptimized
                  />
                </div>

                <div className="flex-1 w-full">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[var(--pepe-gold)] text-base">🕐</span>
                    <h3 className="text-[var(--pepe-white)] font-bold uppercase tracking-wide text-xs">
                      {t.cafe.hoursLabel}
                    </h3>
                  </div>
                  <p className="text-[var(--pepe-t80)] text-sm mb-1">{t.cafe.days}</p>
                  <p className="text-[var(--pepe-white)] font-bold tabular-nums text-xl md:text-2xl">
                    {t.cafe.time}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-[var(--pepe-t64)] text-sm mt-6">{t.cafe.address}</p>
          </div>
        </div>
      </section>

      {/* ===== Pressestimmen (erscheint erst, wenn Zitate im Dictionary stehen) ===== */}
      {pressQuotes.length > 0 && (
        <section className="py-16 md:py-24 bg-[var(--pepe-ink)]/30">
          <div className="stage-container">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] text-center mb-12">
              {t.press.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {pressQuotes.map((quote, index) => (
                <blockquote
                  key={index}
                  className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-6 md:p-8"
                >
                  <p className="text-[var(--pepe-t80)] text-lg leading-relaxed mb-4">
                    „{quote.text}“
                  </p>
                  <footer className="text-sm text-[var(--pepe-gold)] font-semibold">
                    {quote.source}
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== Video Carousel ===== */}
      <section className="py-8 md:py-16 bg-[var(--pepe-black)]">
        <div className="stage-container mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] text-center mb-4">
            {t.videoCarousel.title}
          </h2>
          <p className="text-[var(--pepe-t64)] text-lg text-center max-w-2xl mx-auto">
            {t.videoCarousel.subtitle}
          </p>
        </div>
        <VideoCarousel />
      </section>

      {/* ===== Latest News ===== */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-[var(--pepe-black)] via-[var(--pepe-ink)]/30 to-[var(--pepe-black)]">
        <div className="stage-container">
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-4">
              {t.news.title}
            </h2>
            <p className="text-[var(--pepe-t64)] text-lg mb-6">{t.news.subtitle}</p>
            <Link href={localizedHref(lang, '/news')}>
              <Button variant="ghost" size="sm">
                {t.news.viewAll}
              </Button>
            </Link>
          </div>

          {displayNews.length > 0 ? (
            <div className="mx-auto max-w-2xl">
              <div className="grid grid-cols-1 gap-5">
                {displayNews.map((article) => (
                  <NewsCard
                    key={article.id}
                    title={article.title}
                    excerpt={article.excerpt}
                    date={new Date(article.publishedAt).toLocaleDateString(dateLocale, {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                    author={article.author}
                    category={article.category}
                    image={article.imageUrl || undefined}
                    href={`${localizedHref(lang, '/news')}/${article.slug}`}
                    featured={false}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-[var(--pepe-ink)] rounded-xl border border-[var(--pepe-line)] max-w-2xl mx-auto">
              <p className="text-[var(--pepe-t64)]">{t.news.empty}</p>
            </div>
          )}
        </div>
      </section>

      {/* ===== Newsletter CTA ===== */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-[var(--pepe-black)] to-[var(--pepe-ink)]">
        <div className="stage-container">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 mx-auto mb-10 rounded-full bg-[var(--pepe-gold)]/10 flex items-center justify-center">
              <span className="text-[var(--pepe-gold)] text-3xl leading-none">&#9993;</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-6">
              {t.newsletter.title}
            </h2>
            <p className="text-[var(--pepe-t80)] text-lg mb-10">
              {t.newsletter.text}
            </p>

            <div className="max-w-md mx-auto">
              <SignupForm variant="simple" lang={lang} />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
