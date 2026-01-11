'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
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
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-5">
          <p className="text-[11px] text-white/50 uppercase tracking-wider mb-2">Gesamt</p>
          <p className="text-2xl font-bold text-white">
            {recipients.length}
          </p>
        </div>
        <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-5">
          <p className="text-[11px] text-white/50 uppercase tracking-wider mb-2">Aktiv</p>
          <p className="text-2xl font-bold text-emerald-400">
            {activeCount}
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {/* Add Form */}
      {isAdding ? (
        <form
          onSubmit={handleAdd}
          className="p-6 bg-white/[0.02] border border-white/[0.08] rounded-xl space-y-4"
        >
          <div>
            <label className="block text-[11px] text-white/50 uppercase tracking-wider mb-2">
              E-Mail *
            </label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white focus:border-[#016dca] focus:outline-none"
              placeholder="test@example.com"
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block text-[11px] text-white/50 uppercase tracking-wider mb-2">
              Name (optional)
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white focus:border-[#016dca] focus:outline-none"
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
      ) : (
        <Button variant="primary" size="sm" onClick={() => setIsAdding(true)}>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Neuen Test-Empfänger hinzufügen
        </Button>
      )}

      {/* Recipients Table */}
      <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-white/[0.02]">
            <tr>
              <th className="text-left px-5 py-4 text-[11px] font-semibold text-white/40 uppercase tracking-wider">
                E-Mail
              </th>
              <th className="text-left px-5 py-4 text-[11px] font-semibold text-white/40 uppercase tracking-wider">
                Name
              </th>
              <th className="text-left px-5 py-4 text-[11px] font-semibold text-white/40 uppercase tracking-wider">
                Status
              </th>
              <th className="text-right px-5 py-4 text-[11px] font-semibold text-white/40 uppercase tracking-wider">
                Aktionen
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {recipients.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-5 py-12 text-center text-white/40"
                >
                  Keine Test-Empfänger vorhanden
                </td>
              </tr>
            ) : (
              recipients.map((recipient) => (
                <tr key={recipient.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-4 text-[13px] text-white">
                    {recipient.email}
                  </td>
                  <td className="px-5 py-4 text-[13px] text-white/60">
                    {recipient.name || '-'}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={cn(
                        'px-2.5 py-1 rounded-lg text-[10px] font-medium border',
                        recipient.isActive
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                      )}
                    >
                      {recipient.isActive ? 'Aktiv' : 'Inaktiv'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() =>
                          handleToggleActive(recipient.id, recipient.isActive)
                        }
                        disabled={loading === recipient.id}
                        className={cn(
                          'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                          recipient.isActive
                            ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                        )}
                      >
                        {loading === recipient.id
                          ? '...'
                          : recipient.isActive
                          ? 'Deaktivieren'
                          : 'Aktivieren'}
                      </button>
                      <button
                        onClick={() => handleDelete(recipient.id)}
                        disabled={loading === recipient.id}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                      >
                        {loading === recipient.id ? '...' : 'Löschen'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
