/**
 * Phase 3 Task 3.3.2 & 3.3.3: Article Detail Page Rebuild
 *
 * Features:
 * - Task 3.3.2: Rebuild article detail page (hero image, title, author, date, rich content)
 * - Task 3.3.3: Add related content (related events, read more suggestions)
 */

import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getAllArticles, getArticleBySlug, getRecentArticles } from '@/lib/db-data'
import { getUpcomingEvents } from '@/lib/db-data'
import { Button } from '@/components/ui/Button'
import EventCard from '@/components/custom/EventCard'
import SignupForm from '@/components/custom/SignupForm'
import ShareButtons from '@/components/custom/ShareButtons'

// Reading time calculation
function getReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

export async function generateStaticParams() {
  const articles = await getAllArticles()
  return articles.map((article) => ({
    slug: article.slug,
  }))
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  // Fetch related content (Task 3.3.3)
  const [upcomingEvents, recentArticles] = await Promise.all([
    getUpcomingEvents(),
    getRecentArticles(4),
  ])

  // Get "Read More" suggestions (exclude current article)
  const relatedArticles = recentArticles
    .filter(a => a.id !== article.id)
    .slice(0, 3)

  // Get related events (limit to 3)
  const relatedEvents = upcomingEvents.slice(0, 3)

  const readingTime = getReadingTime(article.content)

  // Format date
  const formattedDate = new Date(article.publishedAt).toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  return (
    <div className="min-h-screen bg-[var(--pepe-black)]">
      {/* Hero Image Section */}
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

        {/* Breadcrumbs */}
        <nav className="absolute top-8 left-0 right-0 z-10">
          <div className="stage-container">
            <div className="flex items-center gap-2 text-sm text-[var(--pepe-t64)]">
              <Link href="/" className="hover:text-[var(--pepe-white)] transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/news" className="hover:text-[var(--pepe-white)] transition-colors">
                News
              </Link>
              <span>/</span>
              <span className="text-[var(--pepe-white)] truncate max-w-[200px]">{article.title}</span>
            </div>
          </div>
        </nav>
      </section>

      {/* Main Content */}
      <div className="stage-container py-16 md:py-20">
        <div className="grid lg:grid-cols-[1fr_300px] gap-12 lg:gap-16">
          {/* Left Column - Article Content */}
          <article>
            {/* Header */}
            <header className="mb-8">
              {/* Category and Reading Time */}
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-[var(--pepe-gold)]/20 text-[var(--pepe-gold)] border border-[var(--pepe-gold)]/40">
                  {article.category}
                </span>
                <span className="text-sm text-[var(--pepe-t64)]">
                  {readingTime} Min. Lesezeit
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--pepe-white)] mb-4 leading-tight">
                {article.title}
              </h1>

              {/* Excerpt */}
              <p className="text-xl text-[var(--pepe-t80)] mb-6 leading-relaxed">
                {article.excerpt}
              </p>

              {/* Author and Date */}
              <div className="flex items-center gap-6 text-sm text-[var(--pepe-t64)] border-b border-[var(--pepe-line)] pb-6">
                <div>
                  <span className="text-[var(--pepe-t48)]">Von </span>
                  <span className="text-[var(--pepe-white)] font-medium">{article.author}</span>
                </div>
                <div>{formattedDate}</div>
              </div>
            </header>

            {/* Article Content (Markdown rendered as paragraphs) */}
            <div className="prose prose-invert prose-lg max-w-none mb-8">
              {article.content.split('\n\n').map((paragraph, index) => {
                // Check if paragraph is a heading
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
                // Regular paragraph
                return (
                  <p key={index} className="text-lg text-[var(--pepe-t80)] mb-6 leading-relaxed">
                    {paragraph}
                  </p>
                )
              })}
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-[var(--pepe-line)]">
                <div className="flex flex-wrap gap-2">
                  {article.tags.map(tag => (
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

            {/* Newsletter Signup */}
            <div className="mt-12 pt-8 border-t border-[var(--pepe-line)]">
              <div className="max-w-xl">
                <h3 className="text-xl font-bold text-[var(--pepe-white)] mb-4">
                  Bleib informiert
                </h3>
                <p className="text-[var(--pepe-t64)] mb-4">
                  Erhalte die neuesten News, Backstage Stories und Event-Updates.
                </p>
                <SignupForm variant="simple" />
              </div>
            </div>
          </article>

          {/* Right Column - Sidebar */}
          <aside className="space-y-8">
            {/* Related Articles (Task 3.3.3 - Read More) */}
            {relatedArticles.length > 0 && (
              <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-xl p-6">
                <h3 className="text-lg font-bold text-[var(--pepe-white)] mb-6">
                  Weitere Artikel
                </h3>
                <div className="space-y-4">
                  {relatedArticles.map(a => (
                    <Link key={a.id} href={`/news/${a.slug}`} className="group block">
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
                            {new Date(a.publishedAt).toLocaleDateString('de-DE', {
                              day: 'numeric',
                              month: 'short'
                            })}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link href="/news" className="block mt-6">
                  <Button variant="secondary" size="sm" className="w-full">
                    Alle News anzeigen
                  </Button>
                </Link>
              </div>
            )}

            {/* Share Buttons */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-xl p-6">
              <h3 className="text-lg font-bold text-[var(--pepe-white)] mb-4">
                Teilen
              </h3>
              <ShareButtons title={article.title} />
            </div>
          </aside>
        </div>

        {/* Task 3.3.3: Related Events Section */}
        {relatedEvents.length > 0 && (
          <section className="mt-16 pt-12 border-t border-[var(--pepe-line)]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-[var(--pepe-white)]">
                Kommende Events
              </h2>
              <Link href="/events">
                <Button variant="ghost" size="sm">
                  Alle Events
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedEvents.map(event => (
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
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
