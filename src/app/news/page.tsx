/**
 * Phase 3 Task 3.3.1: News Listing Page Rebuild
 *
 * Features:
 * - Featured article (large)
 * - Grid of article cards
 * - Category filter
 */

import Link from 'next/link'
import { getCategories } from '@/lib/data'
import { getAllArticles, getFeaturedArticles } from '@/lib/db-data'
import NewsCard from '@/components/custom/NewsCard'
import HeroSection from '@/components/custom/HeroSection'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function NewsPage() {
  const [allArticles, featuredArticles] = await Promise.all([
    getAllArticles(),
    getFeaturedArticles(),
  ])
  const categories = getCategories().news

  // Get the featured article (first featured, or first article)
  const featuredArticle = featuredArticles[0] || allArticles[0]

  // Get remaining articles (exclude featured)
  const remainingArticles = allArticles.filter(a => a.id !== featuredArticle?.id)

  return (
    <div className="min-h-screen bg-[var(--pepe-black)]">
      {/* Hero Section */}
      <HeroSection
        title="News & Magazin"
        subtitle="Aktuelles aus dem Pepe Dome - Shows, Events, Hintergründe und mehr"
        size="sm"
        dotCloudIcon="news"
      />

      <div className="stage-container py-20 md:py-32">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-16">
          <button
            className={cn(
              'px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ease-out',
              'border backdrop-blur-sm',
              'bg-[var(--pepe-gold)] text-white border-[var(--pepe-gold)] shadow-[0_0_16px_var(--pepe-gold-glow),0_4px_12px_rgba(0,0,0,0.3)]'
            )}
          >
            Alle
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              className={cn(
                'px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ease-out',
                'border backdrop-blur-sm',
                'bg-[var(--pepe-ink)]/80 text-[var(--pepe-t80)] border-[var(--pepe-line)]',
                'hover:border-[var(--pepe-gold)]/60 hover:text-[var(--pepe-gold)] hover:shadow-[0_0_12px_var(--pepe-gold-glow)] hover:bg-[var(--pepe-gold)]/5'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Featured Article (Large) */}
        {featuredArticle && (
          <div className="mb-16">
            <NewsCard
              title={featuredArticle.title}
              excerpt={featuredArticle.excerpt}
              date={new Date(featuredArticle.publishedAt).toLocaleDateString('de-DE', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
              author={featuredArticle.author}
              category={featuredArticle.category}
              image={featuredArticle.imageUrl || undefined}
              href={`/news/${featuredArticle.slug}`}
              featured
            />
          </div>
        )}

        {/* Articles Grid */}
        {remainingArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {remainingArticles.map(article => (
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
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[var(--pepe-ink)] rounded-2xl border border-[var(--pepe-line)]">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--pepe-gold)]/10 flex items-center justify-center">
              <span className="text-[var(--pepe-gold)] text-4xl">&#128240;</span>
            </div>
            <h3 className="text-xl font-bold text-[var(--pepe-white)] mb-3">
              Noch keine Artikel
            </h3>
            <p className="text-[var(--pepe-t64)] text-lg max-w-md mx-auto">
              Hier erscheinen bald spannende News und Geschichten aus dem Pepe Dome.
            </p>
          </div>
        )}

        {/* Load More (placeholder for future pagination) */}
        {remainingArticles.length >= 9 && (
          <div className="text-center mt-12">
            <Button variant="secondary" size="lg" disabled>
              Weitere Artikel laden
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
