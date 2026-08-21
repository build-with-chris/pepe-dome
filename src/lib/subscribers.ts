/**
 * Subscriber management utilities
 */

import { prisma } from './prisma'
import { SubscriberStatus, Prisma } from '@prisma/client'
import crypto from 'crypto'

/**
 * Generate a secure token for double opt-in
 */
export function generateOptInToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Dauerhaftes Geheimnis für den Abmeldelink.
 *
 * Getrennt vom Opt-in-Token, weil dieses hier nicht verfällt und nach der
 * Bestätigung nicht gelöscht wird: Der Abmeldelink muss auch in einer zwei
 * Jahre alten Mail noch funktionieren.
 */
export function generateUnsubscribeToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Get active subscribers, optionally filtered by interests
 */
export async function getActiveSubscribers(interests?: string[]) {
  const where: Prisma.SubscriberWhereInput = {
    status: SubscriberStatus.ACTIVE,
  }

  // If interests provided, filter by them
  if (interests && interests.length > 0) {
    where.OR = interests.map((interest) => ({
      interests: {
        path: '$',
        array_contains: interest,
      },
    }))
  }

  return await prisma.subscriber.findMany({
    where,
    select: {
      id: true,
      email: true,
      firstName: true,
      interests: true,
    },
  })
}

/**
 * Create a new subscriber with pending status
 */
export async function createSubscriber(data: {
  email: string
  firstName?: string
  interests?: string[]
  /**
   * Freie Zusatzangaben, aktuell der Tracking-Vermerk aus dem Anmeldeformular.
   * Siehe TrackingMetadata in src/lib/tracking-server.ts.
   */
  metadata?: Record<string, unknown>
}) {
  const token = generateOptInToken()

  return await prisma.subscriber.create({
    data: {
      email: data.email,
      firstName: data.firstName,
      interests: data.interests || [],
      status: SubscriberStatus.PENDING,
      doubleOptInToken: token,
      // doubleOptInSentAt bleibt hier bewusst leer.
      //
      // Frueher stand hier `new Date()`, also der Moment des Anlegens. Das Feld
      // behauptete damit, eine Bestaetigungsmail sei raus, bevor der Versand
      // ueberhaupt versucht wurde. Schlug er fehl, blieb die Behauptung stehen.
      // Bei der Fehlersuche im August 2026 sah es deshalb so aus, als seien
      // alle 139 offenen Anmeldungen beschickt worden; zehn davon waren es nie.
      //
      // Gesetzt wird es jetzt nur noch an einer Stelle: in sendConfirmationEmail
      // nach einem erfolgreichen Resend-Aufruf. Ein leeres Feld heisst damit
      // zuverlaessig "nichts rausgegangen".
      unsubscribeToken: generateUnsubscribeToken(),
      ...(data.metadata ? { metadata: data.metadata } : {}),
    },
  })
}

/**
 * Haelt fest, dass der Versand der Bestaetigungsmail gescheitert ist.
 *
 * Zwei Wege legen einen Abonnenten an und rollen bei einem Fehlschlag nicht
 * zurueck: die Wiederanmeldung einer bekannten Adresse und das Anlegen ueber
 * das Admin-Panel. Dort blieb bisher nur eine Zeile im Server-Log, und die ist
 * nach ein paar Tagen weg. Uebrig blieb ein Datensatz, dem man nicht ansah,
 * dass nie jemand eine Mail bekommen hat.
 *
 * Der Vermerk landet in den Metadaten und ist damit im Panel sichtbar. Er wirft
 * selbst nie: eine misslungene Notiz darf die Anmeldung nicht zusaetzlich
 * kippen.
 */
export async function vermerkeVersandfehler(subscriberId: string, fehler: unknown) {
  try {
    const vorhanden = await prisma.subscriber.findUnique({
      where: { id: subscriberId },
      select: { metadata: true },
    })
    const meta =
      vorhanden?.metadata && typeof vorhanden.metadata === 'object' && !Array.isArray(vorhanden.metadata)
        ? (vorhanden.metadata as Record<string, unknown>)
        : {}

    await prisma.subscriber.update({
      where: { id: subscriberId },
      data: {
        metadata: {
          ...meta,
          versandFehlgeschlagen: {
            am: new Date().toISOString(),
            fehler: fehler instanceof Error ? fehler.message : String(fehler),
          },
        },
      },
    })
  } catch (notizFehler) {
    console.error('[SIGNUP] Vermerk zum Versandfehler nicht speicherbar:', notizFehler)
  }
}

/**
 * Confirm a subscriber's email address
 */
export async function confirmSubscriber(token: string) {
  const subscriber = await prisma.subscriber.findUnique({
    where: { doubleOptInToken: token },
  })

  if (!subscriber) {
    throw new Error('Invalid or expired confirmation token')
  }

  if (subscriber.status === SubscriberStatus.ACTIVE) {
    return subscriber // Already confirmed
  }

  // Check if token is not too old (e.g., 7 days)
  const tokenAge = Date.now() - (subscriber.doubleOptInSentAt?.getTime() || 0)
  const maxAge = 7 * 24 * 60 * 60 * 1000 // 7 days
  if (tokenAge > maxAge) {
    throw new Error('Confirmation token has expired')
  }

  return await prisma.subscriber.update({
    where: { id: subscriber.id },
    data: {
      status: SubscriberStatus.ACTIVE,
      confirmedAt: new Date(),
      doubleOptInToken: null, // Clear token after use
    },
  })
}

/** UUID, wie sie `@default(uuid())` für die Subscriber-ID erzeugt. */
const UUID_MUSTER = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Meldet einen Abonnenten ab.
 *
 * Angenommen wird das persönliche Abmelde-Token und, nur als Rückfalltür für
 * alte Mails, die Subscriber-ID.
 *
 * Warum die ID trotz der Härtung vom Juli wieder mitzählt: Alle bis dahin
 * versendeten Newsletter tragen einen Abmeldelink der Form
 * /newsletter/unsubscribe/<id>. Ohne diesen Zweig lief jeder Klick darin ins
 * Leere — die Seite kam, der Knopf meldete einen Fehler, abgemeldet wurde
 * niemand. Über tausend Abonnenten hatten damit faktisch keinen Opt-out, und
 * genau darüber kam eine Beschwerde.
 *
 * Die Lücke von damals lag nicht an der ID, sondern an der E-Mail-Adresse:
 * `OR: [{ email }, { id }]` machte den Verteiler mit einer beliebigen
 * Adressliste leerräumbar. Die ID ist dagegen eine zufällige UUID, steht in
 * derselben Mail wie der Abmeldelink und ist nicht zu erraten. Die Adresse
 * bleibt abgewiesen, dafür sorgt das Format-Muster.
 */
export async function unsubscribeSubscriber(token: string) {
  if (!token) {
    throw new Error('Missing unsubscribe token')
  }

  const subscriber = await prisma.subscriber.findFirst({
    where: UUID_MUSTER.test(token)
      ? { OR: [{ unsubscribeToken: token }, { id: token }] }
      : { unsubscribeToken: token },
  })

  if (!subscriber) {
    throw new Error('Subscriber not found')
  }

  if (subscriber.status === SubscriberStatus.UNSUBSCRIBED) {
    return subscriber // Already unsubscribed
  }

  return await prisma.subscriber.update({
    where: { id: subscriber.id },
    data: {
      status: SubscriberStatus.UNSUBSCRIBED,
      unsubscribedAt: new Date(),
    },
  })
}

/**
 * Get subscriber statistics
 */
export async function getSubscriberStats() {
  const [total, active, pending, unsubscribed] = await Promise.all([
    prisma.subscriber.count(),
    prisma.subscriber.count({ where: { status: SubscriberStatus.ACTIVE } }),
    prisma.subscriber.count({ where: { status: SubscriberStatus.PENDING } }),
    prisma.subscriber.count({ where: { status: SubscriberStatus.UNSUBSCRIBED } }),
  ])

  return {
    total,
    active,
    pending,
    unsubscribed,
  }
}
