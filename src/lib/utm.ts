/**
 * UTM-Kampagnenparameter für den Newsletter
 *
 * Ziel: jeder Klick aus einer Mail soll später in der Web-Analyse einer
 * Ausgabe, einer Position und einem konkreten Element zuzuordnen sein.
 * Resend-Click-Tracking sagt nur "irgendwer hat irgendwas geklickt";
 * erst utm_content macht daraus "Position 1, Ticket-Button, Event X".
 *
 * Schema:
 *   utm_source   = newsletter        (konstant)
 *   utm_medium   = email             (konstant)
 *   utm_campaign = <newsletter-slug>  z. B. 2026-08-sommerprogramm
 *   utm_content  = <position>_<element>  z. B. p1_ticket, lead_image, footer_events
 */

export const UTM_SOURCE = 'newsletter'
export const UTM_MEDIUM = 'email'

/**
 * Kampagnen-ID einer Ausgabe. Der Slug ist bereits eindeutig und
 * enthält Jahr und Monat, taugt also direkt als Kampagnenname.
 */
export function buildCampaignId(newsletterSlug: string): string {
  return newsletterSlug
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Baut eine utm_content-ID aus Position und Element.
 *
 * @param position z. B. 'lead', 'p2', 'hero', 'footer'
 * @param element  z. B. 'ticket', 'title', 'image', 'more'
 */
export function contentId(position: string, element: string): string {
  return `${slugPart(position)}_${slugPart(element)}`
}

function slugPart(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
}

/**
 * Links, die keine UTM-Parameter bekommen dürfen.
 *
 * - mailto:/tel: sind keine Web-Ziele, Parameter würden dort im
 *   Betreff-Feld landen oder den Link zerschießen
 * - Abmelde- und Datenschutz-Links sind Pflichtfunktionen, kein Marketing.
 *   Sie zu tracken bringt nichts und wirkt gegenüber Empfängern übergriffig
 */
function isTrackable(url: string): boolean {
  if (!url) return false
  const lower = url.trim().toLowerCase()
  if (lower.startsWith('mailto:')) return false
  if (lower.startsWith('tel:')) return false
  if (lower.startsWith('#')) return false
  return lower.startsWith('http://') || lower.startsWith('https://')
}

export interface UtmOptions {
  campaign: string
  /** Position und Element, siehe contentId() */
  content: string
  source?: string
  medium?: string
  /** Optional: Genre/Kategorie, um später Interessen ableiten zu können */
  term?: string
}

/**
 * Hängt UTM-Parameter an eine URL an.
 *
 * Bereits vorhandene utm_-Parameter bleiben unangetastet: Wenn im Admin
 * bewusst eine fertig getaggte URL hinterlegt wurde, soll sie nicht
 * überschrieben werden.
 */
export function withUtm(url: string | undefined | null, options: UtmOptions): string {
  if (!url) return ''
  if (!isTrackable(url)) return url

  try {
    const parsed = new URL(url)
    const params = parsed.searchParams

    if (!params.has('utm_source')) params.set('utm_source', options.source ?? UTM_SOURCE)
    if (!params.has('utm_medium')) params.set('utm_medium', options.medium ?? UTM_MEDIUM)
    if (!params.has('utm_campaign')) params.set('utm_campaign', options.campaign)
    if (!params.has('utm_content')) params.set('utm_content', options.content)
    if (options.term && !params.has('utm_term')) params.set('utm_term', slugPart(options.term))

    parsed.search = params.toString()
    return parsed.toString()
  } catch {
    // Kaputte URL lieber unverändert durchreichen als den Versand kippen
    return url
  }
}

/**
 * mailto-Adressen aus dem Admin kommen mal mit, mal ohne Schema.
 * Für Links im Mail-Template brauchen wir immer ein gültiges Schema.
 */
export function normalizeContactUrl(url: string): string {
  const trimmed = url.trim()
  if (!trimmed) return ''
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed
  if (trimmed.startsWith('mailto:') || trimmed.startsWith('tel:')) return trimmed
  if (trimmed.includes('@')) return `mailto:${trimmed}`
  return trimmed
}

/**
 * Erkennt, ob ein hinterlegter Ticket-Link in Wahrheit eine E-Mail-Anmeldung ist.
 */
export function isMailLink(url: string | null | undefined): boolean {
  if (!url) return false
  const trimmed = url.trim().toLowerCase()
  if (trimmed.startsWith('mailto:')) return true
  return trimmed.includes('@') && !trimmed.startsWith('http')
}
