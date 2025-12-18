/**
 * Email Preview Component
 * Preview newsletter email in iframe with actions
 */

'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'

interface EmailPreviewProps {
  newsletterId: string
  slug?: string
}

export default function EmailPreview({
  newsletterId,
  slug,
}: EmailPreviewProps) {
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
          result.message || 'Test email sent successfully to test recipients'
        )
      } else {
        setTestSendStatus('error')
        setTestSendMessage(
          result.error?.message || 'Failed to send test email'
        )
      }
    } catch (error: any) {
      setTestSendStatus('error')
      setTestSendMessage(error.message || 'An error occurred')
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
      {/* Preview Actions */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Email Preview</h3>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleViewWebPage}
          >
            View as Web Page
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleTestSend}
            disabled={isTestSending}
          >
            {isTestSending ? 'Sending...' : 'Send Test Email'}
          </Button>
        </div>
      </div>

      {/* Test Send Status */}
      {testSendStatus !== 'idle' && (
        <div
          className={`rounded-lg p-3 ${
            testSendStatus === 'success'
              ? 'bg-pepe-success-bg border border-pepe-success'
              : 'bg-pepe-error-bg border border-pepe-error'
          }`}
        >
          <p
            className={`text-sm ${
              testSendStatus === 'success'
                ? 'text-pepe-success'
                : 'text-pepe-error'
            }`}
          >
            {testSendMessage}
          </p>
        </div>
      )}

      {/* Preview Iframe */}
      <div className="border-2 border-pepe-line rounded-lg overflow-hidden bg-white">
        <iframe
          src={`/api/admin/newsletters/${newsletterId}/preview`}
          title="Email Preview"
          className="w-full"
          style={{ height: '600px' }}
          sandbox="allow-same-origin"
        />
      </div>

      {/* Preview Info */}
      <div className="text-sm text-pepe-t64 space-y-1">
        <p>
          This is a preview of how your newsletter will appear in email clients.
        </p>
        <p>
          Note: Actual rendering may vary across different email clients and
          devices.
        </p>
      </div>
    </div>
  )
}
