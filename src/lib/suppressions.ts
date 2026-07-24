import { prisma } from './prisma'

/**
 * Abgleich mit Resends Suppression-Liste.
 *
 * Resend führt eine kontoweite Suppression-Liste (Bounces, Beschwerden).
 * Adressen, die dort stehen, nimmt Resend vom Versand aus — sie bleiben in
 * unserer DB aber ACTIVE und verfälschen dadurch jede Auswertung.
 *
 * Diese Funktion holt die Liste und trägt betroffene Abonnent:innen bei uns
 * aus. Der Resend-Account enthält mehrere Projekte, deshalb wird strikt über
 * die E-Mail-Adresse gematcht — fremde Suppressions bleiben unberührt.
 */

export type SuppressionEntry = {
  id: string
  email: string
  origin?: string
  created_at?: string
}

export type SuppressionSyncResult = {
  /** Suppressions im Resend-Account insgesamt */
  totalSuppressions: number
  /** davon Adressen, die in unserer Liste existieren */
  matchedSubscribers: number
  /** davon tatsächlich neu ausgetragen (waren noch nicht UNSUBSCRIBED) */
  unsubscribed: number
  /** Aufschlüsselung nach Ursache (bounce, complaint, …) */
  byOrigin: Record<string, number>
  details: Array<{ email: string; origin?: string; action: 'unsubscribed' | 'already_inactive' }>
}

async function fetchAllSuppressions(apiKey: string): Promise<SuppressionEntry[]> {
  const all: SuppressionEntry[] = []
  let url = 'https://api.resend.com/suppressions'

  // Defensive Obergrenze, damit ein API-Fehler keine Endlosschleife auslöst
  for (let page = 0; page < 50; page++) {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } })
    if (!res.ok) {
      throw new Error(`Resend suppressions API ${res.status}: ${(await res.text()).slice(0, 200)}`)
    }
    const body = (await res.json()) as { data?: SuppressionEntry[]; has_more?: boolean }
    all.push(...(body.data ?? []))
    if (!body.has_more) break
    const lastId = body.data?.[body.data.length - 1]?.id
    if (!lastId) break
    url = `https://api.resend.com/suppressions?after=${lastId}`
  }

  return all
}

export async function syncSuppressions(): Promise<SuppressionSyncResult> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw new Error('RESEND_API_KEY ist nicht konfiguriert')

  const suppressions = await fetchAllSuppressions(apiKey)

  const byOrigin: Record<string, number> = {}
  for (const s of suppressions) {
    const key = s.origin || 'unbekannt'
    byOrigin[key] = (byOrigin[key] ?? 0) + 1
  }

  const emails = suppressions.map((s) => (s.email || '').toLowerCase()).filter(Boolean)
  if (emails.length === 0) {
    return { totalSuppressions: 0, matchedSubscribers: 0, unsubscribed: 0, byOrigin, details: [] }
  }

  const matched = await prisma.subscriber.findMany({
    where: { email: { in: emails, mode: 'insensitive' } },
    select: { id: true, email: true, status: true, metadata: true },
  })

  const details: SuppressionSyncResult['details'] = []
  let unsubscribed = 0
  const stamp = new Date()

  for (const sub of matched) {
    const entry = suppressions.find((s) => (s.email || '').toLowerCase() === sub.email.toLowerCase())

    if (sub.status === 'UNSUBSCRIBED') {
      details.push({ email: sub.email, origin: entry?.origin, action: 'already_inactive' })
      continue
    }

    const meta =
      sub.metadata && typeof sub.metadata === 'object' && !Array.isArray(sub.metadata)
        ? (sub.metadata as Record<string, unknown>)
        : {}

    await prisma.subscriber.update({
      where: { id: sub.id },
      data: {
        status: 'UNSUBSCRIBED',
        unsubscribedAt: stamp,
        metadata: {
          ...meta,
          unsubscribeReason: `resend_suppression_${entry?.origin ?? 'unknown'}`,
          suppressionSyncedAt: stamp.toISOString(),
        },
      },
    })

    unsubscribed++
    details.push({ email: sub.email, origin: entry?.origin, action: 'unsubscribed' })
  }

  return {
    totalSuppressions: suppressions.length,
    matchedSubscribers: matched.length,
    unsubscribed,
    byOrigin,
    details,
  }
}
