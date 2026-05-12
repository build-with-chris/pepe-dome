/**
 * Alter Root-Pfad `/business` → leitet auf die Default-Locale-Variante weiter.
 * Die eigentliche Page liegt unter src/app/[lang]/business/page.tsx.
 */

import { redirect } from 'next/navigation'
import { DEFAULT_LOCALE } from '@/i18n/config'

export default function BusinessRootRedirect() {
  redirect(`/${DEFAULT_LOCALE}/business`)
}
