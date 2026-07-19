/**
 * Training Page — localized (DE / EN)
 *
 * UI-Chrome (Hero, Booking, Specials, Disciplines, Location, CTA) wird
 * vollständig aus dem Dictionary geladen. Die Wochenplan-Daten (woche)
 * sowie die Kurs-Detailtexte stammen aus src/data/training-data.ts und
 * sind im MVP nur auf Deutsch — Day-Namen + `note` werden für EN
 * on-the-fly übersetzt.
 */

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import HeroSection from '@/components/custom/HeroSection'
import TrainingsortOverlapImages from '@/components/custom/TrainingsortOverlapImages'
import { Button } from '@/components/ui/Button'
import CourseScheduleGrid, { type Tag } from '@/components/custom/CourseScheduleGrid'
import StickyBookingButton from '@/components/custom/StickyBookingButton'
import EversportsWidget from '@/components/custom/EversportsWidget'
import { isLocale, localizedHref, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/get-dictionary'
import { WOCHE } from '@/data/training-data'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang: rawLang } = await params
  if (!isLocale(rawLang)) return {}
  const dict = await getDictionary(rawLang)
  return {
    title: dict.training.meta.title,
    description: dict.training.meta.description,
  }
}

// ── Day-Name- & Note-Übersetzung für die englische Variante ──────────────
const DAY_DE_TO_EN: Record<string, string> = {
  Montag: 'Monday',
  Dienstag: 'Tuesday',
  Mittwoch: 'Wednesday',
  Donnerstag: 'Thursday',
  Freitag: 'Friday',
  Samstag: 'Saturday',
  Sonntag: 'Sunday',
}

const NOTE_DE_TO_EN: Record<string, string> = {
  'In Planung — Workshops & Vermietung folgen':
    'In planning — workshops & rentals to follow',
  'Tricking & Breaking in Planung — Termine folgen.':
    'Tricking & breaking planned — dates to follow.',
  'Cyr Wheel findet an showfreien Freitagen statt — Termine immer auf der Startseite.':
    'Cyr Wheel takes place on show-free Fridays — dates always on the homepage.',
}

function localizeWoche(woche: Tag[], lang: Locale): Tag[] {
  if (lang === 'de') return woche
  return woche.map((tag) => ({
    ...tag,
    day: DAY_DE_TO_EN[tag.day] ?? tag.day,
    note: tag.note ? NOTE_DE_TO_EN[tag.note] ?? tag.note : undefined,
    kurse: tag.kurse.map((k) => ({
      ...k,
      day: DAY_DE_TO_EN[k.day] ?? k.day,
    })),
  }))
}

export default async function TrainingPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang: rawLang } = await params
  if (!isLocale(rawLang)) notFound()
  const lang: Locale = rawLang
  const dict = await getDictionary(lang)
  const t = dict.training
  const woche = localizeWoche(WOCHE, lang)

  return (
    <div className="min-h-screen bg-[var(--pepe-black)]">
      <StickyBookingButton targetId="buchung" />

      {/* ── HERO ── */}
      <HeroSection
        title={t.hero.title}
        subtitle={t.hero.subtitle}
        size="sm"
        dotCloudIcon="training"
      />

      {/* ── INTRO ── */}
      <section className="pt-16 md:pt-24 pb-8 md:pb-12">
        <div className="stage-container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-6">
                {t.intro.title}
              </h2>
              <p className="text-lg text-[var(--pepe-t80)] mb-8 leading-relaxed">
                {t.intro.text}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="#buchung">
                  <Button variant="primary" size="lg">{t.intro.ctaBook}</Button>
                </Link>
                <Link href="#kursprogramm">
                  <Button variant="secondary" size="lg">{t.intro.ctaSchedule}</Button>
                </Link>
              </div>
            </div>
            <div className="relative h-80 lg:h-[450px] rounded-2xl overflow-hidden bg-[var(--pepe-surface)]">
              <Image
                src="/images/shows/aerial-silk-01.jpg"
                alt={t.intro.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--pepe-black)]/60 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Quick-Facts-Strip ── */}
      <section className="pb-16 md:pb-24">
        <div className="stage-container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
            {[
              { label: t.facts.courseStart, value: t.facts.courseStartValue, icon: '🗓' },
              { label: t.facts.audience,    value: t.facts.audienceValue,    icon: '👥' },
              { label: t.facts.trial,       value: t.facts.trialValue,       icon: '🎟' },
              { label: t.facts.location,    value: t.facts.locationValue,    icon: '📍' },
            ].map((f, i) => (
              <div
                key={i}
                className="rounded-xl border border-[var(--pepe-line)] bg-[var(--pepe-ink)] px-4 py-5 md:px-5 md:py-6"
              >
                <div className="text-2xl mb-2 leading-none">{f.icon}</div>
                <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[var(--pepe-gold)] mb-1">
                  {f.label}
                </div>
                <div className="text-sm md:text-base font-bold text-[var(--pepe-white)] leading-snug">
                  {f.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WOCHENPLAN ── */}
      <section id="kursprogramm" className="py-20 md:py-28 bg-[var(--pepe-ink)]/40">
        <div className="stage-container">
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest bg-[var(--pepe-gold)]/20 text-[var(--pepe-gold)] border border-[var(--pepe-gold)]/40 mb-6">
              {t.schedule.pill}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-[var(--pepe-white)] mb-4">
              {t.schedule.title}
            </h2>
            <p className="text-[var(--pepe-t80)] text-lg max-w-2xl mx-auto">
              {t.schedule.text}
            </p>
          </div>

          {/* Legende */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-8 mb-10">
            <div className="flex items-center gap-2.5 text-sm text-[var(--pepe-t80)]">
              <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: '#c4a767' }} />
              {t.schedule.legendKids}
            </div>
            <div className="flex items-center gap-2.5 text-sm text-[var(--pepe-t80)]">
              <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: '#f59e0b' }} />
              {t.schedule.legendTeens}
            </div>
            <div className="flex items-center gap-2.5 text-sm text-[var(--pepe-t80)]">
              <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: '#38bdf8' }} />
              {t.schedule.legendAdults}
            </div>
          </div>

          <CourseScheduleGrid woche={woche} />

          {/* Hinweis-Box */}
          <div className="max-w-3xl mx-auto mt-8">
            <div className="rounded-xl border border-[var(--pepe-line)] bg-[var(--pepe-ink)]/60 px-5 py-4">
              <div className="flex items-start gap-3">
                <span className="text-lg leading-none flex-shrink-0 mt-0.5" aria-hidden="true">ℹ️</span>
                <div className="space-y-2 text-sm">
                  <p className="text-[var(--pepe-t80)]">
                    <span className="font-bold text-[var(--pepe-white)]">{t.schedule.aircrobaticsNoteA}</span>{' '}
                    {t.schedule.aircrobaticsNoteB}{' '}
                    <a
                      href="https://www.aircrobatic-studios.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--pepe-gold)] font-semibold hover:underline"
                    >
                      aircrobatic-studios.com ↗
                    </a>{' '}
                    {t.schedule.aircrobaticsNoteD}
                  </p>
                  <p className="text-[var(--pepe-t80)]">
                    <span className="font-bold text-[var(--pepe-white)]">{t.schedule.trickingNoteA}</span>{' '}
                    {t.schedule.trickingNoteB}
                  </p>
                  <p className="text-[var(--pepe-t80)]">
                    <span className="font-bold text-[var(--pepe-gold)]">{t.schedule.dropInNoteA}</span>{' '}
                    {t.schedule.dropInNoteB}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BUCHUNG — zwei Wege + Partner-Hinweis ── */}
      <section id="buchung" className="py-16 md:py-24 bg-[var(--pepe-black)]">
        <div className="stage-container">
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest bg-[var(--pepe-gold)] text-black mb-4">
              {t.booking.pill}
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-2">
              {t.booking.title}
            </h2>
            <p className="text-[var(--pepe-t80)] text-sm md:text-base max-w-xl mx-auto">
              {t.booking.text}
            </p>
          </div>

          {/* Zwei Buchungswege */}
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-8">
            <div className="rounded-2xl border border-[var(--pepe-gold)]/40 bg-[var(--pepe-ink)] p-7 md:p-8 flex flex-col">
              <h3 className="text-xl font-bold text-[var(--pepe-white)] mb-3">
                {t.booking.eversportsTitle}
              </h3>
              <p className="text-[var(--pepe-t80)] text-sm leading-relaxed flex-1">
                {t.booking.eversportsText}
              </p>
              <p className="mt-5 text-xs font-bold uppercase tracking-widest text-[var(--pepe-gold)]">
                ↓ {t.booking.widgetLabel}
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--pepe-line)] bg-[var(--pepe-ink)] p-7 md:p-8 flex flex-col">
              <h3 className="text-xl font-bold text-[var(--pepe-white)] mb-3">
                {t.booking.aircroTitle}
              </h3>
              <p className="text-[var(--pepe-t80)] text-sm leading-relaxed flex-1">
                {t.booking.aircroText}
              </p>
              <div className="mt-5">
                <a
                  href="https://www.aircrobatic-studios.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="secondary" size="md">{t.booking.aircroCta}</Button>
                </a>
              </div>
            </div>
          </div>

          {/* Eversports-Widget */}
          <div className="max-w-5xl mx-auto rounded-2xl border border-[var(--pepe-gold)]/40 bg-[var(--pepe-ink)] p-3 md:p-5 shadow-[0_8px_40px_rgba(0,0,0,0.5),0_0_24px_var(--pepe-gold-glow)]">
            <EversportsWidget widgetId="02edab2c-44b5-47ec-9bbe-d915ce46a864" />
          </div>

          {/* Wellpass / USC in Vorbereitung */}
          <div className="max-w-5xl mx-auto mt-8">
            <div className="rounded-xl border border-[var(--pepe-gold)]/30 bg-[var(--pepe-gold)]/5 px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="inline-block self-start sm:self-auto flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-[var(--pepe-gold)]/20 text-[var(--pepe-gold)] border border-[var(--pepe-gold)]/40">
                {t.booking.partnerPill}
              </span>
              <p className="text-[var(--pepe-t80)] text-sm">
                {t.booking.partnerText}
              </p>
            </div>
          </div>

          <p className="text-center text-sm text-[var(--pepe-t64)] mt-6">
            {t.booking.viewSchedule}{' '}
            <Link href="#kursprogramm" className="text-[var(--pepe-gold)] hover:underline font-semibold">
              {t.booking.viewScheduleLink}
            </Link>
          </p>
        </div>
      </section>

      {/* ── SPEZIELLE ANGEBOTE ── */}
      <section className="py-20 md:py-28">
        <div className="stage-container">
          <div className="text-center mb-12 md:mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-3">
              {t.specials.title}
            </h2>
            <p className="text-[var(--pepe-t64)] text-lg max-w-2xl mx-auto">
              {t.specials.subtitle}
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Profitraining */}
            <div className="rounded-2xl p-7 md:p-8 bg-[var(--pepe-ink)] border border-[var(--pepe-line)] flex flex-col">
              <span className="inline-block self-start px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-[#25D366]/15 text-[#25D366] border border-[#25D366]/40 mb-5">
                {t.specials.pro.pill}
              </span>
              <h3 className="text-2xl md:text-2xl font-bold text-[var(--pepe-white)] mb-2 leading-tight">
                {t.specials.pro.title}
              </h3>
              <p className="text-[var(--pepe-t80)] mb-3 text-base">
                {t.specials.pro.subtitle}
              </p>
              <p className="text-[var(--pepe-t64)] mb-6 text-sm leading-relaxed flex-1">
                {t.specials.pro.text}
              </p>
              <div>
                <Link href={localizedHref(lang, '/contact') + '?betreff=Profitraining'}>
                  <Button variant="primary" size="md">{t.specials.pro.request}</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LOCATION ── */}
      <section className="py-20 md:py-32">
        <div className="stage-container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-10">
                {t.location.title}
              </h2>
              <div className="space-y-8">
                {[
                  { icon: '📐', title: t.location.ceiling,   text: t.location.ceilingText },
                  { icon: '🔊', title: t.location.acoustics, text: t.location.acousticsText },
                  { icon: '🌳', title: t.location.park,      text: t.location.parkText },
                  { icon: '♿', title: t.location.access,    text: t.location.accessText },
                ].map((f, i) => (
                  <div key={i} className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-xl bg-[var(--pepe-gold)]/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-[var(--pepe-gold)] text-xl">{f.icon}</span>
                    </div>
                    <div>
                      <h4 className="text-[var(--pepe-white)] font-semibold mb-4">{f.title}</h4>
                      <p className="text-[var(--pepe-t64)] leading-relaxed">{f.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-80 lg:h-[450px] rounded-2xl overflow-hidden bg-[var(--pepe-surface)] order-1 lg:order-2">
              <TrainingsortOverlapImages />
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-[var(--pepe-ink)] to-[var(--pepe-black)]">
        <div className="stage-container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 mx-auto mb-10 rounded-full bg-[var(--pepe-gold)]/10 flex items-center justify-center">
              <span className="text-[var(--pepe-gold)] text-3xl leading-none">&#127947;</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-6">
              {t.cta.title}
            </h2>
            <p className="text-[var(--pepe-t80)] text-lg mb-12">{t.cta.text}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href={localizedHref(lang, '/contact')}>
                <Button variant="primary" size="lg">{t.cta.contact}</Button>
              </Link>
              <Link href={localizedHref(lang, '/events') + '?category=WORKSHOP'}>
                <Button variant="secondary" size="lg">{t.cta.workshops}</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
