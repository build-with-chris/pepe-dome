/**
 * Trainingsseite nach einer Kursänderung neu erzeugen.
 *
 * Ohne das würde die Orga speichern, die Seite aufrufen, den alten Stand
 * sehen und noch dreimal speichern. Deshalb wird hier gezielt neu erzeugt
 * statt nur auf den Zeittakt der Seite zu warten.
 *
 * Beide Sprachvarianten einzeln: die Seite liegt unter /[lang]/training, und
 * ein revalidatePath auf den dynamischen Pfad hat in unserem Aufbau nur die
 * zuletzt erzeugte Variante getroffen. Zwei explizite Aufrufe sind
 * langweiliger und funktionieren.
 *
 * Fehler werden absichtlich verschluckt: die Kursänderung ist zu diesem
 * Zeitpunkt gespeichert. Wenn nur die Neuerzeugung klemmt, darf das nicht
 * als fehlgeschlagenes Speichern zurückgemeldet werden — die Seite zieht
 * dann eben beim nächsten Zeittakt nach.
 */

import { revalidatePath } from 'next/cache'
import { LOCALES } from '@/i18n/config'

export async function revalidateTraining(): Promise<void> {
  for (const locale of LOCALES) {
    try {
      revalidatePath(`/${locale}/training`)
    } catch (error) {
      console.error(`revalidatePath für /${locale}/training fehlgeschlagen:`, error)
    }
  }
}
