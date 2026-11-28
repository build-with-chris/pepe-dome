/**
 * Bausteine, aus denen ein Vertrags-PDF besteht.
 *
 * Eine Vorlage (vorlage-miete.ts, vorlage-angebot.ts) macht aus Formularwerten
 * eine Liste dieser Bausteine. pdf.tsx zeichnet die Liste, ohne zu wissen, was
 * darin steht. Dazwischen liegt nur dieses Format.
 *
 * Das Format wird auch gespeichert: Beim Wechsel auf „verschickt“ friert die
 * API das fertige Dokument als JSON in `contracts.snapshot` ein. Deshalb stehen
 * hier nur einfache Daten, keine Funktionen und keine Klassen. Wer einen
 * Baustein ändert, muss alte Snapshots weiter zeichnen können: Felder ergänzen
 * geht, Felder umbenennen oder entfernen nicht.
 */

/** Ein Stück Text mit eigener Auszeichnung innerhalb eines Absatzes. */
export type Lauf = {
  text: string
  fett?: boolean
  durchgestrichen?: boolean
  grau?: boolean
}

/** Fließtext: einfacher String oder eine Folge aus Strings und Läufen. */
export type Inhalt = string | Lauf | Array<string | Lauf>

export type Baustein =
  /** Dokumentkopf. Mit Logo steht der Titel links, ohne Logo mittig. */
  | { art: 'kopf'; titel: string; untertitel?: string; logo?: boolean }
  | { art: 'ueberschrift'; text: string; ebene?: 2 | 3 }
  | { art: 'absatz'; text: Inhalt; klein?: boolean }
  | { art: 'liste'; punkte: Inhalt[] }
  | {
      art: 'tabelle'
      zeilen: Inhalt[][]
      /** Spaltenbreiten in Prozent. Ohne Angabe gleich breit. */
      breiten?: number[]
      /** Trennlinie zwischen den Zeilen. */
      linien?: boolean
      /** Letzte Spalte rechtsbündig, für Beträge. */
      rechts?: boolean
      /** Zeilen (ab 0), die farbig hinterlegt werden. */
      betont?: number[]
      /** Kästchen zum Ankreuzen vor jeder Zeile. */
      ankreuzen?: boolean
      /** Enger gesetzt, für Angaben wie die Bankverbindung. */
      kompakt?: boolean
    }
  | { art: 'hinweis'; text: Inhalt }
  /** Unterschriftsfelder. Jede Zeile hat ein oder zwei Felder, der Text steht unter der Linie. */
  | { art: 'unterschriften'; felder: string[][] }
  /** Zeile zum Ausfüllen von Hand: Text und Linien wechseln sich ab. */
  | { art: 'ausfuellen'; teile: Array<string | { linie: number }> }
  | { art: 'abstand'; hoehe: number }
  /** Hält Bausteine auf einer Seite zusammen, etwa ein Unterschriftsfeld mit seiner Überschrift. */
  | { art: 'gruppe'; bausteine: Baustein[] }

export type Dokument = {
  /** Titel in den PDF-Eigenschaften und Grundlage für den Dateinamen. */
  titel: string
  /** Überschriften und Kopflinie im Blau des Logos. */
  akzent?: boolean
  /** Eine Zeile, die auf jeder Seite unten steht. */
  fuss?: string
  bausteine: Baustein[]
}

export function fett(text: string): Lauf {
  return { text, fett: true }
}

export function grau(text: string): Lauf {
  return { text, grau: true }
}

/** Linie zum Ausfüllen. Der Wert ist der Anteil an der freien Breite. */
export function linie(anteil = 1): { linie: number } {
  return { linie: anteil }
}

function inhaltAlsText(inhalt: Inhalt): string {
  const teile = Array.isArray(inhalt) ? inhalt : [inhalt]
  return teile.map((teil) => (typeof teil === 'string' ? teil : teil.text)).join('')
}

function bausteinAlsText(baustein: Baustein): string[] {
  switch (baustein.art) {
    case 'kopf':
      return [baustein.titel, baustein.untertitel ?? '']
    case 'ueberschrift':
      return [baustein.text]
    case 'absatz':
    case 'hinweis':
      return [inhaltAlsText(baustein.text)]
    case 'liste':
      return baustein.punkte.map((punkt) => `• ${inhaltAlsText(punkt)}`)
    case 'tabelle':
      return baustein.zeilen.map((zeile) => zeile.map(inhaltAlsText).join(' | '))
    case 'unterschriften':
      return baustein.felder.flat().map((feld) => `[Unterschrift] ${feld.replace(/\n/g, ', ')}`)
    case 'ausfuellen':
      return [baustein.teile.map((teil) => (typeof teil === 'string' ? teil : '____')).join(' ')]
    case 'abstand':
      return []
    case 'gruppe':
      return baustein.bausteine.flatMap(bausteinAlsText)
  }
}

/**
 * Das Dokument als reiner Text, eine Zeile je Absatz, Listenpunkt oder
 * Tabellenzeile. Damit prüfen die Tests, ob ein Abschnitt oder eine Regel
 * fehlt, ohne ein PDF auslesen zu müssen.
 */
export function dokumentAlsText(dokument: Dokument): string {
  return dokument.bausteine
    .flatMap(bausteinAlsText)
    .filter(Boolean)
    .join('\n')
}

/** Überschriften der obersten Ebene, in der Reihenfolge des Dokuments. */
export function ueberschriften(dokument: Dokument): string[] {
  const sammeln = (bausteine: Baustein[]): string[] =>
    bausteine.flatMap((baustein) => {
      if (baustein.art === 'gruppe') return sammeln(baustein.bausteine)
      if (baustein.art === 'ueberschrift' && (baustein.ebene ?? 2) === 2) return [baustein.text]
      return []
    })
  return sammeln(dokument.bausteine)
}

const ARTEN = new Set<Baustein['art']>([
  'kopf',
  'ueberschrift',
  'absatz',
  'liste',
  'tabelle',
  'hinweis',
  'unterschriften',
  'ausfuellen',
  'abstand',
  'gruppe',
])

/**
 * Grobe Prüfung für Daten aus der Datenbank. Ein Snapshot wurde von dieser
 * Anwendung geschrieben, die Prüfung fängt nur den Fall ab, dass in der Spalte
 * etwas ganz anderes liegt.
 */
export function istDokument(wert: unknown): wert is Dokument {
  if (!wert || typeof wert !== 'object') return false
  const kandidat = wert as { titel?: unknown; bausteine?: unknown }
  if (typeof kandidat.titel !== 'string' || !Array.isArray(kandidat.bausteine)) return false
  return kandidat.bausteine.every(
    (baustein) =>
      baustein && typeof baustein === 'object' && ARTEN.has((baustein as Baustein).art)
  )
}

/** Mehr Text als das passt nicht mehr sicher zusammen mit den Unterschriften auf eine Seite. */
const SCHLUSS_HOECHSTENS = 1500

/**
 * Hängt den Schluss eines Dokuments (die Unterschriften) so an, dass er nie
 * allein auf einer Seite steht: Der letzte Abschnitt davor, von seiner
 * Überschrift an, wird mit dem Schluss zu einer Gruppe zusammengefasst. Eine
 * Seite, auf der nur Unterschriften stehen, sagt nicht, was unterschrieben wird.
 *
 * Ist der letzte Abschnitt sehr lang, etwa eine ausführliche Sonderabsprache,
 * bleibt es beim einfachen Anhängen. Eine Gruppe, die größer ist als eine
 * Seite, ließe sich nicht mehr umbrechen.
 */
export function mitSchluss(bausteine: Baustein[], schluss: Baustein): Baustein[] {
  // Steht davor schon eine Gruppe, etwa die Erklärung einer Aufsichtsperson,
  // bleibt sie als Ganzes beim Schluss. Sonst zählt die letzte Überschrift.
  let ab = bausteine.length - 1
  if (ab < 0) return [schluss]
  if (bausteine[ab].art !== 'gruppe') {
    while (ab >= 0 && bausteine[ab].art !== 'ueberschrift') ab -= 1
  }
  if (ab < 0) return [...bausteine, schluss]

  const ende = bausteine.slice(ab)
  const laenge = ende.flatMap(bausteinAlsText).join('').length
  if (laenge > SCHLUSS_HOECHSTENS) return [...bausteine, schluss]

  return [...bausteine.slice(0, ab), { art: 'gruppe', bausteine: [...ende, schluss] }]
}
