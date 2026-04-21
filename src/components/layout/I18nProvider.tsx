'use client'

/**
 * Initializes i18next on the client and syncs the <html lang> attribute
 * to the current language after mount.
 *
 * The i18n import itself has init side-effects (see src/lib/i18n.ts).
 */
import { useEffect } from 'react'
import i18n from '@/lib/i18n'

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Sync <html lang> with the language i18next picked up from localStorage
    const lang = i18n.language?.startsWith('en') ? 'en' : 'de'
    if (typeof document !== 'undefined' && document.documentElement.lang !== lang) {
      document.documentElement.lang = lang
    }
  }, [])

  return <>{children}</>
}
