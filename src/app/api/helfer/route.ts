/**
 * Helfermeldung
 * POST /api/helfer
 *
 * Nimmt Meldungen von /mithelfen entgegen. Eine Mail geht an die Sammeladresse
 * und an jede eingetragene Adresse der betroffenen Bereiche. Ist der Kontakt
 * eine E-Mail-Adresse, bekommt die Person eine Bestätigung mit der Zusage
 * "Antwort innerhalb von 48 Stunden".
 *
 * Nichts wird gespeichert. Das Postfach ist die Liste (siehe
 * pepe-dome-mithelfen/SPEC.md).
 *
 * Rate-Limit: 5 Meldungen pro Stunde pro IP.
 */

import { NextRequest } from 'next/server'
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  addRateLimitHeaders,
} from '@/lib/api-response'
import { checkRateLimit, getClientIdentifier } from '@/lib/rate-limit'
import { botGrund } from '@/lib/bot-schutz'
import { resend, DEFAULT_FROM_EMAIL } from '@/lib/resend'
import {
  helferMeldungSchema,
  empfaenger,
  meldungsText,
  bestaetigungsText,
  istEmail,
} from '@/lib/mithelfen'

/** Sammeladresse für alle Meldungen. Fällt auf das Kontaktpostfach zurück. */
const SAMMELADRESSE =
  process.env.HELFER_NOTIFY_EMAIL || process.env.CONTACT_NOTIFY_EMAIL || 'info@pepe-dome.de'

export async function POST(request: NextRequest) {
  try {
    const identifier = getClientIdentifier(request)
    const rateLimit = checkRateLimit(`helfer:${identifier}`, {
      maxRequests: 5,
      windowMs: 60 * 60 * 1000,
    })

    if (!rateLimit.allowed) {
      const response = errorResponse(
        'RATE_LIMIT_EXCEEDED',
        'Zu viele Meldungen. Bitte versuche es später erneut.',
        429
      )
      return addRateLimitHeaders(response, 5, rateLimit.remaining, rateLimit.resetAt)
    }

    const body = await request.json()
    const validation = helferMeldungSchema.safeParse(body)
    if (!validation.success) {
      return validationErrorResponse(validation.error)
    }
    const meldung = validation.data

    // Bots bekommen dieselbe Antwort wie Menschen, aber es geht keine Mail raus.
    const grund = botGrund(meldung)
    if (grund) {
      console.warn('[HELFER] Bot erkannt:', grund)
      return successResponse({ sent: true })
    }

    const result = await resend.emails.send({
      from: DEFAULT_FROM_EMAIL,
      to: empfaenger(meldung.aufgaben, SAMMELADRESSE),
      replyTo: istEmail(meldung.kontakt) ? meldung.kontakt.trim() : undefined,
      subject: `Helfermeldung von ${meldung.name} · ${meldung.aufgaben.length} ${
        meldung.aufgaben.length === 1 ? 'Aufgabe' : 'Aufgaben'
      }`,
      text: meldungsText(meldung),
    })

    if (result.error) {
      console.error('[HELFER] Resend error:', result.error)
      return errorResponse(
        'SEND_FAILED',
        'Deine Meldung konnte nicht übermittelt werden. Bitte versuche es später erneut.',
        502
      )
    }

    // Die Bestätigung ist nett, aber nicht entscheidend. Scheitert sie, ist die
    // Meldung trotzdem angekommen, deshalb kein Fehler an die Person.
    if (istEmail(meldung.kontakt)) {
      const bestaetigung = await resend.emails.send({
        from: DEFAULT_FROM_EMAIL,
        to: meldung.kontakt.trim(),
        subject: 'Deine Meldung zum Mithelfen im Pepe Dome',
        text: bestaetigungsText(meldung),
      })
      if (bestaetigung.error) {
        console.error('[HELFER] Bestätigung fehlgeschlagen:', bestaetigung.error)
      }
    }

    return successResponse({ sent: true })
  } catch (error) {
    console.error('[HELFER] Unexpected error:', error)
    return errorResponse(
      'INTERNAL_ERROR',
      'Etwas ist schiefgelaufen. Bitte versuche es später erneut.',
      500
    )
  }
}
