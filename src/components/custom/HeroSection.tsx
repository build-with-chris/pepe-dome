'use client'

import { cn } from '@/lib/utils'
import { HTMLAttributes, ReactNode, forwardRef } from 'react'
import Image from 'next/image'

/**
 * HeroSection component following PEPE Dome design system
 *
 * Features:
 * - Dark background with optional background image
 * - Gold accents
 * - Flexible content area with children prop
 * - Responsive padding
 */
export interface HeroSectionProps extends HTMLAttributes<HTMLElement> {
  /** Main title */
  title: string
  /** Subtitle/description */
  subtitle?: string
  /** Optional background image URL */
  backgroundImage?: string
  /** Additional content (buttons, etc.) */
  children?: ReactNode
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
  /** Center content */
  centered?: boolean
  /** Show overlay gradient on background image */
  overlay?: boolean
}

const HeroSection = forwardRef<HTMLElement, HeroSectionProps>(
  (
    {
      className,
      title,
      subtitle,
      backgroundImage,
      children,
      size = 'md',
      centered = true,
      overlay = true,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'py-20 md:py-28',
      md: 'py-28 md:py-36 min-h-[50vh]',
      lg: 'py-36 md:py-48 min-h-[70vh]',
    }

    return (
      <section
        ref={ref}
        className={cn(
          'relative overflow-hidden',
          'bg-[var(--pepe-black)]',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {/* Background Image */}
        {backgroundImage && (
          <>
            <Image
              src={backgroundImage}
              alt=""
              fill
              className="object-cover"
              priority
            />
            {overlay && (
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--pepe-black)] via-[var(--pepe-black)]/80 to-[var(--pepe-black)]/60" />
            )}
          </>
        )}

        {/* Content Container */}
        <div
          className={cn(
            'relative z-10 stage-container',
            'flex flex-col gap-6',
            centered && 'items-center text-center'
          )}
        >
          {/* Title */}
          <h1
            className={cn(
              'font-bold text-[var(--pepe-white)]',
              'leading-none tracking-tight',
              size === 'sm' && 'text-3xl md:text-4xl',
              size === 'md' && 'text-4xl md:text-5xl lg:text-6xl',
              size === 'lg' && 'text-5xl md:text-6xl lg:text-7xl'
            )}
          >
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p
              className={cn(
                'text-[var(--pepe-t80)]',
                'max-w-2xl',
                size === 'sm' && 'text-base md:text-lg',
                size === 'md' && 'text-lg md:text-xl',
                size === 'lg' && 'text-xl md:text-2xl'
              )}
            >
              {subtitle}
            </p>
          )}

          {/* Decorative Gold Line */}
          {centered && (
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[var(--pepe-gold)] to-transparent rounded-full" />
          )}

          {/* Children (buttons, etc.) */}
          {children && (
            <div
              className={cn(
                'flex flex-wrap gap-4 mt-4',
                centered && 'justify-center'
              )}
            >
              {children}
            </div>
          )}
        </div>

        {/* Bottom Gradient Fade */}
        {!backgroundImage && (
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--pepe-dark)] to-transparent" />
        )}
      </section>
    )
  }
)

HeroSection.displayName = 'HeroSection'

export default HeroSection
