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
  DELIVERED: 'text-green-400',
  OPENED: 'text-[var(--pepe-gold)]',
  CLICKED: 'text-[var(--pepe-gold)]',
  BOUNCED: 'text-[var(--pepe-error)]',
  COMPLAINED: 'text-[var(--pepe-error)]',
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
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Subscriber hinzufugen
        </Button>
      </div>

      {/* Subscribers Table */}
      <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-lg overflow-hidden">
        {subscribers.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-[var(--pepe-t64)]">Keine Subscribers gefunden</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-[var(--pepe-surface)]">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--pepe-t64)]">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--pepe-t64)] hidden md:table-cell">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--pepe-t64)]">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--pepe-t64)] hidden md:table-cell">Interessen</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--pepe-t64)] hidden md:table-cell">Angemeldet</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--pepe-t64)] hidden lg:table-cell">Letzte Aktivitat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--pepe-line2)]">
              {subscribers.map((subscriber) => (
                <tr
                  key={subscriber.id}
                  onClick={() => handleRowClick(subscriber.id)}
                  className="hover:bg-[var(--pepe-surface)]/50 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3 text-[var(--pepe-white)]">
                    {subscriber.email}
                  </td>
                  <td className="px-4 py-3 text-[var(--pepe-t80)] hidden md:table-cell">
                    {subscriber.firstName || '-'}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={cn('text-xs border', statusColors[subscriber.status])}>
                      {statusLabels[subscriber.status] || subscriber.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-[var(--pepe-t80)] hidden md:table-cell">
                    {Array.isArray(subscriber.interests) && subscriber.interests.length > 0
                      ? (subscriber.interests as string[]).join(', ')
                      : '-'}
                  </td>
                  <td className="px-4 py-3 text-[var(--pepe-t64)] hidden md:table-cell">
                    {new Date(subscriber.createdAt).toLocaleDateString('de-DE')}
                  </td>
                  <td className="px-4 py-3 text-[var(--pepe-t64)] hidden lg:table-cell">
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
        <DialogContent className="bg-[var(--pepe-ink)] border-[var(--pepe-line)] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[var(--pepe-white)]">Subscriber hinzufugen</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddSubscriber} className="space-y-4">
            <div>
              <label htmlFor="add-email" className="block text-sm font-medium text-[var(--pepe-t80)] mb-1">
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
                className="w-full px-3 py-2 bg-[var(--pepe-surface)] border border-[var(--pepe-line)] rounded-lg text-[var(--pepe-white)] placeholder:text-[var(--pepe-t48)] focus:outline-none focus:border-[var(--pepe-gold)]"
              />
            </div>
            <div>
              <label htmlFor="add-firstName" className="block text-sm font-medium text-[var(--pepe-t80)] mb-1">
                Vorname (optional)
              </label>
              <input
                id="add-firstName"
                type="text"
                value={addForm.firstName}
                onChange={(e) => setAddForm((prev) => ({ ...prev, firstName: e.target.value }))}
                placeholder="Max"
                disabled={isAdding}
                className="w-full px-3 py-2 bg-[var(--pepe-surface)] border border-[var(--pepe-line)] rounded-lg text-[var(--pepe-white)] placeholder:text-[var(--pepe-t48)] focus:outline-none focus:border-[var(--pepe-gold)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--pepe-t80)] mb-2">Interessen (optional)</label>
              <div className="space-y-2">
                {INTEREST_OPTIONS.map((option) => (
                  <label key={option.id} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={addForm.interests.includes(option.id)}
                      onChange={() => handleInterestToggle(option.id)}
                      disabled={isAdding}
                      className="w-4 h-4 rounded border-[var(--pepe-line)] bg-transparent checked:bg-[var(--pepe-gold)] checked:border-[var(--pepe-gold)] cursor-pointer"
                    />
                    <span className="text-sm text-[var(--pepe-t80)] group-hover:text-[var(--pepe-white)] transition-colors">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            {addError && <p className="text-sm text-[var(--pepe-error)]">{addError}</p>}
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="secondary" onClick={() => setIsAddDialogOpen(false)} disabled={isAdding}>
                Abbrechen
              </Button>
              <Button type="submit" disabled={isAdding}>
                {isAdding ? 'Wird hinzugefugt...' : 'Hinzufugen'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Subscriber Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="bg-[var(--pepe-ink)] border-[var(--pepe-line)] max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[var(--pepe-white)]">
              Subscriber Details
            </DialogTitle>
          </DialogHeader>

          {isLoading ? (
            <div className="py-12 text-center">
              <div className="inline-block w-8 h-8 border-2 border-[var(--pepe-gold)] border-t-transparent rounded-full animate-spin" />
              <p className="mt-4 text-[var(--pepe-t64)]">Lade Details...</p>
            </div>
          ) : selectedSubscriber ? (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="bg-[var(--pepe-surface)] rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-[var(--pepe-white)]">Kontakt</h3>
                  <Badge
                    variant="outline"
                    className={cn('text-xs border', statusColors[selectedSubscriber.status])}
                  >
                    {statusLabels[selectedSubscriber.status] || selectedSubscriber.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-[var(--pepe-t64)]">E-Mail</p>
                    <p className="text-[var(--pepe-white)] font-medium">{selectedSubscriber.email}</p>
                  </div>
                  <div>
                    <p className="text-[var(--pepe-t64)]">Name</p>
                    <p className="text-[var(--pepe-white)]">{selectedSubscriber.firstName || '-'}</p>
                  </div>
                </div>

                {Array.isArray(selectedSubscriber.interests) && selectedSubscriber.interests.length > 0 && (
                  <div>
                    <p className="text-[var(--pepe-t64)] text-sm">Interessen</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {(selectedSubscriber.interests as string[]).map((interest, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-[var(--pepe-gold)]/10 text-[var(--pepe-gold)] text-xs rounded"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Dates */}
              <div className="bg-[var(--pepe-surface)] rounded-lg p-4">
                <h3 className="font-semibold text-[var(--pepe-white)] mb-3">Zeitstempel</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-[var(--pepe-t64)]">Registriert am</p>
                    <p className="text-[var(--pepe-white)]">
                      {new Date(selectedSubscriber.createdAt).toLocaleString('de-DE')}
                    </p>
                  </div>
                  <div>
                    <p className="text-[var(--pepe-t64)]">Bestatigt am</p>
                    <p className="text-[var(--pepe-white)]">
                      {selectedSubscriber.confirmedAt
                        ? new Date(selectedSubscriber.confirmedAt).toLocaleString('de-DE')
                        : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[var(--pepe-t64)]">Letzte Offnung</p>
                    <p className="text-[var(--pepe-white)]">
                      {selectedSubscriber.lastOpenAt
                        ? new Date(selectedSubscriber.lastOpenAt).toLocaleString('de-DE')
                        : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[var(--pepe-t64)]">Letzter Klick</p>
                    <p className="text-[var(--pepe-white)]">
                      {selectedSubscriber.lastClickAt
                        ? new Date(selectedSubscriber.lastClickAt).toLocaleString('de-DE')
                        : '-'}
                    </p>
                  </div>
                  {selectedSubscriber.unsubscribedAt && (
                    <div className="col-span-2">
                      <p className="text-[var(--pepe-t64)]">Abgemeldet am</p>
                      <p className="text-[var(--pepe-error)]">
                        {new Date(selectedSubscriber.unsubscribedAt).toLocaleString('de-DE')}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Activity History */}
              <div className="bg-[var(--pepe-surface)] rounded-lg p-4">
                <h3 className="font-semibold text-[var(--pepe-white)] mb-3">
                  Aktivitatshistorie ({selectedSubscriber.activity.length})
                </h3>

                {selectedSubscriber.activity.length === 0 ? (
                  <p className="text-[var(--pepe-t64)] text-sm">Keine Aktivitat vorhanden</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {selectedSubscriber.activity.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-start justify-between p-2 bg-[var(--pepe-ink)] rounded text-sm"
                      >
                        <div className="flex items-center gap-3">
                          <span className={cn('font-medium', eventTypeColors[event.eventType])}>
                            {eventTypeLabels[event.eventType] || event.eventType}
                          </span>
                          {event.newsletter && (
                            <span className="text-[var(--pepe-t64)] truncate max-w-48">
                              {event.newsletter.subject}
                            </span>
                          )}
                        </div>
                        <span className="text-[var(--pepe-t48)] text-xs whitespace-nowrap">
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
                <Button variant="secondary" onClick={handleCloseModal}>
                  Schliessen
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-[var(--pepe-error)]">Fehler beim Laden der Details</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
