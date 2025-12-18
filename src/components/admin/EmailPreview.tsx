'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

/**
 * Admin Email Preview Component
 * Preview newsletter email with mobile/desktop toggle and test send functionality
 */

interface AdminEmailPreviewProps {
  newsletterId: string
  slug?: string
  canTestSend?: boolean
}

export default function AdminEmailPreview({
  newsletterId,
  slug,
  canTestSend = false,
}: AdminEmailPreviewProps) {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop')
  const [isTestSending, setIsTestSending] = useState(false)
  const [testSendStatus, setTestSendStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [testSendMessage, setTestSendMessage] = useState('')

  const handleTestSend = async () => {
    setIsTestSending(true)
    setTestSendStatus('idle')
    setTestSendMessage('')

    try {
      const response = await fetch(
        `/api/admin/newsletters/${newsletterId}/test-send`,
        {
          method: 'POST',
        }
      )

      const result = await response.json()

      if (response.ok) {
        setTestSendStatus('success')
        setTestSendMessage(
          result.message || 'Test-E-Mail wurde erfolgreich versendet'
        )
      } else {
        setTestSendStatus('error')
        setTestSendMessage(
          result.error?.message || 'Fehler beim Versenden der Test-E-Mail'
        )
      }
    } catch (error: unknown) {
      setTestSendStatus('error')
      setTestSendMessage(
        error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten'
      )
    } finally {
      setIsTestSending(false)
    }
  }

  const handleViewWebPage = () => {
    if (slug) {
      window.open(`/newsletter/${slug}`, '_blank')
    } else {
      window.open(`/api/admin/newsletters/${newsletterId}/preview`, '_blank')
    }
  }

  return (
    <div className="space-y-4">
      {/* Preview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-[var(--pepe-white)]">E-Mail-Vorschau</h3>
          <p className="text-sm text-[var(--pepe-t64)]">
            Vorschau des Newsletters, wie er in E-Mail-Clients erscheint
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 bg-[var(--pepe-surface)] rounded-lg">
            <button
              onClick={() => setViewMode('desktop')}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors',
                viewMode === 'desktop'
                  ? 'bg-[var(--pepe-gold)] text-[var(--pepe-black)] font-medium'
                  : 'text-[var(--pepe-t64)] hover:text-[var(--pepe-white)]'
              )}
              title="Desktop-Ansicht"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="hidden sm:inline">Desktop</span>
            </button>
            <button
              onClick={() => setViewMode('mobile')}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors',
                viewMode === 'mobile'
                  ? 'bg-[var(--pepe-gold)] text-[var(--pepe-black)] font-medium'
                  : 'text-[var(--pepe-t64)] hover:text-[var(--pepe-white)]'
              )}
              title="Mobile-Ansicht"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span className="hidden sm:inline">Mobile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleViewWebPage}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Als Webseite offnen
        </Button>

        {canTestSend && (
          <Button
            variant="primary"
            size="sm"
            onClick={handleTestSend}
            disabled={isTestSending}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {isTestSending ? 'Wird gesendet...' : 'Test-E-Mail senden'}
          </Button>
        )}
      </div>

      {/* Test Send Status */}
      {testSendStatus !== 'idle' && (
        <div
          className={cn(
            'rounded-lg p-3',
            testSendStatus === 'success'
              ? 'bg-green-500/10 border border-green-500/30'
              : 'bg-[var(--pepe-error)]/10 border border-[var(--pepe-error)]/30'
          )}
        >
          <p
            className={cn(
              'text-sm',
              testSendStatus === 'success'
                ? 'text-green-400'
                : 'text-[var(--pepe-error)]'
            )}
          >
            {testSendMessage}
          </p>
        </div>
      )}

      {/* Preview Container */}
      <div className="flex justify-center">
        <div
          className={cn(
            'border-2 border-[var(--pepe-line)] rounded-lg overflow-hidden bg-white transition-all duration-300',
            viewMode === 'desktop' ? 'w-full max-w-[800px]' : 'w-[375px]'
          )}
        >
          {/* Device Frame Header (for mobile) */}
          {viewMode === 'mobile' && (
            <div className="bg-gray-900 px-4 py-2 flex items-center justify-center">
              <div className="w-20 h-1 bg-gray-700 rounded-full" />
            </div>
          )}

          {/* Preview Iframe */}
          <iframe
            src={`/api/admin/newsletters/${newsletterId}/preview`}
            title="E-Mail-Vorschau"
            className="w-full"
            style={{
              height: viewMode === 'desktop' ? '600px' : '667px',
              border: 'none',
            }}
            sandbox="allow-same-origin"
          />

          {/* Device Frame Footer (for mobile) */}
          {viewMode === 'mobile' && (
            <div className="bg-gray-900 px-4 py-3 flex items-center justify-center">
              <div className="w-10 h-10 border-2 border-gray-700 rounded-full" />
            </div>
          )}
        </div>
      </div>

      {/* Preview Info */}
      <div className="bg-[var(--pepe-surface)] rounded-lg p-4">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-[var(--pepe-info)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-[var(--pepe-t80)]">
            <p className="font-medium text-[var(--pepe-white)] mb-1">Hinweis zur Vorschau</p>
            <p>
              Dies ist eine Vorschau, wie der Newsletter in E-Mail-Clients dargestellt wird.
              Die tatsachliche Darstellung kann je nach E-Mail-Client und Gerat variieren.
              Testen Sie den Newsletter mit der Test-E-Mail-Funktion in verschiedenen Clients.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
