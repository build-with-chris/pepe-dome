/**
 * News Listing Page — localized (DE / EN)
 *
 * UI-Chrome lokalisiert, Artikel-Daten kommen weiterhin aus der DB
 * (zur Zeit nur Deutsch). Kategoriefilter gibt es hier nicht
 * (matching das bestehende Verhalten).
 */

import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllArticles, getFeaturedArticles } from '@/lib/db-data'
import NewsCard from '@/components/custom/NewsCard'
import HeroSection from '@/components/custom/HeroSection'
import { isLocale, localizedHref, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/get-dictionary'
import { pageMetadata } from '@/lib/seo'
import { ItemListJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang: rawLang } = await params
  if (!isLocale(rawLang)) return {}
  const dict = await getDictionary(rawLang)
  return pageMetadata({
    lang: rawLang,
    path: '/news',
    title: dict.news.meta.title,
    description: dict.news.meta.description,
  })
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
  const newsHref = localizedHref(lang, '/news')

  const featuredArticle = featuredArticles[0] || allArticles[0]
  const remainingArticles = allArticles.filter((a) => a.id !== featuredArticle?.id)

  return (
    <div className="min-h-screen bg-[var(--pepe-black)]">
      <BreadcrumbJsonLd
        items={[
          { name: 'Pepe Dome', url: `/${lang}` },
          { name: t.meta.title, url: `/${lang}/news` },
        ]}
      />
      <ItemListJsonLd
        name={t.meta.title}
        items={allArticles.map((article) => ({
          name: article.title,
          url: `/${lang}/news/${article.slug}`,
        }))}
      />
      <HeroSection
        title={t.hero.title}
        subtitle={t.hero.subtitle}
        size="sm"
        dotCloudIcon="news"
      />

      <div className="stage-container py-20 md:py-32">
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

        {/* Kein Artikel da: nicht mit einer leeren Seite enden, sondern
            weiterschicken. Vorher stand hier nur der Hero und eine Reihe
            Filterknöpfe, die nichts taten. */}
        {!featuredArticle && remainingArticles.length === 0 && (
          <div className="mx-auto max-w-[36rem] text-center">
            <h2 className="text-2xl font-bold text-[var(--pepe-white)] mb-3">{t.empty.title}</h2>
            <p className="text-[var(--pepe-t64)] mb-8">{t.empty.text}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href={localizedHref(lang, '/events')} className="btn btn-primary btn-md">
                {t.empty.eventsCta}
              </Link>
              <Link href={localizedHref(lang, '/galerie')} className="btn btn-secondary btn-md">
                {t.empty.galleryCta}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
