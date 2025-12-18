/**
 * Newsletter Edit Form Component
 * Extended form for editing newsletters with preview and send options
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import NewsletterForm from './NewsletterForm'
import EmailPreview from './EmailPreview'
import ScheduleModal from './ScheduleModal'
import SendModal from './SendModal'
import Button from '@/components/ui/Button'

interface NewsletterEditFormProps {
  newsletter: any
}

export default function NewsletterEditForm({
  newsletter,
}: NewsletterEditFormProps) {
  const router = useRouter()
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [showSendModal, setShowSendModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')

  const canSchedule = newsletter.status === 'DRAFT'
  const canSend = newsletter.status === 'DRAFT' || newsletter.status === 'SCHEDULED'

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex items-center gap-4 border-b border-pepe-line">
        <button
          onClick={() => setActiveTab('edit')}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'edit'
              ? 'border-pepe-gold text-pepe-gold font-semibold'
              : 'border-transparent text-pepe-t64 hover:text-pepe-t80'
          }`}
        >
          Edit
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'preview'
              ? 'border-pepe-gold text-pepe-gold font-semibold'
              : 'border-transparent text-pepe-t64 hover:text-pepe-t80'
          }`}
        >
          Preview
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'edit' ? (
        <NewsletterForm newsletter={newsletter} isEditing={true} />
      ) : (
        <div className="card p-6">
          <EmailPreview
            newsletterId={newsletter.id}
            slug={newsletter.slug}
          />
        </div>
      )}

      {/* Send Actions */}
      {canSend && (
        <div className="card p-6 bg-pepe-surface">
          <h3 className="text-xl font-semibold mb-4">Send Newsletter</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {canSchedule && (
              <div>
                <h4 className="font-medium mb-2">Schedule Send</h4>
                <p className="text-sm text-pepe-t64 mb-3">
                  Choose a date and time to automatically send this newsletter
                </p>
                <Button
                  variant="secondary"
                  onClick={() => setShowScheduleModal(true)}
                  className="w-full"
                >
                  Schedule for Later
                </Button>
              </div>
            )}

            <div>
              <h4 className="font-medium mb-2">Send Now</h4>
              <p className="text-sm text-pepe-t64 mb-3">
                Send this newsletter immediately to all active subscribers
              </p>
              <Button
                variant="primary"
                onClick={() => setShowSendModal(true)}
                className="w-full"
              >
                Send Now
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showScheduleModal && (
        <ScheduleModal
          newsletterId={newsletter.id}
          onClose={() => setShowScheduleModal(false)}
          onScheduled={() => {
            setShowScheduleModal(false)
            router.refresh()
          }}
        />
      )}

      {showSendModal && (
        <SendModal
          newsletterId={newsletter.id}
          onClose={() => setShowSendModal(false)}
          onSent={() => {
            setShowSendModal(false)
            router.push('/admin/newsletters')
            router.refresh()
          }}
        />
      )}
    </div>
  )
}
