/**
 * About Page — localized (DE / EN)
 *
 * Komplett aus dem Dictionary geladen. Adresse + E-Mail kommen weiterhin
 * aus getSiteContent() (sind locale-unabhängig).
 */

import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSiteContent } from '@/lib/data'
import HeroSection from '@/components/custom/HeroSection'
import { Button } from '@/components/ui/Button'
import { isLocale, localizedHref, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/get-dictionary'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang: rawLang } = await params
  if (!isLocale(rawLang)) return {}
  const dict = await getDictionary(rawLang)
  return {
    title: dict.about.meta.title,
    description: dict.about.meta.description,
    alternates: { canonical: `https://www.pepe-dome.de/${rawLang}/about` },
  }
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang: rawLang } = await params
  if (!isLocale(rawLang)) notFound()
  const lang: Locale = rawLang
  const dict = await getDictionary(lang)
  const t = dict.about
  const site = getSiteContent()

  // Property cards — image/link/icon sind fix, Texte aus dict.about.ecosystem
  const pepeProperties = [
    {
      ...t.ecosystem.items.dome,
      icon: '🏛️',
      link: localizedHref(lang, '/events'),
      image: '/images/Aufbau/dome-interior.jpg',
    },
    {
      ...t.ecosystem.items.shows,
      icon: '🎭',
      link: localizedHref(lang, '/events') + '?category=SHOW',
      image: '/images/shows/carmen-jonas-acro.jpg',
    },
    {
      ...t.ecosystem.items.arts,
      icon: '🎨',
      link: localizedHref(lang, '/events') + '?category=WORKSHOP',
      image: '/images/artists/michi.jpg',
    },
  ]

  const valueEmojis = ['✨', '❤️', '🌱', '🤝']

  return (
    <div className="min-h-screen bg-[var(--pepe-black)]">
      {/* Hero */}
      <HeroSection
        title={t.hero.title}
        subtitle={t.hero.subtitle}
        size="md"
        dotCloudIcon="about"
      />

      {/* Story */}
      <section className="py-20 md:py-32">
        <div className="stage-container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden bg-[var(--pepe-surface)]">
              <Image
                src="/images/Aufbau/dome-outdoor-hero.webp"
                alt={t.story.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--pepe-black)]/60 to-transparent" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-8">
                {t.story.title}
              </h2>
              <p className="text-lg text-[var(--pepe-t80)] leading-relaxed mb-10 whitespace-pre-line">
                {t.story.text}
              </p>
              <Link href={localizedHref(lang, '/contact')}>
                <Button variant="primary" size="lg">{t.story.contact}</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission (von der Startseite hierher verschoben) */}
      <section className="py-16 md:py-24 bg-[var(--pepe-black)]">
        <div className="stage-container">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-10 shadow-xl">
                <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-gold)] mb-6">
                  {t.vision.title}
                </h2>
                <p className="text-[var(--pepe-t80)] leading-relaxed text-lg">
                  {t.vision.text}
                </p>
              </div>
              <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-10 shadow-xl">
                <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-gold)] mb-6">
                  {t.mission.title}
                </h2>
                <p className="text-[var(--pepe-t80)] leading-relaxed text-lg">
                  {t.mission.text}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hintergrund & Projektidee */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-[var(--pepe-black)] via-[var(--pepe-ink)]/30 to-[var(--pepe-black)]">
        <div className="stage-container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-8 text-center">
              {t.background.title}
            </h2>
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-12 shadow-xl">
              <div className="space-y-6 text-[var(--pepe-t80)] leading-relaxed text-lg">
                <p>{t.background.p1}</p>
                <p>{t.background.p2}</p>
                <p>{t.background.p3}</p>
                <p>{t.background.p4}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bereiche: Kultur / Bildung / Forschung */}
      <section className="py-20 md:py-32 bg-[var(--pepe-black)]">
        <div className="stage-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-6">
              {t.areas.title}
            </h2>
            <p className="text-lg text-[var(--pepe-t64)] max-w-2xl mx-auto leading-relaxed">
              {t.areas.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '🎭', ...t.areas.kultur },
              { icon: '📚', ...t.areas.bildung },
              { icon: '🔬', ...t.areas.forschung },
            ].map((area, idx) => (
              <div
                key={idx}
                className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 hover:border-[var(--pepe-gold)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.35),0_0_8px_var(--pepe-gold-glow)] transition-all duration-300 ease-out"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--pepe-gold)]/10 flex items-center justify-center">
                  <span className="text-[var(--pepe-gold)] text-3xl">{area.icon}</span>
                </div>
                <h3 className="text-2xl font-bold text-[var(--pepe-white)] mb-6 text-center">
                  {area.title}
                </h3>
                <ul className="space-y-3 text-[var(--pepe-t80)] leading-relaxed">
                  {area.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[var(--pepe-gold)] mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PEPE Ökosystem */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-[var(--pepe-black)] via-[var(--pepe-ink)]/50 to-[var(--pepe-black)]">
        <div className="stage-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-6">
              {t.ecosystem.title}
            </h2>
            <p className="text-lg text-[var(--pepe-t64)] max-w-2xl mx-auto leading-relaxed">
              {t.ecosystem.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pepeProperties.map((property, index) => (
              <Link key={index} href={property.link} className="group">
                <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl overflow-hidden h-full hover:border-[var(--pepe-gold)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.35),0_0_8px_var(--pepe-gold-glow)] transition-all duration-300 ease-out hover:-translate-y-1">
                  <div className="relative h-52 bg-[var(--pepe-surface)] overflow-hidden">
                    <Image
                      src={property.image}
                      alt={property.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--pepe-black)] to-transparent" />
                    <div className="absolute bottom-4 left-4 w-14 h-14 rounded-xl bg-[var(--pepe-gold)]/20 backdrop-blur-sm flex items-center justify-center border border-[var(--pepe-gold)]/30">
                      <span className="text-3xl">{property.icon}</span>
                    </div>
                  </div>
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

      {/* Netzwerk */}
      <section className="py-20 md:py-32 bg-[var(--pepe-black)]">
        <div className="stage-container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-8">
                {t.network.title}
              </h2>
              <p className="text-lg text-[var(--pepe-t80)] mb-10 leading-relaxed">
                {t.network.text}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {t.network.items.map((item, i) => (
                  <div key={i} className="p-4 rounded-xl bg-[var(--pepe-ink)] border border-[var(--pepe-line)] text-[var(--pepe-t80)] flex items-center gap-3">
                    <span className="text-[var(--pepe-gold)]">•</span> {item}
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <span className="text-[var(--pepe-gold)] font-bold">#münchenistkultur</span>
              </div>
            </div>

            <div>
              <div className="relative aspect-video rounded-3xl overflow-hidden border border-[var(--pepe-line)] shadow-glow-sm">
                <Image
                  src="/images/shows/jonas-acrobatics.jpg"
                  alt={t.network.title}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-2xl font-bold text-[var(--pepe-white)] mt-6 mb-2">{t.network.imageCaption}</p>
              <p className="text-[var(--pepe-gold)]">{t.network.imageSubcaption}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Werte */}
      <section className="py-20 md:py-32">
        <div className="stage-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-6">
              {t.values.title}
            </h2>
            <p className="text-lg text-[var(--pepe-t64)] max-w-xl mx-auto leading-relaxed">
              {t.values.subtitle}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.values.items.map((value, index) => (
              <div
                key={index}
                className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-6 md:p-8 text-center hover:border-[var(--pepe-gold)] hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(0,0,0,0.35),0_0_8px_var(--pepe-gold-glow)] transition-all duration-300 ease-out"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--pepe-gold)]/10 flex items-center justify-center">
                  <span className="text-[var(--pepe-gold)] text-3xl">
                    {valueEmojis[index] ?? '✨'}
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

      {/* Team */}
      <section className="py-20 md:py-32 bg-[var(--pepe-ink)]">
        <div className="stage-container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-6">
              {t.team.title}
            </h2>
            <p className="text-lg text-[var(--pepe-t80)] mb-12 leading-relaxed">
              {t.team.description}
            </p>
            <Link href={localizedHref(lang, '/contact')}>
              <Button variant="secondary" size="lg">{t.team.cta}</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-20 md:py-32">
        <div className="stage-container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative h-80 lg:h-[450px] rounded-2xl overflow-hidden border border-[var(--pepe-line)] shadow-2xl group">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2664.116634887349!2d11.640768!3d48.1119726!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479ddfe1623e7b83%3A0x8f776b2413dcab9e!2sPepe%20Dome%20im%20Theatron%20im%20Ostpark!5e0!3m2!1sde!2sde!4v1738148400000"
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

            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-8">
                {t.location.title}
              </h2>
              <p className="text-lg text-[var(--pepe-t80)] mb-10 leading-relaxed">
                {t.location.text}
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
                <Link href={localizedHref(lang, '/contact')}>
                  <Button variant="primary" size="lg">{t.location.contact}</Button>
                </Link>
                <Link href={localizedHref(lang, '/events')}>
                  <Button variant="secondary" size="lg">{t.location.upcomingEvents}</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
