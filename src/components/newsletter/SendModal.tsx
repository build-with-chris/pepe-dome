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
      setError('Keine aktiven Abonnenten zum Senden vorhanden')
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
        throw new Error(result.error?.message || 'Newsletter konnte nicht gesendet werden')
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
          <h2 className="text-2xl font-semibold">Newsletter jetzt senden</h2>
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
            Sind Sie sicher, dass Sie diesen Newsletter jetzt senden möchten?
          </p>

          {/* Recipient Count */}
          <div className="bg-pepe-gold-glow rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-pepe-t80">Empfänger:</span>
              <span className="text-2xl font-bold text-pepe-gold">
                {subscriberCount}
              </span>
            </div>
            <p className="text-sm text-pepe-t64 mt-2">
              Aktive Abonnenten, die diesen Newsletter erhalten werden
            </p>
          </div>

          {/* Test Send Results */}
          {testSendResults.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Letzte Testversendungen</h4>
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
                      {result.status === 'success' ? 'Erfolgreich' : 'Fehlgeschlagen'}
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
                Keine aktiven Abonnenten gefunden. Newsletter kann nicht gesendet werden.
              </p>
            </div>
          ) : (
            <div className="bg-pepe-warning-bg border border-pepe-warning rounded-lg p-3">
              <p className="text-sm text-pepe-warning">
                Achtung: Diese Aktion kann nicht rückgängig gemacht werden. Der Newsletter
                wird sofort an alle {subscriberCount} aktiven Abonnenten gesendet.
              </p>
            </div>
          )}

          {/* Checklist */}
          <div className="bg-pepe-surface rounded-lg p-4">
            <h4 className="font-medium mb-3">Vor dem Senden überprüfen:</h4>
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
                Betreffzeile ist ansprechend und verständlich
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
                Alle Links funktionieren korrekt
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
                Inhalte sind korrekturgelesen und fehlerfrei
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
                Vorschau sieht in verschiedenen E-Mail-Programmen gut aus
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
            Abbrechen
          </Button>
          <Button
            variant="primary"
            onClick={handleSend}
            disabled={isLoading || subscriberCount === 0}
          >
            {isLoading ? 'Wird gesendet...' : `An ${subscriberCount} Abonnenten senden`}
          </Button>
        </div>
      </div>
    </div>
  )
}
