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

type EventLdProps = {
  name: string
  description: string
  startDate: string
  endDate?: string | null
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
  location = 'Pepe Dome, Ostpark, München',
  image,
  url,
  price,
  ticketUrl,
  category,
}: EventLdProps) {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name,
    description: description.slice(0, 300),
    startDate,
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

  if (endDate) data.endDate = endDate
  if (image) data.image = image
  if (category) data.about = { '@type': 'Thing', name: category }

  if (price) {
    data.offers = {
      '@type': 'Offer',
      price: price === 'Eintritt frei' ? '0' : price.replace(/[^\d.,]/g, ''),
      priceCurrency: 'EUR',
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
