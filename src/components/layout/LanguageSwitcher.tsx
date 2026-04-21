'use client'

import { useState, useEffect } from 'react'
import i18n from '@/lib/i18n'

interface LanguageSwitcherProps {
  className?: string
  variant?: 'default' | 'compact'
}

const LANGS: { code: 'de' | 'en'; label: string }[] = [
  { code: 'de', label: 'DE' },
  { code: 'en', label: 'EN' },
]

export default function LanguageSwitcher({ className = '', variant = 'default' }: LanguageSwitcherProps) {
  const [current, setCurrent] = useState<'de' | 'en'>('de')

  useEffect(() => {
    // Sync with i18n after mount (avoids SSR hydration mismatch)
    const lang = (i18n.language?.startsWith('en') ? 'en' : 'de') as 'de' | 'en'
    setCurrent(lang)

    const handler = (lng: string) => {
      setCurrent(lng.startsWith('en') ? 'en' : 'de')
    }
    i18n.on('languageChanged', handler)
    return () => { i18n.off('languageChanged', handler) }
  }, [])

  const change = (lang: 'de' | 'en') => {
    if (lang === current) return
    i18n.changeLanguage(lang)
    setCurrent(lang)
  }

  return (
    <div
      className={`language-switcher ${variant === 'compact' ? 'is-compact' : ''} ${className}`}
      role="group"
      aria-label="Sprache auswählen"
    >
      {LANGS.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => change(l.code)}
          className={`language-switcher-btn ${current === l.code ? 'is-active' : ''}`}
          aria-pressed={current === l.code}
          aria-label={l.code === 'de' ? 'Deutsch' : 'English'}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}
