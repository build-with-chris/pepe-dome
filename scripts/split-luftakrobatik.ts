/**
 * Luftakrobatik in zwei Kurse trennen.
 *
 * Ausgangslage: ein Kurs `luftakrobatik-aircrobatics` mit target `teens` und
 * vier Terminen. Tatsächlich ist an beiden Tagen der frühe Termin der
 * Bambini-Kurs (4 bis 7 Jahre) und der späte der für Jugendliche. Der Filter
 * auf der Trainingsseite arbeitet pro Kurs, nicht pro Termin, deshalb war
 * Luftakrobatik unter „Kinder" gar nicht zu finden.
 *
 * Danach:
 *   luftakrobatik-aircrobatics-bambinis  kinder  Mo 17:15, Mi 17:00
 *   luftakrobatik-aircrobatics           teens   Mo 18:15, Mi 18:00
 *
 * Lauf:
 *   npx tsx scripts/split-luftakrobatik.ts --dry     nur zeigen, nichts ändern
 *   npx tsx scripts/split-luftakrobatik.ts           anwenden
 *
 * Vor jeder Änderung schreibt das Skript den Ist-Zustand beider Kurse samt
 * Terminen nach .backup-luftakrobatik-<zeit>.json. Der Ordner ist ignoriert.
 * Damit lässt sich der alte Stand von Hand wiederherstellen, falls etwas an
 * der Aufteilung doch nicht stimmt.
 *
 * Idempotent: ein zweiter Lauf findet den Zielzustand vor und ändert nichts.
 */

import { PrismaClient, ContentStatus, CourseTarget } from '@prisma/client'
import { writeFile } from 'node:fs/promises'

const prisma = new PrismaClient()

const TEENS = 'luftakrobatik-aircrobatics'
const BAMBINIS = 'luftakrobatik-aircrobatics-bambinis'

/** Die frühen Termine, die zu den Bambinis wandern. */
const BAMBINI_SLOTS = [
  { weekday: 1, startTime: '17:15', endTime: '18:15' },
  { weekday: 3, startTime: '17:00', endTime: '18:00' },
]

/** Die späten Termine, die beim Jugendkurs bleiben. */
const TEENS_SLOTS = [
  { weekday: 1, startTime: '18:15', endTime: '19:15' },
  { weekday: 3, startTime: '18:00', endTime: '19:00' },
]

const DRY = process.argv.includes('--dry')

async function main() {
  const vorher = await prisma.course.findMany({
    where: { slug: { in: [TEENS, BAMBINIS] } },
    include: { slots: { orderBy: [{ weekday: 'asc' }, { startTime: 'asc' }] } },
  })

  const teens = vorher.find((k) => k.slug === TEENS)
  if (!teens) {
    throw new Error(`Kurs ${TEENS} nicht gefunden. Ohne ihn gibt es nichts zu trennen.`)
  }

  console.log('Ist-Zustand:')
  for (const k of vorher) {
    console.log(
      `  ${k.slug}  ${k.target}  ${k.slots
        .map((s) => `${s.weekday}@${s.startTime}`)
        .join(' ')}`
    )
  }

  if (DRY) {
    console.log('\n--dry: es wurde nichts geändert.')
    return
  }

  const stempel = new Date().toISOString().replace(/[:.]/g, '-')
  const backup = `.backup-luftakrobatik-${stempel}.json`
  await writeFile(backup, JSON.stringify(vorher, null, 2), 'utf8')
  console.log(`\nSicherung geschrieben: ${backup}`)

  // Alles in einer Transaktion: entweder stehen hinterher beide Kurse richtig
  // da, oder es bleibt beim alten Stand. Ein halb getrennter Kurs, bei dem die
  // frühen Termine schon weg und die Bambinis noch nicht da sind, würde auf der
  // Website als Lücke im Wochenplan auftauchen.
  await prisma.$transaction(async (tx) => {
    await tx.course.upsert({
      where: { slug: BAMBINIS },
      update: {
        target: CourseTarget.kinder,
        status: ContentStatus.PUBLISHED,
        slots: { deleteMany: {}, create: BAMBINI_SLOTS },
      },
      create: {
        slug: BAMBINIS,
        title: 'Luftakrobatik Bambinis',
        sub: '4 bis 7 Jahre · mit Aircrobatics',
        description:
          'Luftakrobatik für die Kleinen, geführt von Aircrobatics. An Trapez, Reifen und Vertikaltuch klettern, hängen und schaukeln, spielerisch und in kleinen Schritten.',
        inhalte: [
          'Erste Figuren am Trapez',
          'Klettern und Hängen am Vertikaltuch',
          'Schaukeln und Drehen im Reifen',
          'Körpergefühl, Kraft und Mut in der Höhe',
        ],
        alter: 'Für Kinder von 4 bis 7',
        fuerWen: 'Kinder von 4 bis 7 Jahren',
        target: CourseTarget.kinder,
        trainer: teens.trainer,
        // Buchung läuft für beide Kurse über denselben Anbieter.
        bookingUrl: teens.bookingUrl,
        bookingLabel: teens.bookingLabel,
        bookingNote: teens.bookingNote,
        // Ohne Bild: die vorhandenen Fotos zeigen erwachsene Artistinnen.
        images: [],
        status: ContentStatus.PUBLISHED,
        sortOrder: 10,
        slots: { create: BAMBINI_SLOTS },
      },
    })

    await tx.course.update({
      where: { slug: TEENS },
      data: {
        sortOrder: 11,
        slots: { deleteMany: {}, create: TEENS_SLOTS },
      },
    })
  })

  const nachher = await prisma.course.findMany({
    where: { slug: { in: [TEENS, BAMBINIS] } },
    include: { slots: { orderBy: [{ weekday: 'asc' }, { startTime: 'asc' }] } },
    orderBy: { sortOrder: 'asc' },
  })

  console.log('\nNeuer Zustand:')
  for (const k of nachher) {
    console.log(
      `  ${k.slug}  ${k.target}  ${k.slots
        .map((s) => `${s.weekday}@${s.startTime}-${s.endTime}`)
        .join(' ')}`
    )
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
