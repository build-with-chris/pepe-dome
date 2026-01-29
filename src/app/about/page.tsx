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
      image: '/images/dome/dome-interior.jpg',
    },
    {
      name: 'PEPE Shows',
      description: 'Zeitgenössischer Zirkus auf höchstem Niveau - von intimen Cabarets bis zu großen Produktionen.',
      icon: '🎭',
      link: '/events?category=SHOW',
      color: 'bronze',
      image: '/images/shows/carmen-jonas-acro.jpg',
    },
    {
      name: 'PEPE Art',
      description: 'Künstlerische Entwicklung und Produktion - Residenzen, Workshops und kreative Zusammenarbeit.',
      icon: '🎨',
      link: '/events?category=WORKSHOP',
      color: 'copper',
      image: '/images/artists/yuhui.jpg',
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
                src="/images/dome/dome-outdoor-hero.webp"
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
      <section className="py-20 md:py-32 bg-gradient-to-b from-[var(--pepe-black)] via-[var(--pepe-ink)]/50 to-[var(--pepe-black)]">
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
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--pepe-surface)] to-[var(--pepe-ink)]">
                        <span className="text-7xl opacity-30">{property.icon}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--pepe-black)] to-transparent" />

                    {/* Icon Badge */}
                    <div className="absolute bottom-4 left-4 w-14 h-14 rounded-xl bg-[var(--pepe-gold)]/20 backdrop-blur-sm flex items-center justify-center border border-[var(--pepe-gold)]/30">
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

      {/* Network Section - Task 3.3.2 */}
      <section className="py-20 md:py-32 bg-[var(--pepe-black)]">
        <div className="stage-container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-8">
                Netzwerk & Engagement
              </h2>
              <p className="text-lg text-[var(--pepe-t80)] mb-10 leading-relaxed">
                Als aktiver Teil der Kulturszene engagieren wir uns in verschiedenen Netzwerken, um die Sichtbarkeit und Professionalisierung der Artistik zu fördern.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[var(--pepe-ink)] border border-[var(--pepe-line)] text-[var(--pepe-t80)] flex items-center gap-3">
                  <span className="text-[var(--pepe-gold)]">•</span> Buzz Mitglied
                </div>
                <div className="p-4 rounded-xl bg-[var(--pepe-ink)] border border-[var(--pepe-line)] text-[var(--pepe-t80)] flex items-center gap-3">
                  <span className="text-[var(--pepe-gold)]">•</span> Netzwerk Freie Szene München
                </div>
                <div className="p-4 rounded-xl bg-[var(--pepe-ink)] border border-[var(--pepe-line)] text-[var(--pepe-t80)] flex items-center gap-3">
                  <span className="text-[var(--pepe-gold)]">•</span> LAG Zirkuspädagogik
                </div>
                <div className="p-4 rounded-xl bg-[var(--pepe-ink)] border border-[var(--pepe-line)] text-[var(--pepe-t80)] flex items-center gap-3">
                  <span className="text-[var(--pepe-gold)]">•</span> Support SK3
                </div>
              </div>
              <div className="mt-8">
                <span className="text-[var(--pepe-gold)] font-bold">#münchenistkultur</span>
              </div>
            </div>
            
            <div className="relative aspect-video rounded-3xl overflow-hidden border border-[var(--pepe-line)] shadow-glow-sm">
              <Image
                src="/images/shows/jonas-acrobatics.jpg"
                alt="Netzwerk Arbeit"
                fill
                className="object-cover opacity-60"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8 backdrop-blur-sm bg-black/30 rounded-2xl border border-white/10">
                  <p className="text-2xl font-bold text-white mb-2">Stark im Verbund</p>
                  <p className="text-[var(--pepe-gold)]">Kollaboration & Gemeinschaft</p>
                </div>
              </div>
            </div>
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
            {/* Map Iframe */}
            <div className="relative h-80 lg:h-[450px] rounded-2xl overflow-hidden border border-[var(--pepe-line)] shadow-2xl group">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2664.1!2d11.63!3d48.11!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479e75eb88888888%3A0x8888888888888888!2sPepe%20Dome!5e0!3m2!1sen!2sde!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0, opacity: 0.7 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale invert contrast-125 transition-all duration-700 group-hover:grayscale-0 group-hover:invert-0 group-hover:opacity-100"
              />
              <div className="absolute inset-0 pointer-events-none border-[var(--pepe-gold)]/20 border-2 rounded-2xl"></div>
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
