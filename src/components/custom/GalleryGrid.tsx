'use client'

/**
 * GalleryGrid — Bildraster mit Kategorie-Filter und Lightbox
 *
 * Aufbau als CSS-Masonry (`columns`) statt Grid: die Bilder haben sehr
 * unterschiedliche Seitenverhältnisse (Hochkant 2:3 neben Quer 16:9). Ein Grid
 * müsste sie alle auf ein Format beschneiden oder Lücken lassen; Masonry lässt
 * jedem Bild sein eigenes Format und füllt die Spalten trotzdem gleichmäßig.
 *
 * Die Lightbox sitzt auf @radix-ui/react-dialog. Das ist keine Stilfrage: Radix
 * bringt Focus-Trap, Fokus-Rückgabe beim Schließen, ESC, aria-modal und den
 * Scroll-Lock des Hintergrunds mit. Von Hand ist davon vor allem der Focus-Trap
 * regelmäßig falsch.
 *
 * Bedienung, absichtlich für beide Welten:
 *   Mobil    Tippen öffnet, Wischen blättert, großer Schließen-Button oben
 *   Desktop  Klick öffnet, Pfeiltasten blättern, ESC schließt
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import * as Dialog from '@radix-ui/react-dialog'
import { cn } from '@/lib/utils'
import type { GalleryCategory, GalleryImage } from '@/data/gallery'
import type { Locale } from '@/i18n/config'

export type GalleryTexts = {
  filterAll: string
  categories: Record<string, string>
  imageCountOne: string
  imageCountMany: string
  lightbox: {
    open: string
    close: string
    prev: string
    next: string
    position: string
  }
}

/** Mindestdistanz für einen Wisch, damit ein Tippen nicht versehentlich blättert. */
const SWIPE_THRESHOLD_PX = 50

export default function GalleryGrid({
  images,
  categories,
  texts,
  lang,
}: {
  images: GalleryImage[]
  categories: GalleryCategory[]
  texts: GalleryTexts
  lang: Locale
}) {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory | 'all'>('all')
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  // Als Favorit markierte Bilder zuerst. In einem Masonry-Layout lässt sich ein
  // Bild nicht sauber über mehrere Spalten ziehen (Safari zerlegt die Kachel),
  // deshalb wirkt `featured` über die Position: oben, wo garantiert hingesehen
  // wird. Innerhalb der beiden Gruppen bleibt die Reihenfolge aus gallery.ts.
  const visible = (
    activeCategory === 'all'
      ? images
      : images.filter((image) => image.category === activeCategory)
  )
    .map((image, index) => ({ image, index }))
    .sort((a, b) => Number(b.image.featured ?? false) - Number(a.image.featured ?? false) || a.index - b.index)
    .map((entry) => entry.image)

  const current = openIndex === null ? null : visible[openIndex] ?? null

  const step = useCallback(
    (direction: 1 | -1) => {
      setOpenIndex((index) => {
        if (index === null || visible.length === 0) return index
        // Umlaufend: am Ende weiter heißt wieder von vorn. Eine Galerie zu Ende
        // durchzublättern und dann in einer Sackgasse zu stehen ist unnötig.
        return (index + direction + visible.length) % visible.length
      })
    },
    [visible.length]
  )

  // Pfeiltasten. ESC und Tab-Fokus übernimmt Radix.
  useEffect(() => {
    if (openIndex === null) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        step(1)
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        step(-1)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [openIndex, step])

  const touchStartX = useRef<number | null>(null)

  const countLabel =
    visible.length === 1
      ? texts.imageCountOne
      : texts.imageCountMany.replace('{{count}}', String(visible.length))

  const filters: Array<{ key: GalleryCategory | 'all'; label: string }> = [
    { key: 'all', label: texts.filterAll },
    ...categories.map((category) => ({
      key: category,
      label: texts.categories[category] ?? category,
    })),
  ]

  return (
    <>
      {/* ── Filter ───────────────────────────────────────────────────────── */}
      <div className="mb-6">
        <div
          role="group"
          aria-label={texts.filterAll}
          className="flex flex-wrap justify-center gap-2"
        >
          {filters.map((filter) => {
            const isActive = activeCategory === filter.key
            return (
              <button
                key={filter.key}
                type="button"
                onClick={() => {
                  setActiveCategory(filter.key)
                  setOpenIndex(null)
                }}
                aria-pressed={isActive}
                className={cn(
                  // min-h-11 = 44px: die kleinste Fläche, die sich auf einem
                  // Touchscreen zuverlässig treffen lässt.
                  'min-h-11 px-4 py-2 rounded-full text-sm font-semibold',
                  'border transition-colors duration-200',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pepe-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pepe-black)]',
                  isActive
                    ? 'bg-[var(--pepe-gold)] border-[var(--pepe-gold)] text-white'
                    : 'bg-[var(--pepe-ink)] border-[var(--pepe-line)] text-[var(--pepe-t80)] hover:border-[var(--pepe-gold)] hover:text-[var(--pepe-white)]'
                )}
              >
                {filter.label}
              </button>
            )
          })}
        </div>
        <p className="mt-3 text-center text-sm text-[var(--pepe-t48)] tabular-nums">
          {countLabel}
        </p>
      </div>

      {/* ── Masonry ──────────────────────────────────────────────────────── */}
      <div className="columns-2 md:columns-3 xl:columns-4 gap-3 md:gap-4 [column-fill:balance]">
        {visible.map((image, index) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setOpenIndex(index)}
            aria-label={`${texts.lightbox.open}: ${image.alt[lang]}`}
            className={cn(
              'group relative mb-3 md:mb-4 block w-full overflow-hidden rounded-xl',
              'bg-[var(--pepe-surface)] border border-[var(--pepe-line)]',
              'transition-colors duration-300 hover:border-[var(--pepe-gold)]',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pepe-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pepe-black)]',
              // break-inside verhindert, dass ein Bild über den Spaltenumbruch
              // zerrissen wird. Ohne das zerlegt Safari einzelne Kacheln.
              'break-inside-avoid'
            )}
          >
            <Image
              src={image.src}
              alt={image.alt[lang]}
              width={image.width}
              height={image.height}
              // Zwei Spalten auf Mobile, vier auf großen Schirmen: die Kachel ist
              // nie breiter als die Hälfte bzw. ein Viertel des Viewports. Ohne
              // sizes lädt der Browser die 100vw-Variante, also das Vierfache an
              // Bytes für dieselbe Darstellung.
              sizes="(max-width: 767px) 50vw, (max-width: 1279px) 33vw, 25vw"
              // Die erste Kachel ist auf dieser Seite das LCP-Element und
              // bekommt deshalb einen Preload-Hint; die nächsten drei stehen
              // ebenfalls above the fold und laden sofort, alles darunter erst
              // beim Scrollen. priority impliziert eager, beides zusammen
              // würde Next anmeckern.
              priority={index === 0}
              loading={index === 0 ? undefined : index < 4 ? 'eager' : 'lazy'}
              className="h-auto w-full transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
            {/* Bewusst ohne Text über der Kachel: die Bildunterschriften standen
                nur bei einem Teil der Bilder, der Rest fiel auf den Alt-Text
                zurück und beschrieb damit sichtbar das Offensichtliche. Der
                Alt-Text bleibt im Markup, er richtet sich an Screenreader und
                die Bildersuche, nicht an sehende Betrachter. Als Hinweis, dass
                die Kachel anklickbar ist, bleiben Rahmenfarbe und Zoom. */}
          </button>
        ))}
      </div>

      {/* ── Lightbox ─────────────────────────────────────────────────────── */}
      <Dialog.Root
        open={openIndex !== null}
        onOpenChange={(open) => {
          if (!open) setOpenIndex(null)
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[9998] bg-black/95 backdrop-blur-sm" />
          <Dialog.Content
            // Die Safe-Area-Insets halten Schliessen-Button und Blätter-Leiste
            // aus der Notch oben und dem Home-Indicator unten heraus. Ohne das
            // liegt auf einem iPhone der Schliessen-Button unter der Statusbar.
            className="fixed inset-0 z-[9999] flex flex-col focus:outline-none pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
            onTouchStart={(event) => {
              touchStartX.current = event.touches[0]?.clientX ?? null
            }}
            onTouchEnd={(event) => {
              const start = touchStartX.current
              touchStartX.current = null
              if (start === null) return
              const delta = (event.changedTouches[0]?.clientX ?? start) - start
              if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return
              step(delta < 0 ? 1 : -1)
            }}
          >
            {current && (
              <>
                {/* Radix verlangt einen Titel für aria-labelledby. Sichtbar ist
                    er nicht: das Bild selbst ist die Aussage. */}
                <Dialog.Title className="sr-only">{current.alt[lang]}</Dialog.Title>

                {/* Kopfzeile: Zähler links, Schließen rechts */}
                <div className="flex flex-shrink-0 items-center justify-between gap-4 p-3 md:p-4">
                  <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold tabular-nums text-white/80">
                    {texts.lightbox.position
                      .replace('{{current}}', String((openIndex ?? 0) + 1))
                      .replace('{{total}}', String(visible.length))}
                  </span>
                  <Dialog.Close
                    aria-label={texts.lightbox.close}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pepe-gold)]"
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      aria-hidden="true"
                    >
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </Dialog.Close>
                </div>

                {/* Bildfläche */}
                <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 md:px-16">
                  <Image
                    // key erzwingt einen echten Bildwechsel beim Blättern,
                    // sonst zeigt der Browser kurz das vorige Bild weiter.
                    key={current.src}
                    src={current.src}
                    alt={current.alt[lang]}
                    width={current.width}
                    height={current.height}
                    sizes="(max-width: 767px) 100vw, 90vw"
                    priority
                    className="max-h-full w-auto max-w-full object-contain"
                  />

                  {visible.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => step(-1)}
                        aria-label={texts.lightbox.prev}
                        className="absolute left-1 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pepe-gold)] md:flex"
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                          <path d="M15 18l-6-6 6-6" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => step(1)}
                        aria-label={texts.lightbox.next}
                        className="absolute right-1 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pepe-gold)] md:flex"
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>

                {/* Nur noch die zwei Blätter-Buttons für Mobile, wo die
                    seitlichen Pfeile das Bild verdecken würden. Ohne die frühere
                    Bildunterschrift darunter wird die Leiste auf Desktop gar
                    nicht mehr gerendert, das Bild bekommt die Höhe. */}
                {visible.length > 1 && (
                  <div className="flex flex-shrink-0 justify-center gap-3 px-4 pb-5 pt-3 md:hidden">
                    <button
                      type="button"
                      onClick={() => step(-1)}
                      aria-label={texts.lightbox.prev}
                      className="flex h-11 w-16 items-center justify-center rounded-full bg-white/10 text-white transition-colors active:bg-white/25"
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => step(1)}
                      aria-label={texts.lightbox.next}
                      className="flex h-11 w-16 items-center justify-center rounded-full bg-white/10 text-white transition-colors active:bg-white/25"
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </button>
                  </div>
                )}
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}
