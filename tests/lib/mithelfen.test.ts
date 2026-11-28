import { describe, it, expect, vi, beforeEach } from 'vitest'

const send = vi.fn()
vi.mock('@/lib/resend', () => ({
  resend: { emails: { send: (...args: unknown[]) => send(...args) } },
  DEFAULT_FROM_EMAIL: 'Pepe Dome <info@pepe-dome.de>',
}))

import {
  AUFGABEN,
  BEREICHE,
  treffer,
  empfaenger,
  helferMeldungSchema,
  meldungsText,
  dauerTeile,
} from '@/lib/mithelfen'
import { POST } from '@/app/api/helfer/route'

const gueltig = {
  name: 'Kim Muster',
  kontakt: 'kim@example.org',
  aufgaben: ['theke'],
  notiz: '',
  einwilligung: true,
  website: '',
  fillMs: 5000,
}

function anfrage(body: unknown, ip: string) {
  return new Request('http://localhost/api/helfer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': ip },
    body: JSON.stringify(body),
  }) as never
}

describe('Mithelfen-Daten', () => {
  it('jede Aufgabe gehoert zu einem bekannten Bereich', () => {
    const ids = new Set(BEREICHE.map((b) => b.id))
    expect(AUFGABEN.length).toBeGreaterThan(0)
    for (const a of AUFGABEN) expect(ids.has(a.bereich)).toBe(true)
  })

  it('zeigt Dauer in Minuten oder Stunden', () => {
    expect(dauerTeile(30)).toEqual(['30', 'Min'])
    expect(dauerTeile(90)).toEqual(['1,5', 'Std'])
  })
})

describe('treffer', () => {
  it('Pruefschritt aus der Spec: Vor Ort, Cafe, bis 3 Stunden findet die Thekenschicht', () => {
    const { liste, gelockert } = treffer('ort', ['cafe'], 180)
    expect(gelockert).toBe(false)
    expect(liste.map((a) => a.id)).toContain('theke')
    expect(liste.every((a) => a.ort === 'ort' && a.bereich === 'cafe')).toBe(true)
  })

  it('lockert den Zeitrahmen statt eine leere Liste zu zeigen', () => {
    const { liste, gelockert } = treffer('remote', ['event'], 60)
    expect(gelockert).toBe(true)
    expect(liste.length).toBeGreaterThan(0)
  })

  it('sortiert kuerzeste zuerst', () => {
    const { liste } = treffer('beides', [], Infinity)
    const dauern = liste.map((a) => a.dauerMinuten)
    expect(dauern).toEqual([...dauern].sort((a, b) => a - b))
    expect(liste).toHaveLength(AUFGABEN.length)
  })
})

describe('helferMeldungSchema', () => {
  it('akzeptiert Telefonnummer statt E-Mail', () => {
    expect(helferMeldungSchema.safeParse({ ...gueltig, kontakt: '0176 1234567' }).success).toBe(true)
  })

  it('lehnt unbekannte Aufgaben und fehlende Einwilligung ab', () => {
    expect(helferMeldungSchema.safeParse({ ...gueltig, aufgaben: ['gibtsnicht'] }).success).toBe(false)
    expect(helferMeldungSchema.safeParse({ ...gueltig, einwilligung: false }).success).toBe(false)
    expect(helferMeldungSchema.safeParse({ ...gueltig, aufgaben: [] }).success).toBe(false)
  })
})

describe('empfaenger und meldungsText', () => {
  it('ohne eingetragene Bereichsadresse geht die Meldung nur an die Sammeladresse', () => {
    expect(empfaenger(['theke', 'kuchen'], 'info@pepe-dome.de')).toEqual(['info@pepe-dome.de'])
  })

  it('nennt Bereich und Aufgabe in der Mail', () => {
    const text = meldungsText(helferMeldungSchema.parse(gueltig))
    expect(text).toContain('Café & Bar')
    expect(text).toContain('Thekenschicht bei einer Vorstellung')
    expect(text).toContain('kim@example.org')
  })
})

describe('POST /api/helfer', () => {
  beforeEach(() => {
    send.mockReset()
    send.mockResolvedValue({ data: { id: 'x' }, error: null })
  })

  it('schickt Meldung und Bestaetigung bei E-Mail-Kontakt', async () => {
    const res = await POST(anfrage(gueltig, '10.0.0.1'))
    expect(res.status).toBe(200)
    expect(send).toHaveBeenCalledTimes(2)
    expect(send.mock.calls[0][0].replyTo).toBe('kim@example.org')
    expect(send.mock.calls[1][0].to).toBe('kim@example.org')
  })

  it('schickt keine Bestaetigung bei Telefonnummer', async () => {
    const res = await POST(anfrage({ ...gueltig, kontakt: '0176 1234567' }, '10.0.0.2'))
    expect(res.status).toBe(200)
    expect(send).toHaveBeenCalledTimes(1)
  })

  it('verschickt bei Bots nichts, antwortet aber gleich', async () => {
    const res = await POST(anfrage({ ...gueltig, website: 'spam.example' }, '10.0.0.3'))
    expect(res.status).toBe(200)
    expect(send).not.toHaveBeenCalled()
  })

  it('meldet 400 bei ungueltigen Angaben', async () => {
    const res = await POST(anfrage({ ...gueltig, name: '' }, '10.0.0.4'))
    expect(res.status).toBe(400)
    expect(send).not.toHaveBeenCalled()
  })
})
