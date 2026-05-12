'use client'

/**
 * Synchronisiert i18next + <html lang> mit der URL-Locale.
 * Wird im [lang]-Layout gerendert, sodass Navbar/Footer (die i18next
 * via useTranslation lesen) automatisch die richtige Sprache zeigen.
 */

import { useEffect } from 'react'
import i18n from '@/lib/i18n'
import type { Locale } from '@/i18n/config'

export default function LocaleSync({ lang }: { lang: Locale }) {
  useEffect(() => {
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang)
    }
    if (typeof document !== 'undefined' && document.documentElement.lang !== lang) {
      document.documentElement.lang = lang
    }
  }, [lang])
  return null
}
