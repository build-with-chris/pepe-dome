'use client'

import { cn } from '@/lib/utils'
import { HTMLAttributes, forwardRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { isFreeEntry } from '@/lib/event-price'
import { formatTimeShort } from '@/lib/event-time'
import { parseTrailer } from '@/lib/event-trailer'
import FreeEntryBadge from '@/components/events/FreeEntryBadge'
import TrailerLauncher, { type TrailerCardLabels } from '@/components/events/TrailerLauncher'

/**
 * EventCard component following PEPE Dome design system
 *
 * Features:
 * - Image with overlay gradient
 * - Date badge (top left)
 * - Category badge (colored)
 * - Title (bold, white)
 * - Short description (muted)
 * - Hover: lift effect, gold glow
 */
export interface EventCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  date: string
  /** Start time, e.g. "19:30" — shown next to the date */
  time?: string | null
  category?: string
  image?: string
  href?: string
  /** Freitext-Preis aus der DB, z.B. "ab 22 €" oder "Eintritt frei" */
  price?: string | null
  /** Lokalisiertes Sticker-Label für kostenlose Events */
  freeEntryLabel?: string
  /**
   * Trailer des Events. `url` ist der rohe Feldinhalt aus der Datenbank; was
   * daraus wird, entscheidet src/lib/event-trailer.ts. Ohne erkennbaren
   * Trailer bleibt die Karte unverändert.
   */
  trailer?: {
    url: string | null
    labels: TrailerCardLabels
    /** Ziel des Datenschutz-Links im Hinweis, lokalisiert */
    privacyHref: string
  }
  /** Featured variant spans 2 columns */
  featured?: boolean
  /** Compact variant for horizontal layout */
  compact?: boolean
}

const EventCard = forwardRef<HTMLDivElement, EventCardProps>(
  (
    {
      className,
      title,
      description,
      date,
      time,
      category,
      image,
      href,
      price,
      freeEntryLabel = 'Gratis Eintritt',
      trailer: trailerProp,
      featured = false,
      compact = false,
      ...props
    },
    ref
  ) => {
    // Karten zeigen nur den Beginn: im Datums-Badge ist kein Platz für eine
    // Spanne, und die Endzeit steht auf der Detailseite.
    const timeLabel = formatTimeShort(time)
    const isFree = isFreeEntry(price)

    // Kostenlose Events tragen schon den Gratis-Sticker. Ein zweites Schild mit
    // "Eintritt frei" daneben sagt dasselbe noch einmal. Ein leeres Preisfeld
    // heisst "steht noch nicht fest" und bekommt bewusst gar nichts: eine
    // erfundene Angabe wäre schlimmer als eine fehlende.
    const priceLabel = price && !isFree ? price : null

    const trailer = parseTrailer(trailerProp?.url)
    // In der compact-Variante ist das Bild ein 160px-Quadrat neben dem Text.
    // Dort wäre der Trailer-Knopf grösser als das halbe Bild.
    const showTrailerButton = Boolean(trailer && trailerProp && !compact)

    const cardClasses = cn(
      // Base styles. `@container` macht die Karte selbst zum Bezugspunkt für die
      // Overlays im Bild: im Carousel ist eine Karte auch auf dem Desktop nur
      // 280px breit, ein Viewport-Breakpoint würde das nicht mitbekommen.
      '@container group flex overflow-hidden rounded-2xl',
      'bg-[var(--pepe-ink)] border border-[var(--pepe-line)]',
      'transition-all duration-300 ease-out',
      // Hover effects
      'hover:border-[var(--pepe-gold)]',
      'hover:-translate-y-1',
      'hover:shadow-[0_12px_28px_rgba(0,0,0,0.35),0_0_8px_var(--pepe-gold-glow)]',
      // Layout variants
      compact ? 'flex-row items-stretch' : 'flex-col',
      // Featured variant. Mit Trailer-Knopf sitzt die Karte in einem Wrapper,
      // dann gehört die Spaltenbreite dorthin: das Raster sieht nur noch den
      // Wrapper.
      featured && !showTrailerButton && 'md:col-span-2',
      showTrailerButton && 'flex-1 min-w-0',
      // Link styles
      href && 'cursor-pointer',
      className
    )

    // Determine aspect ratio style for featured cards
    const featuredAspectStyle = featured && !compact ? { aspectRatio: '21/9' } : undefined

    const content = (
      <>
        {/* Image Section */}
        <div
          className={cn(
            'relative overflow-hidden bg-[var(--pepe-surface)]',
            compact
              ? 'w-40 flex-shrink-0 aspect-square sm:w-40'
              : 'w-full aspect-video'
          )}
          style={featuredAspectStyle}
        >
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              // Event-Karten stehen in einem Raster: eine Spalte auf dem
              // Telefon, zwei auf dem Tablet, drei auf dem Desktop. Ohne `sizes`
              // nimmt Next bei `fill` 100vw an und lädt für eine 380px breite
              // Karte das 1920px-Bild — dieselbe Darstellung, ein Vielfaches an
              // Bytes, und das pro Karte im Raster.
              sizes={
                compact
                  ? '160px'
                  : '(max-width: 639px) 92vw, (max-width: 1023px) 46vw, 33vw'
              }
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-[var(--pepe-t32)]">
              <svg
                className="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {/* Overlay gradient */}
          {!compact && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          )}

          {/* Date Badge - Top Left. Auf schmalen Karten eine Nummer kleiner:
              dort ist das Badge sonst halb so breit wie das ganze Bild. */}
          {!compact && (
            <div className="absolute top-2 left-2 rounded-md bg-black/70 px-2 py-0.5 backdrop-blur-sm @[24rem]:top-3 @[24rem]:left-3 @[24rem]:px-2.5 @[24rem]:py-1">
              <span className="text-[11px] font-semibold tracking-wide text-[var(--pepe-accent-text)] @[24rem]:text-xs">
                {date}
                {timeLabel && <span className="text-white/90"> · {timeLabel}</span>}
              </span>
            </div>
          )}

          {/* Gratis-Sticker oben rechts, diagonal gegenüber vom Datum. Beim
              Überfliegen eines Rasters wandert der Blick über die obere
              Bildkante, hier wird er also mitgenommen ohne den Titel zu
              verdecken.

              Nur ab 24rem Kartenbreite: darunter reicht der Platz neben dem
              Datum nicht, Sticker und Datum schoben sich übereinander und
              deckten zusammen die obere Bildhälfte zu. Auf schmalen Karten
              läuft der Sticker stattdessen unten in der Meta-Zeile mit. */}
          {isFree && !compact && (
            <div className="absolute top-3 right-3 z-10 hidden @[24rem]:block">
              <FreeEntryBadge label={freeEntryLabel} size="md" />
            </div>
          )}

          {/* Preis unten rechts, diagonal gegenüber vom Datum. Bis hierher
              stand er nur auf der Detailseite: wer wissen wollte, ob ein Abend
              6 oder 20 Euro kostet, musste jede Karte einzeln öffnen. Beim
              Überfliegen der Liste ist der Preis aber die zweite Frage nach dem
              Datum. */}
          {priceLabel && !compact && (
            <div className="absolute bottom-2 right-2 z-10 rounded-md bg-black/70 px-2 py-0.5 backdrop-blur-sm @[24rem]:bottom-3 @[24rem]:right-3 @[24rem]:px-2.5 @[24rem]:py-1">
              <span className="text-[11px] font-semibold tracking-wide text-white @[24rem]:text-xs">
                {priceLabel}
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div
          className={cn(
            'flex flex-col gap-4',
            compact ? 'p-4 justify-center flex-1' : 'p-6',
            featured && !compact && 'md:p-8'
          )}
        >
          {/* Meta Row */}
          <div className="flex items-center gap-3 flex-wrap">
            {compact && (
              <span className="text-sm font-medium text-[var(--pepe-accent-text)] tracking-wide">
                {date}
                {timeLabel && <span className="text-[var(--pepe-t80)]"> · {timeLabel}</span>}
              </span>
            )}
            {category && (
              <span
                className={cn(
                  'text-xs font-semibold uppercase tracking-wider',
                  'px-2 py-0.5 rounded-sm',
                  'bg-[var(--pepe-surface)] text-[var(--pepe-t64)]'
                )}
              >
                {category}
              </span>
            )}
            {/* In der compact-Variante gibt es keinen Bild-Overlay, in dem der
                Sticker sitzen könnte — dort läuft er in der Meta-Zeile mit. Der
                Preis genauso. */}
            {isFree && compact && <FreeEntryBadge label={freeEntryLabel} size="sm" />}
            {/* Gegenstück zum Sticker im Bild: auf schmalen Karten steht er
                hier, damit das Foto frei bleibt. */}
            {isFree && !compact && (
              <FreeEntryBadge label={freeEntryLabel} size="sm" className="@[24rem]:hidden" />
            )}
            {priceLabel && compact && (
              <span className="text-xs font-semibold text-[var(--pepe-accent-text)]">
                {priceLabel}
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            className={cn(
              'font-bold text-[var(--pepe-white)] leading-tight',
              compact ? 'text-base' : 'text-xl',
              featured && !compact && 'md:text-2xl lg:text-3xl'
            )}
          >
            {title}
          </h3>

          {/* Description */}
          {description && !compact && (
            <p
              className={cn(
                'text-[var(--pepe-t80)] leading-relaxed',
                'line-clamp-3',
                featured && 'md:line-clamp-4'
              )}
            >
              {description}
            </p>
          )}
        </div>
      </>
    )

    const card = href ? (
      <Link
        href={href}
        className={cardClasses}
        ref={ref as React.Ref<HTMLAnchorElement>}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </Link>
    ) : (
      <div ref={ref} className={cardClasses} {...props}>
        {content}
      </div>
    )

    if (!showTrailerButton || !trailer || !trailerProp) return card

    return (
      <div className={cn('relative flex', featured && 'md:col-span-2')}>
        {card}
        {/* Der Knopf gehört optisch ins Bild, darf aber nicht im Karten-Link
            liegen. Diese Ebene liegt deshalb massgenau über dem Bild: dieselbe
            Breite, dasselbe Seitenverhältnis, oben bündig. Sie lässt Klicks
            durch (pointer-events-none), nur der Knopf selbst fängt sie ab. */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 aspect-video"
          style={featuredAspectStyle}
        >
          <div className="pointer-events-auto absolute bottom-3 left-3">
            <TrailerLauncher
              trailer={trailer}
              poster={image}
              title={title}
              labels={trailerProp.labels}
              privacyHref={trailerProp.privacyHref}
            />
          </div>
        </div>
      </div>
    )
  }
)

EventCard.displayName = 'EventCard'

export default EventCard
