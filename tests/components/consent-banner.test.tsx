/**
 * Der Cookie-Banner ist das Erste, was ein Anzeigenklick sieht.
 *
 * Auf einem 390 mal 844 Bildschirm stapelte er drei Buttons untereinander und
 * verdeckte damit beide Hero-Buttons. Er muss kompakt bleiben, und Ablehnen
 * muss weiter genauso leicht erreichbar sein wie Zustimmen. Das ist keine
 * Geschmacksfrage, sondern die Bedingung dafür, dass die Einwilligung zählt.
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ConsentBanner from '@/components/consent/ConsentBanner'

vi.mock('next/navigation', () => ({
  usePathname: () => '/de',
}))

function gespeicherteEinwilligung() {
  const roh = localStorage.getItem('pepe_consent')
  return roh ? JSON.parse(roh) : null
}

describe('ConsentBanner', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('fragt, solange keine Entscheidung gespeichert ist', async () => {
    render(<ConsentBanner />)

    expect(await screen.findByRole('dialog')).toBeInTheDocument()
  })

  it('bietet Zustimmen und Ablehnen als gleichrangige Buttons an', async () => {
    render(<ConsentBanner />)
    await screen.findByRole('dialog')

    const zustimmen = screen.getByRole('button', { name: 'Alle akzeptieren' })
    const ablehnen = screen.getByRole('button', { name: 'Nur notwendige' })

    // Beide im selben Container, sonst ist Ablehnen die zweite Ebene.
    expect(zustimmen.parentElement).toBe(ablehnen.parentElement)
  })

  it('speichert bei Nur notwendige eine Ablehnung und schliesst', async () => {
    render(<ConsentBanner />)
    await screen.findByRole('dialog')

    fireEvent.click(screen.getByRole('button', { name: 'Nur notwendige' }))

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
    expect(gespeicherteEinwilligung()).toMatchObject({ analytics: false, marketing: false })
  })

  it('speichert bei Alle akzeptieren beide Zwecke', async () => {
    render(<ConsentBanner />)
    await screen.findByRole('dialog')

    fireEvent.click(screen.getByRole('button', { name: 'Alle akzeptieren' }))

    await waitFor(() => {
      expect(gespeicherteEinwilligung()).toMatchObject({ analytics: true, marketing: true })
    })
  })

  it('öffnet die Schalter über Einstellungen, ohne etwas zu speichern', async () => {
    render(<ConsentBanner />)
    await screen.findByRole('dialog')

    fireEvent.click(screen.getByRole('button', { name: 'Einstellungen' }))

    expect(await screen.findByText('Statistik')).toBeInTheDocument()
    expect(screen.getByText('Marketing')).toBeInTheDocument()
    expect(gespeicherteEinwilligung()).toBeNull()
  })

  it('bleibt im ersten Schritt kurz', async () => {
    // Regressionsschutz gegen Nachwachsen: der Fliesstext im ersten Schritt
    // bestimmt die Bauhöhe auf dem Handy. Die Einzelheiten stehen unter
    // Einstellungen, dort ist Platz.
    render(<ConsentBanner />)
    const dialog = await screen.findByRole('dialog')

    const text = dialog.querySelector('p')?.textContent ?? ''
    expect(text.length).toBeLessThanOrEqual(120)
  })
})
