/**
 * Webhooks ohne Wirkung fassen die Datenbank nicht an.
 *
 * Während eines Versands schickt Resend für jede Mail "sent" und "delivered".
 * Im Oktober 2026 fragte jeder dieser Webhooks die Datenbank ab, auch "sent",
 * mit dem danach nichts passiert. Der Verbindungspool lief voll, und der
 * Versand selbst bekam keine Verbindung mehr.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import crypto from 'crypto'

// Eigenes Test-Secret, signiert wird wie bei Resend (Svix).
const SECRET_BYTES = Buffer.from('nur-fuer-tests')
process.env.RESEND_WEBHOOK_SECRET = `whsec_${SECRET_BYTES.toString('base64')}`

vi.mock('@/lib/prisma', () => {
  const fn = () => vi.fn().mockResolvedValue(null)
  const prisma = {
    subscriber: { findUnique: fn(), update: fn() },
    newsletter: { findUnique: fn() },
    newsletterEvent: { findFirst: fn(), create: fn() },
    newsletterStats: { upsert: fn() },
  }
  return { default: prisma, prisma }
})

const { POST } = await import('@/app/api/webhooks/resend/route')
const { prisma } = await import('@/lib/prisma')

function alleDbAufrufe() {
  const p = prisma as unknown as Record<string, Record<string, ReturnType<typeof vi.fn>>>
  return Object.values(p).flatMap((model) => Object.values(model)).reduce((n, f) => n + f.mock.calls.length, 0)
}

function webhook(type: string) {
  const body = JSON.stringify({
      type,
      created_at: new Date().toISOString(),
      data: {
        email_id: 'mail-1',
        from: 'info@pepe-dome.de',
        to: ['a@example.com'],
        subject: 'x',
        created_at: new Date().toISOString(),
        tags: { newsletter_id: 'nl-1', subscriber_id: 'sub-1' },
      },
    })
  const id = 'msg_test'
  const ts = String(Math.floor(Date.now() / 1000))
  const sig = crypto.createHmac('sha256', SECRET_BYTES).update(`${id}.${ts}.${body}`).digest('base64')
  return new NextRequest('https://www.pepe-dome.de/api/webhooks/resend', {
    method: 'POST',
    body,
    headers: { 'svix-id': id, 'svix-timestamp': ts, 'svix-signature': `v1,${sig}` },
  })
}

beforeEach(() => vi.clearAllMocks())

describe('POST /api/webhooks/resend', () => {
  it.each(['email.sent', 'email.delivery_delayed', 'email.suppressed'])(
    '%s wird ohne Datenbankabfrage bestätigt',
    async (type) => {
      const res = await POST(webhook(type))
      expect(res.status).toBe(200)
      expect(alleDbAufrufe()).toBe(0)
    }
  )

  it('email.opened fragt die Datenbank weiterhin ab', async () => {
    const res = await POST(webhook('email.opened'))
    expect(res.status).toBe(200)
    expect(alleDbAufrufe()).toBeGreaterThan(0)
  })
})
