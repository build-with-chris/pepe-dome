/**
 * Bildformat eines Artists: quadratisch, quer oder hoch.
 *
 * Das Format wird im Admin pro Artist gewählt. Beim Hochladen schneidet das
 * Formular das Foto in genau diesem Seitenverhältnis zu, und die Eventseite
 * zeigt den Kasten in derselben Form. So passt der gewählte Ausschnitt
 * immer, und es wird später nichts mehr unerwartet abgeschnitten.
 *
 * Liegt getrennt von artist-validation.ts, weil Client-Komponenten es ohne
 * zod brauchen.
 */

export const ARTIST_BILDFORMATE = ['square', 'landscape', 'portrait'] as const

export type ArtistBildformat = (typeof ARTIST_BILDFORMATE)[number]

export const STANDARD_BILDFORMAT: ArtistBildformat = 'square'

export const BILDFORMAT_INFO: Record<
  ArtistBildformat,
  { label: string; verhaeltnis: string; seitenverhaeltnis: number }
> = {
  square: { label: 'Quadratisch', verhaeltnis: '1:1', seitenverhaeltnis: 1 },
  landscape: { label: 'Querformat', verhaeltnis: '4:3', seitenverhaeltnis: 4 / 3 },
  portrait: { label: 'Hochformat', verhaeltnis: '3:4', seitenverhaeltnis: 3 / 4 },
}

/** Unbekannte oder fehlende Werte aus der Datenbank werden quadratisch. */
export function alsBildformat(wert: unknown): ArtistBildformat {
  return ARTIST_BILDFORMATE.includes(wert as ArtistBildformat)
    ? (wert as ArtistBildformat)
    : STANDARD_BILDFORMAT
}
