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
 * Jeder Termin mit Haken bekommt sein Foto: der erste als Aufmacher, alle
 * weiteren als Karte. Ohne Haken wird er zur Terminzeile. So entscheidet
 * die Redaktion selbst, welche Fotos in der Mail stehen, und ein doppeltes
 * Showfoto lässt sich abwählen.
 *
 * fotosBegrenzt gilt für Ausgaben, die schon verschickt sind oder gerade
 * rausgehen. Sie bleiben bei der alten Regel (nur die ersten drei Termine
 * mit Foto), damit das Archiv genau die verschickte Mail zeigt.
 *
 * imageIndex ist die Zahl der Termine mit Foto davor.
 */
export function emphasisForEvent(
  imageIndex: number,
  showImage: boolean,
  fotosBegrenzt = false
): ItemEmphasis {
  if (!showImage) return 'compact'
  if (fotosBegrenzt) return emphasisForIndex(imageIndex)
  return imageIndex === 0 ? 'lead' : 'feature'
}

/** Verschickte und laufende Ausgaben behalten die alte Begrenzung auf drei Fotos. */
export function fotosBegrenztFuer(status: string | undefined): boolean {
  return status === 'SENT' || status === 'SENDING'
}
