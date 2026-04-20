/**
 * Seed: Akrobatik-Ferienkurs Pfingsten 2026 (Leopoldini)
 *
 * Idempotent — uses upsert by slug, so running this multiple times
 * will not create duplicates.
 *
 * Run:
 *   npx tsx scripts/seed-ferienkurs-pfingsten-2026.ts
 */

import { PrismaClient, EventCategory, ContentStatus } from '@prisma/client'

const prisma = new PrismaClient()

const ARTICLE_SLUG = 'akrobatik-ferienkurs-pfingsten-2026'
const EVENT_SLUG = 'akrobatik-ferienkurs-pfingsten-2026'

const ARTICLE_CONTENT = `In den bayerischen Pfingstferien 2026 bieten wir gemeinsam mit Leopoldini einen zweiwöchigen Akrobatik-Ferienkurs für Kinder und Jugendliche von 10 bis 15 Jahren an.

**Zeitraum:** 26. Mai bis 5. Juni 2026
**Uhrzeit:** täglich von 10:00 bis 15:00 Uhr
**Alter:** 10 bis 15 Jahre
**Plätze:** begrenzt auf 30 Teilnehmer:innen
**Ort:** Pepe Dome, Ostpark München

**Was euch erwartet:**
Ein bunter Mix aus verschiedenen Zirkusdisziplinen — von den ersten Handständen über Jonglier-Grundlagen bis hin zu Partner- und Bodenakrobatik. Die Teilnehmer:innen lernen spielerisch Körperkontrolle, Koordination, Kraft und Kreativität. Ohne Leistungsdruck, mit viel Spaß und kleinen Erfolgserlebnissen.

**Inhalte im Überblick:**
- Jonglage-Grundlagen (Bälle, Tücher, Keulen)
- Akrobatik-Basics (Partner- und Bodenakrobatik)
- Handstand und Balance
- Körperkontrolle & Körperspannung
- Spielerisches Warm-up und Cool-down

**Trainer:innen:** werden in Kürze ergänzt.
**Preis:** wird in Kürze ergänzt.

**Jetzt vormerken:** Melde dich bei uns, wenn du einen Platz für dein Kind reservieren möchtest — die Plätze sind begrenzt und werden nach Anmeldungseingang vergeben.`

async function main() {
  console.log('→ Seeding Akrobatik-Ferienkurs Pfingsten 2026…')

  // ─── Event ──────────────────────────────────────────────
  const event = await prisma.event.upsert({
    where: { slug: EVENT_SLUG },
    update: {
      title: 'Akrobatik-Ferienkurs by Leopoldini',
      subtitle: '2-Wochen-Ferienkurs · 10–15 Jahre',
      description:
        'Zwei Wochen Ferienspaß im Pepe Dome: Jonglage, Akrobatik, Handstand und mehr. Ein bunter Mix für Kinder und Jugendliche von 10 bis 15 Jahren — täglich von 10 bis 15 Uhr in den bayerischen Pfingstferien.',
      date: new Date('2026-05-26T10:00:00+02:00'),
      endDate: new Date('2026-06-05T15:00:00+02:00'),
      time: '10:00 – 15:00 Uhr (täglich)',
      location: 'Pepe Dome, Ostpark München',
      category: EventCategory.WORKSHOP,
      price: 'Preis folgt in Kürze',
      imageUrl: '/images/shows/jonas-acrobatics.jpg',
      featured: true,
      highlights: [
        '10 Tage Ferienprogramm (26. Mai – 5. Juni 2026)',
        'Täglich 10–15 Uhr',
        'Für Kinder & Jugendliche von 10–15 Jahren',
        'Jonglage, Akrobatik, Handstand & mehr',
        'Max. 30 Plätze — begrenzt',
        'In Kooperation mit Leopoldini',
      ],
      status: ContentStatus.PUBLISHED,
    },
    create: {
      slug: EVENT_SLUG,
      title: 'Akrobatik-Ferienkurs by Leopoldini',
      subtitle: '2-Wochen-Ferienkurs · 10–15 Jahre',
      description:
        'Zwei Wochen Ferienspaß im Pepe Dome: Jonglage, Akrobatik, Handstand und mehr. Ein bunter Mix für Kinder und Jugendliche von 10 bis 15 Jahren — täglich von 10 bis 15 Uhr in den bayerischen Pfingstferien.',
      date: new Date('2026-05-26T10:00:00+02:00'),
      endDate: new Date('2026-06-05T15:00:00+02:00'),
      time: '10:00 – 15:00 Uhr (täglich)',
      location: 'Pepe Dome, Ostpark München',
      category: EventCategory.WORKSHOP,
      price: 'Preis folgt in Kürze',
      imageUrl: '/images/shows/jonas-acrobatics.jpg',
      featured: true,
      highlights: [
        '10 Tage Ferienprogramm (26. Mai – 5. Juni 2026)',
        'Täglich 10–15 Uhr',
        'Für Kinder & Jugendliche von 10–15 Jahren',
        'Jonglage, Akrobatik, Handstand & mehr',
        'Max. 30 Plätze — begrenzt',
        'In Kooperation mit Leopoldini',
      ],
      status: ContentStatus.PUBLISHED,
    },
  })
  console.log(`  ✓ Event: ${event.title} (${event.id})`)

  // ─── Article ────────────────────────────────────────────
  const article = await prisma.article.upsert({
    where: { slug: ARTICLE_SLUG },
    update: {
      title: 'Akrobatik-Ferienkurs by Leopoldini — 10 Tage Zirkuspower in den Pfingstferien',
      excerpt:
        'Vom 26. Mai bis 5. Juni 2026 verwandelt sich der Pepe Dome in ein Ferien-Mitmachcamp für Kinder und Jugendliche von 10 bis 15 Jahren. Täglich 10–15 Uhr, max. 30 Plätze.',
      content: ARTICLE_CONTENT,
      category: 'Ferienkurs',
      author: 'Redaktion Pepe Dome',
      imageUrl: '/images/shows/jonas-acrobatics.jpg',
      tags: ['Ferienkurs', 'Kinder', 'Jugendliche', 'Akrobatik', 'Pfingsten', 'Leopoldini'],
      featured: true,
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date('2026-04-20T09:00:00+02:00'),
    },
    create: {
      slug: ARTICLE_SLUG,
      title: 'Akrobatik-Ferienkurs by Leopoldini — 10 Tage Zirkuspower in den Pfingstferien',
      excerpt:
        'Vom 26. Mai bis 5. Juni 2026 verwandelt sich der Pepe Dome in ein Ferien-Mitmachcamp für Kinder und Jugendliche von 10 bis 15 Jahren. Täglich 10–15 Uhr, max. 30 Plätze.',
      content: ARTICLE_CONTENT,
      category: 'Ferienkurs',
      author: 'Redaktion Pepe Dome',
      imageUrl: '/images/shows/jonas-acrobatics.jpg',
      tags: ['Ferienkurs', 'Kinder', 'Jugendliche', 'Akrobatik', 'Pfingsten', 'Leopoldini'],
      featured: true,
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date('2026-04-20T09:00:00+02:00'),
    },
  })
  console.log(`  ✓ Article: ${article.title} (${article.id})`)

  // ─── Link Article ↔ Event ───────────────────────────────
  await prisma.articleEvent.upsert({
    where: {
      articleId_eventId: {
        articleId: article.id,
        eventId: event.id,
      },
    },
    update: {},
    create: {
      articleId: article.id,
      eventId: event.id,
    },
  })
  console.log('  ✓ Article ↔ Event verknüpft')

  console.log('\n✅ Fertig — Ferienkurs ist in der DB.')
}

main()
  .catch((e) => {
    console.error('❌ Fehler:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
