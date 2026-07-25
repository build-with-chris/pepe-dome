/**
 * Server-side role-checking utilities for Clerk authentication
 *
 * This file contains SERVER-ONLY utilities that use Clerk server functions.
 * For client components, use roles.ts instead.
 *
 * Roles (from Clerk public metadata):
 * - super_admin: Full access to all admin features
 * - editor: Can create/edit content but cannot manage subscribers or settings
 * - viewer: Read-only access to admin dashboard and reports
 * - none: Angemeldet, aber ohne Freigabe. Default für jeden neuen Account.
 *
 * Sicherheitsmodell:
 * Ein Clerk-Login allein reicht nicht. Rechte gibt es nur über eine Rolle in
 * publicMetadata (gesetzt durch eine ausdrückliche Freigabe) oder über die
 * Bootstrap-Allowlist SUPER_ADMIN_EMAILS. Alles andere ist 'none'.
 */

import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { ROLES, roleHierarchy, isAssignableRole, type UserRole } from './roles'

export { ROLES, type UserRole }

/**
 * Bootstrap-Allowlist: Diese Adressen sind immer Super Admin, unabhängig von
 * Clerk-Metadaten.
 *
 * Der Sinn ist ein Notausgang. Ohne ihn gäbe es ein Henne-Ei-Problem: Rollen
 * werden nur von einem Super Admin vergeben, aber nach der Umstellung auf
 * "Default = keine Rechte" gibt es zunächst keinen. Wer hier steht, kann sich
 * auch dann nicht aussperren, wenn in Clerk die Metadaten verlorengehen.
 *
 * Format in der .env (kommagetrennt):
 *   SUPER_ADMIN_EMAILS=chris.hermann9397@gmail.com
 */
function getBootstrapSuperAdmins(): string[] {
  return (process.env.SUPER_ADMIN_EMAILS || '')
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean)
}

/** Steht die Adresse in der Bootstrap-Allowlist? */
export function isBootstrapSuperAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return getBootstrapSuperAdmins().includes(email.trim().toLowerCase())
}

/** Primäre Mailadresse eines Clerk-Users, unabhängig von der Sortierung. */
function primaryEmail(user: {
  primaryEmailAddressId?: string | null
  emailAddresses?: Array<{ id: string; emailAddress: string }>
}): string | null {
  const addresses = user.emailAddresses ?? []
  const primary = addresses.find((address) => address.id === user.primaryEmailAddressId)
  return primary?.emailAddress ?? addresses[0]?.emailAddress ?? null
}

/**
 * Rolle des aktuell eingeloggten Users.
 * Ohne Login und ohne ausdrückliche Freigabe: 'none'.
 */
export async function getUserRole(): Promise<UserRole> {
  const user = await currentUser()
  if (!user) return ROLES.NONE

  if (isBootstrapSuperAdminEmail(primaryEmail(user))) {
    return ROLES.SUPER_ADMIN
  }

  const role = user.publicMetadata?.role
  if (isAssignableRole(role)) {
    return role
  }

  return ROLES.NONE
}

/**
 * Rolle plus Identität in einem Rutsch — spart einen zweiten currentUser()-Call
 * dort, wo beides gebraucht wird (Warteseite, Freigabe-Seite).
 */
export async function getCurrentAdmin(): Promise<{
  userId: string
  email: string | null
  fullName: string | null
  role: UserRole
} | null> {
  const user = await currentUser()
  if (!user) return null

  const email = primaryEmail(user)
  const metadataRole = user.publicMetadata?.role
  const role: UserRole = isBootstrapSuperAdminEmail(email)
    ? ROLES.SUPER_ADMIN
    : isAssignableRole(metadataRole)
      ? metadataRole
      : ROLES.NONE

  return {
    userId: user.id,
    email,
    fullName: [user.firstName, user.lastName].filter(Boolean).join(' ') || null,
    role,
  }
}

/**
 * Check if current user has at least the specified role level
 * Role hierarchy: super_admin > editor > viewer > none
 */
export async function hasMinimumRole(minimumRole: UserRole): Promise<boolean> {
  const userRole = await getUserRole()
  return roleHierarchy[userRole] >= roleHierarchy[minimumRole]
}

/**
 * Check if current user is a Super Admin
 */
export async function isSuperAdmin(): Promise<boolean> {
  const role = await getUserRole()
  return role === ROLES.SUPER_ADMIN
}

/**
 * Check if current user can edit content (Super Admin or Editor)
 */
export async function canEdit(): Promise<boolean> {
  return hasMinimumRole(ROLES.EDITOR)
}

/**
 * Check if current user can delete content (Super Admin only)
 */
export async function canDelete(): Promise<boolean> {
  return isSuperAdmin()
}

/**
 * Check if current user can view subscribers (Super Admin only)
 */
export async function canViewSubscribers(): Promise<boolean> {
  return isSuperAdmin()
}

/**
 * Check if current user can send newsletters (Super Admin only)
 */
export async function canSendNewsletter(): Promise<boolean> {
  return isSuperAdmin()
}

/**
 * Check if current user can test send newsletters (Editor+)
 */
export async function canTestSendNewsletter(): Promise<boolean> {
  return hasMinimumRole(ROLES.EDITOR)
}

/**
 * Guard für API-Routen.
 *
 * Gibt bei fehlenden Rechten eine fertige NextResponse zurück, sonst die Rolle.
 * Aufrufmuster in der Route:
 *
 *   const guard = await requireApiRole(ROLES.EDITOR)
 *   if (guard.response) return guard.response
 *   // ab hier sind die Rechte geprüft
 *
 * Bewusst kein throw: Die bestehenden Routen geben durchgängig NextResponse
 * zurück. Ein wurfbasierter Guard bräuchte in jeder Route ein try/catch und
 * käme bei einem vergessenen catch als 500 statt als 403 heraus.
 */
export async function requireApiRole(
  minimumRole: UserRole
): Promise<
  | { role: UserRole; userId: string; response: null }
  | { role: null; userId: null; response: NextResponse }
> {
  const { userId } = await auth()

  if (!userId) {
    return {
      role: null,
      userId: null,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    }
  }

  const role = await getUserRole()

  if (roleHierarchy[role] < roleHierarchy[minimumRole]) {
    return {
      role: null,
      userId: null,
      response: NextResponse.json(
        { error: 'Forbidden', message: 'Für diese Aktion fehlen dir die Rechte.' },
        { status: 403 }
      ),
    }
  }

  return { role, userId, response: null }
}
