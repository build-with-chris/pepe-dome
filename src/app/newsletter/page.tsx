/**
 * Alter Root-Pfad `/newsletter` → leitet auf die Default-Locale-Variante weiter.
 */

import { redirect } from 'next/navigation'
import { DEFAULT_LOCALE } from '@/i18n/config'

export default function NewsletterRootRedirect() {
  redirect(`/${DEFAULT_LOCALE}/newsletter`)
}
