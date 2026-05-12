/**
 * Alter Root-Pfad `/news` → leitet auf die Default-Locale-Variante weiter.
 * Die eigentliche Page liegt unter src/app/[lang]/news/page.tsx.
 */

import { redirect } from 'next/navigation'
import { DEFAULT_LOCALE } from '@/i18n/config'

export default function NewsRootRedirect() {
  redirect(`/${DEFAULT_LOCALE}/news`)
}
