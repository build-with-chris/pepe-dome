/**
 * Tests für das Newsletter-Viewmodel
 *
 * buildViewModel ist bewusst ohne Datenbankzugriff gebaut, deshalb reichen
 * hier einfache Fixtures.
 */

import { describe, it, expect } from 'vitest'
import { buildViewModel, truncate } from '@/lib/newsletter-content'

const BASE = 'https://pepe-dome.de'

function makeEvent(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    id: `id-${overrides.slug ?? 'e'}`,
    slug: 'tanzabend',
    title: 'Tanzabend',
    subtitle: null,
    description: 'Ein Abend mit viel Bewegung und noch mehr Musik.',
    date: new Date('2026-08-15T18:00:00.000Z'),
    time: '20:00 Uhr',
    location: 'PEPE Dome',
    category: 'SHOW',
    ticketUrl: null,
    price: null,
    imageUrl: '/images/tanz.jpg',
    ...overrides,
  } as never
}

function makeNewsletter(contentCount: number) {
  return {
    slug: '2026-08-sommer',
    subject: 'Sommer im Dome',
    preheader: 'Was im August ansteht',
    introText: null,
    heroImageUrl: '/images/hero.jpg',
    heroTitle: 'Sommer im Dome',
    heroSubtitle: null,
    heroCTALabel: null,
    heroCTAUrl: null,
    content: Array.from({ length: contentCount }, (_, index) => ({
      contentType: 'EVENT',
      contentId: `event-${index}`,
      sectionHeading: 'Im August',
      sectionDescription: null,
      orderPosition: index,
    })),
  }
}

function lookupFor(count: number) {
  const events = new Map()
  for (let index = 0; index < count; index++) {
    events.set(`event-${index}`, makeEvent({ slug: `event-${index}`, title: `Event ${index}` }))
  }
  return { events, articles: new Map() }
}

describe('Newsletter-Viewmodel', () => {
  it('gewichtet nach redaktioneller Reihenfolge statt alles gleich', () => {
    const vm = buildViewModel(makeNewsletter(6) as never, lookupFor(6) as never, { baseUrl: BASE })
    const items = vm.sections[0].items

    expect(items.map((item) => (item as { emphasis: string }).emphasis)).toEqual([
      'lead',
      'feature',
      'feature',
      'compact',
      'compact',
      'compact',
    ])
  })

  it('vergibt für jede Position eine eigene utm_content-ID', () => {
    const vm = buildViewModel(makeNewsletter(4) as never, lookupFor(4) as never, { baseUrl: BASE })
    const contents = vm.sections[0].items.map(
      (item) => new URL((item as { detailUrl: string }).detailUrl).searchParams.get('utm_content')
    )

    expect(new Set(contents).size).toBe(4)
    expect(contents[0]).toBe('lead_event')
  })

  it('nutzt für alle Links dieselbe Kampagne', () => {
    const vm = buildViewModel(makeNewsletter(3) as never, lookupFor(3) as never, { baseUrl: BASE })

    expect(vm.campaign).toBe('2026-08-sommer')
    for (const item of vm.sections[0].items) {
      expect(new URL((item as { detailUrl: string }).detailUrl).searchParams.get('utm_campaign')).toBe(
        '2026-08-sommer'
      )
    }
  })

  it('nennt bei mehrtägigen Terminen den Zeitraum statt nur den ersten Tag', () => {
    // Im Newsletter-Backend stand "Samstag, 15. August 2026", obwohl der
    // Mitmachzirkus bis zum 21. lief. Der Wochentag faellt bei einer Spanne
    // weg, "Samstag, 15. bis Freitag, 21. August" liest niemand.
    const newsletter = makeNewsletter(1)
    const events = new Map([
      ['event-0', makeEvent({ endDate: new Date('2026-08-21T00:00:00.000Z') })],
    ])

    const vm = buildViewModel(newsletter as never, { events, articles: new Map() } as never, {
      baseUrl: BASE,
    })

    expect((vm.sections[0].items[0] as { dateLabel: string }).dateLabel).toBe(
      '15. bis 21. August 2026'
    )
  })

  it('behält bei eintägigen Terminen den Wochentag', () => {
    const newsletter = makeNewsletter(1)
    const events = new Map([['event-0', makeEvent()]])

    const vm = buildViewModel(newsletter as never, { events, articles: new Map() } as never, {
      baseUrl: BASE,
    })

    expect((vm.sections[0].items[0] as { dateLabel: string }).dateLabel).toBe(
      'Samstag, 15. August 2026'
    )
  })

  it('erkennt eine E-Mail-Anmeldung und beschriftet den CTA entsprechend', () => {
    const newsletter = makeNewsletter(1)
    const events = new Map([
      ['event-0', makeEvent({ slug: 'workshop', ticketUrl: 'anmeldung@pepe-dome.de' })],
    ])

    const vm = buildViewModel(newsletter as never, { events, articles: new Map() } as never, {
      baseUrl: BASE,
    })
    const event = vm.sections[0].items[0] as { ctaLabel: string; ctaUrl: string; isMailCta: boolean }

    expect(event.isMailCta).toBe(true)
    expect(event.ctaLabel).toBe('Platz anfragen')
    expect(event.ctaUrl).toBe('mailto:anmeldung@pepe-dome.de')
  })

  it('liefert das Ticketziel zusätzlich ohne Kampagnenparameter für die Webansicht', () => {
    const newsletter = makeNewsletter(1)
    const events = new Map([
      ['event-0', makeEvent({ ticketUrl: 'https://tickets.example.com/buy?id=7' })],
    ])

    const vm = buildViewModel(newsletter as never, { events, articles: new Map() } as never, {
      baseUrl: BASE,
    })
    const event = vm.sections[0].items[0] as { ctaUrl: string; ctaUrlPlain: string }

    expect(event.ctaUrlPlain).toBe('https://tickets.example.com/buy?id=7')
    expect(event.ctaUrl).toContain('utm_campaign=2026-08-sommer')
  })

  it('schickt E-Mail-Bilder durch den Zuschnitt-Endpoint', () => {
    const vm = buildViewModel(makeNewsletter(1) as never, lookupFor(1) as never, {
      baseUrl: BASE,
      target: 'email',
    })
    const event = vm.sections[0].items[0] as { imageUrl?: string }

    expect(event.imageUrl).toContain(`${BASE}/api/newsletter-image`)
    expect(event.imageUrl).toContain('src=%2Fimages%2Ftanz.jpg')
    expect(vm.hero.imageUrl).toContain('/api/newsletter-image')
  })

  it('lässt Bilder für die Webansicht als Original stehen', () => {
    const vm = buildViewModel(makeNewsletter(1) as never, lookupFor(1) as never, {
      baseUrl: BASE,
      target: 'web',
    })
    const event = vm.sections[0].items[0] as { imageUrl?: string }

    expect(event.imageUrl).toBe(`${BASE}/images/tanz.jpg`)
    expect(vm.hero.imageUrl).toBe(`${BASE}/images/hero.jpg`)
  })

  it('gibt Terminzeilen keinen Teaser, dem Aufmacher aber schon', () => {
    const vm = buildViewModel(makeNewsletter(5) as never, lookupFor(5) as never, { baseUrl: BASE })
    const items = vm.sections[0].items as Array<{ emphasis: string; teaser?: string }>

    expect(items[0].teaser).toBeTruthy()
    expect(items[4].teaser).toBeUndefined()
  })

  it('zählt die Veranstaltungen der Ausgabe', () => {
    const vm = buildViewModel(makeNewsletter(7) as never, lookupFor(7) as never, { baseUrl: BASE })
    expect(vm.eventCount).toBe(7)
  })

  it('macht aus einem freien Textblock eine eigene Sektion', () => {
    const newsletter = {
      ...makeNewsletter(1),
      content: [
        {
          contentType: 'CUSTOM_SECTION',
          contentId: null,
          sectionHeading: 'In eigener Sache',
          sectionDescription: 'Das Café hat jetzt länger geöffnet.',
          orderPosition: 0,
        },
      ],
    }

    const vm = buildViewModel(newsletter as never, { events: new Map(), articles: new Map() } as never, {
      baseUrl: BASE,
    })

    expect(vm.sections).toHaveLength(1)
    expect(vm.sections[0].items[0]).toMatchObject({
      kind: 'note',
      title: 'In eigener Sache',
    })
  })

  it('überspringt Inhalte, deren Event nicht mehr existiert', () => {
    const newsletter = makeNewsletter(2)
    const events = new Map([['event-0', makeEvent()]])

    const vm = buildViewModel(newsletter as never, { events, articles: new Map() } as never, {
      baseUrl: BASE,
    })

    expect(vm.eventCount).toBe(1)
    expect(vm.sections[0].items).toHaveLength(1)
  })
})

describe('truncate', () => {
  it('kürzt an der Wortgrenze', () => {
    const result = truncate('Ein Abend voller Musik und Bewegung', 20)
    expect(result).toBe('Ein Abend voller…')
  })

  it('lässt kurze Texte unverändert', () => {
    expect(truncate('Kurz', 20)).toBe('Kurz')
  })

  it('kommt mit leerem Text zurecht', () => {
    expect(truncate(null, 20)).toBeUndefined()
  })
})

describe('Reihenfolge der Termine', () => {
  /** Drei Termine, im Editor absichtlich durcheinander einsortiert. */
  function durcheinander(status?: string) {
    const termine = [
      { id: 'samhain', date: '2026-10-31', time: '20:00' },
      { id: 'open-stage', date: '2026-10-16', time: '19:30' },
      { id: 'poetry', date: '2026-10-09', time: '20:00' },
    ]
    const events = new Map()
    for (const t of termine) {
      events.set(t.id, makeEvent({ slug: t.id, title: t.id, date: new Date(`${t.date}T00:00:00.000Z`), time: t.time }))
    }
    const newsletter = {
      ...makeNewsletter(0),
      status,
      content: [
        ...termine.map((t, i) => ({
          contentType: 'EVENT',
          contentId: t.id,
          sectionHeading: null,
          sectionDescription: null,
          orderPosition: i,
        })),
      ],
    }
    return { newsletter, lookup: { events, articles: new Map() } }
  }

  const titel = (vm: ReturnType<typeof buildViewModel>) =>
    vm.sections.flatMap((s) => s.items.map((i) => (i as { title?: string }).title))

  it('zeigt Termine in der Reihenfolge, in der sie stattfinden', () => {
    const { newsletter, lookup } = durcheinander('DRAFT')
    const vm = buildViewModel(newsletter as never, lookup as never, { baseUrl: BASE })

    expect(titel(vm)).toEqual(['poetry', 'open-stage', 'samhain'])
    // Der früheste Termin ist der Aufmacher
    expect((vm.sections[0].items[0] as { emphasis?: string }).emphasis).toBe('lead')
  })

  it('sortiert am selben Tag nach Uhrzeit, ohne Uhrzeit ans Ende des Tages', () => {
    const events = new Map([
      ['spaet', makeEvent({ slug: 'spaet', title: 'spaet', date: new Date('2026-10-09T00:00:00Z'), time: '21:00' })],
      ['ohne', makeEvent({ slug: 'ohne', title: 'ohne', date: new Date('2026-10-09T00:00:00Z'), time: null })],
      ['frueh', makeEvent({ slug: 'frueh', title: 'frueh', date: new Date('2026-10-09T00:00:00Z'), time: '18.30 Uhr' })],
    ])
    const newsletter = {
      ...makeNewsletter(0),
      content: ['spaet', 'ohne', 'frueh'].map((id, i) => ({
        contentType: 'EVENT', contentId: id, sectionHeading: null, sectionDescription: null, orderPosition: i,
      })),
    }
    const vm = buildViewModel(newsletter as never, { events, articles: new Map() } as never, { baseUrl: BASE })

    expect(titel(vm)).toEqual(['frueh', 'spaet', 'ohne'])
  })

  it('lässt jeden Termin in seiner Sektion', () => {
    const events = new Map([
      ['show-spaet', makeEvent({ slug: 'show-spaet', title: 'show-spaet', date: new Date('2026-11-01T00:00:00Z') })],
      ['kurs', makeEvent({ slug: 'kurs', title: 'kurs', date: new Date('2026-10-01T00:00:00Z') })],
      ['show-frueh', makeEvent({ slug: 'show-frueh', title: 'show-frueh', date: new Date('2026-10-10T00:00:00Z') })],
    ])
    const block = (id: string, sectionHeading: string, i: number) => ({
      contentType: 'EVENT', contentId: id, sectionHeading, sectionDescription: null, orderPosition: i,
    })
    const newsletter = {
      ...makeNewsletter(0),
      content: [block('show-spaet', 'Shows', 0), block('kurs', 'Kurse', 1), block('show-frueh', 'Shows', 2)],
    }
    const vm = buildViewModel(newsletter as never, { events, articles: new Map() } as never, { baseUrl: BASE })

    const shows = vm.sections.find((s) => s.heading === 'Shows')!
    expect(shows.items.map((i) => (i as { title?: string }).title)).toEqual(['show-frueh', 'show-spaet'])
    expect(vm.sections.find((s) => s.heading === 'Kurse')!.items).toHaveLength(1)
  })

  it.each(['SENT', 'SENDING'])('lässt bei Status %s die verschickte Reihenfolge stehen', (status) => {
    const { newsletter, lookup } = durcheinander(status)
    const vm = buildViewModel(newsletter as never, lookup as never, { baseUrl: BASE })

    expect(titel(vm)).toEqual(['samhain', 'open-stage', 'poetry'])
  })
})
