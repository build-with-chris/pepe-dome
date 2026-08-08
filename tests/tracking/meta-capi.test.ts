/**
 * Der serverseitige Meldeweg zu Meta.
 *
 * Zwei Stellen benutzen ihn: /api/track für Ereignisse aus dem Browser und die
 * Bestätigungsroute für CompleteRegistration. Deshalb liegt er in einer eigenen
 * Datei und wird hier für sich geprüft.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { sendCapiEvent, hashEmail } from '@/lib/meta-capi'

const TOKEN = 'test-access-token'

function okResponse() {
  return { ok: true, status: 200 } as Response
}

describe('hashEmail', () => {
  it('hasht kleingeschrieben und getrimmt, damit dieselbe Adresse denselben Hash ergibt', () => {
    const a = hashEmail('  Max@Example.DE ')
    const b = hashEmail('max@example.de')

    expect(a).toBe(b)
    expect(a).toMatch(/^[a-f0-9]{64}$/)
  })

  it('gibt für leere Eingaben null zurück, damit kein Hash von nichts verschickt wird', () => {
    expect(hashEmail('')).toBeNull()
    expect(hashEmail('   ')).toBeNull()
  })
})

describe('sendCapiEvent', () => {
  let fetchMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    fetchMock = vi.fn().mockResolvedValue(okResponse())
    global.fetch = fetchMock as unknown as typeof fetch
    process.env.META_CAPI_ACCESS_TOKEN = TOKEN
    delete process.env.META_CAPI_TEST_EVENT_CODE
  })

  afterEach(() => {
    vi.restoreAllMocks()
    delete process.env.META_CAPI_ACCESS_TOKEN
    delete process.env.META_CAPI_TEST_EVENT_CODE
  })

  it('meldet nichts, wenn kein Zugriffstoken gesetzt ist', async () => {
    delete process.env.META_CAPI_ACCESS_TOKEN

    const result = await sendCapiEvent({
      event: 'CompleteRegistration',
      eventId: 'evt-1',
      sourceUrl: 'https://www.pepe-dome.de/de',
    })

    expect(result).toEqual({ forwarded: false, reason: 'not_configured' })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('schickt Ereignisname, eventId und Quelle an Meta', async () => {
    const result = await sendCapiEvent({
      event: 'CompleteRegistration',
      eventId: 'evt-2',
      sourceUrl: 'https://www.pepe-dome.de/de/newsletter/bestaetigt',
      customData: { content_name: 'double-opt-in', status: 'confirmed' },
    })

    expect(result.forwarded).toBe(true)
    expect(fetchMock).toHaveBeenCalledTimes(1)

    const [url, init] = fetchMock.mock.calls[0]
    expect(String(url)).toContain('graph.facebook.com')
    expect(String(url)).toContain('/events?access_token=')

    const payload = JSON.parse((init as RequestInit).body as string)
    const event = payload.data[0]
    expect(event.event_name).toBe('CompleteRegistration')
    expect(event.event_id).toBe('evt-2')
    expect(event.event_source_url).toBe('https://www.pepe-dome.de/de/newsletter/bestaetigt')
    expect(event.action_source).toBe('website')
    expect(event.custom_data).toEqual({ content_name: 'double-opt-in', status: 'confirmed' })
    expect(typeof event.event_time).toBe('number')
  })

  it('reicht Adress-Hash, fbp und fbc als user_data mit durch', async () => {
    await sendCapiEvent({
      event: 'Lead',
      eventId: 'evt-3',
      sourceUrl: 'https://www.pepe-dome.de/de',
      emailHash: 'a'.repeat(64),
      fbp: 'fb.1.1700000000000.123456789',
      fbc: 'fb.1.1700000000000.AbCdEf',
      clientIp: '203.0.113.7',
      userAgent: 'Mozilla/5.0 (iPhone)',
    })

    const payload = JSON.parse(fetchMock.mock.calls[0][1].body as string)
    const userData = payload.data[0].user_data

    expect(userData.em).toEqual(['a'.repeat(64)])
    expect(userData.fbp).toBe('fb.1.1700000000000.123456789')
    expect(userData.fbc).toBe('fb.1.1700000000000.AbCdEf')
    expect(userData.client_ip_address).toBe('203.0.113.7')
    expect(userData.client_user_agent).toBe('Mozilla/5.0 (iPhone)')
  })

  it('lässt leere Felder weg, statt sie als null zu senden', async () => {
    await sendCapiEvent({
      event: 'Lead',
      eventId: 'evt-4',
      sourceUrl: 'https://www.pepe-dome.de/de',
      emailHash: null,
      fbp: null,
      fbc: undefined,
    })

    const userData = JSON.parse(fetchMock.mock.calls[0][1].body as string).data[0].user_data

    expect(userData).not.toHaveProperty('em')
    expect(userData).not.toHaveProperty('fbp')
    expect(userData).not.toHaveProperty('fbc')
  })

  it('setzt den Testcode nur, wenn er in der Umgebung steht', async () => {
    await sendCapiEvent({
      event: 'Lead',
      eventId: 'evt-5',
      sourceUrl: 'https://www.pepe-dome.de/de',
    })
    expect(JSON.parse(fetchMock.mock.calls[0][1].body as string)).not.toHaveProperty(
      'test_event_code'
    )

    process.env.META_CAPI_TEST_EVENT_CODE = 'TEST1234'
    await sendCapiEvent({
      event: 'Lead',
      eventId: 'evt-6',
      sourceUrl: 'https://www.pepe-dome.de/de',
    })
    expect(JSON.parse(fetchMock.mock.calls[1][1].body as string).test_event_code).toBe('TEST1234')
  })

  it('meldet einen Fehler von Meta zurück, ohne die Antwort zu loggen', async () => {
    // Metas Antworttext kann das Zugriffstoken enthalten. Logs sind kein
    // sicherer Ort dafür, deshalb darf nur der Status hinein.
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    fetchMock.mockResolvedValue({
      ok: false,
      status: 400,
      text: async () => `Fehler mit ${TOKEN}`,
    } as unknown as Response)

    const result = await sendCapiEvent({
      event: 'Lead',
      eventId: 'evt-7',
      sourceUrl: 'https://www.pepe-dome.de/de',
    })

    expect(result).toEqual({ forwarded: false, reason: 'upstream_error' })
    const geloggt = consoleError.mock.calls.flat().join(' ')
    expect(geloggt).toContain('400')
    expect(geloggt).not.toContain(TOKEN)
  })

  it('wirft nicht, wenn das Netz wegbricht', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    fetchMock.mockRejectedValue(new Error('network down'))

    const result = await sendCapiEvent({
      event: 'Lead',
      eventId: 'evt-8',
      sourceUrl: 'https://www.pepe-dome.de/de',
    })

    expect(result).toEqual({ forwarded: false, reason: 'internal_error' })
  })
})
