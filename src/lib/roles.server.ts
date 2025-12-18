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
 */

import { currentUser } from '@clerk/nextjs/server'
import { ROLES, roleHierarchy, type UserRole } from './roles'

export { ROLES, type UserRole }

/**
 * Get current user's role from Clerk public metadata
 * Defaults to 'editor' if no role is set (allows content creation)
 * For production, set proper roles in Clerk dashboard
 */
export async function getUserRole(): Promise<UserRole> {
  const user = await currentUser()
  if (!user) return ROLES.VIEWER

  const role = user.publicMetadata?.role as string | undefined

  if (role === ROLES.SUPER_ADMIN || role === ROLES.EDITOR || role === ROLES.VIEWER) {
    return role
  }

  // Default to 'editor' for authenticated users without explicit role
  // This allows content creation without needing to configure Clerk metadata
  return ROLES.EDITOR
}

/**
 * Check if current user has at least the specified role level
 * Role hierarchy: super_admin > editor > viewer
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
