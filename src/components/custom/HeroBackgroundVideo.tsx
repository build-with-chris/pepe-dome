'use client'

import { useEffect, useState } from 'react'

const VIDEO = {
  mobile: '/videos/Dome%20Hochkant.mp4',
  desktop: '/videos/PepeDome-Atmosphaere.mp4',
}

// Poster = jeweils der erste Frame des zugehörigen Videos → nahtloser Übergang
const POSTER = {
  mobile: '/images/Aufbau/hero-poster-mobile.webp',
  desktop: '/images/Aufbau/hero-poster.webp',
}

const MD_BREAKPOINT = 768

export default function HeroBackgroundVideo() {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null)

  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${MD_BREAKPOINT}px)`)
    const update = () => setIsDesktop(mql.matches)
    update()
    mql.addEventListener('change', update)
    return () => mql.removeEventListener('change', update)
  }, [])

  // Auf Mobile ist das Video der Blickfang und darf kräftiger durchkommen;
  // auf Desktop bleibt es dezenter Hintergrund hinter der Schrift.
  const mediaOpacity = 'opacity-90 md:opacity-65'

  if (isDesktop == null) {
    // Vor der Hydration: Poster rein per CSS-Breakpoint, damit sofort das
    // richtige Format sichtbar ist (Hochkant auf Mobile, Quer auf Desktop)
    return (
      <>
        <div
          className={`absolute inset-0 w-full h-full bg-cover bg-center bg-[var(--pepe-ink)] md:hidden ${mediaOpacity}`}
          style={{ backgroundImage: `url(${POSTER.mobile})` }}
          aria-hidden
        />
        <div
          className={`absolute inset-0 w-full h-full bg-cover bg-center bg-[var(--pepe-ink)] hidden md:block ${mediaOpacity}`}
          style={{ backgroundImage: `url(${POSTER.desktop})` }}
          aria-hidden
        />
      </>
    )
  }

  const src = isDesktop ? VIDEO.desktop : VIDEO.mobile

  return (
    <video
      key={src}
      className={`absolute inset-0 w-full h-full object-cover object-center ${mediaOpacity}`}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster={isDesktop ? POSTER.desktop : POSTER.mobile}
      aria-hidden
    >
      <source src={src} type="video/mp4" />
    </video>
  )
}
