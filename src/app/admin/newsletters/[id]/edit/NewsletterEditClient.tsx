'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import NewsletterForm from '@/components/admin/forms/NewsletterForm'
import ContentSelector from '@/components/newsletter/ContentSelector'
import DragDropReorder from '@/components/newsletter/DragDropReorder'
import AdminEmailPreview from '@/components/admin/EmailPreview'
import { Button } from '@/components/ui/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'

/**
 * Newsletter Edit Client Component
 * Client-side form with edit/preview tabs, content management, and send/schedule functionality
 */

interface ContentBlock {
  id?: string
  contentType: string
  contentId: string | null
  sectionHeading?: string | null
  sectionDescription?: string | null
  orderPosition: number
  _metadata?: {
    title: string
    imageUrl?: string
    date?: string
  }
}

interface Newsletter {
  id: string
  slug: string
  subject: string
  preheader: string | null
  introText: string | null
  heroImageUrl: string | null
  heroTitle: string | null
  heroSubtitle: string | null
  heroCTALabel: string | null
  heroCTAUrl: string | null
  status: string
  scheduledAt: Date | null
  sentAt: Date | null
  recipientCount: number
  content: ContentBlock[]
  stats?: {
    uniqueOpenCount: number
    uniqueClickCount: number
  } | null
}

interface NewsletterEditClientProps {
  newsletter: Newsletter
  canEdit: boolean
  canSend: boolean
  canTestSend: boolean
}

export default function NewsletterEditClient({
  newsletter,
  canEdit,
  canSend,
  canTestSend,
}: NewsletterEditClientProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'edit' | 'preview' | 'content'>('edit')
  const [selectedContent, setSelectedContent] = useState<ContentBlock[]>(
    newsletter.content || []
  )
  const [showContentSelector, setShowContentSelector] = useState(false)

  // Send/Schedule modal states
  const [showSendModal, setShowSendModal] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isScheduling, setIsScheduling] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)
  const [scheduleError, setScheduleError] = useState<string | null>(null)
  const [subscriberCount, setSubscriberCount] = useState<number>(0)

  // Schedule state
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>(undefined)
  const [scheduleTime, setScheduleTime] = useState('10:00')

  // Fetch subscriber count when send modal opens
  const openSendModal = async () => {
    setSendError(null)
    try {
      const res = await fetch('/api/admin/subscribers?status=ACTIVE&limit=1')
      const data = await res.json()
      setSubscriberCount(data.meta?.pagination?.total || 0)
    } catch {
      setSubscriberCount(0)
    }
    setShowSendModal(true)
  }

  // Handle send now
  const handleSendNow = async () => {
    setIsSending(true)
    setSendError(null)

    try {
      const res = await fetch(`/api/admin/newsletters/${newsletter.id}/send`, {
        method: 'POST',
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error?.message || 'Fehler beim Versenden')
      }

      setShowSendModal(false)
      router.push('/admin/newsletters')
      router.refresh()
    } catch (err) {
      setSendError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten')
    } finally {
      setIsSending(false)
    }
  }

  // Handle schedule
  const handleSchedule = async () => {
    if (!scheduleDate) {
      setScheduleError('Bitte wahlen Sie ein Datum aus')
      return
    }

    setIsScheduling(true)
    setScheduleError(null)

    try {
      // Combine date and time
      const [hours, minutes] = scheduleTime.split(':').map(Number)
      const scheduledAt = new Date(scheduleDate)
      scheduledAt.setHours(hours, minutes, 0, 0)

      if (scheduledAt <= new Date()) {
        throw new Error('Das geplante Datum muss in der Zukunft liegen')
      }

      const res = await fetch(`/api/admin/newsletters/${newsletter.id}/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheduledAt: scheduledAt.toISOString() }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error?.message || 'Fehler beim Planen')
      }

      setShowScheduleModal(false)
      router.refresh()
    } catch (err) {
      setScheduleError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten')
    } finally {
      setIsScheduling(false)
    }
  }

  // Save content order changes
  const handleContentReorder = async (newContent: ContentBlock[]) => {
    setSelectedContent(newContent)

    // Save to backend
    try {
      await fetch(`/api/admin/newsletters/${newsletter.id}/content`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newContent.map((c, i) => ({
            id: c.id,
            contentType: c.contentType,
            contentId: c.contentId,
            sectionHeading: c.sectionHeading,
            sectionDescription: c.sectionDescription,
            orderPosition: i,
          })),
        }),
      })
    } catch (err) {
      console.error('Failed to save content order:', err)
    }
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex items-center gap-1 border-b border-[var(--pepe-line)]">
        <button
          onClick={() => setActiveTab('edit')}
          className={cn(
            'px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px',
            activeTab === 'edit'
              ? 'border-[var(--pepe-gold)] text-[var(--pepe-gold)]'
              : 'border-transparent text-[var(--pepe-t64)] hover:text-[var(--pepe-t80)]'
          )}
        >
          Bearbeiten
        </button>
        <button
          onClick={() => setActiveTab('content')}
          className={cn(
            'px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px',
            activeTab === 'content'
              ? 'border-[var(--pepe-gold)] text-[var(--pepe-gold)]'
              : 'border-transparent text-[var(--pepe-t64)] hover:text-[var(--pepe-t80)]'
          )}
        >
          Inhalte ({selectedContent.length})
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={cn(
            'px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px',
            activeTab === 'preview'
              ? 'border-[var(--pepe-gold)] text-[var(--pepe-gold)]'
              : 'border-transparent text-[var(--pepe-t64)] hover:text-[var(--pepe-t80)]'
          )}
        >
          Vorschau
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'edit' && canEdit && (
        <NewsletterForm
          mode="edit"
          newsletter={newsletter}
          initialContent={selectedContent}
        />
      )}

      {activeTab === 'edit' && !canEdit && (
        <ReadOnlyNewsletterView newsletter={newsletter} />
      )}

      {activeTab === 'content' && (
        <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-lg p-6">
          {selectedContent.length === 0 ? (
            <div className="space-y-4">
              <p className="text-[var(--pepe-t64)]">
                Keine Inhalte ausgewahlt. Wahlen Sie Events und Artikel fur diesen Newsletter aus.
              </p>

              {showContentSelector ? (
                <ContentSelector
                  onContentSelected={handleContentReorder}
                  selectedContent={selectedContent}
                />
              ) : (
                <Button
                  variant="secondary"
                  onClick={() => setShowContentSelector(true)}
                  disabled={!canEdit}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Inhalte auswahlen
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <DragDropReorder
                items={selectedContent}
                onReorder={handleContentReorder}
              />

              {canEdit && (
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowContentSelector(true)}
                  >
                    Mehr Inhalte hinzufugen
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'preview' && (
        <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-lg p-6">
          <AdminEmailPreview
            newsletterId={newsletter.id}
            slug={newsletter.slug}
            canTestSend={canTestSend}
          />
        </div>
      )}

      {/* Send Actions */}
      {canEdit && (newsletter.status === 'DRAFT' || newsletter.status === 'SCHEDULED') && (
        <div className="bg-[var(--pepe-surface)] border border-[var(--pepe-line)] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[var(--pepe-white)] mb-4">
            Newsletter versenden
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Schedule */}
            {newsletter.status === 'DRAFT' && (
              <div>
                <h4 className="font-medium text-[var(--pepe-white)] mb-2">Planen</h4>
                <p className="text-sm text-[var(--pepe-t64)] mb-3">
                  Wahlen Sie Datum und Uhrzeit fur den automatischen Versand
                </p>
                <Button
                  variant="secondary"
                  onClick={() => setShowScheduleModal(true)}
                  disabled={!canSend}
                  className="w-full"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Fur spater planen
                </Button>
                {!canSend && (
                  <p className="text-xs text-[var(--pepe-t48)] mt-2">
                    Nur Super Admins konnen Newsletter versenden
                  </p>
                )}
              </div>
            )}

            {/* Send Now */}
            <div>
              <h4 className="font-medium text-[var(--pepe-white)] mb-2">Jetzt senden</h4>
              <p className="text-sm text-[var(--pepe-t64)] mb-3">
                Newsletter sofort an alle aktiven Abonnenten versenden
              </p>
              <Button
                variant="primary"
                onClick={openSendModal}
                disabled={!canSend}
                className="w-full"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Jetzt senden
              </Button>
              {!canSend && (
                <p className="text-xs text-[var(--pepe-t48)] mt-2">
                  Nur Super Admins konnen Newsletter versenden
                </p>
              )}
            </div>
          </div>

          {/* Scheduled info */}
          {newsletter.status === 'SCHEDULED' && newsletter.scheduledAt && (
            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-blue-400">
                <span className="font-medium">Geplant fur: </span>
                {new Date(newsletter.scheduledAt).toLocaleString('de-DE', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Send Confirmation Dialog */}
      <Dialog open={showSendModal} onOpenChange={setShowSendModal}>
        <DialogContent className="bg-[var(--pepe-ink)] border-[var(--pepe-line)]">
          <DialogHeader>
            <DialogTitle className="text-[var(--pepe-white)]">Newsletter jetzt senden?</DialogTitle>
            <DialogDescription className="text-[var(--pepe-t64)]">
              Diese Aktion kann nicht ruckgangig gemacht werden.
            </DialogDescription>
          </DialogHeader>

          {sendError && (
            <div className="p-3 bg-[var(--pepe-error)]/10 border border-[var(--pepe-error)]/30 rounded-lg">
              <p className="text-sm text-[var(--pepe-error)]">{sendError}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Recipient count */}
            <div className="p-4 bg-[var(--pepe-gold)]/10 border border-[var(--pepe-gold)]/30 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-[var(--pepe-t80)]">Empfanger:</span>
                <span className="text-2xl font-bold text-[var(--pepe-gold)]">
                  {subscriberCount}
                </span>
              </div>
              <p className="text-sm text-[var(--pepe-t64)] mt-2">
                Aktive Abonnenten, die diesen Newsletter erhalten werden
              </p>
            </div>

            {subscriberCount === 0 && (
              <div className="p-3 bg-[var(--pepe-error)]/10 border border-[var(--pepe-error)]/30 rounded-lg">
                <p className="text-sm text-[var(--pepe-error)]">
                  Keine aktiven Abonnenten gefunden. Newsletter kann nicht versendet werden.
                </p>
              </div>
            )}

            {/* Warning */}
            {subscriberCount > 0 && (
              <div className="p-3 bg-[var(--pepe-warning)]/10 border border-[var(--pepe-warning)]/30 rounded-lg">
                <p className="text-sm text-[var(--pepe-warning)]">
                  Warnung: Der Newsletter wird sofort an {subscriberCount} Abonnenten versendet.
                </p>
              </div>
            )}

            {/* Checklist */}
            <div className="bg-[var(--pepe-surface)] rounded-lg p-4">
              <h4 className="font-medium text-[var(--pepe-white)] mb-3">Checkliste vor dem Versand:</h4>
              <ul className="space-y-2 text-sm text-[var(--pepe-t80)]">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-[var(--pepe-gold)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Betreffzeile ist ansprechend und klar
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-[var(--pepe-gold)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Alle Links funktionieren korrekt
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-[var(--pepe-gold)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Inhalte wurden korrekturgelesen
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-[var(--pepe-gold)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Vorschau in verschiedenen E-Mail-Clients gepruft
                </li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setShowSendModal(false)}
              disabled={isSending}
            >
              Abbrechen
            </Button>
            <Button
              variant="primary"
              onClick={handleSendNow}
              disabled={isSending || subscriberCount === 0}
            >
              {isSending ? 'Wird versendet...' : `An ${subscriberCount} Empfanger senden`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Dialog */}
      <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
        <DialogContent className="bg-[var(--pepe-ink)] border-[var(--pepe-line)]">
          <DialogHeader>
            <DialogTitle className="text-[var(--pepe-white)]">Newsletter planen</DialogTitle>
            <DialogDescription className="text-[var(--pepe-t64)]">
              Wahlen Sie Datum und Uhrzeit fur den automatischen Versand.
            </DialogDescription>
          </DialogHeader>

          {scheduleError && (
            <div className="p-3 bg-[var(--pepe-error)]/10 border border-[var(--pepe-error)]/30 rounded-lg">
              <p className="text-sm text-[var(--pepe-error)]">{scheduleError}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Calendar */}
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={scheduleDate}
                onSelect={setScheduleDate}
                disabled={(date) => date < new Date()}
                className="rounded-md border border-[var(--pepe-line)]"
              />
            </div>

            {/* Time Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--pepe-white)]">
                Uhrzeit
              </label>
              <Input
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Preview */}
            {scheduleDate && (
              <div className="p-4 bg-[var(--pepe-gold)]/10 border border-[var(--pepe-gold)]/30 rounded-lg">
                <p className="text-sm font-medium text-[var(--pepe-white)]">
                  Newsletter wird gesendet am:
                </p>
                <p className="text-lg text-[var(--pepe-gold)] font-semibold">
                  {(() => {
                    const [hours, minutes] = scheduleTime.split(':').map(Number)
                    const displayDate = new Date(scheduleDate)
                    displayDate.setHours(hours, minutes, 0, 0)
                    return displayDate.toLocaleString('de-DE', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  })()}
                </p>
              </div>
            )}

            {/* Info */}
            <div className="p-3 bg-[var(--pepe-info)]/10 border border-[var(--pepe-info)]/30 rounded-lg">
              <p className="text-sm text-[var(--pepe-info)]">
                Hinweis: Die geplante Zeit muss mindestens 5 Minuten in der Zukunft liegen.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setShowScheduleModal(false)}
              disabled={isScheduling}
            >
              Abbrechen
            </Button>
            <Button
              variant="primary"
              onClick={handleSchedule}
              disabled={isScheduling || !scheduleDate}
            >
              {isScheduling ? 'Wird geplant...' : 'Newsletter planen'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ReadOnlyNewsletterView({ newsletter }: { newsletter: Newsletter }) {
  return (
    <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-lg p-6 space-y-4">
      <div>
        <label className="text-sm text-[var(--pepe-t64)]">Betreff</label>
        <p className="text-[var(--pepe-white)] font-medium">{newsletter.subject}</p>
      </div>

      {newsletter.preheader && (
        <div>
          <label className="text-sm text-[var(--pepe-t64)]">Preheader</label>
          <p className="text-[var(--pepe-t80)]">{newsletter.preheader}</p>
        </div>
      )}

      {newsletter.heroTitle && (
        <div>
          <label className="text-sm text-[var(--pepe-t64)]">Hero-Titel</label>
          <p className="text-[var(--pepe-white)]">{newsletter.heroTitle}</p>
        </div>
      )}

      {newsletter.heroSubtitle && (
        <div>
          <label className="text-sm text-[var(--pepe-t64)]">Hero-Untertitel</label>
          <p className="text-[var(--pepe-t80)]">{newsletter.heroSubtitle}</p>
        </div>
      )}

      {newsletter.sentAt && (
        <div>
          <label className="text-sm text-[var(--pepe-t64)]">Gesendet am</label>
          <p className="text-[var(--pepe-white)]">
            {new Date(newsletter.sentAt).toLocaleString('de-DE', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      )}

      {newsletter.recipientCount > 0 && (
        <div>
          <label className="text-sm text-[var(--pepe-t64)]">Empfanger</label>
          <p className="text-[var(--pepe-white)]">{newsletter.recipientCount}</p>
        </div>
      )}

      {newsletter.stats && (
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[var(--pepe-line)]">
          <div>
            <label className="text-sm text-[var(--pepe-t64)]">Offnungen</label>
            <p className="text-2xl font-bold text-[var(--pepe-gold)]">
              {newsletter.stats.uniqueOpenCount}
            </p>
          </div>
          <div>
            <label className="text-sm text-[var(--pepe-t64)]">Klicks</label>
            <p className="text-2xl font-bold text-[var(--pepe-gold)]">
              {newsletter.stats.uniqueClickCount}
            </p>
          </div>
          <div>
            <label className="text-sm text-[var(--pepe-t64)]">Offnungsrate</label>
            <p className="text-2xl font-bold text-[var(--pepe-gold)]">
              {newsletter.recipientCount > 0
                ? ((newsletter.stats.uniqueOpenCount / newsletter.recipientCount) * 100).toFixed(1)
                : '0'}%
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
