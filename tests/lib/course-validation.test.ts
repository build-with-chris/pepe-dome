import { describe, expect, it } from 'vitest'
import {
  bildSchema,
  courseCreateSchema,
  courseUpdateSchema,
  generateCourseSlug,
  isValidBookingUrl,
  scheduleNoteSchema,
  slotSchema,
} from '@/lib/course-validation'

const gueltigerKurs = {
  title: 'Kinder Akrobatik',
  description: 'Spielerische Akrobatik für Kinder.',
  fuerWen: 'Kinder 5 bis 12 Jahre',
  target: 'kinder' as const,
  trainer: 'Michael',
  slots: [{ weekday: 3, startTime: '16:30', endTime: '18:00' }],
}

describe('slotSchema', () => {
  it('normalisiert krumme Zeiten auf HH:MM', () => {
    const result = slotSchema.safeParse({ weekday: 1, startTime: '9:5', endTime: '10:00' })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.startTime).toBe('09:05')
  })

  it('lehnt ein Ende vor dem Beginn ab', () => {
    // Auf der Website wuerde daraus "18:00 bis 17:00 Uhr" — ein Tippfehler,
    // der bis zur Kurskarte durchschlaegt, wenn ihn niemand abfaengt.
    const result = slotSchema.safeParse({ weekday: 1, startTime: '18:00', endTime: '17:00' })
    expect(result.success).toBe(false)
  })

  it('lehnt gleiche Start- und Endzeit ab', () => {
    const result = slotSchema.safeParse({ weekday: 1, startTime: '18:00', endTime: '18:00' })
    expect(result.success).toBe(false)
  })

  it('lässt nur Wochentage 1 bis 7 zu', () => {
    for (const weekday of [0, 8, -1]) {
      expect(slotSchema.safeParse({ weekday, startTime: '10:00', endTime: '11:00' }).success).toBe(
        false
      )
    }
  })

  it('weist unbrauchbare Zeitangaben zurück statt sie durchzureichen', () => {
    // Anders als bei Events, wo Freitext wie "ab 20 Uhr" im Altbestand steht.
    const result = slotSchema.safeParse({ weekday: 1, startTime: 'abends', endTime: '20:00' })
    expect(result.success).toBe(false)
  })
})

describe('bildSchema', () => {
  it('nimmt projekteigene Pfade an', () => {
    const result = bildSchema.safeParse({ url: '/kurse/luftakrobatik/01.jpg', alt: 'Am Tuch' })
    expect(result.success).toBe(true)
  })

  it('nimmt https-Adressen an', () => {
    expect(bildSchema.safeParse({ url: 'https://example.com/a.jpg', alt: '' }).success).toBe(true)
  })

  it('lehnt javascript: ab', () => {
    // Der Wert landet in einem src-Attribut.
    expect(bildSchema.safeParse({ url: 'javascript:alert(1)', alt: '' }).success).toBe(false)
  })

  it('lehnt data: ab', () => {
    expect(
      bildSchema.safeParse({ url: 'data:image/svg+xml,<svg onload=alert(1)>', alt: '' }).success
    ).toBe(false)
  })

  it('lehnt einfaches http ab, weil es auf einer https-Seite blockiert wuerde', () => {
    expect(bildSchema.safeParse({ url: 'http://example.com/a.jpg', alt: '' }).success).toBe(false)
  })

  it('lehnt eine leere Adresse ab', () => {
    expect(bildSchema.safeParse({ url: '   ', alt: 'x' }).success).toBe(false)
  })

  it('setzt einen fehlenden alt-Text auf leer statt undefined', () => {
    const result = bildSchema.safeParse({ url: '/kurse/a.jpg' })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.alt).toBe('')
  })
})

describe('courseCreateSchema', () => {
  it('nimmt einen vollständigen Kurs an', () => {
    expect(courseCreateSchema.safeParse(gueltigerKurs).success).toBe(true)
  })

  it('verlangt mindestens einen Termin', () => {
    const result = courseCreateSchema.safeParse({ ...gueltigerKurs, slots: [] })
    expect(result.success).toBe(false)
  })

  it('setzt neue Kurse standardmäßig auf Entwurf', () => {
    const result = courseCreateSchema.safeParse(gueltigerKurs)
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.status).toBe('DRAFT')
  })

  it('lehnt einen leeren Titel ab', () => {
    expect(courseCreateSchema.safeParse({ ...gueltigerKurs, title: '   ' }).success).toBe(false)
  })

  it('kennt keine erfundene Zielgruppe', () => {
    expect(courseCreateSchema.safeParse({ ...gueltigerKurs, target: 'senioren' }).success).toBe(
      false
    )
  })
})

describe('courseUpdateSchema', () => {
  it('erlaubt Teiländerungen', () => {
    expect(courseUpdateSchema.safeParse({ status: 'ARCHIVED' }).success).toBe(true)
  })

  it('kennt kein slug-Feld', () => {
    // Der Slug haengt an geteilten Links und darf sich beim Umbenennen nicht
    // aendern. Was hier ankommt, wird verworfen statt gespeichert.
    const result = courseUpdateSchema.safeParse({ slug: 'neuer-slug' })
    expect(result.success).toBe(true)
    if (result.success) expect('slug' in result.data).toBe(false)
  })

  it('lehnt eine leere Terminliste weiterhin ab', () => {
    expect(courseUpdateSchema.safeParse({ slots: [] }).success).toBe(false)
  })
})

describe('generateCourseSlug', () => {
  it('macht aus Umlauten lesbare Slugs', () => {
    expect(generateCourseSlug('Luftakrobatik für Jugendliche')).toBe(
      'luftakrobatik-fuer-jugendliche'
    )
    expect(generateCourseSlug('Größe & Spaß')).toBe('groesse-spass')
  })

  it('lässt keine Bindestriche am Rand stehen', () => {
    expect(generateCourseSlug('  Cyr Wheel!  ')).toBe('cyr-wheel')
  })
})

describe('isValidBookingUrl', () => {
  it('lässt http, https und mailto zu', () => {
    expect(isValidBookingUrl('https://www.aircrobatic-studios.com')).toBe(true)
    expect(isValidBookingUrl('mailto:info@pepe-dome.de')).toBe(true)
  })

  it('lehnt javascript: ab', () => {
    // Der Wert landet auf der Website in einem href.
    expect(isValidBookingUrl('javascript:alert(1)')).toBe(false)
  })

  it('behandelt leer als gültig, weil das Feld optional ist', () => {
    expect(isValidBookingUrl(null)).toBe(true)
    expect(isValidBookingUrl('')).toBe(true)
  })
})

describe('scheduleNoteSchema', () => {
  it('nimmt leeren Text an, weil das den Hinweis löscht', () => {
    const result = scheduleNoteSchema.safeParse({ weekday: 4, text: '' })
    expect(result.success).toBe(true)
  })

  it('lehnt Wochentage außerhalb 1 bis 7 ab', () => {
    expect(scheduleNoteSchema.safeParse({ weekday: 0, text: 'x' }).success).toBe(false)
  })
})
