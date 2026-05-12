/**
 * Alter Root-Pfad `/news/[slug]` → leitet auf die Default-Locale-Variante.
 */

import { redirect } from 'next/navigation'
import { DEFAULT_LOCALE } from '@/i18n/config'

export default async function NewsArticleRedirect({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  redirect(`/${DEFAULT_LOCALE}/news/${slug}`)
}
