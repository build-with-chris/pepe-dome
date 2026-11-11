/**
 * Tägliches Ticket-Update: zählt und baut die Mail.
 * Reine Funktionen, keine Netzaufrufe.
 */

export interface Show {
  name: string
  /** ISO-Zeitpunkt des Beginns */
  start: string
  /** createdAt aller gültigen Tickets */
  ticketCreatedAt: string[]
}

export interface ReportRow {
  name: string
  start: string
  total: number
  /** Tickets aus den letzten 7 Tagen */
  recent: number
}

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

/** Der Hinweis, wenn gerade keine Show im Verkauf ist. */
export const NO_SHOWS_NOTICE = 'Keine kommenden Shows.'

const dateFormat = new Intl.DateTimeFormat('de-DE', {
  timeZone: 'Europe/Berlin',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

/** Pro Show Gesamtzahl und Zuwachs, sortiert nach Datum. */
export function summarizeShows(shows: Show[], now: Date): ReportRow[] {
  const cutoff = now.getTime() - SEVEN_DAYS_MS

  return shows
    .map((show) => ({
      name: show.name,
      start: show.start,
      total: show.ticketCreatedAt.length,
      recent: show.ticketCreatedAt.filter((createdAt) => new Date(createdAt).getTime() > cutoff)
        .length,
    }))
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
}

/** Show-Namen kommen von aussen und dürfen das Mail-HTML nicht verändern. */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const CELL = 'padding:6px 12px;border-bottom:1px solid #ddd;'
const NUMBER_CELL = `${CELL}text-align:right;`

function renderTable(rows: ReportRow[]): string {
  const body = rows
    .map(
      (row) =>
        `<tr><td style="${CELL}">${escapeHtml(row.name)}</td>` +
        `<td style="${CELL}">${dateFormat.format(new Date(row.start))}</td>` +
        `<td style="${NUMBER_CELL}">${row.total}</td>` +
        `<td style="${NUMBER_CELL}">${row.recent}</td></tr>`
    )
    .join('')

  return (
    '<table style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">' +
    `<thead><tr><th style="${CELL}text-align:left;">Show</th>` +
    `<th style="${CELL}text-align:left;">Datum</th>` +
    `<th style="${NUMBER_CELL}">Tickets gesamt</th>` +
    `<th style="${NUMBER_CELL}">Neu (7 Tage)</th></tr></thead>` +
    `<tbody>${body}</tbody></table>`
  )
}

export function buildReportMail(rows: ReportRow[], now: Date): { subject: string; html: string } {
  return {
    subject: `Ticket-Update vom ${dateFormat.format(now)}`,
    html:
      rows.length > 0
        ? renderTable(rows)
        : `<p style="font-family:sans-serif;font-size:14px;">${NO_SHOWS_NOTICE}</p>`,
  }
}
