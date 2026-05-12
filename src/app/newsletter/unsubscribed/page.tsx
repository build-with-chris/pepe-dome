/**
 * Alter Root-Pfad `/newsletter/unsubscribed` → Redirect.
 */

import { redirect } from 'next/navigation'
import { DEFAULT_LOCALE } from '@/i18n/config'

export default function NewsletterUnsubscribedRedirect() {
  redirect(`/${DEFAULT_LOCALE}/newsletter/unsubscribed`)
}
