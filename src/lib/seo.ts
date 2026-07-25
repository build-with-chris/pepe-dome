/**
 * SEO-Bausteine für lokalisierte Seiten
 *
 * Jede Seite unter /[lang] braucht drei Dinge, die leicht auseinanderlaufen:
 *
 *   canonical  — die eine URL, unter der die Seite indexiert werden soll
 *   hreflang   — die Verknüpfung von /de/x und /en/x als Übersetzungen
 *   OpenGraph  — Titel/Bild/Sprache für Shares in WhatsApp, Slack, Facebook
 *
 * Vorher setzte jede Seite nur `canonical` von Hand, hreflang gab es nirgends,
 * und OpenGraph erbte still vom Root-Layout — also trug jede Unterseite Titel,
 * Beschreibung und `og:locale: de_DE` der deutschen Startseite. Ein geteilter
 * Link auf /en/about sah aus wie ein Link auf die deutsche Homepage.
 *
 * `pageMetadata()` erzeugt alle drei aus einem Aufruf. Neue Seiten nutzen das
 * statt eines handgeschriebenen Metadata-Objekts.
 */

import type { Metadata } from 'next'
import { LOCALES, DEFAULT_LOCALE, type Locale } from '@/i18n/config'

export const SITE_URL = 'https://www.pepe-dome.de'
export const SITE_NAME = 'Pepe Dome'

/** Default-Sharing-Bild, wenn eine Seite kein eigenes hat. */
export const DEFAULT_OG_IMAGE = {
  url: '/og-image.png',
  width: 1200,
  height: 630,
  alt: 'Pepe Dome im Ostpark München',
}

/** OpenGraph erwartet `de_DE`, nicht `de`. */
const OG_LOCALE: Record<Locale, string> = {
  de: 'de_DE',
  en: 'en_US',
}

/** Absolute URL für einen lokalisierten Pfad: ('en', '/about') → '…/en/about'. */
export function absoluteUrl(lang: Locale, path = '/'): string {
  const clean = path === '/' ? '' : path
  return `${SITE_URL}/${lang}${clean}`
}

/**
 * canonical + hreflang für eine lokalisierte Seite.
 *
 * `x-default` zeigt auf die deutsche Fassung: das ist die Variante, die ein
 * Besucher ohne passende Sprachpräferenz bekommen soll (Münchner Venue).
 */
export function buildAlternates(lang: Locale, path = '/'): Metadata['alternates'] {
  const languages: Record<string, string> = {}
  for (const locale of LOCALES) {
    languages[locale] = absoluteUrl(locale, path)
  }
  languages['x-default'] = absoluteUrl(DEFAULT_LOCALE, path)

  return { canonical: absoluteUrl(lang, path), languages }
}

type OgImage = { url: string; width?: number; height?: number; alt?: string }

/**
 * Vollständige Metadaten für eine lokalisierte Seite.
 *
 * `noindex` für Seiten, die es nur aus technischen Gründen gibt
 * (Bestätigungs- und Abmeldeseiten) — die gehören nicht in den Index.
 */
export function pageMetadata({
  lang,
  path,
  title,
  description,
  images,
  keywords,
  noindex = false,
  article,
}: {
  lang: Locale
  path: string
  title: string
  description: string
  images?: OgImage[]
  keywords?: string[]
  noindex?: boolean
  /**
   * Für Artikel und Newsletter-Ausgaben: setzt `og:type` auf `article` und
   * ergänzt Datum und Autor. Facebook, LinkedIn und Slack zeigen darauf
   * basierend das Veröffentlichungsdatum in der Vorschau an.
   */
  article?: { publishedTime?: string; authors?: string[] }
}): Metadata {
  const url = absoluteUrl(lang, path)
  const ogImages = images && images.length > 0 ? images : [DEFAULT_OG_IMAGE]
  const otherLocales = LOCALES.filter((l) => l !== lang).map((l) => OG_LOCALE[l])

  return {
    title,
    description,
    ...(keywords && keywords.length > 0 ? { keywords } : {}),
    alternates: buildAlternates(lang, path),
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      ...(article
        ? {
            type: 'article' as const,
            ...(article.publishedTime ? { publishedTime: article.publishedTime } : {}),
            ...(article.authors && article.authors.length > 0
              ? { authors: article.authors }
              : {}),
          }
        : { type: 'website' as const }),
      siteName: SITE_NAME,
      locale: OG_LOCALE[lang],
      alternateLocale: otherLocales,
      url,
      title,
      description,
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImages.map((image) => image.url),
    },
  }
}
