/**
 * Alter Root-Pfad `/events` → leitet auf die Default-Locale-Variante weiter.
 * Die eigentliche Page liegt unter src/app/[lang]/events/page.tsx.
 */

import { redirect } from 'next/navigation'
import { DEFAULT_LOCALE } from '@/i18n/config'

export default function EventsRootRedirect() {
  redirect(`/${DEFAULT_LOCALE}/events`)
}
