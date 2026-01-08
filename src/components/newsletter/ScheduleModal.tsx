/**
 * Schedule Modal Component
 * Modal for scheduling newsletter send
 */

'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface ScheduleModalProps {
  newsletterId: string
  onClose: () => void
  onScheduled: () => void
}

export default function ScheduleModal({
  newsletterId,
  onClose,
  onScheduled,
}: ScheduleModalProps) {
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get minimum datetime (now + 5 minutes)
  const getMinDateTime = () => {
    const now = new Date()
    now.setMinutes(now.getMinutes() + 5)
    return now.toISOString().slice(0, 16)
  }

  const handleSchedule = async () => {
    setError(null)

    // Validate datetime
    if (!scheduledDate || !scheduledTime) {
      setError('Bitte wählen Sie Datum und Uhrzeit aus')
      return
    }

    const scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`)
    const now = new Date()

    if (scheduledAt <= now) {
      setError('Der Zeitpunkt muss in der Zukunft liegen')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(
        `/api/admin/newsletters/${newsletterId}/schedule`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            scheduledAt: scheduledAt.toISOString(),
          }),
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error?.message || 'Newsletter konnte nicht geplant werden')
      }

      onScheduled()
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
          <h2 className="text-2xl font-semibold">Newsletter planen</h2>
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

        {/* Form */}
        <div className="space-y-4">
          <p className="text-pepe-t80">
            Wählen Sie, wann dieser Newsletter automatisch an alle aktiven
            Abonnenten gesendet werden soll.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="scheduledDate" className="form-label">
                Datum
              </label>
              <Input
                id="scheduledDate"
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div>
              <label htmlFor="scheduledTime" className="form-label">
                Uhrzeit
              </label>
              <Input
                id="scheduledTime"
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                required
              />
            </div>
          </div>

          {scheduledDate && scheduledTime && (
            <div className="bg-pepe-gold-glow rounded-lg p-3">
              <p className="text-sm font-medium">
                Newsletter wird gesendet am:
              </p>
              <p className="text-lg text-pepe-gold font-semibold">
                {new Date(`${scheduledDate}T${scheduledTime}`).toLocaleString(
                  'de-DE',
                  {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  }
                )}
              </p>
            </div>
          )}

          <div className="bg-pepe-info-bg border border-pepe-info rounded-lg p-3">
            <p className="text-sm text-pepe-info">
              Hinweis: Der Newsletter muss vor der Planung Inhalte haben.
              Der geplante Zeitpunkt muss mindestens 5 Minuten in der Zukunft liegen.
            </p>
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
            onClick={handleSchedule}
            disabled={isLoading || !scheduledDate || !scheduledTime}
          >
            {isLoading ? 'Wird geplant...' : 'Newsletter planen'}
          </Button>
        </div>
      </div>
    </div>
  )
}
