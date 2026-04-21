'use client'

import { useState, useEffect } from 'react'
import i18n from '@/lib/i18n'

interface LanguageSwitcherProps {
  className?: string
  variant?: 'default' | 'compact'
}

type Lang = 'de' | 'en'

const LANGS: { code: Lang; label: string; aria: string }[] = [
  { code: 'de', label: 'DE', aria: 'Deutsch' },
  { code: 'en', label: 'EN', aria: 'English' },
]

export default function LanguageSwitcher({ className = '', variant = 'default' }: LanguageSwitcherProps) {
  const [current, setCurrent] = useState<Lang>('de')

  useEffect(() => {
    const initial: Lang = i18n.language?.startsWith('en') ? 'en' : 'de'
    setCurrent(initial)
    const handler = (lng: string) => setCurrent(lng.startsWith('en') ? 'en' : 'de')
    i18n.on('languageChanged', handler)
    return () => { i18n.off('languageChanged', handler) }
  }, [])

  const change = (lang: Lang) => {
    if (lang === current) return
    setCurrent(lang)
    i18n.changeLanguage(lang)
    // Hard-reload so that server-rendered content (metadata, page-level
    // copy that doesn't use useTranslation yet) catches up with the new
    // locale. Safer than hoping every component re-renders cleanly.
    if (typeof window !== 'undefined') {
      // Small delay so the state update is visible before the reload
      setTimeout(() => window.location.reload(), 60)
    }
  }

  return (
    <div
      className={`language-switcher ${variant === 'compact' ? 'is-compact' : ''} ${className}`}
      role="group"
      aria-label="Sprache / Language"
    >
      {LANGS.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => change(l.code)}
          className={`language-switcher-btn ${current === l.code ? 'is-active' : ''}`}
          aria-pressed={current === l.code}
          aria-label={l.aria}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}
