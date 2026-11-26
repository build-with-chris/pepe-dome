/**
 * Vertragsformular: zeigt je nach Typ und Schalter die richtigen Felder,
 * schickt die Eingaben vollständig an die API und sperrt sich, sobald der
 * Vertrag kein Entwurf mehr ist.
 *
 * Alle Namen und Beträge hier sind erfunden.
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ContractForm from '@/components/admin/forms/ContractForm'

const push = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push, refresh: vi.fn() }),
}))

// Die Schalter (Radix Switch) messen ihre Größe. jsdom kennt ResizeObserver nicht.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

const tippen = (label: string | RegExp, wert: string) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value: wert } })

beforeEach(() => {
  push.mockReset()
  vi.unstubAllGlobals()
  vi.stubGlobal('ResizeObserver', ResizeObserverStub)
})

describe('ContractForm beim Anlegen', () => {
  it('startet ohne früheren Vertrag mit leeren Betragsfeldern', () => {
    render(<ContractForm mode="create" vorbelegung={{}} />)
    expect(screen.getByLabelText('Vereinbarter Preis')).toHaveValue('')
    expect(screen.getByLabelText('Regulärer Preis')).toHaveValue('')
    expect(screen.getByLabelText('Anzahlung')).toHaveValue('')
  })

  it('übernimmt die Beträge des letzten Vertrags', () => {
    render(
      <ContractForm
        mode="create"
        vorbelegung={{ MIETE: { preisVereinbart: 222, preisRegulaer: 333.5, kautionBetrag: 444 } }}
      />
    )
    expect(screen.getByLabelText('Vereinbarter Preis')).toHaveValue('222')
    expect(screen.getByLabelText('Regulärer Preis')).toHaveValue('333,50')
    expect(screen.getByLabelText(/^Anlass/)).toHaveValue('')
  })

  it('zeigt die Felder eines Bausteins erst, wenn sein Schalter an ist', () => {
    render(<ContractForm mode="create" vorbelegung={{ MIETE: { kautionBetrag: 444 } }} />)
    expect(screen.queryByLabelText('Kaution', { selector: 'input' })).toBeNull()

    fireEvent.click(screen.getByRole('switch', { name: 'Kaution' }))
    expect(screen.getByLabelText('Kaution', { selector: 'input' })).toHaveValue('444')

    expect(screen.queryByLabelText('Zusatzleistung 1')).toBeNull()
    fireEvent.click(screen.getByRole('switch', { name: 'Zusatzleistungen' }))
    expect(screen.getByLabelText('Zusatzleistung 1')).toHaveValue('Nutzung der Luftpunkte')
    expect(screen.getByLabelText('Preis der Zusatzleistung 1')).toHaveValue('')
  })

  it('wechselt beim Showbesuch auf Show, Ticketregel und Heizpauschale', () => {
    render(<ContractForm mode="create" vorbelegung={{}} />)
    expect(screen.queryByLabelText(/^Name der Show/)).toBeNull()

    fireEvent.click(screen.getByRole('radio', { name: /Showbesuch/ }))
    expect(screen.getByLabelText(/^Name der Show/)).toBeInTheDocument()
    expect(screen.getByLabelText('Ticketregel')).toBeInTheDocument()
    expect(screen.getByLabelText('Heizpauschale')).toBeInTheDocument()
    expect(screen.queryByLabelText('Regulärer Preis')).toBeNull()
  })

  it('zeigt beim Angebot die Felder des Angebots', () => {
    render(<ContractForm mode="create" vorbelegung={{ ANGEBOT: { preisAngebot: 222 } }} />)
    fireEvent.click(screen.getByRole('radio', { name: /^Angebot/ }))

    expect(screen.getByLabelText(/^Veranstaltung/)).toBeInTheDocument()
    expect(screen.getByLabelText('Angebotspreis')).toHaveValue('222')
    expect(screen.getByLabelText('Leistung 1')).toBeInTheDocument()
    expect(screen.queryByLabelText(/^Anlass/)).toBeNull()
  })

  it('speichert nicht ohne Pflichtfelder', () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    render(<ContractForm mode="create" vorbelegung={{}} />)

    fireEvent.click(screen.getByRole('button', { name: 'Vertrag anlegen' }))
    expect(screen.getByText('Name ist Pflicht')).toBeInTheDocument()
    expect(screen.getByText('Anlass ist Pflicht')).toBeInTheDocument()
    expect(screen.getByText('Termin ist Pflicht')).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('schickt Felder und Schalter an die API und öffnet danach den Vertrag', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ contract: { id: 'c1' } }),
    })
    vi.stubGlobal('fetch', fetchMock)
    render(<ContractForm mode="create" vorbelegung={{}} />)

    tippen(/^Name/, 'Jana Beispiel')
    tippen(/^Anlass/, 'Feier zum Abschluss')
    tippen(/^Termin/, 'Samstag, 17.05.2031')
    tippen('Vereinbarter Preis', '222,50')
    fireEvent.click(screen.getByRole('switch', { name: 'Offenes Feuer' }))
    fireEvent.click(screen.getByRole('switch', { name: 'Kaution' }))
    fireEvent.change(screen.getByLabelText('Kaution', { selector: 'input' }), { target: { value: '444' } })
    fireEvent.click(screen.getByRole('button', { name: 'Vertrag anlegen' }))

    await waitFor(() => expect(push).toHaveBeenCalledWith('/admin/contracts/c1'))

    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('/api/admin/contracts')
    expect(init.method).toBe('POST')
    const body = JSON.parse(init.body)
    expect(body).toMatchObject({ type: 'MIETE', partnerName: 'Jana Beispiel' })
    expect(body.data).toMatchObject({
      anlass: 'Feier zum Abschluss',
      termin: 'Samstag, 17.05.2031',
      preisVereinbart: '222,50',
      feuer: true,
      kaution: true,
      kautionBetrag: '444',
      minderjaehrig: false,
      preismodell: 'pauschale',
    })
  })

  it('zeigt Fehler der API am betroffenen Feld', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({
          error: 'Betrag als Zahl angeben',
          details: [{ path: ['data', 'preisVereinbart'], message: 'Betrag als Zahl angeben' }],
        }),
      })
    )
    render(<ContractForm mode="create" vorbelegung={{}} />)
    tippen(/^Name/, 'Jana Beispiel')
    tippen(/^Anlass/, 'Feier')
    tippen(/^Termin/, 'offen')
    tippen('Vereinbarter Preis', 'viel')
    fireEvent.click(screen.getByRole('button', { name: 'Vertrag anlegen' }))

    await waitFor(() => expect(screen.getAllByText('Betrag als Zahl angeben')).toHaveLength(2))
    expect(push).not.toHaveBeenCalled()
  })
})

describe('ContractForm beim Bearbeiten', () => {
  const vertrag = {
    id: 'c1',
    type: 'ANGEBOT' as const,
    partnerName: 'Verein Beispiel',
    partnerEmail: null,
    partnerPhone: null,
    partnerAddress: null,
    eventDate: '2031-04-06',
    data: { veranstaltung: 'Lesung im Frühling', preisAngebot: 222, leistungen: ['Nutzung des Raums'], getraenke: '' },
  }

  it('zeigt die gespeicherten Werte und bietet keinen Typwechsel an', () => {
    render(<ContractForm mode="edit" vertrag={vertrag} />)
    expect(screen.getByLabelText(/^Veranstaltung/)).toHaveValue('Lesung im Frühling')
    expect(screen.getByLabelText('Angebotspreis')).toHaveValue('222')
    expect(screen.getByLabelText('Leistung 1')).toHaveValue('Nutzung des Raums')
    // Ein bewusst geleertes Feld bleibt leer und bekommt nicht den Startwert zurück.
    expect(screen.getByLabelText('Getränke')).toHaveValue('')
    expect(screen.queryByRole('radio', { name: /Mietvereinbarung/ })).toBeNull()
  })

  it('speichert Änderungen per PATCH auf den Vertrag', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ contract: vertrag }) })
    vi.stubGlobal('fetch', fetchMock)
    render(<ContractForm mode="edit" vertrag={vertrag} />)

    tippen('Angebotspreis', '199')
    expect(screen.getByText(/Ungespeicherte Änderungen/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Änderungen speichern' }))

    await waitFor(() => expect(screen.getByText('Gespeichert.')).toBeInTheDocument())
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('/api/admin/contracts/c1')
    expect(init.method).toBe('PATCH')
    expect(JSON.parse(init.body).data.preisAngebot).toBe('199')
  })

  it('ist gesperrt, sobald der Vertrag kein Entwurf mehr ist', () => {
    render(<ContractForm mode="edit" vertrag={vertrag} gesperrt />)
    expect(screen.getByText(/kein Entwurf mehr und deshalb gesperrt/)).toBeInTheDocument()
    expect(screen.getByLabelText('Angebotspreis')).toBeDisabled()
    expect(screen.queryByRole('button', { name: 'Änderungen speichern' })).toBeNull()
  })
})
