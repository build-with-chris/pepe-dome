/**
 * Der Newsletter-Versand bucht nach jedem Block.
 *
 * Im August 2026 ging "Nudeln mit Banane" an alle raus, in der Datenbank blieb
 * aber ein Entwurf mit 0 Empfängern: Status, Empfängerzahl und SENT-Ereignisse
 * wurden erst ganz am Ende geschrieben, und so weit kam der Lauf nicht. Diese
 * Tests halten fest, dass ein Abbruch jetzt einen ehrlichen Zwischenstand
 * hinterlässt und kein zweiter voller Versand möglich ist.
 *
 * Läuft gegen Mocks, nicht gegen eine Datenbank.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'

const { gebucht } = vi.hoisted(() => ({ gebucht: [] as number[] }))

vi.mock('@/lib/prisma', () => {
  const prisma = {
    newsletter: { findUnique: vi.fn(), updateMany: vi.fn(), update: vi.fn() },
    subscriber: { findMany: vi.fn() },
    newsletterEvent: { findMany: vi.fn(), createMany: vi.fn() },
    newsletterStats: { upsert: vi.fn(), update: vi.fn() },
    // Array-Form wie in Prisma: alle Operationen gemeinsam. Gezählt wird
    // nur, was als Ganzes durchging, so wie eine echte Transaktion.
    $transaction: vi.fn(async (ops: Promise<unknown>[]) => {
      const aufrufe = prisma.newsletter.update.mock.calls
      const erhoehung = aufrufe[aufrufe.length - 1]?.[0]?.data?.recipientCount?.increment ?? 0
      const ergebnis = await Promise.all(ops)
      gebucht.push(erhoehung)
      return ergebnis
    }),
  }
  return { default: prisma, prisma }
})

vi.mock('@/lib/resend', () => ({
  resend: { batch: { send: vi.fn() }, emails: { send: vi.fn() } },
  DEFAULT_FROM_EMAIL: 'Pepe Dome <info@example.com>',
  generateEmailUrls: vi.fn(),
  batchSendEmails: vi.fn(),
}))

vi.mock('@react-email/render', () => ({ render: vi.fn().mockResolvedValue('<html></html>') }))
vi.mock('@/components/email/templates/NewsletterTemplate', () => ({ default: () => null }))
vi.mock('@/lib/newsletter-content', () => ({
  // Jedes Mal ein frisches Objekt, der Versand darf es verändern.
  buildViewModelFromNewsletter: vi.fn(async () => ({
    baseUrl: 'https://www.example.com',
    webViewUrl: 'https://www.example.com/newsletter/nudeln',
  })),
}))
vi.mock('@/lib/newsletter-text', () => ({ renderNewsletterText: vi.fn(() => 'text') }))

const { sendNewsletter, BUCHUNG_PAUSEN_MS } = await import('@/lib/email-send')
// Im Test ohne Wartezeit zwischen den Buchungsversuchen.
BUCHUNG_PAUSEN_MS.splice(0, BUCHUNG_PAUSEN_MS.length, 0, 0, 0)
const { prisma } = await import('@/lib/prisma')
const { resend } = await import('@/lib/resend')
const { renderNewsletterText } = await import('@/lib/newsletter-text')

const db = prisma as unknown as {
  newsletter: Record<'findUnique' | 'updateMany' | 'update', ReturnType<typeof vi.fn>>
  subscriber: Record<'findMany', ReturnType<typeof vi.fn>>
  newsletterEvent: Record<'findMany' | 'createMany', ReturnType<typeof vi.fn>>
  newsletterStats: Record<'upsert' | 'update', ReturnType<typeof vi.fn>>
}
const batchSend = resend.batch.send as unknown as ReturnType<typeof vi.fn>

function abonnenten(n: number) {
  return Array.from({ length: n }, (_, i) => ({
    id: `sub-${i}`,
    email: `person${i}@example.com`,
    firstName: null,
    unsubscribeToken: `tok-${i}`,
  }))
}

/** Summe der Empfänger aus erfolgreich gebuchten Blöcken. */
function gebuchteEmpfaenger() {
  return gebucht.reduce((a, b) => a + b, 0)
}

function letzterStatus() {
  const mitStatus = db.newsletter.update.mock.calls.filter(([arg]) => 'status' in arg.data)
  return mitStatus[mitStatus.length - 1]?.[0].data.status
}

beforeEach(() => {
  vi.clearAllMocks()
  gebucht.length = 0
  db.newsletter.findUnique.mockResolvedValue({
    id: 'nl-1',
    subject: 'Nudeln mit Banane',
    status: 'DRAFT',
    content: [],
  })
  db.newsletter.updateMany.mockResolvedValue({ count: 1 })
  db.newsletter.update.mockResolvedValue({})
  db.newsletterEvent.createMany.mockResolvedValue({ count: 0 })
  db.newsletterStats.upsert.mockResolvedValue({})
  db.newsletterStats.update.mockResolvedValue({})
  batchSend.mockImplementation(async (chunk: Array<{ to: string }>) => ({
    data: { data: chunk.map((_, i) => ({ id: `mail-${i}` })) },
    error: null,
  }))
})

describe('sendNewsletter, echter Versand', () => {
  it('sperrt zuerst und bucht danach jeden Block einzeln', async () => {
    db.subscriber.findMany.mockResolvedValue(abonnenten(250))

    const result = await sendNewsletter('nl-1')

    expect(result.success).toBe(250)
    expect(db.newsletter.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'nl-1', status: { in: ['DRAFT', 'SCHEDULED'] } },
        data: expect.objectContaining({ status: 'SENDING', recipientCount: 0 }),
      })
    )
    expect(batchSend).toHaveBeenCalledTimes(3)
    expect(db.newsletterEvent.createMany).toHaveBeenCalledTimes(3)
    expect(gebuchteEmpfaenger()).toBe(250)
    expect(letzterStatus()).toBe('SENT')
  })

  it('hinterlässt nach einem Abbruch den echten Zwischenstand', async () => {
    db.subscriber.findMany.mockResolvedValue(abonnenten(250))
    // Erster Block geht durch, beim zweiten bricht der Lauf hart ab, so wie
    // es bei einer überschrittenen Zeitgrenze passiert.
    batchSend
      .mockImplementationOnce(async (chunk: Array<{ to: string }>) => ({
        data: { data: chunk.map((_, i) => ({ id: `mail-${i}` })) },
        error: null,
      }))
      .mockImplementationOnce(async () => {
        throw new Error('Netzwerkfehler')
      })
    // Ab dem zweiten Buchen ist die Datenbank dauerhaft weg, auch alle
    // Wiederholungen scheitern.
    db.newsletterEvent.createMany
      .mockResolvedValueOnce({ count: 100 })
      .mockRejectedValue(new Error('Funktion beendet'))

    // Der zweite Block scheitert beim Senden und wird als Fehler gezählt, der
    // dritte reisst den Lauf beim Buchen ab.
    await expect(sendNewsletter('nl-1')).rejects.toThrow('Funktion beendet')
    // Nach dem gescheiterten Buchen geht kein weiterer Block mehr raus.
    expect(batchSend).toHaveBeenCalledTimes(3)

    expect(gebuchteEmpfaenger()).toBe(100)
    // Nie auf SENT gesetzt: Der Newsletter bleibt auf SENDING und damit für
    // "An fehlende senden" offen, für einen zweiten vollen Versand gesperrt.
    expect(letzterStatus()).toBeUndefined()
  })

  it('überbrückt einen kurzen Engpass beim Buchen, statt abzubrechen', async () => {
    db.subscriber.findMany.mockResolvedValue(abonnenten(250))
    // Genau so im Oktober 2026: kein freier Platz im Verbindungspool.
    db.newsletter.update
      .mockResolvedValueOnce({})
      .mockRejectedValueOnce(new Error('ECHECKOUTTIMEOUT'))

    const result = await sendNewsletter('nl-1')

    expect(result.success).toBe(250)
    expect(batchSend).toHaveBeenCalledTimes(3)
    expect(letzterStatus()).toBe('SENT')
  })

  it('verweigert einen zweiten vollen Versand nach einem Abbruch', async () => {
    db.newsletter.findUnique.mockResolvedValue({ id: 'nl-1', subject: 'x', status: 'SENDING', content: [] })

    await expect(sendNewsletter('nl-1')).rejects.toThrow('Newsletter already sent')
    expect(batchSend).not.toHaveBeenCalled()
  })

  it('verweigert den Versand, wenn jemand anders schneller gesperrt hat', async () => {
    db.subscriber.findMany.mockResolvedValue(abonnenten(3))
    db.newsletter.updateMany.mockResolvedValue({ count: 0 })

    await expect(sendNewsletter('nl-1')).rejects.toThrow('Newsletter already sent')
    expect(batchSend).not.toHaveBeenCalled()
  })

  it('setzt den Status zurück, wenn gar nichts rausging', async () => {
    db.subscriber.findMany.mockResolvedValue(abonnenten(3))
    batchSend.mockResolvedValue({ data: null, error: { message: 'Tageslimit erreicht' } })

    const result = await sendNewsletter('nl-1')

    expect(result.success).toBe(0)
    expect(result.failed).toBe(3)
    expect(letzterStatus()).toBe('DRAFT')
  })

  it('setzt einen abgebrochenen Versand über "An fehlende senden" fort', async () => {
    db.newsletter.findUnique.mockResolvedValue({ id: 'nl-1', subject: 'x', status: 'SENDING', content: [] })
    db.subscriber.findMany.mockResolvedValue(abonnenten(150))
    db.newsletterEvent.findMany.mockResolvedValue(
      abonnenten(100).map((s) => ({ subscriberId: s.id }))
    )

    const result = await sendNewsletter('nl-1', { resumeMissing: true })

    expect(result.total).toBe(50)
    expect(gebuchteEmpfaenger()).toBe(50)
    expect(letzterStatus()).toBe('SENT')
  })
})

describe('sendNewsletter, Testversand', () => {
  const webViewUrlDerMail = () =>
    (vi.mocked(renderNewsletterText).mock.calls[0][0] as { webViewUrl: string }).webViewUrl

  it('verlinkt bei einem Entwurf auf die Vorschau im Admin statt auf einen 404', async () => {
    await sendNewsletter('nl-1', { testRecipients: ['team@example.com'] })

    expect(webViewUrlDerMail()).toBe('https://www.example.com/admin/newsletters/nl-1/vorschau')
    // Testversand bucht nichts und sperrt nichts.
    expect(db.newsletter.updateMany).not.toHaveBeenCalled()
    expect(db.newsletterEvent.createMany).not.toHaveBeenCalled()
  })

  it('behält bei einem versendeten Newsletter die öffentliche Seite', async () => {
    db.newsletter.findUnique.mockResolvedValue({ id: 'nl-1', subject: 'x', status: 'SENT', content: [] })

    await sendNewsletter('nl-1', { testRecipients: ['team@example.com'] })

    expect(webViewUrlDerMail()).toBe('https://www.example.com/newsletter/nudeln')
  })
})
