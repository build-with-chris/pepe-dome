import Link from 'next/link'
import { redirect } from 'next/navigation'
import ArtistForm from '@/components/admin/forms/ArtistForm'
import { canEdit } from '@/lib/roles.server'

export default async function NewArtistPage() {
  if (!(await canEdit())) {
    redirect('/admin/artists')
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
        <h1 className="text-xl font-semibold text-white">Neuen Artist anlegen</h1>
        <p className="text-white/50 mt-1">
          Die Bio wird einmal gepflegt und erscheint bei jedem Event, dem der Artist
          zugeordnet wird.
        </p>
      </div>

      <ArtistForm mode="create" />
    </div>
  )
}
