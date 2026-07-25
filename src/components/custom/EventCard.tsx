'use client'

import { cn } from '@/lib/utils'
import { HTMLAttributes, forwardRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { isFreeEntry } from '@/lib/event-price'
import FreeEntryBadge from '@/components/events/FreeEntryBadge'

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
      featured = false,
      compact = false,
      ...props
    },
    ref
  ) => {
    // DB-Zeiten sind uneinheitlich ("20:00" vs. "17:00 Uhr") — Suffix für einheitliche Badges entfernen
    const timeLabel = time ? time.replace(/\s*Uhr\s*$/i, '') : null
    const isFree = isFreeEntry(price)

    const cardClasses = cn(
      // Base styles
      'group flex overflow-hidden rounded-2xl',
      'bg-[var(--pepe-ink)] border border-[var(--pepe-line)]',
      'transition-all duration-300 ease-out',
      // Hover effects
      'hover:border-[var(--pepe-gold)]',
      'hover:-translate-y-1',
      'hover:shadow-[0_12px_28px_rgba(0,0,0,0.35),0_0_8px_var(--pepe-gold-glow)]',
      // Layout variants
      compact ? 'flex-row items-stretch' : 'flex-col',
      // Featured variant
      featured && 'md:col-span-2',
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

          {/* Date Badge - Top Left */}
          {!compact && (
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-sm">
              <span className="text-xs font-semibold text-[var(--pepe-accent-text)] tracking-wide">
                {date}
                {timeLabel && <span className="text-white/90"> · {timeLabel}</span>}
              </span>
            </div>
          )}

          {/* Gratis-Sticker oben rechts, diagonal gegenüber vom Datum. Beim
              Überfliegen eines Rasters wandert der Blick über die obere
              Bildkante, hier wird er also mitgenommen ohne den Titel zu
              verdecken. */}
          {isFree && !compact && (
            <div className="absolute top-3 right-3 z-10">
              <FreeEntryBadge label={freeEntryLabel} size="md" />
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
                Sticker sitzen könnte — dort läuft er in der Meta-Zeile mit. */}
            {isFree && compact && <FreeEntryBadge label={freeEntryLabel} size="sm" />}
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

    if (href) {
      return (
        <Link
          href={href}
          className={cardClasses}
          ref={ref as React.Ref<HTMLAnchorElement>}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </Link>
      )
    }

    return (
      <div ref={ref} className={cardClasses} {...props}>
        {content}
      </div>
    )
  }
)

EventCard.displayName = 'EventCard'

export default EventCard
