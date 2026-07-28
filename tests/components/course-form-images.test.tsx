/**
 * Bildverwaltung im Kursformular
 *
 * Die Kursbilder liegen als eine Liste in der Datenbank, und der erste Eintrag
 * ist per Vereinbarung das Titelbild. Das Formular zeigt genau diese Liste als
 * „Titelbild" plus „weitere Bilder" an. Die Umrechnung zwischen beiden Sichten
 * ist die Stelle, an der man sich vertut: ein Off-by-one, und plötzlich steht
 * das falsche Bild auf der Kurskarte oder eine Beschreibung landet am falschen
 * Bild.
 */

import { render, screen, fireEvent, within } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import CourseForm, { type CourseFormData } from '@/components/admin/forms/CourseForm'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}))

const basis: Partial<CourseFormData> = {
  id: 'test-id',
  title: 'Kinder Akrobatik',
  description: 'Spielerische Akrobatik.',
  fuerWen: 'Kinder 5 bis 12',
  target: 'kinder',
  trainer: 'Michael',
  slots: [{ weekday: 3, startTime: '16:30', endTime: '18:00' }],
  images: [
    { url: '/kurse/a/01.jpg', alt: 'Erstes' },
    { url: '/kurse/a/02.jpg', alt: 'Zweites' },
    { url: '/kurse/a/03.jpg', alt: 'Drittes' },
  ],
}

function galerieBeschreibungen(): string[] {
  return screen
    .getAllByLabelText(/^Beschreibung von Bild /)
    .map((el) => (el as HTMLInputElement).value)
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('CourseForm — Bilder', () => {
  it('zeigt das erste Bild als Titelbild und den Rest als Galerie', () => {
    render(<CourseForm mode="edit" initial={basis} />)

    // Das Titelbild hat ein eigenes Beschreibungsfeld, nicht das der Galerie.
    expect((screen.getByLabelText('Beschreibung des Titelbilds') as HTMLInputElement).value).toBe(
      'Erstes'
    )
    // Galerie sind die uebrigen zwei, nicht alle drei.
    expect(galerieBeschreibungen()).toEqual(['Zweites', 'Drittes'])
  })

  it('macht aus einem Galeriebild das Titelbild, ohne ein Bild zu verlieren', () => {
    render(<CourseForm mode="edit" initial={basis} />)

    // „Drittes" nach vorn holen.
    const zeilen = screen.getAllByLabelText(/^Beschreibung von Bild /)
    const drittesZeile = zeilen[1].closest('div.rounded-lg') as HTMLElement
    fireEvent.click(within(drittesZeile).getByRole('button', { name: 'Als Titelbild' }))

    expect((screen.getByLabelText('Beschreibung des Titelbilds') as HTMLInputElement).value).toBe(
      'Drittes'
    )
    // Die anderen beiden bleiben erhalten und behalten ihre Reihenfolge.
    expect(galerieBeschreibungen()).toEqual(['Erstes', 'Zweites'])
  })

  it('schreibt eine Beschreibung an das Bild, das gemeint ist', () => {
    render(<CourseForm mode="edit" initial={basis} />)

    const zweites = screen.getAllByLabelText(/^Beschreibung von Bild /)[0]
    fireEvent.change(zweites, { target: { value: 'Neu beschriftet' } })

    expect(galerieBeschreibungen()).toEqual(['Neu beschriftet', 'Drittes'])
    // Das Titelbild darf davon unberuehrt bleiben.
    expect((screen.getByLabelText('Beschreibung des Titelbilds') as HTMLInputElement).value).toBe(
      'Erstes'
    )
  })

  it('entfernt genau das gewählte Galeriebild', () => {
    render(<CourseForm mode="edit" initial={basis} />)

    const zeilen = screen.getAllByLabelText(/^Beschreibung von Bild /)
    const zweiteZeile = zeilen[0].closest('div.rounded-lg') as HTMLElement
    fireEvent.click(within(zweiteZeile).getByRole('button', { name: /entfernen/i }))

    expect(galerieBeschreibungen()).toEqual(['Drittes'])
    expect((screen.getByLabelText('Beschreibung des Titelbilds') as HTMLInputElement).value).toBe(
      'Erstes'
    )
  })

  it('kommt ohne Bilder zurecht und zeigt dann keine Galeriezeilen', () => {
    render(<CourseForm mode="edit" initial={{ ...basis, images: [] }} />)

    expect(screen.queryAllByLabelText(/^Beschreibung von Bild /)).toHaveLength(0)
    expect(screen.queryByLabelText('Beschreibung des Titelbilds')).toBeNull()
    // Die Ablageflaeche fuer weitere Bilder steht trotzdem bereit.
    expect(screen.getByText(/Bilder hierher ziehen/)).toBeTruthy()
  })
})
