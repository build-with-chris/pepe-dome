import { describe, it, expect } from 'vitest'
import sharp from 'sharp'
import { cropForEmail, parseRatio, isAllowedImageUrl } from '@/lib/email-image'

/** Erzeugt ein einfarbiges Testbild in der gewünschten Größe. */
async function makeImage(width: number, height: number, format: 'jpeg' | 'webp' | 'png' = 'jpeg') {
  return sharp({
    create: { width, height, channels: 3, background: { r: 20, g: 110, b: 200 } },
  })
    [format]()
    .toBuffer()
}

describe('parseRatio', () => {
  it('liest gültige Verhältnisse', () => {
    expect(parseRatio('3:2')).toBeCloseTo(1.5)
    expect(parseRatio('16:9')).toBeCloseTo(1.777, 2)
  })

  it('gibt bei "original" und Unsinn null zurück', () => {
    expect(parseRatio('original')).toBeNull()
    expect(parseRatio(null)).toBeNull()
    expect(parseRatio('kaputt')).toBeNull()
  })
})

describe('isAllowedImageUrl', () => {
  it('erlaubt Supabase-Storage-URLs auch ohne gesetzte Env', () => {
    const url = 'https://wwawsyhykrbvfgvhqbev.supabase.co/storage/v1/object/public/uploads/x.png'
    expect(isAllowedImageUrl(url, {})).toBe(true)
  })

  it('erlaubt den konfigurierten App-Host', () => {
    expect(
      isAllowedImageUrl('https://pepe-dome.de/images/x.jpg', {
        NEXT_PUBLIC_APP_URL: 'https://pepe-dome.de',
      })
    ).toBe(true)
  })

  it('blockt fremde Hosts', () => {
    expect(isAllowedImageUrl('https://evil.example.com/x.jpg', {})).toBe(false)
  })

  it('blockt http und interne Adressen (kein offener Proxy)', () => {
    expect(isAllowedImageUrl('http://wwawsyhykrbvfgvhqbev.supabase.co/x.png', {})).toBe(false)
    expect(isAllowedImageUrl('http://169.254.169.254/latest/meta-data/', {})).toBe(false)
    expect(isAllowedImageUrl('https://localhost:5432/x', {})).toBe(false)
  })

  it('lässt sich nicht durch eine Fremddomain mit supabase.co im Pfad täuschen', () => {
    expect(isAllowedImageUrl('https://evil.com/supabase.co/x.png', {})).toBe(false)
  })
})

describe('cropForEmail', () => {
  it('schneidet ein Querformat auf das Zielverhältnis zu', async () => {
    const output = await cropForEmail(await makeImage(2000, 2000), { width: 1200, ratio: '3:2' })
    const meta = await sharp(output).metadata()

    expect(meta.width).toBe(1200)
    expect(meta.height).toBe(800)
  })

  it('gibt immer JPEG zurück, auch aus WebP', async () => {
    const output = await cropForEmail(await makeImage(1600, 1200, 'webp'), { width: 800, ratio: '3:2' })
    const meta = await sharp(output).metadata()

    expect(meta.format).toBe('jpeg')
  })

  it('behält ohne Ratio das Seitenverhältnis und vergrößert nicht', async () => {
    const output = await cropForEmail(await makeImage(600, 400), { width: 1200, ratio: 'original' })
    const meta = await sharp(output).metadata()

    // withoutEnlargement: die 600px-Quelle wird nicht auf 1200 hochgezogen
    expect(meta.width).toBe(600)
    expect(meta.height).toBe(400)
  })
})
