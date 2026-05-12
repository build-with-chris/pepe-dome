'use client'

/**
 * Wechselt die Sprache. Wenn die aktuelle URL einen /[lang]-Präfix hat
 * (z.B. /de oder /en), wird das Präfix in der URL ausgetauscht und
 * Next.js navigiert nahtlos. Auf noch-nicht-migrierten Routes (z.B.
 * /training, /about, …) fällt die Komponente auf das alte Verhalten
 * zurück: i18next.changeLanguage + Hard-Reload.
 */

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import i18n from '@/lib/i18n'
import { LOCALES, type Locale } from '@/i18n/config'

interface LanguageSwitcherProps {
  className?: string
  variant?: 'default' | 'compact'
}

const LANGS: { code: Locale; label: string; aria: string }[] = [
  { code: 'de', label: 'DE', aria: 'Deutsch' },
  { code: 'en', label: 'EN', aria: 'English' },
]

function urlHasLocale(pathname: string | null): boolean {
  const seg = pathname?.split('/')[1] ?? ''
  return (LOCALES as readonly string[]).includes(seg)
}

export default function LanguageSwitcher({ className = '', variant = 'default' }: LanguageSwitcherProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [current, setCurrent] = useState<Locale>('de')

  // Sprache aus URL ableiten, fallback auf i18next-Wert
  useEffect(() => {
    if (urlHasLocale(pathname)) {
      setCurrent(pathname!.split('/')[1] as Locale)
      return
    }
    const fromI18n: Locale = i18n.language?.startsWith('en') ? 'en' : 'de'
    setCurrent(fromI18n)
    const handler = (lng: string) => setCurrent(lng.startsWith('en') ? 'en' : 'de')
    i18n.on('languageChanged', handler)
    return () => { i18n.off('languageChanged', handler) }
  }, [pathname])

  const change = (lang: Locale) => {
    if (lang === current) return
    setCurrent(lang)

    if (urlHasLocale(pathname)) {
      // URL hat schon einen Locale-Prefix → einfach austauschen, Next.js navigiert
      const segments = pathname!.split('/')
      segments[1] = lang
      const newPath = segments.join('/') || `/${lang}`
      i18n.changeLanguage(lang)
      router.push(newPath)
      return
    }

    // Noch-nicht-migrierte Seite: i18next-Wechsel + Reload
    i18n.changeLanguage(lang)
    if (typeof window !== 'undefined') {
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
