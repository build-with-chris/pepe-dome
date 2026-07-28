/**
 * Leseseite des Kursprogramms für die öffentliche Trainingsseite.
 *
 * Liefert beide Sichten fertig gruppiert: den Katalog (ein Eintrag pro Kurs)
 * und den Wochenplan (sieben Tage). Die Gruppierung lag vorher in der
 * Client-Komponente, weil die Kursdaten dort tagweise und mehrfach vorlagen.
 * In der Datenbank ist ein Kurs eine Zeile mit mehreren Slots, also gehört
 * das Zusammenbauen hierher.
 *
 * ACHTUNG, absichtlich kein try/catch:
 * Schlägt die Abfrage fehl, wirft diese Datei. Das ist gewollt. Die
 * Trainingsseite läuft über ISR — bricht die Neuerzeugung ab, liefert Next
 * weiter die zuletzt erfolgreich erzeugte Seite aus. Genau das ist die
 * Zusage „bei DB-Ausfall den letzten guten Stand zeigen".
 * Ein hilfsbereites try/catch, das ein leeres Programm zurückgibt, würde
 * diese Zusage still aushebeln: Next hielte die leere Ausgabe für ein
 * gültiges Ergebnis und würde einen leeren Kursplan zwischenspeichern.
 * Wer hier Fehlerbehandlung einbaut, nimmt der Seite ihren Notlauf.
 */

import { prisma } from './prisma'
import { ContentStatus } from '@prisma/client'
import type { Course, CourseSlot as DbSlot, ScheduleNote } from '@prisma/client'
import {
  isTarget,
  sortSlots,
  type Kurs,
  type KursBild,
  type Kursprogramm,
  type Slot,
  type Tag,
  type TagEintrag,
} from './course-types'

/** inhalte liegt als Json in der DB. Alles, was kein String-Array ist, fliegt raus. */
function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((entry): entry is string => typeof entry === 'string')
}

/**
 * Bilder liegen als Json in der DB. Ein Eintrag ohne url ist unbrauchbar und
 * wuerde als kaputtes Bild auf der Seite landen, also fliegt er raus. Ein
 * fehlender alt-Text wird zu einem leeren String statt undefined, damit das
 * Attribut immer gesetzt ist.
 */
function toBilder(value: unknown): KursBild[] {
  if (!Array.isArray(value)) return []
  return value.flatMap((entry) => {
    if (!entry || typeof entry !== 'object') return []
    const bild = entry as Record<string, unknown>
    const url = typeof bild.url === 'string' ? bild.url.trim() : ''
    if (!url) return []
    return [{ url, alt: typeof bild.alt === 'string' ? bild.alt : '' }]
  })
}

/**
 * Die Ergebnistypen werden hier von Hand angeschrieben, weil der exportierte
 * `prisma` projektweit als `any` herauskommt: src/lib/prisma.ts gibt je nach
 * DATABASE_URL einen Mock (`as any`) oder einen echten Client zurück, und
 * TypeScript vereinigt das zu `any`. Ohne diese Annotation wäre das Mapping
 * unten ungeprüft — also genau dort blind, wo ein Feldtippfehler still zu
 * `undefined` auf der Website würde.
 */
type CourseRow = Course & { slots: DbSlot[] }

export async function getKursprogramm(): Promise<Kursprogramm> {
  const [rows, notes] = (await Promise.all([
    prisma.course.findMany({
      where: { status: ContentStatus.PUBLISHED },
      include: { slots: true },
      orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
    }),
    prisma.scheduleNote.findMany(),
  ])) as [CourseRow[], ScheduleNote[]]

  const kurse: Kurs[] = rows
    // Ein unbekannter target-Wert kaeme nur durch einen Schemabruch zustande.
    // Dann lieber den Kurs auslassen als die ganze Seite mit einem Farbfehler
    // rendern.
    .filter((row) => isTarget(row.target))
    .map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      sub: row.sub,
      description: row.description,
      inhalte: toStringArray(row.inhalte),
      alter: row.alter,
      fuerWen: row.fuerWen,
      target: row.target as Kurs['target'],
      trainer: row.trainer,
      bookingUrl: row.bookingUrl,
      bookingLabel: row.bookingLabel,
      bookingNote: row.bookingNote,
      bilder: toBilder(row.images),
      slots: sortSlots(
        row.slots.map(
          (slot): Slot => ({
            weekday: slot.weekday,
            startTime: slot.startTime,
            endTime: slot.endTime,
          })
        )
      ),
    }))

  const notizProTag = new Map(notes.map((note) => [note.weekday, note.text.trim()]))

  // Immer alle sieben Tage, auch die leeren. Ein Tag ohne Kurse ist eine
  // Aussage („Sonntag: keine Kurse"), kein fehlender Datensatz.
  const woche: Tag[] = Array.from({ length: 7 }, (_, index) => {
    const weekday = index + 1
    const eintraege: TagEintrag[] = []
    for (const kurs of kurse) {
      for (const slot of kurs.slots) {
        if (slot.weekday === weekday) eintraege.push({ kurs, slot })
      }
    }
    eintraege.sort((a, b) => a.slot.startTime.localeCompare(b.slot.startTime))

    const notiz = notizProTag.get(weekday)
    return { weekday, note: notiz ? notiz : null, eintraege }
  })

  return { kurse, woche }
}

/**
 * Einzelner Kurs über den Slug, für geteilte Links (?kurs=<slug>).
 * Findet auch pausierte Kurse nicht — ein pausierter Kurs soll über einen
 * alten Link nicht doch wieder auftauchen.
 */
export async function getKursBySlug(slug: string): Promise<Kurs | null> {
  const programm = await getKursprogramm()
  return programm.kurse.find((kurs) => kurs.slug === slug) ?? null
}
