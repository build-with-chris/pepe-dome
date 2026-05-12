/**
 * Alter Root-Pfad `/impressum` → leitet auf die Default-Locale-Variante weiter.
 */

import { redirect } from 'next/navigation'
import { DEFAULT_LOCALE } from '@/i18n/config'

export default function ImpressumRootRedirect() {
  redirect(`/${DEFAULT_LOCALE}/impressum`)
}
