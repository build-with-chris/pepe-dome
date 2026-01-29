'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function UnsubscribedContent() {
  const [feedback, setFeedback] = useState('')
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)

  const handleFeedbackSubmit = async () => {
    if (!feedback.trim()) return

    // TODO: Implement feedback submission API
    // For now, just mark as submitted
    setFeedbackSubmitted(true)
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16">
      <div className="stage-container text-center">
        <div className="max-w-2xl mx-auto">
          {/* Icon */}
          <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-[var(--pepe-surface)] flex items-center justify-center">
            <span className="text-[var(--pepe-t64)] text-5xl">📩</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-4">
            Du wurdest abgemeldet
          </h1>

          {/* Description */}
          <p className="text-lg text-[var(--pepe-t80)] mb-10 max-w-xl mx-auto">
            Schade, dass du gehst! Du erhältst keine weiteren Newsletter von uns.
          </p>

          {/* Feedback Card */}
          <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-xl p-8 mb-8 text-left max-w-lg mx-auto">
            <h2 className="text-xl font-bold text-[var(--pepe-white)] mb-4">
              Warum hast du dich abgemeldet?
            </h2>
            <p className="text-[var(--pepe-t64)] mb-4 text-sm">
              Dein Feedback hilft uns, unseren Newsletter zu verbessern. (Optional)
            </p>

            {!feedbackSubmitted ? (
              <div className="space-y-4">
                <textarea
                  className="w-full px-4 py-3 bg-[var(--pepe-surface)] border border-[var(--pepe-line)] rounded-lg text-[var(--pepe-white)] placeholder-[var(--pepe-t48)] focus:border-[var(--pepe-gold)] focus:outline-none focus:ring-2 focus:ring-[var(--pepe-gold)]/20 resize-none transition-colors"
                  rows={4}
                  placeholder="Dein Feedback..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
                <Button
                  variant="secondary"
                  onClick={handleFeedbackSubmit}
                  disabled={!feedback.trim()}
                  className="w-full sm:w-auto"
                >
                  Feedback senden
                </Button>
              </div>
            ) : (
              <div className="p-4 bg-[var(--pepe-success)]/10 border border-[var(--pepe-success)]/30 rounded-lg">
                <p className="text-[var(--pepe-success)]">
                  Danke für dein Feedback! Wir werden es berücksichtigen.
                </p>
              </div>
            )}
          </div>

          {/* Resubscribe Card */}
          <div className="bg-[var(--pepe-gold)]/5 border border-[var(--pepe-gold)]/20 rounded-xl p-6 mb-10 text-left max-w-lg mx-auto">
            <h3 className="text-lg font-bold text-[var(--pepe-white)] mb-3">
              Hast du es dir anders überlegt?
            </h3>
            <p className="text-[var(--pepe-t64)] mb-4 text-sm">
              Du kannst dich jederzeit wieder für unseren Newsletter anmelden.
            </p>
            <Link href="/newsletter">
              <Button variant="primary" size="sm">
                Wieder anmelden
              </Button>
            </Link>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/events">
              <Button variant="secondary" size="lg">
                Kommende Events ansehen
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" size="lg">
                Zur Startseite
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
