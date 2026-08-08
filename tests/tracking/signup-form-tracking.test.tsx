/**
 * Das Formular, das auf Startseite, Event- und News-Seiten steht, meldet seine
 * Anmeldungen.
 *
 * Vorher tat das nur die Fassung im Footer. Meta sah dadurch fast keine
 * Anmeldungen und konnte die Kampagne auf nichts optimieren.
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import SignupForm from '@/components/custom/SignupForm'

vi.mock('@/lib/tracking', () => ({
  trackLead: vi.fn(),
}))

vi.mock('@/lib/consent', () => ({
  hasConsent: vi.fn(() => true),
}))

const { trackLead } = await import('@/lib/tracking')
const { hasConsent } = await import('@/lib/consent')

function antwortOk() {
  return {
    ok: true,
    json: async () => ({ success: true, data: { message: 'ok' } }),
  } as Response
}

function antwortFehler() {
  return {
    ok: false,
    json: async () => ({ success: false, error: { message: 'Zu viele Anfragen.' } }),
  } as Response
}

async function anmelden(adresse = 'anna@example.de') {
  const feld = screen.getByPlaceholderText('deine@email.com')
  fireEvent.change(feld, { target: { value: adresse } })
  fireEvent.submit(feld.closest('form')!)
}

function letzterRequestBody() {
  const call = vi.mocked(global.fetch).mock.calls[0]
  return JSON.parse((call[1] as RequestInit).body as string)
}

describe('SignupForm aus custom/', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    vi.mocked(hasConsent).mockReturnValue(true)
    global.fetch = vi.fn().mockResolvedValue(antwortOk()) as unknown as typeof fetch
  })

  it('meldet die Anmeldung mit Adresse und Herkunft', async () => {
    render(<SignupForm source="startseite" />)
    await anmelden()

    await waitFor(() => {
      expect(trackLead).toHaveBeenCalledWith({
        leadType: 'newsletter',
        email: 'anna@example.de',
        source: 'startseite',
      })
    })
  })

  it('nennt ohne source-Angabe die Variante als Herkunft', async () => {
    render(<SignupForm />)
    await anmelden()

    await waitFor(() => {
      expect(trackLead).toHaveBeenCalledWith(
        expect.objectContaining({ source: 'inline-form' })
      )
    })
  })

  it('meldet nichts, wenn die Anmeldung scheitert', async () => {
    global.fetch = vi.fn().mockResolvedValue(antwortFehler()) as unknown as typeof fetch
    render(<SignupForm />)
    await anmelden()

    await waitFor(() => {
      expect(screen.getByText('Zu viele Anfragen.')).toBeInTheDocument()
    })
    expect(trackLead).not.toHaveBeenCalled()
  })

  it('schickt die Marketing-Einwilligung an den Server mit', async () => {
    render(<SignupForm source="startseite" />)
    await anmelden()

    await waitFor(() => expect(global.fetch).toHaveBeenCalled())
    expect(letzterRequestBody()).toMatchObject({
      email: 'anna@example.de',
      trackingConsent: true,
      source: 'startseite',
    })
  })

  it('schickt ohne Einwilligung keine zu, meldet die Anmeldung aber trotzdem an', async () => {
    // trackLead ist ohne Einwilligung selbst ein No-Op. Der Aufruf bleibt
    // deshalb bedingungslos, die Entscheidung liegt an einer Stelle.
    vi.mocked(hasConsent).mockReturnValue(false)
    render(<SignupForm />)
    await anmelden()

    await waitFor(() => expect(global.fetch).toHaveBeenCalled())
    expect(letzterRequestBody().trackingConsent).toBe(false)
    expect(trackLead).toHaveBeenCalled()
  })
})
