import { describe, it, expect } from 'vitest'
import { buildChannelKit, type ChannelKitEvent } from '@/lib/channel-kit/build'
import { CHANNELS } from '@/lib/channel-kit/channels'
import { toPortalText, truncateAtWord } from '@/lib/channel-kit/portal-text'
import type { ChannelKit, KitField } from '@/lib/channel-kit/types'

/**
 * Das Kanal-Kit schreibt Text in fremde Portale. Was hier durchrutscht, steht
 * danach auf muenchen.de oder bei Rausgegangen und lässt sich nicht mit einem
 * Deploy zurückholen. Deshalb sichern diese Tests genau die Stellen ab, an
 * denen so ein Generator scheitert: Markdown-Reste, Gedankenstriche, hartes
 * Abschneiden mitten im Wort oder in einer URL, und erfundene Angaben, wo in
 * Wahrheit Daten fehlen.
 *
 * Alles davon ist reine Textverarbeitung, deshalb läuft die Datei ohne
 * Datenbank und ohne Netzwerk.
 */

const NOW = new Date('2026-08-01T12:00:00Z')

function makeEvent(overrides: Partial<ChannelKitEvent> = {}): ChannelKitEvent {
  return {
    id: 'evt-1',
    slug: 'schwerelos',
    title: 'Schwerelos',
    subtitle: null,
    description: 'Ein Abend zwischen Boden und Kuppel.',
    date: new Date('2026-09-12T12:00:00Z'),
    time: '20:00',
    endTime: '22:00',
    location: 'Pepe Dome',
    category: 'SHOW',
    ticketUrl: 'https://rausgegangen.de/events/schwerelos/',
    price: 'ab 22 €',
    imageUrl: '/uploads/schwerelos.jpg',
    parentEventId: null,
    childEvents: [],
    ...overrides,
  }
}

function allFields(channels: ChannelKit[]): KitField[] {
  return channels.flatMap((channel) => channel.fields)
}

function fieldOf(channels: ChannelKit[], channelId: string, key: string): KitField {
  const channel = channels.find((c) => c.id === channelId)
  if (!channel) throw new Error(`Kanal ${channelId} fehlt im Kit`)
  const field = channel.fields.find((f) => f.key === key)
  if (!field) throw new Error(`Feld ${key} fehlt bei ${channelId}`)
  return field
}

describe('toPortalText', () => {
  it('macht aus Markdown sauberen Fließtext', () => {
    const kit = buildChannelKit(
      makeEvent({
        description:
          '## Schwerelos\n\nSechs **Artistinnen** zeigen, was Schwerkraft nicht kann.\n\n- Luftakrobatik\n- Jonglage\n\nMehr im [Programm](https://www.pepe-dome.de/de/events).',
      }),
      { now: NOW }
    )

    const description = fieldOf(kit.channels, 'rausgegangen', 'description').value

    expect(description).not.toContain('##')
    expect(description).not.toContain('**')
    expect(description).not.toContain('](')
    expect(description).toContain('Artistinnen')
    // Der Linktext bleibt lesbar, das Ziel bleibt erhalten
    expect(description).toContain('Programm (https://www.pepe-dome.de/de/events)')
  })

  it('lässt Umlaute und Anführungszeichen unverändert', () => {
    const text = toPortalText('Die Show "Schwerelos" über Größe, Übermut und Straßenkunst.')
    expect(text).toBe('Die Show "Schwerelos" über Größe, Übermut und Straßenkunst.')
  })
})

describe('keine Gedankenstriche', () => {
  /**
   * markdownToPlainText gibt eine Trennlinie als "—" aus. Genau dieses Zeichen
   * soll in sichtbarer Copy nicht vorkommen, und über eine Trennlinie im
   * Redaktionstext käme es sonst durch die Hintertür wieder herein.
   */
  it('erzeugt in keinem Feld ein — oder –', () => {
    const kit = buildChannelKit(
      makeEvent({
        title: 'Schwerelos – ein Abend in der Luft',
        description:
          'Erster Teil.\n\n---\n\nZweiter Teil — mit Publikum.\n\nDauer 90–100 Minuten.',
      }),
      { now: NOW }
    )

    for (const field of allFields(kit.channels)) {
      expect(field.value, `Feld ${field.label}`).not.toMatch(/[—–]/)
    }
  })

  it('wirft die Trennlinie raus statt sie als Strichzeile stehen zu lassen', () => {
    const text = toPortalText('Oben.\n\n---\n\nUnten.')
    expect(text).toBe('Oben.\n\nUnten.')
  })
})

describe('truncateAtWord', () => {
  it('kürzt an der Wortgrenze, nie mitten im Wort', () => {
    const result = truncateAtWord('Sechs Artistinnen zeigen Schwerelosigkeit', 20)

    expect(result.truncated).toBe(true)
    expect(result.text.length).toBeLessThanOrEqual(20)
    expect(result.text).toBe('Sechs Artistinnen…')
  })

  it('lässt kurze Texte unangetastet', () => {
    const result = truncateAtWord('Kurz genug', 20)
    expect(result).toEqual({ text: 'Kurz genug', truncated: false, overLimit: false })
  })

  it('zerschneidet nie eine URL', () => {
    const url = 'https://www.pepe-dome.de/de/events/schwerelos?utm_source=rausgegangen'
    const result = truncateAtWord(`Tickets: ${url}`, 40)

    // Geschnitten wird nur an Leerraum, und eine URL enthält keinen. Sie ist
    // damit entweder ganz drin oder ganz draußen, aber nie ein halber Link,
    // der ins Leere führt.
    expect(result.truncated).toBe(true)
    expect(result.text).not.toContain('http')
  })

  it('lässt eine URL, die ins Limit passt, vollständig stehen', () => {
    const url = 'https://www.pepe-dome.de/de/events/schwerelos'
    const result = truncateAtWord(`${url} und noch viel mehr Text dahinter`, 50)

    expect(result.text).toContain(url)
    expect(result.truncated).toBe(true)
  })

  it('meldet ein einzelnes zu langes Wort als zu lang statt es abzuschneiden', () => {
    const result = truncateAtWord('Donaudampfschifffahrtsgesellschaft', 10)
    expect(result.overLimit).toBe(true)
    expect(result.text).toBe('Donaudampfschifffahrtsgesellschaft')
  })
})

describe('Ticketlink', () => {
  it('macht aus einer Mailadresse einen Anmeldesatz und keinen kaputten Link', () => {
    const kit = buildChannelKit(
      makeEvent({ ticketUrl: 'anmeldung@pepe-dome.de' }),
      { now: NOW }
    )

    const link = fieldOf(kit.channels, 'in_muenchen', 'link')
    const description = fieldOf(kit.channels, 'rausgegangen', 'description')

    // Im Feld "Webseite" steht eine echte URL, nicht die Mailadresse
    expect(link.value).toContain('https://www.pepe-dome.de/de/events/schwerelos')
    expect(link.value).not.toContain('anmeldung@pepe-dome.de')

    expect(description.value).toContain('Anmeldung per Mail an anmeldung@pepe-dome.de')
  })
})

describe('Preis', () => {
  it.each(['Kostenlos', 'Eintritt frei', 'umsonst', 'freier Eintritt (Spenden erwünscht)'])(
    'gibt %j als "Eintritt frei" aus',
    (price) => {
      const kit = buildChannelKit(makeEvent({ price }), { now: NOW })
      expect(fieldOf(kit.channels, 'rausgegangen', 'price').value).toBe('Eintritt frei')
    }
  )

  it('übernimmt einen echten Preis unverändert', () => {
    const kit = buildChannelKit(makeEvent({ price: 'ab 22 €' }), { now: NOW })
    expect(fieldOf(kit.channels, 'rausgegangen', 'price').value).toBe('ab 22 €')
  })
})

describe('fehlende Daten', () => {
  it('meldet einen fehlenden Preis, statt einen zu erfinden', () => {
    const kit = buildChannelKit(makeEvent({ price: null }), { now: NOW })
    const price = fieldOf(kit.channels, 'rausgegangen', 'price')

    expect(price.value).toBe('')
    expect(price.missing).toContain('kein Preis hinterlegt')
    expect(price.missing).not.toMatch(/auf Anfrage/i)
  })

  it('meldet ein fehlendes Bild', () => {
    const kit = buildChannelKit(makeEvent({ imageUrl: null }), { now: NOW })
    const image = fieldOf(kit.channels, 'instagram', 'imageNote')

    expect(image.value).toBe('')
    expect(image.missing).toContain('kein')
    expect(kit.channels.find((c) => c.id === 'instagram')?.warnings.length).toBeGreaterThan(0)
  })
})

describe('Instagram', () => {
  it('setzt keinen Link in die Caption, weil der dort toter Text wäre', () => {
    const kit = buildChannelKit(makeEvent(), { now: NOW })
    const caption = fieldOf(kit.channels, 'instagram', 'caption')

    expect(caption.value).not.toMatch(/https?:\/\//)
    expect(caption.value).not.toContain('www.')
    expect(caption.value).toContain('Link in unserer Bio')
  })

  it('gibt den Link stattdessen als eigenes Feld für die Bio aus', () => {
    const kit = buildChannelKit(makeEvent(), { now: NOW })
    expect(fieldOf(kit.channels, 'instagram', 'link').value).toMatch(/^https:\/\//)
  })

  it('hängt Hashtags aus Kategorie und festem Sockel an, getrennt von der Caption', () => {
    const kit = buildChannelKit(makeEvent({ category: 'WORKSHOP' }), { now: NOW })
    const hashtags = fieldOf(kit.channels, 'instagram', 'hashtags').value

    expect(hashtags).toContain('#pepedome')
    expect(hashtags).toContain('#münchen')
    expect(hashtags).toContain('#workshop')
  })
})

describe('utm_source je Kanal', () => {
  it('gibt jedem ausgegebenen Link die Quelle seines Kanals', () => {
    const kit = buildChannelKit(makeEvent(), { now: NOW })

    for (const channel of kit.channels) {
      const definition = CHANNELS.find((c) => c.id === channel.id)
      const links = channel.fields.filter((f) => f.key === 'link' && f.value.startsWith('http'))

      for (const link of links) {
        const params = new URL(link.value).searchParams
        expect(params.get('utm_source'), `Kanal ${channel.id}`).toBe(definition?.utmSource)
        expect(params.get('utm_medium')).toBe(definition?.utmMedium)
        expect(params.get('utm_campaign')).toBe('event-schwerelos')
      }
    }
  })

  it('nimmt auch bei WhatsApp die eigene Quelle in die Nachricht', () => {
    const kit = buildChannelKit(makeEvent(), { now: NOW })
    expect(fieldOf(kit.channels, 'whatsapp', 'message').value).toContain('utm_source=whatsapp')
  })
})

describe('Serien und geschlossene Veranstaltungen', () => {
  it('erzeugt für einen Serientermin kein eigenes Kit', () => {
    const kit = buildChannelKit(makeEvent({ parentEventId: 'evt-parent' }), { now: NOW })

    expect(kit.available).toBe(false)
    expect(kit.reason).toBe('CHILD_EVENT')
    expect(kit.parentEventId).toBe('evt-parent')
    expect(kit.channels).toHaveLength(0)
  })

  it('erzeugt beim Elternevent ein Kit mit Terminliste statt vieler Einzelkits', () => {
    const kit = buildChannelKit(
      makeEvent({
        date: new Date('2026-08-05T12:00:00Z'),
        time: '18:00',
        endTime: '19:30',
        childEvents: [
          { id: 'c1', date: new Date('2026-08-12T12:00:00Z') },
          { id: 'c2', date: new Date('2026-08-19T12:00:00Z') },
        ],
      }),
      { now: NOW }
    )

    const datetime = fieldOf(kit.channels, 'rausgegangen', 'datetime').value

    expect(datetime).toContain('Termine:')
    expect(datetime).toContain('Mittwoch, 5. August 2026, 18:00 bis 19:30 Uhr')
    expect(datetime).toContain('12. August 2026')
    expect(datetime).toContain('19. August 2026')
  })

  it('lässt vergangene Serientermine aus der Liste', () => {
    const kit = buildChannelKit(
      makeEvent({
        date: new Date('2026-08-05T12:00:00Z'),
        childEvents: [
          { id: 'alt', date: new Date('2026-07-01T12:00:00Z') },
          { id: 'neu', date: new Date('2026-08-12T12:00:00Z') },
        ],
      }),
      { now: NOW }
    )

    const datetime = fieldOf(kit.channels, 'rausgegangen', 'datetime').value
    expect(datetime).not.toContain('Juli')
    expect(datetime).toContain('12. August 2026')
  })

  it('erzeugt für eine Firmenvermietung kein Kit', () => {
    const kit = buildChannelKit(makeEvent({ category: 'BUSINESS' }), { now: NOW })

    expect(kit.available).toBe(false)
    expect(kit.reason).toBe('BUSINESS')
    expect(kit.channels).toHaveLength(0)
  })
})

/**
 * Rausgegangen legt Events über zentrale.events an, ein Formular in fünf
 * Schritten. Die Werte hier stammen von dort (abgelesen am 26.07.2026) und
 * haben drei Annahmen widerlegt: der Titel fasst 180 statt 80 Zeichen, die
 * Beschreibung hat gar kein Limit, und eine Kurzbeschreibung gibt es nicht.
 */
describe('Rausgegangen, am echten Formular abgelesen', () => {
  it('erlaubt 180 Zeichen im Titel', () => {
    const kit = buildChannelKit(makeEvent(), { now: NOW })
    const title = fieldOf(kit.channels, 'rausgegangen', 'title')

    expect(title.max).toBe(180)
    expect(title.limitOrigin).toBe('portal')
  })

  it('kürzt die Beschreibung nicht, der Editor setzt kein Limit', () => {
    const lang = Array.from({ length: 400 }, (_, i) => `Wort${i}`).join(' ')
    const kit = buildChannelKit(makeEvent({ description: lang }), { now: NOW })
    const description = fieldOf(kit.channels, 'rausgegangen', 'description')

    expect(description.max).toBeNull()
    expect(description.truncated).toBe(false)
    expect(description.value.length).toBe(lang.length)
  })

  it('hat kein Feld Kurzbeschreibung und kein Feld Ticketlink', () => {
    const kit = buildChannelKit(makeEvent(), { now: NOW })
    const keys = kit.channels.find((c) => c.id === 'rausgegangen')?.fields.map((f) => f.key)

    // Rausgegangen ist selbst der Ticketshop, ein Ticketlink wäre ein Selbstverweis
    expect(keys).not.toContain('teaser')
    expect(keys).not.toContain('link')
    expect(keys).not.toContain('ticketLink')
  })

  it('gibt Tags ohne Rautezeichen aus, weil das Feld echte Schlagwörter nimmt', () => {
    const kit = buildChannelKit(makeEvent({ category: 'WORKSHOP' }), { now: NOW })
    const tags = fieldOf(kit.channels, 'rausgegangen', 'tags')

    expect(tags.value).not.toContain('#')
    expect(tags.value).toContain('pepedome')
    expect(tags.value).toContain('workshop')
  })
})

/**
 * Diese Werte stammen nicht aus einer Annahme, sondern aus dem echten
 * Eintragsformular auf in-muenchen.de/eintragsformular (abgelesen am
 * 26.07.2026). Ändert das Portal etwas, soll hier ein Test fehlschlagen und
 * nicht still ein zu langer Titel im Formular abgeschnitten werden.
 */
describe('IN München, am echten Formular abgelesen', () => {
  it('hält den Titel auf 60 Zeichen', () => {
    const kit = buildChannelKit(
      makeEvent({
        title: 'Ein sehr langer Titel für eine Veranstaltung im Pepe Dome mit vielen Worten',
      }),
      { now: NOW }
    )

    const title = fieldOf(kit.channels, 'in_muenchen', 'title')
    expect(title.max).toBe(60)
    expect(title.limitOrigin).toBe('portal')
    expect(title.value.length).toBeLessThanOrEqual(60)
    expect(title.truncated).toBe(true)
  })

  it('gibt Ort, Straße und PLZ getrennt aus, weil das Formular sie getrennt abfragt', () => {
    const kit = buildChannelKit(makeEvent(), { now: NOW })

    expect(fieldOf(kit.channels, 'in_muenchen', 'venueName').value).toBe('Pepe Dome')
    expect(fieldOf(kit.channels, 'in_muenchen', 'street').value).toBe(
      'Albert-Schweitzer-Straße 62 (Theatron Ostpark)'
    )
    expect(fieldOf(kit.channels, 'in_muenchen', 'cityLine').value).toBe('81735 München')
  })

  it('setzt in den Ticketlink nur einen echten Shop, nie die eigene Seite', () => {
    const kit = buildChannelKit(makeEvent(), { now: NOW })

    const ticket = fieldOf(kit.channels, 'in_muenchen', 'ticketLink')
    const website = fieldOf(kit.channels, 'in_muenchen', 'link')

    expect(ticket.value).toBe('https://rausgegangen.de/events/schwerelos/')
    expect(website.value).toContain('www.pepe-dome.de')
  })

  it('lässt den Ticketlink leer, wenn die Anmeldung per Mail läuft', () => {
    const kit = buildChannelKit(makeEvent({ ticketUrl: 'anmeldung@pepe-dome.de' }), {
      now: NOW,
    })

    const ticket = fieldOf(kit.channels, 'in_muenchen', 'ticketLink')
    expect(ticket.value).toBe('')
    expect(ticket.missing).toContain('nur echte Ticketlinks')
  })

  it('gibt die Beschreibung ohne Zeichenlimit aus, der Editor setzt keines', () => {
    const kit = buildChannelKit(makeEvent(), { now: NOW })
    const description = fieldOf(kit.channels, 'in_muenchen', 'description')

    expect(description.max).toBeNull()
    expect(description.limitOrigin).toBeNull()
  })
})

describe('Feldstruktur', () => {
  it('liefert für jeden konfigurierten Kanal genau dessen Felder', () => {
    const kit = buildChannelKit(makeEvent(), { now: NOW })

    expect(kit.channels).toHaveLength(CHANNELS.length)
    for (const channel of kit.channels) {
      const definition = CHANNELS.find((c) => c.id === channel.id)
      expect(channel.fields.map((f) => f.key)).toEqual(definition?.fields.map((f) => f.key))
    }
  })

  it('markiert angenommene Zeichenlimits, damit niemand dem Zähler blind vertraut', () => {
    const kit = buildChannelKit(makeEvent(), { now: NOW })

    // Google veröffentlicht keine Limits, die Zahlen sind dort geschätzt.
    const google = kit.channels.find((c) => c.id === 'google_business')
    expect(google?.hasAssumedLimits).toBe(true)
    expect(fieldOf(kit.channels, 'google_business', 'title').limitOrigin).toBe('annahme')
  })

  it('meldet für die abgelesenen Kanäle keine angenommenen Limits mehr', () => {
    const kit = buildChannelKit(makeEvent(), { now: NOW })

    for (const id of ['rausgegangen', 'in_muenchen']) {
      const channel = kit.channels.find((c) => c.id === id)
      expect(channel?.hasAssumedLimits, `Kanal ${id}`).toBe(false)
    }
  })

  /**
   * Facebook und Instagram haben kein Formular mit Feldgrenzen. Eine Grenze
   * dort als "ungeprüft" zu markieren wäre falsch: sie ist nicht geraten,
   * sondern bewusst gesetzt, weil längerer Text zusammengeklappt wird.
   */
  it('unterscheidet eine eigene Vorgabe von einer Annahme', () => {
    const kit = buildChannelKit(makeEvent(), { now: NOW })

    expect(fieldOf(kit.channels, 'facebook', 'post').limitOrigin).toBe('redaktion')
    expect(fieldOf(kit.channels, 'whatsapp', 'message').limitOrigin).toBe('redaktion')
    expect(fieldOf(kit.channels, 'instagram', 'caption').limitOrigin).toBe('portal')

    // Eine eigene Vorgabe ist kein Grund für die Warnung im Panel
    expect(kit.channels.find((c) => c.id === 'facebook')?.hasAssumedLimits).toBe(false)
    expect(kit.channels.find((c) => c.id === 'instagram')?.hasAssumedLimits).toBe(false)
  })

  it('gibt Feldern ohne Limit auch keine Herkunft', () => {
    const kit = buildChannelKit(makeEvent(), { now: NOW })

    for (const field of allFields(kit.channels)) {
      if (field.max === null) {
        expect(field.limitOrigin, `Feld ${field.label}`).toBeNull()
      } else {
        expect(field.limitOrigin, `Feld ${field.label}`).not.toBeNull()
      }
    }
  })

  it('nennt Ort und Anschrift, auch wenn im Event nur der Hausname steht', () => {
    const kit = buildChannelKit(makeEvent({ location: 'Pepe Dome' }), { now: NOW })
    const location = fieldOf(kit.channels, 'rausgegangen', 'location').value

    expect(location).toContain('Pepe Dome')
    expect(location).toContain('Albert-Schweitzer-Straße 62')
    expect(location).toContain('81735 München')
  })

  it('baut aus Titel und Untertitel eine Zeile', () => {
    const kit = buildChannelKit(
      makeEvent({ title: 'Cirque Nouveau', subtitle: 'Schwerelos' }),
      { now: NOW }
    )
    expect(fieldOf(kit.channels, 'rausgegangen', 'title').value).toBe(
      'Cirque Nouveau: Schwerelos'
    )
  })

  it('legt alle gefüllten Felder als einen Block zum Kopieren zusammen', () => {
    const kit = buildChannelKit(makeEvent(), { now: NOW })
    const rausgegangen = kit.channels.find((c) => c.id === 'rausgegangen')

    expect(rausgegangen?.copyAll).toContain('Titel:')
    expect(rausgegangen?.copyAll).toContain('Ort:')
    expect(rausgegangen?.copyAll).toContain('Schwerelos')
  })
})
