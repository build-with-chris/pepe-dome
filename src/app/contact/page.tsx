/**
 * Alter Root-Pfad `/contact` → leitet auf die Default-Locale-Variante weiter.
 * Die eigentliche Page liegt unter src/app/[lang]/contact/page.tsx.
 */

import { redirect } from 'next/navigation'
import { DEFAULT_LOCALE } from '@/i18n/config'

export default function ContactRootRedirect() {
  redirect(`/${DEFAULT_LOCALE}/contact`)
}
