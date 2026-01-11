'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/Button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

const INTEREST_OPTIONS = [
  { id: 'shows-events', label: 'Shows & Events' },
  { id: 'workshops', label: 'Workshops & Community' },
  { id: 'corporate', label: 'Corporate & Business Events' },
]

/**
 * Subscribers Client Component
 * Handles interactive subscriber table and detail modal
 */

interface Subscriber {
  id: string
  email: string
  firstName: string | null
  status: string
  interests: unknown
  createdAt: string
  confirmedAt: string | null
  lastOpenAt: string | null
  lastClickAt: string | null
}

interface SubscriberDetail extends Subscriber {
  unsubscribedAt: string | null
  metadata: unknown
  activity: {
    id: string
    eventType: string
    createdAt: string
    newsletter: {
      id: string
      subject: string
      slug: string
    } | null
    eventData: unknown
  }[]
}

interface SubscribersClientProps {
  subscribers: Subscriber[]
  statusColors: Record<string, string>
  statusLabels: Record<string, string>
}

const eventTypeLabels: Record<string, string> = {
  SENT: 'Gesendet',
  DELIVERED: 'Zugestellt',
  OPENED: 'Geoffnet',
  CLICKED: 'Geklickt',
  BOUNCED: 'Bounced',
  COMPLAINED: 'Beschwerde',
  UNSUBSCRIBED: 'Abgemeldet',
}

const eventTypeColors: Record<string, string> = {
  SENT: 'text-blue-400',
  DELIVERED: 'text-emerald-400',
  OPENED: 'text-[#016dca]',
  CLICKED: 'text-[#016dca]',
  BOUNCED: 'text-red-400',
  COMPLAINED: 'text-red-400',
  UNSUBSCRIBED: 'text-gray-400',
}

export default function SubscribersClient({
  subscribers,
  statusColors,
  statusLabels,
}: SubscribersClientProps) {
  const router = useRouter()
  const [selectedSubscriber, setSelectedSubscriber] = useState<SubscriberDetail | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Add subscriber dialog state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [addForm, setAddForm] = useState({ email: '', firstName: '', interests: [] as string[] })
  const [addError, setAddError] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  const handleRowClick = async (subscriberId: string) => {
    setIsLoading(true)
    setIsModalOpen(true)

    try {
      const res = await fetch(`/api/admin/subscribers/${subscriberId}`)
      const data = await res.json()

      if (res.ok && data.data) {
        setSelectedSubscriber(data.data)
      }
    } catch (error) {
      console.error('Failed to load subscriber details:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedSubscriber(null)
  }

  const handleInterestToggle = (interestId: string) => {
    setAddForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter((id) => id !== interestId)
        : [...prev.interests, interestId],
    }))
  }

  const handleAddSubscriber = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddError('')
    setIsAdding(true)

    try {
      const res = await fetch('/api/admin/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: addForm.email,
          firstName: addForm.firstName || undefined,
          interests: addForm.interests.length > 0 ? addForm.interests : undefined,
          status: 'ACTIVE',
          skipConfirmation: true,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error?.message || 'Ein Fehler ist aufgetreten.')
      }

      setIsAddDialogOpen(false)
      setAddForm({ email: '', firstName: '', interests: [] })
      router.refresh()
    } catch (error: unknown) {
      setAddError(error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten.')
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <>
      {/* Add Subscriber Button */}
      <div className="flex justify-end mb-4">
        <Button variant="primary" size="sm" onClick={() => setIsAddDialogOpen(true)}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Subscriber hinzufügen
        </Button>
      </div>

      {/* Subscribers Table */}
      <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl overflow-hidden">
        {subscribers.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-white/40">Keine Subscribers gefunden</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-white/[0.02]">
              <tr>
                <th className="px-5 py-4 text-left text-[11px] font-semibold text-white/40 uppercase tracking-wider">Email</th>
                <th className="px-5 py-4 text-left text-[11px] font-semibold text-white/40 uppercase tracking-wider hidden md:table-cell">Name</th>
                <th className="px-5 py-4 text-left text-[11px] font-semibold text-white/40 uppercase tracking-wider">Status</th>
                <th className="px-5 py-4 text-left text-[11px] font-semibold text-white/40 uppercase tracking-wider hidden md:table-cell">Interessen</th>
                <th className="px-5 py-4 text-left text-[11px] font-semibold text-white/40 uppercase tracking-wider hidden md:table-cell">Angemeldet</th>
                <th className="px-5 py-4 text-left text-[11px] font-semibold text-white/40 uppercase tracking-wider hidden lg:table-cell">Letzte Aktivität</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {subscribers.map((subscriber) => (
                <tr
                  key={subscriber.id}
                  onClick={() => handleRowClick(subscriber.id)}
                  className="hover:bg-white/[0.02] transition-colors cursor-pointer"
                >
                  <td className="px-5 py-4 text-[13px] text-white">
                    {subscriber.email}
                  </td>
                  <td className="px-5 py-4 text-[13px] text-white/60 hidden md:table-cell">
                    {subscriber.firstName || '-'}
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant="outline" className={cn('text-[10px] border', statusColors[subscriber.status])}>
                      {statusLabels[subscriber.status] || subscriber.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-[13px] text-white/60 hidden md:table-cell">
                    {Array.isArray(subscriber.interests) && subscriber.interests.length > 0
                      ? (subscriber.interests as string[]).join(', ')
                      : '-'}
                  </td>
                  <td className="px-5 py-4 text-[13px] text-white/40 hidden md:table-cell">
                    {new Date(subscriber.createdAt).toLocaleDateString('de-DE')}
                  </td>
                  <td className="px-5 py-4 text-[13px] text-white/40 hidden lg:table-cell">
                    {subscriber.lastOpenAt
                      ? new Date(subscriber.lastOpenAt).toLocaleDateString('de-DE')
                      : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Subscriber Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-[#111113] border-white/[0.08] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Subscriber hinzufügen</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddSubscriber} className="space-y-4">
            <div>
              <label htmlFor="add-email" className="block text-[11px] text-white/50 uppercase tracking-wider mb-2">
                E-Mail-Adresse *
              </label>
              <input
                id="add-email"
                type="email"
                value={addForm.email}
                onChange={(e) => setAddForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="email@example.com"
                required
                disabled={isAdding}
                className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-[#016dca]"
              />
            </div>
            <div>
              <label htmlFor="add-firstName" className="block text-[11px] text-white/50 uppercase tracking-wider mb-2">
                Vorname (optional)
              </label>
              <input
                id="add-firstName"
                type="text"
                value={addForm.firstName}
                onChange={(e) => setAddForm((prev) => ({ ...prev, firstName: e.target.value }))}
                placeholder="Max"
                disabled={isAdding}
                className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-[#016dca]"
              />
            </div>
            <div>
              <label className="block text-[11px] text-white/50 uppercase tracking-wider mb-2">Interessen (optional)</label>
              <div className="space-y-2">
                {INTEREST_OPTIONS.map((option) => (
                  <label key={option.id} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={addForm.interests.includes(option.id)}
                      onChange={() => handleInterestToggle(option.id)}
                      disabled={isAdding}
                      className="w-4 h-4 rounded border-white/[0.08] bg-transparent checked:bg-[#016dca] checked:border-[#016dca] cursor-pointer"
                    />
                    <span className="text-sm text-white/60 group-hover:text-white transition-colors">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            {addError && <p className="text-sm text-red-400">{addError}</p>}
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={() => setIsAddDialogOpen(false)} disabled={isAdding}>
                Abbrechen
              </Button>
              <Button type="submit" variant="primary" disabled={isAdding}>
                {isAdding ? 'Wird hinzugefügt...' : 'Hinzufügen'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Subscriber Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="bg-[#111113] border-white/[0.08] max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">
              Subscriber Details
            </DialogTitle>
          </DialogHeader>

          {isLoading ? (
            <div className="py-12 text-center">
              <div className="inline-block w-8 h-8 border-2 border-[#016dca] border-t-transparent rounded-full animate-spin" />
              <p className="mt-4 text-white/40">Lade Details...</p>
            </div>
          ) : selectedSubscriber ? (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Kontakt</h3>
                  <Badge
                    variant="outline"
                    className={cn('text-[10px] border', statusColors[selectedSubscriber.status])}
                  >
                    {statusLabels[selectedSubscriber.status] || selectedSubscriber.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-white/40 text-xs">E-Mail</p>
                    <p className="text-white font-medium">{selectedSubscriber.email}</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs">Name</p>
                    <p className="text-white">{selectedSubscriber.firstName || '-'}</p>
                  </div>
                </div>

                {Array.isArray(selectedSubscriber.interests) && selectedSubscriber.interests.length > 0 && (
                  <div>
                    <p className="text-white/40 text-xs">Interessen</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {(selectedSubscriber.interests as string[]).map((interest, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 bg-[#016dca]/10 text-[#016dca] text-xs rounded-lg"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Dates */}
              <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-5">
                <h3 className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-4">Zeitstempel</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-white/40 text-xs">Registriert am</p>
                    <p className="text-white">
                      {new Date(selectedSubscriber.createdAt).toLocaleString('de-DE')}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs">Bestätigt am</p>
                    <p className="text-white">
                      {selectedSubscriber.confirmedAt
                        ? new Date(selectedSubscriber.confirmedAt).toLocaleString('de-DE')
                        : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs">Letzte Öffnung</p>
                    <p className="text-white">
                      {selectedSubscriber.lastOpenAt
                        ? new Date(selectedSubscriber.lastOpenAt).toLocaleString('de-DE')
                        : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs">Letzter Klick</p>
                    <p className="text-white">
                      {selectedSubscriber.lastClickAt
                        ? new Date(selectedSubscriber.lastClickAt).toLocaleString('de-DE')
                        : '-'}
                    </p>
                  </div>
                  {selectedSubscriber.unsubscribedAt && (
                    <div className="col-span-2">
                      <p className="text-white/40 text-xs">Abgemeldet am</p>
                      <p className="text-red-400">
                        {new Date(selectedSubscriber.unsubscribedAt).toLocaleString('de-DE')}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Activity History */}
              <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-5">
                <h3 className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-4">
                  Aktivitätshistorie ({selectedSubscriber.activity.length})
                </h3>

                {selectedSubscriber.activity.length === 0 ? (
                  <p className="text-white/40 text-sm">Keine Aktivität vorhanden</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {selectedSubscriber.activity.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-start justify-between p-3 bg-white/[0.02] rounded-lg text-sm"
                      >
                        <div className="flex items-center gap-3">
                          <span className={cn('font-medium', eventTypeColors[event.eventType])}>
                            {eventTypeLabels[event.eventType] || event.eventType}
                          </span>
                          {event.newsletter && (
                            <span className="text-white/40 truncate max-w-48">
                              {event.newsletter.subject}
                            </span>
                          )}
                        </div>
                        <span className="text-white/30 text-xs whitespace-nowrap">
                          {new Date(event.createdAt).toLocaleString('de-DE', {
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end">
                <Button variant="ghost" onClick={handleCloseModal}>
                  Schließen
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-red-400">Fehler beim Laden der Details</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
