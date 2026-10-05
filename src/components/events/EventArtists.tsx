/**
 * „Wer auftritt" auf der Event-Detailseite.
 *
 * Eine Karte pro Artist in der Reihenfolge aus dem Event-Formular. Die Bio
 * kommt schon in der Sprache der Seite an (Fallback auf Deutsch macht
 * transformArtist in src/lib/db-data.ts).
 *
 * Instagram ist nur ein Link, keine Einbettung: Eingebettete Posts laden
 * Skripte von Meta und bräuchten eine Einwilligung.
 */

import Image from 'next/image'
import { Globe, Instagram } from 'lucide-react'
import type { ArtistData } from '@/lib/db-data'

export type EventArtistsLabels = {
  title: string
  /** mit {name} als Platzhalter */
  instagram: string
  /** mit {name} als Platzhalter */
  website: string
}

function initialen(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((teil) => teil[0]?.toUpperCase() ?? '')
    .join('')
}

export default function EventArtists({
  artists,
  labels,
}: {
  artists: ArtistData[]
  labels: EventArtistsLabels
}) {
  if (artists.length === 0) return null

  return (
    <section className="mb-10" aria-labelledby="event-artists-title">
      <h2 id="event-artists-title" className="text-xl font-bold text-[var(--pepe-white)] mb-4">
        {labels.title}
      </h2>
      <ul className="grid gap-4 list-none m-0 p-0">
        {artists.map((artist) => (
          <li
            key={artist.id}
            className="m-0 flex flex-col sm:flex-row gap-4 sm:gap-5 bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-xl p-5"
          >
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 overflow-hidden rounded-lg bg-[var(--pepe-black)]">
              {artist.imageUrl ? (
                <Image
                  src={artist.imageUrl}
                  alt={artist.name}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-[var(--pepe-t48)]"
                >
                  {initialen(artist.name)}
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-bold text-[var(--pepe-white)] mb-2 break-words">
                {artist.name}
              </h3>
              <p className="text-[var(--pepe-t80)] leading-relaxed whitespace-pre-line break-words">
                {artist.bio}
              </p>

              {(artist.instagramUrl || artist.websiteUrl) && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {artist.instagramUrl && (
                    <a
                      href={artist.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={labels.instagram.replace('{name}', artist.name)}
                      title={labels.instagram.replace('{name}', artist.name)}
                      className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-[var(--pepe-line)] text-[var(--pepe-accent-text)] hover:bg-[var(--pepe-gold)]/10 transition-colors"
                    >
                      <Instagram className="w-4 h-4" aria-hidden="true" />
                    </a>
                  )}
                  {artist.websiteUrl && (
                    <a
                      href={artist.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={labels.website.replace('{name}', artist.name)}
                      title={labels.website.replace('{name}', artist.name)}
                      className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-[var(--pepe-line)] text-[var(--pepe-accent-text)] hover:bg-[var(--pepe-gold)]/10 transition-colors"
                    >
                      <Globe className="w-4 h-4" aria-hidden="true" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
