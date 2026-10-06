/**
 * Bot-Anmeldungen werden still verworfen.
 *
 * Läuft gegen Mocks: Entscheidend ist, dass für einen Bot weder ein Datensatz
 * entsteht noch eine Bestätigungsmail rausgeht, die Antwort aber dieselbe
 * bleibt wie bei einer echten Anmeldung.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { botGrund, MINDESTZEIT_MS } from '@/lib/bot-schutz'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    subscriber: {
      findUnique: vi.fn().mockResolvedValue(null),
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
  return { ...actual, createSubscriber: vi.fn() }
})

const { POST } = await import('@/app/api/subscribers/route')
const { createSubscriber } = await import('@/lib/subscribers')
const { sendConfirmationEmail } = await import('@/lib/email-send')

let ip = 0
function anmeldung(body: Record<string, unknown>) {
  ip += 1
  return new NextRequest('https://www.pepe-dome.de/api/subscribers', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': `203.0.113.${ip}` },
  })
}

describe('botGrund', () => {
  it('lässt ein normal ausgefülltes Formular durch', () => {
    expect(botGrund({ website: '', fillMs: 8000 })).toBeNull()
  })

  it('erkennt das gefüllte unsichtbare Feld', () => {
    expect(botGrund({ website: 'https://spam.example', fillMs: 8000 })).toBe('honeypot')
  })

  it('erkennt zu schnelles Absenden', () => {
    expect(botGrund({ fillMs: MINDESTZEIT_MS - 1 })).toBe('zu-schnell')
  })

  it('erkennt Anfragen ohne unser Formular', () => {
    expect(botGrund({})).toBe('ohne-formular')
  })
})

describe('POST /api/subscribers mit Bot-Merkmalen', () => {
  beforeEach(() => {
    vi.mocked(createSubscriber).mockReset()
    vi.mocked(createSubscriber).mockResolvedValue({
      id: 'sub-1',
      email: 'echt@example.com',
    } as Awaited<ReturnType<typeof createSubscriber>>)
    vi.mocked(sendConfirmationEmail).mockClear()
  })

  it.each([
    ['Honeypot gefüllt', { website: 'x', fillMs: 9000 }],
    ['zu schnell', { fillMs: 200 }],
    ['ohne Formular', {}],
  ])('%s: gleiche Antwort, aber kein Datensatz und keine Mail', async (_name, extra) => {
    const res = await POST(anmeldung({ email: 'opfer@example.com', ...extra }))

    expect(res.status).toBe(201)
    expect(createSubscriber).not.toHaveBeenCalled()
    expect(sendConfirmationEmail).not.toHaveBeenCalled()
  })

  it('echte Anmeldung läuft weiter durch', async () => {
    const res = await POST(anmeldung({ email: 'echt@example.com', website: '', fillMs: 6000 }))

    expect(res.status).toBe(201)
    expect(createSubscriber).toHaveBeenCalledTimes(1)
    expect(sendConfirmationEmail).toHaveBeenCalledTimes(1)
  })
})
