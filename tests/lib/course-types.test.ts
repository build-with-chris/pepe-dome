import { describe, expect, it } from 'vitest'
import {
  isTarget,
  isWeekday,
  resolveSlug,
  sortSlots,
  weekdayAdverb,
  weekdayName,
  zeitspanne,
  type Slot,
} from '@/lib/course-types'

const slot = (weekday: number, startTime: string, endTime = '19:00'): Slot => ({
  weekday,
  startTime,
  endTime,
})

describe('weekdayName', () => {
  it('bildet 1 auf Montag ab, nicht auf Dienstag', () => {
    // Der Klassiker: 0- gegen 1-basiert. Die DB speichert nach ISO-8601,
    // also ist Montag die 1.
    expect(weekdayName(1)).toBe('Montag')
    expect(weekdayName(7)).toBe('Sonntag')
    expect(weekdayName(1, 'en')).toBe('Monday')
    expect(weekdayName(7, 'en')).toBe('Sunday')
  })

  it('liefert leeren Text statt undefined bei ungültigem Tag', () => {
    expect(weekdayName(0)).toBe('')
    expect(weekdayName(8)).toBe('')
  })
})

describe('weekdayAdverb', () => {
  it('macht aus dem Tag eine Angabe für die Kurskarte', () => {
    expect(weekdayAdverb(1)).toBe('Montags')
    expect(weekdayAdverb(3)).toBe('Mittwochs')
    expect(weekdayAdverb(1, 'en')).toBe('Mondays')
  })
})

describe('zeitspanne', () => {
  it('setzt die Zeiten sprachabhängig zusammen', () => {
    expect(zeitspanne(slot(1, '17:15', '18:15'))).toBe('17:15 bis 18:15')
    expect(zeitspanne(slot(1, '17:15', '18:15'), 'en')).toBe('17:15 to 18:15')
  })
})

describe('sortSlots', () => {
  it('sortiert erst nach Tag, dann nach Startzeit', () => {
    const gemischt = [
      slot(3, '18:00'),
      slot(1, '18:15'),
      slot(3, '17:00'),
      slot(1, '17:15'),
    ]
    expect(sortSlots(gemischt).map((s) => `${s.weekday}-${s.startTime}`)).toEqual([
      '1-17:15',
      '1-18:15',
      '3-17:00',
      '3-18:00',
    ])
  })

  it('vergleicht Zeiten als Text korrekt, solange die Stunde zweistellig ist', () => {
    // "09:00" muss vor "10:00" liegen. Ohne fuehrende Null waere "9:00"
    // groesser als "10:00" — deshalb erzwingt die API das Format.
    const sortiert = sortSlots([slot(1, '10:00'), slot(1, '09:00')])
    expect(sortiert[0].startTime).toBe('09:00')
  })

  it('lässt die Eingabe unangetastet', () => {
    const original = [slot(3, '18:00'), slot(1, '17:15')]
    sortSlots(original)
    expect(original[0].weekday).toBe(3)
  })
})

describe('resolveSlug', () => {
  it('führt die vier alten Luftakrobatik-Links auf den zusammengefassten Kurs', () => {
    // Vor der Umstellung war jeder Wochentermin ein eigener Kurs mit eigenem
    // Slug. Wer so einen Link geteilt hat, soll weiter beim Kurs landen.
    for (const alt of [
      'luftakrobatik-aircrobatics-mo-1715',
      'luftakrobatik-aircrobatics-mo-1815',
      'luftakrobatik-aircrobatics-mi-1700',
      'luftakrobatik-aircrobatics-mi-1800',
    ]) {
      expect(resolveSlug(alt)).toBe('luftakrobatik-aircrobatics')
    }
  })

  it('lässt unbekannte Slugs unverändert', () => {
    expect(resolveSlug('kinder-akrobatik-mi')).toBe('kinder-akrobatik-mi')
  })
})

describe('isTarget / isWeekday', () => {
  it('erkennt gültige Zielgruppen', () => {
    expect(isTarget('kinder')).toBe(true)
    expect(isTarget('teens')).toBe(true)
    expect(isTarget('jugendliche')).toBe(false)
    expect(isTarget(null)).toBe(false)
  })

  it('lässt nur die Wochentage 1 bis 7 durch', () => {
    expect(isWeekday(1)).toBe(true)
    expect(isWeekday(7)).toBe(true)
    expect(isWeekday(0)).toBe(false)
    expect(isWeekday(8)).toBe(false)
    expect(isWeekday(1.5)).toBe(false)
    expect(isWeekday('1')).toBe(false)
  })
})
