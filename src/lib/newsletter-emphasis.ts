/**
 * Gewichtung der Termine im Newsletter.
 *
 * Eigene Datei ohne Datenbankzugriff: Der Editor im Browser zeigt mit
 * derselben Regel an, welcher Termin ein Foto bekommt, und darf dafür
 * Prisma nicht mitladen.
 */

/**
 * Wie prominent ein Beitrag dargestellt wird.
 *
 * lead    = Aufmacher: großes Bild, ausführlicher Text, primärer Button
 * feature = mittlere Karte: Bild, Kurztext, sekundärer Button
 * compact = Terminzeile: Datum, Titel, Textlink, kein Bild
 */
export type ItemEmphasis = 'lead' | 'feature' | 'compact'

/**
 * Gewichtung nach Position.
 *
 * Der erste Termin im Newsletter ist der Aufmacher, die nächsten beiden
 * bekommen eine mittlere Karte, alles Weitere wird zur Terminzeile. Die
 * Termine stehen in der Reihenfolge, in der sie stattfinden, siehe
 * chronologischeReihenfolge. Der früheste ist damit der Aufmacher.
 */
export function emphasisForIndex(index: number): ItemEmphasis {
  if (index === 0) return 'lead'
  if (index <= 2) return 'feature'
  return 'compact'
}

/**
 * Gewichtung, wenn die Redaktion Fotos abwählen kann.
 *
 * Gezählt werden nur die Termine mit Foto. Ein Termin ohne Foto wird zur
 * Terminzeile und nimmt keinen Platz mit Bild weg, der nächste Termin rückt
 * nach. So verschwindet ein doppeltes Showfoto, ohne dass ein anderes
 * untergeht. Sind alle Fotos an, ist das Ergebnis dasselbe wie bisher.
 *
 * imageIndex ist die Zahl der Termine mit Foto davor.
 */
export function emphasisForEvent(imageIndex: number, showImage: boolean): ItemEmphasis {
  return showImage ? emphasisForIndex(imageIndex) : 'compact'
}
