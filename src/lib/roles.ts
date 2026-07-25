/**
 * Role-checking utilities for Clerk authentication
 *
 * This file contains CLIENT-SAFE utilities only.
 * For server-side role checking, use roles.server.ts
 *
 * Roles (from Clerk public metadata):
 * - super_admin: Full access to all admin features
 * - editor: Can create/edit content but cannot manage subscribers or settings
 * - viewer: Read-only access to admin dashboard and reports
 * - none: Angemeldet, aber ohne jede Freigabe. Default für jeden neuen Account.
 *
 * WICHTIG: 'none' ist der Default. Ein Clerk-Account allein (z. B. via Google)
 * gibt keinerlei Rechte. Erst eine ausdrückliche Freigabe durch einen Super
 * Admin schreibt eine echte Rolle in die Clerk-publicMetadata. Vorher galt hier
 * 'editor' als Default — damit konnte sich jeder mit einem Google-Konto selbst
 * Schreibrechte auf Events, Artikel und Newsletter verschaffen.
 */

export type UserRole = 'super_admin' | 'editor' | 'viewer' | 'none'

export const ROLES = {
  SUPER_ADMIN: 'super_admin' as const,
  EDITOR: 'editor' as const,
  VIEWER: 'viewer' as const,
  NONE: 'none' as const,
}

/** Rollen, die per Freigabe vergeben werden dürfen (ohne 'none') */
export const ASSIGNABLE_ROLES = [ROLES.VIEWER, ROLES.EDITOR, ROLES.SUPER_ADMIN] as const

/** Type-Guard: Ist der String eine gültige, vergebbare Rolle? */
export function isAssignableRole(value: unknown): value is Exclude<UserRole, 'none'> {
  return (ASSIGNABLE_ROLES as readonly string[]).includes(value as string)
}

/**
 * Role hierarchy levels
 */
export const roleHierarchy: Record<UserRole, number> = {
  super_admin: 3,
  editor: 2,
  viewer: 1,
  none: 0,
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: UserRole): string {
  switch (role) {
    case ROLES.SUPER_ADMIN:
      return 'Super Admin'
    case ROLES.EDITOR:
      return 'Editor'
    case ROLES.VIEWER:
      return 'Viewer'
    case ROLES.NONE:
      return 'Kein Zugriff'
    default:
      return 'Unknown'
  }
}

/**
 * Get role badge variant for UI
 */
export function getRoleBadgeVariant(role: UserRole): 'default' | 'secondary' | 'outline' {
  switch (role) {
    case ROLES.SUPER_ADMIN:
      return 'default' // Gold/primary
    case ROLES.EDITOR:
      return 'secondary'
    case ROLES.VIEWER:
      return 'outline'
    default:
      return 'outline'
  }
}

/**
 * Client-side role helper (for use in client components)
 * Extracts role from user public metadata.
 *
 * Ohne ausdrücklich gesetzte Rolle: 'none'. Kein stillschweigender Default auf
 * eine Rolle mit Rechten. Diese Funktion ist nur für die Darstellung gedacht,
 * die verbindliche Prüfung passiert serverseitig in roles.server.ts.
 */
export function getRoleFromMetadata(publicMetadata: Record<string, unknown> | undefined): UserRole {
  const role = publicMetadata?.role as string | undefined

  if (isAssignableRole(role)) {
    return role
  }

  return ROLES.NONE
}

/**
 * Check if role has minimum required level (client-safe)
 */
export function hasMinimumRoleLevel(userRole: UserRole, minimumRole: UserRole): boolean {
  return roleHierarchy[userRole] >= roleHierarchy[minimumRole]
}

/**
 * Darf die Rolle das Admin-Panel überhaupt betreten? (client-safe)
 */
export function hasAdminAccess(role: UserRole): boolean {
  return role !== ROLES.NONE
}

/**
 * Check if role is Super Admin (client-safe)
 */
export function isRoleSuperAdmin(role: UserRole): boolean {
  return role === ROLES.SUPER_ADMIN
}

/**
 * Check if role can edit content (client-safe)
 */
export function canRoleEdit(role: UserRole): boolean {
  return hasMinimumRoleLevel(role, ROLES.EDITOR)
}

/**
 * Check if role can delete content (client-safe)
 */
export function canRoleDelete(role: UserRole): boolean {
  return isRoleSuperAdmin(role)
}

/**
 * Check if role can view subscribers (client-safe)
 */
export function canRoleViewSubscribers(role: UserRole): boolean {
  return isRoleSuperAdmin(role)
}

/**
 * Check if role can send newsletters (client-safe)
 */
export function canRoleSendNewsletter(role: UserRole): boolean {
  return isRoleSuperAdmin(role)
}

/**
 * Check if role can test send newsletters (client-safe)
 */
export function canRoleTestSendNewsletter(role: UserRole): boolean {
  return hasMinimumRoleLevel(role, ROLES.EDITOR)
}

/**
 * Permission matrix for reference
 */
export const PERMISSIONS = {
  // Dashboard
  viewDashboard: [ROLES.SUPER_ADMIN, ROLES.EDITOR, ROLES.VIEWER],
  viewSubscriberStats: [ROLES.SUPER_ADMIN],

  // Events
  viewEvents: [ROLES.SUPER_ADMIN, ROLES.EDITOR, ROLES.VIEWER],
  createEvent: [ROLES.SUPER_ADMIN, ROLES.EDITOR],
  editEvent: [ROLES.SUPER_ADMIN, ROLES.EDITOR],
  deleteEvent: [ROLES.SUPER_ADMIN],

  // Articles
  viewArticles: [ROLES.SUPER_ADMIN, ROLES.EDITOR, ROLES.VIEWER],
  createArticle: [ROLES.SUPER_ADMIN, ROLES.EDITOR],
  editArticle: [ROLES.SUPER_ADMIN, ROLES.EDITOR],
  deleteArticle: [ROLES.SUPER_ADMIN],

  // Newsletters
  viewNewsletters: [ROLES.SUPER_ADMIN, ROLES.EDITOR, ROLES.VIEWER],
  createNewsletter: [ROLES.SUPER_ADMIN, ROLES.EDITOR],
  editNewsletter: [ROLES.SUPER_ADMIN, ROLES.EDITOR],
  testSendNewsletter: [ROLES.SUPER_ADMIN, ROLES.EDITOR],
  sendNewsletter: [ROLES.SUPER_ADMIN],

  // Subscribers
  viewSubscribers: [ROLES.SUPER_ADMIN],
  exportSubscribers: [ROLES.SUPER_ADMIN],

  // Settings
  viewSettings: [ROLES.SUPER_ADMIN],
} as const
