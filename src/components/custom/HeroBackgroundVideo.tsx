'use client'

import { useEffect, useState } from 'react'

const VIDEO = {
  mobile: '/videos/Dome%20Hochkant.mp4',
  desktop: '/videos/PepeDome-Atmosphaere.mp4',
}

const POSTER = '/images/Aufbau/hero-poster.webp'
const MD_BREAKPOINT = 768

export default function HeroBackgroundVideo() {
  const [src, setSrc] = useState<string | null>(null)

  useEffect(() => {
    const setSource = () => {
      const isDesktop = window.matchMedia(`(min-width: ${MD_BREAKPOINT}px)`).matches
      setSrc(isDesktop ? VIDEO.desktop : VIDEO.mobile)
    }

    setSource()
    const mql = window.matchMedia(`(min-width: ${MD_BREAKPOINT}px)`)
    mql.addEventListener('change', setSource)
    return () => mql.removeEventListener('change', setSource)
  }, [])

  if (src == null) {
    return (
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center opacity-65 bg-[var(--pepe-ink)]"
        style={{ backgroundImage: `url(${POSTER})` }}
        aria-hidden
      />
    )
  }

  return (
    <video
      key={src}
      className="absolute inset-0 w-full h-full object-cover object-center opacity-65"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster={POSTER}
      aria-hidden
    >
      <source src={src} type="video/mp4" />
    </video>
  )
}
