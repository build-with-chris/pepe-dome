/**
 * Einmalige Übernahme des Kursprogramms aus src/data/training-data.ts in die
 * Datenbank.
 *
 * Idempotent: arbeitet per upsert über den Slug. Mehrfach laufen lassen legt
 * keine Dubletten an. Die Slots werden bei jedem Lauf ersetzt, nicht ergänzt,
 * sonst verdoppeln sie sich.
 *
 * Die Slugs sind bewusst dieselben wie vorher im Code. An ihnen hängen
 * geteilte Links (?kurs=<slug>), die nicht brechen dürfen.
 *
 * Lauf:
 *   npx tsx scripts/seed-courses.ts
 */

import { PrismaClient, ContentStatus, CourseTarget } from '@prisma/client'

const prisma = new PrismaClient()

type SeedSlot = { weekday: number; startTime: string; endTime: string }

type SeedCourse = {
  slug: string
  title: string
  sub: string | null
  description: string
  inhalte: string[]
  alter: string | null
  fuerWen: string
  target: CourseTarget
  trainer: string
  bookingUrl?: string
  bookingLabel?: string
  bookingNote?: string
  status: ContentStatus
  sortOrder: number
  slots: SeedSlot[]
}

const AIRCRO_BOOKING = {
  // Neue Adresse seit 28.07.2026, vorher aircrobatic-studios.com.
  bookingUrl: 'https://aircrobaticstudios.de/',
  bookingLabel: 'Bei Aircrobatic Studios buchen',
  bookingNote:
    'Aircrobatics-Kurse werden direkt über Aircrobatic Studios gebucht, nicht über Eversports.',
}

const COURSES: SeedCourse[] = [
  {
    // Lief vorher als vier getrennte Eintraege im Code, einer pro Termin.
    // Jetzt ein Kurs mit vier Slots — der Grund fuer die ganze Umstellung.
    slug: 'luftakrobatik-aircrobatics',
    title: 'Luftakrobatik',
    sub: 'Jugendliche · mit Aircrobatics',
    description:
      'Luftakrobatik-Training für Jugendliche, geführt von Aircrobatics. Trapez, Aerial Hoop und Vertikaltuch. Technik, Kraftaufbau und erste Choreografien in der Höhe.',
    inhalte: [
      'Trapez-Grundlagen',
      'Aerial Hoop & Vertikaltuch',
      'Kraft, Beweglichkeit & Körperspannung',
      'Erste Figuren und Sequenzen',
    ],
    alter: 'Für Jugendliche',
    fuerWen: 'Jugendliche, alle Levels',
    target: CourseTarget.teens,
    trainer: 'Aircrobatics',
    ...AIRCRO_BOOKING,
    status: ContentStatus.PUBLISHED,
    sortOrder: 10,
    slots: [
      { weekday: 1, startTime: '17:15', endTime: '18:15' },
      { weekday: 1, startTime: '18:15', endTime: '19:15' },
      { weekday: 3, startTime: '17:00', endTime: '18:00' },
      { weekday: 3, startTime: '18:00', endTime: '19:00' },
    ],
  },
  {
    slug: 'capoeira-kinder-di',
    title: 'Kinder-Capoeira',
    sub: '3 bis 6 Jahre · Schnupperkurs + 4er-Kurs · mit Dayela',
    description:
      'Mit Elementen aus dem brasilianischen Kampftanz Capoeira lernen die Kinder spielerisch, sich mit Rhythmus und Musik in Tierbewegungen zu bewegen: Als Löwe, Spinne, Frosch und Zebra, und mit Purzelbaum, Rad und Handstand werden Motorik und Koordination der Kinder gefördert. Mit einfachen Perkussionsinstrumenten aus Brasilien (Handtrommel, Reco-Reco und Agogô) wird außerdem das Rhythmusgefühl gestärkt. Die Kinder werden animiert, sich selbst zu entdecken und Spaß an der Bewegung zu haben.',
    inhalte: [
      'Tierbewegungen: Löwe, Spinne, Frosch, Zebra',
      'Purzelbaum, Rad und Handstand',
      'Motorik & Koordination spielerisch fördern',
      'Rhythmusgefühl mit Handtrommel, Reco-Reco & Agogô',
      'Bitte mitbringen: Turnschlappen oder Stoppersocken, turnbare Klamotten (keine Jeans, Röcke, Kleider) und etwas zu trinken',
    ],
    alter: 'Für Kinder von 3 bis 6',
    fuerWen:
      'Kinder 3 bis 6 Jahre · Einstieg jederzeit möglich. Schnupperstunde unverbindlich, aktuelle Termine und Anmeldung über Eversports.',
    target: CourseTarget.kinder,
    trainer: 'Dayela',
    status: ContentStatus.PUBLISHED,
    sortOrder: 20,
    slots: [{ weekday: 2, startTime: '16:15', endTime: '17:15' }],
  },
  {
    slug: 'capoeira-erwachsene-di',
    title: 'Capoeira Workout',
    sub: 'Erwachsene · Schnupperkurs + 4er-Kurs · mit Dayela',
    description:
      'Powerstyling mit Capoeira-Elementen ist ein intensives und spielerisches Ganzkörpertraining: Balance, Kraft, Koordination und Soft-Akrobatik Skills werden in „Animal Flow"-artigen Sequenzen zu grooviger Musik trainiert und neue Bewegungsmöglichkeiten exploriert. Zum Schluss wird das Gelernte im typischen Capoeira-Spielflow umgesetzt. Ein schweißtreibender Spaß für alle.',
    inhalte: [
      'Balance, Kraft & Koordination',
      'Soft-Akrobatik Skills',
      '„Animal Flow"-artige Sequenzen zu grooviger Musik',
      'Capoeira-Spielflow am Ende der Stunde',
    ],
    alter: 'Für Erwachsene, alle Level',
    fuerWen:
      'Erwachsene, alle Levels · Einstieg jederzeit möglich. Schnupperstunde unverbindlich, aktuelle Termine und Anmeldung über Eversports.',
    target: CourseTarget.erwachsene,
    trainer: 'Dayela',
    status: ContentStatus.PUBLISHED,
    sortOrder: 30,
    slots: [{ weekday: 2, startTime: '17:30', endTime: '19:00' }],
  },
  {
    slug: 'kinder-akrobatik-mi',
    title: 'Kinder Akrobatik',
    sub: '5 bis 12 Jahre · mit Michael',
    description:
      'Spielerische Akrobatik für Kinder mit Michael. Luftakrobatik, Tellerdrehen, Jonglieren und alles, worauf die Kids gerade Lust haben. Eine Stunde voller Bewegung, Kreativität und Spaß.',
    inhalte: [
      'Luftakrobatik (kindgerecht)',
      'Tellerdrehen',
      'Jonglieren',
      'Spielerische Bodenakrobatik',
      'Freie Wahl je nach Lust der Gruppe',
    ],
    alter: 'Für Kinder von 5 bis 12',
    fuerWen: 'Kinder 5 bis 12 Jahre',
    target: CourseTarget.kinder,
    trainer: 'Michael',
    status: ContentStatus.PUBLISHED,
    sortOrder: 40,
    slots: [{ weekday: 3, startTime: '16:30', endTime: '18:00' }],
  },
  {
    slug: 'urban-acrobatics-fr',
    title: 'Urban Acrobatics',
    sub: 'Breaking meets Akrobatik · Jugendliche & Erwachsene',
    description:
      'Ein dynamischer Kurs an der Schnittstelle von Breaking und Akrobatik, mit Fokus auf Körperkontrolle, Kraft und fließende Bewegungsabläufe. Breaking-Elemente werden neu interpretiert und in einen rein akrobatischen Kontext übertragen.',
    inhalte: ['Balance', 'Kraft', 'Dynamik', 'Körperkontrolle', 'Flows'],
    alter: 'Für Jugendliche und Erwachsene',
    fuerWen: 'Jugendliche und Erwachsene, Anfänger bis Fortgeschrittene',
    target: CourseTarget.erwachsene,
    trainer: 'Dani',
    status: ContentStatus.PUBLISHED,
    sortOrder: 50,
    slots: [{ weekday: 5, startTime: '15:30', endTime: '17:00' }],
  },

  // ── Pausiert (Stand 28.07.2026) ─────────────────────────────────────────
  // Kommen als ARCHIVED rein: nicht auf der Website, im Admin vollständig
  // erhalten und mit einem Klick zurückholbar.
  {
    slug: 'cyr-wheel-fr',
    title: 'Cyr Wheel',
    sub: 'Jugendliche & Erwachsene · an showfreien Freitagen',
    description:
      'Das Cyr Wheel, auch Deutsches Rad genannt, gehört zu den spektakulärsten Disziplinen des zeitgenössischen Zirkus. In diesem Kurs lernst du Grundtechniken wie Wave, Pirouette und Coin, baust Körpergefühl auf und entwickelst eigene Bewegungsabläufe im Rad. Findet an Freitagen ohne Show statt, aktuelle Termine immer auf der Startseite.',
    inhalte: [
      'Cyr Wheel Grundtechniken (Wave, Pirouette, Coin)',
      'Körperspannung & Balance im Rad',
      'Kraft- und Konditionsaufbau',
      'Erste Sequenzen und Übergänge',
    ],
    alter: 'Für Jugendliche und Erwachsene',
    fuerWen: 'Jugendliche & Erwachsene · Einsteiger:innen willkommen',
    target: CourseTarget.erwachsene,
    trainer: 'Chris',
    status: ContentStatus.ARCHIVED,
    sortOrder: 60,
    slots: [{ weekday: 5, startTime: '17:00', endTime: '18:30' }],
  },
  {
    slug: 'flow-arts-basics-so',
    title: 'Flow Arts Basics',
    sub: 'Buugeng & Doppelstäbe · Tina & Oskar (Feuerinsel)',
    description:
      'Tauche ein in die faszinierende Welt der Flow Arts. Mit Buugeng und Doppelstäben lernst du fließende Bewegungen, die Körpergefühl, Koordination und Kreativität verbinden. Die geschwungenen Formen der Buugeng erzeugen optische Illusionen, die Doppelstäbe bringen rhythmische Dynamik. Schritt für Schritt baust du dir deinen eigenen Flow. Geleitet von Oskar von der Feuerinsel München, mit dem Ziel, den FlowArts-Nachwuchs zu fördern und individuell auf alle Levels einzugehen.',
    inhalte: [
      'Buugeng: Grundlagen & Bewegungsprinzipien',
      'Drehen mit Händen & Fingern, Ebenen & Symmetrie',
      'Doppelstäbe: gleichzeitige & versetzte Bewegungen',
      'Erste Trick-Kombinationen, Würfe & Fishtails',
      'Koordination, Kontrolle & Körperwahrnehmung',
      'Fokus auf Flow, Timing & Illusionseffekte',
    ],
    alter: 'Für Erwachsene, Anfänger:innen willkommen',
    fuerWen:
      'Anfänger:innen willkommen, mehr Erfahrung kein Problem, individuelle Begleitung möglich',
    target: CourseTarget.erwachsene,
    trainer: 'Tina & Oskar (Feuerinsel München)',
    status: ContentStatus.ARCHIVED,
    sortOrder: 70,
    slots: [{ weekday: 7, startTime: '17:00', endTime: '18:00' }],
  },
  {
    slug: 'dynamic-flow-so',
    title: 'Dynamic Flow',
    sub: 'Levistick (Long String) & Rope Dart · Tina & Oskar (Feuerinsel)',
    description:
      'Zwei besonders faszinierende Flow-Tools: Der Levistick, der mit langer Schnur (Long String) scheinbar schwerelos schwebt, und der Rope Dart, der durch kraftvolle, kreisende Bewegungen beeindruckt. Du lernst grundlegende Techniken, erste Tricks und Übergänge und entwickelst ein Gefühl für Timing, Kontrolle und Flow. Geleitet von Oskar von der Feuerinsel München, der den FlowArts-Nachwuchs gezielt fördert und gerne individuell auf jede:n eingeht.',
    inhalte: [
      'Levistick mit Long String: Setups & Schnurkonfigurationen',
      'Übergänge zwischen Tricks, Illusionen & visuelle Täuschungen',
      'Körperhaltung, Rhythmus & Präsentation',
      'Rope Dart: Basis-Schwünge & Wicklungen (Wraps)',
      'Richtungswechsel, Footwork & Körperposition',
      'Erste einfache Tricks & Kombos',
    ],
    alter: 'Für Erwachsene, Anfänger:innen willkommen',
    fuerWen:
      'Anfänger:innen willkommen, mehr Erfahrung kein Problem, individuelle Begleitung möglich',
    target: CourseTarget.erwachsene,
    trainer: 'Tina & Oskar (Feuerinsel München)',
    status: ContentStatus.ARCHIVED,
    sortOrder: 80,
    slots: [{ weekday: 7, startTime: '18:00', endTime: '19:00' }],
  },
]

/** Die Tageshinweise, die vorher als `note` am Wochentag im Code standen. */
const NOTES: { weekday: number; text: string }[] = [
  { weekday: 4, text: 'Tricking & Breaking in Planung, Termine folgen.' },
  { weekday: 6, text: 'In Planung, Workshops & Vermietung folgen' },
  { weekday: 7, text: 'Aktuell keine Kurse, neue Termine folgen.' },
]

async function main() {
  for (const course of COURSES) {
    const { slots, ...felder } = course

    const saved = await prisma.course.upsert({
      where: { slug: course.slug },
      create: { ...felder, inhalte: felder.inhalte },
      update: { ...felder, inhalte: felder.inhalte },
    })

    // Slots ersetzen statt ergaenzen, sonst verdoppeln sie sich beim zweiten Lauf.
    await prisma.courseSlot.deleteMany({ where: { courseId: saved.id } })
    await prisma.courseSlot.createMany({
      data: slots.map((slot) => ({ ...slot, courseId: saved.id })),
    })

    console.log(
      `  ${course.status === 'PUBLISHED' ? '✓' : '⏸'} ${course.title} (${slots.length} Termin${slots.length === 1 ? '' : 'e'})`
    )
  }

  for (const note of NOTES) {
    await prisma.scheduleNote.upsert({
      where: { weekday: note.weekday },
      create: note,
      update: { text: note.text },
    })
  }

  const [aktiv, pausiert, slots, notes] = await Promise.all([
    prisma.course.count({ where: { status: ContentStatus.PUBLISHED } }),
    prisma.course.count({ where: { status: ContentStatus.ARCHIVED } }),
    prisma.courseSlot.count(),
    prisma.scheduleNote.count(),
  ])
  console.log(
    `\n${aktiv} aktive Kurse, ${pausiert} pausiert, ${slots} Termine, ${notes} Tageshinweise.`
  )
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
