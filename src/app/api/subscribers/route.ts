/**
 * Subscriber signup endpoint
 * POST /api/subscribers
 */

import { NextRequest } from 'next/server'
import { subscriberSignupSchema } from '@/lib/validation'
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  addRateLimitHeaders,
} from '@/lib/api-response'
import { checkRateLimit, getClientIdentifier, type RateLimitResult } from '@/lib/rate-limit'
import { createSubscriber, validateEmail, generateOptInToken } from '@/lib/subscribers'
import { prisma } from '@/lib/prisma'
import { sendConfirmationEmail } from '@/lib/email-send'
import { getBaseUrlFromRequest } from '@/lib/resend'

const RATE_LIMIT_MAX = 5

/**
 * Immer dieselbe Antwort, egal ob neu, schon angemeldet oder reaktiviert.
 *
 * Bewusst ohne Daten zum Abonnenten: Eine zurückgegebene ID oder ein Status
 * wäre wieder genau die Auskunft, die hier niemand bekommen soll.
 */
function uniformSuccess(rateLimit: RateLimitResult) {
  const response = successResponse(
    {
      message:
        'Wenn die Adresse gültig ist, liegt gleich eine Mail mit dem Bestätigungslink im Postfach.',
    },
    undefined,
    201
  )

  return addRateLimitHeaders(response, RATE_LIMIT_MAX, rateLimit.remaining, rateLimit.resetAt)
}

/**
 * Bestätigungsmail verschicken, ohne den Aufrufer scheitern zu lassen.
 *
 * Ein Fehler beim Mailversand darf hier keine abweichende Antwort erzeugen —
 * sonst liesse sich am Verhalten wieder ablesen, ob die Adresse bekannt war.
 */
async function trySendConfirmation(subscriberId: string, baseUrl: string) {
  try {
    await sendConfirmationEmail(subscriberId, baseUrl)
  } catch (error) {
    console.error('[SIGNUP] Bestätigungsmail fehlgeschlagen:', error)
  }
}

/**
 * Baut den Tracking-Vermerk für die Metadaten des Abonnenten.
 *
 * Ohne Einwilligung wird nichts vermerkt, auch kein _fbp. Fehlen die Cookies
 * trotz Einwilligung, bleibt der Vermerk trotzdem: Adblocker verhindern das
 * Pixel, nicht die Erlaubnis, und genau dafür gibt es den Serverweg.
 */
function trackingVermerk(
  request: NextRequest,
  data: { trackingConsent?: boolean; source?: string }
): { tracking: Record<string, string | boolean> } | undefined {
  if (data.trackingConsent !== true) return undefined

  const tracking: Record<string, string | boolean> = {
    marketingConsent: true,
    at: new Date().toISOString(),
  }

  const fbp = request.cookies.get('_fbp')?.value
  const fbc = request.cookies.get('_fbc')?.value
  if (fbp) tracking.fbp = fbp
  if (fbc) tracking.fbc = fbc
  if (data.source) tracking.source = data.source

  return { tracking }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 5 signups per hour per IP
    const identifier = getClientIdentifier(request)
    const rateLimit = checkRateLimit(identifier, {
      maxRequests: 5,
      windowMs: 60 * 60 * 1000,
    })

    if (!rateLimit.allowed) {
      const response = errorResponse(
        'RATE_LIMIT_EXCEEDED',
        'Too many signup requests. Please try again later.',
        429
      )
      return addRateLimitHeaders(
        response,
        5,
        rateLimit.remaining,
        rateLimit.resetAt
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validation = subscriberSignupSchema.safeParse(body)

    if (!validation.success) {
      return validationErrorResponse(validation.error)
    }

    const { email, firstName, interests } = validation.data
    const vermerk = trackingVermerk(request, validation.data)

    // Additional email validation
    if (!validateEmail(email)) {
      return errorResponse('INVALID_EMAIL', 'Invalid email format', 400)
    }

    // Check for existing subscriber
    const existing = await prisma.subscriber.findUnique({
      where: { email },
    })

    /**
     * Ab hier antwortet die Route in jedem Fall gleich.
     *
     * Vorher verriet sie über den Fehlercode, ob eine Adresse bekannt ist und
     * in welchem Zustand: ALREADY_SUBSCRIBED, CONFIRMATION_PENDING,
     * PREVIOUSLY_UNSUBSCRIBED. Damit liess sich für jede beliebige Adresse
     * abfragen, ob die Person den Newsletter bezieht — eine Auskunft über
     * Dritte, die niemandem zusteht.
     *
     * Was tatsächlich passiert, entscheidet sich still im Hintergrund. Wer die
     * Adresse wirklich besitzt, erfährt alles Weitere per Mail.
     */
    const baseUrl = getBaseUrlFromRequest(request)

    if (existing) {
      // Schon bestätigt: nichts tun. Eine erneute Mail wäre unverlangt.
      if (existing.status === 'ACTIVE') {
        console.log('[SIGNUP] bereits aktiv, keine Aktion')
        return uniformSuccess(rateLimit)
      }

      // Bestätigung läuft noch: erneut schicken, falls die erste im Spam landete.
      if (existing.status === 'PENDING') {
        await trySendConfirmation(existing.id, baseUrl)
        return uniformSuccess(rateLimit)
      }

      /**
       * Abgemeldet oder gebounct: Wiederanmeldung erlauben, aber nur über eine
       * frische Bestätigung.
       *
       * Vorher war hier Endstation — wer sich einmal abgemeldet hatte, kam nie
       * wieder rein. Zusammen mit der ungeschützten Abmelde-Route hiess das:
       * Ein Fremder konnte jemanden austragen und dauerhaft aussperren.
       *
       * Kein direktes Reaktivieren: Der Status geht auf PENDING und wird erst
       * wieder aktiv, wenn die Person den Link in ihrem Postfach anklickt. Nur
       * so ist es eine echte neue Einwilligung.
       */
      const reactivated = await prisma.subscriber.update({
        where: { id: existing.id },
        data: {
          status: 'PENDING',
          firstName: firstName ?? existing.firstName,
          interests: interests || existing.interests,
          doubleOptInToken: generateOptInToken(),
          doubleOptInSentAt: new Date(),
          unsubscribedAt: null,
          // Frische Anmeldung, frischer Vermerk. Vorhandene Metadaten bleiben,
          // der alte Tracking-Vermerk wird ersetzt, sonst gilt ein reportedAt
          // von damals für die neue Bestätigung.
          ...(vermerk
            ? {
                metadata: {
                  ...(existing.metadata && typeof existing.metadata === 'object'
                    ? (existing.metadata as Record<string, unknown>)
                    : {}),
                  ...vermerk,
                },
              }
            : {}),
        },
      })

      await trySendConfirmation(reactivated.id, baseUrl)
      return uniformSuccess(rateLimit)
    }

    // Create subscriber
    const subscriber = await createSubscriber({
      email,
      firstName,
      interests,
      metadata: vermerk,
    })

    // Send confirmation email via Resend (Basis-URL aus Request, damit Link auf echte Domain zeigt)
    try {
      await sendConfirmationEmail(subscriber.id, baseUrl)
      console.log(`Confirmation email sent to ${subscriber.email}`)
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError)
      // Rollback: den PENDING-Datensatz wieder entfernen, damit ein erneuter
      // Versuch als frische Anmeldung durchläuft statt an
      // "Bestätigung läuft bereits" hängenzubleiben.
      await prisma.subscriber.delete({ where: { id: subscriber.id } }).catch(() => {})
      // Trotzdem dieselbe Antwort wie sonst. Ein 500 nur an dieser Stelle wäre
      // wieder ein Orakel: Es träte ausschliesslich bei unbekannten Adressen
      // auf und verriete damit genau das, was die einheitliche Antwort
      // verbergen soll.
    }

    return uniformSuccess(rateLimit)
  } catch (error) {
    console.error('Subscriber signup error:', error)
    return errorResponse(
      'INTERNAL_ERROR',
      'An error occurred while processing your request.',
      500
    )
  }
}
