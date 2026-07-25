/**
 * JSON-LD Structured Data Components for SEO
 * Implements schema.org markup for Organization, Event, Article
 *
 * Die Blöcke gehen durch jsonLdScriptContent statt durch JSON.stringify.
 * Titel, Beschreibungen und Orte kommen aus der Redaktion; ohne die Escapes
 * beendet ein `</script>` in einem dieser Felder das Skript-Tag und alles
 * dahinter läuft als JavaScript im Browser jedes Besuchers.
 */

import { jsonLdScriptContent } from '@/lib/json-ld'
import { getSiteContent } from '@/lib/data'
import { isFreeEntry } from '@/lib/event-price'

const BASE_URL = 'https://www.pepe-dome.de'

type OrganizationLdProps = {
  name?: string
  description?: string
  url?: string
  logo?: string
  email?: string
  address?: {
    streetAddress?: string
    addressLocality?: string
    addressRegion?: string
    postalCode?: string
    addressCountry?: string
  }
}

/**
 * PerformingArtsTheater ist ein LocalBusiness-Subtyp. Für den lokalen
 * Suchindex ("Zirkus München", Karten-Panel, Knowledge Panel) zählen die Felder,
 * die eine Suchmaschine nicht erraten kann:
 *
 *   address     Vorher stand hier "Ostpark" ohne Hausnummer und die PLZ 81671.
 *               Die echte Anschrift liegt in src/data/content.json und lautet
 *               Albert-Schweitzer-Straße 62, 81735. Eine unvollständige oder
 *               falsche Adresse verhindert genau das, wofür das Schema da ist:
 *               dass Google den Ort auf der Karte findet.
 *   telephone   Erzeugt den Anruf-Button in der mobilen Suche.
 *   sameAs      Verknüpft die Seite mit den Social-Profilen. Stand vorher als
 *               leeres Array da, was denselben Effekt hat wie weglassen.
 *   image       Ohne Bild kein Bild im Ergebnis-Panel.
 *   hasMap      Verlinkt den Kartenausschnitt.
 *
 * Bewusst nicht drin: `geo`. Falsche Koordinaten sind schlechter als keine, weil
 * sie den Kartenpin verschieben und die vollständige Adresse überstimmen. Wenn
 * die exakten Koordinaten des Domes vorliegen, gehören sie hier hinein.
 *
 * Die Werte kommen aus getSiteContent(), damit Adresse und Telefonnummer nicht
 * an zwei Orten gepflegt werden müssen.
 */
export function OrganizationJsonLd({
  name,
  description,
  url = BASE_URL,
  logo = `${BASE_URL}/PepeDome Logo ausgeschnitten.png`,
  email,
  address,
}: OrganizationLdProps = {}) {
  const site = getSiteContent()

  const socialProfiles = Object.values(site.social ?? {}).filter(
    (profile): profile is string => typeof profile === 'string' && profile.length > 0
  )

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'PerformingArtsTheater',
    name: name ?? site.name,
    alternateName: 'PEPE Dome',
    description: description ?? site.description,
    url,
    logo,
    email: email ?? site.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address?.streetAddress ?? site.address?.street,
      addressLocality: address?.addressLocality ?? site.address?.city,
      addressRegion: address?.addressRegion ?? 'Bayern',
      postalCode: address?.postalCode ?? site.address?.zip,
      addressCountry: address?.addressCountry ?? 'DE',
    },
    hasMap:
      'https://www.google.com/maps/search/?api=1&query=Pepe+Dome+Theatron+im+Ostpark+M%C3%BCnchen',
    image: [`${BASE_URL}/og-image.png`, `${BASE_URL}/images/Aufbau/dome-outdoor-hero.webp`],
    areaServed: { '@type': 'City', name: 'München' },
  }

  if (site.phone) data.telephone = site.phone
  if (socialProfiles.length > 0) data.sameAs = socialProfiles

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdScriptContent(data) }}
    />
  )
}

/**
 * ItemList für Listenseiten.
 *
 * Ohne das sieht eine Suchmaschine auf /events oder /news nur eine Seite mit
 * viel Text. Mit der Liste erkennt sie, dass es sich um eine geordnete Menge
 * einzelner Einträge handelt, und kann sie als Karussell oder als
 * Sitelinks-Block ausspielen statt nur den Seitentitel.
 *
 * `url` zeigt jeweils auf die Detailseite. Absichtlich keine Inhalte doppeln:
 * Beschreibung, Datum und Preis stehen im Event- bzw. Article-Schema der
 * Detailseite, und zwei Quellen für dieselbe Angabe laufen früher oder später
 * auseinander.
 */
export function ItemListJsonLd({
  name,
  items,
}: {
  name: string
  items: Array<{ name: string; url: string }>
}) {
  if (items.length === 0) return null

  const data = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: items.length,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: `${BASE_URL}${item.url}`,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdScriptContent(data) }}
    />
  )
}

/**
 * ImageGallery für die Galerieseite.
 *
 * Damit kann Google die Seite als Bildsammlung erkennen und die Einzelbilder in
 * die Bildersuche aufnehmen, statt nur den Seitentext zu lesen. Die Bildersuche
 * ist für eine Venue der Kanal, über den Leute "wie sieht das da aus" klären.
 */
export function ImageGalleryJsonLd({
  name,
  description,
  url,
  images,
}: {
  name: string
  description: string
  url: string
  images: Array<{ src: string; alt: string; caption?: string; width: number; height: number }>
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name,
    description,
    url: `${BASE_URL}${url}`,
    numberOfItems: images.length,
    associatedMedia: images.map((image) => ({
      '@type': 'ImageObject',
      contentUrl: `${BASE_URL}${image.src}`,
      url: `${BASE_URL}${image.src}`,
      name: image.alt,
      description: image.caption ?? image.alt,
      width: image.width,
      height: image.height,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdScriptContent(data) }}
    />
  )
}

// ----- Berlin time helpers -------------------------------------------------
// Das DB-Schema speichert `date` als `timestamp without time zone` und `time`
// als separates Text-Feld ("20:00", "19:00 Uhr", "14"). Ohne explizite Zeitzone
// landet das beim Crawl als UTC-Mitternacht in Google — also völlig falsch.
// Wir kombinieren beides hier zu einem ISO-String mit korrektem Berlin-Offset.

// Robuster Parser für das freitextige `time`-Feld (siehe feed-ics für Doku).
function parseTime(time: string | null | undefined): { hh: string; mi: string } {
  if (!time) return { hh: '20', mi: '00' }

  const colonMatch = time.match(/(\d{1,2}):(\d{1,2})/)
  if (colonMatch) {
    const h = parseInt(colonMatch[1], 10)
    const m = parseInt(colonMatch[2], 10)
    if (!isNaN(h) && !isNaN(m) && h >= 0 && h <= 23 && m >= 0 && m <= 59) {
      return { hh: String(h).padStart(2, '0'), mi: String(m).padStart(2, '0') }
    }
  }

  const hourMatch = time.match(/(?<!\d)(\d{1,2})(?!\d)/)
  if (hourMatch) {
    const h = parseInt(hourMatch[1], 10)
    if (!isNaN(h) && h >= 0 && h <= 23) {
      return { hh: String(h).padStart(2, '0'), mi: '00' }
    }
  }

  return { hh: '20', mi: '00' }
}

// DST-bewusster Berlin-Offset für ein Datum (CET +01:00 / CEST +02:00).
// Trick: um 12:00 UTC ist man in Berlin nie in einer Übergangsstunde,
// also liefert Intl.DateTimeFormat eindeutig den richtigen Offset.
function berlinOffsetFor(year: number, month: number, day: number): string {
  const noonUtc = new Date(Date.UTC(year, month - 1, day, 12, 0, 0))
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Berlin',
    timeZoneName: 'longOffset',
  })
  const tzName =
    fmt.formatToParts(noonUtc).find((p) => p.type === 'timeZoneName')?.value ?? 'GMT+01:00'
  return tzName.replace('GMT', '') || '+01:00'
}

// Kombiniert date + time → "2026-05-14T20:00:00+02:00".
function toBerlinIso(date: string | Date, time: string | null | undefined): string {
  const dateStr = typeof date === 'string' ? date : date.toISOString()
  const datePart = dateStr.split('T')[0]
  const [yStr, mStr, dStr] = datePart.split('-')
  const y = parseInt(yStr)
  const m = parseInt(mStr)
  const d = parseInt(dStr)
  const { hh, mi } = parseTime(time)
  const offset = berlinOffsetFor(y, m, d)
  return `${datePart}T${hh}:${mi}:00${offset}`
}

// Addiert Stunden zu einem Berlin-ISO-String (für End-Date-Default).
function plusHoursIso(berlinIso: string, hours: number): string {
  const dt = new Date(berlinIso)
  dt.setUTCHours(dt.getUTCHours() + hours)
  const y = dt.getUTCFullYear()
  const mo = dt.getUTCMonth() + 1
  const d = dt.getUTCDate()
  const offset = berlinOffsetFor(y, mo, d)
  const offsetMin =
    (parseInt(offset.slice(1, 3)) * 60 + parseInt(offset.slice(4))) *
    (offset.startsWith('-') ? -1 : 1)
  const localMs = dt.getTime() + offsetMin * 60_000
  const local = new Date(localMs)
  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    `${local.getUTCFullYear()}-${pad(local.getUTCMonth() + 1)}-${pad(local.getUTCDate())}` +
    `T${pad(local.getUTCHours())}:${pad(local.getUTCMinutes())}:00${offset}`
  )
}

type EventLdProps = {
  name: string
  description: string
  startDate: string | Date
  endDate?: string | Date | null
  // Freitextiges Uhrzeit-Feld aus der DB ("20:00", "19:00 Uhr", "14"). Wird mit
  // startDate kombiniert, damit Google die echte Veranstaltungszeit sieht
  // statt UTC-Mitternacht.
  time?: string | null
  // Endzeit ("22:00"). Ohne sie muss der Endzeitpunkt geschätzt werden, siehe unten.
  endTime?: string | null
  location?: string
  image?: string | null
  url: string
  price?: string | null
  ticketUrl?: string | null
  category?: string
}

export function EventJsonLd({
  name,
  description,
  startDate,
  endDate,
  time,
  endTime,
  location = 'Pepe Dome, Ostpark, München',
  image,
  url,
  price,
  ticketUrl,
  category,
}: EventLdProps) {
  const startIso = toBerlinIso(startDate, time)

  // End-Sanity: gleiche Logik wie in den Edge Functions (feed-ics, feed-jsonld).
  // Wenn end fehlt oder <= start, defaulten wir auf Start + 2h. So vermeiden
  // wir Zero-Duration-Events, die Google als "ungültig" markiert.
  //
  // Mit gepflegter Endzeit ist das keine Schätzung mehr: sie gilt für den
  // Enddatum-Tag, bei eintägigen Events also für den Starttag.
  let endIso: string
  const endClock = endTime || time
  if (endDate) {
    const candidate = toBerlinIso(endDate, endClock)
    endIso = new Date(candidate) <= new Date(startIso) ? plusHoursIso(startIso, 2) : candidate
  } else if (endTime) {
    const candidate = toBerlinIso(startDate, endTime)
    // Endzeit vor Startzeit heißt: es geht über Mitternacht.
    endIso = new Date(candidate) <= new Date(startIso) ? plusHoursIso(candidate, 24) : candidate
  } else {
    endIso = plusHoursIso(startIso, 2)
  }

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name,
    description: description.slice(0, 300),
    startDate: startIso,
    endDate: endIso,
    location: {
      '@type': 'Place',
      name: location,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'München',
        addressRegion: 'Bayern',
        addressCountry: 'DE',
      },
    },
    url: `${BASE_URL}${url}`,
    organizer: {
      '@type': 'Organization',
      name: 'Pepe Dome',
      url: BASE_URL,
    },
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  }

  if (image) data.image = image
  if (category) data.about = { '@type': 'Thing', name: category }

  if (price) {
    // price ist ein freier Text ("ab 22 €", "20 bis 35 €", "Eintritt frei"). Wir
    // versuchen die niedrigste Zahl rauszuziehen für Googles `price`, behalten
    // den Original-Text aber als description, damit "ab" / "Spendenbasis" nicht
    // verloren geht.
    //
    // Der Gratis-Fall läuft über isFreeEntry() statt über einen Stringvergleich:
    // sonst meldet ein Event mit price "Kostenlos" gar keinen Preis an Google
    // (kein Treffer im Zahlen-Match), und ein kostenloses Event ohne `price: 0`
    // fällt aus den Event-Rich-Results heraus.
    const priceNumber = isFreeEntry(price)
      ? '0'
      : (price.match(/\d+(?:[.,]\d+)?/)?.[0]?.replace(',', '.') ?? '')

    data.offers = {
      '@type': 'Offer',
      ...(priceNumber && { price: priceNumber, priceCurrency: 'EUR' }),
      description: price,
      availability: 'https://schema.org/InStock',
      url: ticketUrl || `${BASE_URL}${url}`,
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdScriptContent(data) }}
    />
  )
}

type ArticleLdProps = {
  headline: string
  description: string
  author: string
  datePublished: string
  image?: string | null
  url: string
  tags?: string[]
}

export function ArticleJsonLd({
  headline,
  description,
  author,
  datePublished,
  image,
  url,
  tags,
}: ArticleLdProps) {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description: description.slice(0, 300),
    author: {
      '@type': 'Person',
      name: author,
    },
    datePublished,
    publisher: {
      '@type': 'Organization',
      name: 'Pepe Dome',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/PepeDome Logo ausgeschnitten.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}${url}`,
    },
  }

  if (image) data.image = image
  if (tags && tags.length > 0) data.keywords = tags.join(', ')

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdScriptContent(data) }}
    />
  )
}

type BreadcrumbItem = { name: string; url: string }

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdScriptContent(data) }}
    />
  )
}
