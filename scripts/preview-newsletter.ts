/**
 * Newsletter-Layout ohne Datenbank ansehen
 *
 *   npx tsx scripts/preview-newsletter.ts
 *
 * Rendert das E-Mail-Template mit Beispieldaten nach
 * `.preview/newsletter.html` und `.preview/newsletter.txt`. Gedacht zum
 * Beurteilen des Layouts während der Entwicklung, wenn kein Entwurf in der
 * Datenbank liegt oder man einen Zwischenstand schnell im Browser sehen will.
 *
 * Für eine echte Vorschau mit realen Inhalten bleibt der Admin die richtige
 * Stelle: dort kommen die Daten aus der Datenbank.
 */

import { writeFileSync, mkdirSync, readFileSync } from 'fs'
import { join } from 'path'
import Module from 'module'
import { buildViewModel } from '../src/lib/newsletter-content'
import { renderNewsletterText } from '../src/lib/newsletter-text'
import { cropForEmail } from '../src/lib/email-image'

// Die E-Mail-Komponenten importieren `server-only`, damit sie nie im
// Client-Bundle landen. Außerhalb von Next wirft dieses Paket beim Laden.
// Für dieses Entwicklungsskript wird es deshalb auf ein leeres Modul
// umgebogen, so wie es auch die Tests tun.
const moduleInternals = Module as unknown as {
  _resolveFilename(request: string, ...rest: unknown[]): string
}
const resolveFilename = moduleInternals._resolveFilename
moduleInternals._resolveFilename = function (request: string, ...rest: unknown[]) {
  if (request === 'server-only') {
    return resolveFilename.call(this, join(__dirname, '..', 'tests', '__mocks__', 'server-only.ts'), ...rest)
  }
  return resolveFilename.call(this, request, ...rest)
}

// Zeigt auf den lokalen Dev-Server, damit die Bilder in der Vorschau laden.
// Mit NEXT_PUBLIC_APP_URL lässt sich das auf die Live-Domain umstellen.
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3004'

const demoEvents = [
  {
    id: '1',
    slug: 'nacht-der-artistik',
    title: 'Nacht der Artistik',
    subtitle: null,
    description:
      'Sieben Kompanien, ein Abend, eine Kuppel. Luftakrobatik, Handstand und Jonglage von Menschen, die sonst auf den großen Bühnen Europas stehen. Danach spielt die Band weiter, solange jemand bleibt.',
    date: new Date('2026-08-15T18:00:00.000Z'),
    time: '20:00 Uhr',
    location: 'PEPE Dome, Ostpark',
    category: 'SHOW',
    ticketUrl: 'https://tickets.example.com/nacht-der-artistik',
    price: 'ab 18 Euro, ermäßigt 12 Euro',
    imageUrl: '/images/shows/aerial-silk-01.jpg',
  },
  {
    id: '2',
    slug: 'holi-poldini',
    title: 'Holi Poldini',
    subtitle: 'Clownerie für alle ab vier Jahren',
    description: 'Ein Nachmittag, an dem Erwachsene lauter lachen als die Kinder.',
    date: new Date('2026-08-22T14:00:00.000Z'),
    time: '16:00 Uhr',
    location: 'PEPE Dome',
    category: 'SHOW',
    ticketUrl: 'https://tickets.example.com/holi-poldini',
    price: null,
    imageUrl: '/images/shows/carmen-jonas-duo.jpg',
  },
  {
    id: '3',
    slug: 'luftakrobatik-schnupperkurs',
    title: 'Luftakrobatik zum Ausprobieren',
    subtitle: 'Zwei Stunden am Vertikaltuch, ohne Vorkenntnisse',
    description: 'Zwei Stunden am Vertikaltuch, ohne Vorkenntnisse.',
    date: new Date('2026-08-24T09:00:00.000Z'),
    time: '11:00 Uhr',
    location: 'PEPE Dome',
    category: 'WORKSHOP',
    ticketUrl: 'anmeldung@pepe-dome.de',
    price: '35 Euro',
    imageUrl: '/images/shows/jonas-acrobatics.jpg',
  },
  {
    id: '4',
    slug: 'offenes-training',
    title: 'Offenes Training',
    subtitle: null,
    description: 'Jeden Dienstag, für alle, die schon wissen, was sie tun.',
    date: new Date('2026-08-26T16:00:00.000Z'),
    time: '18:00 Uhr',
    location: 'PEPE Dome',
    category: 'OPEN_TRAINING',
    ticketUrl: null,
    price: null,
    imageUrl: null,
  },
  {
    id: '5',
    slug: 'kindertraining',
    title: 'Kindertraining',
    subtitle: null,
    description: 'Zirkus für Kinder von sechs bis zwölf.',
    date: new Date('2026-08-28T14:00:00.000Z'),
    time: '16:00 Uhr',
    location: 'PEPE Dome',
    category: 'KINDERTRAINING',
    ticketUrl: null,
    price: null,
    imageUrl: null,
  },
  {
    id: '6',
    slug: 'sommernachtsgala',
    title: 'Sommernachtsgala',
    subtitle: null,
    description: 'Der letzte Abend der Saison, draußen vor der Kuppel.',
    date: new Date('2026-08-30T18:30:00.000Z'),
    time: '20:30 Uhr',
    location: 'Vor dem Dome',
    category: 'OPEN_AIR',
    ticketUrl: 'https://tickets.example.com/sommernachtsgala',
    price: null,
    imageUrl: null,
  },
  {
    id: '7',
    slug: 'circus-cinema',
    title: 'Circus & Cinema',
    subtitle: null,
    description: 'Kurzfilme über Zirkus, danach Gespräch mit den Regisseurinnen.',
    date: new Date('2026-09-03T18:00:00.000Z'),
    time: '20:00 Uhr',
    location: 'PEPE Dome',
    category: 'EVENT',
    ticketUrl: null,
    price: 'Eintritt frei',
    imageUrl: null,
  },
]

const demoArticles = [
  {
    id: 'a1',
    slug: 'wie-ein-abend-entsteht',
    title: 'Wie aus einer Idee ein Abend wird',
    excerpt:
      'Von der ersten Probe bis zum Applaus vergehen im Dome meist vier Monate. Ein Blick auf das, was das Publikum nie sieht.',
    category: 'Hinter den Kulissen',
    imageUrl: '/images/artists/contortionbox.jpg',
  },
]

const newsletter = {
  slug: '2026-08-sommer-im-dome',
  subject: 'Sieben Abende im August',
  preheader: 'Die Nacht der Artistik, ein Schnupperkurs und das letzte Open Air der Saison',
  introText: [
    'der August ist der Monat, in dem hier am meisten los ist. Wir haben nicht alles aufgeschrieben, sondern das, was wir **selbst nicht verpassen** würden.',
    '',
    '## Drei Dinge vorab',
    '',
    '- Für die *Nacht der Artistik* lohnt sich frühes Buchen, die letzten Male war sie voll.',
    '- Der Schnupperkurs ist auch für komplette Anfänger:innen gedacht.',
    '- Das Café hat an Showabenden ab 18 Uhr geöffnet.',
    '',
    '> Kommt vorbei, bleibt hängen. Mehr braucht es nicht.',
  ].join('\n'),
  heroImageUrl: '/GeodomeEvening.webp',
  heroTitle: 'Sieben Abende im August',
  heroSubtitle: 'Was wir dir dieses Mal besonders ans Herz legen',
  heroCTALabel: null,
  heroCTAUrl: null,
  content: [
    ...demoEvents.map((event, index) => ({
      contentType: 'EVENT',
      contentId: event.id,
      sectionHeading: index < 3 ? 'Im August' : 'Außerdem im Programm',
      sectionDescription: index === 0 ? 'Drei Abende, die wir besonders empfehlen' : null,
      orderPosition: index,
    })),
    {
      contentType: 'ARTICLE',
      contentId: 'a1',
      sectionHeading: 'Zum Lesen',
      sectionDescription: null,
      orderPosition: 100,
    },
  ],
}

const outDir = join(process.cwd(), '.preview')

/**
 * In der echten Mail läuft jedes Bild durch /api/newsletter-image. Für die
 * lokale Vorschau ohne laufenden Server wird derselbe Zuschnitt hier direkt
 * gerechnet, sonst zeigt die Vorschau ein anderes Bild als der Versand.
 */
async function renderDemoImages(): Promise<Map<string, string>> {
  const imageDir = join(outDir, 'img')
  mkdirSync(imageDir, { recursive: true })

  const sources = [
    ...demoEvents.map((event, index) => ({
      key: event.imageUrl,
      ratio: index === 0 ? '3:2' : '16:9',
    })),
    ...demoArticles.map((article) => ({ key: article.imageUrl, ratio: '16:9' })),
    { key: newsletter.heroImageUrl, ratio: '3:2' },
  ].filter((entry): entry is { key: string; ratio: string } => Boolean(entry.key))

  const map = new Map<string, string>()

  for (const [index, entry] of sources.entries()) {
    if (map.has(entry.key)) continue
    try {
      const buffer = await cropForEmail(readFileSync(join(process.cwd(), 'public', entry.key)), {
        width: 1200,
        ratio: entry.ratio,
      })
      const name = `bild-${index}.jpg`
      writeFileSync(join(imageDir, name), buffer)
      map.set(entry.key, `img/${name}`)
      console.log(`  ${entry.key} → ${name} (${Math.round(buffer.length / 1024)} KB, ${entry.ratio})`)
    } catch {
      console.warn(`  Bild nicht gefunden, wird übersprungen: ${entry.key}`)
    }
  }

  return map
}

async function main() {
  const events = new Map(demoEvents.map((event) => [event.id, event]))
  const articles = new Map(demoArticles.map((article) => [article.id, article]))

  console.log('Bilder aufbereiten:')
  const croppedImages = await renderDemoImages()

  const viewModel = buildViewModel(
    newsletter as never,
    { events, articles } as never,
    { baseUrl: BASE_URL, target: 'web' }
  )

  // Auf die lokal zugeschnittenen Dateien umbiegen, damit die Vorschau
  // ohne laufenden Server funktioniert.
  const rewrite = (url?: string) => {
    if (!url) return url
    const key = [...croppedImages.keys()].find((candidate) => url.endsWith(candidate))
    return key ? croppedImages.get(key) : url
  }
  viewModel.hero.imageUrl = rewrite(viewModel.hero.imageUrl)
  for (const section of viewModel.sections) {
    for (const item of section.items) {
      if ('imageUrl' in item) item.imageUrl = rewrite(item.imageUrl)
    }
  }

  const { render } = await import('@react-email/render')
  const NewsletterTemplate = (await import('../src/components/email/templates/NewsletterTemplate'))
    .default

  const html = await render(
    NewsletterTemplate({
      viewModel,
      subscriberId: 'vorschau',
      subscriberEmail: 'vorschau@pepe-dome.de',
      firstName: 'Chris',
    })
  )

  const text = renderNewsletterText(viewModel, {
    firstName: 'Chris',
    unsubscribeUrl: `${BASE_URL}/newsletter/unsubscribe/vorschau`,
    subscriberEmail: 'vorschau@pepe-dome.de',
  })

  mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, 'newsletter.html'), html, 'utf-8')
  writeFileSync(join(outDir, 'newsletter.txt'), text, 'utf-8')

  console.log(`HTML: ${join(outDir, 'newsletter.html')}  (${Math.round(html.length / 1024)} KB)`)
  console.log(`Text: ${join(outDir, 'newsletter.txt')}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
