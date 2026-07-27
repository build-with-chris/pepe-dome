'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { EventTrailer } from '@/lib/event-trailer'

/**
 * Trailer-Player mit Zwei-Klick-Lösung
 *
 * Der Player zeigt zuerst nur das Eventbild und einen Startknopf. Erst der
 * Klick lädt den Film. Für YouTube und Vimeo ist das keine Geschmacksfrage:
 * ein eingebettetes <iframe> überträgt beim Aufbau der Seite die IP-Adresse an
 * den Anbieter, also bevor irgendwer etwas ansehen wollte. Mit dem Startknopf
 * passiert das erst, wenn die Besucherin sich dafür entscheidet, und der
 * Hinweis darunter sagt vorher, an wen die Daten gehen.
 *
 * Bei Dateien aus dem eigenen Projekt gibt es diesen Hinweis nicht, weil auch
 * keine fremden Daten fliessen. Der Startknopf bleibt trotzdem: er spart auf
 * dem Telefon ein paar Megabyte, die sonst niemand angefordert hat.
 *
 * Das Vorschaubild ist bewusst das Eventbild und nicht das Standbild von
 * YouTube. Letzteres kommt von einem Google-Server und würde genau die
 * Übertragung auslösen, die die Zwei-Klick-Lösung verhindern soll.
 */

export interface TrailerLabels {
  /** Beschriftung des Startknopfs, z.B. "Trailer ansehen" */
  play: string
  /** Hinweistext mit {provider} als Platzhalter */
  consent: string
  /** Link zum Anbieter, mit {provider} als Platzhalter */
  watchAt: string
  /** Beschriftung des Links zur Datenschutzseite */
  privacy: string
}

export default function TrailerPlayer({
  trailer,
  poster,
  title,
  labels,
  privacyHref,
  className,
  autoStart = false,
}: {
  trailer: EventTrailer
  /** Eventbild als Vorschau, solange der Film nicht läuft */
  poster?: string | null
  /** Eventtitel, für die Beschriftung von Knopf und Rahmen */
  title: string
  labels: TrailerLabels
  /** Ziel des Datenschutz-Links, lokalisiert */
  privacyHref: string
  className?: string
  /**
   * Startet ohne Vorschau. Nur sinnvoll, wenn der Film aus dem eigenen Projekt
   * kommt und der Klick, der hierher geführt hat, schon der Start war.
   */
  autoStart?: boolean
}) {
  const [started, setStarted] = useState(autoStart && trailer.kind === 'file')

  const frameClasses = cn(
    'relative w-full aspect-video overflow-hidden rounded-xl',
    'bg-[var(--pepe-surface)] border border-[var(--pepe-line)]'
  )

  if (started) {
    return (
      <div className={cn(frameClasses, className)}>
        {trailer.kind === 'file' ? (
          <video
            src={trailer.src}
            controls
            autoPlay
            playsInline
            className="absolute inset-0 h-full w-full bg-black object-contain"
          />
        ) : (
          <iframe
            src={trailer.embedUrl}
            title={title}
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        )}
      </div>
    )
  }

  const providerHint =
    trailer.provider && labels.consent.replace('{provider}', trailer.provider)

  return (
    <div className={cn('w-full', className)}>
      <div className={frameClasses}>
        {poster ? (
          <Image
            src={poster}
            alt=""
            fill
            // Der Player steht in der Hauptspalte der Detailseite, auf dem
            // Telefon über die volle Breite.
            sizes="(max-width: 1023px) 92vw, 720px"
            className="object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-black/55" />

        <button
          type="button"
          onClick={() => setStarted(true)}
          aria-label={`${labels.play}: ${title}`}
          className={cn(
            'absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 text-center',
            'transition-colors hover:bg-black/20',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pepe-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-black'
          )}
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--pepe-gold)] shadow-lg sm:h-16 sm:w-16">
            <svg
              className="ml-1 h-6 w-6 text-white sm:h-7 sm:w-7"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.29-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14z" />
            </svg>
          </span>
          <span className="text-base font-semibold text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.8)]">
            {labels.play}
          </span>
        </button>
      </div>

      {/* Der Hinweis steht unter dem Bild, nicht darin. Als Streifen im Bild
          war er auf dem Telefon höher als der halbe Player und verdeckte genau
          den Knopf, den er erklärt. */}
      {providerHint && (
        <div className="mt-2.5">
          <p className="text-xs leading-relaxed text-[var(--pepe-t64)]">
            {providerHint}{' '}
            <Link href={privacyHref} className="underline hover:text-[var(--pepe-white)]">
              {labels.privacy}
            </Link>
          </p>
          {trailer.provider && (
            <a
              href={trailer.watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1.5 inline-block text-xs font-medium text-[var(--pepe-accent-text)] underline hover:text-[var(--pepe-white)]"
            >
              {labels.watchAt.replace('{provider}', trailer.provider)}
            </a>
          )}
        </div>
      )}
    </div>
  )
}
