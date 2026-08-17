/**
 * Wann ist ein Termin vorbei?
 *
 * Bis hierher hiess die Antwort ueberall schlicht `date < heute`. Bei einem
 * eintaegigen Termin stimmt das. Bei einem mehrtaegigen nicht: Der "Dome Crew
 * Mitmachzirkus" lief vom 15. bis zum 21. August und verschwand am 16. von der
 * Terminseite, weil sein erster Tag vorbei war. Sieben Tage Programm, sechs
 * davon unsichtbar.
 *
 * Massgeblich ist deshalb das Ende, und das ist `endDate`, wo eins gepflegt
 * ist, sonst `date`. Die Regel steht hier statt an vier Stellen, weil sie
 * genau einmal gelten soll: in der Monatsliste, in deren Filter im Browser, im
 * Startmonat der Seite und in den kommenden Terminen der Startseite.
 *
 * Bewusst nicht betroffen ist der Termin-Hinweis im Hero der Startseite
 * (src/lib/hero-teaser.ts). Der beantwortet "was kommt als Naechstes" und
 * waehlt darum weiter nach Beginn aus. Ein laufender Termin wuerde dort sonst
 * unter der Ueberschrift "Naechster Termin" mit einem Datum von gestern
 * stehen.
 *
 * Stichtag ist ueberall Mitternacht des laufenden Tages, nie die aktuelle
 * Uhrzeit. Sonst faellt ein Termin um 20 Uhr schon am Vormittag heraus.
 */

/** Der Tagesbeginn von heute, der Stichtag aller Vergleiche hier. */
export function tagesbeginn(now: Date = new Date()): Date {
  const start = new Date(now)
  start.setHours(0, 0, 0, 0)
  return start
}

/** Das Feld, an dem das Ende haengt. Ohne `endDate` ist der Termin eintaegig. */
export function endeVon(event: { date: string | Date; endDate?: string | Date | null }): Date {
  return new Date(event.endDate ?? event.date)
}

/**
 * Laeuft der Termin noch, oder steht er noch an?
 *
 * Der letzte Tag zaehlt voll mit: Ein Termin, der am 21. endet, ist am 21.
 * sichtbar und erst am 22. weg.
 */
export function laeuftNoch(
  event: { date: string | Date; endDate?: string | Date | null },
  stichtag: Date = tagesbeginn()
): boolean {
  return endeVon(event) >= stichtag
}

/**
 * Prisma-Bedingung fuer "noch nicht vorbei".
 *
 * `endDate: null` muss ausdruecklich dastehen. Ein `gte` auf einer leeren
 * Spalte trifft in SQL nichts, die eintaegigen Termine waeren also alle
 * verschwunden.
 */
export function nichtVorbeiFilter(stichtag: Date = tagesbeginn()) {
  return {
    OR: [
      { endDate: { gte: stichtag } },
      { endDate: null, date: { gte: stichtag } },
    ],
  }
}

/**
 * Prisma-Bedingung fuer "ragt in diesen Monat hinein".
 *
 * Ueberschneidung, nicht Beginn: ein Termin vom 30. August bis 3. September
 * gehoert in beide Monate. Vorher stand er nur im August und fehlte dem, der
 * im September nachschaut.
 */
export function imMonatFilter(monatsBeginn: Date, monatsEnde: Date) {
  return {
    date: { lte: monatsEnde },
    OR: [
      { endDate: { gte: monatsBeginn } },
      { endDate: null, date: { gte: monatsBeginn } },
    ],
  }
}
