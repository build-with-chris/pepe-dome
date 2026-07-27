/**
 * Trailer zu einem Event
 *
 * Das Feld `trailerUrl` (prisma/schema.prisma) nimmt zwei Dinge entgegen:
 *
 *   1. einen Link zu YouTube oder Vimeo, wie ihn die Redaktion aus der
 *      Adresszeile kopiert
 *   2. einen Pfad auf eine Datei im Projekt, z.B. "/videos/showreel.mp4"
 *
 * Beides muss erlaubt sein: Gastspiele bringen ihren Trailer meist als
 * YouTube-Link mit, unsere eigenen Aufnahmen liegen dagegen als MP4 im Repo und
 * laufen dann ohne fremden Anbieter und ohne Zustimmungsklick.
 *
 * Diese Datei ist die einzige Stelle, die entscheidet, was hinter einer Eingabe
 * steckt. Das Admin-Formular prüft damit vor dem Speichern, die Website baut
 * damit den Player. Ohne gemeinsame Quelle würde die Redaktion einen Link
 * speichern können, den die Website danach stumm ignoriert.
 *
 * ── Warum eine Weissliste und kein "irgendeine URL" ───────────────────────
 * Aus dem Feld wird am Ende ein <iframe src> bzw. ein <video src>. Wer dort
 * beliebige Adressen einsetzen darf, kann fremde Seiten in die eigene Seite
 * hängen. Erlaubt sind deshalb nur die zwei bekannten Videoanbieter und Pfade
 * unterhalb der eigenen Domain.
 */

export type TrailerProvider = 'YouTube' | 'Vimeo'

export type EventTrailer =
  | {
      kind: 'youtube' | 'vimeo'
      /** Adresse für das <iframe>, erst nach dem Zustimmungsklick geladen */
      embedUrl: string
      /** Adresse zum Öffnen beim Anbieter, für den Link daneben */
      watchUrl: string
      provider: TrailerProvider
    }
  | {
      kind: 'file'
      /** Pfad unterhalb der eigenen Domain, z.B. "/videos/showreel.mp4" */
      src: string
      provider: null
    }

/** Video-IDs bei YouTube: Buchstaben, Ziffern, Bindestrich, Unterstrich. */
const YOUTUBE_ID = /^[A-Za-z0-9_-]{6,20}$/

const YOUTUBE_HOSTS = new Set([
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
  'youtu.be',
  'www.youtu.be',
])

const VIMEO_HOSTS = new Set(['vimeo.com', 'www.vimeo.com', 'player.vimeo.com'])

/**
 * Erlaubte Videodateien im eigenen Projekt.
 *
 * Der Pfad muss mit "/" beginnen (sonst wäre "videos/x.mp4" relativ zur
 * gerade offenen Seite und damit je nach Event ein anderer) und auf eine
 * Videoendung enden. ".." ist ausgeschlossen, damit aus dem Feld kein Weg nach
 * oben aus dem public-Verzeichnis wird.
 */
const FILE_PATH = /^\/[A-Za-z0-9/_-]+\.(mp4|webm|mov)$/i

function parseYouTube(url: URL): EventTrailer | null {
  let id: string | null = null

  if (url.hostname === 'youtu.be' || url.hostname === 'www.youtu.be') {
    // https://youtu.be/ID
    id = url.pathname.slice(1)
  } else if (url.pathname === '/watch') {
    // https://www.youtube.com/watch?v=ID — der übliche Copy-Paste-Fall
    id = url.searchParams.get('v')
  } else {
    // /embed/ID (Einbettcode) und /shorts/ID (Handy-Hochformat)
    const match = url.pathname.match(/^\/(?:embed|shorts|v)\/([^/]+)/)
    id = match ? match[1] : null
  }

  if (!id || !YOUTUBE_ID.test(id)) return null

  return {
    kind: 'youtube',
    // youtube-nocookie statt youtube: setzt keine Werbecookies. Daten fliessen
    // trotzdem erst, wenn die Besucherin den Player selbst startet.
    embedUrl: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`,
    watchUrl: `https://www.youtube.com/watch?v=${id}`,
    provider: 'YouTube',
  }
}

function parseVimeo(url: URL): EventTrailer | null {
  // https://vimeo.com/123456789 oder https://player.vimeo.com/video/123456789
  const match = url.pathname.match(/^\/(?:video\/)?(\d{6,12})(?:\/|$)/)
  if (!match) return null
  const id = match[1]

  return {
    kind: 'vimeo',
    // dnt=1 ("do not track") schaltet Vimeos Statistik-Cookies ab.
    embedUrl: `https://player.vimeo.com/video/${id}?autoplay=1&dnt=1`,
    watchUrl: `https://vimeo.com/${id}`,
    provider: 'Vimeo',
  }
}

/**
 * Was steckt hinter dem gespeicherten Trailer-Feld?
 *
 * Gibt `null` zurück für leere Felder und für alles, was nicht eindeutig einer
 * der erlaubten Quellen zuzuordnen ist. Aufrufer zeigen dann einfach keinen
 * Trailer an, statt einen kaputten Player zu bauen.
 */
export function parseTrailer(raw: string | null | undefined): EventTrailer | null {
  if (!raw) return null
  const value = raw.trim()
  if (value.length === 0) return null

  if (value.startsWith('/')) {
    if (value.includes('..') || !FILE_PATH.test(value)) return null
    return { kind: 'file', src: value, provider: null }
  }

  // "youtube.com/watch?v=x" ohne Protokoll kommt beim Kopieren aus der
  // Adresszeile mancher Browser vor. Ohne Ergänzung wirft der URL-Parser.
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`

  let url: URL
  try {
    url = new URL(withProtocol)
  } catch {
    return null
  }

  const host = url.hostname.toLowerCase()
  if (YOUTUBE_HOSTS.has(host)) return parseYouTube(url)
  if (VIMEO_HOSTS.has(host)) return parseVimeo(url)

  return null
}

/** Für die Prüfung im Admin-Formular: leer ist erlaubt, Unsinn nicht. */
export function isValidTrailerInput(raw: string | null | undefined): boolean {
  if (!raw || raw.trim().length === 0) return true
  return parseTrailer(raw) !== null
}
