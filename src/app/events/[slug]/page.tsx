/**
 * Alter Root-Pfad `/events/[slug]` → leitet auf die Default-Locale-Variante.
 * Die eigentliche Page liegt unter src/app/[lang]/events/[slug]/page.tsx.
 *
 * Wichtig: SEO-Bestand bleibt erhalten — alte Links wie /events/holi-poldini
 * werden auf /de/events/holi-poldini umgeleitet (302).
 */

import { redirect } from 'next/navigation'
import { DEFAULT_LOCALE } from '@/i18n/config'

export default async function EventDetailRedirect({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  redirect(`/${DEFAULT_LOCALE}/events/${slug}`)
}
