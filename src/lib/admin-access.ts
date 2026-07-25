import 'server-only'

/**
 * Zugriffsanfragen für das Admin-Panel
 *
 * Ablauf:
 *   1. Jemand meldet sich an (z. B. per Google) und hat keine Rolle.
 *   2. Das Gate schickt ihn auf /admin/zugang. Dort entsteht eine Anfrage
 *      und eine Mail geht an die Freigabe-Adresse.
 *   3. Der Super Admin öffnet den Link, sieht wer da anfragt, und vergibt
 *      eine Rolle oder lehnt ab.
 *   4. Die Rolle landet in den Clerk-publicMetadata. Erst danach lässt das
 *      Gate den Account ins Panel.
 *
 * Die Mail enthält bewusst keinen Ein-Klick-Freigabe-Link. Mailprogramme und
 * Sicherheits-Scanner rufen Links in Mails ungefragt auf; ein GET-Link, der
 * direkt Rechte vergibt, würde dadurch von allein ausgelöst. Der Link führt
 * deshalb nur auf eine Seite, die Freigabe selbst ist ein POST hinter einem
 * Login als Super Admin.
 */

import { randomBytes } from 'crypto'
import { prisma } from './prisma'
import { resend, DEFAULT_FROM_EMAIL, EMAIL_CONFIG } from './resend'
import { ROLES, type UserRole } from './roles'

/** Adresse, an die Freigabe-Anfragen gehen. */
export const ACCESS_APPROVAL_EMAIL =
  process.env.ADMIN_APPROVAL_EMAIL || 'info@pepe-dome.de'

/** Gültigkeit des Freigabe-Links. Danach muss der User erneut anfragen. */
const TOKEN_TTL_DAYS = 7

/**
 * Sperrfrist zwischen zwei Benachrichtigungen für dieselbe Anfrage.
 *
 * Ohne sie würde jeder Reload der Warteseite eine weitere Mail auslösen —
 * jemand, der die Seite offen lässt, könnte damit das Postfach fluten.
 */
const NOTIFY_COOLDOWN_MS = 60 * 60 * 1000

function createToken(): string {
  return randomBytes(32).toString('hex')
}

function tokenExpiry(): Date {
  return new Date(Date.now() + TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000)
}

export interface AccessRequestInput {
  clerkUserId: string
  email: string
  name?: string | null
}

/**
 * Anfrage anlegen oder bestehende zurückgeben.
 *
 * Pro Clerk-User existiert höchstens eine Anfrage. Eine abgelehnte oder
 * abgelaufene Anfrage wird beim erneuten Aufruf wieder auf PENDING gesetzt und
 * bekommt ein frisches Token — sonst könnte sich jemand nach einer versehentlichen
 * Ablehnung nie wieder melden.
 */
export async function upsertAccessRequest(input: AccessRequestInput) {
  const existing = await prisma.adminAccessRequest.findUnique({
    where: { clerkUserId: input.clerkUserId },
  })

  if (existing && existing.status === 'PENDING' && existing.tokenExpires > new Date()) {
    return { request: existing, isNew: false }
  }

  const data = {
    email: input.email,
    name: input.name ?? null,
    status: 'PENDING' as const,
    token: createToken(),
    tokenExpires: tokenExpiry(),
    grantedRole: null,
    decidedAt: null,
    decidedBy: null,
    notifiedAt: null,
  }

  const request = await prisma.adminAccessRequest.upsert({
    where: { clerkUserId: input.clerkUserId },
    create: { clerkUserId: input.clerkUserId, ...data },
    update: data,
  })

  return { request, isNew: true }
}

/**
 * Freigabe-Mail verschicken, sofern die Sperrfrist abgelaufen ist.
 * Gibt zurück, ob tatsächlich gesendet wurde.
 */
export async function notifyApprover(
  request: { id: string; email: string; name: string | null; token: string; notifiedAt: Date | null },
  baseUrl: string
): Promise<boolean> {
  if (request.notifiedAt && Date.now() - request.notifiedAt.getTime() < NOTIFY_COOLDOWN_MS) {
    return false
  }

  const { render } = await import('@react-email/render')
  const AdminAccessRequestEmail = (
    await import('@/components/email/templates/AdminAccessRequestEmail')
  ).default

  const reviewUrl = `${baseUrl}/admin/freigabe?token=${request.token}`

  const email = AdminAccessRequestEmail({
    requesterEmail: request.email,
    requesterName: request.name || undefined,
    reviewUrl,
    expiresInDays: TOKEN_TTL_DAYS,
  })

  const html = await render(email)
  const text = await render(email, { plainText: true })

  const result = await resend.emails.send({
    from: DEFAULT_FROM_EMAIL,
    to: ACCESS_APPROVAL_EMAIL,
    subject: `Zugriff auf das Admin-Panel angefragt: ${request.email}`,
    html,
    text,
    tags: [{ name: 'type', value: 'admin_access_request' }],
  })

  if (result.error) {
    throw new Error(`Resend API error: ${result.error.message}`)
  }

  await prisma.adminAccessRequest.update({
    where: { id: request.id },
    data: { notifiedAt: new Date() },
  })

  return true
}

/** Offene, noch gültige Anfrage zu einem Token. */
export async function findPendingRequestByToken(token: string) {
  if (!token) return null

  const request = await prisma.adminAccessRequest.findUnique({ where: { token } })

  if (!request) return null
  if (request.status !== 'PENDING') return null
  if (request.tokenExpires <= new Date()) return null

  return request
}

/**
 * Anfrage entscheiden: Rolle vergeben oder ablehnen.
 *
 * Bei Freigabe wandert die Rolle in die Clerk-publicMetadata — das ist die
 * Quelle, die getUserRole auswertet. Die Tabelle hier hält nur fest, wer wann
 * entschieden hat.
 *
 * Das Token wird in jedem Fall verbraucht (neuer Zufallswert), damit ein
 * abgefangener Link nicht ein zweites Mal funktioniert.
 */
export async function decideAccessRequest(options: {
  token: string
  decision: 'approve' | 'reject'
  role?: UserRole
  decidedBy: string
}): Promise<{ ok: true; email: string } | { ok: false; error: string }> {
  const request = await findPendingRequestByToken(options.token)

  if (!request) {
    return { ok: false, error: 'Diese Anfrage ist unbekannt, bereits entschieden oder abgelaufen.' }
  }

  if (options.decision === 'approve') {
    const role = options.role
    if (!role || role === ROLES.NONE) {
      return { ok: false, error: 'Ungültige Rolle.' }
    }

    const { clerkClient } = await import('@clerk/nextjs/server')
    const client = await clerkClient()

    // updateUserMetadata statt updateUser: Letzteres ersetzt publicMetadata
    // komplett und würde alles andere, was dort liegt, stillschweigend löschen.
    //
    // Erst die Rechte setzen, dann protokollieren. Andersherum stünde bei einem
    // Fehler in Clerk eine Freigabe in der Datenbank, die nie wirksam wurde.
    await client.users.updateUserMetadata(request.clerkUserId, {
      publicMetadata: { role },
    })

    await prisma.adminAccessRequest.update({
      where: { id: request.id },
      data: {
        status: 'APPROVED',
        grantedRole: role,
        decidedAt: new Date(),
        decidedBy: options.decidedBy,
        token: createToken(),
      },
    })

    return { ok: true, email: request.email }
  }

  await prisma.adminAccessRequest.update({
    where: { id: request.id },
    data: {
      status: 'REJECTED',
      decidedAt: new Date(),
      decidedBy: options.decidedBy,
      token: createToken(),
    },
  })

  return { ok: true, email: request.email }
}

/** Basis-URL für Links in der Mail. */
export function accessBaseUrl(): string {
  return EMAIL_CONFIG.BASE_URL
}
