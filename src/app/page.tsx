/**
 * Phase 3 Task 3.1: Home Page Rebuild
 *
 * Features:
 * - Task 3.1.1: Rebuild home hero section (full-width, dark background, logo, tagline, CTA buttons)
 * - Task 3.1.2: Build featured events section (3 event cards in grid, "View All Events" link)
 * - Task 3.1.3: Build latest news section (3 article teasers, "View All News" link)
 * - Task 3.1.4: Build newsletter CTA section (email input + subscribe button)
 */

import Link from 'next/link'
import Image from 'next/image'
import { getHomepageContent } from '@/lib/data'
import {
  getFeaturedArticles,
  getRecentArticles,
  getUpcomingEvents,
  getFeaturedEvents,
  type EventData,
  type ArticleData,
} from '@/lib/db-data'
import nextDynamic from 'next/dynamic'
import EventCard from '@/components/custom/EventCard'
import NewsCard from '@/components/custom/NewsCard'
import SignupForm from '@/components/custom/SignupForm'
import { Button } from '@/components/ui/Button'
import HomeDotCloud from '@/components/custom/HomeDotCloud'
import HeroBackgroundVideo from '@/components/custom/HeroBackgroundVideo'

const VideoCarousel = nextDynamic(() => import('@/components/custom/VideoCarousel'), { ssr: true })

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  let homepage: ReturnType<typeof getHomepageContent>
  let displayEvents: EventData[] = []
  let displayNews: ArticleData[] = []

  try {
    homepage = getHomepageContent()
    const [featuredArticles, recentArticles, upcomingEvents, featuredEvents] = await Promise.all([
      getFeaturedArticles(),
      getRecentArticles(4),
      getUpcomingEvents(),
      getFeaturedEvents(),
    ])
    displayEvents = featuredEvents.length > 0
      ? featuredEvents.slice(0, 3)
      : upcomingEvents.slice(0, 3)
    const merged = featuredArticles.length > 0
      ? [...featuredArticles, ...recentArticles.filter(a => !featuredArticles.find(f => f.id === a.id))]
      : recentArticles
    displayNews = merged
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 1)
  } catch (err) {
    console.error('HomePage data error:', err)
    homepage = {
      hero: {
        title: 'Pepe Dome',
        subtitle: 'Zuhause für Artistik & Kultur',
        description: '',
        cta: { primary: 'Aktuelle Events', secondary: 'Newsletter abonnieren' },
      },
      features: [],
    }
    displayEvents = []
    displayNews = []
  }

  return (
    <>
      {/* ===== Task 3.1.1: Hero Section ===== */}
      <section className="relative min-h-[100dvh] md:min-h-[90vh] flex flex-col overflow-hidden bg-[var(--pepe-black)] -mt-20 pt-20">
        {/* Background Video: ein Element, Quelle je nach Viewport (Desktop = PepeDome-Atmosphaere, Mobile = Hochkant) */}
        <div className="absolute inset-0 pointer-events-none">
          <HeroBackgroundVideo />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--pepe-black)]/50 via-transparent to-[var(--pepe-black)]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--pepe-black)]/30 via-transparent to-[var(--pepe-black)]/30" />
        </div>

        {/* DotCloud Icon Layer */}
        <HomeDotCloud />

        {/* Title only */}
        <div className="stage-container relative z-10 flex-shrink-0 pt-[2.31rem] md:pt-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-[var(--pepe-white)] leading-tight">
              {homepage.hero.title}
            </h1>
          </div>
        </div>

        {/* Spacer: pushes CTAs into last quarter */}
        <div className="relative z-10 flex-1 min-h-[1rem]" />

        {/* CTAs + Subtitle darunter */}
        <div className="relative z-10 h-[25vh] min-h-[180px] flex flex-col items-center justify-center pt-[5vh] md:pt-0 pb-6 md:pb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-4 sm:gap-6 justify-center">
            <Link href="/events" className="w-full sm:w-auto flex justify-center sm:block">
              <Button variant="primary" size="xl" className="min-w-[200px] sm:min-w-[220px] w-full sm:w-auto">
                {homepage.hero.cta.primary}
              </Button>
            </Link>
            <Link href="/newsletter" className="w-full sm:w-auto flex justify-center sm:block">
              <Button variant="secondary" size="xl" className="min-w-[200px] sm:min-w-[220px] w-full sm:w-auto">
                {homepage.hero.cta.secondary}
              </Button>
            </Link>
          </div>
          <p className="mt-5 text-lg md:text-2xl text-[var(--pepe-gold)] font-medium">
            {homepage.hero.subtitle}
          </p>
        </div>

        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--pepe-black)] to-transparent pointer-events-none" />
      </section>

      {/* ===== Café Section ===== */}
      <section className="py-14 md:py-20 bg-gradient-to-b from-[var(--pepe-black)] to-[var(--pepe-ink)]">
        <div className="stage-container">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,_1fr)_minmax(0,_1.1fr)] gap-8 md:gap-12 items-center">
              {/* Image — kompakter, max-Höhe begrenzt */}
              <div className="relative aspect-[4/3] w-full max-w-md mx-auto md:max-w-none rounded-2xl overflow-hidden bg-[var(--pepe-surface)] shadow-xl">
                <Image
                  src="/Coffee.png"
                  alt="Café im Pepe Dome"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 90vw, 420px"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--pepe-black)]/30 to-transparent pointer-events-none" />
              </div>

              {/* Text */}
              <div>
                <span className="inline-block px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest bg-[var(--pepe-gold)]/20 text-[var(--pepe-gold)] border border-[var(--pepe-gold)]/40 mb-5">
                  Neu im Pepe Dome
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-4 leading-tight">
                  Unser Café —<br />
                  <span className="text-[var(--pepe-gold)]">offen für alle</span>
                </h2>
                <p className="text-base md:text-lg text-[var(--pepe-t80)] leading-relaxed mb-6">
                  Komm vorbei, trink einen Kaffee, beobachte das Training in der Kuppel
                  oder triff Freunde. Mitten im Ostpark.
                </p>

                {/* Öffnungszeiten */}
                <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-5 md:p-6 mb-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[var(--pepe-gold)] text-xl">🕐</span>
                    <h3 className="text-[var(--pepe-white)] font-bold uppercase tracking-wide text-sm">
                      Öffnungszeiten
                    </h3>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-[var(--pepe-t80)]">Freitag – Sonntag</span>
                    <span className="text-[var(--pepe-white)] font-bold tabular-nums text-lg">
                      14:00 – 19:00 Uhr
                    </span>
                  </div>
                </div>

                <p className="text-[var(--pepe-t64)] text-sm">
                  Ostpark, Albert-Schweitzer-Straße · U-Bahn Quiddestraße
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Vision & Mission Section ===== */}
      <section className="py-20 md:py-32 bg-[var(--pepe-black)]">
        <div className="stage-container">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {/* Vision */}
              <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-10 shadow-xl">
                <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-gold)] mb-6">
                  Vision
                </h2>
                <p className="text-[var(--pepe-t80)] leading-relaxed text-lg">
                  Der Pepe Dome wird ein langfristiger, lebendiger Ort für zeitgenössischen Zirkus, kulturelle Begegnung, künstlerische Ausbildung, Community-Programme und öffentlich zugängliche Events.
                </p>
              </div>

              {/* Mission */}
              <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-10 shadow-xl">
                <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-gold)] mb-6">
                  Mission
                </h2>
                <p className="text-[var(--pepe-t80)] leading-relaxed text-lg">
                  Förderung von zeitgenössischer Zirkuskunst und kultureller Teilhabe in München, verbunden mit inklusiven Bildungs- und Trainingsangeboten. Kulturfokus Ostpark.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Video Carousel Section ===== */}
      <section className="py-8 md:py-16 bg-[var(--pepe-black)]">
        <div className="stage-container mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] text-center mb-4">
            Erlebe den Dome live.
          </h2>
          <p className="text-[var(--pepe-t64)] text-lg text-center max-w-2xl mx-auto">
            Zeitgenossischer Zirkus auf hochstem Niveau
          </p>
        </div>
        <VideoCarousel />
      </section>

      {/* ===== Task 3.1.2: Featured Events Section ===== */}
      <section className="py-20 md:py-32 bg-[var(--pepe-black)]">
        <div className="stage-container">
          {/* Section Header */}
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-4">
              Kommende Events
            </h2>
            <p className="text-[var(--pepe-t64)] text-lg mb-6">
              Entdecke unsere nachsten Shows, Workshops und Festivals
            </p>
            <Link href="/events">
              <Button variant="ghost" size="sm">
                Alle Events anzeigen
              </Button>
            </Link>
          </div>

          {/* Events Grid */}
          {displayEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-3xl mx-auto">
              {displayEvents.map((event) => (
                <EventCard
                  key={event.id}
                  title={event.title}
                  description={event.description}
                  date={new Date(event.date).toLocaleDateString('de-DE', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                  category={event.category}
                  image={event.imageUrl || undefined}
                  href={`/events/${event.slug}`}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-[var(--pepe-ink)] rounded-xl border border-[var(--pepe-line)]">
              <p className="text-[var(--pepe-t64)]">Keine Events verfugbar</p>
              <Link href="/events" className="text-[var(--pepe-gold)] hover:underline mt-2 inline-block">
                Alle Events anzeigen
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ===== Task 3.1.3: Latest News Section ===== */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-[var(--pepe-black)] via-[var(--pepe-ink)]/30 to-[var(--pepe-black)]">
        <div className="stage-container">
          {/* Section Header – zentriert */}
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-4">
              Aktuelles & Highlights
            </h2>
            <p className="text-[var(--pepe-t64)] text-lg mb-6">
              News, Backstage Stories und mehr
            </p>
            <Link href="/news">
              <Button variant="ghost" size="sm">
                Alle News anzeigen
              </Button>
            </Link>
          </div>

          {/* Nur der aktuellste Artikel */}
          {displayNews.length > 0 ? (
            <div className="mx-auto max-w-2xl">
              <div className="grid grid-cols-1 gap-5">
                {displayNews.map((article) => (
                  <NewsCard
                    key={article.id}
                    title={article.title}
                    excerpt={article.excerpt}
                    date={new Date(article.publishedAt).toLocaleDateString('de-DE', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                    author={article.author}
                    category={article.category}
                    image={article.imageUrl || undefined}
                    href={`/news/${article.slug}`}
                    featured={false}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-[var(--pepe-ink)] rounded-xl border border-[var(--pepe-line)] max-w-2xl mx-auto">
              <p className="text-[var(--pepe-t64)]">Keine News verfugbar</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 md:py-32 bg-[var(--pepe-black)]">
        <div className="stage-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-6">
              Was dich erwartet
            </h2>
            <p className="text-lg text-[var(--pepe-t64)] max-w-2xl mx-auto leading-relaxed">
              Entdecke die Vielfalt des Pepe Dome
            </p>
          </div>

          {/* Mobile: 1 Spalte. Tablet + Desktop: 2×2 Grid (siehe .features-grid in components.css) */}
          <div className="features-grid">
            {homepage.features.map((feature, index) => {
              const featureImages: Record<string, string> = {
                'show': '/images/shows/carmen-jonas-duo.jpg',
                'training': '/images/Kategorien/Training.webp',
                'dome': '/images/Kategorien/Location.webp',
                'community': '/images/Kategorien/Community.webp'
              };
              
              return (
                <div
                  key={index}
                  className="group min-w-0 bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl overflow-hidden hover:border-[var(--pepe-gold)] transition-all duration-500 ease-out shadow-lg hover:shadow-[0_20px_40px_rgba(0,0,0,0.4),0_0_15px_var(--pepe-gold-glow)]"
                >
                  {/* Feature Image – 16:9 Landscape */}
                  <div className="relative aspect-video w-full overflow-hidden">
                    <Image
                      src={featureImages[feature.icon] || '/TheDome.png'}
                      alt={feature.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      loading="lazy"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--pepe-ink)] to-transparent" />
                    
                    {/* Icon Overlay */}
                    <div className="absolute bottom-4 left-4 w-12 h-12 rounded-xl bg-[var(--pepe-gold)]/20 backdrop-blur-md flex items-center justify-center border border-[var(--pepe-gold)]/30">
                      <span className="text-[var(--pepe-gold)] text-2xl leading-none">
                        {feature.icon === 'show' && '🎭'}
                        {feature.icon === 'training' && '💪'}
                        {feature.icon === 'dome' && '🏛️'}
                        {feature.icon === 'community' && '🤝'}
                      </span>
                    </div>
                  </div>

                  <div className="p-8 text-center lg:text-left">
                    <h3 className="text-xl font-bold text-[var(--pepe-white)] mb-4 group-hover:text-[var(--pepe-gold)] transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-[var(--pepe-t64)] leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== Task 3.1.4: Newsletter CTA Section ===== */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-[var(--pepe-black)] to-[var(--pepe-ink)]">
        <div className="stage-container">
          <div className="max-w-2xl mx-auto text-center">
            {/* Decorative Icon */}
            <div className="w-16 h-16 mx-auto mb-10 rounded-full bg-[var(--pepe-gold)]/10 flex items-center justify-center">
              <span className="text-[var(--pepe-gold)] text-3xl leading-none">&#9993;</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-6">
              Bleib auf dem Laufenden
            </h2>
            <p className="text-[var(--pepe-t80)] text-lg mb-10">
              Erhalte monatlich Updates zu Events, Shows und Workshops direkt in dein Postfach.
            </p>

            {/* Signup Form */}
            <div className="max-w-md mx-auto">
              <SignupForm variant="simple" />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
