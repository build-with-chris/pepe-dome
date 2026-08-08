/**
 * Die Terminliste zeigt, was der Server mitgeschickt hat.
 *
 * Wer aus einer Anzeige auf /events kommt, soll Termine sehen und nicht erst
 * ein Skelett, das auf zwei nacheinander laufende Abrufe wartet. Nachgeladen
 * wird nur noch beim Blättern.
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import EventsListingClient from '@/components/custom/EventsListingClient'
import de from '@/dictionaries/de.json'
import type { Dictionary } from '@/i18n/get-dictionary'

const dict = de as unknown as Dictionary

function event(overrides: Record<string, unknown> = {}) {
  return {
    id: 'evt-1',
    slug: 'qigong-am-morgen',
    title: 'Qigong am Morgen',
    subtitle: null,
    description: 'Sanfte Bewegung unter der Kuppel.',
    // Weit in der Zukunft, damit der Vergangenheitsfilter nicht zuschlägt.
    date: '2099-08-12T00:00:00.000Z',
    endDate: null,
    time: '09:00',
    location: 'Pepe Dome',
    category: 'WORKSHOP',
    ticketUrl: null,
    price: 'Eintritt frei',
    trailerUrl: null,
    imageUrl: null,
    featured: false,
    highlights: [],
    ...overrides,
  }
}

describe('EventsListingClient', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    } as Response) as unknown as typeof fetch
  })

  it('zeigt die vom Server gelieferten Termine ohne einen einzigen Abruf', async () => {
    render(
      <EventsListingClient
        lang="de"
        dict={dict}
        initialMonth={{ year: 2099, month: 8 }}
        initialEvents={[event()]}
      />
    )

    expect(screen.getByText('Qigong am Morgen')).toBeInTheDocument()
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('nennt den vom Server gewählten Monat, nicht den aktuellen', () => {
    render(
      <EventsListingClient
        lang="de"
        dict={dict}
        initialMonth={{ year: 2099, month: 8 }}
        initialEvents={[event()]}
      />
    )

    expect(screen.getAllByText(/August 2099/).length).toBeGreaterThan(0)
  })

  it('lädt beim Blättern genau einen Monat nach', async () => {
    render(
      <EventsListingClient
        lang="de"
        dict={dict}
        initialMonth={{ year: 2099, month: 8 }}
        initialEvents={[event()]}
      />
    )

    fireEvent.click(screen.getAllByLabelText(/Nächster Monat|Next month/i)[0])

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1))
    expect(String(vi.mocked(global.fetch).mock.calls[0][0])).toContain(
      '/api/events?year=2099&month=9'
    )
  })

  it('holt die Termine selbst, wenn der Server nichts mitgeben konnte', async () => {
    // Rückfallebene für den Fall, dass die Datenbank beim Rendern der Seite
    // nicht erreichbar war. Dann bleibt das alte Verhalten.
    global.fetch = vi.fn((url: string) => {
      if (String(url).includes('next-available')) {
        return Promise.resolve({ ok: true, json: async () => ({ year: 2099, month: 8 }) } as Response)
      }
      return Promise.resolve({ ok: true, json: async () => [event()] } as Response)
    }) as unknown as typeof fetch

    render(<EventsListingClient lang="de" dict={dict} />)

    await waitFor(() => {
      expect(screen.getByText('Qigong am Morgen')).toBeInTheDocument()
    })
  })
})
