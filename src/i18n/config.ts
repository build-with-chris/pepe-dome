/**
 * i18n routing config
 *
 * URLs sind `/de/...` und `/en/...`. `/` redirected via middleware auf die
 * Default-Locale (oder die per `Accept-Language` erkannte Sprache).
 *
 * LOCALIZED_PATHS ist die *einzige* Liste der lokalisierten Seiten. Sie
 * steuert drei Dinge gleichzeitig, die vorher auseinanderlaufen konnten:
 *
 *   1. localizedHref()  — welche Links einen /de- bzw. /en-Prefix bekommen
 *   2. middleware.ts    — welche Root-Pfade auf die Locale-URL umgeleitet werden
 *   3. sitemap.ts       — welche URLs an Google gemeldet werden
 *
 * Vorher gab es die Liste zweimal (hier und in der Middleware) und die beiden
 * Fassungen waren nicht deckungsgleich: `/cafe` und `/spenden` standen nur hier.
 * Folge: die Sitemap meldete `/cafe`, es gab aber weder eine Seite unter diesem
 * Pfad noch eine Weiterleitung — ein 404 mitten im Sitemap-Index. Eine neue
 * Seite wird deshalb ausschliesslich hier eingetragen.
 */

export const LOCALES = ['de', 'en'] as const
export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'de'

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value)
}

/**
 * Alle Seiten, die unter /[lang]/... liegen.
 *
 * Reihenfolge = Reihenfolge in der Sitemap, deshalb nach Wichtigkeit sortiert.
 * Sub-Routen (z.B. /events/holi-poldini) sind mit abgedeckt, die Middleware
 * matcht auf Prefix.
 */
export const LOCALIZED_PATHS = [
  '/',
  '/events',
  '/galerie',
  '/news',
  '/training',
  '/cafe',
  '/about',
  '/business',
  '/contact',
  '/newsletter',
  '/spenden',
  '/datenschutz',
  '/impressum',
  '/agb',
] as const

export type LocalizedPath = (typeof LOCALIZED_PATHS)[number]

const LOCALIZED_PATH_SET: ReadonlySet<string> = new Set(LOCALIZED_PATHS)

/** @deprecated Alias auf LOCALIZED_PATHS — nur noch für Altcode. */
export const MIGRATED_PATHS = LOCALIZED_PATH_SET

/**
 * Trifft die Pfad-Wurzel auf eine lokalisierte Seite?
 *
 * '/events'              → '/events'   (exakt)
 * '/events/holi-poldini' → '/events'   (Prefix, Sub-Routen mit abgedeckt)
 * '/gibtsnicht'          → null
 */
export function matchLocalizedPath(pathname: string): string | null {
  if (LOCALIZED_PATH_SET.has(pathname)) return pathname
  for (const root of LOCALIZED_PATHS) {
    if (root === '/') continue
    if (pathname === root || pathname.startsWith(root + '/')) return root
  }
  return null
}

/**
 * Liefert die korrekte URL für einen logischen Pfad — lokalisiert,
 * falls die Seite lokalisiert existiert, sonst der Root-Pfad.
 *
 * Beispiele:
 *   localizedHref('de', '/')        → '/de'
 *   localizedHref('en', '/events')  → '/en/events'
 *   localizedHref('de', '/unknown') → '/unknown'
 */
export function localizedHref(lang: Locale, path: string): string {
  if (!LOCALIZED_PATH_SET.has(path)) return path
  if (path === '/') return `/${lang}`
  return `/${lang}${path}`
}
