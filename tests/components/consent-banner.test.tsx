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

    const zustimmen = screen.getByRole('button', { name: 'Einverstanden' })
    const ablehnen = screen.getByRole('button', { name: 'Nein, danke' })

    // Beide im selben Container, sonst ist Ablehnen die zweite Ebene.
    expect(zustimmen.parentElement).toBe(ablehnen.parentElement)
  })

  it('speichert bei Nein, danke eine Ablehnung und schliesst', async () => {
    render(<ConsentBanner />)
    await screen.findByRole('dialog')

    fireEvent.click(screen.getByRole('button', { name: 'Nein, danke' }))

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
    expect(gespeicherteEinwilligung()).toMatchObject({ analytics: false, marketing: false })
  })

  it('speichert bei Einverstanden beide Zwecke', async () => {
    render(<ConsentBanner />)
    await screen.findByRole('dialog')

    fireEvent.click(screen.getByRole('button', { name: 'Einverstanden' }))

    await waitFor(() => {
      expect(gespeicherteEinwilligung()).toMatchObject({ analytics: true, marketing: true })
    })
  })

  it('öffnet die Schalter über Selbst auswählen, ohne etwas zu speichern', async () => {
    render(<ConsentBanner />)
    await screen.findByRole('dialog')

    fireEvent.click(screen.getByRole('button', { name: 'Selbst auswählen' }))

    expect(await screen.findByText('Statistik')).toBeInTheDocument()
    expect(screen.getByText('Werbung')).toBeInTheDocument()
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
