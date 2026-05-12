/**
 * Alter Root-Pfad `/about` → leitet auf die Default-Locale-Variante weiter.
 * Die eigentliche Page liegt unter src/app/[lang]/about/page.tsx.
 */

import { redirect } from 'next/navigation'
import { DEFAULT_LOCALE } from '@/i18n/config'

export default function AboutRootRedirect() {
  redirect(`/${DEFAULT_LOCALE}/about`)
}
