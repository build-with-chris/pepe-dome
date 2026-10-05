/**
 * Galerie — lokalisiert (DE / EN)
 *
 * Server Component. Die Bildliste liegt in src/data/gallery.ts, die UI-Texte im
 * Dictionary unter `gallery`. Die Bilder stehen in Kapiteln mit Überschrift und
 * kurzem Text statt in einem Raster mit Filter-Tabs: so hat die Seite echten
 * Text für Suchmaschinen, und wer sie durchscrollt, bekommt eine Reihenfolge
 * statt eines Bildertopfs. Nur die Lightbox braucht State, deshalb ist jedes
 * Kapitel-Raster eine Client-Komponente (GalleryGrid); Überschriften, Texte,
 * Alt-Texte und JSON-LD kommen serverseitig ins HTML.
 *
 * Der Pfad heißt /galerie und nicht /gallery: Suchanfragen aus dem Zielgebiet
 * lauten "pepe dome galerie" oder "pepe dome bilder". Für die englische Fassung
 * bleibt derselbe Pfad (/en/galerie), damit hreflang und canonical auf einer
 * Pfadstruktur sitzen und ein geteilter Link in beiden Sprachen funktioniert.
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isLocale, localizedHref, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/get-dictionary'
import { pageMetadata } from '@/lib/seo'
import {
  GALLERY_IMAGES,
  imagesByCategory,
  showImagesByDiscipline,
  usedCategories,
} from '@/data/gallery'
import GalleryGrid from '@/components/custom/GalleryGrid'
import { Button } from '@/components/ui/Button'
import { ImageGalleryJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang: rawLang } = await params
  if (!isLocale(rawLang)) return {}
  const dict = await getDictionary(rawLang)

  // Das erste Bild der Liste ist das Sharing-Bild der Seite. Ein Galerie-Link
  // in WhatsApp soll ein Foto zeigen, nicht das generische Logo-Banner.
  const lead = GALLERY_IMAGES[0]

  return pageMetadata({
    lang: rawLang,
    path: '/galerie',
    title: dict.gallery.meta.title,
    description: dict.gallery.meta.description,
    keywords: [
      'Pepe Dome Bilder',
      'Pepe Dome Galerie',
      'Zirkus München Fotos',
      'Ostpark München',
      'Veranstaltungsort München Bilder',
    ],
    images: lead
      ? [{ url: lead.src, width: lead.width, height: lead.height, alt: lead.alt[rawLang] }]
      : undefined,
  })
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang: rawLang } = await params
  if (!isLocale(rawLang)) notFound()
  const lang: Locale = rawLang
  const dict = await getDictionary(lang)
  const t = dict.gallery

  const categories = usedCategories()
  const showGroups = showImagesByDiscipline()
  const gridTexts = { lightbox: t.lightbox }

  return (
    <div className="min-h-screen bg-[var(--pepe-black)]">
      <ImageGalleryJsonLd
        name={t.meta.title}
        description={t.meta.description}
        url={`/${lang}/galerie`}
        images={GALLERY_IMAGES.map((image) => ({
          src: image.src,
          alt: image.alt[lang],
          caption: image.caption?.[lang],
          width: image.width,
          height: image.height,
        }))}
      />
      <BreadcrumbJsonLd
        items={[
          { name: lang === 'en' ? 'Home' : 'Start', url: `/${lang}` },
          { name: t.hero.eyebrow, url: `/${lang}/galerie` },
        ]}
      />

      {/* ── Kopf ─────────────────────────────────────────────────────────── */}
      <header className="stage-container pt-12 pb-8 md:pt-20 md:pb-10">
        <div className="max-w-3xl">
          <span className="inline-block px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest bg-[var(--pepe-gold)]/20 text-[var(--pepe-accent-text)] border border-[var(--pepe-gold)]/40 mb-5">
            {t.hero.eyebrow}
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--pepe-white)] leading-tight mb-4">
            {t.hero.title}
          </h1>
          <p className="text-base md:text-lg text-[var(--pepe-t80)] leading-relaxed">
            {t.hero.subtitle}
          </p>
        </div>
      </header>

      {/* ── Sprungleiste ─────────────────────────────────────────────────── */}
      <nav aria-label={t.jumpTo} className="stage-container pb-10 md:pb-14">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--pepe-t48)]">
          {t.jumpTo}
        </p>
        <ul className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <li key={category}>
              <a
                href={`#${category}`}
                // min-h-11 = 44px: die kleinste Fläche, die sich auf einem
                // Touchscreen zuverlässig treffen lässt.
                className="inline-flex min-h-11 items-center rounded-full border border-[var(--pepe-line)] bg-[var(--pepe-ink)] px-4 py-2 text-sm font-semibold text-[var(--pepe-t80)] transition-colors hover:border-[var(--pepe-gold)] hover:text-[var(--pepe-white)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pepe-gold)]"
              >
                {t.chapters[category].title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── Kapitel ──────────────────────────────────────────────────────── */}
      {categories.map((category, chapterIndex) => {
        const chapter = t.chapters[category]
        return (
          <section
            key={category}
            id={category}
            aria-labelledby={`${category}-title`}
            // scroll-mt hält die Überschrift beim Sprung unter der festen Navigation frei.
            className="stage-container scroll-mt-24 pb-16 md:pb-24"
          >
            <div className="mb-8 max-w-2xl">
              <h2
                id={`${category}-title`}
                className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-3"
              >
                {chapter.title}
              </h2>
              <p className="text-base md:text-lg text-[var(--pepe-t80)] leading-relaxed">
                {chapter.text}
              </p>
            </div>

            {category === 'shows' ? (
              <div className="space-y-12 md:space-y-16">
                {showGroups.map(({ discipline, images }) => (
                  <div key={discipline} aria-labelledby={`shows-${discipline}-title`}>
                    <div className="mb-6 max-w-2xl">
                      <h3
                        id={`shows-${discipline}-title`}
                        className="text-lg md:text-xl font-semibold text-[var(--pepe-white)] mb-2"
                      >
                        {t.showDisciplines[discipline].title}
                      </h3>
                      <p className="text-[var(--pepe-t64)] leading-relaxed">
                        {t.showDisciplines[discipline].text}
                      </p>
                    </div>
                    <GalleryGrid images={images} texts={gridTexts} lang={lang} />
                  </div>
                ))}
              </div>
            ) : (
              <GalleryGrid
                images={imagesByCategory(category)}
                texts={gridTexts}
                lang={lang}
                priority={chapterIndex === 0}
              />
            )}
          </section>
        )
      })}

      {/* ── Hinweis, dass die Galerie weiter wächst ───────────────────────── */}
      <section className="border-t border-[var(--pepe-line)] bg-[var(--pepe-ink)]/40 py-12 md:py-16">
        <div className="stage-container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-xl md:text-2xl font-bold text-[var(--pepe-white)] mb-3">
              {t.more.title}
            </h2>
            <p className="text-[var(--pepe-t64)] leading-relaxed">{t.more.text}</p>
          </div>
        </div>
      </section>

      {/* ── Weiterführung ────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-[var(--pepe-black)] to-[var(--pepe-ink)]">
        <div className="stage-container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-4">
              {t.cta.title}
            </h2>
            <p className="text-[var(--pepe-t80)] text-base md:text-lg mb-8">{t.cta.text}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={localizedHref(lang, '/events')}
                className="w-full sm:w-auto flex justify-center sm:block"
              >
                <Button variant="primary" size="lg" className="w-full sm:w-auto min-w-[200px]">
                  {t.cta.events}
                </Button>
              </Link>
              <Link
                href={localizedHref(lang, '/contact')}
                className="w-full sm:w-auto flex justify-center sm:block"
              >
                <Button variant="secondary" size="lg" className="w-full sm:w-auto min-w-[200px]">
                  {t.cta.visit}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
