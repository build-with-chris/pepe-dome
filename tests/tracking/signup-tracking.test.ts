/**
 * Bei der Anmeldung wird festgehalten, ob gemessen werden darf.
 *
 * Die Einwilligung liegt im localStorage des Browsers und ist beim späteren
 * Klick auf den Bestätigungslink nicht mehr erreichbar. Deshalb schickt das
 * Formular sie mit und die Route legt sie zusammen mit den Meta-Cookies in die
 * Metadaten des Abonnenten. Ohne diesen Vermerk meldet die Bestätigung nichts.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    subscriber: {
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn().mockResolvedValue({}),
    },
  },
}))

vi.mock('@/lib/email-send', () => ({
  sendConfirmationEmail: vi.fn().mockResolvedValue({ id: 'mail-1' }),
}))

vi.mock('@/lib/subscribers', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/subscribers')>()
  return {
    ...actual,
    createSubscriber: vi.fn(),
  }
})

const { POST } = await import('@/app/api/subscribers/route')
const { createSubscriber } = await import('@/lib/subscribers')
const { prisma } = await import('@/lib/prisma')

let ipZaehler = 0

/** Jeder Test braucht eine eigene IP, sonst greift das Rate-Limit von 5 pro Stunde. */
function signupRequest(body: Record<string, unknown>, cookie?: string) {
  ipZaehler += 1
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-forwarded-for': `198.51.100.${ipZaehler}`,
  }
  if (cookie) headers.cookie = cookie

  return new NextRequest('https://www.pepe-dome.de/api/subscribers', {
    method: 'POST',
    body: JSON.stringify(body),
    headers,
  })
}

function metadataVon(call: number = 0) {
  const arg = vi.mocked(createSubscriber).mock.calls[call][0] as {
    metadata?: { tracking?: Record<string, unknown> }
  }
  return arg.metadata
}

describe('POST /api/subscribers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(prisma.subscriber.findUnique).mockResolvedValue(null as never)
    vi.mocked(createSubscriber).mockResolvedValue({
      id: 'sub-neu',
      email: 'neu@example.de',
    } as never)
  })

  it('legt Einwilligung und Meta-Cookies in die Metadaten', async () => {
    const response = await POST(
      signupRequest(
        { email: 'neu@example.de', trackingConsent: true, source: 'inline-form' },
        '_fbp=fb.1.1700000000000.123456789; _fbc=fb.1.1700000000000.AbCdEf'
      )
    )

    expect(response.status).toBe(201)

    const tracking = metadataVon()?.tracking
    expect(tracking).toMatchObject({
      marketingConsent: true,
      fbp: 'fb.1.1700000000000.123456789',
      fbc: 'fb.1.1700000000000.AbCdEf',
      source: 'inline-form',
    })
    expect(tracking?.at).toBeTypeOf('string')
  })

  it('vermerkt die Einwilligung auch ohne Meta-Cookies', async () => {
    // Adblocker verhindern das Pixel, nicht die Einwilligung. Genau dafür gibt
    // es den Serverweg, also darf ein fehlendes _fbp die Meldung nicht kippen.
    await POST(signupRequest({ email: 'neu@example.de', trackingConsent: true }))

    const tracking = metadataVon()?.tracking
    expect(tracking?.marketingConsent).toBe(true)
    expect(tracking).not.toHaveProperty('fbp')
  })

  it('schreibt keine Tracking-Metadaten ohne Einwilligung', async () => {
    await POST(
      signupRequest(
        { email: 'neu@example.de' },
        '_fbp=fb.1.1700000000000.123456789'
      )
    )

    expect(metadataVon()?.tracking).toBeUndefined()
  })

  it('speichert kein fbp, wenn die Einwilligung verweigert wurde', async () => {
    await POST(
      signupRequest(
        { email: 'neu@example.de', trackingConsent: false },
        '_fbp=fb.1.1700000000000.123456789'
      )
    )

    expect(metadataVon()?.tracking).toBeUndefined()
  })

  it('vermerkt die Einwilligung auch bei einer Wiederanmeldung', async () => {
    vi.mocked(prisma.subscriber.findUnique).mockResolvedValue({
      id: 'sub-alt',
      email: 'zurueck@example.de',
      status: 'UNSUBSCRIBED',
      firstName: null,
      interests: [],
      metadata: { quelle: 'alt' },
    } as never)
    vi.mocked(prisma.subscriber.update).mockResolvedValue({ id: 'sub-alt' } as never)

    const response = await POST(
      signupRequest(
        { email: 'zurueck@example.de', trackingConsent: true, source: 'newsletter-page' },
        '_fbp=fb.1.1700000000000.999'
      )
    )

    expect(response.status).toBe(201)
    const arg = vi.mocked(prisma.subscriber.update).mock.calls[0][0] as {
      data: { metadata?: { tracking?: Record<string, unknown>; quelle?: string } }
    }
    expect(arg.data.metadata?.tracking).toMatchObject({
      marketingConsent: true,
      fbp: 'fb.1.1700000000000.999',
      source: 'newsletter-page',
    })
    // Vorhandene Metadaten bleiben stehen.
    expect(arg.data.metadata?.quelle).toBe('alt')
  })

  it('antwortet unverändert einheitlich, egal ob gemessen werden darf', async () => {
    const mit = await POST(signupRequest({ email: 'a@example.de', trackingConsent: true }))
    const ohne = await POST(signupRequest({ email: 'b@example.de' }))

    expect(mit.status).toBe(201)
    expect(ohne.status).toBe(201)
    const bodyMit = await mit.json()
    const bodyOhne = await ohne.json()
    expect(bodyMit.data.message).toBe(bodyOhne.data.message)
  })
})
