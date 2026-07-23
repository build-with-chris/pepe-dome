/**
 * Contact request endpoint
 * POST /api/contact
 *
 * Nimmt Anfragen aus dem Kontaktformular entgegen und leitet sie
 * per E-Mail (Resend) an das Pepe-Dome-Team weiter. Reply-To zeigt
 * auf die Adresse des Absenders (falls angegeben), damit direkt
 * geantwortet werden kann.
 *
 * Rate-Limit: 5 Anfragen pro Stunde pro IP.
 */

import { NextRequest } from 'next/server'
import { contactRequestSchema } from '@/lib/validation'
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  addRateLimitHeaders,
} from '@/lib/api-response'
import { checkRateLimit, getClientIdentifier } from '@/lib/rate-limit'
import { resend, DEFAULT_FROM_EMAIL } from '@/lib/resend'

/** Empfänger der Kontaktanfragen (Postfach mit Push aufs Handy) */
const NOTIFY_EMAIL = process.env.CONTACT_NOTIFY_EMAIL || 'info@pepe-dome.de'

const CHANNEL_LABELS: Record<string, string> = {
  callback: 'Rückruf',
  whatsapp: 'WhatsApp',
  email: 'E-Mail',
}

export async function POST(request: NextRequest) {
  try {
    const identifier = getClientIdentifier(request)
    const rateLimit = checkRateLimit(identifier, {
      maxRequests: 5,
      windowMs: 60 * 60 * 1000,
    })

    if (!rateLimit.allowed) {
      const response = errorResponse(
        'RATE_LIMIT_EXCEEDED',
        'Zu viele Anfragen. Bitte versuche es später erneut.',
        429
      )
      return addRateLimitHeaders(response, 5, rateLimit.remaining, rateLimit.resetAt)
    }

    const body = await request.json()
    const validation = contactRequestSchema.safeParse(body)

    if (!validation.success) {
      return validationErrorResponse(validation.error)
    }

    const { name, message, channel, phone, email, reachability } = validation.data
    const channelLabel = CHANNEL_LABELS[channel] ?? channel

    const lines = [
      'Neue Anfrage über das Kontaktformular pepe-dome.de',
      '',
      `Name: ${name}`,
      `Gewünschter Kontaktweg: ${channelLabel}`,
      ...(phone?.trim() ? [`Telefon: ${phone.trim()}`] : []),
      ...(email?.trim() ? [`E-Mail: ${email.trim()}`] : []),
      ...(reachability?.trim() ? [`Am besten erreichbar: ${reachability.trim()}`] : []),
      '',
      'Anliegen:',
      message,
    ]

    const result = await resend.emails.send({
      from: DEFAULT_FROM_EMAIL,
      to: NOTIFY_EMAIL,
      replyTo: email?.trim() || undefined,
      subject: `Kontaktanfrage von ${name} · ${channelLabel} gewünscht`,
      text: lines.join('\n'),
    })

    if (result.error) {
      console.error('[CONTACT] Resend error:', result.error)
      return errorResponse(
        'SEND_FAILED',
        'Nachricht konnte nicht übermittelt werden. Bitte versuche es später erneut.',
        502
      )
    }

    return successResponse({ sent: true })
  } catch (error) {
    console.error('[CONTACT] Unexpected error:', error)
    return errorResponse(
      'INTERNAL_ERROR',
      'Etwas ist schiefgelaufen. Bitte versuche es später erneut.',
      500
    )
  }
}
