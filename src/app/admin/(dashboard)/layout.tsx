import { redirect } from 'next/navigation'
import AdminShell from '@/components/admin/AdminShell'
import { getCurrentAdmin } from '@/lib/roles.server'
import { hasAdminAccess } from '@/lib/roles'

/**
 * Rollen-Gate für das Admin-Panel.
 *
 * Läuft als Server-Layout vor jeder Seite in dieser Route-Group. Die Middleware
 * stellt davor nur sicher, dass überhaupt jemand eingeloggt ist; hier wird
 * geprüft, ob dieser Jemand auch freigeschaltet ist.
 *
 * Warum eine eigene Route-Group: Sign-in und Sign-up liegen in (auth) und
 * dürfen dieses Gate nicht durchlaufen, sonst dreht sich der Redirect im Kreis.
 * Die Trennung über Route-Groups erledigt das im Router statt über eine
 * Pfad-Abfrage im Layout, die beim Anlegen neuer Seiten gern vergessen wird.
 *
 * Das Gate ersetzt keine Prüfung in den API-Routen. Es schützt die Ansicht;
 * die Daten schützt requireApiRole in der jeweiligen Route.
 */
export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const admin = await getCurrentAdmin()

  if (!admin) {
    redirect('/admin/sign-in')
  }

  if (!hasAdminAccess(admin.role)) {
    redirect('/admin/zugang')
  }

  const userName = admin.fullName || admin.email?.split('@')[0] || 'Unbekannt'

  return (
    <AdminShell role={admin.role} userName={userName}>
      {children}
    </AdminShell>
  )
}
