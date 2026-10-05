'use client'

/**
 * „Wer auftritt" im Event-Formular.
 *
 * Oben stehen die gewählten Artists in der Reihenfolge, in der sie auf der
 * Eventseite erscheinen. Darunter alle übrigen zum Anklicken. Was zuerst
 * angeklickt wird, steht zuerst. Wer die Reihenfolge ändern will, nimmt
 * jemanden heraus und fügt ihn wieder hinzu.
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import FieldHint from '@/components/admin/ui/FieldHint'

type ArtistOption = { id: string; name: string; imageUrl: string | null }

function Avatar({ artist }: { artist: ArtistOption }) {
  return artist.imageUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={artist.imageUrl}
      alt=""
      width={24}
      height={24}
      className="w-6 h-6 rounded-full object-cover shrink-0"
    />
  ) : (
    <span className="w-6 h-6 rounded-full bg-white/[0.08] shrink-0" aria-hidden="true" />
  )
}

export default function EventArtistPicker({
  value,
  onChange,
}: {
  value: string[]
  onChange: (ids: string[]) => void
}) {
  const [artists, setArtists] = useState<ArtistOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function laden() {
      try {
        const res = await fetch('/api/admin/artists')
        if (!res.ok) throw new Error('Artists konnten nicht geladen werden')
        const body = await res.json()
        setArtists(body.artists ?? [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Artists konnten nicht geladen werden')
      } finally {
        setLoading(false)
      }
    }
    laden()
  }, [])

  // Ein inzwischen gelöschter Artist fehlt in der Liste. Ohne dieses Aufräumen
  // ginge seine ID beim Speichern mit und die Route scheiterte am Fremdschlüssel.
  useEffect(() => {
    if (loading || error) return
    const bekannt = value.filter((id) => artists.some((artist) => artist.id === id))
    if (bekannt.length !== value.length) onChange(bekannt)
  }, [loading, error, artists, value, onChange])

  const byId = new Map(artists.map((artist) => [artist.id, artist]))
  const gewaehlt = value.map((id) => byId.get(id)).filter((a): a is ArtistOption => !!a)
  const uebrig = artists.filter((artist) => !value.includes(artist.id))

  return (
    <div className="space-y-4">
      {loading ? (
        <p className="text-sm text-white/40">Lade Artists…</p>
      ) : error ? (
        <p className="text-sm text-red-400">{error}</p>
      ) : (
        <>
          {gewaehlt.length > 0 ? (
            <ol className="space-y-2 list-none m-0 p-0" aria-label="Ausgewählte Artists">
              {gewaehlt.map((artist, index) => (
                <li
                  key={artist.id}
                  className="m-0 flex items-center gap-3 rounded-lg border border-[#016dca]/40 bg-[#016dca]/10 px-3 py-2"
                >
                  <span className="text-[11px] text-white/40 w-4 text-right">{index + 1}</span>
                  <Avatar artist={artist} />
                  <span className="flex-1 min-w-0 truncate text-sm text-white">{artist.name}</span>
                  <button
                    type="button"
                    onClick={() => onChange(value.filter((id) => id !== artist.id))}
                    className="text-white/50 hover:text-red-300 text-sm px-2"
                    aria-label={`${artist.name} entfernen`}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-white/50">Noch niemand ausgewählt.</p>
          )}

          {uebrig.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {uebrig.map((artist) => (
                <button
                  key={artist.id}
                  type="button"
                  onClick={() => onChange([...value, artist.id])}
                  className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.03] pl-1 pr-3 py-1 text-sm text-white/80 hover:border-[#016dca]/60 hover:text-white transition-colors"
                >
                  <Avatar artist={artist} />
                  + {artist.name}
                </button>
              ))}
            </div>
          )}

          {artists.length === 0 && (
            <p className="text-sm text-white/50">Es sind noch keine Artists angelegt.</p>
          )}
        </>
      )}

      <FieldHint>
        Erscheint auf der Eventseite unter der Beschreibung, in dieser Reihenfolge.
        Bio und Links werden unter{' '}
        <Link href="/admin/artists" className="text-[#016dca] hover:underline" target="_blank">
          Artists
        </Link>{' '}
        gepflegt.
      </FieldHint>
    </div>
  )
}
