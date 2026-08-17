/**
 * Newsletter-Viewmodel
 *
 * Eine Quelle für alle drei Ausspielwege: Versand, Admin-Vorschau und
 * öffentliche Web-Ansicht. Vorher hatte jeder Weg seine eigene Kopie der
 * Aufbereitungslogik, die auseinandergelaufen ist. Die Vorschau zeigte
 * deshalb nicht zuverlässig das, was tatsächlich verschickt wurde.
 *
 * Zweite Aufgabe: Hierarchie. Aus einer flachen Inhaltsliste wird eine
 * gewichtete Struktur, damit die Mail nicht als Aneinanderreihung
 * gleichwertiger Karten wirkt.
 */

import { prisma } from './prisma'
import { buildCampaignId, contentId, withUtm, isMailLink, normalizeContactUrl } from './utm'
import { formatTimeRange } from './event-time'
import { endeVon, formatEventDateRange } from './event-window'

/**
 * Wie prominent ein Beitrag dargestellt wird.
 *
 * lead    = Aufmacher: großes Bild, ausführlicher Text, primärer Button
 * feature = mittlere Karte: Bild, Kurztext, sekundärer Button
 * compact = Terminzeile: Datum, Titel, Textlink, kein Bild
 */
export type ItemEmphasis = 'lead' | 'feature' | 'compact'

export interface NewsletterEventItem {
  kind: 'event'
  emphasis: ItemEmphasis
  /** Position für utm_content, z. B. "lead" oder "p3" */
  position: string
  id: string
  slug: string
  title: string
  subtitle?: string
  teaser?: string
  /** "Samstag, 15. August 2026" */
  dateLabel: string
  /** "15" für das Datums-Badge */
  dayLabel: string
  /** "Aug" für das Datums-Badge */
  monthLabel: string
  /** "Sa" für die Kompaktzeile */
  weekdayLabel: string
  /**
   * "15. bis 21. August" — nur bei mehrtägigen Terminen gesetzt.
   *
   * In der Kompaktzeile steht sonst der Wochentag, und der stimmt bei einer
   * ganzen Woche nicht: Das Badge zeigt den ersten Tag, daneben stand "Sa",
   * und vom Zeitraum war nirgends etwas zu sehen.
   */
  spanLabel?: string
  time?: string
  location?: string
  category?: string
  categoryLabel?: string
  price?: string
  imageUrl?: string
  /** Detailseite auf der eigenen Website, immer getrackt */
  detailUrl: string
  /** Ticket- oder Anmeldeziel mit UTM-Parametern; kann extern sein */
  ctaUrl: string
  /**
   * Dasselbe Ziel ohne Kampagnenparameter. Die Webansicht verlinkt darauf:
   * Ein Klick auf der Website ist kein Newsletter-Klick, und ihn als solchen
   * zu zählen würde die Attribution verfälschen.
   */
  ctaUrlPlain: string
  ctaLabel: string
  /** Anmeldung per Mail statt Ticketshop */
  isMailCta: boolean
}

export interface NewsletterArticleItem {
  kind: 'article'
  emphasis: ItemEmphasis
  position: string
  id: string
  slug: string
  title: string
  teaser?: string
  category?: string
  imageUrl?: string
  articleUrl: string
}

/** Freier redaktioneller Block aus dem Admin (CUSTOM_SECTION) */
export interface NewsletterNoteItem {
  kind: 'note'
  position: string
  title?: string
  text?: string
}

export type NewsletterItem = NewsletterEventItem | NewsletterArticleItem | NewsletterNoteItem

export interface NewsletterSection {
  heading?: string
  description?: string
  items: NewsletterItem[]
}

export interface NewsletterViewModel {
  subject: string
  preheader?: string
  slug: string
  /** utm_campaign dieser Ausgabe */
  campaign: string
  hero: {
    imageUrl?: string
    title: string
    subtitle?: string
    ctaLabel?: string
    ctaUrl?: string
  }
  introText?: string
  sections: NewsletterSection[]
  /** Anzahl Events insgesamt, für Texte wie "und 4 weitere Termine" */
  eventCount: number
  baseUrl: string
  homeUrl: string
  eventsUrl: string
  archiveUrl: string
  webViewUrl: string
}

const CATEGORY_LABELS: Record<string, string> = {
  SHOW: 'Show',
  PREMIERE: 'Premiere',
  FESTIVAL: 'Festival',
  WORKSHOP: 'Workshop',
  OPEN_TRAINING: 'Offenes Training',
  KINDERTRAINING: 'Kindertraining',
  BUSINESS: 'Business',
  OPEN_AIR: 'Open Air',
  EVENT: 'Veranstaltung',
}

export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3004'
}

export function toAbsoluteUrl(url: string | null | undefined, baseUrl = getBaseUrl()): string | undefined {
  if (!url) return undefined
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`
}

/**
 * Kürzt auf Wortgrenze statt mitten im Wort.
 */
export function truncate(text: string | null | undefined, maxLength: number): string | undefined {
  if (!text) return undefined
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= maxLength) return clean
  const cut = clean.slice(0, maxLength)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > maxLength * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[,;:.]$/, '')}…`
}

/**
 * Gewichtung nach redaktioneller Reihenfolge.
 *
 * Der erste Termin im Newsletter ist der Aufmacher, die nächsten beiden
 * bekommen eine mittlere Karte, alles Weitere wird zur Terminzeile.
 * Die Reihenfolge kommt aus dem Drag-and-drop im Admin, ist also eine
 * bewusste redaktionelle Entscheidung und keine Datenbanksortierung.
 */
function emphasisForIndex(index: number): ItemEmphasis {
  if (index === 0) return 'lead'
  if (index <= 2) return 'feature'
  return 'compact'
}

function positionForIndex(index: number): string {
  return index === 0 ? 'lead' : `p${index + 1}`
}

export interface BuildOptions {
  baseUrl?: string
  /** Datumsformat, z. B. 'de-DE' oder 'en-US'. E-Mails bleiben immer Deutsch. */
  dateLocale?: string
  /**
   * 'email' schickt alle Bilder durch /api/newsletter-image: fester
   * Zuschnitt, kleinere Datei, immer JPEG. E-Mail-Clients können das nicht
   * selbst, deshalb muss es vor dem Versand passieren.
   * 'web' liefert die Originale, die Website skaliert selbst.
   */
  target?: 'email' | 'web'
}

/** Zuschnitt je nach Rolle des Bildes. Siehe /api/newsletter-image. */
const IMAGE_PRESETS = {
  hero: { ratio: '3:2', width: 1200 },
  lead: { ratio: '3:2', width: 1200 },
  feature: { ratio: '16:9', width: 1100 },
  article: { ratio: '16:9', width: 1100 },
} as const

type ImagePreset = keyof typeof IMAGE_PRESETS

/**
 * Baut die URL zum aufbereiteten Bild. Für die Webansicht bleibt das
 * Original stehen, dort übernimmt Next die Optimierung.
 */
function prepareImage(
  rawUrl: string | null | undefined,
  preset: ImagePreset,
  baseUrl: string,
  target: 'email' | 'web'
): string | undefined {
  if (!rawUrl) return undefined
  if (target === 'web') return toAbsoluteUrl(rawUrl, baseUrl)

  const { ratio, width } = IMAGE_PRESETS[preset]
  const params = new URLSearchParams({ src: rawUrl, w: String(width), ratio })
  return `${baseUrl}/api/newsletter-image?${params.toString()}`
}

interface EventRecord {
  id: string
  slug: string
  title: string
  subtitle: string | null
  description: string
  date: Date
  /** Ende mehrtaegiger Termine. Ohne dieses Feld nennt der Newsletter nur den
      ersten Tag, siehe formatEventDateRange in src/lib/event-window.ts. */
  endDate: Date | null
  time: string | null
  endTime: string | null
  location: string
  category: string
  ticketUrl: string | null
  price: string | null
  imageUrl: string | null
}

interface ArticleRecord {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  imageUrl: string | null
}

interface NewsletterRecord {
  slug: string
  subject: string
  preheader: string | null
  introText: string | null
  heroImageUrl: string | null
  heroTitle: string | null
  heroSubtitle: string | null
  heroCTALabel: string | null
  heroCTAUrl: string | null
  content: Array<{
    contentType: string
    contentId: string | null
    sectionHeading: string | null
    sectionDescription: string | null
    orderPosition: number
  }>
}

function buildEventItem(
  event: EventRecord,
  index: number,
  campaign: string,
  baseUrl: string,
  dateLocale: string,
  target: 'email' | 'web'
): NewsletterEventItem {
  const emphasis = emphasisForIndex(index)
  const position = positionForIndex(index)
  const date = new Date(event.date)

  const detailUrl = withUtm(`${baseUrl}/events/${event.slug}`, {
    campaign,
    content: contentId(position, 'event'),
    term: event.category,
  })

  const hasTicketUrl = Boolean(event.ticketUrl)
  const mailCta = isMailLink(event.ticketUrl)
  const rawCtaUrl = hasTicketUrl ? normalizeContactUrl(event.ticketUrl!) : `${baseUrl}/events/${event.slug}`

  const ctaUrl = withUtm(rawCtaUrl, {
    campaign,
    content: contentId(position, mailCta ? 'anmeldung' : hasTicketUrl ? 'ticket' : 'detail'),
    term: event.category,
  })

  let ctaLabel: string
  if (!hasTicketUrl) ctaLabel = 'Mehr erfahren'
  else if (mailCta) ctaLabel = 'Platz anfragen'
  else ctaLabel = 'Tickets sichern'

  // Aufmacher darf mehr Text tragen, Terminzeilen tragen keinen
  const teaserLength = emphasis === 'lead' ? 220 : emphasis === 'feature' ? 130 : 0
  const teaserSource = event.subtitle || event.description

  return {
    kind: 'event',
    emphasis,
    position,
    id: event.id,
    slug: event.slug,
    title: event.title,
    subtitle: event.subtitle || undefined,
    teaser: teaserLength > 0 ? truncate(teaserSource, teaserLength) : undefined,
    // Mehrtaegige Termine als Zeitraum, sonst stand im Newsletter nur der
    // erste Tag. Ein eintaegiger Termin behaelt genau die alte Ausgabe,
    // Wochentag inklusive.
    dateLabel: formatEventDateRange(event, dateLocale, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    dayLabel: date.toLocaleDateString(dateLocale, { day: '2-digit' }),
    monthLabel: date.toLocaleDateString(dateLocale, { month: 'short' }).replace('.', ''),
    weekdayLabel: date.toLocaleDateString(dateLocale, { weekday: 'short' }).replace('.', ''),
    // Nur wenn wirklich mehrere Tage. Manche Termine tragen ein endDate, das
    // auf denselben Tag faellt; dort bliebe der Wochentag die bessere Angabe.
    spanLabel:
      event.endDate && endeVon(event) > date
        ? formatEventDateRange(event, dateLocale, { day: 'numeric', month: 'long' })
        : undefined,
    // Ein Wortlaut für Mail, Textfassung und Web-Ansicht: "20:00 bis 22:00 Uhr"
    time: formatTimeRange(event.time, event.endTime) || undefined,
    location: event.location || undefined,
    category: event.category,
    categoryLabel: CATEGORY_LABELS[event.category] || undefined,
    price: event.price || undefined,
    imageUrl: prepareImage(event.imageUrl, emphasis === 'lead' ? 'lead' : 'feature', baseUrl, target),
    detailUrl,
    ctaUrl,
    ctaUrlPlain: rawCtaUrl,
    ctaLabel,
    isMailCta: mailCta,
  }
}

function buildArticleItem(
  article: ArticleRecord,
  index: number,
  campaign: string,
  baseUrl: string,
  target: 'email' | 'web'
): NewsletterArticleItem {
  const emphasis: ItemEmphasis = index === 0 ? 'feature' : 'compact'
  const position = `a${index + 1}`

  return {
    kind: 'article',
    emphasis,
    position,
    id: article.id,
    slug: article.slug,
    title: article.title,
    teaser: emphasis === 'feature' ? truncate(article.excerpt, 160) : undefined,
    category: article.category || undefined,
    imageUrl: prepareImage(article.imageUrl, 'article', baseUrl, target),
    articleUrl: withUtm(`${baseUrl}/news/${article.slug}`, {
      campaign,
      content: contentId(position, 'artikel'),
    }),
  }
}

/**
 * Baut das Viewmodel aus einem bereits geladenen Newsletter-Datensatz.
 * Separat von der DB-Abfrage, damit es sich ohne Datenbank testen lässt.
 */
export function buildViewModel(
  newsletter: NewsletterRecord,
  lookup: { events: Map<string, EventRecord>; articles: Map<string, ArticleRecord> },
  options?: BuildOptions
): NewsletterViewModel {
  const baseUrl = options?.baseUrl ?? getBaseUrl()
  const dateLocale = options?.dateLocale ?? 'de-DE'
  const target = options?.target ?? 'email'
  const campaign = buildCampaignId(newsletter.slug)

  const sections: NewsletterSection[] = []
  const sectionsByHeading = new Map<string, NewsletterSection>()

  // Laufende Zähler über die ganze Ausgabe hinweg: die Gewichtung soll sich
  // an der Gesamtposition orientieren, nicht an der Position in der Sektion.
  let eventIndex = 0
  let articleIndex = 0
  let noteIndex = 0

  const sorted = [...newsletter.content].sort((a, b) => a.orderPosition - b.orderPosition)

  for (const block of sorted) {
    // Ein freier Textblock ist immer seine eigene Sektion
    if (block.contentType === 'CUSTOM_SECTION') {
      noteIndex += 1
      sections.push({
        items: [
          {
            kind: 'note',
            position: `n${noteIndex}`,
            title: block.sectionHeading || undefined,
            text: block.sectionDescription || undefined,
          },
        ],
      })
      continue
    }

    if (!block.contentId) continue

    let item: NewsletterItem | null = null

    if (block.contentType === 'EVENT' || block.contentType === 'SHOW') {
      const event = lookup.events.get(block.contentId)
      if (event) {
        item = buildEventItem(event, eventIndex, campaign, baseUrl, dateLocale, target)
        eventIndex += 1
      }
    } else if (block.contentType === 'ARTICLE') {
      const article = lookup.articles.get(block.contentId)
      if (article) {
        item = buildArticleItem(article, articleIndex, campaign, baseUrl, target)
        articleIndex += 1
      }
    }

    if (!item) continue

    const headingKey = block.sectionHeading || ''
    let section = sectionsByHeading.get(headingKey)
    if (!section) {
      section = {
        heading: block.sectionHeading || undefined,
        description: block.sectionDescription || undefined,
        items: [],
      }
      sectionsByHeading.set(headingKey, section)
      sections.push(section)
    }
    section.items.push(item)
  }

  const heroCTAUrl = newsletter.heroCTAUrl
    ? withUtm(toAbsoluteUrl(newsletter.heroCTAUrl, baseUrl)!, {
        campaign,
        content: contentId('hero', 'cta'),
      })
    : undefined

  return {
    subject: newsletter.subject,
    preheader: newsletter.preheader || undefined,
    slug: newsletter.slug,
    campaign,
    hero: {
      imageUrl: prepareImage(newsletter.heroImageUrl, 'hero', baseUrl, target),
      title: newsletter.heroTitle || newsletter.subject,
      subtitle: newsletter.heroSubtitle || undefined,
      ctaLabel: newsletter.heroCTALabel || undefined,
      ctaUrl: heroCTAUrl,
    },
    introText: newsletter.introText || undefined,
    sections: sections.filter((section) => section.items.length > 0),
    eventCount: eventIndex,
    baseUrl,
    homeUrl: withUtm(baseUrl, { campaign, content: contentId('header', 'logo') }),
    eventsUrl: withUtm(`${baseUrl}/events`, { campaign, content: contentId('footer', 'alle-termine') }),
    archiveUrl: `${baseUrl}/newsletter`,
    webViewUrl: `${baseUrl}/newsletter/${newsletter.slug}`,
  }
}

/**
 * Lädt einen Newsletter samt verknüpfter Events und Artikel und baut das Viewmodel.
 *
 * contentId kann historisch bedingt eine UUID oder ein Slug sein, deshalb
 * wird nach beidem gesucht.
 */
export async function getNewsletterViewModel(
  newsletterId: string,
  options?: BuildOptions & { bySlug?: boolean }
): Promise<NewsletterViewModel | null> {
  const newsletter = await prisma.newsletter.findUnique({
    where: options?.bySlug ? { slug: newsletterId } : { id: newsletterId },
    include: { content: { orderBy: { orderPosition: 'asc' } } },
  })

  if (!newsletter) return null

  return buildViewModelFromNewsletter(newsletter, options)
}

/**
 * Variante für Aufrufer, die den Newsletter schon geladen haben
 * (z. B. der Versand, der zusätzlich Status und Empfänger braucht).
 */
export async function buildViewModelFromNewsletter(
  newsletter: NewsletterRecord,
  options?: BuildOptions
): Promise<NewsletterViewModel> {
  const eventIds: string[] = []
  const articleIds: string[] = []

  for (const block of newsletter.content) {
    if (!block.contentId) continue
    if (block.contentType === 'EVENT' || block.contentType === 'SHOW') {
      eventIds.push(block.contentId)
    } else if (block.contentType === 'ARTICLE') {
      articleIds.push(block.contentId)
    }
  }

  const [events, articles] = await Promise.all([
    eventIds.length > 0
      ? prisma.event.findMany({
          where: { OR: [{ id: { in: eventIds } }, { slug: { in: eventIds } }] },
        })
      : Promise.resolve([]),
    articleIds.length > 0
      ? prisma.article.findMany({
          where: { OR: [{ id: { in: articleIds } }, { slug: { in: articleIds } }] },
        })
      : Promise.resolve([]),
  ])

  const eventMap = new Map<string, EventRecord>()
  for (const event of events as EventRecord[]) {
    eventMap.set(event.id, event)
    eventMap.set(event.slug, event)
  }

  const articleMap = new Map<string, ArticleRecord>()
  for (const article of articles as ArticleRecord[]) {
    articleMap.set(article.id, article)
    articleMap.set(article.slug, article)
  }

  return buildViewModel(newsletter, { events: eventMap, articles: articleMap }, options)
}
