/**
 * Öffentliche Seiten nach einer Änderung im Admin neu erzeugen.
 *
 * Startseite, Termine und News werden zwischengespeichert (ISR) und ziehen
 * von sich aus nach spätestens einer Minute nach. Für die Redaktion ist eine
 * Minute aber lang: wer speichert und die Seite aufruft, will die Änderung
 * sehen und nicht den alten Stand. Deshalb wird hier nach jedem Speichern
 * gezielt verworfen, was im Zwischenspeicher liegt.
 *
 * Verworfen wird alles unterhalb des Root-Layouts, nicht nur die eine Seite.
 * Ein Termin steht auf der Startseite, in der Monatsliste, auf seiner eigenen
 * Seite, im JSON-LD und in beiden Sprachen. Diese Liste von Hand zu pflegen
 * ginge so lange gut, bis jemand eine neue Stelle einbaut und sie hier
 * vergisst. Der Preis ist gering: neu erzeugt wird erst beim nächsten Aufruf
 * der jeweiligen Seite, und gespeichert wird im Admin ein paarmal am Tag.
 *
 * Fehler werden verschluckt, aus demselben Grund wie in
 * revalidate-training.ts: Die Änderung ist zu diesem Zeitpunkt gespeichert.
 * Klemmt nur die Neuerzeugung, zieht die Seite beim nächsten Zeittakt nach.
 */

import { revalidatePath } from 'next/cache'

export async function revalidateInhalte(): Promise<void> {
  try {
    revalidatePath('/', 'layout')
  } catch (error) {
    console.error('revalidatePath für die öffentlichen Seiten fehlgeschlagen:', error)
  }
}
