/**
 * Send Modal Component
 * Confirmation modal for sending newsletter immediately
 */

'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'

interface SendModalProps {
  newsletterId: string
  onClose: () => void
  onSent: () => void
}

export default function SendModal({
  newsletterId,
  onClose,
  onSent,
}: SendModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [subscriberCount, setSubscriberCount] = useState<number>(0)
  const [testSendResults, setTestSendResults] = useState<any[]>([])

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // Fetch subscriber count
      const subResponse = await fetch('/api/admin/subscribers?status=ACTIVE&limit=1')
      const subResult = await subResponse.json()
      setSubscriberCount(subResult.meta?.pagination?.total || 0)

      // TODO: Fetch last 5 test send results
      // This would require a new endpoint to track test sends
      setTestSendResults([])
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const handleSend = async () => {
    if (subscriberCount === 0) {
      setError('No active subscribers to send to')
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch(
        `/api/admin/newsletters/${newsletterId}/send`,
        {
          method: 'POST',
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error?.message || 'Failed to send newsletter')
      }

      onSent()
    } catch (err: any) {
      setError(err.message)
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="card max-w-lg w-full p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Send Newsletter Now</h2>
          <button
            onClick={onClose}
            className="text-pepe-t64 hover:text-pepe-white transition-colors"
            disabled={isLoading}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-pepe-error-bg border border-pepe-error rounded-lg p-3">
            <p className="text-sm text-pepe-error">{error}</p>
          </div>
        )}

        {/* Confirmation Details */}
        <div className="space-y-4">
          <p className="text-pepe-t80">
            Are you sure you want to send this newsletter immediately?
          </p>

          {/* Recipient Count */}
          <div className="bg-pepe-gold-glow rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-pepe-t80">Recipients:</span>
              <span className="text-2xl font-bold text-pepe-gold">
                {subscriberCount}
              </span>
            </div>
            <p className="text-sm text-pepe-t64 mt-2">
              Active subscribers who will receive this newsletter
            </p>
          </div>

          {/* Test Send Results */}
          {testSendResults.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Recent Test Sends</h4>
              <div className="space-y-2">
                {testSendResults.slice(0, 5).map((result, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm bg-pepe-surface rounded p-2"
                  >
                    <span className="text-pepe-t80">{result.email}</span>
                    <span
                      className={
                        result.status === 'success'
                          ? 'text-pepe-success'
                          : 'text-pepe-error'
                      }
                    >
                      {result.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warning */}
          {subscriberCount === 0 ? (
            <div className="bg-pepe-error-bg border border-pepe-error rounded-lg p-3">
              <p className="text-sm text-pepe-error">
                No active subscribers found. Cannot send newsletter.
              </p>
            </div>
          ) : (
            <div className="bg-pepe-warning-bg border border-pepe-warning rounded-lg p-3">
              <p className="text-sm text-pepe-warning">
                Warning: This action cannot be undone. The newsletter will be
                sent immediately to all {subscriberCount} active subscribers.
              </p>
            </div>
          )}

          {/* Checklist */}
          <div className="bg-pepe-surface rounded-lg p-4">
            <h4 className="font-medium mb-3">Before you send, make sure:</h4>
            <ul className="space-y-2 text-sm text-pepe-t80">
              <li className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-pepe-gold flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Subject line is compelling and clear
              </li>
              <li className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-pepe-gold flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                All links are working correctly
              </li>
              <li className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-pepe-gold flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Content is proofread and error-free
              </li>
              <li className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-pepe-gold flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Preview looks good in different email clients
              </li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSend}
            disabled={isLoading || subscriberCount === 0}
          >
            {isLoading ? 'Sending...' : `Send to ${subscriberCount} Subscribers`}
          </Button>
        </div>
      </div>
    </div>
  )
}
