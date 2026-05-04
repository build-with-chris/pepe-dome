'use client'

/**
 * Floating „Jetzt buchen"-Button für die Trainings-Seite.
 *
 * - Erscheint, sobald der User aus dem Buchungsbereich (#buchung) gescrollt ist
 * - Versteckt sich wieder, wenn der Buchungsbereich im Viewport ist
 * - Scrollt smooth zurück zum Eversports-Widget
 * - Mobile- und Desktop-tauglich (bottom-right, mit safe-area-Padding)
 */

import { useEffect, useState } from 'react'

interface StickyBookingButtonProps {
  /** ID des Buchungsbereichs (ohne #) — Default: 'buchung' */
  targetId?: string
}

export default function StickyBookingButton({ targetId = 'buchung' }: StickyBookingButtonProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const target = document.getElementById(targetId)
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Sichtbar machen, wenn der Buchungsbereich NICHT im Viewport ist
        setVisible(!entry.isIntersecting)
      },
      {
        // Beginnt nicht sofort beim ersten Pixel — erst wenn deutlich vorbei gescrollt
        rootMargin: '-80px 0px -80px 0px',
        threshold: 0,
      }
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [targetId])

  const scrollToBooking = (e: React.MouseEvent) => {
    e.preventDefault()
    const target = document.getElementById(targetId)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <a
      href={`#${targetId}`}
      onClick={scrollToBooking}
      aria-label="Zum Buchungsbereich scrollen"
      className={`
        fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50
        inline-flex items-center gap-2 px-5 py-3 md:px-6 md:py-3.5
        rounded-full font-bold text-sm md:text-base
        bg-[var(--pepe-gold)] text-black
        shadow-[0_8px_24px_rgba(0,0,0,0.5),0_0_16px_var(--pepe-gold-glow)]
        hover:bg-[var(--pepe-gold-hover)]
        hover:scale-105 active:scale-95
        transition-all duration-300 ease-out
        ${visible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'}
      `}
      style={{
        // Auf iOS Safari die safe-area beachten
        bottom: 'max(1.5rem, env(safe-area-inset-bottom))',
      }}
    >
      <span aria-hidden="true">🎟</span>
      <span>Jetzt buchen</span>
    </a>
  )
}
