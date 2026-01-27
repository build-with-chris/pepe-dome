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
import { getFeaturedArticles, getRecentArticles, getUpcomingEvents, getFeaturedEvents } from '@/lib/db-data'
import EventCard from '@/components/custom/EventCard'
import NewsCard from '@/components/custom/NewsCard'
import SignupForm from '@/components/custom/SignupForm'
import { Button } from '@/components/ui/Button'
import HomeDotCloud from '@/components/custom/HomeDotCloud'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const homepage = getHomepageContent()
  const [featuredArticles, recentArticles, upcomingEvents, featuredEvents] = await Promise.all([
    getFeaturedArticles(),
    getRecentArticles(4),
    getUpcomingEvents(),
    getFeaturedEvents(),
  ])

  // Get 3 events for the featured section (prefer featured, then upcoming)
  const displayEvents = featuredEvents.length > 0
    ? featuredEvents.slice(0, 3)
    : upcomingEvents.slice(0, 3)

  // Get 3 news articles
  const displayNews = featuredArticles.length > 0
    ? [...featuredArticles, ...recentArticles.filter(a => !featuredArticles.find(f => f.id === a.id))].slice(0, 3)
    : recentArticles.slice(0, 3)

  return (
    <>
      {/* ===== Task 3.1.1: Hero Section ===== */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[var(--pepe-black)] -mt-20 pt-20">
        {/* Background Image */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="/TheDome.png"
            alt="Pepe Dome"
            fill
            className="object-cover object-center opacity-25"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--pepe-black)]/60 via-transparent to-[var(--pepe-black)]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--pepe-black)]/40 via-transparent to-[var(--pepe-black)]/40" />
        </div>

        {/* DotCloud Icon Layer */}
        <HomeDotCloud />

        <div className="stage-container relative z-10 py-24">
          <div className="max-w-4xl mx-auto text-center">
            {/* Main Title */}
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-[var(--pepe-white)] mb-6 leading-tight">
              {homepage.hero.title}
            </h1>

            {/* Subtitle / Tagline */}
            <p className="text-xl md:text-3xl text-[var(--pepe-gold)] font-medium mb-8">
              {homepage.hero.subtitle}
            </p>

            {/* Description */}
            <p className="text-lg md:text-xl text-[var(--pepe-t80)] mb-12 max-w-2xl mx-auto leading-relaxed">
              {homepage.hero.description}
            </p>

            {/* Decorative Gold Line */}
            <div className="w-32 h-1.5 bg-gradient-to-r from-transparent via-[var(--pepe-gold)] to-transparent rounded-full mx-auto mb-12 shadow-[0_0_15px_var(--pepe-gold-glow)]" />

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/events">
                <Button variant="primary" size="xl" className="min-w-[220px]">
                  {homepage.hero.cta.primary}
                </Button>
              </Link>
              <Link href="/newsletter">
                <Button variant="secondary" size="xl" className="min-w-[220px]">
                  {homepage.hero.cta.secondary}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--pepe-black)] to-transparent" />
      </section>

      {/* ===== Task 3.1.2: Featured Events Section ===== */}
      <section className="py-20 md:py-32 bg-[var(--pepe-black)]">
        <div className="stage-container">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-4">
                Kommende Events
              </h2>
              <p className="text-[var(--pepe-t64)] text-lg">
                Entdecke unsere nachsten Shows, Workshops und Festivals
              </p>
            </div>
            <Link href="/events">
              <Button variant="ghost" size="sm">
                Alle Events anzeigen
              </Button>
            </Link>
          </div>

          {/* Events Grid - 3 columns */}
          {displayEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayEvents.map((event, index) => (
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
                  href={`/events/${event.id}`}
                  featured={index === 0 && displayEvents.length === 3}
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
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-4">
                Aktuelles & Highlights
              </h2>
              <p className="text-[var(--pepe-t64)] text-lg">
                News, Backstage Stories und mehr
              </p>
            </div>
            <Link href="/news">
              <Button variant="ghost" size="sm">
                Alle News anzeigen
              </Button>
            </Link>
          </div>

          {/* News Grid - 3 columns */}
          {displayNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayNews.map((article, index) => (
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
                  featured={index === 0 && displayNews.length === 3}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-[var(--pepe-ink)] rounded-xl border border-[var(--pepe-line)]">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {homepage.features.map((feature, index) => {
              const featureImages: Record<string, string> = {
                'show': '/Entertainment.webp',
                'training': '/CircusSchool.webp',
                'dome': '/GeodomeEvening.webp',
                'community': '/Circus&Cinema.webp'
              };
              
              return (
                <div
                  key={index}
                  className="group bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl overflow-hidden hover:border-[var(--pepe-gold)] transition-all duration-500 ease-out shadow-lg hover:shadow-[0_20px_40px_rgba(0,0,0,0.4),0_0_15px_var(--pepe-gold-glow)]"
                >
                  {/* Feature Image */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={featureImages[feature.icon] || '/TheDome.png'}
                      alt={feature.title}
                      fill
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
