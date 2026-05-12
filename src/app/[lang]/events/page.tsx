/**
 * Events Listing Page — localized (DE / EN)
 *
 * Server-Wrapper: lädt das Dictionary serverseitig und gibt es als Prop
 * an die Client-Komponente weiter. Die eigentliche Interaktivität
 * (Monatsnavigation, Filter, Pagination) lebt in EventsListingClient.
 */

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/get-dictionary'
import EventsListingClient from '@/components/custom/EventsListingClient'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang: rawLang } = await params
  if (!isLocale(rawLang)) return {}
  const dict = await getDictionary(rawLang)
  return {
    title: dict.events.meta.title,
    description: dict.events.meta.description,
    alternates: { canonical: `https://www.pepe-dome.de/${rawLang}/events` },
  }
}

export default async function EventsPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang: rawLang } = await params
  if (!isLocale(rawLang)) notFound()
  const lang: Locale = rawLang
  const dict = await getDictionary(lang)

  return <EventsListingClient lang={lang} dict={dict} />
}
