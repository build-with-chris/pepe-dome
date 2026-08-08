/**
 * Pfadumbau beim Sprachwechsel.
 *
 * Eigene Datei, weil die Regel eine Zeile Code und drei Zeilen Begründung ist:
 * Die Query muss mitkommen. Wer über eine Anzeige kommt, trägt utm_source und
 * Verwandte in der URL. Der Umschalter baute den Pfad vorher allein aus
 * usePathname(), und das enthält die Query nicht. Ein Klick auf EN machte den
 * Besuch damit für die Auswertung anonym.
 */

/** Tauscht das erste Pfadsegment gegen die Zielsprache und hängt die Query wieder an. */
export function switchLocalePath(
  pathname: string,
  search: string | null | undefined,
  lang: string
): string {
  const segments = pathname.split('/')
  segments[1] = lang
  const pfad = segments.join('/') || `/${lang}`

  const query = (search ?? '').replace(/^\?/, '')
  return query ? `${pfad}?${query}` : pfad
}
