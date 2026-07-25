'use client'

import { cn } from '@/lib/utils'
import { HTMLAttributes, ReactNode, forwardRef } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'

const DotCloudIcon = dynamic(() => import('@/components/ui/DotCloudIcon'), { ssr: false })

/**
 * HeroSection component following PEPE Dome design system
 *
 * Features:
 * - Dark background with optional background image
 * - Gold accents
 * - Flexible content area with children prop
 * - Responsive padding
 * - Optional DotCloud icon for decorative background
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
  /** Optional DotCloud icon name for decorative background */
  dotCloudIcon?: string
  /** DotCloud size override (default: 300) */
  dotCloudSize?: number
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
      dotCloudIcon,
      dotCloudSize,
      ...props
    },
    ref
  ) => {
    // Auf Mobile deutlich flacher als auf Desktop. Die Werte galten vorher für
    // beide Breiten gleich: py-24 sind 96px oben und unten, dazu die 80px
    // Abstand für die feste Navbar. Für zwei Zeilen Text bedeutete das rund
    // 400px Bildschirm, bevor der erste Inhalt kam — auf einem Telefon
    // eineinhalb Wischer bis zum eigentlichen Programm.
    // Auf Desktop bleibt die großzügige Fläche, dort ist sie Gestaltung und
    // kostet keinen Weg.
    const sizeClasses = {
      sm: 'py-12 md:py-32',
      md: 'py-16 md:py-40 md:min-h-[50vh]',
      lg: 'py-20 md:py-52 md:min-h-[70vh]',
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
              // Ein Hero läuft über die volle Breite, 100vw ist hier also
              // tatsächlich richtig. Explizit hingeschrieben, damit Next nicht
              // mehr warnt und damit beim nächsten Umbau sichtbar ist, dass der
              // Wert bewusst so gewählt ist und nicht bloß der Default greift.
              sizes="100vw"
              className="object-cover"
              priority
            />
            {overlay && (
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--pepe-black)] via-[var(--pepe-black)]/80 to-[var(--pepe-black)]/60" />
            )}
          </>
        )}

        {/* DotCloud Icon Layer */}
        {dotCloudIcon && (
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ zIndex: 1 }}
          >
            <DotCloudIcon
              iconName={dotCloudIcon}
              size={dotCloudSize ?? 300}
              noGlow={true}
              opacity={0.35}
            />
          </div>
        )}

        {/* Content Container */}
        <div
          className={cn(
            'relative z-10 stage-container',
            'flex flex-col gap-8',
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
                'flex flex-wrap gap-4 mt-6',
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
