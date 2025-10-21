import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllNewsletters, getNewsletterById, getEventById, getNewsBySlug } from '@/lib/data'
import EventCard from '@/components/events/EventCard'
import NewsTeaser from '@/components/news/NewsTeaser'

export async function generateStaticParams() {
  const newsletters = getAllNewsletters()
  return newsletters.map((newsletter) => ({
    id: newsletter.id,
  }))
}

export default async function NewsletterDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const newsletter = getNewsletterById(id)

  if (!newsletter) {
    notFound()
  }

  const events = newsletter.events.map(id => getEventById(id)).filter(Boolean)
  const newsHighlights = newsletter.newsHighlights.map(slug => getNewsBySlug(slug)).filter(Boolean)

  return (
    <div className="section">
      <div className="stage-container max-w-4xl">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-pepe-t64 mb-8">
          <Link href="/" className="hover:text-pepe-white transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/newsletter" className="hover:text-pepe-white transition-colors">
            Newsletter
          </Link>
          <span>/</span>
          <span className="text-pepe-white">{newsletter.title}</span>
        </nav>

        {/* Header */}
        <header className="mb-12 text-center">
          <span className="badge bg-pepe-gold/20 text-pepe-gold border-pepe-gold/40 mb-4">
            Newsletter
          </span>
          <h1 className="display-1 mb-4">{newsletter.title}</h1>
          <p className="lead text-pepe-t80">
            {newsletter.subject}
          </p>
          <p className="text-sm text-pepe-t64 mt-4">
            Veröffentlicht am {new Date(newsletter.publishedAt).toLocaleDateString('de-DE')}
            {newsletter.sentAt && ` • Versendet an ${newsletter.sentCount} Empfänger`}
          </p>
        </header>

        {/* Intro */}
        <div className="card p-8 mb-12">
          <p className="body-lg text-pepe-t80">
            {newsletter.intro}
          </p>
        </div>

        {/* Featured Event */}
        {newsletter.featured && (
          <div className="mb-12">
            <h2 className="h2 mb-6">Highlight des Monats</h2>
            <div className="card p-6 bg-gradient-to-br from-pepe-gold/10 to-pepe-bronze/5 border-pepe-gold/20">
              <h3 className="h3 mb-3">{newsletter.featured.title}</h3>
              <p className="body-lg text-pepe-t80 mb-6">
                {newsletter.featured.description}
              </p>
              {newsletter.featured.eventId && (
                <Link
                  href={`/events/${newsletter.featured.eventId}`}
                  className="btn btn-primary"
                >
                  Mehr erfahren
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Events */}
        {events.length > 0 && (
          <div className="mb-12">
            <h2 className="h2 mb-6">Events in diesem Monat</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {events.map(event => event && (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        )}

        {/* News Highlights */}
        {newsHighlights.length > 0 && (
          <div className="mb-12">
            <h2 className="h2 mb-6">News & Ankündigungen</h2>
            <div className="space-y-4">
              {newsHighlights.map(article => article && (
                <NewsTeaser key={article.id} article={article} variant="compact" />
              ))}
            </div>
          </div>
        )}

        {/* Outro */}
        <div className="card p-8 text-center">
          <p className="body-lg text-pepe-t80">
            {newsletter.outro}
          </p>
        </div>

        {/* Back to Archive */}
        <div className="text-center mt-12">
          <Link href="/newsletter" className="btn btn-secondary">
            ← Zurück zum Archiv
          </Link>
        </div>
      </div>
    </div>
  )
}
