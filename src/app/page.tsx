/**
 * Root-Home → leitet auf die Default-Locale weiter.
 * Die eigentliche Home-Page liegt jetzt unter src/app/[lang]/page.tsx.
 *
 * Hinweis: die Middleware fängt `/` bereits ab und redirected auf die
 * per Accept-Language erkannte Sprache. Diese Page-Datei ist nur ein
 * Fallback für den Fall, dass die Middleware das nicht kann (z.B. bei
 * statischen Exports).
 */

import { redirect } from 'next/navigation'
import { DEFAULT_LOCALE } from '@/i18n/config'

export default function RootRedirect() {
  redirect(`/${DEFAULT_LOCALE}`)
}
