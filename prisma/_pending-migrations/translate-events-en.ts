/**
 * Translate-Seed: schreibt englische Übersetzungen in die Event- und
 * Article-Tabellen (Spalten title_en / subtitle_en / description_en /
 * location_en / price_en / highlights_en bzw. excerpt_en / content_en).
 *
 * Idempotent — kann beliebig oft laufen. Nur Felder die der Map kennt
 * werden geschrieben; nicht gemappte Events bleiben unverändert.
 *
 * Voraussetzung: SQL-Migration
 *   prisma/migrations/20260512130219_add_event_article_translations_en/
 *   muss applied sein (npx prisma migrate deploy).
 *
 * Run:
 *   npx tsx scripts/translate-events-en.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ── Event-Übersetzungen (geschlüsselt nach slug) ──────────────────────────
//
// Slugs entsprechen den aktuellen DB-Werten — bei Slug-Änderung hier
// nachziehen oder per `prisma.event.findMany()` neu auslesen.

const EVENT_EN: Record<string, {
  title?: string
  subtitle?: string | null
  description?: string
  location?: string
  price?: string | null
  highlights?: string[]
}> = {

  'akrobatik-ferienkurs-pfingsten-2026': {
    title: 'Holi Poldini — Holiday Course by Leopoldini',
    subtitle: 'Pentecost holiday course 2026 · 4 days of circus adventure',
    description:
      'Holiday fun with Circus Leopoldini at Pepe Dome Munich Ostpark: daily 10 AM – 4 PM, circus skills with experienced Leopoldini coaches. Four days of acrobatics, juggling, handstand and pure circus during the Bavarian Pentecost holidays.',
    location: 'Pepe Dome, Ostpark Munich',
    price: 'Course fee €160',
    highlights: [
      '4-day holiday programme (26 – 29 May 2026)',
      'Daily 10 AM – 4 PM',
      'Course fee €160',
      'Acrobatics, juggling, handstand & more',
      'Experienced Leopoldini coaches',
      'Pepe Dome Munich Ostpark',
    ],
  },

  // — Listing-Events aus der laufenden Saison —————————————————————

  'open-stage-variet-im-dome': {
    title: 'Open Stage — Expect Everything',
    subtitle: 'A stage for emerging talent',
    description:
      'A free-form variety stage at Pepe Dome — emerging artists from Munich and beyond present short acts: circus, music, spoken word, magic. Open-minded, surprising, alive.',
    location: 'Pepe Dome, Ostpark Munich',
    price: 'from €7',
  },

  'tornado-s-eye': {
    title: "Tornado's Eye",
    subtitle: 'by David Eisele',
    description:
      'Solo work by David Eisele — contemporary circus that puts the body at the centre of a vortex of motion. Doors 7:30 PM, show starts at 8 PM.',
    location: 'Pepe Dome, Ostpark Munich',
    price: 'from €12',
  },
  'tornado-s-eye-1775119243066': {
    title: "Tornado's Eye",
    subtitle: 'by David Eisele',
    description:
      'Solo work by David Eisele — contemporary circus that puts the body at the centre of a vortex of motion. Doors 7:30 PM, show starts at 8 PM.',
    location: 'Pepe Dome, Ostpark Munich',
    price: 'from €12',
  },

  'circus-poetry-1775292452264': {
    title: 'Circus & Poetry',
    subtitle: null,
    description:
      'Words meet acrobatics: an evening where contemporary circus and spoken word play in dialogue. Crafted by a Munich ensemble.',
    location: 'Pepe Dome, Ostpark Munich',
    price: 'from €12',
  },
  'circus-poetry-1775292501485': {
    title: 'Circus & Poetry',
    subtitle: null,
    description:
      'Words meet acrobatics: an evening where contemporary circus and spoken word play in dialogue. Crafted by a Munich ensemble.',
    location: 'Pepe Dome, Ostpark Munich',
    price: 'from €12',
  },

  'outta-space-party-service': {
    title: 'Outta Space — Party Service',
    subtitle: 'Open Jam',
    description:
      'Open jam weekend: from 3 PM onwards the dome turns into a moving playground — circus, dance, music, encounters. Bring your moves.',
    location: 'Pepe Dome, Ostpark Munich',
    price: '€5',
  },

  'gefahr-solo-von-max-heckl': {
    title: 'Gefahr — solo by Max Heckl',
    subtitle: 'Where artistry meets comedy',
    description:
      'Danger — a topic that keeps showing up: on stage, in the audience, in everyday life. A year of research turns into a brand-new circus solo by Max Heckl, mixing artistry, comedy and contemporary staging.',
    location: 'Pepe Dome, Ostpark Munich',
    price: 'from €6',
  },
  'gefahr-solo-von-max-heckl-1777276164307': {
    title: 'Gefahr — solo by Max Heckl',
    subtitle: 'Where artistry meets comedy',
    description:
      'Danger — a topic that keeps showing up: on stage, in the audience, in everyday life. A year of research turns into a brand-new circus solo by Max Heckl, mixing artistry, comedy and contemporary staging.',
    location: 'Pepe Dome, Ostpark Munich',
    price: 'from €6',
  },

  'clown-show-1775291026732': {
    title: 'Clown Show — The Suitcase of Wonders',
    subtitle: 'A clown show for the whole family',
    description:
      'Family clown show with a suitcase full of magic, music and small wonders. Approachable for kids and adults alike.',
    location: 'Pepe Dome, Ostpark Munich',
    price: 'from €6',
  },

  'cyr-lass-uns-zusammen-am-rad-drehen-1775291956748': {
    title: 'Cyr — Let’s Spin Together',
    subtitle: 'A workshop in two parts: find your flow inside the wheel',
    description:
      'Two-part Cyr Wheel workshop: introduction to balance and basics, then deeper exploration of flow and movement inside the wheel.',
    location: 'Pepe Dome, Ostpark Munich',
    price: '45',
  },
  'cyr-lass-uns-zusammen-am-rad-drehen': {
    title: 'Cyr — Let’s Spin Together',
    subtitle: 'A workshop in two parts: find your flow inside the wheel',
    description:
      'Two-part Cyr Wheel workshop: introduction to balance and basics, then deeper exploration of flow and movement inside the wheel.',
    location: 'Pepe Dome, Ostpark Munich',
    price: '45',
  },
}

// ── Article-Übersetzungen ────────────────────────────────────────────────

const ARTICLE_EN: Record<string, {
  title?: string
  excerpt?: string
  content?: string
}> = {
  'akrobatik-ferienkurs-pfingsten-2026': {
    title: 'Holi Poldini — Holiday fun with Circus Leopoldini at Pepe Dome',
    excerpt:
      'From 26 to 29 May 2026 Pepe Dome turns into a holiday circus camp with Circus Leopoldini. Daily 10 AM – 4 PM, course fee €160.',
    content:
      `During the Bavarian Pentecost holidays 2026 Circus Leopoldini brings the big holiday joy into Pepe Dome Munich Ostpark. For four days you'll learn circus arts daily from 10 AM to 4 PM with experienced Leopoldini coaches.

**Period:** 26 – 29 May 2026
**Time:** daily 10 AM – 4 PM
**Course fee:** €160
**Venue:** Pepe Dome, Ostpark Munich

**What to expect:**
A colourful mix of circus disciplines — from first handstands to juggling basics to partner and floor acrobatics. Participants learn body control, coordination, strength and creativity in a playful way. No performance pressure, lots of fun and small wins along the way — guided by experienced Leopoldini coaches.

**Programme overview:**
- Juggling basics (balls, scarves, clubs)
- Acrobatics basics (partner & floor)
- Handstand and balance
- Body control & engagement
- Playful warm-up and cool-down

**Save your spot:** Get in touch if you'd like to register — places are limited and allocated on a first-come basis.`,
  },
}

// ── Runner ───────────────────────────────────────────────────────────────

async function main() {
  console.log('→ Translating events…')
  let eventOk = 0
  let eventSkip = 0
  for (const [slug, en] of Object.entries(EVENT_EN)) {
    const existing = await prisma.event.findUnique({ where: { slug } })
    if (!existing) {
      console.log(`  · ${slug} → not found, skipping`)
      eventSkip++
      continue
    }
    await prisma.event.update({
      where: { slug },
      data: {
        titleEn:       en.title       ?? undefined,
        subtitleEn:    en.subtitle    ?? undefined,
        descriptionEn: en.description ?? undefined,
        locationEn:    en.location    ?? undefined,
        priceEn:       en.price       ?? undefined,
        highlightsEn:  en.highlights  ?? undefined,
      },
    })
    console.log(`  ✓ ${slug} updated`)
    eventOk++
  }
  console.log(`Events: ${eventOk} updated, ${eventSkip} skipped`)

  console.log('\n→ Translating articles…')
  let articleOk = 0
  let articleSkip = 0
  for (const [slug, en] of Object.entries(ARTICLE_EN)) {
    const existing = await prisma.article.findUnique({ where: { slug } })
    if (!existing) {
      console.log(`  · ${slug} → not found, skipping`)
      articleSkip++
      continue
    }
    await prisma.article.update({
      where: { slug },
      data: {
        titleEn:   en.title   ?? undefined,
        excerptEn: en.excerpt ?? undefined,
        contentEn: en.content ?? undefined,
      },
    })
    console.log(`  ✓ ${slug} updated`)
    articleOk++
  }
  console.log(`Articles: ${articleOk} updated, ${articleSkip} skipped`)

  console.log('\n✅ Done.')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
