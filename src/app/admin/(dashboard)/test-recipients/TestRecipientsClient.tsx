'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { PageHeader } from '@/components/admin/PageHeader'
import { StatsGrid, StatCard } from '@/components/admin/StatsGrid'
import { AdminCard } from '@/components/admin/AdminCard'
import { cn } from '@/lib/utils'

interface TestRecipient {
  id: string
  email: string
  name: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface Props {
  initialRecipients: TestRecipient[]
}

export default function TestRecipientsClient({ initialRecipients }: Props) {
  const [recipients, setRecipients] = useState<TestRecipient[]>(initialRecipients)
  const [isAdding, setIsAdding] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [newName, setNewName] = useState('')
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEmail.trim()) return

    setLoading('add')
    setError(null)

    try {
      const res = await fetch('/api/admin/test-recipients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newEmail.trim(),
          name: newName.trim() || null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error?.message || 'Fehler beim Hinzufügen')
        return
      }

      setRecipients([
        {
          ...data.data,
          createdAt: data.data.createdAt,
          updatedAt: data.data.updatedAt,
        },
        ...recipients,
      ])
      setNewEmail('')
      setNewName('')
      setIsAdding(false)
    } catch {
      setError('Netzwerkfehler')
    } finally {
      setLoading(null)
    }
  }

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    setLoading(id)
    setError(null)

    try {
      const res = await fetch(`/api/admin/test-recipients/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentActive }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error?.message || 'Fehler beim Aktualisieren')
        return
      }

      setRecipients(
        recipients.map((r) =>
          r.id === id ? { ...r, isActive: !currentActive } : r
        )
      )
    } catch {
      setError('Netzwerkfehler')
    } finally {
      setLoading(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Wirklich löschen?')) return

    setLoading(id)
    setError(null)

    try {
      const res = await fetch(`/api/admin/test-recipients/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error?.message || 'Fehler beim Löschen')
        return
      }

      setRecipients(recipients.filter((r) => r.id !== id))
    } catch {
      setError('Netzwerkfehler')
    } finally {
      setLoading(null)
    }
  }

  const activeCount = recipients.filter((r) => r.isActive).length

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Test-Empfänger"
        description="E-Mail-Adressen für Newsletter-Tests verwalten"
        action={
          !isAdding ? (
            <Button variant="primary" size="sm" onClick={() => setIsAdding(true)}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Neuer Empfänger
            </Button>
          ) : undefined
        }
      />

      {/* Stats */}
      <StatsGrid columns={2}>
        <StatCard label="Gesamt" value={recipients.length} variant="default" />
        <StatCard label="Aktiv" value={activeCount} variant="success" />
      </StatsGrid>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Add Form */}
      {isAdding && (
        <AdminCard padding="lg">
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">
                E-Mail *
              </label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white focus:border-[#016dca] focus:outline-none"
                placeholder="test@example.com"
                required
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">
                Name (optional)
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white focus:border-[#016dca] focus:outline-none"
                placeholder="Test Person"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" variant="primary" size="sm" disabled={loading === 'add'}>
                {loading === 'add' ? 'Speichern...' : 'Hinzufügen'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsAdding(false)}
              >
                Abbrechen
              </Button>
            </div>
          </form>
        </AdminCard>
      )}

      {/* Recipients Table */}
      <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl overflow-hidden">
        {recipients.length === 0 ? (
          <div className="p-16 text-center">
            <p className="text-white/40 text-sm">Keine Test-Empfänger vorhanden</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-white/[0.04]">
                <TableHead>E-Mail</TableHead>
                <TableHead className="hidden sm:table-cell">Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recipients.map((recipient) => (
                <TableRow key={recipient.id}>
                  <TableCell className="text-white font-medium">
                    {recipient.email}
                  </TableCell>
                  <TableCell className="text-white/60 hidden sm:table-cell">
                    {recipient.name || '-'}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-[10px] border',
                        recipient.isActive
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                      )}
                    >
                      {recipient.isActive ? 'Aktiv' : 'Inaktiv'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleActive(recipient.id, recipient.isActive)}
                        disabled={loading === recipient.id}
                        className={cn(
                          recipient.isActive
                            ? 'text-yellow-400 hover:text-yellow-300'
                            : 'text-emerald-400 hover:text-emerald-300'
                        )}
                      >
                        {loading === recipient.id
                          ? '...'
                          : recipient.isActive
                          ? 'Deaktivieren'
                          : 'Aktivieren'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(recipient.id)}
                        disabled={loading === recipient.id}
                        className="text-red-400 hover:text-red-300"
                      >
                        {loading === recipient.id ? '...' : 'Löschen'}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
