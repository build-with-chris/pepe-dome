'use client'

/**
 * Vertragsliste im Admin: Typ, Gegenseite, Termin und Status auf einen Blick.
 *
 * Der Status lässt sich direkt in der Zeile umschalten. Löschen geht nur bei
 * Entwürfen, bei allem anderen fehlt der Knopf, und die API lehnt es ab.
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import DataTable, { type Column } from '@/components/admin/DataTable'
import { PageHeader } from '@/components/admin/PageHeader'
import ContractStatusSelect from '@/components/admin/ContractStatusSelect'
import { Button } from '@/components/ui/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TYP_LABEL, type Vertragsstatus, type Vertragstyp } from '@/lib/vertraege/validation'

type Vertrag = {
  id: string
  type: Vertragstyp
  status: Vertragsstatus
  title: string
  partnerName: string
  eventDate: string | null
}

function termin(wert: string | null): string {
  if (!wert) return 'offen'
  // Nur der Tag zählt. Ohne feste Zeitzone würde aus Mitternacht UTC je nach
  // Browser der Vortag.
  return new Date(wert).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export default function ContractsList() {
  const [vertraege, setVertraege] = useState<Vertrag[]>([])
  const [loading, setLoading] = useState(true)
  const [fehler, setFehler] = useState<string | null>(null)
  const [zuLoeschen, setZuLoeschen] = useState<Vertrag | null>(null)
  const [loescht, setLoescht] = useState(false)

  useEffect(() => {
    async function laden() {
      try {
        const res = await fetch('/api/admin/contracts')
        if (!res.ok) throw new Error('Verträge konnten nicht geladen werden')
        const body = await res.json()
        setVertraege(body.contracts ?? [])
      } catch (error) {
        setFehler(error instanceof Error ? error.message : 'Verträge konnten nicht geladen werden')
      } finally {
        setLoading(false)
      }
    }
    laden()
  }, [])

  async function loeschen() {
    if (!zuLoeschen) return
    setLoescht(true)
    setFehler(null)
    try {
      const res = await fetch(`/api/admin/contracts/${zuLoeschen.id}`, { method: 'DELETE' })
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.error ?? 'Löschen fehlgeschlagen')
      }
      setVertraege((liste) => liste.filter((vertrag) => vertrag.id !== zuLoeschen.id))
    } catch (error) {
      setFehler(error instanceof Error ? error.message : 'Löschen fehlgeschlagen')
    } finally {
      setLoescht(false)
      setZuLoeschen(null)
    }
  }

  const columns: Column<Vertrag>[] = [
    {
      header: 'Gegenseite',
      accessorKey: 'partnerName',
      sortable: true,
      cell: (row) => (
        <Link href={`/admin/contracts/${row.id}`} className="block group">
          <span className="font-medium text-white group-hover:text-[#2a92f0]">
            {row.partnerName}
          </span>
          <span className="block text-[12px] text-white/40">{row.title}</span>
        </Link>
      ),
    },
    {
      header: 'Typ',
      accessorKey: 'type',
      sortable: true,
      cell: (row) => <span className="text-white/70">{TYP_LABEL[row.type]}</span>,
    },
    {
      header: 'Termin',
      accessorKey: 'eventDate',
      sortable: true,
      cell: (row) => (
        <span className={row.eventDate ? 'text-white/70' : 'text-white/30'}>
          {termin(row.eventDate)}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      cell: (row) => (
        <ContractStatusSelect
          contractId={row.id}
          status={row.status}
          titel={row.title}
          onGeaendert={(status) =>
            setVertraege((liste) =>
              liste.map((vertrag) => (vertrag.id === row.id ? { ...vertrag, status } : vertrag))
            )
          }
        />
      ),
    },
  ]

  const actions = (row: Vertrag) => (
    <div className="flex items-center justify-end gap-2">
      <a href={`/api/admin/contracts/${row.id}/pdf`}>
        <Button variant="ghost" size="xs">
          PDF
        </Button>
      </a>
      <Link href={`/admin/contracts/${row.id}`}>
        <Button variant="ghost" size="xs">
          {row.status === 'ENTWURF' ? 'Bearbeiten' : 'Ansehen'}
        </Button>
      </Link>
      {row.status === 'ENTWURF' && (
        <Button variant="ghost" size="xs" onClick={() => setZuLoeschen(row)}>
          Löschen
        </Button>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Verträge"
        description="Mietvereinbarungen und Angebote. Das PDF wird heruntergeladen und wie gewohnt per Mail verschickt."
        action={
          <Link href="/admin/contracts/new">
            <Button variant="primary" size="sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Neuer Vertrag
            </Button>
          </Link>
        }
      />

      {fehler && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {fehler}
        </div>
      )}

      <DataTable
        data={vertraege}
        columns={columns}
        getRowKey={(row) => row.id}
        loading={loading}
        emptyMessage="Noch keine Verträge angelegt"
        actions={actions}
        searchable
        searchPlaceholder="Verträge suchen…"
        searchKeys={['partnerName', 'title']}
      />

      <Dialog open={!!zuLoeschen} onOpenChange={(offen) => !offen && setZuLoeschen(null)}>
        <DialogContent className="bg-[#111113] border-white/[0.08]">
          <DialogHeader>
            <DialogTitle className="text-white">Entwurf löschen</DialogTitle>
            <DialogDescription className="text-white/50">
              {zuLoeschen?.title} wird gelöscht. Das lässt sich nicht rückgängig machen.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-3">
            <Button variant="ghost" onClick={() => setZuLoeschen(null)} disabled={loescht}>
              Abbrechen
            </Button>
            <Button variant="destructive" onClick={loeschen} disabled={loescht}>
              {loescht ? 'Löschen…' : 'Löschen'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
