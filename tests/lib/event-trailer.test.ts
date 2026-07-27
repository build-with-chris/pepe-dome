import { describe, it, expect } from 'vitest'
import { parseTrailer, isValidTrailerInput } from '@/lib/event-trailer'

/**
 * Aus dem Trailer-Feld wird ein <iframe src> bzw. ein <video src>. Zwei Dinge
 * hängen deshalb an diesen Tests:
 *
 *   1. Die Redaktion kopiert Links in allen Formen, die YouTube ausspuckt
 *      (watch, youtu.be, shorts, "Teilen"-Dialog mit ?t=). Fällt eine Form
 *      durch, verschwindet der Trailer wortlos von der Seite.
 *   2. Alles ausserhalb der zwei Anbieter und des eigenen public-Ordners muss
 *      abgelehnt werden. Sonst hängt ein gespeicherter Link fremde Seiten in
 *      die eigene.
 */
describe('parseTrailer', () => {
  describe('YouTube', () => {
    const variants = [
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://youtube.com/watch?v=dQw4w9WgXcQ',
      'https://m.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://youtu.be/dQw4w9WgXcQ',
      'https://www.youtube.com/embed/dQw4w9WgXcQ',
      'https://www.youtube.com/shorts/dQw4w9WgXcQ',
      // Aus dem "Teilen"-Dialog, mit Startzeit und Tracking-Parameter
      'https://youtu.be/dQw4w9WgXcQ?t=42&si=abcdef',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PL123&index=2',
      // Ohne Protokoll, wie es manche Browser beim Kopieren liefern
      'youtube.com/watch?v=dQw4w9WgXcQ',
      // Mit Leerzeichen aus der Zwischenablage
      '  https://www.youtube.com/watch?v=dQw4w9WgXcQ  ',
    ]

    it.each(variants)('erkennt %j', (input) => {
      const trailer = parseTrailer(input)
      expect(trailer).not.toBeNull()
      expect(trailer!.kind).toBe('youtube')
      expect(trailer!.provider).toBe('YouTube')
    })

    it('bettet ueber youtube-nocookie ein, nicht ueber youtube.com', () => {
      const trailer = parseTrailer('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
      expect(trailer).toMatchObject({ kind: 'youtube' })
      if (trailer?.kind !== 'youtube') throw new Error('kein YouTube-Trailer')
      expect(trailer.embedUrl).toContain('youtube-nocookie.com/embed/dQw4w9WgXcQ')
      expect(trailer.watchUrl).toBe('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
    })

    it('lehnt eine YouTube-Adresse ohne Video ab', () => {
      expect(parseTrailer('https://www.youtube.com/')).toBeNull()
      expect(parseTrailer('https://www.youtube.com/watch')).toBeNull()
      expect(parseTrailer('https://www.youtube.com/@pepedome')).toBeNull()
    })
  })

  describe('Vimeo', () => {
    it('erkennt die uebliche Adresse', () => {
      const trailer = parseTrailer('https://vimeo.com/824804225')
      if (trailer?.kind !== 'vimeo') throw new Error('kein Vimeo-Trailer')
      expect(trailer.embedUrl).toContain('player.vimeo.com/video/824804225')
      expect(trailer.embedUrl).toContain('dnt=1')
      expect(trailer.watchUrl).toBe('https://vimeo.com/824804225')
    })

    it('erkennt die Player-Adresse aus dem Einbettcode', () => {
      expect(parseTrailer('https://player.vimeo.com/video/824804225')?.kind).toBe('vimeo')
    })

    it('erkennt eine Adresse mit Hash aus einem privaten Link', () => {
      expect(parseTrailer('https://vimeo.com/824804225/abc123def')?.kind).toBe('vimeo')
    })

    it('lehnt eine Vimeo-Adresse ohne Video-Nummer ab', () => {
      expect(parseTrailer('https://vimeo.com/pepedome')).toBeNull()
    })
  })

  describe('Datei im Projekt', () => {
    it('erkennt einen Pfad unter /videos', () => {
      expect(parseTrailer('/videos/showreel.mp4')).toEqual({
        kind: 'file',
        src: '/videos/showreel.mp4',
        provider: null,
      })
    })

    it.each(['/videos/clip.webm', '/videos/clip.MP4', '/videos/unter/ordner/clip.mov'])(
      'erkennt %j',
      (input) => {
        expect(parseTrailer(input)?.kind).toBe('file')
      }
    )

    it('lehnt einen Pfad ohne Videoendung ab', () => {
      expect(parseTrailer('/videos/showreel')).toBeNull()
      expect(parseTrailer('/api/admin/events')).toBeNull()
    })

    it('lehnt den Weg aus dem public-Ordner heraus ab', () => {
      expect(parseTrailer('/videos/../../.env.mp4')).toBeNull()
    })

    it('lehnt einen relativen Pfad ab', () => {
      // Ohne fuehrenden Schraegstrich zeigt der Pfad je nach offener Seite
      // woanders hin. Wird als Adresse ohne Protokoll gelesen und faellt durch.
      expect(parseTrailer('videos/showreel.mp4')).toBeNull()
    })
  })

  describe('lehnt fremde Quellen ab', () => {
    const rejected = [
      'https://evil.tld/video.mp4',
      'https://youtube.com.evil.tld/watch?v=dQw4w9WgXcQ',
      'javascript:alert(1)',
      'data:text/html,<script>alert(1)</script>',
      'Trailer folgt',
      '',
      '   ',
    ]

    it.each(rejected)('lehnt %j ab', (input) => {
      expect(parseTrailer(input)).toBeNull()
    })

    it('lehnt null und undefined ab', () => {
      expect(parseTrailer(null)).toBeNull()
      expect(parseTrailer(undefined)).toBeNull()
    })
  })
})

describe('isValidTrailerInput', () => {
  it('laesst ein leeres Feld durch, denn der Trailer ist optional', () => {
    expect(isValidTrailerInput('')).toBe(true)
    expect(isValidTrailerInput('   ')).toBe(true)
    expect(isValidTrailerInput(null)).toBe(true)
  })

  it('nimmt an, was der Player spaeter auch abspielen kann', () => {
    expect(isValidTrailerInput('https://youtu.be/dQw4w9WgXcQ')).toBe(true)
    expect(isValidTrailerInput('/videos/showreel.mp4')).toBe(true)
  })

  it('weist zurueck, was die Website stumm ignorieren wuerde', () => {
    expect(isValidTrailerInput('https://drive.google.com/file/d/abc/view')).toBe(false)
    expect(isValidTrailerInput('kommt noch')).toBe(false)
  })
})
