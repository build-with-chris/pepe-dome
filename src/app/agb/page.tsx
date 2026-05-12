/**
 * Alter Root-Pfad `/agb` → leitet auf die Default-Locale-Variante weiter.
 */

import { redirect } from 'next/navigation'
import { DEFAULT_LOCALE } from '@/i18n/config'

export default function AGBRootRedirect() {
  redirect(`/${DEFAULT_LOCALE}/agb`)
}
