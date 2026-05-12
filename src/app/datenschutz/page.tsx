/**
 * Alter Root-Pfad `/datenschutz` → leitet auf die Default-Locale-Variante weiter.
 */

import { redirect } from 'next/navigation'
import { DEFAULT_LOCALE } from '@/i18n/config'

export default function DatenschutzRootRedirect() {
  redirect(`/${DEFAULT_LOCALE}/datenschutz`)
}
