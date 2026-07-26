import { getSiteContent } from '@/lib/data'
import { isFreeEntry } from '@/lib/event-price'
import { formatTimeRange } from '@/lib/event-time'
import { absoluteUrl, SITE_URL } from '@/lib/seo'
import { isMailTicket } from '@/lib/ticket-url'
import { buildCampaignId, contentId, withUtm } from '@/lib/utm'
import { CHANNELS } from './channels'
import { hashtagLine, tagList } from './hashtags'
import {
  firstParagraph,
  replaceDashes,
  toPortalText,
  toSingleLine,
  truncateAtWord,
} from './portal-text'
import type {
  ChannelDefinition,
  ChannelKit,
  EventChannelKit,
  FieldSource,
  KitField,
} from './types'

/**
 * Kanal-Kit: aus einem Event die Texte für alle Zielkanäle bauen
 *
 * Es wird nichts gespeichert. Jeder Aufruf liest das Event und erzeugt daraus
 * die Felder neu. Ändert die Redaktion die Beschreibung, ist der Kopiertext
 * beim nächsten Blick korrekt, ohne dass irgendetwas nachgezogen werden muss.
 *
 * Zwei Fälle bekommen bewusst gar kein Kit:
 *
 *   BUSINESS      Firmenvermietungen sind geschlossene Veranstaltungen. Eine
 *                 Firmenfeier im Stadtmagazin hilft niemandem.
 *   Serientermin  Ein Kindevent mit `parentEventId` erzeugt kein eigenes Kit,
 *                 sonst entstehen aus einem wöchentlichen Training
 *                 sechsundzwanzig Einträge statt einem mit Terminliste.
 */

/** Das, was der Bauer vom Event braucht. Absichtlich weniger als das Prisma-Modell. */
export interface ChannelKitEvent {
  id: string
  slug: string
  title: string
  subtitle?: string | null
  description: string
  date: Date | string
  time?: string | null
  endTime?: string | null
  location: string
  category: string
  ticketUrl?: string | null
  price?: string | null
  imageUrl?: string | null
  parentEventId?: string | null
  /** Folgetermine einer Serie. Nur beim Elternevent gefüllt. */
  childEvents?: ChannelKitChildEvent[]
}

export interface ChannelKitChildEvent {
  id: string
  date: Date | string
  time?: string | null
  endTime?: string | null
}

export interface BuildOptions {
  /** Stichtag für "kommende Termine". Nur für Tests interessant. */
  now?: Date
}

const DATE_FORMAT = new Intl.DateTimeFormat('de-DE', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Europe/Berlin',
})

function toDate(value: Date | string): Date {
  return value instanceof Date ? value : new Date(value)
}

function formatDay(value: Date | string): string {
  return DATE_FORMAT.format(toDate(value))
}

/**
 * Datum und Uhrzeit als eine Angabe.
 *
 * Bei einer Serie steht hier die vollständige Terminliste. Rausgegangen und
 * IN München nehmen Serientermine entgegen, und genau an dieser Stelle spart
 * das Kit die meiste Zeit.
 */
function buildDateLine(event: ChannelKitEvent, now: Date): string {
  const time = formatTimeRange(event.time, event.endTime)
  const first = time ? `${formatDay(event.date)}, ${time}` : formatDay(event.date)

  const upcoming = (event.childEvents ?? [])
    .filter((child) => toDate(child.date).getTime() >= startOfDay(now).getTime())
    .sort((a, b) => toDate(a.date).getTime() - toDate(b.date).getTime())

  if (upcoming.length === 0) return first

  const lines = upcoming.map((child) => {
    const childTime = formatTimeRange(child.time ?? event.time, child.endTime ?? event.endTime)
    return childTime ? `${formatDay(child.date)}, ${childTime}` : formatDay(child.date)
  })

  const all = toDate(event.date).getTime() >= startOfDay(now).getTime() ? [first, ...lines] : lines

  return `Termine:\n${all.join('\n')}`
}

function startOfDay(value: Date): Date {
  const copy = new Date(value)
  copy.setHours(0, 0, 0, 0)
  return copy
}

/**
 * Ort inklusive Anschrift.
 *
 * Portale fragen die Adresse ab, im Event steht meist nur "Pepe Dome". Die
 * Anschrift kommt aus content.json, damit sie nicht an sieben Stellen im Code
 * ein zweites Mal getippt wird.
 */
function buildLocation(venue: string): string {
  const site = getSiteContent()
  const street = site.address?.street ?? ''
  const city = [site.address?.zip, site.address?.city].filter(Boolean).join(' ')
  const name = venue.trim()

  if (!street) return name
  if (name.includes(street)) return name

  return [name, street, city].filter(Boolean).join(', ')
}

/** Straße und "PLZ Ort" einzeln, für Formulare mit getrennten Adressfeldern. */
function addressParts(): { street: string; cityLine: string } {
  const site = getSiteContent()
  return {
    street: site.address?.street ?? '',
    cityLine: [site.address?.zip, site.address?.city].filter(Boolean).join(' '),
  }
}

/** Absender unter einer Pressemeldung. */
function buildContactBlock(): string {
  const site = getSiteContent()
  return [site.name, buildLocation(site.name), site.email, site.phone]
    .filter(Boolean)
    .join('\n')
}

/** Absolute Bild-URL. Relative Pfade aus dem Upload werden ergänzt. */
function absoluteImage(imageUrl: string): string {
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl
  return `${SITE_URL}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`
}

interface FieldValue {
  value: string
  missing?: string
}

export function buildChannelKit(
  event: ChannelKitEvent,
  options: BuildOptions = {}
): EventChannelKit {
  if (event.category === 'BUSINESS') {
    return { available: false, reason: 'BUSINESS', parentEventId: null, channels: [] }
  }

  if (event.parentEventId) {
    return {
      available: false,
      reason: 'CHILD_EVENT',
      parentEventId: event.parentEventId,
      channels: [],
    }
  }

  const now = options.now ?? new Date()

  const description = toPortalText(event.description)
  const teaser = firstParagraph(description)
  const dateLine = buildDateLine(event, now)
  const location = buildLocation(event.location)
  const headline = event.subtitle ? `${event.title}: ${event.subtitle}` : event.title

  const ticketUrl = event.ticketUrl?.trim() ?? ''
  const mailTicket = ticketUrl.length > 0 && isMailTicket(ticketUrl)
  const price = event.price?.trim()
    ? isFreeEntry(event.price)
      ? 'Eintritt frei'
      : event.price.trim()
    : null

  const campaign = buildCampaignId(`event-${event.slug}`)
  const eventPath = `/events/${event.slug}`

  const channels = CHANNELS.map((channel) =>
    buildChannel(channel, {
      headline,
      teaser,
      description,
      dateLine,
      location,
      venueName: event.location.trim(),
      price,
      mailTicket,
      ticketUrl,
      imageUrl: event.imageUrl?.trim() ?? '',
      category: event.category,
      campaign,
      eventPath,
    })
  )

  return { available: true, reason: null, parentEventId: null, channels }
}

interface BuildContext {
  headline: string
  teaser: string
  description: string
  dateLine: string
  location: string
  venueName: string
  price: string | null
  mailTicket: boolean
  ticketUrl: string
  imageUrl: string
  category: string
  campaign: string
  eventPath: string
}

function buildChannel(channel: ChannelDefinition, ctx: BuildContext): ChannelKit {
  const fields: KitField[] = channel.fields.map((definition) => {
    const raw = valueFor(definition.key, channel, ctx)
    // Gedankenstriche werden hier zentral entfernt, nicht in jedem Zweig
    // einzeln: sie kommen nicht nur aus der Beschreibung, sondern auch aus
    // Titel, Untertitel und Preis, und ein Feld reicht, damit das Zeichen im
    // fremden Portal steht.
    const cut = truncateAtWord(replaceDashes(raw.value), definition.limit.max)

    return {
      key: definition.key,
      label: definition.label,
      value: raw.missing ? '' : cut.text,
      max: definition.limit.max,
      limitOrigin: definition.limit.max === null ? null : definition.limit.origin,
      length: raw.missing ? 0 : cut.text.length,
      overLimit: raw.missing ? false : cut.overLimit,
      truncated: raw.missing ? false : cut.truncated,
      multiline: definition.multiline ?? false,
      missing: raw.missing ?? null,
      hint: definition.hint ?? null,
    }
  })

  const warnings = fields
    .filter((field) => field.missing)
    .map((field) => field.missing as string)

  if (ctx.mailTicket) {
    warnings.push(
      'Der Ticketlink ist eine Mailadresse. Ausgegeben wird deshalb die eigene Event-Seite, die Anmeldung per Mail steht im Text.'
    )
  }

  const copyAll = fields
    .filter((field) => field.value.length > 0)
    .map((field) => `${field.label}:\n${field.value}`)
    .join('\n\n')

  return {
    id: channel.id,
    label: channel.label,
    distributionChannel: channel.distributionChannel,
    formUrl: channel.formUrl ?? null,
    fields,
    copyAll,
    hasAssumedLimits: channel.fields.some(
      (f) => f.limit.max !== null && f.limit.origin === 'annahme'
    ),
    warnings,
  }
}

/**
 * Der Link, der in ein Portalfeld geht.
 *
 * Immer die eigene Event-Seite, auch wenn ein externer Ticketshop hinterlegt
 * ist. Zwei Gründe: der Ticketklick wird auf der eigenen Seite gemessen
 * (`trackTicketClick`, src/lib/tracking.ts), und ein Link von rausgegangen.de
 * zurück auf rausgegangen.de wäre ohnehin sinnlos. Über `utm_source` je Kanal
 * lässt sich danach sagen, welcher Kanal tatsächlich Ticketklicks bringt.
 */
function eventLink(channel: ChannelDefinition, ctx: BuildContext): string {
  return withUtm(absoluteUrl('de', ctx.eventPath), {
    campaign: ctx.campaign,
    content: contentId('kit', channel.id),
    source: channel.utmSource,
    medium: channel.utmMedium,
  })
}

/** Satz statt Link, wenn die Anmeldung per Mail läuft. */
function registrationLine(ctx: BuildContext): string | null {
  if (!ctx.mailTicket) return null
  const address = ctx.ticketUrl.replace(/^mailto:/i, '')
  return `Anmeldung per Mail an ${address}`
}

function valueFor(
  key: FieldSource,
  channel: ChannelDefinition,
  ctx: BuildContext
): FieldValue {
  switch (key) {
    case 'title':
      return { value: ctx.headline }

    case 'description': {
      const registration = registrationLine(ctx)
      return {
        value: [ctx.description, registration].filter(Boolean).join('\n\n'),
      }
    }

    case 'datetime':
      return { value: ctx.dateLine }

    case 'location':
      return { value: ctx.location }

    case 'venueName':
      return { value: ctx.venueName }

    case 'street':
      return { value: addressParts().street }

    case 'cityLine':
      return { value: addressParts().cityLine }

    case 'price':
      return ctx.price
        ? { value: ctx.price }
        : {
            value: '',
            missing: `Für dieses Event ist kein Preis hinterlegt. ${channel.label} verlangt eine Angabe, bitte am Event nachtragen.`,
          }

    case 'link':
      return { value: eventLink(channel, ctx) }

    /**
     * Nur ein echter Ticketshop. IN München schreibt ins Feld "bitte wirklich
     * nur Ticketlinks", die eigene Seite gehört dort ins Feld Webseite. Eine
     * Mailadresse ist kein Ticketlink und wird deshalb gemeldet statt gesetzt.
     */
    case 'ticketLink':
      if (ctx.ticketUrl && !ctx.mailTicket) return { value: ctx.ticketUrl }
      return {
        value: '',
        missing: ctx.mailTicket
          ? `Die Anmeldung läuft über eine Mailadresse. ${channel.label} nimmt hier nur echte Ticketlinks, das Feld bleibt also leer.`
          : `Für dieses Event ist kein Ticketshop hinterlegt. ${channel.label} nimmt hier nur echte Ticketlinks, das Feld bleibt also leer.`,
      }

    case 'imageNote':
      return ctx.imageUrl
        ? { value: absoluteImage(ctx.imageUrl) }
        : {
            value: '',
            missing: `${channel.label} zeigt den Eintrag mit Bild. Für dieses Event ist keines hinterlegt.`,
          }

    case 'hashtags':
      return { value: hashtagLine(ctx.category) }

    case 'tags':
      return { value: tagList(ctx.category).join(', ') }

    /**
     * Instagram-Caption ohne Link: eine URL in der Caption ist toter Text.
     * Der Link steht als eigenes Feld für die Bio.
     */
    case 'caption': {
      const facts = [ctx.dateLine, ctx.location, ctx.price ?? registrationLine(ctx)]
        .filter(Boolean)
        .join('\n')
      const closing = ctx.mailTicket
        ? 'Alle Infos über den Link in unserer Bio.'
        : 'Tickets über den Link in unserer Bio.'
      return { value: [ctx.headline, toSingleLine(ctx.teaser), facts, closing].filter(Boolean).join('\n\n') }
    }

    case 'post': {
      const facts = [ctx.dateLine, ctx.location, ctx.price ?? registrationLine(ctx)]
        .filter(Boolean)
        .join('\n')
      return { value: [ctx.headline, toSingleLine(ctx.teaser), facts].filter(Boolean).join('\n\n') }
    }

    case 'message': {
      const facts = [ctx.dateLine, ctx.location, ctx.price ?? registrationLine(ctx)]
        .filter(Boolean)
        .join('\n')
      return {
        value: [ctx.headline, facts, eventLink(channel, ctx)].filter(Boolean).join('\n\n'),
      }
    }

    case 'pressLead': {
      const where = [ctx.location, ctx.price ?? registrationLine(ctx)].filter(Boolean).join(', ')
      return {
        value: [ctx.headline, [ctx.dateLine, where].filter(Boolean).join('\n'), toSingleLine(ctx.teaser)]
          .filter(Boolean)
          .join('\n'),
      }
    }

    case 'pressContact':
      return { value: buildContactBlock() }
  }
}
