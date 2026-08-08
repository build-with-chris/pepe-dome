/**
 * Home Page — localized (DE / EN)
 *
 * Statische Texte stammen aus src/dictionaries/{lang}.json.
 * Dynamische Daten (Events/News) kommen weiterhin aus der DB.
 *
 * Migrations-Stand: HOME (erste lokalisierte Seite).
 */

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import nextDynamic from 'next/dynamic'
import { isLocale, localizedHref, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/get-dictionary'
import { pageMetadata } from '@/lib/seo'
import { heroTeaser } from '@/lib/hero-teaser'
import { cn } from '@/lib/utils'
import {
  getFeaturedArticles,
  getRecentArticles,
  getUpcomingEvents,
  type EventData,
  type ArticleData,
} from '@/lib/db-data'
import EventsCarousel from '@/components/custom/EventsCarousel'
import NewsCard from '@/components/custom/NewsCard'
import SignupForm from '@/components/custom/SignupForm'
import { Button } from '@/components/ui/Button'
import HomeDotCloud from '@/components/custom/HomeDotCloud'
import HeroBackgroundVideo from '@/components/custom/HeroBackgroundVideo'

const VideoCarousel = nextDynamic(() => import('@/components/custom/VideoCarousel'), { ssr: true })

export const dynamic = 'force-dynamic'

/**
 * Die Startseite hatte keine eigenen Metadaten und erbte deshalb komplett vom
 * Root-Layout — inklusive `alternates.canonical: 'https://www.pepe-dome.de'`.
 * Damit sagten /de *und* /en dem Crawler "die kanonische Fassung bin ich nicht,
 * sondern die Startseite ohne Locale". Folge: /en wurde als Duplikat behandelt
 * und die wichtigste Seite der Site trug auf Englisch deutschen Titel und
 * deutsche Beschreibung.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang: rawLang } = await params
  if (!isLocale(rawLang)) return {}
  const dict = await getDictionary(rawLang)
  return pageMetadata({
    lang: rawLang,
    path: '/',
    title: dict.home.meta.title,
    description: dict.home.meta.description,
    keywords: [
      'Pepe Dome',
      'Zirkus München',
      'Artistik München',
      'Ostpark München',
      'Shows München',
      'Veranstaltungsort München',
    ],
  })
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang: rawLang } = await params
  if (!isLocale(rawLang)) notFound()
  const lang: Locale = rawLang

  const dict = await getDictionary(lang)
  const t = dict.home

  let displayEvents: EventData[] = []
  let displayNews: ArticleData[] = []

  try {
    const [featuredArticles, recentArticles, upcomingEvents] = await Promise.all([
      getFeaturedArticles(lang),
      getRecentArticles(4, lang),
      getUpcomingEvents(lang),
    ])
    displayEvents = upcomingEvents.slice(0, 3)
    const merged = featuredArticles.length > 0
      ? [...featuredArticles, ...recentArticles.filter((a) => !featuredArticles.find((f) => f.id === a.id))]
      : recentArticles
    displayNews = merged
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 3)
  } catch (err) {
    console.error('HomePage data error:', err)
  }

  // Features — Reihenfolge + Icons sind fix, Texte lokalisiert
  const featureKeys: Array<'show' | 'training' | 'dome' | 'community'> = [
    'show',
    'training',
    'dome',
    'community',
  ]
  const featureImages: Record<string, string> = {
    show: '/images/shows/carmen-jonas-duo.jpg',
    training: '/images/Kategorien/Training.webp',
    dome: '/images/Kategorien/Location.webp',
    community: '/images/Kategorien/Community.webp',
  }
  const featureEmojis: Record<string, string> = {
    show: '🎭',
    training: '💪',
    dome: '🏛️',
    community: '🤝',
  }
  // Jede Karte führt zur passenden Seite — keine Sackgassen
  const featureLinks: Record<string, string> = {
    show: '/events',
    training: '/training',
    dome: '/about',
    community: '/news',
  }
  const dateLocale = lang === 'en' ? 'en-US' : 'de-DE'
  // Nächster Termin für die Zeile im Hero. Siehe src/lib/hero-teaser.ts.
  const teaser = heroTeaser(displayEvents, lang)
  // `url` ist optional: ein Zitat ohne hinterlegten Artikel bleibt ein reines
  // Zitat, eines mit URL wird zur anklickbaren Karte.
  const pressQuotes = (t.press?.quotes ?? []) as {
    text: string
    source: string
    url?: string
  }[]

  return (
    <>
      {/* ===== Hero Section ===== */}
      {/*
        80dvh statt 100dvh: bei voller Bildschirmhöhe endete der erste Eindruck
        mit zwei Buttons und darunter nichts. Kein Hinweis, dass mehr kommt, und
        auf dem Handy verdeckte der Cookie-Banner genau die Buttons. Bei 80dvh
        ragt die Überschrift des nächsten Abschnitts in den Schirm, das ist die
        Einladung zum Weiterscrollen.
      */}
      <section className="relative min-h-[80dvh] md:min-h-[85vh] flex flex-col overflow-hidden bg-[var(--pepe-black)] -mt-20 pt-20">
        <div className="absolute inset-0 pointer-events-none">
          <HeroBackgroundVideo />
          {/*
            Scrim mobil bewusst leichter als auf Desktop: Auf dem Smartphone
            füllt das Hochformat-Video die ganze Fläche und ist der eigentliche
            Blickfang. Den Textkontrast übernimmt hier vor allem der radiale
            Schatten hinter dem Titel plus die text-shadow der Schrift.
            Auf Desktop bleibt der kräftigere Scrim, weil das Querformat-Video
            heller ist und die Schrift über die volle Breite lesbar sein muss.

            Die mobilen Stopps sind bewusst zurückgenommen. Vorher lief der
            Verlauf oben mit 45% Schwarz los und unten in *volles* Schwarz aus,
            dazu kam der radiale Schatten und darunter noch eine 128px hohe
            Blende. In Summe blieb vom Bild nur ein Band in der Bildschirmmitte
            übrig — der Hero wirkte klein, obwohl das Medium die ganzen 100dvh
            einnahm. Jetzt endet der Verlauf bei 80% und setzt erst bei 55% der
            Höhe an, das Bild bleibt bis weit nach unten sichtbar.
          */}
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--pepe-black)]/25 from-0% via-transparent via-55% to-[var(--pepe-black)]/80 md:from-[var(--pepe-black)]/70 md:via-[var(--pepe-black)]/35 md:via-50% md:to-[var(--pepe-black)]" />
          <div className="absolute inset-0 hidden md:block bg-gradient-to-r from-[var(--pepe-black)]/40 to-[var(--pepe-black)]/40" />
          {/* Weicher radialer Schatten direkt hinter dem Titeltext (kein harter Kasten) */}
          <div className="absolute inset-0 [background:radial-gradient(ellipse_80%_26%_at_50%_18%,rgba(0,0,0,0.55),transparent_72%)] md:[background:radial-gradient(ellipse_65%_45%_at_50%_34%,rgba(0,0,0,0.55),transparent_72%)]" />
        </div>

        <HomeDotCloud />

        <div className="stage-container relative z-10 flex-shrink-0 pt-[2.31rem] md:pt-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-[var(--pepe-white)] leading-tight [text-shadow:0_2px_18px_rgba(0,0,0,0.85)]">
              {t.hero.title}
            </h1>
            {/*
              Der Untertitel erklärt, er ruft nicht.
              Vorher stand er fett und in Markenblau direkt unter der fetten
              weissen Überschrift, auf dem Handy in drei Zeilen. Zwei Titel
              nebeneinander, und der erste Bildschirm wirkte überladen. Jetzt
              normale Schrift in gedecktem Weiss. Der Schatten bleibt, das Video
              darunter ist stellenweise hell.
            */}
            <p className="mt-4 text-base md:text-xl text-[var(--pepe-t80)] max-w-2xl mx-auto [text-shadow:0_1px_3px_rgba(0,0,0,0.95),0_2px_14px_rgba(0,0,0,0.8)]">
              {t.hero.subtitle}
            </p>

            {/*
              Die eine konkrete Angabe oben.
              Vorher stand oberhalb der Falte kein Datum, kein Preis, keine
              Adresse, obwohl die nächsten Termine im Server-Render bereitlagen.
              Steht nichts an, fällt die Zeile weg statt leer zu bleiben.
            */}
            {teaser && (
              <Link
                href={localizedHref(lang, `/events/${teaser.slug}`)}
                className="mt-4 inline-flex flex-wrap items-center justify-center gap-x-2 rounded-full border border-white/25 bg-black/40 px-4 py-2 text-xs sm:text-sm text-[var(--pepe-white)] backdrop-blur-sm transition-colors hover:border-white/50"
              >
                <span className="text-[var(--pepe-t64)]">{t.hero.nextLabel}</span>
                <span className="font-semibold">{teaser.when}</span>
                {teaser.free && (
                  <span className="text-[var(--pepe-accent-text)]">{t.hero.freeEntry}</span>
                )}
              </Link>
            )}
          </div>
        </div>

        {/*
          Auf dem Handy nur ein kleiner Abstand statt einer wachsenden Lücke.
          Der Platzhalter drückte die beiden Buttons an den unteren Rand des
          Heros, also genau dorthin, wo der Cookie-Banner sitzt. Weiter oben sind
          sie beim ersten Blick erreichbar, und das Video bleibt darunter
          sichtbar. Auf Desktop bleibt es beim Verteilen über die ganze Höhe.
        */}
        <div className="relative z-10 h-4 flex-none md:h-auto md:flex-1 md:min-h-[1rem]" />

        {/* dvh statt vh: der Container oben ist min-h-[100dvh]. Mit `22vh` für
            diesen Block rechnete der Browser gegen die *large* viewport height,
            also gegen eine grössere Zahl als die 100dvh des Elternteils — auf
            iOS Safari passten die Teile deshalb nicht zusammen und der
            CTA-Block wurde zu hoch. */}
        <div className="relative z-10 flex h-auto flex-col items-center justify-center pt-4 pb-6 md:h-[20dvh] md:min-h-[160px] md:pt-0 md:pb-8">
          <div className="flex flex-col items-center gap-4 justify-center">
            <Link href={localizedHref(lang, '/events')} className="w-full sm:w-auto flex justify-center sm:block">
              <Button variant="primary" size="xl" className="min-w-[200px] sm:min-w-[220px] w-full sm:w-auto">
                {t.hero.ctaPrimary}
              </Button>
            </Link>
            {/*
              Ein Weg, nicht zwei gleichrangige.
              Vorher standen hier zwei gleich grosse Buttons, auf dem Handy
              untereinander, zusammen rund 160 Pixel. Das Training ist der
              engere Weg und steht deshalb als Textlink darunter. Nebeneffekt:
              der alte zweite Button war mit seinem #333-Rahmen ueber dem
              dunklen Hero ohnehin kaum als Button zu erkennen.
            */}
            <Link
              href={localizedHref(lang, '/training')}
              className="inline-flex items-center gap-2 py-2 text-base font-semibold text-[var(--pepe-t80)] underline-offset-4 transition-colors hover:text-[var(--pepe-white)] hover:underline [text-shadow:0_1px_3px_rgba(0,0,0,0.95)]"
            >
              {t.hero.ctaSecondary}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Übergang in den nächsten Abschnitt. Auf Mobile flacher (h-20 statt
            h-32), weil dieselbe Blende dort einen deutlich grösseren Anteil des
            Bildes verdeckt als auf einem breiten Schirm. */}
        <div className="absolute bottom-0 left-0 right-0 h-20 md:h-32 bg-gradient-to-t from-[var(--pepe-black)] to-transparent pointer-events-none" />
      </section>

      {/* ===== Kommende Events ===== */}
      <section className="py-12 md:py-16 bg-[var(--pepe-black)]">
        <div className="stage-container">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-2">
                {t.upcomingEvents.title}
              </h2>
              <p className="text-[var(--pepe-t64)] text-sm md:text-base">
                {t.upcomingEvents.subtitle}
              </p>
            </div>
            <Link href={localizedHref(lang, '/events')}>
              <Button variant="ghost" size="sm">
                {t.upcomingEvents.viewAll}
              </Button>
            </Link>
          </div>

          {displayEvents.length > 0 ? (
            <EventsCarousel
              lang={lang}
              eventsHref={localizedHref(lang, '/events')}
              freeEntryLabel={dict.events.freeBadge}
              trailerLabels={dict.events.trailer}
              privacyHref={localizedHref(lang, '/datenschutz')}
              prevLabel={t.upcomingEvents.prev}
              nextLabel={t.upcomingEvents.next}
              events={displayEvents.map((e) => ({
                id: e.id,
                slug: e.slug,
                title: e.title,
                description: e.description,
                date: e.date,
                time: e.time,
                category: e.category,
                imageUrl: e.imageUrl,
                price: e.price,
                trailerUrl: e.trailerUrl,
              }))}
            />
          ) : (
            <div className="text-center py-10 bg-[var(--pepe-ink)] rounded-xl border border-[var(--pepe-line)]">
              <p className="text-[var(--pepe-t64)]">{t.upcomingEvents.empty}</p>
              <Link href={localizedHref(lang, '/events')} className="text-[var(--pepe-accent-text)] hover:underline mt-2 inline-block">
                {t.upcomingEvents.viewAll}
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ===== Features Grid ===== */}
      <section className="py-10 md:py-24 bg-[var(--pepe-black)]">
        <div className="stage-container">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-6">
              {t.features.title}
            </h2>
            <p className="text-lg text-[var(--pepe-t64)] max-w-2xl mx-auto leading-relaxed">
              {t.features.subtitle}
            </p>
          </div>

          <div className="features-grid">
            {featureKeys.map((key) => {
              const feature = t.features.items[key]
              return (
                <Link
                  key={key}
                  href={localizedHref(lang, featureLinks[key])}
                  className="group min-w-0 block bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl overflow-hidden hover:border-[var(--pepe-gold)] transition-all duration-500 ease-out shadow-lg hover:shadow-[0_20px_40px_rgba(0,0,0,0.4),0_0_15px_var(--pepe-gold-glow)]"
                >
                  <div className="relative aspect-video w-full overflow-hidden">
                    <Image
                      src={featureImages[key] || '/TheDome.png'}
                      alt={feature.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      loading="lazy"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--pepe-ink)] to-transparent" />
                    <div className="absolute bottom-4 left-4 w-12 h-12 rounded-xl bg-[var(--pepe-gold)]/20 backdrop-blur-md flex items-center justify-center border border-[var(--pepe-gold)]/30">
                      <span className="text-[var(--pepe-accent-text)] text-2xl leading-none">
                        {featureEmojis[key]}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 md:p-8 text-center lg:text-left">
                    <h3 className="text-xl font-bold text-[var(--pepe-white)] mb-4 group-hover:text-[var(--pepe-accent-text)] transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-[var(--pepe-t64)] leading-relaxed mb-4">
                      {feature.description}
                    </p>
                    <span className="text-sm font-semibold text-[var(--pepe-accent-text)]">
                      {t.features.more} →
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== Café Section ===== */}
      <section className="py-10 md:py-20 bg-gradient-to-b from-[var(--pepe-black)] to-[var(--pepe-ink)]">
        {/* Breiten hier bewusst als feste Werte: die max-w-Skala ist im
            Token-Satz auf Breakpoint-Groessen umgebogen (max-w-2xl = 1536px),
            eine Karte mit max-w-2xl wird dadurch fast bildschirmbreit. */}
        <div className="stage-container">
          <div className="mx-auto max-w-[52rem] text-center">
            <span className="inline-block px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest bg-[var(--pepe-gold)]/20 text-[var(--pepe-accent-text)] border border-[var(--pepe-gold)]/40 mb-5">
              {t.cafe.eyebrow}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-4 leading-tight">
              {t.cafe.titleA}<span className="text-[var(--pepe-accent-text)]">{t.cafe.titleB}</span>
            </h2>
            <p className="mx-auto mb-8 max-w-[36rem] text-base md:text-lg text-[var(--pepe-t80)] leading-relaxed">
              {t.cafe.text}
            </p>

            {/* Das Bild traegt die Einladung, deshalb bekommt es hier eine
                echte Flaeche statt eines Briefmarken-Formats. Rechts steht
                nur, was man vor dem Losgehen wissen muss: wann offen ist und
                wo es liegt. */}
            <Link
              href={localizedHref(lang, '/cafe')}
              className="group mx-auto flex max-w-[45rem] flex-col overflow-hidden rounded-2xl border border-[var(--pepe-line)] bg-[var(--pepe-ink)] text-left transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[var(--pepe-gold)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.35),0_0_8px_var(--pepe-gold-glow)] sm:flex-row"
            >
              <div className="relative aspect-[16/10] w-full flex-shrink-0 overflow-hidden bg-[var(--pepe-surface)] sm:aspect-auto sm:w-[42%] sm:self-stretch">
                <Image
                  src="/Coffee.png"
                  alt={t.cafe.imageAlt}
                  fill
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  sizes="(max-width: 639px) 92vw, 300px"
                />
              </div>

              <div className="flex flex-1 flex-col justify-center gap-1 p-6">
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--pepe-accent-text)]">
                  {t.cafe.hoursLabel}
                </span>
                <p className="text-[var(--pepe-t80)]">{t.cafe.days}</p>
                <p className="text-2xl font-bold tabular-nums text-[var(--pepe-white)] md:text-3xl">
                  {t.cafe.time}
                </p>
                <p className="mt-4 text-sm text-[var(--pepe-t64)]">{t.cafe.address}</p>
                <span className="mt-3 text-sm font-semibold text-[var(--pepe-accent-text)]">
                  {t.features.more} →
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Pressestimmen (erscheint erst, wenn Zitate im Dictionary stehen) ===== */}
      {pressQuotes.length > 0 && (
        <section className="py-10 md:py-24 bg-[var(--pepe-ink)]/30">
          <div className="stage-container">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] text-center mb-12">
              {t.press.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {pressQuotes.map((quote, index) => {
                const card = (
                  <blockquote
                    className={cn(
                      'h-full rounded-2xl border border-[var(--pepe-line)] bg-[var(--pepe-ink)] p-6 md:p-8',
                      quote.url &&
                        'transition-colors group-hover:border-[var(--pepe-gold)]'
                    )}
                  >
                    <p className="text-[var(--pepe-t80)] text-lg leading-relaxed mb-4">
                      „{quote.text}“
                    </p>
                    <footer className="flex items-center gap-1.5 text-sm font-semibold text-[var(--pepe-accent-text)]">
                      {quote.source}
                      {quote.url && (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                          className="h-3.5 w-3.5"
                        >
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <path d="M15 3h6v6" />
                          <path d="M10 14 21 3" />
                        </svg>
                      )}
                    </footer>
                  </blockquote>
                )

                if (!quote.url) return <div key={index}>{card}</div>

                return (
                  <a
                    key={index}
                    href={quote.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    // Der Artikel liegt beim Verlag, nicht bei uns. Der Titel
                    // sagt deshalb dazu, wohin der Klick führt.
                    aria-label={`${t.press.readAt ?? ''} ${quote.source}`.trim()}
                    className="group block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pepe-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pepe-black)]"
                  >
                    {card}
                  </a>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ===== Video Carousel ===== */}
      <section className="py-8 md:py-16 bg-[var(--pepe-black)]">
        <div className="stage-container mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] text-center mb-4">
            {t.videoCarousel.title}
          </h2>
          <p className="text-[var(--pepe-t64)] text-lg text-center max-w-2xl mx-auto">
            {t.videoCarousel.subtitle}
          </p>
        </div>
        <VideoCarousel />
        {/* Weg zur Galerie.
            70 Bilder mit Lightbox sind der stärkste Grund, länger zu bleiben,
            und waren von der Startseite aus nur über das Klappmenü "Mehr"
            erreichbar. Hier steht der Hinweis da, wo gerade Bewegtbild läuft. */}
        <div className="stage-container mt-8 text-center">
          <Link
            href={localizedHref(lang, '/galerie')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--pepe-accent-text)] underline-offset-4 hover:underline"
          >
            {t.videoCarousel.galleryLink}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      {/* ===== Latest News ===== */}
      <section className="py-12 md:py-32 bg-gradient-to-b from-[var(--pepe-black)] via-[var(--pepe-ink)]/30 to-[var(--pepe-black)]">
        <div className="stage-container">
          <div className="flex flex-col items-center text-center mb-10 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-4">
              {t.news.title}
            </h2>
            <p className="text-[var(--pepe-t64)] text-lg mb-6">{t.news.subtitle}</p>
            <Link href={localizedHref(lang, '/news')}>
              <Button variant="ghost" size="sm">
                {t.news.viewAll}
              </Button>
            </Link>
          </div>

          {displayNews.length > 0 ? (
            // Ein einzelner Artikel stand bisher allein in einer Spalte, die
            // ueber max-w-2xl fast bildschirmbreit war: das Aufmacherbild
            // wurde dadurch hoeher als der halbe Bildschirm. Jetzt stehen bis
            // zu drei Artikel im selben Raster wie die Events darueber, und
            // bei weniger Artikeln bleibt die Spalte auf Lesebreite.
            <div
              className={cn(
                'grid gap-5',
                displayNews.length === 1 && 'mx-auto max-w-[34rem]',
                displayNews.length === 2 && 'sm:grid-cols-2',
                displayNews.length >= 3 && 'sm:grid-cols-2 lg:grid-cols-3'
              )}
            >
              {displayNews.map((article) => (
                <NewsCard
                  key={article.id}
                  title={article.title}
                  excerpt={article.excerpt}
                  date={new Date(article.publishedAt).toLocaleDateString(dateLocale, {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                  author={article.author}
                  category={article.category}
                  image={article.imageUrl || undefined}
                  href={`${localizedHref(lang, '/news')}/${article.slug}`}
                  featured={false}
                />
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-[34rem] rounded-xl border border-[var(--pepe-line)] bg-[var(--pepe-ink)] py-12 text-center">
              <p className="text-[var(--pepe-t64)]">{t.news.empty}</p>
            </div>
          )}
        </div>
      </section>

      {/* ===== Newsletter CTA ===== */}
      <section className="py-12 md:py-32 bg-gradient-to-b from-[var(--pepe-black)] to-[var(--pepe-ink)]">
        <div className="stage-container">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 mx-auto mb-10 rounded-full bg-[var(--pepe-gold)]/10 flex items-center justify-center">
              <span className="text-[var(--pepe-accent-text)] text-3xl leading-none">&#9993;</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-6">
              {t.newsletter.title}
            </h2>
            <p className="text-[var(--pepe-t80)] text-lg mb-10">
              {t.newsletter.text}
            </p>

            <div className="max-w-md mx-auto">
              <SignupForm variant="simple" lang={lang} source="startseite" />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
