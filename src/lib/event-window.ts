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

/**
 * Das Datum, wie es auf einer Terminkarte steht.
 *
 * Auf den Karten stand bisher nur der erste Tag. Beim "Dome Crew
 * Mitmachzirkus" las sich das als "15. Aug. 2026", obwohl er die ganze Woche
 * laeuft. Die Detailseite zeigte den Zeitraum, die Karten nicht.
 *
 * Faellt Start und Ende auf denselben Tag oder fehlt ein Ende, kommt genau die
 * alte Ausgabe heraus. Sonst steht der Monat nur einmal da, wenn er sich nicht
 * aendert: "15. bis 21. Aug. 2026", ueber die Monatsgrenze hinweg dagegen
 * "30. Aug. 2026 bis 3. Sept. 2026".
 *
 * Kein Gedankenstrich, sondern "bis". Der Strich ist an dieser Stelle
 * schlechter zu lesen und passt nicht zur uebrigen Sprache der Seite.
 *
 * timeZone: 'UTC' ist Absicht. Die Termine liegen als Mitternacht UTC in der
 * Datenbank. Ohne die Angabe rechnet der Browser in die Zeitzone des Besuchers
 * um, und wer westlich von Greenwich sitzt, sah den Termin einen Tag zu frueh.
 */
export function formatEventDateRange(
  event: { date: string | Date; endDate?: string | Date | null },
  locale: string
): string {
  const optionen: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }
  const start = new Date(event.date)
  const ende = endeVon(event)
  const voll = (d: Date) => d.toLocaleDateString(locale, optionen)

  if (ende <= start) return voll(start)

  const englisch = locale.startsWith('en')
  const bis = englisch ? 'to' : 'bis'

  const gleicherMonat =
    start.getUTCFullYear() === ende.getUTCFullYear() &&
    start.getUTCMonth() === ende.getUTCMonth()

  if (gleicherMonat) {
    if (start.getUTCDate() === ende.getUTCDate()) return voll(start)
    // Nur im Deutschen die Tageszahl allein voranstellen. Dort steht der Tag
    // vorn, "15. bis 21. Aug. 2026" liest sich also durch. Im Englischen kommt
    // der Monat zuerst, aus derselben Regel wuerde "15 to Aug 21, 2026" und
    // das ergibt keinen Satz. Dort stehen lieber beide Seiten voll da.
    if (!englisch) {
      const tag = start.toLocaleDateString(locale, { day: 'numeric', timeZone: 'UTC' })
      return `${tag}. ${bis} ${voll(ende)}`
    }
  }

  return `${voll(start)} ${bis} ${voll(ende)}`
}
