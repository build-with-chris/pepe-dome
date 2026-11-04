import { NextRequest, NextResponse } from 'next/server'
import { resend, DEFAULT_FROM_EMAIL } from '@/lib/resend'
import { fetchUpcomingShows } from '@/lib/snapticket'
import { buildReportMail, summarizeShows } from '@/lib/ticket-report'

/**
 * GET /api/cron/ticket-report
 *
 * Schickt mittwochs die verkauften Tickets pro kommender Show an die feste
 * Adressliste aus TICKET_REPORT_RECIPIENTS. Schlägt etwas fehl, geht keine Mail
 * raus: Die ausbleibende Mail ist das Signal, die Ursache steht im Vercel-Log.
 */

function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret) {
    if (process.env.NODE_ENV === 'development') return true
    console.error('CRON_SECRET not configured in production — blocking request')
    return false
  }

  if (!authHeader) return false

  // "Bearer <secret>" — timing-safe vergleichen
  const token = authHeader.replace('Bearer ', '')
  if (token.length !== cronSecret.length) return false
  let mismatch = 0
  for (let i = 0; i < token.length; i++) {
    mismatch |= token.charCodeAt(i) ^ cronSecret.charCodeAt(i)
  }
  return mismatch === 0
}

function parseRecipients(value: string | undefined): string[] {
  return (value ?? '')
    .split(',')
    .map((address) => address.trim())
    .filter(Boolean)
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const apiKey = process.env.SNAPTICKET_API_KEY
    if (!apiKey) throw new Error('SNAPTICKET_API_KEY fehlt')

    const recipients = parseRecipients(process.env.TICKET_REPORT_RECIPIENTS)
    if (recipients.length === 0) throw new Error('TICKET_REPORT_RECIPIENTS fehlt')

    const now = new Date()
    const rows = summarizeShows(await fetchUpcomingShows(apiKey, now), now)
    const { subject, html } = buildReportMail(rows, now)

    const { error } = await resend.emails.send({
      from: DEFAULT_FROM_EMAIL,
      to: recipients,
      subject,
      html,
    })
    if (error) throw new Error(`Resend: ${error.message}`)

    return NextResponse.json({ success: true, shows: rows.length })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unbekannter Fehler'
    console.error('[ticket-report] fehlgeschlagen:', message)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
