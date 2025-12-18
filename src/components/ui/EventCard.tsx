'use client'

import { cn } from '@/lib/utils'
import { HTMLAttributes, forwardRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

/**
 * EventCard component (Legacy version in ui/)
 *
 * For the newer version with more features, use:
 * import { EventCard } from '@/components/custom'
 */
export interface EventCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  date: string
  category?: string
  image?: string
  href?: string
}

const EventCard = forwardRef<HTMLDivElement, EventCardProps>(
  ({ className, title, description, date, category, image, href, ...props }, ref) => {
    const content = (
      <>
        {/* Image Section */}
        <div className="event-card-image-wrapper relative">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              className="event-card-image object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-[var(--pepe-t32)] bg-[var(--pepe-surface)]">
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
        </div>
        <div className="event-card-content">
          <div className="event-card-meta">
            <span className="event-card-date">{date}</span>
            {category && <span className="event-card-category">{category}</span>}
          </div>
          <h3 className="event-card-title">{title}</h3>
          {description && <p className="event-card-description">{description}</p>}
        </div>
      </>
    )

    if (href) {
      return (
        <Link
          href={href}
          className={cn('event-card', className)}
          ref={ref as React.Ref<HTMLAnchorElement>}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </Link>
      )
    }

    return (
      <div ref={ref} className={cn('event-card', className)} {...props}>
        {content}
      </div>
    )
  }
)

EventCard.displayName = 'EventCard'

export default EventCard
