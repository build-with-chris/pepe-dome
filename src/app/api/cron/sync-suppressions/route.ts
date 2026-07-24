import { NextRequest, NextResponse } from 'next/server'
import { syncSuppressions } from '@/lib/suppressions'

/**
 * GET /api/cron/sync-suppressions
 *
 * Gleicht Resends Suppression-Liste (Bounces, Beschwerden) mit unseren
 * Abonnent:innen ab und trägt betroffene Adressen automatisch aus.
 *
 * Gedacht als täglicher Cron. Auth identisch zum bestehenden Newsletter-Cron.
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

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await syncSuppressions()

    if (result.unsubscribed > 0) {
      console.log('[suppressions] ausgetragen:', result.unsubscribed, result.details)
    }

    return NextResponse.json({ success: true, ...result })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unbekannter Fehler'
    console.error('[suppressions] Sync fehlgeschlagen:', message)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
