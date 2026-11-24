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
import { getUpcomingEvents, ohneErsatzdaten, type EventData } from '@/lib/db-data'
import {
  getEventsForMonth,
  resolveListingMonth,
  type ListingMonth,
} from '@/lib/events-listing'
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
 * Die Liste kommt aus der Datenbank und ändert sich täglich. Sie wird deshalb
 * nicht beim Build eingefroren, sondern zwischengespeichert und nach
 * spätestens einer Minute neu erzeugt, beim Speichern im Admin sofort
 * (src/lib/revalidate-content.ts).
 *
 * Vorher stand hier `force-dynamic`: jeder Aufruf lief durch eine
 * Serverfunktion und drei Abfragen, gemessen knapp zwei Sekunden bis zum
 * ersten Byte. Das ist die Seite, auf der die Anzeigen landen.
 */
export const revalidate = 60

export default async function EventsPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang: rawLang } = await params
  if (!isLocale(rawLang)) notFound()
  const lang: Locale = rawLang
  const dict = await getDictionary(lang)

  /**
   * Zwei Dinge kommen von hier: der Termin-Index für das JSON-LD (ein Crawler
   * soll die Veranstaltungen sehen, ohne auf die Monatsnavigation zu klicken)
   * und die sichtbare Liste des Startmonats. Vorher lieferte diese Seite ein
   * Skelett aus und der Browser holte erst den Monat und dann die Termine. Wer
   * aus einer Anzeige kommt, sah dadurch zuerst pulsierende Platzhalter.
   *
   * Bewusst kein try/catch mehr. Solange die Seite bei jedem Aufruf neu
   * gerendert wurde, war ein Skelett bei Datenbankausfall die bessere Wahl.
   * Jetzt wird sie zwischengespeichert, und ein abgefangener Fehler würde das
   * Skelett ohne JSON-LD für alle speichern. Wirft die Abfrage, bleibt
   * stattdessen die letzte gute Fassung stehen.
   */
  const upcoming = await ohneErsatzdaten(() => getUpcomingEvents(lang))
  const initialMonth: ListingMonth | null = await resolveListingMonth()
  const initialEvents: EventData[] = await getEventsForMonth(
    initialMonth.year,
    initialMonth.month,
    lang
  )

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
      <EventsListingClient
        lang={lang}
        dict={dict}
        initialMonth={initialMonth}
        initialEvents={initialEvents}
      />
    </>
  )
}
