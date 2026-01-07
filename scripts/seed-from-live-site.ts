/**
 * Seed database from live pepe-dome.de website
 * Downloads images and creates events in the database
 */

import { PrismaClient, EventCategory, ContentStatus, RecurrencePattern } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'
import * as https from 'https'

const prisma = new PrismaClient()

// Image download helper
async function downloadImage(url: string, filename: string): Promise<string> {
  const publicDir = path.join(process.cwd(), 'public', 'events')

  // Ensure directory exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true })
  }

  const filepath = path.join(publicDir, filename)

  // Skip if already exists
  if (fs.existsSync(filepath)) {
    console.log(`  ✓ Image already exists: ${filename}`)
    return `/events/${filename}`
  }

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath)
    https.get(url, (response) => {
      // Handle redirects
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
function generateSlug(title: string, date?: Date): string {
  const baseSlug = title
    .toLowerCase()
    .replace(/[äÄ]/g, 'ae')
    .replace(/[öÖ]/g, 'oe')
    .replace(/[üÜ]/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  if (date) {
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${baseSlug}-${month}-${day}`
  }

  return baseSlug
}

// Events data scraped from pepe-dome.de
const eventsData = [
  {
    title: 'Rhapsodie du soir',
    subtitle: 'Open Stage mit Oles Koval',
    description: `Eine bunte Mischung voller Vielfalt, Spaß und Unterhaltung: Magic, Drag, Acting, Acrobatics, Music, Poetry und das Unerwartete.

Ein Abend, der alle Sinne anspricht und Überraschungen garantiert. Moderiert von Oles Koval.

**Highlights:**
- Magic & das Unerwartete
- Drag, Acting & Performance
- Akrobatik, Musik & Poetry`,
    date: new Date('2025-12-19T19:00:00'),
    time: '19:00 Uhr | Einlass 18:30 Uhr',
    location: 'Pepe Dome, Ostpark München',
    category: EventCategory.SHOW,
    ticketUrl: 'https://rausgegangen.de/events/rhapsodie-du-soir-2/',
    imageUrl: '/events/rhapsodie-du-soir.webp',
    imageSource: 'https://www.pepe-dome.de/OpenStage%20Pepe.webp',
    featured: true,
    highlights: ['Magic & das Unerwartete', 'Drag, Acting & Performance', 'Akrobatik, Musik & Poetry'],
  },
  {
    title: 'Circus & Poetry',
    subtitle: 'Literatur trifft Artistik',
    description: `Ein poetischer Abend, der klassische Literatur mit zeitgenössischer Zirkuskunst verbindet.

Das Programm präsentiert Werke von Rainer Maria Rilke und Antoine de Saint-Exupéry, vorgetragen von Sigrid Grün, Julian Bellini und Michael Heiduk. Die Zirkuskünstler Elefteria und Chris tragen mit ihren physischen Darbietungen bei und schaffen eine sinnliche Komposition, in der Poesie und Akrobatik ineinander fließen.

**Mitwirkende:**
- Sprecher: Sigrid Grün, Julian Bellini, Michael Heiduk
- Akrobaten: Elefteria und Chris`,
    date: new Date('2025-12-27T19:00:00'),
    time: '19:00 Uhr | Einlass 18:30 Uhr',
    location: 'Pepe Dome, Ostpark München',
    category: EventCategory.SHOW,
    ticketUrl: 'https://rausgegangen.de/events/circus-poetry-1/',
    imageUrl: '/events/circus-poetry.webp',
    imageSource: 'https://www.pepe-dome.de/Circus%20%26%20Poetry%202.webp',
    featured: true,
    highlights: ['Rainer Maria Rilke', 'Antoine de Saint-Exupéry', 'Live-Akrobatik'],
  },
  {
    title: 'Circus & Poetry',
    subtitle: 'Literatur trifft Artistik',
    description: `Ein poetischer Abend, der klassische Literatur mit zeitgenössischer Zirkuskunst verbindet.

Das Programm präsentiert Werke von Rainer Maria Rilke und Antoine de Saint-Exupéry, vorgetragen von Sigrid Grün, Julian Bellini und Michael Heiduk. Die Zirkuskünstler Elefteria und Chris tragen mit ihren physischen Darbietungen bei und schaffen eine sinnliche Komposition, in der Poesie und Akrobatik ineinander fließen.

**Mitwirkende:**
- Sprecher: Sigrid Grün, Julian Bellini, Michael Heiduk
- Akrobaten: Elefteria und Chris`,
    date: new Date('2025-12-28T19:00:00'),
    time: '19:00 Uhr | Einlass 18:30 Uhr',
    location: 'Pepe Dome, Ostpark München',
    category: EventCategory.SHOW,
    ticketUrl: 'https://rausgegangen.de/events/circus-poetry-2/',
    imageUrl: '/events/circus-poetry.webp',
    imageSource: 'https://www.pepe-dome.de/Circus%20%26%20Poetry%202.webp',
    featured: false,
    highlights: ['Rainer Maria Rilke', 'Antoine de Saint-Exupéry', 'Live-Akrobatik'],
  },
  {
    title: 'Outta Space Party Service',
    subtitle: 'Silvester mit Breakdance-Crew',
    description: `Feiere Silvester mit der preisgekrönten Breakdance-Crew Outta Space aus München!

Ein energiegeladener Abend mit atemberaubenden Moves und dynamischen Choreografien. Die Crew zelebriert Hip-Hop-Kultur mit Rhythmus und Stil - der perfekte Start ins neue Jahr.

**Highlights:**
- Preisgekrönte Breakdance-Crew aus München
- Hochenergetische Performance
- Dynamische Choreografien und Hip-Hop-Kultur`,
    date: new Date('2025-12-31T21:00:00'),
    time: '21:00 Uhr | Einlass 20:30 Uhr',
    location: 'Pepe Dome, Ostpark München',
    category: EventCategory.EVENT,
    ticketUrl: null,
    imageUrl: '/events/outta-space-silvester.webp',
    imageSource: null,
    featured: true,
    highlights: ['Breakdance-Crew Outta Space', 'Hip-Hop-Kultur', 'Silvester-Party'],
  },
  {
    title: 'Freeman Festival',
    subtitle: 'Festival der Artistik',
    description: `Das Freeman Festival 2025 - Ein artistisches Fest mit internationalen Top-Performern aus Skandinavien und dem Baltikum.

4 Shows • 2 Workshops • 3 Tage • Höchstleistung trifft Poesie

Zeitgenössischer Zirkus auf Weltklasse-Niveau mit nur 200 Plätzen für ein intimes, zugängliches Erlebnis. Teil von ZEIT FÜR ZIRKUS 2025, der deutschen Ausgabe von LA NUIT DU CIRQUE.

**Programme:**
- "Häppy Hour" von The Nordic Council (Finnland, Island, Schweden)
- "How a Spiral Works" von Art for Rainy Days (Lettland)

**Workshops:**
- Objektmanipulation mit Merri Heikkilä
- Stillness in Motion mit Alise Madara Bokaldere`,
    date: new Date('2025-11-14T19:00:00'),
    endDate: new Date('2025-11-16T23:00:00'),
    time: 'Fr-So | Verschiedene Zeiten',
    location: 'Pepe Dome, Ostpark München',
    category: EventCategory.FESTIVAL,
    ticketUrl: null,
    imageUrl: '/events/freeman-festival.webp',
    imageSource: null,
    featured: true,
    highlights: ['The Nordic Council', 'Art for Rainy Days', 'LA NUIT DU CIRQUE'],
  },
  {
    title: 'Circus meets Cinema',
    subtitle: 'Film trifft Zirkus',
    description: `Eine einzigartige Verbindung von Film und Zirkuskunst im Pepe Dome.

Erleben Sie, wie klassische Filmmomente mit Live-Artistik verschmelzen und eine ganz neue Art des Entertainments entsteht.`,
    date: new Date('2025-10-10T19:00:00'),
    endDate: new Date('2025-10-11T23:00:00'),
    time: 'Fr-Sa | Verschiedene Zeiten',
    location: 'Pepe Dome, Ostpark München',
    category: EventCategory.EVENT,
    ticketUrl: null,
    imageUrl: '/events/circus-meets-cinema.webp',
    imageSource: null,
    featured: false,
    highlights: ['Film & Zirkus', 'Live-Artistik', 'Einzigartiges Erlebnis'],
  },
  // Recurring training events
  {
    title: 'Profitraining',
    subtitle: 'Tägliches Training für Profis',
    description: `Tägliches professionelles Training im Pepe Dome.

Unser Profitraining findet täglich von 10:00 bis 14:00 Uhr statt und richtet sich an professionelle Artisten und fortgeschrittene Trainer.

Der Pepe Dome bietet optimale Bedingungen für:
- Luftakrobatik (Silks, Hoops, Trapez)
- Bodenakrobatik
- Handstand & Balance
- Movement & Flow`,
    date: new Date('2025-01-06T10:00:00'),
    time: '10:00 - 14:00 Uhr',
    location: 'Pepe Dome, Ostpark München',
    category: EventCategory.OPEN_TRAINING,
    ticketUrl: 'https://eversports.de/s/pepe-dome',
    imageUrl: '/events/profitraining.webp',
    imageSource: null,
    featured: false,
    highlights: ['Luftakrobatik', 'Bodenakrobatik', 'Handstand & Balance'],
    recurrence: RecurrencePattern.DAILY,
    recurrenceEnd: new Date('2025-12-31'),
  },
]

async function main() {
  console.log('🎪 Seeding database from pepe-dome.de...\n')

  // Download images first
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

    // Check if event already exists
    const existing = await prisma.event.findUnique({
      where: { slug }
    })

    if (existing) {
      console.log(`  ⏭ Skipping existing event: ${eventData.title}`)
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
        imageUrl: data.imageUrl,
        featured: data.featured,
        highlights: data.highlights,
        status: ContentStatus.PUBLISHED,
        recurrence: data.recurrence || null,
        recurrenceEnd: data.recurrenceEnd || null,
      }
    })

    console.log(`  ✓ Created: ${eventData.title} (${slug})`)
  }

  console.log('\n✅ Database seeding complete!')

  // Print summary
  const eventCount = await prisma.event.count()
  console.log(`\n📊 Summary:`)
  console.log(`   Total events in database: ${eventCount}`)
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
