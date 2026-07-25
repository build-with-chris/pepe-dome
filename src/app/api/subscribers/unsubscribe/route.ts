/**
 * Abmeldung vom Newsletter
 *
 * POST /api/subscribers/unsubscribe?token=...
 *
 * Zwei Dinge waren hier vorher falsch:
 *
 * 1. Es genügte `?email=fremde@adresse.de`, um eine beliebige Person
 *    auszutragen. Ohne Token, ohne Login, ohne Rate-Limit. Mit einer
 *    Adressliste ließ sich der gesamte Verteiler leeren, und die Betroffenen
 *    konnten sich nicht einmal neu anmelden, weil abgemeldete Adressen
 *    abgewiesen werden.
 *
 * 2. GET hat den Status verändert. Mailprogramme, Virenscanner und
 *    Link-Vorschauen rufen Links in Mails ungefragt auf — das allein meldet
 *    Leute ab, die nie geklickt haben.
 *
 * Jetzt: GET verändert nichts und leitet auf die Bestätigungsseite. Die
 * Änderung passiert nur per POST mit dem Token aus der jeweiligen Mail.
 * Das POST erfüllt zugleich RFC 8058 (List-Unsubscribe-Post: One-Click),
 * damit Gmail und Outlook ihren eigenen Abmelde-Knopf anbieten können.
 */

import { NextRequest, NextResponse } from 'next/server'
import { unsubscribeSubscriber } from '@/lib/subscribers'
import { EMAIL_CONFIG } from '@/lib/resend'

/** Token aus Query oder JSON-Body lesen. Provider schicken es als Query mit. */
async function readToken(request: NextRequest): Promise<string | null> {
  const fromQuery = request.nextUrl.searchParams.get('token')
  if (fromQuery) return fromQuery

  try {
    const body = await request.json()
    const token = body?.token
    return typeof token === 'string' && token ? token : null
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  const token = await readToken(request)

  if (!token) {
    return NextResponse.json(
      { error: 'Bad Request', message: 'Abmelde-Token fehlt.' },
      { status: 400 }
    )
  }

  let unsubscribed = false

  try {
    await unsubscribeSubscriber(token)
    unsubscribed = true
  } catch (error) {
    console.error('[UNSUBSCRIBE] fehlgeschlagen:', error)
  }

  /**
   * Immer HTTP 200, aber der tatsächliche Ausgang steht im Body.
   *
   * Der Statuscode darf nicht abweichen: Für den Mailprovider ist 200 bei
   * One-Click die einzige erwartete Antwort — ein Fehlerstatus brächte Gmail
   * dazu, den Abmelde-Knopf künftig auszublenden. Und ein abweichender Status
   * würde verraten, ob ein Token gültig ist.
   *
   * Das Feld `unsubscribed` sagt der Bestätigungsseite trotzdem die Wahrheit.
   * Ohne diese Trennung meldete die Seite auch dann Erfolg, wenn gar nichts
   * passiert ist — jemand mit einem alten Link hätte sich für abgemeldet
   * gehalten und weiter Post bekommen.
   */
  return NextResponse.json({ success: true, unsubscribed })
}

/**
 * GET verändert nichts.
 *
 * Der Link in der Mail zeigt auf die Seite /newsletter/unsubscribe/<token>,
 * die eine Rückfrage anzeigt. Wer hier direkt landet, wird dorthin geschickt.
 */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  const base = EMAIL_CONFIG.BASE_URL

  if (token) {
    return NextResponse.redirect(new URL(`/newsletter/unsubscribe/${token}`, base), 302)
  }

  return NextResponse.redirect(new URL('/newsletter/unsubscribed?success=false', base), 302)
}
