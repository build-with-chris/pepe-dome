/**
 * Kanal-Kit: Hashtags
 *
 * Fester Sockel plus Kategorie. Kein Zufall, keine Generierung: dieselbe
 * Kategorie soll jedes Mal dieselben Tags ergeben, sonst zerfällt die eigene
 * Reichweite auf ein Dutzend Schreibweisen.
 *
 * Die Tags stehen absichtlich getrennt von der Caption (siehe channels.ts),
 * weil viele Redaktionen sie lieber in den ersten Kommentar setzen.
 */

/** Immer dabei: Ort und Haus. Danach sucht, wer in der Nähe etwas erleben will. */
const BASE = ['#pepedome', '#münchen', '#ostpark']

const BY_CATEGORY: Record<string, string[]> = {
  SHOW: ['#zirkus', '#varieté', '#livekultur'],
  PREMIERE: ['#premiere', '#zirkus', '#livekultur'],
  FESTIVAL: ['#festival', '#zirkus', '#kulturmünchen'],
  WORKSHOP: ['#workshop', '#akrobatik', '#lernen'],
  OPEN_TRAINING: ['#training', '#akrobatik', '#offenestraining'],
  KINDERTRAINING: ['#kindertraining', '#akrobatik', '#münchenmitkindern'],
  OPEN_AIR: ['#openair', '#sommerimostpark', '#livekultur'],
  EVENT: ['#veranstaltung', '#kulturmünchen'],
  // BUSINESS fehlt bewusst: Firmenvermietungen bekommen gar kein Kit.
}

/**
 * Hashtags für eine Event-Kategorie.
 *
 * Unbekannte Kategorien liefern den Sockel. Das ist richtig so: lieber drei
 * passende Tags als ein erfundener vierter.
 */
export function hashtagsFor(category: string | null | undefined): string[] {
  const extra = category ? BY_CATEGORY[category] ?? [] : []
  return [...BASE, ...extra]
}

/** Als eine Zeile zum Kopieren. */
export function hashtagLine(category: string | null | undefined): string {
  return hashtagsFor(category).join(' ')
}

/**
 * Dieselben Begriffe ohne Rautezeichen.
 *
 * Rausgegangen hat ein echtes Tag-Feld. Ein "#" davor wäre dort Teil des
 * Schlagworts und würde als eigener, falscher Tag angelegt.
 */
export function tagList(category: string | null | undefined): string[] {
  return hashtagsFor(category).map((tag) => tag.replace(/^#/, ''))
}
