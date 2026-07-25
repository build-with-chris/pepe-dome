'use client'

import { useEffect, useState } from 'react'

/**
 * Hintergrundmedium des Hero: Hochformat auf Mobile, Querformat auf Desktop.
 *
 * ── Warum das mobile Video getauscht wurde ────────────────────────────────
 * Vorher lag hier `Dome Hochkant.mp4`. Die Datei sieht auf dem Papier richtig
 * aus (Seitenverhältnis 9:16), ist aber doppelt beschädigt:
 *
 *   1280x720 [SAR 81:256 DAR 9:16]   anamorph gespeichert, das Bild ist im
 *                                    Datenstrom horizontal gequetscht
 *   Bildinhalt nur 1280x360          der Rest sind einbackene schwarze Balken
 *
 * Auf dem Telefon füllte deshalb nur ein Streifen in der Bildschirmmitte
 * wirklich Bild, oben und unten war schwarz. Kein `object-cover` behebt das,
 * weil die Balken Pixel sind und nicht Layout.
 *
 * `hero-mobile.mp4` ist echtes Hochformat (608x1080, quadratische Pixel, kein
 * Letterbox), geschnitten aus dem Showreel. Es füllt den Schirm vollständig,
 * zeigt Artistik statt einer Luftaufnahme und ist mit 841 KB kleiner als die
 * 2,7 MB vorher. Die alte Datei bleibt im Repo liegen, falls sie noch woanders
 * gebraucht wird.
 *
 * ── Ladeverhalten ─────────────────────────────────────────────────────────
 * `preload="metadata"` statt `"auto"`. Der erste Eindruck kommt aus dem Poster
 * (15 KB), das sofort steht; das Video ist Dekoration und darf nachladen. Mit
 * `preload="auto"` zog der Browser das ganze Video, bevor die Seite interaktiv
 * war — auf Mobilfunk der teuerste Weg zum langsamsten Hero.
 */

const VIDEO = {
  mobile: '/videos/hero-mobile.mp4',
  desktop: '/videos/PepeDome-Atmosphaere.mp4',
}

// Poster = jeweils der erste Frame des zugehörigen Videos → nahtloser Übergang
const POSTER = {
  mobile: '/images/Aufbau/hero-poster-mobile-portrait.webp',
  desktop: '/images/Aufbau/hero-poster.webp',
}

const MD_BREAKPOINT = 768

export default function HeroBackgroundVideo() {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${MD_BREAKPOINT}px)`)
    const update = () => setIsDesktop(mql.matches)
    update()
    mql.addEventListener('change', update)
    return () => mql.removeEventListener('change', update)
  }, [])

  // Ein bewegter Vollbild-Hintergrund ist genau das, was "reduzierte Bewegung"
  // meint. globals.css schaltet nur CSS-Animationen ab und erreicht ein <video>
  // nicht — das muss hier passieren. Wer die Einstellung gesetzt hat, bekommt
  // das Standbild.
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduceMotion(mql.matches)
    update()
    mql.addEventListener('change', update)
    return () => mql.removeEventListener('change', update)
  }, [])

  // Das Hochformat auf Mobile ist der Blickfang und darf voll durchkommen;
  // auf Desktop bleibt es dezenter Hintergrund hinter der Schrift.
  const mediaOpacity = 'opacity-100 md:opacity-65'

  if (isDesktop == null || reduceMotion) {
    // Vor der Hydration und bei reduzierter Bewegung: Poster rein per
    // CSS-Breakpoint, damit sofort das richtige Format sichtbar ist.
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
      preload="metadata"
      poster={isDesktop ? POSTER.desktop : POSTER.mobile}
      aria-hidden
    >
      <source src={src} type="video/mp4" />
    </video>
  )
}
