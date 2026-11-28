/**
 * Cron-Route des Ticket-Updates, ohne DB, mit gemocktem fetch und Resend.
 *
 * Liegt in tests/lib, weil vitest.config.ts tests/api/** als DB-abhängig
 * ausschliesst. Dort liefe dieser Test bei `npm test` gar nicht.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

const send = vi.hoisted(() => vi.fn())

vi.mock('@/lib/resend', () => ({
  resend: { emails: { send } },
  DEFAULT_FROM_EMAIL: 'PEPE Dome <info@pepe-dome.de>',
}))

import { GET } from '@/app/api/cron/ticket-report/route'

const API_KEY = 'geheimer-test-key'
const SECRET = 'test-secret'

const EVENTS = [
  { _id: 'spaeter', name: 'Später', start: '2099-02-01T18:00:00.000Z', end: '2099-02-01T20:00:00.000Z' },
  { _id: 'frueher', name: 'Früher', start: '2099-01-01T18:00:00.000Z', end: '2099-01-01T20:00:00.000Z' },
  { _id: 'vorbei', name: 'Vorbei', start: '2020-01-01T18:00:00.000Z', end: '2020-01-01T20:00:00.000Z' },
]

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status })
}

function request(authorized = true) {
  return new NextRequest('http://localhost:3004/api/cron/ticket-report', {
    headers: authorized ? { authorization: `Bearer ${SECRET}` } : {},
  })
}

/** Beantwortet Events und Tickets. `tickets` zählt pro Event-ID, geblättert wird wie bei Vivenu. */
function mockSnapticket(tickets: Record<string, number>, events = EVENTS) {
  const fetchMock = vi.fn(async (input: string | URL | Request) => {
    const url = new URL(String(input))
    const top = Number(url.searchParams.get('top'))
    const skip = Number(url.searchParams.get('skip'))

    if (url.pathname === '/api/events') {
      return json({ rows: events.slice(skip, skip + top), total: events.length })
    }

    const total = tickets[url.searchParams.get('event') ?? ''] ?? 0
    const count = Math.max(0, Math.min(top, total - skip))
    const rows = Array.from({ length: count }, () => ({
      createdAt: '2020-01-01T00:00:00.000Z',
      name: 'Erika Mustermann',
      email: 'erika@example.com',
    }))
    return json({ rows, total })
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

describe('GET /api/cron/ticket-report', () => {
  beforeEach(() => {
    vi.stubEnv('CRON_SECRET', SECRET)
    vi.stubEnv('SNAPTICKET_API_KEY', API_KEY)
    vi.stubEnv('TICKET_REPORT_RECIPIENTS', 'a@example.com, b@example.com')
    send.mockReset()
    send.mockResolvedValue({ data: { id: 'mail' }, error: null })
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('antwortet ohne gültiges CRON_SECRET mit 401 und verschickt nichts', async () => {
    const fetchMock = mockSnapticket({})

    const response = await GET(request(false))

    expect(response.status).toBe(401)
    expect(fetchMock).not.toHaveBeenCalled()
    expect(send).not.toHaveBeenCalled()
  })

  it('schickt die Tabelle an alle Adressen, sortiert und ohne vergangene Shows', async () => {
    mockSnapticket({ frueher: 2, spaeter: 0, vorbei: 5 })

    const response = await GET(request())

    expect(response.status).toBe(200)
    expect(send).toHaveBeenCalledTimes(1)
    const mail = send.mock.calls[0][0]
    expect(mail.to).toEqual(['a@example.com', 'b@example.com'])
    expect(mail.html.indexOf('Früher')).toBeLessThan(mail.html.indexOf('Später'))
    expect(mail.html).not.toContain('Vorbei')
  })

  it('blättert über skip, wenn eine Show mehr als 100 Tickets hat', async () => {
    const fetchMock = mockSnapticket({ frueher: 250 }, [EVENTS[1]])

    await GET(request())

    const ticketCalls = fetchMock.mock.calls
      .map(([input]) => new URL(String(input)))
      .filter((url) => url.pathname === '/api/tickets')
    expect(ticketCalls.map((url) => url.searchParams.get('skip'))).toEqual(['0', '100', '200'])
    expect(ticketCalls.every((url) => url.searchParams.get('status') === 'VALID')).toBe(true)
    expect(send.mock.calls[0][0].html).toContain('>250</td>')
  })

  it('schickt ohne kommende Shows nur den Hinweis', async () => {
    mockSnapticket({}, [EVENTS[2]])

    const response = await GET(request())

    expect(response.status).toBe(200)
    expect(send.mock.calls[0][0].html).toContain('Keine kommenden Shows.')
  })

  it('gibt keine Kundendaten in die Mail', async () => {
    mockSnapticket({ frueher: 1 })

    await GET(request())

    const { html } = send.mock.calls[0][0]
    expect(html).not.toContain('Erika')
    expect(html).not.toContain('erika@example.com')
  })

  it('verschickt nichts, wenn ein Ticket-Abruf scheitert, und nennt den Key nicht im Log', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: string | URL | Request) =>
        new URL(String(input)).pathname === '/api/events'
          ? json({ rows: [EVENTS[0], EVENTS[1]], total: 2 })
          : json({ error: 'kaputt' }, 503)
      )
    )

    const response = await GET(request())

    expect(response.status).toBe(500)
    expect(send).not.toHaveBeenCalled()
    const log = JSON.stringify(vi.mocked(console.error).mock.calls)
    expect(log).toContain('503')
    expect(log).not.toContain(API_KEY)
  })

  it('verschickt nichts, wenn Snapticket weniger liefert als angekündigt', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: string | URL | Request) =>
        new URL(String(input)).pathname === '/api/events'
          ? json({ rows: [EVENTS[1]], total: 1 })
          : json({ rows: [], total: 5 })
      )
    )

    const response = await GET(request())

    expect(response.status).toBe(500)
    expect(send).not.toHaveBeenCalled()
  })

  it.each(['SNAPTICKET_API_KEY', 'TICKET_REPORT_RECIPIENTS'])(
    'antwortet ohne %s mit 500 und verschickt nichts',
    async (name) => {
      vi.stubEnv(name, '')
      mockSnapticket({})

      const response = await GET(request())

      expect(response.status).toBe(500)
      expect(send).not.toHaveBeenCalled()
      expect(JSON.stringify(vi.mocked(console.error).mock.calls)).toContain(name)
    }
  )

  it('antwortet mit 500, wenn Resend den Versand ablehnt', async () => {
    mockSnapticket({})
    send.mockResolvedValue({ data: null, error: { message: 'abgelehnt' } })

    const response = await GET(request())

    expect(response.status).toBe(500)
  })
})
