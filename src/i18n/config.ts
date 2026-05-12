/**
 * i18n routing config
 *
 * URLs sind `/de/...` und `/en/...`. `/` redirected via middleware auf die
 * Default-Locale (oder die per `Accept-Language` erkannte Sprache).
 *
 * Migrations-Tracking: MIGRATED_PATHS listet alle Seiten, die bereits
 * unter [lang] liegen. Nur für diese Pfade generiert `localizedHref()`
 * lokalisierte URLs — alle anderen bleiben (noch) auf dem Root-Pfad.
 * So können wir Seite für Seite migrieren, ohne 404s zu produzieren.
 */

export const LOCALES = ['de', 'en'] as const
export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'de'

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value)
}

/**
 * Pfade, die bereits ins [lang]-Routing verschoben wurden.
 * Initial: nur Home. Erweitern, sobald weitere Seiten migriert sind.
 */
export const MIGRATED_PATHS: ReadonlySet<string> = new Set([
  '/',
  '/training',
  '/events',
  '/about',
])

/**
 * Liefert die korrekte URL für einen logischen Pfad — lokalisiert,
 * falls die Seite migriert ist, sonst der Root-Pfad.
 *
 * Beispiele (lang = 'de'):
 *   localizedHref('de', '/')         → '/de'
 *   localizedHref('de', '/training') → '/training' (noch nicht migriert)
 *   localizedHref('en', '/')         → '/en'
 */
export function localizedHref(lang: Locale, path: string): string {
  if (!MIGRATED_PATHS.has(path)) return path
  if (path === '/') return `/${lang}`
  return `/${lang}${path}`
}
