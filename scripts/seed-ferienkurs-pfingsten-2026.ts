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

const ARTICLE_CONTENT = `In den bayerischen Pfingstferien 2026 bringt der Circus Leopoldini den großen Ferienspaß in den Pepe Dome München Ostpark. Vier Tage lang erlernst du täglich von 10 bis 16 Uhr Zirkuskünste bei erfahrenen Leopoldini Coaches.

**Zeitraum:** 26. bis 29. Mai 2026
**Uhrzeit:** täglich von 10:00 bis 16:00 Uhr
**Kostenbeitrag:** 160€
**Ort:** Pepe Dome, Ostpark München

**Was euch erwartet:**
Ein bunter Mix aus verschiedenen Zirkusdisziplinen — von den ersten Handständen über Jonglier-Grundlagen bis hin zu Partner- und Bodenakrobatik. Die Teilnehmer:innen lernen spielerisch Körperkontrolle, Koordination, Kraft und Kreativität. Ohne Leistungsdruck, mit viel Spaß und kleinen Erfolgserlebnissen — angeleitet von erfahrenen Leopoldini Coaches.

**Inhalte im Überblick:**
- Jonglage-Grundlagen (Bälle, Tücher, Keulen)
- Akrobatik-Basics (Partner- und Bodenakrobatik)
- Handstand und Balance
- Körperkontrolle & Körperspannung
- Spielerisches Warm-up und Cool-down

**Jetzt vormerken:** Melde dich bei uns, wenn du einen Platz reservieren möchtest — die Plätze sind begrenzt und werden nach Anmeldungseingang vergeben.`

async function main() {
  console.log('→ Seeding Akrobatik-Ferienkurs Pfingsten 2026…')

  // ─── Event ──────────────────────────────────────────────
  const event = await prisma.event.upsert({
    where: { slug: EVENT_SLUG },
    update: {
      title: 'Holi Poldini — Ferienkurs by Leopoldini',
      subtitle: 'Ferienkurs Pfingsten 2026 · 4 Tage Zirkusabenteuer',
      description:
        'Ferienspaß mit dem Circus Leopoldini im Pepe Dome München Ostpark: täglich von 10 bis 16 Uhr Zirkuskünste bei erfahrenen Leopoldini Coaches. Vier Tage Akrobatik, Jonglage, Handstand und Zirkus pur in den bayerischen Pfingstferien.',
      date: new Date('2026-05-26T10:00:00+02:00'),
      endDate: new Date('2026-05-29T16:00:00+02:00'),
      time: '10:00 – 16:00 Uhr (täglich)',
      location: 'Pepe Dome, Ostpark München',
      category: EventCategory.WORKSHOP,
      price: 'Kostenbeitrag 160€',
      imageUrl: 'https://wwawsyhykrbvfgvhqbev.supabase.co/storage/v1/object/public/uploads/holi-poldini-2026.png',
      featured: true,
      highlights: [
        '4 Tage Ferienprogramm (26. – 29. Mai 2026)',
        'Täglich 10 – 16 Uhr',
        'Kostenbeitrag 160€',
        'Akrobatik, Jonglage, Handstand & mehr',
        'Erfahrene Leopoldini Coaches',
        'Pepe Dome München Ostpark',
      ],
      status: ContentStatus.PUBLISHED,
    },
    create: {
      slug: EVENT_SLUG,
      title: 'Holi Poldini — Ferienkurs by Leopoldini',
      subtitle: 'Ferienkurs Pfingsten 2026 · 4 Tage Zirkusabenteuer',
      description:
        'Ferienspaß mit dem Circus Leopoldini im Pepe Dome München Ostpark: täglich von 10 bis 16 Uhr Zirkuskünste bei erfahrenen Leopoldini Coaches. Vier Tage Akrobatik, Jonglage, Handstand und Zirkus pur in den bayerischen Pfingstferien.',
      date: new Date('2026-05-26T10:00:00+02:00'),
      endDate: new Date('2026-05-29T16:00:00+02:00'),
      time: '10:00 – 16:00 Uhr (täglich)',
      location: 'Pepe Dome, Ostpark München',
      category: EventCategory.WORKSHOP,
      price: 'Kostenbeitrag 160€',
      imageUrl: 'https://wwawsyhykrbvfgvhqbev.supabase.co/storage/v1/object/public/uploads/holi-poldini-2026.png',
      featured: true,
      highlights: [
        '4 Tage Ferienprogramm (26. – 29. Mai 2026)',
        'Täglich 10 – 16 Uhr',
        'Kostenbeitrag 160€',
        'Akrobatik, Jonglage, Handstand & mehr',
        'Erfahrene Leopoldini Coaches',
        'Pepe Dome München Ostpark',
      ],
      status: ContentStatus.PUBLISHED,
    },
  })
  console.log(`  ✓ Event: ${event.title} (${event.id})`)

  // ─── Article ────────────────────────────────────────────
  const article = await prisma.article.upsert({
    where: { slug: ARTICLE_SLUG },
    update: {
      title: 'Holi Poldini — Ferienspaß mit dem Circus Leopoldini im Pepe Dome',
      excerpt:
        'Vom 26. bis 29. Mai 2026 verwandelt sich der Pepe Dome in ein Ferien-Mitmachcamp mit dem Circus Leopoldini. Täglich 10 – 16 Uhr, Kostenbeitrag 160€.',
      content: ARTICLE_CONTENT,
      category: 'Ferienkurs',
      author: 'Redaktion Pepe Dome',
      imageUrl: 'https://wwawsyhykrbvfgvhqbev.supabase.co/storage/v1/object/public/uploads/holi-poldini-2026.png',
      tags: ['Ferienkurs', 'Kinder', 'Jugendliche', 'Akrobatik', 'Pfingsten', 'Leopoldini', 'Holi Poldini'],
      featured: true,
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date('2026-04-20T09:00:00+02:00'),
    },
    create: {
      slug: ARTICLE_SLUG,
      title: 'Holi Poldini — Ferienspaß mit dem Circus Leopoldini im Pepe Dome',
      excerpt:
        'Vom 26. bis 29. Mai 2026 verwandelt sich der Pepe Dome in ein Ferien-Mitmachcamp mit dem Circus Leopoldini. Täglich 10 – 16 Uhr, Kostenbeitrag 160€.',
      content: ARTICLE_CONTENT,
      category: 'Ferienkurs',
      author: 'Redaktion Pepe Dome',
      imageUrl: 'https://wwawsyhykrbvfgvhqbev.supabase.co/storage/v1/object/public/uploads/holi-poldini-2026.png',
      tags: ['Ferienkurs', 'Kinder', 'Jugendliche', 'Akrobatik', 'Pfingsten', 'Leopoldini', 'Holi Poldini'],
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
