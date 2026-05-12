/**
 * Business Page — localized (DE / EN)
 * Server Component, vollständig aus dem Dictionary geladen.
 */

import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
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
    title: dict.business.meta.title,
    description: dict.business.meta.description,
    alternates: { canonical: `https://www.pepe-dome.de/${rawLang}/business` },
  }
}

export default async function BusinessPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang: rawLang } = await params
  if (!isLocale(rawLang)) notFound()
  const lang: Locale = rawLang
  const dict = await getDictionary(lang)
  const t = dict.business

  return (
    <div className="min-h-screen bg-[var(--pepe-black)]">
      {/* Hero */}
      <HeroSection
        title={t.hero.title}
        subtitle={t.hero.subtitle}
        size="md"
        dotCloudIcon="business"
      />

      {/* Intro */}
      <section className="py-20 md:py-32">
        <div className="stage-container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-8">
                {t.intro.title}
              </h2>
              <p className="text-lg text-[var(--pepe-t80)] mb-10 leading-relaxed">
                {t.intro.text}
              </p>
              <div className="grid grid-cols-2 gap-5 mb-12">
                {t.intro.features.map((feature, index) => (
                  <div key={index} className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-xl p-6">
                    <p className="text-[var(--pepe-t48)] text-sm mb-4">{feature.label}</p>
                    <p className="text-[var(--pepe-white)] font-semibold text-lg">{feature.value}</p>
                  </div>
                ))}
              </div>
              <Link href={localizedHref(lang, '/contact')}>
                <Button variant="primary" size="lg">{t.intro.cta}</Button>
              </Link>
            </div>
            <div className="relative h-80 lg:h-[450px] rounded-2xl overflow-hidden bg-[var(--pepe-surface)]">
              <video
                src="/videos/vertical-03.mp4"
                poster="/images/Aufbau/business-intro-poster.webp"
                className="absolute inset-0 h-full w-full object-cover"
                muted
                loop
                playsInline
                autoPlay
                preload="metadata"
                aria-label={t.intro.videoAlt}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--pepe-black)]/60 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-[var(--pepe-black)] to-[var(--pepe-ink)]">
        <div className="stage-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-6">
              {t.services.title}
            </h2>
            <p className="text-lg text-[var(--pepe-t64)] max-w-2xl mx-auto leading-relaxed">
              {t.services.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {t.services.items.map((service, index) => (
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
              {t.packages.title}
            </h2>
            <p className="text-lg text-[var(--pepe-t64)] max-w-2xl mx-auto leading-relaxed">
              {t.packages.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {t.packages.items.map((pkg, index) => {
              const isHighlighted = index === 1 // "Premium Show" ist Bestseller
              return (
                <div
                  key={index}
                  className={`relative bg-[var(--pepe-ink)] border rounded-2xl p-6 md:p-8 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(0,0,0,0.35)] transition-all duration-300 ease-out ${
                    isHighlighted
                      ? 'border-[var(--pepe-gold)] ring-1 ring-[var(--pepe-gold)]'
                      : 'border-[var(--pepe-line)] hover:border-[var(--pepe-gold)]'
                  }`}
                >
                  {isHighlighted && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-semibold bg-[var(--pepe-gold)] text-[var(--pepe-black)]">
                      {t.packages.popularBadge}
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
                  <Link href={localizedHref(lang, '/contact')} className="block">
                    <Button
                      variant={isHighlighted ? 'primary' : 'secondary'}
                      className="w-full"
                    >
                      {t.packages.ctaInquire}
                    </Button>
                  </Link>
                </div>
              )
            })}
          </div>

          <div className="text-center mt-16">
            <p className="text-[var(--pepe-t64)] mb-6">{t.packages.bespokeText}</p>
            <Link href={localizedHref(lang, '/contact')}>
              <Button variant="ghost">{t.packages.bespokeCta}</Button>
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
                src="/images/Aufbau/dome-interior.jpg"
                alt={t.venue.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-10">
                {t.venue.title}
              </h2>
              <div className="space-y-8">
                {t.venue.items.map((item, i) => (
                  <div key={i} className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-xl bg-[var(--pepe-gold)]/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-[var(--pepe-gold)] text-xl">{item.icon}</span>
                    </div>
                    <div>
                      <h4 className="text-[var(--pepe-white)] font-semibold mb-4">{item.title}</h4>
                      <p className="text-[var(--pepe-t64)] leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-32">
        <div className="stage-container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 mx-auto mb-10 rounded-full bg-[var(--pepe-gold)]/10 flex items-center justify-center">
              <span className="text-[var(--pepe-gold)] text-3xl leading-none">&#127881;</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-6">
              {t.cta.title}
            </h2>
            <p className="text-[var(--pepe-t80)] text-lg mb-12">
              {t.cta.text}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href={localizedHref(lang, '/contact')}>
                <Button variant="primary" size="lg">{t.cta.contact}</Button>
              </Link>
              <a href="mailto:info@pepe-dome.de">
                <Button variant="secondary" size="lg">info@pepe-dome.de</Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
