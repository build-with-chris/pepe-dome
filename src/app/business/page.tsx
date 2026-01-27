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
  { label: 'Barrierefreiheit', value: 'Barrierearm (mit Begleitperson)' },
]

const packages = [
  {
    name: 'Basic Event',
    description: 'Ideal für Meetings, kleine Workshops oder private Feiern im exklusiven Rahmen.',
    features: [
      'Exklusive Venue-Miete (4 Std.)',
      'Basis-Technik (Sound & Standard-Licht)',
      'Bestuhlung nach Wahl (bis 100 Pers.)',
      'Betreuung vor Ort',
      'Barrierearmer Zugang'
    ],
  },
  {
    name: 'Premium Show',
    description: 'Unser Bestseller für Firmenfeiern mit einem Hauch von Zirkusmagie.',
    features: [
      'Exklusive Venue-Miete (6 Std.)',
      'Full-Service Technik & Operator',
      'Bestuhlung & Lounge-Bereich',
      'Show-Performance (30 Min.) inklusive',
      'Catering-Optionen zubuchbar'
    ],
    highlighted: true,
  },
  {
    name: 'Deluxe Production',
    description: 'Das Full-Service Paket für Großevents, Galas und Produktlaunches.',
    features: [
      'Exklusive Venue-Miete (ganztägig)',
      'Premium Licht- & Sounddesign',
      'Komplette Eventplanung & Regie',
      'Maßgeschneiderte Show (60 Min.)',
      'Catering-Koordination & Service'
    ],
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
        dotCloudIcon="business"
      />

      {/* Intro Section */}
      <section className="py-20 md:py-32">
        <div className="stage-container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-8">
                Unvergessliche Erlebnisse für Ihr Team
              </h2>
              <p className="text-lg text-[var(--pepe-t80)] mb-10 leading-relaxed">
                Der Pepe Dome bietet eine einzigartige Location für Ihre Corporate Events.
                Die geodätische Kuppel im Münchner Ostpark kombiniert spektakuläre Architektur
                mit professioneller Event-Infrastruktur - für Veranstaltungen, die in Erinnerung bleiben.
              </p>
              <div className="grid grid-cols-2 gap-5 mb-12">
                {features.map((feature, index) => (
                  <div key={index} className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-xl p-6">
                    <p className="text-[var(--pepe-t48)] text-sm mb-4">{feature.label}</p>
                    <p className="text-[var(--pepe-white)] font-semibold text-lg">{feature.value}</p>
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
      <section className="py-20 md:py-32 bg-gradient-to-b from-[var(--pepe-black)] to-[var(--pepe-ink)]">
        <div className="stage-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-6">
              Unsere Services
            </h2>
            <p className="text-lg text-[var(--pepe-t64)] max-w-2xl mx-auto leading-relaxed">
              Von der Firmenfeier bis zum Teambuilding - wir bieten maßgeschneiderte Lösungen für jeden Anlass.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-6 md:p-8 hover:border-[var(--pepe-gold)] hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(0,0,0,0.35),0_0_8px_var(--pepe-gold-glow)] transition-all duration-300 ease-out"
              >
                <div className="w-16 h-16 mb-8 rounded-xl bg-[var(--pepe-gold)]/10 flex items-center justify-center">
                  <span className="text-4xl">{service.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-[var(--pepe-white)] mb-4">
                  {service.title}
                </h3>
                <p className="text-[var(--pepe-t64)] mb-10 leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-4">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-[var(--pepe-t80)]">
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
      <section className="py-20 md:py-32">
        <div className="stage-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-6">
              Event-Pakete
            </h2>
            <p className="text-lg text-[var(--pepe-t64)] max-w-2xl mx-auto leading-relaxed">
              Wählen Sie das passende Paket für Ihre Veranstaltung - oder lassen Sie sich ein individuelles Angebot erstellen.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className={`relative bg-[var(--pepe-ink)] border rounded-2xl p-6 md:p-8 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(0,0,0,0.35)] transition-all duration-300 ease-out ${
                  pkg.highlighted
                    ? 'border-[var(--pepe-gold)] ring-1 ring-[var(--pepe-gold)]'
                    : 'border-[var(--pepe-line)] hover:border-[var(--pepe-gold)]'
                }`}
              >
                {pkg.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-semibold bg-[var(--pepe-gold)] text-[var(--pepe-black)]">
                    Beliebt
                  </span>
                )}
                <h3 className="text-xl font-bold text-[var(--pepe-white)] mb-4">
                  {pkg.name}
                </h3>
                <p className="text-[var(--pepe-t64)] mb-10">
                  {pkg.description}
                </p>
                <ul className="space-y-4 mb-12">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-[var(--pepe-t80)]">
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

          <div className="text-center mt-16">
            <p className="text-[var(--pepe-t64)] mb-6">
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
      <section className="py-20 md:py-32 bg-[var(--pepe-ink)]">
        <div className="stage-container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative h-80 lg:h-[450px] rounded-2xl overflow-hidden bg-[var(--pepe-surface)]">
              <Image
                src="/TheDome.png"
                alt="Pepe Dome Venue"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-10">
                Professionelle Ausstattung
              </h2>
              <div className="space-y-8">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl bg-[var(--pepe-gold)]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-[var(--pepe-gold)] text-xl">💡</span>
                  </div>
                  <div>
                    <h4 className="text-[var(--pepe-white)] font-semibold mb-4">Professionelle Lichttechnik</h4>
                    <p className="text-[var(--pepe-t64)] leading-relaxed">Modernste Beleuchtungssysteme für jede Stimmung.</p>
                  </div>
                </div>
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl bg-[var(--pepe-gold)]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-[var(--pepe-gold)] text-xl">🔊</span>
                  </div>
                  <div>
                    <h4 className="text-[var(--pepe-white)] font-semibold mb-4">Premium Sound</h4>
                    <p className="text-[var(--pepe-t64)] leading-relaxed">Hochwertige Beschallungsanlage mit optimaler Akustik.</p>
                  </div>
                </div>
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl bg-[var(--pepe-gold)]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-[var(--pepe-gold)] text-xl">📽️</span>
                  </div>
                  <div>
                    <h4 className="text-[var(--pepe-white)] font-semibold mb-4">Projektionstechnik</h4>
                    <p className="text-[var(--pepe-t64)] leading-relaxed">Beamer und Leinwand für Präsentationen und Visuals.</p>
                  </div>
                </div>
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl bg-[var(--pepe-gold)]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-[var(--pepe-gold)] text-xl">🪑</span>
                  </div>
                  <div>
                    <h4 className="text-[var(--pepe-white)] font-semibold mb-4">Flexible Bestuhlung</h4>
                    <p className="text-[var(--pepe-t64)] leading-relaxed">Verschiedene Aufbauvarianten für jeden Anlass.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="stage-container">
          <div className="max-w-3xl mx-auto text-center">
            {/* Decorative Icon */}
            <div className="w-16 h-16 mx-auto mb-10 rounded-full bg-[var(--pepe-gold)]/10 flex items-center justify-center">
              <span className="text-[var(--pepe-gold)] text-3xl leading-none">&#127881;</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-6">
              Planen Sie Ihr nächstes Event
            </h2>
            <p className="text-[var(--pepe-t80)] text-lg mb-12">
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
