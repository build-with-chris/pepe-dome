/**
 * Training Page - Zeitgenössischer Zirkus und Artistik
 * Kursprogramm Frühjahr 2026 aus dem offiziellen PDF-Flyer
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import HeroSection from '@/components/custom/HeroSection'
import TrainingsortOverlapImages from '@/components/custom/TrainingsortOverlapImages'
import { Button } from '@/components/ui/Button'
import CourseScheduleGrid, { type Tag } from '@/components/custom/CourseScheduleGrid'

export const metadata: Metadata = {
  title: 'Workshops & Training | Pepe Dome München',
  description:
    'Kursprogramm Frühjahr 2026: Luftartistik, Aerial Silks, Straps, Vertikaltuch, Zirkuskünste, Conditioning und mehr. Kurse für Kinder, Teens und Erwachsene im Pepe Dome München.',
}

// ── Kursprogramm-Daten ────────────────────────────────────────────────────
// Typen & Karten-Komponente leben in CourseScheduleGrid (Client Component),
// damit das Modal mit Anmeldeformular interaktiv werden kann.
// Hier bleibt nur der Inhalt.

const woche: Tag[] = [
  {
    day: 'Montag',
    trainer: 'Rufus (Leopoldini)',
    kurse: [
      {
        slug: 'akrobatik-kids-mo',
        time: '10:00 – 11:00',
        title: 'Akrobatik Kids',
        sub: '10–14 Jahre · mit Rufus (Leopoldini)',
        target: 'kinder',
        trainer: 'Rufus (Leopoldini)',
        day: 'Montag',
        description:
          'Spielerischer Einstieg in die Welt der Akrobatik für Kinder zwischen 10 und 14 Jahren. Von ersten Handständen über Balanceübungen bis zu einfacher Partner- und Bodenakrobatik. Ohne Leistungsdruck, mit viel Spaß — Kraft, Beweglichkeit und Koordination wachsen nebenbei, kleine Erfolgserlebnisse stehen im Mittelpunkt. In Kooperation mit Leopoldini, die bei uns sowohl trainieren als auch unterrichten.',
        inhalte: [
          'Erste Handstände & Balance',
          'Partner- und Bodenakrobatik',
          'Kraft, Beweglichkeit, Koordination',
          'Körpergefühl & Vertrauen aufbauen',
        ],
        fuerWen: 'Kinder 10–14 Jahre — Anfänger:innen und neugierige Kids mit ersten Vorerfahrungen',
      },
      {
        slug: 'akrobatik-basics-mo',
        time: '11:15 – 12:15',
        title: 'Akrobatik Basics',
        sub: 'Jugendliche & junge Erwachsene · mit Rufus (Leopoldini)',
        target: 'teens',
        trainer: 'Rufus (Leopoldini)',
        day: 'Montag',
        description:
          'Für Jugendliche und junge Erwachsene, die die Grundlagen der Akrobatik erlernen oder vertiefen möchten. Handstand, Balance, Körperspannung, erste akrobatische Übergänge — mit Fokus auf saubere Technik und sicherem Aufbau, und Raum zum kreativen Ausprobieren. In Kooperation mit Leopoldini, die bei uns sowohl trainieren als auch unterrichten.',
        inhalte: [
          'Handstand & Körperspannung',
          'Balance-Training',
          'Akrobatische Übergänge',
          'Saubere Technik, sicherer Aufbau',
        ],
        fuerWen: 'Jugendliche & junge Erwachsene — Einsteiger:innen und mit Vorerfahrung',
      },
    ],
  },
  {
    day: 'Dienstag',
    trainer: 'Marlon',
    kurse: [
      {
        slug: 'aerial-silks-intermediate-di',
        time: '18:30 – 19:30',
        title: 'Aerial Silks',
        sub: 'Intermediate',
        target: 'erwachsene',
        trainer: 'Marlon',
        day: 'Dienstag',
        description:
          'Aerial Silks für Fortgeschrittene. Komplexe Klettertechniken, Wraps und saubere Drops — mit Fokus auf Präzision und Sicherheit.',
        inhalte: ['Fortgeschrittene Wraps', 'Kontrollierte Drops', 'Flows und Choreografie-Elemente'],
        fuerWen: 'Erwachsene mit Silks-Erfahrung',
      },
      {
        slug: 'straps-open-level-di',
        time: '19:45 – 21:00',
        title: 'Straps',
        sub: 'Open Level',
        target: 'erwachsene',
        trainer: 'Marlon',
        day: 'Dienstag',
        description:
          'Straps (Strapaten) — die vielleicht anspruchsvollste Luftdisziplin. Kraft, Kontrolle und Körperspannung stehen im Mittelpunkt.',
        inhalte: ['Krafttraining für Straps', 'Grundpositionen & Figuren', 'Individuelle Progression'],
        fuerWen: 'Alle Level — individuelle Einteilung vor Ort',
      },
    ],
  },
  {
    day: 'Mittwoch',
    trainer: 'Dani',
    kurse: [
      {
        slug: 'urban-acrobatics-mi',
        time: '17:00 – 18:30',
        title: 'Urban Acrobatics',
        sub: 'Breaking meets Akrobatik · Jugendliche & Erwachsene',
        target: 'erwachsene',
        trainer: 'Dani',
        day: 'Mittwoch',
        description:
          'Ein dynamischer Kurs an der Schnittstelle von Breaking und Akrobatik — mit Fokus auf Körperkontrolle, Kraft und fließende Bewegungsabläufe. Breaking-Elemente werden neu interpretiert und in einen rein akrobatischen Kontext übertragen.',
        inhalte: ['Balance', 'Kraft', 'Dynamik', 'Körperkontrolle', 'Flows'],
        fuerWen: 'Jugendliche und Erwachsene, Anfänger bis Fortgeschrittene',
      },
    ],
  },
  {
    day: 'Donnerstag',
    trainer: 'Marcel',
    kurse: [
      {
        slug: 'tricking-breaking-do',
        time: 'Zeit folgt',
        title: 'Tricking & Breaking',
        sub: 'ab 14. April',
        target: 'teens',
        trainer: 'Marcel',
        day: 'Donnerstag',
        description:
          'Explosive Sprünge, Kicks und Breakdance-Moves. Tricking und Breaking kombinieren Martial Arts, Turnen und Tanz.',
        inhalte: ['Tricking-Basics (Kicks, Flips)', 'Breaking-Grundlagen', 'Kombinationen & Flows'],
        fuerWen: 'Teens und junge Erwachsene, Einstieg möglich',
      },
    ],
  },
  {
    day: 'Freitag',
    trainer: 'Olesia',
    kurse: [
      {
        slug: 'luftartistik-teens-fr',
        time: '17:30 – 18:30',
        title: 'Luftartistik',
        sub: 'Teens ab 11 J. · Trapez, Ring, Tuch',
        target: 'teens',
        trainer: 'Olesia',
        day: 'Freitag',
        description:
          'Luftartistik für Teens am Freitag — zweite Wocheneinheit für alle, die tiefer einsteigen wollen.',
        inhalte: ['Vertiefung Trapez, Ring, Tuch', 'Ausdruck & Performance', 'Choreografie-Arbeit'],
        fuerWen: 'Teens ab 11 Jahren',
      },
      {
        slug: 'flexibility-fr',
        time: '18:30 – 19:30',
        title: 'Flexibility',
        sub: 'Open Level',
        target: 'erwachsene',
        trainer: 'Olesia',
        day: 'Freitag',
        description:
          'Mobilität und Flexibilität für Artist:innen und alle, die es werden wollen. Aktives und passives Dehnen, Körperkontrolle, saubere Progression.',
        inhalte: ['Hüft- und Rückenmobilität', 'Spagat-Progression', 'Aktive Flexibilität'],
        fuerWen: 'Alle Level — Einsteiger willkommen',
      },
    ],
  },
  {
    day: 'Samstag',
    trainer: '',
    kurse: [],
    note: 'In Planung — Workshops & Vermietung folgen',
  },
  {
    day: 'Sonntag',
    trainer: 'Feuerinsel',
    kurse: [
      {
        slug: 'flow-arts-basics-so',
        time: '16:00 – 17:00',
        title: 'Flow Arts Basics',
        sub: 'Buugeng & Doppelstäbe · mit Feuerinsel',
        target: 'erwachsene',
        trainer: 'Feuerinsel München',
        day: 'Sonntag',
        description:
          'Tauche ein in die faszinierende Welt der Flow Arts. Mit Buugeng und Doppelstäben lernst du fließende Bewegungen, die Körpergefühl, Koordination und Kreativität verbinden. Die geschwungenen Formen der Buugeng erzeugen optische Illusionen, die Doppelstäbe bringen rhythmische Dynamik. Schritt für Schritt baust du dir deinen eigenen Flow. Geleitet von einer erfahrenen Künstlerin der Feuerinsel München.',
        inhalte: [
          'Buugeng-Grundlagen & optische Illusionen',
          'Doppelstäbe-Technik & Rhythmus',
          'Bewegungsabläufe und eigener Flow',
          'Spaß, Ausdruck & gemeinsames Erleben',
        ],
        fuerWen: 'Anfänger:innen und alle, die ihre Grundlagen vertiefen möchten',
      },
      {
        slug: 'dynamic-flow-so',
        time: '17:00 – 18:00',
        title: 'Dynamic Flow',
        sub: 'Levistick & Ropedart · mit Feuerinsel',
        target: 'erwachsene',
        trainer: 'Feuerinsel München',
        day: 'Sonntag',
        description:
          'Zwei besonders faszinierende Flow-Tools: Der Levistick, der scheinbar schwerelos schwebt, und der Ropedart, der durch kraftvolle, kreisende Bewegungen beeindruckt. Du lernst grundlegende Techniken, erste Tricks und Übergänge — und entwickelst ein Gefühl für Timing, Kontrolle und Flow. Geleitet von einer erfahrenen Trainerin der Feuerinsel München.',
        inhalte: [
          'Levistick: Feinmotorik & Illusion',
          'Ropedart: Ganzkörper-Dynamik',
          'Timing, Kontrolle, Flow',
          'Erste Tricks und Übergänge',
        ],
        fuerWen: 'Einsteiger:innen und leicht Fortgeschrittene',
      },
    ],
  },
]

// ── Sonstige Daten ────────────────────────────────────────────────────────

const disciplines = [
  { name: 'Aerial Arts',       description: 'Vertikaltuch, Trapez, Aerial Hoop, Strapaten, Spanish Web', icon: '🎪' },
  { name: 'Ground Arts',       description: 'Handstand, Akrobatik, Kontorsion, Cyr Wheel, Jonglage',     icon: '🤸' },
  { name: 'Movement & Flow',   description: 'Contemporary Dance, Floor Work, Improvisation',             icon: '💃' },
  { name: 'Conditioning',      description: 'Flexibilität, Verletzungsprävention, Kraftaufbau',          icon: '💪' },
]

const pricingNonAerial = [
  { name: 'Schnupperstunde', price: '12€', description: 'Einmalig zum Kennenlernen' },
  { name: 'Einzelstunde',    price: '20€', description: 'Flexibel buchbar' },
  { name: '5er-Karte',       price: '90€', description: '18€ pro Stunde' },
  { name: '10er-Karte',      price: '165€', description: '16,50€ pro Stunde' },
  { name: '20er-Karte',      price: '300€', description: '15€ pro Stunde' },
]

const pricingAerial = [
  { name: 'Einzelstunde', price: '25€', description: 'Flexibel buchbar' },
  { name: '5er-Karte',    price: '120€', description: '24€ pro Stunde' },
  { name: '10er-Karte',   price: '220€', description: '22€ pro Stunde' },
  { name: '20er-Karte',   price: '400€', description: '20€ pro Stunde' },
]

// ═══════════════════════════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════════════════════════

export default function TrainingPage() {
  return (
    <div className="min-h-screen bg-[var(--pepe-black)]">
      {/* Hero Section */}
      <HeroSection
        title="Workshops & Training"
        subtitle="Zeitgenössischer Zirkus und Artistik im Pepe Dome — für alle Levels"
        size="md"
        dotCloudIcon="training"
      />

      {/* Intro Section */}
      <section className="py-20 md:py-32">
        <div className="stage-container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-8">
                Professionelles Training in einzigartiger Atmosphäre
              </h2>
              <p className="text-lg text-[var(--pepe-t80)] mb-8 leading-relaxed">
                Im Pepe Dome bieten wir tägliches Profitraining und strukturierte Kurse für alle
                Erfahrungsstufen. Die geodätische Kuppel mit 8,5 Metern Deckenhöhe bietet optimale
                Bedingungen für Luftakrobatik und Bodenarbeit.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/contact">
                  <Button variant="primary" size="lg">
                    Kontakt aufnehmen
                  </Button>
                </Link>
                <Link href="#kursprogramm">
                  <Button variant="secondary" size="lg">
                    Zum Kursprogramm
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-80 lg:h-[450px] rounded-2xl overflow-hidden bg-[var(--pepe-surface)]">
              <Image
                src="/images/shows/aerial-silk-01.jpg"
                alt="Training im Pepe Dome"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--pepe-black)]/60 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Ferienkurs-Banner */}
      <section className="py-10 md:py-14 border-y border-[var(--pepe-gold)]/30" style={{ background: 'linear-gradient(135deg, rgba(196, 167, 103, 0.12), rgba(1, 109, 202, 0.08) 50%, transparent)' }}>
        <div className="stage-container">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center">
              <div className="flex-shrink-0">
                <span className="inline-block px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-[var(--pepe-gold)] text-black">
                  Neu · Ferienkurs
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-2">
                  Akrobatik-Ferienkurs by Leopoldini
                </h3>
                <p className="text-[var(--pepe-t80)] mb-3 text-base md:text-lg">
                  <strong className="text-[var(--pepe-white)]">26. Mai – 5. Juni 2026</strong> · täglich 10–15 Uhr · für 10–15 Jahre · max. 30 Plätze
                </p>
                <p className="text-[var(--pepe-t64)] mb-5 text-sm md:text-base leading-relaxed">
                  Zwei Wochen Pfingstferien voller Zirkusabenteuer: Jonglieren, Akrobatik,
                  Handstand und mehr — ein bunter Mix, der Kraft, Koordination und Kreativität
                  fördert. Trainer:innen und Preis werden in Kürze ergänzt.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/news/akrobatik-ferienkurs-pfingsten-2026">
                    <Button variant="primary" size="md">
                      Mehr erfahren
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button variant="secondary" size="md">
                      Platz vormerken
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Training unter der Woche Section */}
      <section className="py-12 md:py-16 bg-[var(--pepe-black)]">
        <div className="stage-container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-6 text-center">
              Unter der Woche ist der Schwerpunkt auf Training:
            </h2>
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-10 shadow-xl">
              <div className="space-y-6 text-[var(--pepe-t80)] leading-relaxed text-lg">
                <div className="flex items-start gap-4">
                  <span className="text-[var(--pepe-gold)] text-xl mt-1">☀️</span>
                  <div>
                    <p className="font-semibold text-[var(--pepe-white)] mb-2">Untertags</p>
                    <p>Für die Profi Community der Münchner Artisten (gefördert durch das Kulturreferat)</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-[var(--pepe-gold)] text-xl mt-1">🌙</span>
                  <div>
                    <p className="font-semibold text-[var(--pepe-white)] mb-2">Abends und nachmittags</p>
                    <p>Sind bezahlte Kurse für Kinder, Jugendliche und Erwachsene Hobby Artisten.</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-[var(--pepe-line)]">
                  <p className="text-[var(--pepe-gold)] font-semibold mb-4">Freut euch auf die kommende Saison</p>
                  <p>In den bayerischen Ferien bieten wir den Raum für Residencies und Kinderferien Mitmachprogramme an.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* KURSPROGRAMM FRÜHJAHR 2026                                      */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <section id="kursprogramm" className="py-20 md:py-32">
        <div className="stage-container">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="inline-block px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest bg-[var(--pepe-gold)]/20 text-[var(--pepe-gold)] border border-[var(--pepe-gold)]/40 mb-6">
              Kursprogramm
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-[var(--pepe-white)] mb-4">
              Frühjahr 2026
            </h2>
            <p className="text-[var(--pepe-t64)] text-lg max-w-2xl mx-auto">
              Stand der Dinge — Programm wächst laufend. Kurse für Kinder, Teens und Erwachsene,
              angeleitet von erfahrenen Trainer:innen.
            </p>
          </div>

          {/* Hinweis: ab Mai buchbar */}
          <div className="max-w-2xl mx-auto mb-14">
            <div className="flex items-start gap-4 px-6 py-5 rounded-2xl bg-[var(--pepe-ink)] border border-[var(--pepe-line)]">
              <span className="text-2xl mt-0.5">&#128197;</span>
              <div>
                <p className="text-[var(--pepe-white)] font-bold mb-1">Buchbar ab Mai 2026</p>
                <p className="text-[var(--pepe-t64)] text-sm leading-relaxed">
                  Das Kursprogramm steht, die Anmeldung öffnet in Kürze.
                  Schon jetzt könnt ihr euch einen Überblick über Zeiten, Disziplinen und Trainer:innen verschaffen.
                </p>
              </div>
            </div>
          </div>

          {/* Legende */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="flex items-center gap-2.5 text-sm text-[var(--pepe-t80)]">
              <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: '#c4a767' }} />
              Kinder
            </div>
            <div className="flex items-center gap-2.5 text-sm text-[var(--pepe-t80)]">
              <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: '#f59e0b' }} />
              Teens
            </div>
            <div className="flex items-center gap-2.5 text-sm text-[var(--pepe-t80)]">
              <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: '#38bdf8' }} />
              Erwachsene
            </div>
          </div>

          {/* ── Wochenplan: klickbare Kurse mit Detail-Modal ───────── */}
          <CourseScheduleGrid woche={woche} />

          {/* CTA */}
          <div className="text-center mt-14">
            <p className="text-[var(--pepe-t64)] mb-6">
              Fragen zum Kursprogramm? Wir beraten dich gerne.
            </p>
            <Link href="/contact">
              <Button variant="primary" size="lg">
                Kontakt aufnehmen
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Profitraining */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-[var(--pepe-black)] to-[var(--pepe-ink)]">
        <div className="stage-container">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold bg-[var(--pepe-gold)]/20 text-[var(--pepe-gold)] border border-[var(--pepe-gold)]/40 mb-8">
              Täglich 10:00 - 14:00 Uhr
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-5">
              Profitraining
            </h2>
            <p className="text-[var(--pepe-t80)] text-lg">
              Für professionelle Artist:innen und fortgeschrittene Trainer:innen.
              Gemeinsames Training, kreativer Austausch und kollaborative Übungen
              in der inspirierenden Dome-Atmosphäre.
            </p>
          </div>
        </div>
      </section>

      {/* Disciplines */}
      <section className="py-20 md:py-32">
        <div className="stage-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-6">
              Unsere Disziplinen
            </h2>
            <p className="text-lg text-[var(--pepe-t64)] max-w-2xl mx-auto leading-relaxed">
              Von Luftakrobatik bis Bodenarbeit — entdecke die Vielfalt zeitgenössischer Zirkuskunst.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {disciplines.map((discipline, index) => (
              <div
                key={index}
                className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-6 md:p-8 text-center hover:border-[var(--pepe-gold)] hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(0,0,0,0.35),0_0_8px_var(--pepe-gold-glow)] transition-all duration-300 ease-out"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--pepe-gold)]/10 flex items-center justify-center">
                  <span className="text-3xl">{discipline.icon}</span>
                </div>
                <h3 className="text-lg font-bold text-[var(--pepe-white)] mb-4">
                  {discipline.name}
                </h3>
                <p className="text-[var(--pepe-t64)] leading-relaxed">
                  {discipline.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 md:py-32 bg-[var(--pepe-ink)]">
        <div className="stage-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-6">
              Preise
            </h2>
            <p className="text-lg text-[var(--pepe-t64)] max-w-2xl mx-auto leading-relaxed">
              Flexible Optionen für jeden Trainingsbedarf — von der Schnupperstunde bis zur 20er-Karte.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Non-Aerial Pricing */}
            <div className="bg-[var(--pepe-surface)] border border-[var(--pepe-line)] rounded-2xl p-6 md:p-8">
              <h3 className="text-xl font-bold text-[var(--pepe-white)] mb-10 text-center">
                Boden-Kurse
              </h3>
              <div className="space-y-5">
                {pricingNonAerial.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-5 border-b border-[var(--pepe-line)] last:border-0"
                  >
                    <div>
                      <p className="text-[var(--pepe-white)] font-medium">{item.name}</p>
                      <p className="text-[var(--pepe-t48)] text-sm mt-2">{item.description}</p>
                    </div>
                    <span className="text-[var(--pepe-gold)] font-bold text-lg ml-4">{item.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Aerial Pricing */}
            <div className="bg-[var(--pepe-surface)] border border-[var(--pepe-line)] rounded-2xl p-6 md:p-8">
              <h3 className="text-xl font-bold text-[var(--pepe-white)] mb-10 text-center">
                Aerial-Kurse
              </h3>
              <div className="space-y-5">
                {pricingAerial.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-5 border-b border-[var(--pepe-line)] last:border-0"
                  >
                    <div>
                      <p className="text-[var(--pepe-white)] font-medium">{item.name}</p>
                      <p className="text-[var(--pepe-t48)] text-sm mt-2">{item.description}</p>
                    </div>
                    <span className="text-[var(--pepe-gold)] font-bold text-lg ml-4">{item.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Facility Features */}
      <section className="py-20 md:py-32">
        <div className="stage-container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-10">
                Einzigartige Location
              </h2>
              <div className="space-y-8">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl bg-[var(--pepe-gold)]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-[var(--pepe-gold)] text-xl">📐</span>
                  </div>
                  <div>
                    <h4 className="text-[var(--pepe-white)] font-semibold mb-4">8,5 Meter Deckenhöhe</h4>
                    <p className="text-[var(--pepe-t64)] leading-relaxed">Optimale Bedingungen für Luftakrobatik aller Art.</p>
                  </div>
                </div>
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl bg-[var(--pepe-gold)]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-[var(--pepe-gold)] text-xl">🔊</span>
                  </div>
                  <div>
                    <h4 className="text-[var(--pepe-white)] font-semibold mb-4">Perfekte Akustik</h4>
                    <p className="text-[var(--pepe-t64)] leading-relaxed">Die geodätische Kuppelform sorgt für optimale Klangverteilung.</p>
                  </div>
                </div>
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl bg-[var(--pepe-gold)]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-[var(--pepe-gold)] text-xl">🌳</span>
                  </div>
                  <div>
                    <h4 className="text-[var(--pepe-white)] font-semibold mb-4">Grüne Oase</h4>
                    <p className="text-[var(--pepe-t64)] leading-relaxed">Im Ostpark München — Training im Grünen.</p>
                  </div>
                </div>
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl bg-[var(--pepe-gold)]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-[var(--pepe-gold)] text-xl">♿</span>
                  </div>
                  <div>
                    <h4 className="text-[var(--pepe-white)] font-semibold mb-4">Barrierearmer Zugang</h4>
                    <p className="text-[var(--pepe-t64)] leading-relaxed">Vollständig zugänglich (mit Begleitperson empfohlen).</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-80 lg:h-[450px] rounded-2xl overflow-hidden bg-[var(--pepe-surface)] order-1 lg:order-2">
              <TrainingsortOverlapImages />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-[var(--pepe-ink)] to-[var(--pepe-black)]">
        <div className="stage-container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 mx-auto mb-10 rounded-full bg-[var(--pepe-gold)]/10 flex items-center justify-center">
              <span className="text-[var(--pepe-gold)] text-3xl leading-none">&#127947;</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-6">
              Bereit für dein erstes Training?
            </h2>
            <p className="text-[var(--pepe-t80)] text-lg mb-12">
              Melde dich bei uns und entdecke die Welt der zeitgenössischen Zirkuskunst.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <Button variant="primary" size="lg">
                  Kontakt aufnehmen
                </Button>
              </Link>
              <Link href="/events?category=WORKSHOP">
                <Button variant="secondary" size="lg">
                  Alle Workshops
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
