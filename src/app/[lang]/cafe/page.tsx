/**
 * Café Page — localized (DE / EN)
 *
 * Eigene Seite für das Café am Pepe Dome. Lädt Texte aus dem Dictionary
 * (cafe-Block). Die Gäste-Bewertungen kommen aus cafe.reviews.items —
 * die Sektion erscheint erst, sobald echte Zitate dort stehen.
 */

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import CafeReviewsSlider, { type SliderReview } from '@/components/custom/CafeReviewsSlider'
import { getGoogleReviews } from '@/lib/google-reviews'
import { isLocale, localizedHref, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/get-dictionary'

const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=Pepe+Dome+Theatron+im+Ostpark+M%C3%BCnchen'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang: rawLang } = await params
  if (!isLocale(rawLang)) return {}
  const dict = await getDictionary(rawLang)
  return {
    title: dict.cafe.meta.title,
    description: dict.cafe.meta.description,
    alternates: { canonical: `https://www.pepe-dome.de/${rawLang}/cafe` },
  }
}

export default async function CafePage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang: rawLang } = await params
  if (!isLocale(rawLang)) notFound()
  const lang: Locale = rawLang
  const dict = await getDictionary(lang)
  const t = dict.cafe

  // Bewertungen: bevorzugt live aus Google Places, sonst manuell gepflegte
  // Reviews aus dem Dictionary. Slider erscheint nur, wenn welche da sind.
  const google = await getGoogleReviews(lang)
  const manualReviews = (t.reviews?.items ?? []) as { text: string; author: string }[]
  const sliderReviews: SliderReview[] =
    google && google.reviews.length > 0
      ? google.reviews
      : manualReviews.map((r) => ({ author: r.author, text: r.text, rating: 5 }))

  const ratingLine =
    google && google.rating
      ? `${google.rating.toLocaleString(lang === 'en' ? 'en-US' : 'de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}${
          google.total ? ` · ${google.total} ${lang === 'en' ? 'reviews on Google' : 'Bewertungen bei Google'}` : ''
        }`
      : undefined
  const viaLabel = lang === 'en' ? 'via Google' : 'via Google'

  return (
    <div className="min-h-screen bg-[var(--pepe-black)]">
      {/* ── HERO ── */}
      <section className="relative h-[60vh] min-h-[440px] max-h-[680px] overflow-hidden">
        <Image
          src="/images/cafe/cafe-hero.webp"
          alt={t.hero.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--pepe-black)] via-[var(--pepe-black)]/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 z-10 pb-10 pt-24 bg-gradient-to-t from-black/85 via-black/45 to-transparent">
          <div className="stage-container">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-[var(--pepe-gold)]/20 text-[var(--pepe-gold)] border border-[var(--pepe-gold)]/40 mb-4 backdrop-blur-sm">
              Café
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--pepe-white)] leading-tight [text-shadow:0_2px_16px_rgba(0,0,0,0.7)]">
              {t.hero.title}
            </h1>
            <p className="mt-4 text-lg md:text-2xl text-[var(--pepe-gold-hover)] font-medium max-w-2xl [text-shadow:0_1px_8px_rgba(0,0,0,0.8)]">
              {t.hero.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* ── INTRO + ÖFFNUNGSZEITEN ── */}
      <section className="py-16 md:py-24">
        <div className="stage-container">
          <div className="grid lg:grid-cols-[1fr_360px] gap-12 lg:gap-16 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-6">
                {t.intro.title}
              </h2>
              <p className="text-lg text-[var(--pepe-t80)] leading-relaxed">
                {t.intro.text}
              </p>
            </div>

            {/* Öffnungszeiten-Karte */}
            <aside className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-7 md:p-8 lg:sticky lg:top-24">
              <h3 className="text-lg font-bold text-[var(--pepe-white)] mb-5 flex items-center gap-2">
                <span className="text-[var(--pepe-gold)]">🕐</span> {t.hours.title}
              </h3>
              <div className="mb-5">
                <div className="text-xs font-bold uppercase tracking-widest text-[var(--pepe-gold)] mb-1">
                  {t.hours.daysLabel}
                </div>
                <div className="text-[var(--pepe-white)] font-medium">{t.hours.days}</div>
                <div className="text-2xl font-bold text-[var(--pepe-white)] tabular-nums mt-1">
                  {t.hours.time}
                </div>
              </div>
              <p className="text-sm text-[var(--pepe-t80)] leading-relaxed mb-6 pb-6 border-b border-[var(--pepe-line)]">
                {t.hours.note}
              </p>
              <div className="text-xs font-bold uppercase tracking-widest text-[var(--pepe-gold)] mb-2">
                {t.hours.addressLabel}
              </div>
              <p className="text-sm text-[var(--pepe-t80)] leading-relaxed">
                {t.hours.address}
                <br />
                {t.hours.transport}
              </p>
              <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="inline-block mt-5">
                <Button variant="secondary" size="sm">{t.hours.directions}</Button>
              </a>
            </aside>
          </div>
        </div>
      </section>

      {/* ── ANREISE ── */}
      <section className="py-16 md:py-24 bg-[var(--pepe-ink)]/40">
        <div className="stage-container">
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-4">
              {t.anreise.title}
            </h2>
            <p className="text-lg text-[var(--pepe-t80)] leading-relaxed">
              {t.anreise.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[t.anreise.navTip, t.anreise.car, t.anreise.transit].map((way, i) => (
              <div
                key={i}
                className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-7"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--pepe-gold)]/10 flex items-center justify-center mb-5">
                  <span className="text-2xl leading-none">{way.icon}</span>
                </div>
                <h3 className="text-lg font-bold text-[var(--pepe-white)] mb-3">{way.title}</h3>
                <p className="text-[var(--pepe-t80)] text-sm leading-relaxed">{way.text}</p>
              </div>
            ))}
          </div>

          <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="inline-block mt-8">
            <Button variant="secondary" size="md">{t.hours.directions}</Button>
          </a>
        </div>
      </section>

      {/* ── ATMOSPHÄRE ── */}
      <section className="py-16 md:py-24">
        <div className="stage-container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative h-80 lg:h-[520px] rounded-2xl overflow-hidden bg-[var(--pepe-surface)] order-1 lg:order-2">
              <Image
                src="/images/cafe/cafe-atmosphere-1.webp"
                alt={t.atmosphere.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-6">
                {t.atmosphere.title}
              </h2>
              <p className="text-lg text-[var(--pepe-t80)] leading-relaxed mb-8">
                {t.atmosphere.text}
              </p>
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 bg-[var(--pepe-surface)] border border-[var(--pepe-line)]">
                  <Image
                    src="/images/cafe/cafe-barista.webp"
                    alt={t.atmosphere.baristaNote}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <p className="text-sm text-[var(--pepe-t64)]">{t.atmosphere.baristaNote}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BEWERTUNGEN — Google-Review-Slider (erscheint, sobald Reviews da sind) ── */}
      {sliderReviews.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="stage-container">
            <CafeReviewsSlider
              reviews={sliderReviews}
              title={t.reviews.title}
              subtitle={t.reviews.subtitle}
              ratingLine={ratingLine}
              viaLabel={viaLabel}
            />
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-[var(--pepe-ink)] to-[var(--pepe-black)]">
        <div className="stage-container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-5">
              {t.cta.title}
            </h2>
            <p className="text-[var(--pepe-t80)] text-lg mb-10">{t.cta.text}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href={localizedHref(lang, '/events')}>
                <Button variant="primary" size="lg">{t.cta.events}</Button>
              </Link>
              <a href={MAPS_URL} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="lg">{t.cta.directions}</Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
