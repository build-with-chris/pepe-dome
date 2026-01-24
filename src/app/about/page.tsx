/**
 * Phase 3 Task 3.5.1: About Page Rebuild
 *
 * Features:
 * - PEPE ecosystem overview
 * - Property cards (Dome, Shows, Art)
 * - Values section
 * - Team section (optional)
 */

import Image from 'next/image'
import Link from 'next/link'
import { getAboutContent, getSiteContent } from '@/lib/data'
import HeroSection from '@/components/custom/HeroSection'
import { Button } from '@/components/ui/Button'

export default function AboutPage() {
  const about = getAboutContent()
  const site = getSiteContent()

  // PEPE ecosystem properties
  const pepeProperties = [
    {
      name: 'PEPE Dome',
      description: 'Die geodatische Kuppel im Ostpark - Hauptbuhne fur spektakulare Shows, Festivals und Events.',
      icon: '🏛️',
      link: '/events',
      color: 'gold',
      image: '/TheDome.png',
    },
    {
      name: 'PEPE Shows',
      description: 'Zeitgenössischer Zirkus auf höchstem Niveau - von intimen Cabarets bis zu großen Produktionen.',
      icon: '🎭',
      link: '/events?category=SHOW',
      color: 'bronze',
      image: null,
    },
    {
      name: 'PEPE Art',
      description: 'Künstlerische Entwicklung und Produktion - Residenzen, Workshops und kreative Zusammenarbeit.',
      icon: '🎨',
      link: '/events?category=WORKSHOP',
      color: 'copper',
      image: null,
    },
  ]

  return (
    <div className="min-h-screen bg-[var(--pepe-black)]">
      {/* Hero Section */}
      <HeroSection
        title={about.title}
        subtitle={about.intro}
        size="md"
        dotCloudIcon="about"
      />

      {/* Story Section */}
      <section className="py-20 md:py-32">
        <div className="stage-container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image */}
            <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden bg-[var(--pepe-surface)]">
              <Image
                src="/TheDome.png"
                alt="PEPE Dome"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--pepe-black)]/60 to-transparent" />
            </div>

            {/* Text Content */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-8">
                Unsere Geschichte
              </h2>
              <p className="text-lg text-[var(--pepe-t80)] leading-relaxed mb-10 whitespace-pre-line">
                {about.story}
              </p>
              <Link href="/contact">
                <Button variant="primary" size="lg">Kontakt aufnehmen</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PEPE Ecosystem Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-[var(--pepe-black)] to-[var(--pepe-ink)]">
        <div className="stage-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-6">
              Das PEPE Ökosystem
            </h2>
            <p className="text-lg text-[var(--pepe-t64)] max-w-2xl mx-auto leading-relaxed">
              Drei Säulen - ein gemeinsames Ziel: Artistik als zeitgenössische Kunstform zu fördern und erlebbar zu machen.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pepeProperties.map((property, index) => (
              <Link key={index} href={property.link} className="group">
                <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl overflow-hidden h-full hover:border-[var(--pepe-gold)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.35),0_0_8px_var(--pepe-gold-glow)] transition-all duration-300 ease-out hover:-translate-y-1">
                  {/* Property Image */}
                  <div className="relative h-52 bg-[var(--pepe-surface)] overflow-hidden">
                    {property.image ? (
                      <Image
                        src={property.image}
                        alt={property.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        sizes="(max-width: 768px) 100vw, 400px"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-7xl opacity-30">{property.icon}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--pepe-black)] to-transparent" />

                    {/* Icon Badge */}
                    <div className="absolute bottom-4 left-4 w-14 h-14 rounded-xl bg-[var(--pepe-gold)]/20 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-3xl">{property.icon}</span>
                    </div>
                  </div>

                  {/* Property Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[var(--pepe-white)] mb-4 group-hover:text-[var(--pepe-gold)] transition-colors duration-300">
                      {property.name}
                    </h3>
                    <p className="text-[var(--pepe-t64)] leading-relaxed">
                      {property.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 md:py-32">
        <div className="stage-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-6">
              Unsere Werte
            </h2>
            <p className="text-lg text-[var(--pepe-t64)] max-w-xl mx-auto leading-relaxed">
              Diese Prinzipien leiten unsere Arbeit und prägen alles, was wir tun.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {about.values.map((value, index) => (
              <div
                key={index}
                className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-6 md:p-8 text-center hover:border-[var(--pepe-gold)] hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(0,0,0,0.35),0_0_8px_var(--pepe-gold-glow)] transition-all duration-300 ease-out"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--pepe-gold)]/10 flex items-center justify-center">
                  <span className="text-[var(--pepe-gold)] text-3xl">
                    {index === 0 && '✨'}
                    {index === 1 && '❤️'}
                    {index === 2 && '🌱'}
                    {index === 3 && '🤝'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[var(--pepe-white)] mb-4">
                  {value.title}
                </h3>
                <p className="text-[var(--pepe-t64)] leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 md:py-32 bg-[var(--pepe-ink)]">
        <div className="stage-container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-6">
              {about.team.title}
            </h2>
            <p className="text-lg text-[var(--pepe-t80)] mb-12 leading-relaxed">
              {about.team.description}
            </p>
            <Link href="/contact">
              <Button variant="secondary" size="lg">
                Lerne uns kennen
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-20 md:py-32">
        <div className="stage-container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Map Placeholder */}
            <div className="relative h-80 lg:h-[450px] rounded-2xl overflow-hidden bg-gradient-to-br from-[var(--pepe-surface)] to-[var(--pepe-ink)] border border-[var(--pepe-line)]">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--pepe-gold)]/10 flex items-center justify-center">
                    <span className="text-[var(--pepe-gold)] text-4xl">&#128205;</span>
                  </div>
                  <p className="text-xl font-bold text-[var(--pepe-white)] mb-2">
                    Pepe Dome
                  </p>
                  <p className="text-[var(--pepe-t64)]">
                    Ostpark, München
                  </p>
                </div>
              </div>
            </div>

            {/* Location Info */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-8">
                Besuche uns im Dome
              </h2>
              <p className="text-lg text-[var(--pepe-t80)] mb-10 leading-relaxed">
                Der PEPE Dome befindet sich im wunderschönen Ostpark in München - leicht erreichbar
                mit öffentlichen Verkehrsmitteln und mit Parkmöglichkeiten in der Nähe.
              </p>

              <div className="space-y-5 mb-12">
                <div className="flex items-start gap-4">
                  <span className="text-[var(--pepe-gold)] text-xl">📍</span>
                  <div>
                    <p className="text-[var(--pepe-white)] font-medium">{site.address.street}</p>
                    <p className="text-[var(--pepe-t64)] mt-2">{site.address.zip} {site.address.city}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-[var(--pepe-gold)] text-xl">&#128231;</span>
                  <a href={`mailto:${site.email}`} className="text-[var(--pepe-gold)] hover:underline">
                    {site.email}
                  </a>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link href="/contact">
                  <Button variant="primary" size="lg">Kontakt</Button>
                </Link>
                <Link href="/events">
                  <Button variant="secondary" size="lg">Kommende Events</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
