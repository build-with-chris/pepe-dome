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
      description: 'Zeitgenossischer Zirkus auf hochstem Niveau - von intimen Cabarets bis zu grossen Produktionen.',
      icon: '🎭',
      link: '/events?category=SHOW',
      color: 'bronze',
      image: null,
    },
    {
      name: 'PEPE Art',
      description: 'Kunstlerische Entwicklung und Produktion - Residenzen, Workshops und kreative Zusammenarbeit.',
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
      />

      {/* Story Section */}
      <section className="py-16 md:py-20">
        <div className="stage-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
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
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-6">
                Unsere Geschichte
              </h2>
              <p className="text-lg text-[var(--pepe-t80)] leading-relaxed mb-6 whitespace-pre-line">
                {about.story}
              </p>
              <Link href="/contact">
                <Button variant="primary">Kontakt aufnehmen</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PEPE Ecosystem Section */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-[var(--pepe-black)] to-[var(--pepe-ink)]">
        <div className="stage-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-4">
              Das PEPE Okosystem
            </h2>
            <p className="text-[var(--pepe-t64)] max-w-2xl mx-auto">
              Drei Saulen - ein gemeinsames Ziel: Artistik als zeitgenossische Kunstform zu fordern und erlebbar zu machen.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {pepeProperties.map((property, index) => (
              <Link key={index} href={property.link} className="group">
                <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-xl overflow-hidden h-full hover:border-[var(--pepe-gold)] transition-all duration-300 hover:-translate-y-1">
                  {/* Property Image */}
                  <div className="relative h-48 bg-[var(--pepe-surface)] overflow-hidden">
                    {property.image ? (
                      <Image
                        src={property.image}
                        alt={property.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
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
                    <h3 className="text-xl font-bold text-[var(--pepe-white)] mb-3 group-hover:text-[var(--pepe-gold)] transition-colors">
                      {property.name}
                    </h3>
                    <p className="text-[var(--pepe-t64)] text-sm leading-relaxed">
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
      <section className="py-16 md:py-20">
        <div className="stage-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-4">
              Unsere Werte
            </h2>
            <p className="text-[var(--pepe-t64)] max-w-xl mx-auto">
              Diese Prinzipien leiten unsere Arbeit und pragen alles, was wir tun.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {about.values.map((value, index) => (
              <div
                key={index}
                className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-xl p-6 text-center hover:border-[var(--pepe-gold)] transition-colors duration-300"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[var(--pepe-gold)]/10 flex items-center justify-center">
                  <span className="text-[var(--pepe-gold)] text-xl">
                    {index === 0 && '&#10024;'}
                    {index === 1 && '&#10084;'}
                    {index === 2 && '&#127793;'}
                    {index === 3 && '&#129309;'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[var(--pepe-white)] mb-3">
                  {value.title}
                </h3>
                <p className="text-[var(--pepe-t64)] text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-20 bg-[var(--pepe-ink)]">
        <div className="stage-container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-4">
              {about.team.title}
            </h2>
            <p className="text-lg text-[var(--pepe-t80)] mb-8 leading-relaxed">
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
      <section className="py-16 md:py-20">
        <div className="stage-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Map Placeholder */}
            <div className="relative h-80 lg:h-96 rounded-xl overflow-hidden bg-[var(--pepe-surface)] border border-[var(--pepe-line)]">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-5xl mb-4 block">📍</span>
                  <p className="text-[var(--pepe-t64)]">
                    Ostpark, Munchen
                  </p>
                </div>
              </div>
            </div>

            {/* Location Info */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-6">
                Besuche uns im Dome
              </h2>
              <p className="text-lg text-[var(--pepe-t80)] mb-6">
                Der PEPE Dome befindet sich im wunderschonen Ostpark in Munchen - leicht erreichbar
                mit offentlichen Verkehrsmitteln und mit Parkmoglichkeiten in der Nahe.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <span className="text-[var(--pepe-gold)]">📍</span>
                  <div>
                    <p className="text-[var(--pepe-white)] font-medium">{site.address.street}</p>
                    <p className="text-[var(--pepe-t64)]">{site.address.zip} {site.address.city}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[var(--pepe-gold)]">&#128231;</span>
                  <a href={`mailto:${site.email}`} className="text-[var(--pepe-gold)] hover:underline">
                    {site.email}
                  </a>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link href="/contact">
                  <Button variant="primary">Kontakt</Button>
                </Link>
                <Link href="/events">
                  <Button variant="secondary">Kommende Events</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
