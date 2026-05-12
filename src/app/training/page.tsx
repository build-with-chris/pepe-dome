/**
 * Alter Root-Pfad `/training` → leitet auf die Default-Locale-Variante weiter.
 * Die eigentliche Page liegt unter src/app/[lang]/training/page.tsx.
 *
 * Middleware fängt `/training` zwar bereits ab und redirected je nach
 * Accept-Language — diese Datei ist ein Fallback (Server-Redirect).
 */

import { redirect } from 'next/navigation'
import { DEFAULT_LOCALE } from '@/i18n/config'

export default function TrainingRootRedirect() {
  redirect(`/${DEFAULT_LOCALE}/training`)
}
