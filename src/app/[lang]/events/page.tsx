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
import { pageMetadata } from '@/lib/seo'
import { getUpcomingEvents } from '@/lib/db-data'
import { ItemListJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import EventsListingClient from '@/components/custom/EventsListingClient'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang: rawLang } = await params
  if (!isLocale(rawLang)) return {}
  const dict = await getDictionary(rawLang)
  return pageMetadata({
    lang: rawLang,
    path: '/events',
    title: dict.events.meta.title,
    description: dict.events.meta.description,
  })
}

/**
 * Die Liste kommt aus der Datenbank und ändert sich täglich, deshalb bei jedem
 * Aufruf neu rendern. Ohne das würde die Seite beim Build eingefroren und neue
 * Termine tauchten erst beim nächsten Deploy im JSON-LD auf.
 */
export const dynamic = 'force-dynamic'

export default async function EventsPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang: rawLang } = await params
  if (!isLocale(rawLang)) notFound()
  const lang: Locale = rawLang
  const dict = await getDictionary(lang)

  // Nur für das JSON-LD. Die sichtbare Liste holt sich EventsListingClient
  // weiterhin selbst, weil sie nach Monat blättert. Der Termin-Index muss aber
  // im ausgelieferten HTML stehen: ein Crawler soll die Veranstaltungen sehen,
  // ohne auf die Monatsnavigation zu klicken.
  let upcoming: Awaited<ReturnType<typeof getUpcomingEvents>> = []
  try {
    upcoming = await getUpcomingEvents(lang)
  } catch (error) {
    // Die Seite funktioniert ohne JSON-LD weiter; ein Datenbankausfall darf
    // sie nicht komplett aus dem Netz nehmen.
    console.error('EventsPage: JSON-LD-Liste konnte nicht geladen werden', error)
  }

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Pepe Dome', url: `/${lang}` },
          { name: dict.events.meta.title, url: `/${lang}/events` },
        ]}
      />
      <ItemListJsonLd
        name={dict.events.meta.title}
        items={upcoming.map((event) => ({
          name: event.title,
          url: `/${lang}/events/${event.slug}`,
        }))}
      />
      <EventsListingClient lang={lang} dict={dict} />
    </>
  )
}
