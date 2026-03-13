/**
 * Training Page - Zeitgenössischer Zirkus und Artistik
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import HeroSection from '@/components/custom/HeroSection'
import TrainingsortOverlapImages from '@/components/custom/TrainingsortOverlapImages'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Workshops & Training | Pepe Dome München',
  description: 'Professionelles Training für zeitgenössischen Zirkus und Artistik. Profitraining, Aerial Arts, Ground Arts und Workshops im Pepe Dome.',
}

const disciplines = [
  {
    name: 'Aerial Arts',
    description: 'Vertikaltuch, Trapez, Aerial Hoop, Strapaten, Spanish Web',
    icon: '🎪',
  },
  {
    name: 'Ground Arts',
    description: 'Handstand, Akrobatik, Kontorsion, Cyr Wheel, Jonglage',
    icon: '🤸',
  },
  {
    name: 'Movement & Flow',
    description: 'Contemporary Dance, Floor Work, Improvisation',
    icon: '💃',
  },
  {
    name: 'Conditioning',
    description: 'Flexibilität, Verletzungsprävention, Kraftaufbau',
    icon: '💪',
  },
]

const pricingNonAerial = [
  { name: 'Schnupperstunde', price: '12€', description: 'Einmalig zum Kennenlernen' },
  { name: 'Einzelstunde', price: '20€', description: 'Flexibel buchbar' },
  { name: '5er-Karte', price: '90€', description: '18€ pro Stunde' },
  { name: '10er-Karte', price: '165€', description: '16,50€ pro Stunde' },
  { name: '20er-Karte', price: '300€', description: '15€ pro Stunde' },
]

const pricingAerial = [
  { name: 'Einzelstunde', price: '25€', description: 'Flexibel buchbar' },
  { name: '5er-Karte', price: '120€', description: '24€ pro Stunde' },
  { name: '10er-Karte', price: '220€', description: '22€ pro Stunde' },
  { name: '20er-Karte', price: '400€', description: '20€ pro Stunde' },
]

export default function TrainingPage() {
  return (
    <div className="min-h-screen bg-[var(--pepe-black)]">
      {/* Hero Section */}
      <HeroSection
        title="Workshops & Training"
        subtitle="Zeitgenössischer Zirkus und Artistik im Pepe Dome - für alle Levels"
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
                <a
                  href="https://www.eversports.de/s/pepe-dome"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="primary" size="lg">
                    Kurse buchen
                  </Button>
                </a>
                <Link href="/contact">
                  <Button variant="secondary" size="lg">
                    Kontakt aufnehmen
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
              Von Luftakrobatik bis Bodenarbeit - entdecke die Vielfalt zeitgenössischer Zirkuskunst.
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
              Flexible Optionen für jeden Trainingsbedarf - von der Schnupperstunde bis zur 20er-Karte.
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

          <div className="text-center mt-12">
            <a
              href="https://www.eversports.de/s/pepe-dome"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="primary" size="lg">
                Jetzt Kurs buchen
              </Button>
            </a>
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
                    <p className="text-[var(--pepe-t64)] leading-relaxed">Im Ostpark München - Training im Grünen.</p>
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
            {/* Decorative Icon */}
            <div className="w-16 h-16 mx-auto mb-10 rounded-full bg-[var(--pepe-gold)]/10 flex items-center justify-center">
              <span className="text-[var(--pepe-gold)] text-3xl leading-none">&#127947;</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-6">
              Bereit für dein erstes Training?
            </h2>
            <p className="text-[var(--pepe-t80)] text-lg mb-12">
              Buche jetzt deine Schnupperstunde und entdecke die Welt der zeitgenössischen Zirkuskunst.
            </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="https://www.eversports.de/s/pepe-dome"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="primary" size="lg">
                    Kurse auf Eversports
                  </Button>
                </a>
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
