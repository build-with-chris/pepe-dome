'use client'

import { cn } from '@/lib/utils'
import { HTMLAttributes, forwardRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

/**
 * NewsCard component following PEPE Dome design system
 *
 * Features:
 * - Image with zoom effect on hover
 * - Category label with gold accent
 * - Title, excerpt
 * - Author and date metadata
 * - Hover effects (lift, gold border)
 */
export interface NewsCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string
  excerpt?: string
  date: string
  author?: string
  category?: string
  image?: string
  href?: string
  /** Featured variant spans 2 columns */
  featured?: boolean
}

const NewsCard = forwardRef<HTMLDivElement, NewsCardProps>(
  (
    {
      className,
      title,
      excerpt,
      date,
      author,
      category,
      image,
      href,
      featured = false,
      ...props
    },
    ref
  ) => {
    const cardClasses = cn(
      // Base styles
      'group flex flex-col overflow-hidden rounded-xl',
      'bg-[var(--pepe-ink)] border border-[var(--pepe-line)]',
      'transition-all duration-300',
      // Hover effects
      'hover:border-[var(--pepe-gold)]',
      'hover:-translate-y-1',
      'hover:shadow-[0_12px_28px_rgba(0,0,0,0.35),0_0_8px_var(--pepe-gold-glow)]',
      // Featured variant
      featured && 'md:col-span-2',
      // Link styles
      href && 'cursor-pointer',
      className
    )

    const content = (
      <>
        {/* Image Section */}
        <div
          className={cn(
            'relative w-full overflow-hidden bg-[var(--pepe-surface)]',
            'aspect-video'
          )}
          style={featured ? { aspectRatio: '21/9' } : undefined}
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
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>

        {/* Content Section */}
        <div
          className={cn(
            'flex flex-col gap-3 p-6',
            featured && 'md:p-8'
          )}
        >
          {/* Category */}
          {category && (
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--pepe-gold)]">
              {category}
            </span>
          )}

          {/* Title */}
          <h3
            className={cn(
              'font-bold text-[var(--pepe-white)] leading-tight',
              'text-xl',
              featured && 'md:text-2xl lg:text-3xl'
            )}
          >
            {title}
          </h3>

          {/* Excerpt */}
          {excerpt && (
            <p
              className={cn(
                'text-sm text-[var(--pepe-t80)] leading-relaxed',
                'line-clamp-3',
                featured && 'md:line-clamp-4 md:text-base'
              )}
            >
              {excerpt}
            </p>
          )}

          {/* Meta Row - Author and Date */}
          <div
            className={cn(
              'flex items-center gap-2 mt-auto pt-3',
              'text-xs text-[var(--pepe-t64)]',
              'border-t border-[var(--pepe-line2)]'
            )}
          >
            {author && (
              <>
                <span className="font-medium">{author}</span>
                <span className="text-[var(--pepe-t48)]">|</span>
              </>
            )}
            <span>{date}</span>
          </div>
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

NewsCard.displayName = 'NewsCard'

export default NewsCard
