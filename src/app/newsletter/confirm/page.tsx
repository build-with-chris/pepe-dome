/**
 * Alter Root-Pfad `/newsletter/confirm` → leitet auf die Default-Locale-Variante.
 * Hinweis: Token bleibt erhalten — Confirmation-Mails alter Abonnent:innen
 * funktionieren weiterhin.
 */

import { redirect } from 'next/navigation'
import { DEFAULT_LOCALE } from '@/i18n/config'

export default async function NewsletterConfirmRedirect({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const sp = await searchParams
  const token = sp.token ? `?token=${encodeURIComponent(sp.token)}` : ''
  redirect(`/${DEFAULT_LOCALE}/newsletter/confirm${token}`)
}
