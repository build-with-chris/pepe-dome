// @vitest-environment node
/**
 * Admin-API für Verträge: wer hinein darf, was gespeichert wird, wann ein
 * Vertrag gesperrt ist und wie das Einfrieren beim Statuswechsel läuft.
 *
 * Läuft gegen einen Prisma-Mock, nicht gegen eine Datenbank. Die Rollenprüfung
 * ist echt: Gemockt wird nur Clerk darunter, damit ein Fehler im Guard einer
 * Route hier auffällt. Alle Namen und Beträge sind erfunden.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { Prisma } from '@prisma/client'
import { dokumentAlsText, istDokument, type Dokument } from '@/lib/vertraege/dokument'

vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
  currentUser: vi.fn(),
}))

vi.mock('@/lib/prisma', () => {
  const prisma = {
    contract: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    contractSetting: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
  }
  return { default: prisma, prisma }
})

// Das Zeichnen selbst prüft tests/lib/vertraege-vorlage-angebot.test.ts.
// Hier zählt, welches Dokument die Route zum Zeichnen gibt.
vi.mock('@/lib/vertraege/pdf', () => ({
  pdfAntwort: vi.fn(async () => new Response('pdf', { headers: { 'Content-Type': 'application/pdf' } })),
}))

const { auth, currentUser } = await import('@clerk/nextjs/server')
const { prisma } = await import('@/lib/prisma')
const { pdfAntwort } = await import('@/lib/vertraege/pdf')
const liste = await import('@/app/api/admin/contracts/route')
const einzeln = await import('@/app/api/admin/contracts/[id]/route')
const pdf = await import('@/app/api/admin/contracts/[id]/pdf/route')
const probe = await import('@/app/api/admin/contracts/pdf-probe/route')
const einstellungen = await import('@/app/api/admin/contracts/settings/route')

const mock = prisma as unknown as {
  contract: Record<'findMany' | 'findUnique' | 'create' | 'update' | 'delete', ReturnType<typeof vi.fn>>
  contractSetting: Record<'findUnique' | 'upsert', ReturnType<typeof vi.fn>>
}

function anmelden(role: string | null) {
  vi.mocked(auth).mockResolvedValue({ userId: role ? 'user-1' : null } as never)
  vi.mocked(currentUser).mockResolvedValue(
    role
      ? ({
          id: 'user-1',
          primaryEmailAddressId: 'e1',
          emailAddresses: [{ id: 'e1', emailAddress: 'team@example.org' }],
          publicMetadata: { role },
        } as never)
      : null
  )
}

const params = { params: Promise.resolve({ id: 'c1' }) }

function anfrage(method: string, body?: unknown) {
  return new NextRequest('http://localhost/api/admin/contracts/c1', {
    method,
    ...(body === undefined
      ? {}
      : { body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } }),
  })
}

const gueltig = {
  type: 'MIETE',
  partnerName: 'Jana Beispiel',
  partnerEmail: 'jana@example.org',
  eventDate: '2031-05-17',
  data: {
    anlass: 'Feier zum Abschluss',
    termin: 'Samstag, 17.05.2031',
    preisVereinbart: '222,50',
    anzahlungProzent: '50',
    kaution: true,
    kautionBetrag: '444',
  },
}

/** Eine Zeile, wie Prisma sie zurückgibt. */
function zeile(aenderung: Record<string, unknown> = {}) {
  return {
    id: 'c1',
    type: 'MIETE',
    status: 'ENTWURF',
    title: 'Vereinbarung Feier zum Abschluss Jana Beispiel',
    partnerName: 'Jana Beispiel',
    partnerEmail: null,
    partnerPhone: null,
    partnerAddress: null,
    eventDate: new Date('2031-05-17'),
    data: { anlass: 'Feier zum Abschluss', termin: 'Samstag, 17.05.2031', preisVereinbart: 222.5 },
    snapshot: null,
    sentAt: null,
    createdBy: 'user-1',
    ...aenderung,
  }
}

const AUFRUFE: Array<[string, () => Promise<Response>]> = [
  ['GET /contracts', () => liste.GET()],
  ['POST /contracts', () => liste.POST(anfrage('POST', gueltig))],
  ['GET /contracts/:id', () => einzeln.GET(anfrage('GET'), params)],
  ['PATCH /contracts/:id', () => einzeln.PATCH(anfrage('PATCH', { status: 'BEZAHLT' }), params)],
  ['DELETE /contracts/:id', () => einzeln.DELETE(anfrage('DELETE'), params)],
  ['GET /contracts/:id/pdf', () => pdf.GET(anfrage('GET'), params)],
  ['GET /contracts/pdf-probe', () => probe.GET()],
  ['GET /contracts/settings', () => einstellungen.GET()],
  [
    'PUT /contracts/settings',
    () => einstellungen.PUT(anfrage('PUT', { halbtag: '111', ganztag: '222', ticketanteil: '55' })),
  ],
]

beforeEach(() => {
  for (const fn of Object.values(mock.contract)) fn.mockReset()
  for (const fn of Object.values(mock.contractSetting)) fn.mockReset()
  mock.contractSetting.findUnique.mockResolvedValue(null)
  mock.contractSetting.upsert.mockResolvedValue({})
  vi.mocked(pdfAntwort).mockClear()
  mock.contract.create.mockImplementation(({ data }: { data: object }) =>
    Promise.resolve({ id: 'c1', status: 'ENTWURF', ...data })
  )
  mock.contract.update.mockImplementation(({ data }: { data: object }) =>
    Promise.resolve({ ...zeile(), ...data })
  )
  anmelden('super_admin')
})

describe('Zugriff auf die Vertrags-Routen', () => {
  it.each(AUFRUFE)('%s antwortet ohne Login mit 401', async (_name, aufruf) => {
    anmelden(null)
    expect((await aufruf()).status).toBe(401)
  })

  it.each(
    AUFRUFE.flatMap(([name, aufruf]) => [
      [name, 'editor', aufruf] as const,
      [name, 'viewer', aufruf] as const,
    ])
  )('%s antwortet für %s mit 403', async (_name, rolle, aufruf) => {
    anmelden(rolle)
    expect((await aufruf()).status).toBe(403)
  })

  it('fasst ohne Super Admin die Datenbank nicht an', async () => {
    anmelden('editor')
    for (const [, aufruf] of AUFRUFE) await aufruf()
    for (const fn of Object.values(mock.contract)) expect(fn).not.toHaveBeenCalled()
    for (const fn of Object.values(mock.contractSetting)) expect(fn).not.toHaveBeenCalled()
    expect(pdfAntwort).not.toHaveBeenCalled()
  })
})

describe('POST /api/admin/contracts', () => {
  it('legt einen Entwurf an: Titel gebildet, Beträge als Zahlen, mit Ersteller', async () => {
    const res = await liste.POST(anfrage('POST', gueltig))
    expect(res.status).toBe(201)

    const { data } = mock.contract.create.mock.calls[0][0]
    expect(data).toMatchObject({
      type: 'MIETE',
      title: 'Vereinbarung Feier zum Abschluss Jana Beispiel',
      partnerName: 'Jana Beispiel',
      partnerEmail: 'jana@example.org',
      partnerPhone: null,
      eventDate: new Date('2031-05-17'),
      createdBy: 'user-1',
    })
    expect(data.data).toMatchObject({ preisVereinbart: 222.5, anzahlungProzent: 50, kautionBetrag: 444 })
    // Der Status kommt aus dem Default der Datenbank, nicht aus der Anfrage.
    expect(data.status).toBeUndefined()
    expect(data.snapshot).toBeUndefined()
  })

  it.each([
    ['ohne Typ', { ...gueltig, type: undefined }],
    ['mit unbekanntem Typ', { ...gueltig, type: 'KUENSTLER' }],
    ['ohne Namen', { ...gueltig, partnerName: '' }],
    ['ohne Anlass', { ...gueltig, data: { ...gueltig.data, anlass: '' } }],
    ['mit Text als Preis', { ...gueltig, data: { ...gueltig.data, preisVereinbart: 'viel' } }],
  ])('lehnt einen Vertrag %s mit 400 ab', async (_fall, body) => {
    const res = await liste.POST(anfrage('POST', body))
    expect(res.status).toBe(400)
    expect(mock.contract.create).not.toHaveBeenCalled()
  })
})

describe('Künstlervertrag und Veranstaltervertrag anlegen', () => {
  const auftritt = {
    partnerName: 'Duo Beispiel',
    eventDate: '2031-05-17',
    data: { titel: 'Beispielshow', termin: 'Samstag, 17.05.2031', anteilGegenseite: '55 %' },
  }

  it.each([
    ['KUENSTLER', 'Künstlervertrag Beispielshow Duo Beispiel'],
    ['VERANSTALTER', 'Veranstaltervertrag Beispielshow Duo Beispiel'],
  ])('legt einen Vertrag vom Typ %s an', async (type, titel) => {
    const res = await liste.POST(anfrage('POST', { ...auftritt, type }))
    expect(res.status).toBe(201)
    const { data } = mock.contract.create.mock.calls[0][0]
    expect(data).toMatchObject({ type, title: titel })
    expect(data.data).toMatchObject({ verguetung: 'ticketanteil', anteilGegenseite: 55, gage: null })
  })

  it('nimmt im Künstlervertrag eine feste Gage an', async () => {
    const res = await liste.POST(
      anfrage('POST', { ...auftritt, type: 'KUENSTLER', data: { ...auftritt.data, verguetung: 'gage', gage: '777' } })
    )
    expect(res.status).toBe(201)
    expect(mock.contract.create.mock.calls[0][0].data.data).toMatchObject({ verguetung: 'gage', gage: 777 })
  })

  it('lehnt eine feste Gage im Veranstaltervertrag mit 400 ab', async () => {
    const res = await liste.POST(
      anfrage('POST', { ...auftritt, type: 'VERANSTALTER', data: { ...auftritt.data, verguetung: 'gage', gage: '777' } })
    )
    expect(res.status).toBe(400)
    expect(mock.contract.create).not.toHaveBeenCalled()
  })

  it('friert einen Künstlervertrag beim Verschicken ein', async () => {
    mock.contract.findUnique.mockResolvedValue(
      zeile({
        type: 'KUENSTLER',
        title: 'Künstlervertrag Beispielshow Duo Beispiel',
        partnerName: 'Duo Beispiel',
        data: { titel: 'Beispielshow', termin: 'Samstag, 17.05.2031', anteilGegenseite: 55 },
      })
    )
    await einzeln.PATCH(anfrage('PATCH', { status: 'VERSCHICKT' }), params)
    const { data } = mock.contract.update.mock.calls[0][0]
    expect(dokumentAlsText(data.snapshot as Dokument)).toContain('55 % für Duo Beispiel, 45 % für den Pepe Dome')
  })
})

describe('Wenn die Datenbank beim Speichern ausfällt', () => {
  it('antwortet POST mit 500 und einer lesbaren Meldung statt mit einer leeren Antwort', async () => {
    mock.contract.create.mockRejectedValue(new Error('Verbindung weg'))
    const res = await liste.POST(anfrage('POST', gueltig))
    expect(res.status).toBe(500)
    expect((await res.json()).error).toContain('nicht in der Datenbank speichern')
  })

  it('antwortet PATCH mit 500 und einer lesbaren Meldung', async () => {
    mock.contract.findUnique.mockResolvedValue(zeile())
    mock.contract.update.mockRejectedValue(new Error('Verbindung weg'))
    const res = await einzeln.PATCH(anfrage('PATCH', { status: 'BEZAHLT' }), params)
    expect(res.status).toBe(500)
    expect((await res.json()).error).toContain('nicht in der Datenbank speichern')
  })
})

describe('Standardpreise unter /api/admin/contracts/settings', () => {
  it('liefert leere Werte, solange nichts gepflegt ist', async () => {
    const res = await einstellungen.GET()
    expect(await res.json()).toEqual({
      standardpreise: { halbtag: null, ganztag: null, ticketanteil: null },
    })
  })

  it('liefert die gespeicherten Preise', async () => {
    mock.contractSetting.findUnique.mockResolvedValue({
      key: 'standardpreise',
      value: { halbtag: 111, ganztag: 222, ticketanteil: 55 },
    })
    const res = await einstellungen.GET()
    expect(await res.json()).toEqual({ standardpreise: { halbtag: 111, ganztag: 222, ticketanteil: 55 } })
  })

  it('speichert die Preise als Zahlen in einer Zeile', async () => {
    const res = await einstellungen.PUT(
      anfrage('PUT', { halbtag: '111 €', ganztag: '222,50', ticketanteil: '55 %' })
    )
    expect(res.status).toBe(200)
    const wert = { halbtag: 111, ganztag: 222.5, ticketanteil: 55 }
    expect(mock.contractSetting.upsert).toHaveBeenCalledWith({
      where: { key: 'standardpreise' },
      create: { key: 'standardpreise', value: wert },
      update: { value: wert },
    })
  })

  it('lässt sich leeren', async () => {
    await einstellungen.PUT(anfrage('PUT', { halbtag: '', ganztag: '', ticketanteil: '' }))
    expect(mock.contractSetting.upsert.mock.calls[0][0].update).toEqual({
      value: { halbtag: null, ganztag: null, ticketanteil: null },
    })
  })

  it('lehnt einen Ticketanteil über 100 Prozent mit 400 ab', async () => {
    const res = await einstellungen.PUT(anfrage('PUT', { halbtag: '111', ganztag: '222', ticketanteil: '160' }))
    expect(res.status).toBe(400)
    expect(mock.contractSetting.upsert).not.toHaveBeenCalled()
  })

  it('lehnt Text statt eines Preises mit 400 ab', async () => {
    const res = await einstellungen.PUT(anfrage('PUT', { halbtag: 'viel', ganztag: '222' }))
    expect(res.status).toBe(400)
    expect(mock.contractSetting.upsert).not.toHaveBeenCalled()
  })
})

describe('PATCH /api/admin/contracts/:id', () => {
  it('speichert den Inhalt eines Entwurfs und behält den Typ', async () => {
    mock.contract.findUnique.mockResolvedValue(zeile())
    const res = await einzeln.PATCH(
      anfrage('PATCH', { ...gueltig, type: 'ANGEBOT', partnerName: 'Jana Neu' }),
      params
    )
    expect(res.status).toBe(200)

    const { data } = mock.contract.update.mock.calls[0][0]
    expect(data.partnerName).toBe('Jana Neu')
    expect(data.title).toBe('Vereinbarung Feier zum Abschluss Jana Neu')
    expect(data.type).toBeUndefined()
    expect(data.status).toBeUndefined()
  })

  it.each(['VERSCHICKT', 'UNTERSCHRIEBEN', 'BEZAHLT'])(
    'lehnt Inhalt bei Status %s mit 409 ab',
    async (status) => {
      mock.contract.findUnique.mockResolvedValue(zeile({ status }))
      const res = await einzeln.PATCH(anfrage('PATCH', gueltig), params)
      expect(res.status).toBe(409)
      expect(mock.contract.update).not.toHaveBeenCalled()
    }
  )

  it('friert beim Wechsel auf „verschickt“ das Dokument ein', async () => {
    mock.contract.findUnique.mockResolvedValue(zeile())
    const res = await einzeln.PATCH(anfrage('PATCH', { status: 'VERSCHICKT' }), params)
    expect(res.status).toBe(200)

    const { data } = mock.contract.update.mock.calls[0][0]
    expect(data.status).toBe('VERSCHICKT')
    expect(data.sentAt).toBeInstanceOf(Date)
    expect(istDokument(data.snapshot)).toBe(true)
    expect(dokumentAlsText(data.snapshot as Dokument)).toContain('222,50 € pauschal')
  })

  it('friert den Stand ein, der in derselben Anfrage gespeichert wird', async () => {
    mock.contract.findUnique.mockResolvedValue(zeile())
    await einzeln.PATCH(
      anfrage('PATCH', { ...gueltig, partnerName: 'Jana Neu', status: 'VERSCHICKT' }),
      params
    )
    const { data } = mock.contract.update.mock.calls[0][0]
    expect(dokumentAlsText(data.snapshot as Dokument)).toContain('Jana Neu trägt die Verantwortung für die Veranstaltung')
  })

  it('friert auch ein, wenn „verschickt“ übersprungen wird', async () => {
    mock.contract.findUnique.mockResolvedValue(zeile())
    await einzeln.PATCH(anfrage('PATCH', { status: 'UNTERSCHRIEBEN' }), params)
    expect(istDokument(mock.contract.update.mock.calls[0][0].data.snapshot)).toBe(true)
  })

  it('lässt den Snapshot beim Wechsel von „verschickt“ auf „bezahlt“ unberührt', async () => {
    mock.contract.findUnique.mockResolvedValue(
      zeile({ status: 'VERSCHICKT', snapshot: { titel: 'Alt', bausteine: [] }, sentAt: new Date() })
    )
    await einzeln.PATCH(anfrage('PATCH', { status: 'BEZAHLT' }), params)

    const { data } = mock.contract.update.mock.calls[0][0]
    expect(data).toEqual({ status: 'BEZAHLT' })
  })

  it('verwirft den Snapshot beim Weg zurück auf „Entwurf“', async () => {
    mock.contract.findUnique.mockResolvedValue(
      zeile({ status: 'BEZAHLT', snapshot: { titel: 'Alt', bausteine: [] }, sentAt: new Date() })
    )
    await einzeln.PATCH(anfrage('PATCH', { status: 'ENTWURF' }), params)

    const { data } = mock.contract.update.mock.calls[0][0]
    expect(data.status).toBe('ENTWURF')
    expect(data.snapshot).toBe(Prisma.DbNull)
    expect(data.sentAt).toBeNull()
  })

  it('friert nicht ein, wenn die gespeicherten Daten unvollständig sind', async () => {
    mock.contract.findUnique.mockResolvedValue(zeile({ data: { anlass: '' } }))
    const res = await einzeln.PATCH(anfrage('PATCH', { status: 'VERSCHICKT' }), params)
    expect(res.status).toBe(400)
    expect(mock.contract.update).not.toHaveBeenCalled()
  })

  it.each([
    ['unbekanntem Status', { status: 'STORNIERT' }, 400],
    ['leerem Body', {}, 400],
  ])('antwortet bei %s mit %i', async (_fall, body, status) => {
    mock.contract.findUnique.mockResolvedValue(zeile())
    expect((await einzeln.PATCH(anfrage('PATCH', body), params)).status).toBe(status)
  })

  it('antwortet mit 404, wenn es den Vertrag nicht gibt', async () => {
    mock.contract.findUnique.mockResolvedValue(null)
    expect((await einzeln.PATCH(anfrage('PATCH', { status: 'BEZAHLT' }), params)).status).toBe(404)
  })
})

describe('DELETE /api/admin/contracts/:id', () => {
  it('löscht einen Entwurf', async () => {
    mock.contract.findUnique.mockResolvedValue(zeile())
    expect((await einzeln.DELETE(anfrage('DELETE'), params)).status).toBe(200)
    expect(mock.contract.delete).toHaveBeenCalledWith({ where: { id: 'c1' } })
  })

  it.each(['VERSCHICKT', 'UNTERSCHRIEBEN', 'BEZAHLT'])(
    'löscht einen Vertrag im Status %s nicht',
    async (status) => {
      mock.contract.findUnique.mockResolvedValue(zeile({ status }))
      expect((await einzeln.DELETE(anfrage('DELETE'), params)).status).toBe(409)
      expect(mock.contract.delete).not.toHaveBeenCalled()
    }
  )
})

describe('GET /api/admin/contracts/:id/pdf', () => {
  it('zeichnet einen Entwurf frisch aus den Formularwerten', async () => {
    mock.contract.findUnique.mockResolvedValue(zeile())
    const res = await pdf.GET(anfrage('GET'), params)
    expect(res.headers.get('Content-Type')).toBe('application/pdf')

    const dokument = vi.mocked(pdfAntwort).mock.calls[0][0]
    expect(dokumentAlsText(dokument)).toContain('Jana Beispiel trägt die Verantwortung für die Veranstaltung')
  })

  it('zeichnet einen verschickten Vertrag aus dem Snapshot, nicht aus der Vorlage', async () => {
    const snapshot: Dokument = {
      titel: 'Eingefrorene Fassung',
      bausteine: [{ art: 'absatz', text: 'Wortlaut vom Tag des Versands.' }],
    }
    mock.contract.findUnique.mockResolvedValue(zeile({ status: 'VERSCHICKT', snapshot }))
    await pdf.GET(anfrage('GET'), params)

    expect(vi.mocked(pdfAntwort).mock.calls[0][0]).toEqual(snapshot)
  })

  it('antwortet mit 404, wenn es den Vertrag nicht gibt', async () => {
    mock.contract.findUnique.mockResolvedValue(null)
    expect((await pdf.GET(anfrage('GET'), params)).status).toBe(404)
  })

  it('nennt bei einem Fehler beim Zeichnen die technische Ursache', async () => {
    mock.contract.findUnique.mockResolvedValue(zeile())
    vi.mocked(pdfAntwort).mockRejectedValueOnce(new Error('Cannot load the standard font'))
    const res = await pdf.GET(anfrage('GET'), params)
    expect(res.status).toBe(500)
    expect(await res.json()).toEqual({
      error: 'Das PDF ließ sich nicht erzeugen.',
      detail: 'Cannot load the standard font',
    })
  })
})
