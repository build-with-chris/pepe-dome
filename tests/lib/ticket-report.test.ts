/**
 * Ticket-Update: Zählen und Mail-Inhalt
 */

import { describe, it, expect } from 'vitest'
import { buildReportMail, NO_SHOWS_NOTICE, summarizeShows } from '@/lib/ticket-report'

const NOW = new Date('2026-11-04T07:00:00.000Z')

function daysAgo(days: number): string {
  return new Date(NOW.getTime() - days * 24 * 60 * 60 * 1000).toISOString()
}

describe('summarizeShows', () => {
  it('zählt ein Ticket von vor 6 Tagen als neu, eines von vor 8 Tagen nicht, beide im Gesamt', () => {
    const [row] = summarizeShows(
      [{ name: 'Show', start: '2026-11-28T18:00:00.000Z', ticketCreatedAt: [daysAgo(6), daysAgo(8)] }],
      NOW
    )

    expect(row.total).toBe(2)
    expect(row.recent).toBe(1)
  })

  it('sortiert nach Datum und behält Shows ohne Tickets mit 0', () => {
    const rows = summarizeShows(
      [
        { name: 'Später', start: '2026-11-28T18:00:00.000Z', ticketCreatedAt: [daysAgo(1)] },
        { name: 'Früher', start: '2026-11-14T19:00:00.000Z', ticketCreatedAt: [] },
      ],
      NOW
    )

    expect(rows.map((row) => row.name)).toEqual(['Früher', 'Später'])
    expect(rows[0]).toMatchObject({ total: 0, recent: 0 })
  })
})

describe('buildReportMail', () => {
  it('zeigt Show, Datum, Gesamt und Neu in der Tabelle', () => {
    const { subject, html } = buildReportMail(
      [{ name: 'Steh auf Comedy', start: '2026-11-28T18:00:00.000Z', total: 19, recent: 3 }],
      NOW
    )

    expect(subject).toBe('Ticket-Update vom 04.11.2026')
    expect(html).toContain('Steh auf Comedy')
    expect(html).toContain('28.11.2026')
    expect(html).toContain('>19</td>')
    expect(html).toContain('>3</td>')
  })

  it('rechnet das Datum in Münchner Zeit, nicht in UTC', () => {
    const { html } = buildReportMail(
      [{ name: 'Spät', start: '2026-11-28T23:30:00.000Z', total: 0, recent: 0 }],
      NOW
    )

    expect(html).toContain('29.11.2026')
  })

  it('zeigt ohne kommende Shows genau den Hinweis und keine Tabelle', () => {
    const { html } = buildReportMail([], NOW)

    expect(html).toContain(NO_SHOWS_NOTICE)
    expect(html).not.toContain('<table')
  })

  it('maskiert HTML im Show-Namen', () => {
    const { html } = buildReportMail(
      [{ name: '<b>A&B</b>', start: '2026-11-28T18:00:00.000Z', total: 0, recent: 0 }],
      NOW
    )

    expect(html).toContain('&lt;b&gt;A&amp;B&lt;/b&gt;')
    expect(html).not.toContain('<b>')
  })
})
