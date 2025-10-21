import Link from 'next/link'
import Image from 'next/image'
import { getFeaturedNews, getRecentNews, getUpcomingEvents, getFeaturedEvents, getHomepageContent } from '@/lib/data'
import NewsTeaser from '@/components/news/NewsTeaser'
import EventCard from '@/components/events/EventCard'
import NewsletterSignup from '@/components/newsletter/NewsletterSignup'
import Button from '@/components/ui/Button'

export default function HomePage() {
  const homepage = getHomepageContent()
  const featuredNews = getFeaturedNews().slice(0, 1)[0]
  const recentNews = getRecentNews(5).slice(1, 4)
  const featuredEvents = getFeaturedEvents().slice(0, 2)
  const upcomingEvents = getUpcomingEvents().slice(0, 6)

  return (
    <>
      {/* Hero Section */}
      <section className="section-hero relative overflow-hidden">
        {/* Background dome image */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <Image
            src="/TheDome.png"
            alt="Pepe Dome"
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-pepe-black via-transparent to-pepe-black" />
        </div>

        <div className="stage-container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="display-1 mb-6">
              {homepage.hero.title}
            </h1>
            <p className="lead text-pepe-gold mb-4">
              {homepage.hero.subtitle}
            </p>
            <p className="body-lg text-pepe-t80 mb-8 max-w-2xl mx-auto">
              {homepage.hero.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/events">
                <Button variant="primary" size="lg">
                  {homepage.hero.cta.primary}
                </Button>
              </Link>
              <Link href="/newsletter">
                <Button variant="secondary" size="lg">
                  {homepage.hero.cta.secondary}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured News & Events Bento Grid */}
      <section className="section">
        <div className="stage-container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="h2">Aktuelles & Highlights</h2>
            <Link href="/news" className="text-pepe-gold hover:text-pepe-gold-hover transition-colors">
              Alle News →
            </Link>
          </div>

          <div className="bento-grid-2 mb-12">
            {/* Featured News - Large */}
            {featuredNews && (
              <div className="bento-item-wide">
                <NewsTeaser article={featuredNews} featured />
              </div>
            )}

            {/* Recent News - Grid */}
            {recentNews.map(article => (
              <NewsTeaser key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="section bg-gradient-to-b from-transparent via-pepe-ink/30 to-transparent">
        <div className="stage-container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="h2">Kommende Events</h2>
              <p className="text-pepe-t64">Entdecke unsere nächsten Shows, Workshops und Festivals</p>
            </div>
            <Link href="/events" className="text-pepe-gold hover:text-pepe-gold-hover transition-colors">
              Alle Events →
            </Link>
          </div>

          <div className="bento-grid">
            {upcomingEvents.map(event => (
              <EventCard
                key={event.id}
                event={event}
                variant={event.featured ? 'featured' : 'default'}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="section">
        <div className="stage-container">
          <h2 className="h2 text-center mb-12">Was dich erwartet</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {homepage.features.map((feature, index) => (
              <div key={index} className="card p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-pepe-gold/10 flex items-center justify-center text-3xl">
                  {/* Placeholder - will be replaced with DotIcon */}
                  <span className="text-pepe-gold">★</span>
                </div>
                <h3 className="h4 mb-3">{feature.title}</h3>
                <p className="text-pepe-t64 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="section">
        <div className="stage-container">
          <div className="card-glass p-12 text-center max-w-2xl mx-auto">
            <h2 className="h2 mb-4">Bleib auf dem Laufenden</h2>
            <p className="body-lg text-pepe-t64 mb-8">
              Erhalte monatlich News zu Events, Shows und Workshops direkt in dein Postfach.
            </p>
            <NewsletterSignup />
          </div>
        </div>
      </section>
    </>
  )
}
