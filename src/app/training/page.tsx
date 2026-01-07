/**
 * Training Page - Zeitgenössischer Zirkus und Artistik
 */

import Link from 'next/link'
import Image from 'next/image'
import HeroSection from '@/components/custom/HeroSection'
import { Button } from '@/components/ui/Button'

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
        title="Training & Kurse"
        subtitle="Zeitgenössischer Zirkus und Artistik im Pepe Dome - für alle Levels"
        size="md"
      />

      {/* Intro Section */}
      <section className="py-20 md:py-28">
        <div className="stage-container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-6">
                Professionelles Training in einzigartiger Atmosphäre
              </h2>
              <p className="text-lg text-[var(--pepe-t80)] mb-6 leading-relaxed">
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
                src="/TheDome.png"
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

      {/* Profitraining */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-[var(--pepe-black)] to-[var(--pepe-ink)]">
        <div className="stage-container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold bg-[var(--pepe-gold)]/20 text-[var(--pepe-gold)] border border-[var(--pepe-gold)]/40 mb-6">
              Täglich 10:00 - 14:00 Uhr
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-4">
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
      <section className="py-20 md:py-28">
        <div className="stage-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-4">
              Unsere Disziplinen
            </h2>
            <p className="text-[var(--pepe-t64)] max-w-2xl mx-auto">
              Von Luftakrobatik bis Bodenarbeit - entdecke die Vielfalt zeitgenössischer Zirkuskunst.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {disciplines.map((discipline, index) => (
              <div
                key={index}
                className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-xl p-6 text-center hover:border-[var(--pepe-gold)] transition-all duration-300"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--pepe-gold)]/10 flex items-center justify-center">
                  <span className="text-3xl">{discipline.icon}</span>
                </div>
                <h3 className="text-lg font-bold text-[var(--pepe-white)] mb-2">
                  {discipline.name}
                </h3>
                <p className="text-[var(--pepe-t64)] text-sm">
                  {discipline.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 md:py-28 bg-[var(--pepe-ink)]">
        <div className="stage-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-4">
              Preise
            </h2>
            <p className="text-[var(--pepe-t64)] max-w-2xl mx-auto">
              Flexible Optionen für jeden Trainingsbedarf - von der Schnupperstunde bis zur 20er-Karte.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Non-Aerial Pricing */}
            <div className="bg-[var(--pepe-surface)] border border-[var(--pepe-line)] rounded-xl p-8">
              <h3 className="text-xl font-bold text-[var(--pepe-white)] mb-6 text-center">
                Boden-Kurse
              </h3>
              <div className="space-y-4">
                {pricingNonAerial.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 border-b border-[var(--pepe-line)] last:border-0"
                  >
                    <div>
                      <p className="text-[var(--pepe-white)] font-medium">{item.name}</p>
                      <p className="text-[var(--pepe-t48)] text-sm">{item.description}</p>
                    </div>
                    <span className="text-[var(--pepe-gold)] font-bold text-lg">{item.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Aerial Pricing */}
            <div className="bg-[var(--pepe-surface)] border border-[var(--pepe-line)] rounded-xl p-8">
              <h3 className="text-xl font-bold text-[var(--pepe-white)] mb-6 text-center">
                Aerial-Kurse
              </h3>
              <div className="space-y-4">
                {pricingAerial.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 border-b border-[var(--pepe-line)] last:border-0"
                  >
                    <div>
                      <p className="text-[var(--pepe-white)] font-medium">{item.name}</p>
                      <p className="text-[var(--pepe-t48)] text-sm">{item.description}</p>
                    </div>
                    <span className="text-[var(--pepe-gold)] font-bold text-lg">{item.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
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
      <section className="py-20 md:py-28">
        <div className="stage-container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-6">
                Einzigartige Location
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--pepe-gold)]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-[var(--pepe-gold)]">📐</span>
                  </div>
                  <div>
                    <h4 className="text-[var(--pepe-white)] font-semibold mb-1">8,5 Meter Deckenhöhe</h4>
                    <p className="text-[var(--pepe-t64)] text-sm">Optimale Bedingungen für Luftakrobatik aller Art.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--pepe-gold)]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-[var(--pepe-gold)]">🔊</span>
                  </div>
                  <div>
                    <h4 className="text-[var(--pepe-white)] font-semibold mb-1">Perfekte Akustik</h4>
                    <p className="text-[var(--pepe-t64)] text-sm">Die geodätische Kuppelform sorgt für optimale Klangverteilung.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--pepe-gold)]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-[var(--pepe-gold)]">🌳</span>
                  </div>
                  <div>
                    <h4 className="text-[var(--pepe-white)] font-semibold mb-1">Grüne Oase</h4>
                    <p className="text-[var(--pepe-t64)] text-sm">Im Ostpark München - Training im Grünen.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--pepe-gold)]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-[var(--pepe-gold)]">♿</span>
                  </div>
                  <div>
                    <h4 className="text-[var(--pepe-white)] font-semibold mb-1">Barrierefreier Zugang</h4>
                    <p className="text-[var(--pepe-t64)] text-sm">Vollständig zugänglich für alle.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-80 lg:h-[400px] rounded-2xl overflow-hidden bg-[var(--pepe-surface)] order-1 lg:order-2">
              <Image
                src="/TheDome.png"
                alt="Pepe Dome Interior"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-[var(--pepe-ink)] to-[var(--pepe-black)]">
        <div className="stage-container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-4">
              Bereit für dein erstes Training?
            </h2>
            <p className="text-[var(--pepe-t80)] text-lg mb-8">
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
              <Link href="/events?category=TRAINING">
                <Button variant="secondary" size="lg">
                  Alle Trainings-Events
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
