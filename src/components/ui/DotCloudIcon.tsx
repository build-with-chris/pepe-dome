'use client'

import { useEffect, useLayoutEffect, useState, useRef, memo } from 'react'
import { imageToParticles, type Particle } from '@/lib/imageToDots'

export interface DotCloudIconProps {
  /** Icon name - maps to /doticons/{name}.jpg */
  iconName: string
  /** Display size in px (default: 300) */
  size?: number
  /** Particle color (default: var(--pepe-gold)) */
  color?: string
  /** Density multiplier 0.1-2.0 (default: 0.4) */
  density?: number
  /** Container opacity (default: 0.35) */
  opacity?: number
  /** Sample gap for image parsing (default: 2) */
  sampleGap?: number
  /** Min dot size (default: 0.5) */
  minDotSize?: number
  /** Max dot size (default: 4.0) */
  maxDotSize?: number
  /** Disable glow behind dots (default: true) */
  noGlow?: boolean
  /** Additional CSS classes */
  className?: string
}

/**
 * DotCloudIcon - Simplified scroll-triggered particle icon
 *
 * Renders a grayscale JPG as scattered dots that converge into shape on scroll.
 * Designed for hero section backgrounds with subtle decorative effect.
 */
function DotCloudIcon({
  iconName,
  size = 300,
  color = 'var(--pepe-gold)',
  density = 0.4,
  opacity = 0.35,
  sampleGap = 2,
  minDotSize = 0.5,
  maxDotSize = 4.0,
  noGlow = true,
  className = '',
}: DotCloudIconProps) {
  const [particles, setParticles] = useState<Particle[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(1)
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // IntersectionObserver for lazy loading (Task 2.3)
  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.disconnect()
          }
        })
      },
      { rootMargin: '200px' }
    )

    observer.observe(container)

    return () => {
      observer.disconnect()
    }
  }, [iconName])

  // Load particles when visible (Task 2.5, 2.6)
  useEffect(() => {
    if (!isVisible) return

    let mounted = true

    const loadParticles = async () => {
      try {
        const imagePath = `/doticons/${iconName}.jpg`

        const particleData = await imageToParticles({
          imagePath,
          sampleGap,
          densityMultiplier: density * 1.2,
          canvasSize: 128,
          minDotSize,
          maxDotSize,
        })

        if (mounted) {
          setParticles(particleData)
          setIsLoaded(true)
        }
      } catch {
        // Silent fallback: render nothing if image fails to load (Task 2.6)
        if (mounted) {
          setHasError(true)
        }
      }
    }

    loadParticles()

    return () => {
      mounted = false
    }
  }, [isVisible, iconName, density, sampleGap, minDotSize, maxDotSize])

  // Scroll-triggered convergence - normal mode only (Task 2.4)
  useEffect(() => {
    if (!isLoaded || particles.length === 0) return

    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const rect = container.getBoundingClientRect()
      const windowHeight = window.innerHeight

      let progress = 0

      const isInViewport = rect.top < windowHeight && rect.bottom > 0

      if (isInViewport) {
        const topPosition = rect.top / windowHeight

        if (topPosition >= 0.6) {
          // In lower 40% of viewport - fully formed
          progress = 1.0
        } else if (topPosition >= 0.1) {
          // Between 10-60% from top - dissolve progressively
          progress = (topPosition - 0.1) / 0.5
          // smoothstep easing
          progress = progress * progress * (3 - 2 * progress)
        } else {
          // Top 10% or scrolled out - fully dissolved
          progress = 0
        }
      }

      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })

    // Calculate immediately
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [isLoaded, particles.length])

  // Error state: render nothing (Task 2.6)
  if (hasError) return null

  // Scale factor from 128px canvas to display size
  const scale = size / 128

  // Mobile: reduce dot size by 50% (Task 2.5)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  const shouldRenderParticles = isLoaded && particles.length > 0

  return (
    <div
      ref={containerRef}
      className={`dot-cloud-container ${className}`}
      style={{
        width: size,
        height: size,
        position: 'relative',
        overflow: 'visible',
        opacity,
      }}
    >
      {shouldRenderParticles && particles.map((particle, index) => {
        const targetX = particle.targetX * scale
        const targetY = particle.targetY * scale

        // Minimal jitter when not fully formed
        const jitterX = (Math.random() - 0.5) * 0.5 * (1 - scrollProgress)
        const jitterY = (Math.random() - 0.5) * 0.5 * (1 - scrollProgress)
        const formedX = targetX + jitterX
        const formedY = targetY + jitterY

        // Idle position (widely spread)
        const idleX = targetX + particle.offsetX * scale
        const idleY = targetY + particle.offsetY * scale

        // Interpolate between idle and formed based on scroll progress
        const displayX = idleX + (formedX - idleX) * scrollProgress
        const displayY = idleY + (formedY - idleY) * scrollProgress

        // Enhanced contrast: darker spots get bigger dots when formed
        const darknessFactor = 1 - particle.brightness / 255
        const contrastBoost = 1 + darknessFactor * 0.6 * scrollProgress

        // Scale animation: larger when idle, precise when formed
        const idleScale = 1.3 + Math.random() * 0.5
        const formedScale = 1.0 * contrastBoost
        const currentScale = idleScale + (formedScale - idleScale) * scrollProgress

        // Mobile: reduce dot size by 50%
        const dotSize = isMobile ? particle.size * 0.5 : particle.size

        return (
          <span
            key={`${iconName}-${index}`}
            className="dot-particle"
            style={{
              left: `${displayX}px`,
              top: `${displayY}px`,
              width: `${dotSize}px`,
              height: `${dotSize}px`,
              background: color,
              transform: `scale(${currentScale})`,
            }}
          />
        )
      })}

      {/* Background glow (only when noGlow is false) */}
      {!noGlow && shouldRenderParticles && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: '80%',
            height: '80%',
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
            filter: 'blur(60px)',
            pointerEvents: 'none',
            zIndex: -1,
          }}
        />
      )}
    </div>
  )
}

// Memoize to prevent re-renders from parent component state changes
export default memo(DotCloudIcon)
