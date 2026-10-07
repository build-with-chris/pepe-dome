import { describe, it, expect } from 'vitest'
import { zielMasse, mitEndung, ausschnittImBild, MAX_KANTE } from '@/lib/bild-verkleinern'

describe('zielMasse', () => {
  it('verkleinert ein Handyfoto auf die maximale Kante, Seitenverhältnis bleibt', () => {
    expect(zielMasse(4032, 3024)).toEqual({ breite: MAX_KANTE, hoehe: 1800 })
  })

  it('verkleinert Hochformat über die Höhe', () => {
    expect(zielMasse(3024, 4032)).toEqual({ breite: 1800, hoehe: MAX_KANTE })
  })

  it('vergrößert nie', () => {
    expect(zielMasse(1200, 800)).toEqual({ breite: 1200, hoehe: 800 })
  })
})

describe('mitEndung', () => {
  it('tauscht die Endung', () => {
    expect(mitEndung('hero.webp', 'jpg')).toBe('hero.jpg')
    expect(mitEndung('IMG_1234.JPEG', 'jpg')).toBe('IMG_1234.jpg')
  })

  it('kommt mit Namen ohne Endung zurecht', () => {
    expect(mitEndung('hero', 'jpg')).toBe('hero.jpg')
    expect(mitEndung('.jpg', 'jpg')).toBe('bild.jpg')
  })
})

describe('ausschnittImBild', () => {
  it('rundet auf ganze Pixel', () => {
    expect(ausschnittImBild({ x: 10.4, y: 20.6, width: 300.5, height: 300.2 }, 1000, 800)).toEqual({
      x: 10,
      y: 21,
      width: 301,
      height: 300,
    })
  })

  it('ragt nicht über den Bildrand hinaus', () => {
    expect(ausschnittImBild({ x: -1, y: 500, width: 1002, height: 400 }, 1000, 800)).toEqual({
      x: 0,
      y: 500,
      width: 1000,
      height: 300,
    })
  })
})
