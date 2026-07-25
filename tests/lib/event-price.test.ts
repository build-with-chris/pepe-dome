import { describe, it, expect } from 'vitest'
import { isFreeEntry } from '@/lib/event-price'

/**
 * Das Preisfeld eines Events ist Freitext. Der Gratis-Sticker auf den Karten und
 * der Preis `0` im Event-JSON-LD hängen beide daran, dass diese Funktion die in
 * der Redaktion üblichen Schreibweisen erkennt.
 *
 * Die Liste unter "echte Werte aus der Datenbank" stammt aus einem
 * `SELECT slug, price FROM events WHERE status = 'PUBLISHED'` auf der
 * Produktions-DB. Der erste Entwurf der Funktion kannte nur "Eintritt frei" und
 * hätte sieben der acht kostenlosen Veranstaltungen übersehen. Diese Fälle
 * stehen hier, damit das nicht unbemerkt zurückkommt.
 */
describe('isFreeEntry', () => {
  describe('echte Werte aus der Datenbank: kostenlos', () => {
    const free = [
      'Eintritt frei',
      'freier Eintritt (Spenden erwünscht)',
      'Freier Eintritt (Spenden erwünscht)',
      'umsonst',
    ]

    it.each(free)('erkennt %j als kostenlos', (price) => {
      expect(isFreeEntry(price)).toBe(true)
    })
  })

  describe('echte Werte aus der Datenbank: kostenpflichtig', () => {
    const paid = [
      'ab 5€',
      '45',
      'ab 12€',
      '5',
      '40 €',
      'ab 6€',
      '12',
      'ab 6 €',
      'ab 12 €',
      '12 €',
    ]

    it.each(paid)('erkennt %j als kostenpflichtig', (price) => {
      expect(isFreeEntry(price)).toBe(false)
    })
  })

  describe('weitere Schreibweisen', () => {
    it.each([
      'Kostenlos',
      'Kostenlos (wissenschaftliche Arbeit)',
      'kostenfrei',
      'Gratis',
      'Der Eintritt ist frei',
      'Eintritt: frei',
      'Eintritt frei, Spenden willkommen',
      'Kostenloser Eintritt',
      'Free entry',
      'free admission',
      'Free of charge',
      'No charge',
      '0',
      '0 €',
      '0,00 EUR',
      '0.00 euro',
    ])('erkennt %j als kostenlos', (price) => {
      expect(isFreeEntry(price)).toBe(true)
    })
  })

  describe('grenzt ab, wo "frei" nicht kostenlos heisst', () => {
    it.each([
      // Kostet Geld, nur für eine Teilgruppe nicht. Ein Gratis-Sticker wäre hier
      // eine Falschaussage am Eingang.
      '22 €, frei für Kinder unter 6',
      'ab 22 €, Kinder frei',
      // Es wird eine Zahlung erwartet, nur die Höhe ist offen.
      'Freiwillige Spende',
      'Spendenbasis',
      'Auf Spendenbasis',
      // Keine Preisangabe heisst "steht noch nicht fest", nicht "gratis".
      '',
      '   ',
    ])('erkennt %j nicht als kostenlos', (price) => {
      expect(isFreeEntry(price)).toBe(false)
    })

    it('behandelt null und undefined als nicht kostenlos', () => {
      expect(isFreeEntry(null)).toBe(false)
      expect(isFreeEntry(undefined)).toBe(false)
    })
  })

  describe('Normalisierung', () => {
    it('ignoriert Groß- und Kleinschreibung', () => {
      expect(isFreeEntry('EINTRITT FREI')).toBe(true)
      expect(isFreeEntry('UmSonSt')).toBe(true)
    })

    it('ignoriert führende und mehrfache Leerzeichen', () => {
      expect(isFreeEntry('  Eintritt   frei  ')).toBe(true)
    })

    it('erkennt geschützte Leerzeichen, wie sie beim Einfügen aus Word entstehen', () => {
      expect(isFreeEntry('Eintritt frei')).toBe(true)
    })
  })
})
