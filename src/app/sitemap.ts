import { MetadataRoute } from 'next'
import { getAllEvents, getAllArticles } from '@/lib/db-data'

const BASE_URL = 'https://www.pepe-dome.de'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/events`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/news`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/business`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/training`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/newsletter`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/datenschutz`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/impressum`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/agb`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]

  // Dynamic event pages
  let eventPages: MetadataRoute.Sitemap = []
  try {
    const events = await getAllEvents()
    eventPages = events.map((event) => ({
      url: `${BASE_URL}/events/${event.slug}`,
      lastModified: new Date(event.date),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch {
    console.error('Sitemap: Failed to fetch events')
  }

  // Dynamic news pages
  let newsPages: MetadataRoute.Sitemap = []
  try {
    const articles = await getAllArticles()
    newsPages = articles.map((article) => ({
      url: `${BASE_URL}/news/${article.slug}`,
      lastModified: new Date(article.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  } catch {
    console.error('Sitemap: Failed to fetch articles')
  }

  return [...staticPages, ...eventPages, ...newsPages]
}
