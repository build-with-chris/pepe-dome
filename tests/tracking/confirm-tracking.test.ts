/**
 * Die bestätigte Anmeldung wird vom Server gemeldet, nicht vom Browser.
 *
 * Der Bestätigungslink wird meist in der Mail-App geöffnet, also in einem
 * anderen Browserkontext als die Anmeldung. Dort liegt keine Einwilligung im
 * localStorage, deshalb lief die Meldung aus dem Browser ins Leere. Sie gehört
 * dorthin, wo die Einwilligung von der Anmeldung her bekannt ist: auf den
 * Server.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    subscriber: {
      update: vi.fn().mockResolvedValue({}),
    },
  },
}))

vi.mock('@/lib/subscribers', () => ({
  confirmSubscriber: vi.fn(),
}))

vi.mock('@/lib/meta-capi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/meta-capi')>()
  return {
    ...actual,
    sendCapiEvent: vi.fn().mockResolvedValue({ forwarded: true }),
  }
})

const { GET } = await import('@/app/api/subscribers/confirm/route')
const { confirmSubscriber } = await import('@/lib/subscribers')
const { sendCapiEvent, hashEmail } = await import('@/lib/meta-capi')
const { prisma } = await import('@/lib/prisma')

const TOKEN = 'a'.repeat(64)

function confirmRequest() {
  return new NextRequest(
    `https://www.pepe-dome.de/api/subscribers/confirm?token=${TOKEN}`,
    { headers: { 'user-agent': 'Mozilla/5.0 (iPhone)' } }
  )
}

/** Abonnent, der sich mit Marketing-Einwilligung angemeldet hat. */
function subscriberMitEinwilligung(overrides: Record<string, unknown> = {}) {
  return {
    id: 'sub-1',
    email: 'Anna@Example.de',
    status: 'ACTIVE',
    metadata: {
      tracking: {
        marketingConsent: true,
        fbp: 'fb.1.1700000000000.123456789',
        fbc: 'fb.1.1700000000000.AbCdEf',
        source: 'inline-form',
      },
    },
    ...overrides,
  }
}

describe('GET /api/subscribers/confirm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(prisma.subscriber.update).mockResolvedValue({} as never)
    vi.mocked(sendCapiEvent).mockResolvedValue({ forwarded: true })
  })

  it('meldet CompleteRegistration mit Adress-Hash, fbp und fbc', async () => {
    vi.mocked(confirmSubscriber).mockResolvedValue(subscriberMitEinwilligung() as never)

    const response = await GET(confirmRequest())
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.success).toBe(true)

    expect(sendCapiEvent).toHaveBeenCalledTimes(1)
    const arg = vi.mocked(sendCapiEvent).mock.calls[0][0]
    expect(arg.event).toBe('CompleteRegistration')
    expect(arg.emailHash).toBe(hashEmail('anna@example.de'))
    expect(arg.fbp).toBe('fb.1.1700000000000.123456789')
    expect(arg.fbc).toBe('fb.1.1700000000000.AbCdEf')
    expect(arg.userAgent).toBe('Mozilla/5.0 (iPhone)')
  })

  it('schickt das Bestätigungstoken nicht an Meta mit', async () => {
    vi.mocked(confirmSubscriber).mockResolvedValue(subscriberMitEinwilligung() as never)

    await GET(confirmRequest())

    const alsText = JSON.stringify(vi.mocked(sendCapiEvent).mock.calls[0][0])
    expect(alsText).not.toContain(TOKEN)
  })

  it('meldet nichts ohne gespeicherte Marketing-Einwilligung', async () => {
    vi.mocked(confirmSubscriber).mockResolvedValue(
      subscriberMitEinwilligung({ metadata: {} }) as never
    )

    const response = await GET(confirmRequest())

    expect(response.status).toBe(200)
    expect(sendCapiEvent).not.toHaveBeenCalled()
  })

  it('meldet nichts, wenn die Einwilligung ausdrücklich verweigert wurde', async () => {
    vi.mocked(confirmSubscriber).mockResolvedValue(
      subscriberMitEinwilligung({
        metadata: { tracking: { marketingConsent: false } },
      }) as never
    )

    await GET(confirmRequest())

    expect(sendCapiEvent).not.toHaveBeenCalled()
  })

  it('meldet beim zweiten Klick auf denselben Link nicht erneut', async () => {
    vi.mocked(confirmSubscriber).mockResolvedValue(
      subscriberMitEinwilligung({
        metadata: {
          tracking: {
            marketingConsent: true,
            reportedAt: '2026-08-01T10:00:00.000Z',
          },
        },
      }) as never
    )

    await GET(confirmRequest())

    expect(sendCapiEvent).not.toHaveBeenCalled()
  })

  it('vermerkt die Meldung am Abonnenten, damit sie einmalig bleibt', async () => {
    vi.mocked(confirmSubscriber).mockResolvedValue(subscriberMitEinwilligung() as never)

    await GET(confirmRequest())

    expect(prisma.subscriber.update).toHaveBeenCalledTimes(1)
    const arg = vi.mocked(prisma.subscriber.update).mock.calls[0][0] as {
      where: { id: string }
      data: { metadata: { tracking: Record<string, unknown> } }
    }
    expect(arg.where.id).toBe('sub-1')
    expect(arg.data.metadata.tracking.reportedAt).toBeTypeOf('string')
    // Die übrigen Angaben dürfen dabei nicht verloren gehen.
    expect(arg.data.metadata.tracking.fbp).toBe('fb.1.1700000000000.123456789')
  })

  it('bestätigt die Anmeldung auch dann, wenn die Meldung scheitert', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.mocked(confirmSubscriber).mockResolvedValue(subscriberMitEinwilligung() as never)
    vi.mocked(sendCapiEvent).mockRejectedValue(new Error('Meta nicht erreichbar'))

    const response = await GET(confirmRequest())
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.success).toBe(true)
    expect(body.email).toBe('Anna@Example.de')
  })

  it('antwortet weiter mit 400, wenn das Token ungültig ist', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.mocked(confirmSubscriber).mockRejectedValue(new Error('Invalid or expired confirmation token'))

    const response = await GET(confirmRequest())

    expect(response.status).toBe(400)
    expect(sendCapiEvent).not.toHaveBeenCalled()
  })
})
