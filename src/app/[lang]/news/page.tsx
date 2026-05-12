/**
 * News Listing Page — localized (DE / EN)
 *
 * UI-Chrome lokalisiert, Artikel-Daten kommen weiterhin aus der DB
 * (zur Zeit nur Deutsch). Filter-Buttons ohne aktive State-Logic
 * (matching das bestehende Verhalten).
 */

import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCategories } from '@/lib/data'
import { getAllArticles, getFeaturedArticles } from '@/lib/db-data'
import NewsCard from '@/components/custom/NewsCard'
import HeroSection from '@/components/custom/HeroSection'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { isLocale, localizedHref, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/get-dictionary'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang: rawLang } = await params
  if (!isLocale(rawLang)) return {}
  const dict = await getDictionary(rawLang)
  return {
    title: dict.news.meta.title,
    description: dict.news.meta.description,
    alternates: { canonical: `https://www.pepe-dome.de/${rawLang}/news` },
  }
}

export const dynamic = 'force-dynamic'

export default async function NewsPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang: rawLang } = await params
  if (!isLocale(rawLang)) notFound()
  const lang: Locale = rawLang
  const dict = await getDictionary(lang)
  const t = dict.news
  const dateLocale = lang === 'en' ? 'en-US' : 'de-DE'

  const [allArticles, featuredArticles] = await Promise.all([
    getAllArticles(lang),
    getFeaturedArticles(lang),
  ])
  const categories = getCategories().news
  const newsHref = localizedHref(lang, '/news')

  const featuredArticle = featuredArticles[0] || allArticles[0]
  const remainingArticles = allArticles.filter((a) => a.id !== featuredArticle?.id)

  return (
    <div className="min-h-screen bg-[var(--pepe-black)]">
      <HeroSection
        title={t.hero.title}
        subtitle={t.hero.subtitle}
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
            {t.filter.all}
          </button>
          {categories.map((cat) => (
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

        {featuredArticle && (
          <div className="mb-16">
            <NewsCard
              title={featuredArticle.title}
              excerpt={featuredArticle.excerpt}
              date={new Date(featuredArticle.publishedAt).toLocaleDateString(dateLocale, {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
              author={featuredArticle.author}
              category={featuredArticle.category}
              image={featuredArticle.imageUrl || undefined}
              href={`${newsHref}/${featuredArticle.slug}`}
              featured
            />
          </div>
        )}

        {remainingArticles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {remainingArticles.map((article) => (
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
                href={`${newsHref}/${article.slug}`}
              />
            ))}
          </div>
        )}

        {remainingArticles.length >= 9 && (
          <div className="text-center mt-12">
            <Button variant="secondary" size="lg" disabled>
              {t.loadMore}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
