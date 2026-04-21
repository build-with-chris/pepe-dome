'use client'

import { useState } from 'react'

interface LanguageSwitcherProps {
  className?: string
  variant?: 'default' | 'compact'
}

// EN is disabled until translations are wired up in components via useTranslation().
// When ready: flip EN_READY to true and re-enable i18n.changeLanguage.
const EN_READY = false

export default function LanguageSwitcher({ className = '', variant = 'default' }: LanguageSwitcherProps) {
  const [showHint, setShowHint] = useState(false)

  const handleEnClick = () => {
    if (EN_READY) return
    setShowHint(true)
    window.clearTimeout((handleEnClick as any)._t)
    ;(handleEnClick as any)._t = window.setTimeout(() => setShowHint(false), 2200)
  }

  return (
    <div
      className={`language-switcher ${variant === 'compact' ? 'is-compact' : ''} ${className}`}
      role="group"
      aria-label="Sprache auswählen"
    >
      <button
        type="button"
        className="language-switcher-btn is-active"
        aria-pressed={true}
        aria-label="Deutsch"
      >
        DE
      </button>
      <button
        type="button"
        onClick={handleEnClick}
        className="language-switcher-btn"
        aria-label="English (coming soon)"
        title="Englische Version in Kürze"
      >
        EN
      </button>
      {showHint && (
        <span className="language-switcher-hint" role="status">
          Englische Version in Kürze
        </span>
      )}
    </div>
  )
}
