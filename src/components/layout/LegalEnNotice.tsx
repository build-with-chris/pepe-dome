/**
 * Banner für die Legal-Pages: weist EN-Nutzer:innen darauf hin,
 * dass nur die deutsche Fassung rechtsverbindlich ist.
 * Auf DE wird er nicht gerendert.
 */

import type { Locale } from '@/i18n/config'

export default function LegalEnNotice({
  lang,
  message,
}: {
  lang: Locale
  message: string
}) {
  if (lang !== 'en' || !message) return null
  return (
    <div className="stage-container">
      <div className="max-w-3xl mx-auto mb-8 p-4 rounded-xl border border-[var(--pepe-gold)]/30 bg-[var(--pepe-gold)]/5">
        <p className="text-sm text-[var(--pepe-t80)] leading-relaxed">
          <span className="text-[var(--pepe-gold)] font-bold mr-2">ℹ️</span>
          {message}
        </p>
      </div>
    </div>
  )
}
