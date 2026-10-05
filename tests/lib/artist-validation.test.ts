/**
 * Artists: Validierung und Normalisierung der Links.
 *
 * Instagram und Website landen auf der Eventseite in einem href, deshalb
 * wird hier streng geprüft. Siehe src/lib/artist-validation.ts.
 */

import { describe, it, expect } from 'vitest'
import {
  artistSchema,
  artistIdsSchema,
  generateArtistSlug,
  normalizeInstagram,
  toArtistData,
  BIO_MAX,
} from '@/lib/artist-validation'

const gueltig = { name: 'Jana Beispiel', bio: 'Luftakrobatin aus München.' }

describe('normalizeInstagram', () => {
  it.each([
    ['@pepe.dome', 'https://www.instagram.com/pepe.dome/'],
    ['pepe.dome', 'https://www.instagram.com/pepe.dome/'],
    ['instagram.com/pepe_arts', 'https://www.instagram.com/pepe_arts/'],
    ['https://www.instagram.com/pepe_arts/?hl=de', 'https://www.instagram.com/pepe_arts/'],
    ['http://instagram.com/pepe_arts', 'https://www.instagram.com/pepe_arts/'],
  ])('%s → %s', (eingabe, erwartet) => {
    expect(normalizeInstagram(eingabe)).toBe(erwartet)
  })

  it.each(['', '@', 'javascript:alert(1)', 'https://evil.example/pepe', 'zwei worte'])(
    'lehnt %j ab',
    (eingabe) => {
      expect(normalizeInstagram(eingabe)).toBeNull()
    }
  )
})

describe('artistSchema', () => {
  it('nimmt einen vollständigen Artist an und normalisiert Instagram', () => {
    const result = artistSchema.parse({
      ...gueltig,
      instagramUrl: '@pepe.dome',
      websiteUrl: 'https://example.org',
    })
    expect(result.instagramUrl).toBe('https://www.instagram.com/pepe.dome/')
    expect(result.websiteUrl).toBe('https://example.org')
  })

  it('verlangt einen Namen', () => {
    expect(artistSchema.safeParse({ ...gueltig, name: '  ' }).success).toBe(false)
  })

  it('verlangt eine Bio und begrenzt sie auf 600 Zeichen', () => {
    expect(artistSchema.safeParse({ ...gueltig, bio: '' }).success).toBe(false)
    expect(artistSchema.safeParse({ ...gueltig, bio: 'a'.repeat(BIO_MAX) }).success).toBe(true)
    expect(artistSchema.safeParse({ ...gueltig, bio: 'a'.repeat(BIO_MAX + 1) }).success).toBe(false)
  })

  it('begrenzt auch die englische Bio', () => {
    expect(artistSchema.safeParse({ ...gueltig, bioEn: 'a'.repeat(BIO_MAX + 1) }).success).toBe(false)
  })

  it('lehnt http:// und javascript: als Website ab', () => {
    expect(artistSchema.safeParse({ ...gueltig, websiteUrl: 'http://example.org' }).success).toBe(false)
    expect(artistSchema.safeParse({ ...gueltig, websiteUrl: 'javascript:alert(1)' }).success).toBe(false)
  })

  it('macht leere Links zu null', () => {
    const result = artistSchema.parse({ ...gueltig, instagramUrl: '', websiteUrl: ' ', imageUrl: '' })
    expect(result.instagramUrl).toBeNull()
    expect(result.websiteUrl).toBeNull()
    expect(result.imageUrl).toBeNull()
  })

  it('lässt nur Projektpfade oder https als Foto zu', () => {
    expect(artistSchema.safeParse({ ...gueltig, imageUrl: '/images/artists/jana.jpg' }).success).toBe(true)
    expect(artistSchema.safeParse({ ...gueltig, imageUrl: 'data:image/png;base64,xx' }).success).toBe(false)
  })
})

describe('toArtistData', () => {
  it('legt die EN-Bio in translations ab und behält andere Sprachen', () => {
    const input = artistSchema.parse({ ...gueltig, bioEn: 'Aerialist from Munich.' })
    const data = toArtistData(input, { fr: { bio: 'Acrobate' } })
    expect(data.translations).toEqual({
      fr: { bio: 'Acrobate' },
      en: { bio: 'Aerialist from Munich.' },
    })
    expect(data).not.toHaveProperty('bioEn')
  })
})

describe('generateArtistSlug', () => {
  it('macht aus Namen mit Umlauten und Akzenten einen Slug', () => {
    expect(generateArtistSlug('Jürgen Müßig')).toBe('juergen-muessig')
    expect(generateArtistSlug('Zoé Café')).toBe('zoe-cafe')
  })
})

describe('artistIdsSchema', () => {
  it('behält die Reihenfolge und entfernt Dubletten', () => {
    expect(artistIdsSchema.parse(['b', 'a', 'b'])).toEqual(['b', 'a'])
  })
})
