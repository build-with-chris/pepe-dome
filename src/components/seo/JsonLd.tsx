/**
 * JSON-LD Structured Data Components for SEO
 * Implements schema.org markup for Organization, Event, Article
 */

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

export function OrganizationJsonLd({
  name = 'Pepe Dome',
  description = 'Zuhause für Artistik & Kultur im Ostpark München. Zeitgenössischer Zirkus, Shows, Workshops, Festivals und Events.',
  url = BASE_URL,
  logo = `${BASE_URL}/PepeDome Logo ausgeschnitten.png`,
  email = 'info@pepe-dome.de',
  address = {
    streetAddress: 'Ostpark',
    addressLocality: 'München',
    addressRegion: 'Bayern',
    postalCode: '81671',
    addressCountry: 'DE',
  },
}: OrganizationLdProps = {}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'PerformingArtsTheater',
    name,
    description,
    url,
    logo,
    email,
    address: {
      '@type': 'PostalAddress',
      ...address,
    },
    sameAs: [],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
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
  let endIso: string
  if (endDate) {
    const candidate = toBerlinIso(endDate, time)
    endIso = new Date(candidate) <= new Date(startIso) ? plusHoursIso(startIso, 2) : candidate
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
    // price ist ein freier Text ("ab 22 €", "20–35 €", "Eintritt frei"). Wir
    // versuchen die niedrigste Zahl rauszuziehen für Googles `price`, behalten
    // den Original-Text aber als description, damit "ab" / "Spendenbasis" nicht
    // verloren geht.
    const priceNumber =
      price === 'Eintritt frei'
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
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
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
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
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
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
