/**
 * Business Page - Corporate Events & Teambuilding
 */

import Link from 'next/link'
import Image from 'next/image'
import HeroSection from '@/components/custom/HeroSection'
import { Button } from '@/components/ui/Button'

const services = [
  {
    title: 'Corporate Events',
    description: 'Firmenweihnachtsfeiern, Jubiläen, Produktlaunches und Kundenevents in einzigartiger Dome-Atmosphäre.',
    icon: '🎉',
    features: ['Bis zu 200 Gäste', 'Professionelle Technik', 'Catering-Partner', 'Full-Service Organisation'],
  },
  {
    title: 'Teambuilding',
    description: 'Innovative Teambuilding-Erfahrungen durch gemeinsame Artistik-Workshops und kreative Challenges.',
    icon: '🤝',
    features: ['Artist-Workshops', 'Akrobatik-Challenges', 'Kreative Projekte', 'Team-Olympiade'],
  },
  {
    title: 'PepeShows',
    description: 'Maßgeschneiderte Performances mit professionellen Artist:innen - unvergessliche Erlebnisse für Ihre Gäste.',
    icon: '🎭',
    features: ['Professionelle Artist:innen', 'Musik & Akrobatik', 'Individuelle Konzepte', 'Weltklasse-Entertainment'],
  },
]

const features = [
  { label: 'Kapazität', value: 'Bis zu 200 Personen' },
  { label: 'Deckenhöhe', value: '8,5 Meter' },
  { label: 'Architektur', value: 'Geodätische Kuppel' },
  { label: 'Barrierefreiheit', value: 'Vollständig zugänglich' },
]

const packages = [
  {
    name: 'Basic',
    description: 'Für kleinere Veranstaltungen',
    features: ['Venue-Miete (4 Std.)', 'Basis-Technik', 'Bestuhlung nach Wahl'],
  },
  {
    name: 'Premium',
    description: 'Unser beliebtestes Paket',
    features: ['Venue-Miete (6 Std.)', 'Full-Service Technik', 'Bestuhlung & Dekoration', 'Show-Performance (30 Min.)'],
    highlighted: true,
  },
  {
    name: 'Deluxe',
    description: 'Das Rundum-Sorglos-Paket',
    features: ['Venue-Miete (ganztägig)', 'Premium-Technik & Licht', 'Komplette Eventplanung', 'Show-Performance (60 Min.)', 'Catering-Koordination'],
  },
]

export default function BusinessPage() {
  return (
    <div className="min-h-screen bg-[var(--pepe-black)]">
      {/* Hero Section */}
      <HeroSection
        title="Pepe Dome für Unternehmen"
        subtitle="Einzigartige Corporate Events, Teambuilding und Shows in spektakulärer Atmosphäre"
        size="md"
      />

      {/* Intro Section */}
      <section className="py-16 md:py-20">
        <div className="stage-container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-6">
                Unvergessliche Erlebnisse für Ihr Team
              </h2>
              <p className="text-lg text-[var(--pepe-t80)] mb-6 leading-relaxed">
                Der Pepe Dome bietet eine einzigartige Location für Ihre Corporate Events.
                Die geodätische Kuppel im Münchner Ostpark kombiniert spektakuläre Architektur
                mit professioneller Event-Infrastruktur - für Veranstaltungen, die in Erinnerung bleiben.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-lg p-4">
                    <p className="text-[var(--pepe-t48)] text-sm mb-1">{feature.label}</p>
                    <p className="text-[var(--pepe-white)] font-semibold">{feature.value}</p>
                  </div>
                ))}
              </div>
              <Link href="/contact">
                <Button variant="primary" size="lg">
                  Anfrage senden
                </Button>
              </Link>
            </div>
            <div className="relative h-80 lg:h-[450px] rounded-2xl overflow-hidden bg-[var(--pepe-surface)]">
              <Image
                src="/TheDome.png"
                alt="Pepe Dome für Business Events"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--pepe-black)]/60 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-[var(--pepe-black)] to-[var(--pepe-ink)]">
        <div className="stage-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-4">
              Unsere Services
            </h2>
            <p className="text-[var(--pepe-t64)] max-w-2xl mx-auto">
              Von der Firmenfeier bis zum Teambuilding - wir bieten maßgeschneiderte Lösungen für jeden Anlass.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-xl p-8 hover:border-[var(--pepe-gold)] transition-all duration-300"
              >
                <div className="w-16 h-16 mb-6 rounded-xl bg-[var(--pepe-gold)]/10 flex items-center justify-center">
                  <span className="text-4xl">{service.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-[var(--pepe-white)] mb-3">
                  {service.title}
                </h3>
                <p className="text-[var(--pepe-t64)] mb-6">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-[var(--pepe-t80)]">
                      <span className="text-[var(--pepe-gold)]">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-16 md:py-20">
        <div className="stage-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-4">
              Event-Pakete
            </h2>
            <p className="text-[var(--pepe-t64)] max-w-2xl mx-auto">
              Wählen Sie das passende Paket für Ihre Veranstaltung - oder lassen Sie sich ein individuelles Angebot erstellen.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className={`relative bg-[var(--pepe-ink)] border rounded-xl p-8 ${
                  pkg.highlighted
                    ? 'border-[var(--pepe-gold)] ring-1 ring-[var(--pepe-gold)]'
                    : 'border-[var(--pepe-line)]'
                }`}
              >
                {pkg.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold bg-[var(--pepe-gold)] text-[var(--pepe-black)]">
                    Beliebt
                  </span>
                )}
                <h3 className="text-xl font-bold text-[var(--pepe-white)] mb-2">
                  {pkg.name}
                </h3>
                <p className="text-[var(--pepe-t64)] text-sm mb-6">
                  {pkg.description}
                </p>
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[var(--pepe-t80)]">
                      <span className="text-[var(--pepe-gold)] mt-0.5">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/contact" className="block">
                  <Button
                    variant={pkg.highlighted ? 'primary' : 'secondary'}
                    className="w-full"
                  >
                    Anfrage senden
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <p className="text-[var(--pepe-t64)] mb-4">
              Benötigen Sie ein individuelles Angebot?
            </p>
            <Link href="/contact">
              <Button variant="ghost">
                Bespoke-Paket anfragen
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Venue Features */}
      <section className="py-16 md:py-20 bg-[var(--pepe-ink)]">
        <div className="stage-container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative h-80 lg:h-[400px] rounded-2xl overflow-hidden bg-[var(--pepe-surface)]">
              <Image
                src="/TheDome.png"
                alt="Pepe Dome Venue"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-6">
                Professionelle Ausstattung
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--pepe-gold)]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-[var(--pepe-gold)]">💡</span>
                  </div>
                  <div>
                    <h4 className="text-[var(--pepe-white)] font-semibold mb-1">Professionelle Lichttechnik</h4>
                    <p className="text-[var(--pepe-t64)] text-sm">Modernste Beleuchtungssysteme für jede Stimmung.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--pepe-gold)]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-[var(--pepe-gold)]">🔊</span>
                  </div>
                  <div>
                    <h4 className="text-[var(--pepe-white)] font-semibold mb-1">Premium Sound</h4>
                    <p className="text-[var(--pepe-t64)] text-sm">Hochwertige Beschallungsanlage mit optimaler Akustik.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--pepe-gold)]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-[var(--pepe-gold)]">📽️</span>
                  </div>
                  <div>
                    <h4 className="text-[var(--pepe-white)] font-semibold mb-1">Projektionstechnik</h4>
                    <p className="text-[var(--pepe-t64)] text-sm">Beamer und Leinwand für Präsentationen und Visuals.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--pepe-gold)]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-[var(--pepe-gold)]">🪑</span>
                  </div>
                  <div>
                    <h4 className="text-[var(--pepe-white)] font-semibold mb-1">Flexible Bestuhlung</h4>
                    <p className="text-[var(--pepe-t64)] text-sm">Verschiedene Aufbauvarianten für jeden Anlass.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20">
        <div className="stage-container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-4">
              Planen Sie Ihr nächstes Event
            </h2>
            <p className="text-[var(--pepe-t80)] text-lg mb-8">
              Kontaktieren Sie uns für ein unverbindliches Beratungsgespräch.
              Wir freuen uns darauf, Ihre Vision in die Realität umzusetzen.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <Button variant="primary" size="lg">
                  Kontakt aufnehmen
                </Button>
              </Link>
              <a href="mailto:info@pepearts.de">
                <Button variant="secondary" size="lg">
                  info@pepearts.de
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
