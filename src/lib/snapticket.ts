/**
 * Lesender Zugriff auf Snapticket (läuft auf der Vivenu-API).
 *
 * Von den Tickets wird nur createdAt übernommen. Namen und Adressen der
 * Käufer:innen stehen zwar in der Antwort, verlassen diese Datei aber nicht.
 */

import 'server-only'
import type { Show } from './ticket-report'

const BASE_URL = 'https://vivenu.com/api'

/** Die Vivenu-Doku nennt für `top` teils 100, teils 1000. 100 gilt in beiden Fällen. */
const PAGE_SIZE = 100

interface Page<T> {
  rows: T[]
  total: number
}

interface VivenuEvent {
  _id: string
  name: string
  start: string
  end?: string
}

interface VivenuTicket {
  createdAt: string
}

/**
 * Holt alle Einträge eines Endpunkts über `skip`.
 *
 * Wirft bei jeder Abweichung, statt einen Teil zurückzugeben: Lieber keine Mail
 * als eine mit halben Zahlen. Die Fehlertexte enthalten den Key nie, er steht
 * nur im Header.
 */
async function fetchAll<T>(path: string, apiKey: string): Promise<T[]> {
  const items: T[] = []

  for (;;) {
    const separator = path.includes('?') ? '&' : '?'
    const pagePath = `${path}${separator}top=${PAGE_SIZE}&skip=${items.length}`
    const response = await fetch(`${BASE_URL}${pagePath}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`Snapticket antwortet mit ${response.status} auf ${pagePath}`)
    }

    const page = (await response.json()) as Partial<Page<T>>
    if (!Array.isArray(page.rows) || typeof page.total !== 'number') {
      throw new Error(`Unerwartete Antwort von Snapticket auf ${pagePath}`)
    }

    items.push(...page.rows)
    if (items.length >= page.total) return items

    if (page.rows.length === 0) {
      throw new Error(
        `Snapticket liefert nur ${items.length} von ${page.total} Einträgen auf ${path}`
      )
    }
  }
}

/** Alle Shows, die noch nicht vorbei sind, mit den Kaufzeitpunkten ihrer gültigen Tickets. */
export async function fetchUpcomingShows(apiKey: string, now: Date): Promise<Show[]> {
  const events = await fetchAll<VivenuEvent>('/events', apiKey)
  const upcoming = events.filter(
    (event) => new Date(event.end ?? event.start).getTime() >= now.getTime()
  )

  return Promise.all(
    upcoming.map(async (event) => {
      const tickets = await fetchAll<VivenuTicket>(
        `/tickets?event=${encodeURIComponent(event._id)}&status=VALID`,
        apiKey
      )
      return {
        name: event.name,
        start: event.start,
        ticketCreatedAt: tickets.map((ticket) => ticket.createdAt),
      }
    })
  )
}
