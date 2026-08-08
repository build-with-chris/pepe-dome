/**
 * Kontaktanfragen sind ein Abschluss und werden gemeldet.
 *
 * Firmenkunden, Raummiete und Anfragen zum Training kommen über dieses
 * Formular. Ohne Meldung sieht die Kampagne davon nichts, obwohl es die
 * wertvollsten Anfragen sind.
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ContactPageClient from '@/components/custom/ContactPageClient'
import de from '@/dictionaries/de.json'
import type { Dictionary } from '@/i18n/get-dictionary'

vi.mock('@/lib/tracking', () => ({
  trackLead: vi.fn(),
}))

const { trackLead } = await import('@/lib/tracking')

function aufbauen() {
  return render(
    <ContactPageClient
      lang="de"
      dict={de as unknown as Dictionary}
      email="info@pepe-dome.de"
      whatsapp="+491796990707"
      social={{}}
    />
  )
}

function ausfuellen(container: HTMLElement) {
  fireEvent.change(container.querySelector('#name')!, { target: { value: 'Anna Beispiel' } })
  fireEvent.change(container.querySelector('#message')!, {
    target: { value: 'Wir wollen eine Firmenfeier im Dome machen.' },
  })
  fireEvent.change(container.querySelector('#phone')!, { target: { value: '0179 1234567' } })
  fireEvent.click(container.querySelector('#privacy')!)
}

describe('ContactPageClient', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    } as Response) as unknown as typeof fetch
  })

  it('meldet die Anfrage nach erfolgreichem Absenden', async () => {
    const { container } = aufbauen()
    ausfuellen(container)

    fireEvent.submit(container.querySelector('form')!)

    await waitFor(() => expect(global.fetch).toHaveBeenCalled())
    await waitFor(() => {
      expect(trackLead).toHaveBeenCalledWith(
        expect.objectContaining({ leadType: 'contact', source: 'kontakt-callback' })
      )
    })
  })

  it('meldet nichts, wenn Pflichtangaben fehlen', async () => {
    const { container } = aufbauen()
    fireEvent.change(container.querySelector('#name')!, { target: { value: 'Anna' } })

    fireEvent.submit(container.querySelector('form')!)

    await waitFor(() => {
      expect(screen.getByText(de.contact.form.errors.missing)).toBeInTheDocument()
    })
    expect(global.fetch).not.toHaveBeenCalled()
    expect(trackLead).not.toHaveBeenCalled()
  })

  it('meldet nichts, wenn der Server die Anfrage ablehnt', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: { message: 'Zu viele Anfragen.' } }),
    } as Response) as unknown as typeof fetch

    const { container } = aufbauen()
    ausfuellen(container)
    fireEvent.submit(container.querySelector('form')!)

    await waitFor(() => expect(global.fetch).toHaveBeenCalled())
    expect(trackLead).not.toHaveBeenCalled()
  })
})
