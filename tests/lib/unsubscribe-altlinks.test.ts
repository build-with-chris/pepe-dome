/**
 * Abmeldung über Links aus alten Mails.
 *
 * Alle bis Juli 2026 versendeten Newsletter tragen einen Abmeldelink der Form
 * /newsletter/unsubscribe/<subscriberId>. Die Härtung im Juli liess nur noch
 * das persönliche Token gelten, womit jeder Klick in diesen Mails ins Leere
 * lief: Die Seite kam, der Knopf meldete einen Fehler, abgemeldet wurde
 * niemand.
 *
 * Die Regel steht auch in tests/lib/subscribers.test.ts, die aber eine echte
 * Datenbank braucht und deshalb nur in `npm run test:db` läuft. Genau deshalb
 * fiel der Ausfall nicht auf. Diese Datei prüft dieselbe Regel gegen ein
 * gemocktes Prisma und läuft damit bei jedem `npm test` mit.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    subscriber: {
      findFirst: vi.fn(),
      update: vi.fn(),
    },
  },
}))

const { unsubscribeSubscriber } = await import('@/lib/subscribers')
const { prisma } = await import('@/lib/prisma')

const ID = '3f8b2c1a-4d5e-4f60-9a7b-1c2d3e4f5a6b'
const TOKEN = 'a'.repeat(64)

const AKTIV = {
  id: ID,
  email: 'test@example.com',
  status: 'ACTIVE',
  unsubscribeToken: TOKEN,
}

/** Die where-Bedingung der letzten findFirst-Abfrage. */
function letzteAbfrage() {
  return vi.mocked(prisma.subscriber.findFirst).mock.calls.at(-1)?.[0]?.where
}

describe('unsubscribeSubscriber: Links aus alten Mails', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(prisma.subscriber.findFirst).mockResolvedValue(AKTIV as never)
    vi.mocked(prisma.subscriber.update).mockResolvedValue({
      ...AKTIV,
      status: 'UNSUBSCRIBED',
    } as never)
  })

  it('sucht bei einer UUID auch nach der Subscriber-ID', async () => {
    await unsubscribeSubscriber(ID)

    expect(letzteAbfrage()).toEqual({
      OR: [{ unsubscribeToken: ID }, { id: ID }],
    })
    expect(prisma.subscriber.update).toHaveBeenCalledOnce()
  })

  it('sucht beim Token nur nach dem Token', async () => {
    await unsubscribeSubscriber(TOKEN)

    expect(letzteAbfrage()).toEqual({ unsubscribeToken: TOKEN })
  })

  /**
   * Die Lücke von damals lag an der Adresse, nicht an der ID: Mit einer
   * Adressliste liess sich der komplette Verteiler leerräumen. Eine Adresse
   * trifft das UUID-Muster nicht und darf deshalb nie in den ID-Zweig geraten.
   */
  it('sucht bei einer E-Mail-Adresse nicht nach der ID', async () => {
    vi.mocked(prisma.subscriber.findFirst).mockResolvedValue(null as never)

    await expect(unsubscribeSubscriber('fremde@adresse.de')).rejects.toThrow(
      'Subscriber not found'
    )
    expect(letzteAbfrage()).toEqual({ unsubscribeToken: 'fremde@adresse.de' })
    expect(prisma.subscriber.update).not.toHaveBeenCalled()
  })

  it('meldet niemanden ab, wenn die UUID zu niemandem gehoert', async () => {
    vi.mocked(prisma.subscriber.findFirst).mockResolvedValue(null as never)

    await expect(unsubscribeSubscriber(ID)).rejects.toThrow('Subscriber not found')
    expect(prisma.subscriber.update).not.toHaveBeenCalled()
  })

  it('verlangt ueberhaupt eine Kennung', async () => {
    await expect(unsubscribeSubscriber('')).rejects.toThrow('Missing unsubscribe token')
    expect(prisma.subscriber.findFirst).not.toHaveBeenCalled()
  })
})
