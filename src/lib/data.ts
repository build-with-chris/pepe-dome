// Data utilities for JSON-based content
// Will be replaced with Supabase queries in Phase 4

import newsData from '@/data/news.json'
import eventsData from '@/data/events.json'
import contentData from '@/data/content.json'
import newsletterData from '@/data/newsletter.json'

export type NewsArticle = {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  author: string
  publishedAt: string
  imageUrl: string
  tags: string[]
  featured: boolean
}

export type Event = {
  id: string
  title: string
  subtitle: string
  description: string
  date: string
  endDate?: string
  time: string
  location: string
  category: string
  ticketUrl: string | null
  price: string
  imageUrl: string
  featured: boolean
  highlights: string[]
}

export type Newsletter = {
  id: string
  month: number
  year: number
  title: string
  subject: string
  publishedAt: string
  sentAt: string
  sentCount: number
  intro: string
  featured: {
    title: string
    description: string
    eventId: string
    imageUrl: string
  }
  events: string[]
  newsHighlights: string[]
  outro: string
  openRate: number
  clickRate: number
}

// NEWS FUNCTIONS

export function getAllNews(): NewsArticle[] {
  return newsData as NewsArticle[]
}

export function getFeaturedNews(): NewsArticle[] {
  return newsData.filter(article => article.featured) as NewsArticle[]
}

export function getNewsBySlug(slug: string): NewsArticle | null {
  return (newsData.find(article => article.slug === slug) as NewsArticle) || null
}

export function getNewsByCategory(category: string): NewsArticle[] {
  return newsData.filter(article => article.category === category) as NewsArticle[]
}

export function getRecentNews(limit: number = 5): NewsArticle[] {
  return newsData
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit) as NewsArticle[]
}

// EVENT FUNCTIONS

export function getAllEvents(): Event[] {
  return eventsData as Event[]
}

export function getUpcomingEvents(): Event[] {
  const now = new Date()
  return eventsData
    .filter(event => new Date(event.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) as Event[]
}

export function getFeaturedEvents(): Event[] {
  return eventsData.filter(event => event.featured) as Event[]
}

export function getEventById(id: string): Event | null {
  return (eventsData.find(event => event.id === id) as Event) || null
}

export function getEventsByCategory(category: string): Event[] {
  return eventsData.filter(event => event.category === category) as Event[]
}

export function getEventsByMonth(year: number, month: number): Event[] {
  return eventsData.filter(event => {
    const eventDate = new Date(event.date)
    return eventDate.getFullYear() === year && eventDate.getMonth() + 1 === month
  }) as Event[]
}

export function getNextEvent(): Event | null {
  const upcoming = getUpcomingEvents()
  return upcoming.length > 0 ? upcoming[0] : null
}

// NEWSLETTER FUNCTIONS

export function getAllNewsletters(): Newsletter[] {
  return newsletterData
    .sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year
      return b.month - a.month
    }) as Newsletter[]
}

export function getNewsletterById(id: string): Newsletter | null {
  return (newsletterData.find(newsletter => newsletter.id === id) as Newsletter) || null
}

export function getLatestNewsletter(): Newsletter | null {
  const sorted = getAllNewsletters()
  return sorted.length > 0 ? sorted[0] : null
}

// CONTENT FUNCTIONS

export function getSiteContent() {
  return contentData.site
}

export function getNavigation() {
  return contentData.navigation
}

export function getHomepageContent() {
  return contentData.homepage
}

export function getAboutContent() {
  return contentData.about
}

export function getContactContent() {
  return contentData.contact
}

export function getNewsletterContent() {
  return contentData.newsletter
}

export function getCategories() {
  return contentData.categories
}

export function getFooterContent() {
  return contentData.footer
}

// UTILITY FUNCTIONS

export function formatDate(dateString: string, locale: string = 'de-DE'): string {
  const date = new Date(dateString)
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatDateShort(dateString: string, locale: string = 'de-DE'): string {
  const date = new Date(dateString)
  return date.toLocaleDateString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

export function formatTime(timeString: string): string {
  // Extract time from full datetime or return as-is
  if (timeString.includes('T')) {
    const date = new Date(timeString)
    return date.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  return timeString
}

export function getCategoryColor(category: string, type: 'news' | 'events'): string {
  const categories = type === 'news' ? contentData.categories.news : contentData.categories.events
  const cat = categories.find(c => c.id.toLowerCase() === category.toLowerCase())
  return cat?.color || 'gold'
}

// Pre-defined Tailwind class mappings for category colors
// This is needed because Tailwind can't process dynamic class names like `bg-${color}/10`
const categoryClassMap: Record<string, { badge: string; badgeAlt: string; date: string }> = {
  gold: {
    badge: 'bg-pepe-gold/20 text-pepe-gold border-pepe-gold/40',
    badgeAlt: 'bg-pepe-gold/10 text-pepe-gold border-pepe-gold/30',
    date: 'bg-pepe-gold/30 border-2 border-pepe-gold/60',
  },
  red: {
    badge: 'bg-red-500/20 text-red-400 border-red-500/40',
    badgeAlt: 'bg-red-500/10 text-red-400 border-red-500/30',
    date: 'bg-red-500/30 border-2 border-red-500/60',
  },
  blue: {
    badge: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
    badgeAlt: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    date: 'bg-blue-500/30 border-2 border-blue-500/60',
  },
  green: {
    badge: 'bg-green-500/20 text-green-400 border-green-500/40',
    badgeAlt: 'bg-green-500/10 text-green-400 border-green-500/30',
    date: 'bg-green-500/30 border-2 border-green-500/60',
  },
  purple: {
    badge: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
    badgeAlt: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    date: 'bg-purple-500/30 border-2 border-purple-500/60',
  },
  orange: {
    badge: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
    badgeAlt: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    date: 'bg-orange-500/30 border-2 border-orange-500/60',
  },
  pink: {
    badge: 'bg-pink-500/20 text-pink-400 border-pink-500/40',
    badgeAlt: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
    date: 'bg-pink-500/30 border-2 border-pink-500/60',
  },
  cyan: {
    badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
    badgeAlt: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    date: 'bg-cyan-500/30 border-2 border-cyan-500/60',
  },
}

export function getCategoryClasses(category: string, type: 'news' | 'events') {
  const color = getCategoryColor(category, type)
  return categoryClassMap[color] || categoryClassMap.gold
}
