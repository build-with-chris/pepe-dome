/**
 * Migration script to import events.json and news.json into PostgreSQL
 * Run with: npx tsx scripts/migrate-json-to-db.ts
 */

import { PrismaClient, EventCategory, ContentStatus } from '@prisma/client'
import eventsData from '../src/data/events.json'
import newsData from '../src/data/news.json'

const prisma = new PrismaClient()

// Map JSON category to EventCategory enum
const categoryMap: Record<string, EventCategory> = {
  'Show': 'SHOW',
  'Premiere': 'PREMIERE',
  'Festival': 'FESTIVAL',
  'Workshop': 'WORKSHOP',
  'Open Training': 'OPEN_TRAINING',
  'Kindertraining': 'KINDERTRAINING',
  'Business': 'BUSINESS',
  'Open Air': 'OPEN_AIR',
  'Event': 'EVENT',
}

function generateSlug(title: string, date?: string): string {
  const base = title
    .toLowerCase()
    .replace(/[äÄ]/g, 'ae')
    .replace(/[öÖ]/g, 'oe')
    .replace(/[üÜ]/g, 'ue')
    .replace(/[ß]/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  if (date) {
    const d = new Date(date)
    return `${base}-${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  }
  return base
}

async function migrateEvents() {
  console.log('Migrating events...')

  for (const event of eventsData) {
    const slug = event.id || generateSlug(event.title, event.date)
    const category = categoryMap[event.category] || 'EVENT'

    try {
      await prisma.event.upsert({
        where: { slug },
        update: {
          title: event.title,
          subtitle: event.subtitle || null,
          description: event.description,
          date: new Date(event.date),
          endDate: event.endDate ? new Date(event.endDate) : null,
          time: event.time || null,
          location: event.location,
          category,
          ticketUrl: event.ticketUrl || null,
          price: event.price || null,
          imageUrl: event.imageUrl || null,
          featured: event.featured || false,
          highlights: event.highlights || [],
          status: 'PUBLISHED' as ContentStatus,
        },
        create: {
          slug,
          title: event.title,
          subtitle: event.subtitle || null,
          description: event.description,
          date: new Date(event.date),
          endDate: event.endDate ? new Date(event.endDate) : null,
          time: event.time || null,
          location: event.location,
          category,
          ticketUrl: event.ticketUrl || null,
          price: event.price || null,
          imageUrl: event.imageUrl || null,
          featured: event.featured || false,
          highlights: event.highlights || [],
          status: 'PUBLISHED' as ContentStatus,
        },
      })
      console.log(`  ✓ ${event.title}`)
    } catch (error) {
      console.error(`  ✗ Failed to migrate event: ${event.title}`, error)
    }
  }

  console.log(`Migrated ${eventsData.length} events`)
}

async function migrateArticles() {
  console.log('\nMigrating articles...')

  for (const article of newsData) {
    const slug = article.slug || article.id || generateSlug(article.title)

    try {
      await prisma.article.upsert({
        where: { slug },
        update: {
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          category: article.category,
          author: article.author,
          imageUrl: article.imageUrl || null,
          tags: article.tags || [],
          featured: article.featured || false,
          status: 'PUBLISHED' as ContentStatus,
          publishedAt: article.publishedAt ? new Date(article.publishedAt) : new Date(),
        },
        create: {
          slug,
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          category: article.category,
          author: article.author,
          imageUrl: article.imageUrl || null,
          tags: article.tags || [],
          featured: article.featured || false,
          status: 'PUBLISHED' as ContentStatus,
          publishedAt: article.publishedAt ? new Date(article.publishedAt) : new Date(),
        },
      })
      console.log(`  ✓ ${article.title}`)
    } catch (error) {
      console.error(`  ✗ Failed to migrate article: ${article.title}`, error)
    }
  }

  console.log(`Migrated ${newsData.length} articles`)
}

async function main() {
  console.log('Starting JSON to PostgreSQL migration...\n')

  try {
    await migrateEvents()
    await migrateArticles()

    // Print summary
    const eventCount = await prisma.event.count()
    const articleCount = await prisma.article.count()

    console.log('\n=== Migration Complete ===')
    console.log(`Total Events: ${eventCount}`)
    console.log(`Total Articles: ${articleCount}`)
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
