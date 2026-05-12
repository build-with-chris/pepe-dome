'use client'

/**
 * Lokalisierte Variante von UnsubscribedContent.
 */

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import type { Dictionary } from '@/i18n/get-dictionary'
import { localizedHref, type Locale } from '@/i18n/config'

export default function LocalizedUnsubscribedContent({
  lang,
  dict,
}: {
  lang: Locale
  dict: Dictionary
}) {
  const t = dict.newsletter.unsubscribed
  const [feedback, setFeedback] = useState('')
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)

  const handleFeedbackSubmit = async () => {
    if (!feedback.trim()) return
    // TODO: Implement feedback submission API
    setFeedbackSubmitted(true)
  }

  const newsletterHref = localizedHref(lang, '/newsletter')
  const eventsHref = localizedHref(lang, '/events')
  const homeHref = localizedHref(lang, '/')

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16">
      <div className="stage-container text-center">
        <div className="max-w-2xl mx-auto">
          <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-[var(--pepe-surface)] flex items-center justify-center">
            <span className="text-[var(--pepe-t64)] text-5xl">📩</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-4">
            {t.title}
          </h1>

          <p className="text-lg text-[var(--pepe-t80)] mb-10 max-w-xl mx-auto">
            {t.text}
          </p>

          {/* Feedback */}
          <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-xl p-8 mb-8 text-left max-w-lg mx-auto">
            <h2 className="text-xl font-bold text-[var(--pepe-white)] mb-4">
              {t.feedbackTitle}
            </h2>
            <p className="text-[var(--pepe-t64)] mb-4 text-sm">{t.feedbackHint}</p>

            {!feedbackSubmitted ? (
              <div className="space-y-4">
                <textarea
                  className="w-full px-4 py-3 bg-[var(--pepe-surface)] border border-[var(--pepe-line)] rounded-lg text-[var(--pepe-white)] placeholder-[var(--pepe-t48)] focus:border-[var(--pepe-gold)] focus:outline-none focus:ring-2 focus:ring-[var(--pepe-gold)]/20 resize-none transition-colors"
                  rows={4}
                  placeholder={t.feedbackPlaceholder}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
                <Button
                  variant="secondary"
                  onClick={handleFeedbackSubmit}
                  disabled={!feedback.trim()}
                  className="w-full sm:w-auto"
                >
                  {t.feedbackSubmit}
                </Button>
              </div>
            ) : (
              <div className="p-4 bg-[var(--pepe-success)]/10 border border-[var(--pepe-success)]/30 rounded-lg">
                <p className="text-[var(--pepe-success)]">{t.feedbackThanks}</p>
              </div>
            )}
          </div>

          {/* Resubscribe */}
          <div className="bg-[var(--pepe-gold)]/5 border border-[var(--pepe-gold)]/20 rounded-xl p-6 mb-10 text-left max-w-lg mx-auto">
            <h3 className="text-lg font-bold text-[var(--pepe-white)] mb-3">
              {t.resubscribeTitle}
            </h3>
            <p className="text-[var(--pepe-t64)] mb-4 text-sm">{t.resubscribeText}</p>
            <Link href={newsletterHref}>
              <Button variant="primary" size="sm">{t.subscribeAgain}</Button>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={eventsHref}>
              <Button variant="secondary" size="lg">{t.ctaEvents}</Button>
            </Link>
            <Link href={homeHref}>
              <Button variant="ghost" size="lg">{t.backHome}</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
