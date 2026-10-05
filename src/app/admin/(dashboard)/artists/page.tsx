'use client'

/**
 * Artist-Liste im Admin.
 *
 * Die Spalte „Events" zeigt, an wie vielen Events jemand hängt. Das ist die
 * Zahl, die man vor dem Löschen wissen will, und sie macht sichtbar, wer
 * angelegt, aber noch nirgends zugeordnet ist.
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import DataTable, { type Column } from '@/components/admin/DataTable'
import { PageHeader } from '@/components/admin/PageHeader'
import { Button } from '@/components/ui/Button'

type Artist = {
  id: string
  name: string
  imageUrl: string | null
  instagramUrl: string | null
  eventCount: number
}

export default function ArtistsAdminPage() {
  const router = useRouter()
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function laden() {
      try {
        const res = await fetch('/api/admin/artists')
        if (!res.ok) throw new Error('Artists konnten nicht geladen werden')
        const body = await res.json()
        setArtists(body.artists ?? [])
      } catch (error) {
        console.error('Fehler beim Laden der Artists:', error)
      } finally {
        setLoading(false)
      }
    }
    laden()
  }, [])

  const columns: Column<Artist>[] = [
    {
      header: 'Artist',
      accessorKey: 'name',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-3">
          {row.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={row.imageUrl}
              alt=""
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover shrink-0"
            />
          ) : (
            <span className="w-8 h-8 rounded-full bg-white/[0.06] shrink-0" aria-hidden="true" />
          )}
          <span className="font-medium text-white">{row.name}</span>
        </div>
      ),
    },
    {
      header: 'Events',
      accessorKey: 'eventCount',
      sortable: true,
      cell: (row) => (
        <span className={row.eventCount === 0 ? 'text-white/30' : 'text-white/70'}>
          {row.eventCount}
        </span>
      ),
    },
  ]

  const actions = (row: Artist) => (
    <div className="flex items-center justify-end gap-2">
      <Link href={`/admin/artists/${row.id}/edit`}>
        <Button variant="ghost" size="xs">
          Bearbeiten
        </Button>
      </Link>
    </div>
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Artists"
        description={`${artists.length} Artists. Zuordnen geht im Event-Formular unter „Wer auftritt".`}
        action={
          <Link href="/admin/artists/new">
            <Button variant="primary" size="sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Neuer Artist
            </Button>
          </Link>
        }
      />

      <DataTable
        data={artists}
        columns={columns}
        getRowKey={(row) => row.id}
        loading={loading}
        emptyMessage="Noch keine Artists angelegt"
        actions={actions}
        searchable
        searchPlaceholder="Artists suchen…"
        searchKeys={['name']}
        onRowClick={(row) => router.push(`/admin/artists/${row.id}/edit`)}
      />
    </div>
  )
}
