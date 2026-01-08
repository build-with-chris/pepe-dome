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
 * Newsletter Editor - Split View
 * Left: Edit form (dynamic height)
 * Right: Sticky phone preview + send actions
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

type EditSection = 'basics' | 'hero' | 'content'

export default function NewsletterEditClient({
  newsletter,
  canEdit,
  canSend,
  canTestSend,
}: NewsletterEditClientProps) {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState<EditSection>('basics')
  const [selectedContent, setSelectedContent] = useState<ContentBlock[]>(newsletter.content || [])
  const [showContentSelector, setShowContentSelector] = useState(false)
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile')

  // Modal states
  const [showSendModal, setShowSendModal] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isScheduling, setIsScheduling] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)
  const [scheduleError, setScheduleError] = useState<string | null>(null)
  const [subscriberCount, setSubscriberCount] = useState<number>(0)
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>(undefined)
  const [scheduleTime, setScheduleTime] = useState('10:00')

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

  const handleSendNow = async () => {
    setIsSending(true)
    setSendError(null)
    try {
      const res = await fetch(`/api/admin/newsletters/${newsletter.id}/send`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error?.message || 'Fehler beim Versenden')
      setShowSendModal(false)
      router.push('/admin/newsletters')
      router.refresh()
    } catch (err) {
      setSendError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten')
    } finally {
      setIsSending(false)
    }
  }

  const handleSchedule = async () => {
    if (!scheduleDate) {
      setScheduleError('Bitte wählen Sie ein Datum aus')
      return
    }
    setIsScheduling(true)
    setScheduleError(null)
    try {
      const [hours, minutes] = scheduleTime.split(':').map(Number)
      const scheduledAt = new Date(scheduleDate)
      scheduledAt.setHours(hours, minutes, 0, 0)
      if (scheduledAt <= new Date()) throw new Error('Das Datum muss in der Zukunft liegen')
      const res = await fetch(`/api/admin/newsletters/${newsletter.id}/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheduledAt: scheduledAt.toISOString() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error?.message || 'Fehler beim Planen')
      setShowScheduleModal(false)
      router.refresh()
    } catch (err) {
      setScheduleError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten')
    } finally {
      setIsScheduling(false)
    }
  }

  const handleContentReorder = async (newContent: ContentBlock[]) => {
    setSelectedContent(newContent)
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

  const handleAddTextSnippet = () => {
    const newSnippet: ContentBlock = {
      contentType: 'CUSTOM_SECTION',
      contentId: null,
      sectionHeading: '',
      sectionDescription: '',
      orderPosition: selectedContent.length,
    }
    handleContentReorder([...selectedContent, newSnippet])
  }

  const sections: { id: EditSection; label: string }[] = [
    { id: 'basics', label: 'Grundlagen' },
    { id: 'hero', label: 'Hero' },
    { id: 'content', label: `Inhalte (${selectedContent.length})` },
  ]

  return (
    <div className={cn(
      'grid gap-6 transition-all duration-300',
      previewMode === 'desktop'
        ? 'grid-cols-1'
        : 'grid-cols-1 xl:grid-cols-[1fr,400px]'
    )}>
      {/* LEFT: Editor */}
      <div className={cn(
        'space-y-6',
        previewMode === 'desktop' && 'order-2'
      )}>
        {/* Section Tabs */}
        <div className="flex gap-2.5">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                'px-5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200',
                activeSection === section.id
                  ? 'bg-[#016dca] text-white shadow-lg shadow-[#016dca]/20'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
              )}
            >
              {section.label}
            </button>
          ))}
        </div>

        {/* Editor Card */}
        <div className="bg-[#111113] border border-white/[0.08] rounded-2xl overflow-hidden">
          {/* Basics */}
          {activeSection === 'basics' && (
            <div className="p-7">
              {canEdit ? (
                <NewsletterForm
                  mode="edit"
                  newsletter={newsletter}
                  initialContent={selectedContent}
                  section="basics"
                />
              ) : (
                <ReadOnlyField label="Betreff" value={newsletter.subject} />
              )}
            </div>
          )}

          {/* Hero */}
          {activeSection === 'hero' && (
            <div className="p-7">
              {canEdit ? (
                <NewsletterForm
                  mode="edit"
                  newsletter={newsletter}
                  initialContent={selectedContent}
                  section="hero"
                />
              ) : (
                <ReadOnlyField label="Hero" value={newsletter.heroTitle || '—'} />
              )}
            </div>
          )}

          {/* Content */}
          {activeSection === 'content' && (
            <div className="p-7">
              <div className="flex items-center justify-between mb-7">
                <h3 className="text-[13px] font-semibold text-white tracking-[-0.01em]">Inhalte verwalten</h3>
                {canEdit && (
                  <div className="flex gap-2.5">
                    <Button variant="ghost" size="sm" onClick={handleAddTextSnippet}>
                      + Text
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => setShowContentSelector(true)}>
                      + Event/Artikel
                    </Button>
                  </div>
                )}
              </div>

              {selectedContent.length === 0 && !showContentSelector ? (
                <div className="py-20 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                    <svg className="w-7 h-7 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <p className="text-white/40 text-sm mb-5">Noch keine Inhalte</p>
                  <Button variant="primary" size="sm" onClick={() => setShowContentSelector(true)} disabled={!canEdit}>
                    Inhalte hinzufügen
                  </Button>
                </div>
              ) : showContentSelector ? (
                <div>
                  <ContentSelector
                    onContentSelected={(newContent) => {
                      handleContentReorder(newContent)
                      setShowContentSelector(false)
                    }}
                    selectedContent={selectedContent}
                  />
                  <div className="mt-5 pt-5 border-t border-white/[0.08]">
                    <Button variant="ghost" size="sm" onClick={() => setShowContentSelector(false)}>
                      Abbrechen
                    </Button>
                  </div>
                </div>
              ) : (
                <DragDropReorder
                  items={selectedContent}
                  onReorder={handleContentReorder}
                  onAddTextSnippet={canEdit ? handleAddTextSnippet : undefined}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Preview Panel (sticky) */}
      <div className={cn(
        'xl:sticky xl:top-6 xl:self-start space-y-5',
        previewMode === 'desktop' && 'order-1'
      )}>
        {/* Preview Controls */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Vorschau</span>
          <div className="flex gap-1 p-1.5 bg-white/5 rounded-xl">
            <button
              onClick={() => setPreviewMode('mobile')}
              className={cn(
                'p-2 rounded-lg transition-all duration-200',
                previewMode === 'mobile' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'
              )}
              title="Mobile"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </button>
            <button
              onClick={() => setPreviewMode('desktop')}
              className={cn(
                'p-2 rounded-lg transition-all duration-200',
                previewMode === 'desktop' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'
              )}
              title="Desktop"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Phone Mockup */}
        <div className={cn(
          'relative mx-auto transition-all duration-300',
          previewMode === 'mobile' ? 'w-[320px]' : 'w-full max-w-[600px]'
        )}>
          {/* Phone frame (only for mobile) */}
          {previewMode === 'mobile' && (
            <div className="absolute inset-0 border-[12px] border-[#1a1a1c] rounded-[40px] pointer-events-none z-10">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#1a1a1c] rounded-b-2xl" />
              {/* Home indicator */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/20 rounded-full" />
            </div>
          )}

          {/* Preview content */}
          <div className={cn(
            'bg-white overflow-hidden',
            previewMode === 'mobile'
              ? 'rounded-[28px] mx-3 my-3'
              : 'rounded-xl border border-white/10'
          )}>
            <div className={cn(
              'overflow-y-auto',
              previewMode === 'mobile' ? 'max-h-[580px]' : 'max-h-[500px]'
            )}>
              <AdminEmailPreview
                newsletterId={newsletter.id}
                slug={newsletter.slug}
                canTestSend={canTestSend}
              />
            </div>
          </div>
        </div>

        {/* Send Actions */}
        {canEdit && (newsletter.status === 'DRAFT' || newsletter.status === 'SCHEDULED') && (
          <div className="bg-[#111113] border border-white/[0.08] rounded-xl p-5 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Versenden</span>
              {newsletter.status === 'SCHEDULED' && newsletter.scheduledAt && (
                <span className="text-xs text-blue-400">
                  Geplant: {new Date(newsletter.scheduledAt).toLocaleDateString('de-DE')}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {newsletter.status === 'DRAFT' && (
                <Button
                  variant="secondary"
                  onClick={() => setShowScheduleModal(true)}
                  disabled={!canSend}
                  className="w-full"
                >
                  Planen
                </Button>
              )}
              <Button
                variant="primary"
                onClick={openSendModal}
                disabled={!canSend}
                className={newsletter.status === 'DRAFT' ? 'w-full' : 'w-full col-span-2'}
              >
                Jetzt senden
              </Button>
            </div>

            {!canSend && (
              <p className="text-[10px] text-white/30 text-center pt-1">
                Nur Super Admins können Newsletter versenden
              </p>
            )}
          </div>
        )}

        {/* Stats */}
        {newsletter.status === 'SENT' && newsletter.stats && (
          <div className="bg-[#111113] border border-white/[0.08] rounded-xl p-5">
            <span className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Statistiken</span>
            <div className="grid grid-cols-3 gap-4 mt-5">
              <div className="text-center">
                <p className="text-2xl font-bold text-[#016dca]">{newsletter.stats.uniqueOpenCount}</p>
                <p className="text-[11px] text-white/40 mt-1">Öffnungen</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[#016dca]">{newsletter.stats.uniqueClickCount}</p>
                <p className="text-[11px] text-white/40 mt-1">Klicks</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-400">
                  {newsletter.recipientCount > 0
                    ? ((newsletter.stats.uniqueOpenCount / newsletter.recipientCount) * 100).toFixed(0)
                    : '0'}%
                </p>
                <p className="text-[11px] text-white/40 mt-1">Rate</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <Dialog open={showSendModal} onOpenChange={setShowSendModal}>
        <DialogContent className="bg-[#111113] border-white/[0.08] max-w-md">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-white text-lg">Newsletter senden</DialogTitle>
            <DialogDescription className="text-white/50 text-sm">
              Diese Aktion kann nicht rückgängig gemacht werden.
            </DialogDescription>
          </DialogHeader>
          {sendError && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {sendError}
            </div>
          )}
          <div className="p-5 rounded-xl bg-[#016dca]/10 border border-[#016dca]/20 my-2">
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-sm">Empfänger</span>
              <span className="text-2xl font-bold text-[#016dca]">{subscriberCount.toLocaleString('de-DE')}</span>
            </div>
          </div>
          <DialogFooter className="gap-3 pt-2">
            <Button variant="ghost" onClick={() => setShowSendModal(false)} disabled={isSending}>
              Abbrechen
            </Button>
            <Button variant="primary" onClick={handleSendNow} disabled={isSending || subscriberCount === 0}>
              {isSending ? 'Senden...' : 'Senden'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
        <DialogContent className="bg-[#111113] border-white/[0.08] max-w-md">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-white text-lg">Newsletter planen</DialogTitle>
            <DialogDescription className="text-white/50 text-sm">
              Wählen Sie Datum und Uhrzeit.
            </DialogDescription>
          </DialogHeader>
          {scheduleError && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {scheduleError}
            </div>
          )}
          <div className="space-y-5 my-2">
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={scheduleDate}
                onSelect={setScheduleDate}
                disabled={(date) => date < new Date()}
                className="rounded-xl border border-white/[0.08]"
              />
            </div>
            <div className="space-y-2.5">
              <label className="text-[13px] font-medium text-white/80">Uhrzeit</label>
              <Input
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                inputSize="lg"
              />
            </div>
          </div>
          <DialogFooter className="gap-3 pt-2">
            <Button variant="ghost" onClick={() => setShowScheduleModal(false)} disabled={isScheduling}>
              Abbrechen
            </Button>
            <Button variant="primary" onClick={handleSchedule} disabled={isScheduling || !scheduleDate}>
              {isScheduling ? 'Planen...' : 'Planen'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-2.5">
      <label className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">{label}</label>
      <p className="text-white text-base">{value}</p>
    </div>
  )
}
