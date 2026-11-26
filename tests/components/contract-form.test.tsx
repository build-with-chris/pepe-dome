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
    expect(screen.getByLabelText('Sonderpreis')).toHaveValue('')
    expect(screen.getByLabelText('Regulärer Preis')).toHaveValue('')
    // Die Anzahlung ist kein Preis, sondern Hausregel: die Hälfte.
    expect(screen.getByLabelText('Anzahlung')).toHaveValue('50')
  })

  it('übernimmt die Beträge des letzten Vertrags', () => {
    render(
      <ContractForm
        mode="create"
        vorbelegung={{ MIETE: { preisVereinbart: 222, preisRegulaer: 333.5, kautionBetrag: 444 } }}
      />
    )
    expect(screen.getByLabelText('Sonderpreis')).toHaveValue('222')
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
    tippen('Sonderpreis', '222,50')
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
    tippen('Sonderpreis', 'viel')
    fireEvent.click(screen.getByRole('button', { name: 'Vertrag anlegen' }))

    // Am Feld selbst, oben im Formular und noch einmal direkt am Knopf.
    await waitFor(() => expect(screen.getByText('Betrag als Zahl angeben')).toBeInTheDocument())
    expect(screen.getAllByText('Nicht gespeichert: Betrag als Zahl angeben')).toHaveLength(2)
    expect(screen.getByRole('alert')).toHaveTextContent('Nicht gespeichert')
    // Der Cursor springt erst, wenn das Formular nach dem Speichern wieder
    // entsperrt ist. Das ist ein Rendern später als die Meldung, also warten.
    await waitFor(() => expect(screen.getByLabelText('Sonderpreis')).toHaveFocus())
    expect(push).not.toHaveBeenCalled()
  })

  it('sagt am Knopf, warum nichts gespeichert wurde, und springt zum ersten leeren Pflichtfeld', () => {
    vi.stubGlobal('fetch', vi.fn())
    render(<ContractForm mode="create" vorbelegung={{}} />)
    tippen(/^Name/, 'Jana Beispiel')
    fireEvent.click(screen.getByRole('button', { name: 'Vertrag anlegen' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Noch nicht gespeichert')
    expect(screen.getByLabelText(/^Anlass/)).toHaveFocus()
  })

  it('meldet einen Serverfehler ohne lesbare Antwort mit dem Statuscode', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 500, json: async () => { throw new Error('kein JSON') } })
    )
    render(<ContractForm mode="create" vorbelegung={{}} />)
    tippen(/^Name/, 'Jana Beispiel')
    tippen(/^Anlass/, 'Feier')
    tippen(/^Termin/, 'offen')
    fireEvent.click(screen.getByRole('button', { name: 'Vertrag anlegen' }))

    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Nicht gespeichert: Fehler 500'))
  })

  it('berechnet die Frist der Anzahlung aus dem Datum und lässt eine eigene Eingabe stehen', () => {
    render(<ContractForm mode="create" vorbelegung={{}} />)
    tippen('Datum der Veranstaltung', '2031-05-17')
    expect(screen.getByLabelText('Anzahlung bis')).toHaveValue('03.05.2031')

    tippen('Datum der Veranstaltung', '2031-05-24')
    expect(screen.getByLabelText('Anzahlung bis')).toHaveValue('10.05.2031')

    tippen('Anzahlung bis', 'nach Absprache')
    tippen('Datum der Veranstaltung', '2031-06-07')
    expect(screen.getByLabelText('Anzahlung bis')).toHaveValue('nach Absprache')
  })

  it('setzt den regulären Preis per Klick auf halben oder ganzen Tag', () => {
    render(
      <ContractForm
        mode="create"
        vorbelegung={{ MIETE: { preisRegulaer: 111 } }}
        standardpreise={{ halbtag: 111, ganztag: 222, ticketanteil: null }}
      />
    )
    expect(screen.getByLabelText('Regulärer Preis')).toHaveValue('111')
    expect(screen.getByRole('button', { name: 'Halber Tag: 111 €' })).toHaveAttribute('aria-pressed', 'true')

    fireEvent.click(screen.getByRole('button', { name: 'Ganzer Tag: 222 €' }))
    expect(screen.getByLabelText('Regulärer Preis')).toHaveValue('222')
  })

  it('zieht im Angebot die Bezeichnung mit, solange dort nichts Eigenes steht', () => {
    render(<ContractForm mode="create" vorbelegung={{}} standardpreise={{ halbtag: 111, ganztag: 222, ticketanteil: null }} />)
    fireEvent.click(screen.getByRole('radio', { name: /^Angebot/ }))

    fireEvent.click(screen.getByRole('button', { name: 'Ganzer Tag: 222 €' }))
    expect(screen.getByLabelText('Regulärer Preis')).toHaveValue('222')
    expect(screen.getByLabelText('Bezeichnung des regulären Preises')).toHaveValue('Regulärer Tagessatz')

    fireEvent.click(screen.getByRole('button', { name: 'Halber Tag: 111 €' }))
    expect(screen.getByLabelText('Bezeichnung des regulären Preises')).toHaveValue('Regulärer Halbtagessatz')

    tippen('Bezeichnung des regulären Preises', 'Eigene Bezeichnung')
    fireEvent.click(screen.getByRole('button', { name: 'Ganzer Tag: 222 €' }))
    expect(screen.getByLabelText('Bezeichnung des regulären Preises')).toHaveValue('Eigene Bezeichnung')
  })

  it('zeigt ohne gepflegte Standardpreise keine Knöpfe', () => {
    render(<ContractForm mode="create" vorbelegung={{}} standardpreise={{ halbtag: null, ganztag: null, ticketanteil: null }} />)
    expect(screen.queryByRole('button', { name: /Halber Tag/ })).toBeNull()
  })
})

describe('ContractForm für Künstler- und Veranstaltervertrag', () => {
  it('zeigt im Künstlervertrag den üblichen Ticketanteil und rechnet den Rest aus', () => {
    render(<ContractForm mode="create" vorbelegung={{ KUENSTLER: { anteilGegenseite: 55 } }} />)
    fireEvent.click(screen.getByRole('radio', { name: /^Künstlervertrag/ }))

    expect(screen.getByLabelText('Anteil für die Künstler:innen')).toHaveValue('55')
    expect(screen.getByText(/Beim Pepe Dome bleiben 45 %/)).toBeInTheDocument()
    expect(screen.queryByLabelText('Gage')).toBeNull()
    expect(screen.queryByLabelText(/^Anlass/)).toBeNull()
  })

  it('wechselt im Künstlervertrag auf feste Gage mit Förderung', () => {
    render(<ContractForm mode="create" vorbelegung={{}} />)
    fireEvent.click(screen.getByRole('radio', { name: /^Künstlervertrag/ }))
    fireEvent.click(screen.getByRole('radio', { name: /^Feste Gage/ }))

    expect(screen.getByLabelText('Gage')).toBeInTheDocument()
    expect(screen.getByLabelText('Förderung')).toBeInTheDocument()
    expect(screen.queryByLabelText('Anteil für die Künstler:innen')).toBeNull()
  })

  it('bietet im Veranstaltervertrag keine feste Gage an', () => {
    render(<ContractForm mode="create" vorbelegung={{ VERANSTALTER: { anteilGegenseite: 55 } }} />)
    fireEvent.click(screen.getByRole('radio', { name: /^Veranstaltervertrag/ }))

    expect(screen.getByLabelText('Anteil für die Veranstalter:innen')).toHaveValue('55')
    expect(screen.queryByRole('radio', { name: /^Feste Gage/ })).toBeNull()
  })

  it('fragt bei Aufteilung und bei fester Gage nach der Mehrwertsteuer', () => {
    render(<ContractForm mode="create" vorbelegung={{}} />)
    fireEvent.click(screen.getByRole('radio', { name: /^Künstlervertrag/ }))

    const schalter = screen.getByRole('switch', { name: 'Gegenseite rechnet mit Mehrwertsteuer ab' })
    expect(schalter).toHaveAttribute('data-state', 'unchecked')
    expect(screen.getByText(/Netto-Ticketeinnahmen ohne Ticketgebühren/)).toBeInTheDocument()

    expect(screen.getByText(/Es bleibt beim Anteil/)).toBeInTheDocument()

    fireEvent.click(schalter)
    fireEvent.click(screen.getByRole('radio', { name: /^Feste Gage/ }))
    // Der Schalter bleibt, wie er war, nur der Hinweis spricht jetzt von der Gage.
    expect(screen.getByRole('switch', { name: 'Gegenseite rechnet mit Mehrwertsteuer ab' })).toHaveAttribute('data-state', 'checked')
    expect(screen.getByText(/Die Gage ist der Endbetrag/)).toBeInTheDocument()
    expect(screen.getByText(/Die Ticketeinnahmen und die Einnahmen aus der Gastronomie gehen an den Pepe Dome/)).toBeInTheDocument()
  })

  it('sagt, dass die offenen Regelungen noch Freitext sind', () => {
    render(<ContractForm mode="create" vorbelegung={{}} />)
    fireEvent.click(screen.getByRole('radio', { name: /^Veranstaltervertrag/ }))

    expect(screen.getByText(/noch keinen festen Wortlaut/)).toBeInTheDocument()
    for (const feld of ['Ausfall und Absage', 'Höhere Gewalt', 'Bedingungen vor Ort', 'Was der Pepe Dome erwartet']) {
      expect(screen.getByLabelText(feld)).toHaveValue('')
    }
  })

  it('verlangt Titel und Termin und schickt die Felder des gewählten Typs', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ contract: { id: 'c9' } }) })
    vi.stubGlobal('fetch', fetchMock)
    render(<ContractForm mode="create" vorbelegung={{ VERANSTALTER: { anteilGegenseite: 55 } }} />)
    fireEvent.click(screen.getByRole('radio', { name: /^Veranstaltervertrag/ }))
    tippen(/^Name/, 'Verein Beispiel')

    fireEvent.click(screen.getByRole('button', { name: 'Vertrag anlegen' }))
    expect(screen.getByText('Titel ist Pflicht')).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()

    tippen(/^Titel der Veranstaltung/, 'Beispielabend')
    tippen(/^Termin/, 'Samstag, 17.05.2031')
    tippen('Ausfall und Absage', 'Wird einzeln abgesprochen.')
    fireEvent.click(screen.getByRole('button', { name: 'Vertrag anlegen' }))

    await waitFor(() => expect(push).toHaveBeenCalledWith('/admin/contracts/c9'))
    const body = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(body.type).toBe('VERANSTALTER')
    expect(body.data).toMatchObject({
      titel: 'Beispielabend',
      termin: 'Samstag, 17.05.2031',
      verguetung: 'ticketanteil',
      anteilGegenseite: '55',
      mitMwst: false,
      ausfall: 'Wird einzeln abgesprochen.',
    })
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
