'use client'

import { cn } from '@/lib/utils'
import { HTMLAttributes, forwardRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

/**
 * NewsCard component (Legacy version in ui/)
 *
 * For the newer version with more features, use:
 * import { NewsCard } from '@/components/custom'
 */
export interface NewsCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string
  excerpt?: string
  date: string
  author?: string
  category?: string
  image?: string
  href?: string
}

const NewsCard = forwardRef<HTMLDivElement, NewsCardProps>(
  ({ className, title, excerpt, date, author, category, image, href, ...props }, ref) => {
    const content = (
      <>
        {/* Image Section */}
        <div className="news-card-image-wrapper relative">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              className="news-card-image object-cover"
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
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
          )}
        </div>
        <div className="news-card-content">
          {category && <span className="news-card-category">{category}</span>}
          <h3 className="news-card-title">{title}</h3>
          {excerpt && <p className="news-card-excerpt">{excerpt}</p>}
          <div className="news-card-meta">
            {author && <span className="news-card-author">{author}</span>}
            <span className="news-card-date">{date}</span>
          </div>
        </div>
      </>
    )

    if (href) {
      return (
        <Link
          href={href}
          className={cn('news-card', className)}
          ref={ref as React.Ref<HTMLAnchorElement>}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </Link>
      )
    }

    return (
      <div ref={ref} className={cn('news-card', className)} {...props}>
        {content}
      </div>
    )
  }
)

NewsCard.displayName = 'NewsCard'

export default NewsCard
