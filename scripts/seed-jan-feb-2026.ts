/**
 * Seed database with Jan/Feb 2026 events from pepe-dome.de
 * Downloads images and creates events in the database
 */

import { PrismaClient, EventCategory, ContentStatus } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'
import * as https from 'https'

const prisma = new PrismaClient()

// Image download helper
async function downloadImage(url: string, filename: string): Promise<string> {
  const publicDir = path.join(process.cwd(), 'public', 'events')

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true })
  }

  const filepath = path.join(publicDir, filename)

  if (fs.existsSync(filepath)) {
    console.log(`  ✓ Image already exists: ${filename}`)
    return `/events/${filename}`
  }

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath)
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location
        if (redirectUrl) {
          file.close()
          fs.unlinkSync(filepath)
          downloadImage(redirectUrl, filename).then(resolve).catch(reject)
          return
        }
      }

      response.pipe(file)
      file.on('finish', () => {
        file.close()
        console.log(`  ✓ Downloaded: ${filename}`)
        resolve(`/events/${filename}`)
      })
    }).on('error', (err) => {
      fs.unlinkSync(filepath)
      console.log(`  ✗ Failed to download: ${filename}`)
      reject(err)
    })
  })
}

// Generate slug from title
function generateSlug(title: string, date: Date): string {
  const baseSlug = title
    .toLowerCase()
    .replace(/[äÄ]/g, 'ae')
    .replace(/[öÖ]/g, 'oe')
    .replace(/[üÜ]/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${baseSlug}-${month}-${day}`
}

const eventsData = [
  {
    title: 'Design-Thinking-Workshop "Lehrergesundheit"',
    subtitle: 'Ein Zirkus als Denkraum für neue Perspektiven',
    description: `Ein innovativer Workshop im Zirkuszelt, der Lehrkräften neue Perspektiven auf das Thema Gesundheit am Arbeitsplatz eröffnet.

Mithilfe der Design-Thinking-Methode entwickeln die Teilnehmenden gemeinsam praktische Lösungsansätze für die Herausforderungen des Lehrerberufs. Die ungewöhnliche Umgebung des Pepe Dome schafft einen kreativen Denkraum abseits des Schulalltags.

Der Workshop ist kostenlos und Teil einer wissenschaftlichen Arbeit. Anmeldung per E-Mail an mindmambo@gmail.com mit dem Betreff "Anmeldung: Design-Thinking-Workshop 'Lehrergesundheit'".

**Highlights:**
- Design-Thinking-Methodik für Lehrergesundheit
- Kreative Umgebung im Zirkuszelt
- Kollaborative Problemlösung
- Kostenlos (wissenschaftliche Arbeit)`,
    date: new Date('2026-01-31T14:00:00'),
    endDate: new Date('2026-01-31T17:30:00'),
    time: '14:00 - 17:30 Uhr',
    location: 'Pepe Dome, Ostpark München',
    category: EventCategory.WORKSHOP,
    ticketUrl: null,
    price: 'Kostenlos',
    imageUrl: '/events/design-thinking-lehrergesundheit.jpeg',
    imageSource: 'https://www.pepe-dome.de/Design%20Thinking.jpeg',
    featured: false,
    highlights: ['Design-Thinking-Methodik', 'Kreative Umgebung im Zirkuszelt', 'Kollaborative Problemlösung', 'Kostenlos'],
  },
  {
    title: 'Circus & Poetry',
    subtitle: 'Literatur trifft Artistik',
    description: `Ein poetischer Abend, der klassische Literatur mit zeitgenössischer Zirkuskunst verbindet.

Das Programm präsentiert Werke von Rainer Maria Rilke und Antoine de Saint-Exupéry, vorgetragen von Sigrid Grün, Julian Bellini und Michael Heiduk. Die Zirkuskünstler Elefteria und Chris tragen mit ihren physischen Darbietungen bei und schaffen eine sinnliche Komposition voller Poesie, Bewegung und Emotion.

**Mitwirkende:**
- Sprecher: Sigrid Grün, Julian Bellini, Michael Heiduk
- Akrobaten: Elefteria und Chris`,
    date: new Date('2026-02-27T19:00:00'),
    time: '19:00 Uhr',
    location: 'Pepe Dome, Ostpark München',
    category: EventCategory.SHOW,
    ticketUrl: 'https://rausgegangen.de/events/circus-poetry-4/',
    price: null,
    imageUrl: '/events/circus-poetry-2026.webp',
    imageSource: 'https://www.pepe-dome.de/Circus%20%26%20Poetry%202.webp',
    featured: true,
    highlights: ['Gedichte von Rilke & Saint-Exupéry', 'Sprecher: Sigrid Grün, Julian Bellini, Michael Heiduk', 'Akrobatik von Elefteria & Chris', 'Poetische Zirkuskunst'],
  },
  {
    title: 'Circus & Poetry',
    subtitle: 'Literatur trifft Artistik',
    description: `Ein poetischer Abend, der klassische Literatur mit zeitgenössischer Zirkuskunst verbindet.

Das Programm präsentiert Werke von Rainer Maria Rilke und Antoine de Saint-Exupéry, vorgetragen von Sigrid Grün, Julian Bellini und Michael Heiduk. Die Zirkuskünstler Elefteria und Chris tragen mit ihren physischen Darbietungen bei und schaffen eine sinnliche Komposition voller Poesie, Bewegung und Emotion.

**Mitwirkende:**
- Sprecher: Sigrid Grün, Julian Bellini, Michael Heiduk
- Akrobaten: Elefteria und Chris`,
    date: new Date('2026-02-28T19:00:00'),
    time: '19:00 Uhr',
    location: 'Pepe Dome, Ostpark München',
    category: EventCategory.SHOW,
    ticketUrl: 'https://rausgegangen.de/events/circus-poetry-5/',
    price: null,
    imageUrl: '/events/circus-poetry-2026.webp',
    imageSource: 'https://www.pepe-dome.de/Circus%20%26%20Poetry%202.webp',
    featured: false,
    highlights: ['Gedichte von Rilke & Saint-Exupéry', 'Sprecher: Sigrid Grün, Julian Bellini, Michael Heiduk', 'Akrobatik von Elefteria & Chris', 'Poetische Zirkuskunst'],
  },
]

async function main() {
  console.log('🎪 Seeding Jan/Feb 2026 events from pepe-dome.de...\n')

  // Download images
  console.log('📸 Downloading images...')
  for (const event of eventsData) {
    if (event.imageSource) {
      try {
        const filename = event.imageUrl.split('/').pop()!
        await downloadImage(event.imageSource, filename)
      } catch (error) {
        console.log(`  ⚠ Could not download image for ${event.title}`)
      }
    }
  }

  console.log('\n📝 Creating events...')

  for (const eventData of eventsData) {
    const slug = generateSlug(eventData.title, eventData.date)

    const existing = await prisma.event.findUnique({
      where: { slug }
    })

    if (existing) {
      console.log(`  ⏭ Skipping existing event: ${eventData.title} (${slug})`)
      continue
    }

    const { imageSource, ...data } = eventData

    await prisma.event.create({
      data: {
        slug,
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        date: data.date,
        endDate: data.endDate || null,
        time: data.time,
        location: data.location,
        category: data.category,
        ticketUrl: data.ticketUrl,
        price: data.price,
        imageUrl: data.imageUrl,
        featured: data.featured,
        highlights: data.highlights,
        status: ContentStatus.PUBLISHED,
      }
    })

    console.log(`  ✓ Created: ${eventData.title} (${slug})`)
  }

  console.log('\n✅ Seeding complete!')

  const eventCount = await prisma.event.count()
  console.log(`\n📊 Total events in database: ${eventCount}`)
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
