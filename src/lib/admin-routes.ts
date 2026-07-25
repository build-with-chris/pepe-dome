import { createRouteMatcher } from '@clerk/nextjs/server'

/**
 * Welche Pfade die Middleware absichert.
 *
 * Liegt bewusst getrennt von middleware.ts, damit sich die Matcher testen
 * lassen — die Middleware selbst zieht beim Import halb Next.js mit hoch.
 *
 * Deny-by-default über einen Wildcard statt einer Liste einzelner Unterpfade:
 * Die frühere Liste zählte die geschützten Bereiche einzeln auf, dabei fehlte
 * /admin/test-recipients — die Seite war ohne Login erreichbar. So ist eine
 * neue Admin-Seite automatisch geschützt.
 *
 * Der Login-Check ist nur die erste Stufe. Ob der eingeloggte User auch eine
 * Rolle hat, prüft das Server-Layout unter src/app/admin/(dashboard) bzw.
 * requireApiRole in den API-Routen.
 *
 * Die Muster trennen bewusst das Segment selbst von allem darunter. Ein
 * einzelnes '/admin(.*)' würde auch '/administration' erfassen und damit eine
 * öffentliche Seite hinter den Login sperren, die zufällig so anfängt.
 */
export const isProtectedRoute = createRouteMatcher([
  '/admin',
  '/admin/(.*)',
  '/api/admin',
  '/api/admin/(.*)',
])

/** Ausnahmen: Ohne diese käme man nie zum Login. */
export const isPublicAdminRoute = createRouteMatcher([
  '/admin/sign-in(.*)',
  '/admin/sign-up(.*)',
])

/** Verlangt dieser Request einen Login? */
export function requiresAuth(req: Parameters<typeof isProtectedRoute>[0]): boolean {
  return isProtectedRoute(req) && !isPublicAdminRoute(req)
}
