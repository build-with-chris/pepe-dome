import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import ArtistForm, { type ArtistFormData } from '@/components/admin/forms/ArtistForm'
import DeleteArtistButton from '@/components/admin/DeleteArtistButton'
import { canEdit } from '@/lib/roles.server'
import prisma from '@/lib/prisma'
import type { Artist } from '@prisma/client'

export const dynamic = 'force-dynamic'

/** Siehe src/lib/db-courses.ts: der exportierte prisma-Client ist als `any` typisiert. */
type ArtistRow = Artist & { _count: { events: number } }

export default async function EditArtistPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  if (!(await canEdit())) {
    redirect('/admin/artists')
  }

  const { id } = await params
  const artist = (await prisma.artist.findUnique({
    where: { id },
    include: { _count: { select: { events: true } } },
  })) as ArtistRow | null

  if (!artist) notFound()

  const translations = (artist.translations ?? {}) as Record<string, { bio?: string }>

  const initial: Partial<ArtistFormData> = {
    id: artist.id,
    name: artist.name,
    imageUrl: artist.imageUrl ?? '',
    bio: artist.bio,
    bioEn: translations.en?.bio ?? '',
    instagramUrl: artist.instagramUrl ?? '',
    websiteUrl: artist.websiteUrl ?? '',
  }

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/artists"
          className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-[#016dca] transition-colors mb-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Zurück zu Artists
        </Link>
        <h1 className="text-xl font-semibold text-white">{artist.name}</h1>
        <p className="text-white/50 mt-1">
          {artist._count.events === 1
            ? 'Hängt an 1 Event.'
            : `Hängt an ${artist._count.events} Events.`}{' '}
          Änderungen sind dort sofort nach dem Speichern sichtbar.
        </p>
      </div>

      <ArtistForm mode="edit" initial={initial} />

      <div className="bg-[#111113] border border-red-500/20 rounded-xl p-6">
        <h2 className="text-[13px] font-semibold text-white uppercase tracking-wider mb-3">
          Artist löschen
        </h2>
        <p className="text-sm leading-relaxed text-white/50 mb-4">
          Entfernt Foto, Bio und Links. Auf den Eventseiten verschwindet die Karte,
          die Events selbst bleiben unverändert.
        </p>
        <DeleteArtistButton
          artistId={artist.id}
          artistName={artist.name}
          eventCount={artist._count.events}
        />
      </div>
    </div>
  )
}
