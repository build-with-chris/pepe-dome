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

        <div className="stage-container relative z-10 py-24">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo */}
            <div className="mb-8 flex justify-center">
              <Image
                src="/PEPE_logos_dome.svg"
                alt="PEPE Dome Logo"
                width={280}
                height={80}
                className="h-16 md:h-20 w-auto"
                priority
              />
            </div>

            {/* Main Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--pepe-white)] mb-4 leading-tight">
              {homepage.hero.title}
            </h1>

            {/* Subtitle / Tagline */}
            <p className="text-xl md:text-2xl text-[var(--pepe-gold)] font-medium mb-4">
              {homepage.hero.subtitle}
            </p>

            {/* Description */}
            <p className="text-lg text-[var(--pepe-t80)] mb-8 max-w-2xl mx-auto leading-relaxed">
              {homepage.hero.description}
            </p>

            {/* Decorative Gold Line */}
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[var(--pepe-gold)] to-transparent rounded-full mx-auto mb-8" />

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/events">
                <Button variant="primary" size="lg" className="min-w-[200px]">
                  {homepage.hero.cta.primary}
                </Button>
              </Link>
              <Link href="/newsletter">
                <Button variant="secondary" size="lg" className="min-w-[200px]">
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
      <section className="py-20 md:py-28 bg-[var(--pepe-black)]">
        <div className="stage-container">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-3">
                Kommende Events
              </h2>
              <p className="text-[var(--pepe-t64)]">
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
      <section className="py-20 md:py-28 bg-gradient-to-b from-[var(--pepe-black)] via-[var(--pepe-ink)]/30 to-[var(--pepe-black)]">
        <div className="stage-container">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-3">
                Aktuelles & Highlights
              </h2>
              <p className="text-[var(--pepe-t64)]">
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
      <section className="py-20 md:py-28 bg-[var(--pepe-black)]">
        <div className="stage-container">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] text-center mb-14">
            Was dich erwartet
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {homepage.features.map((feature, index) => (
              <div
                key={index}
                className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-xl p-8 text-center hover:border-[var(--pepe-gold)] transition-colors duration-300"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--pepe-gold)]/10 flex items-center justify-center">
                  <span className="text-[var(--pepe-gold)] text-3xl">
                    {feature.icon === 'show' && '🎭'}
                    {feature.icon === 'training' && '💪'}
                    {feature.icon === 'dome' && '🏛️'}
                    {feature.icon === 'community' && '🤝'}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[var(--pepe-white)] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[var(--pepe-t64)] text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Task 3.1.4: Newsletter CTA Section ===== */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-[var(--pepe-black)] to-[var(--pepe-ink)]">
        <div className="stage-container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-4">
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
