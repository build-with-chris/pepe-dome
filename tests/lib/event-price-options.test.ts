import { describe, it, expect } from 'vitest'
import { detectPriceOption, priceTextFor } from '@/lib/event-price'

/**
 * Preisstufen im Admin
 *
 * Das Formular bietet nur noch drei Preise an (gratis, ab 6 €, ab 12 €) plus
 * einen Ausweg für Sonderfälle. Damit ein bestehendes Event beim Öffnen die
 * richtige Stufe vorausgewählt bekommt und beim Speichern nicht plötzlich einen
 * anderen Preis trägt, muss die Erkennung auch die alten Schreibweisen treffen.
 *
 * Die Gratis-Erkennung selbst ist in event-price.test.ts abgedeckt.
 */
describe('detectPriceOption', () => {
  it('erkennt die drei Stufen in ihren üblichen Schreibweisen', () => {
    expect(detectPriceOption('Eintritt frei')).toBe('FREE')
    expect(detectPriceOption('Kostenlos')).toBe('FREE')
    expect(detectPriceOption('ab 6 €')).toBe('FROM_6')
    expect(detectPriceOption('ab 6 Euro')).toBe('FROM_6')
    expect(detectPriceOption('6€')).toBe('FROM_6')
    expect(detectPriceOption('ab 12 €')).toBe('FROM_12')
    expect(detectPriceOption('12,00 EUR')).toBe('FROM_12')
    expect(detectPriceOption('from 12 €')).toBe('FROM_12')
  })

  it('behandelt alles andere als Sonderpreis', () => {
    expect(detectPriceOption('ab 22 €')).toBe('CUSTOM')
    expect(detectPriceOption('20 bis 35 €')).toBe('CUSTOM')
    expect(detectPriceOption('Spendenbasis')).toBe('CUSTOM')
  })

  it('setzt Nachkommastellen nicht auf die Stufe herunter', () => {
    // Sonst würde "12,50 €" beim nächsten Speichern zu "ab 12 €"
    expect(detectPriceOption('12,50 €')).toBe('CUSTOM')
    expect(detectPriceOption('6.50 €')).toBe('CUSTOM')
  })

  it('unterscheidet "kein Preis" von "gratis"', () => {
    expect(detectPriceOption(null)).toBeNull()
    expect(detectPriceOption('')).toBeNull()
    expect(detectPriceOption('   ')).toBeNull()
  })
})

describe('priceTextFor', () => {
  it('liefert den Wortlaut je Sprache', () => {
    expect(priceTextFor('FREE')).toBe('Eintritt frei')
    expect(priceTextFor('FREE', 'en')).toBe('Free entry')
    expect(priceTextFor('FROM_6')).toBe('ab 6 €')
    expect(priceTextFor('FROM_12', 'en')).toBe('from 12 €')
  })

  it('hat für Sonderpreise keinen festen Wortlaut', () => {
    expect(priceTextFor('CUSTOM')).toBeNull()
  })
})
