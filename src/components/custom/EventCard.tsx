'use client'

import { cn } from '@/lib/utils'
import { HTMLAttributes, forwardRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

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
  category?: string
  image?: string
  href?: string
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
      category,
      image,
      href,
      featured = false,
      compact = false,
      ...props
    },
    ref
  ) => {
    const cardClasses = cn(
      // Base styles
      'group flex overflow-hidden rounded-xl',
      'bg-[var(--pepe-ink)] border border-[var(--pepe-line)]',
      'transition-all duration-300',
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
              className="object-cover transition-transform duration-500 group-hover:scale-105"
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
              <span className="text-xs font-semibold text-[var(--pepe-gold)] tracking-wide">
                {date}
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div
          className={cn(
            'flex flex-col gap-3',
            compact ? 'p-4 justify-center flex-1' : 'p-6',
            featured && !compact && 'md:p-8'
          )}
        >
          {/* Meta Row */}
          <div className="flex items-center gap-3 flex-wrap">
            {compact && (
              <span className="text-sm font-medium text-[var(--pepe-gold)] tracking-wide">
                {date}
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
                'text-sm text-[var(--pepe-t80)] leading-relaxed',
                'line-clamp-3',
                featured && 'md:line-clamp-4 md:text-base'
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
