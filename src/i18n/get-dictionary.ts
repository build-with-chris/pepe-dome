import 'server-only'
import type { Locale } from './config'

/**
 * Lazy-imports the JSON dictionary at request time on the server.
 *
 * Keeps client-bundles slim: dictionaries werden nicht in den
 * Client-Bundle gebacken, sondern serverseitig geladen und über Props
 * an Client-Components (z.B. SignupForm) weitergegeben.
 */
const dictionaries = {
  de: () => import('../dictionaries/de.json').then((m) => m.default),
  en: () => import('../dictionaries/en.json').then((m) => m.default),
} as const

export async function getDictionary(locale: Locale) {
  return dictionaries[locale]()
}

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>
