import { AdminDocument } from '@/components/layout/AdminDocument'

/**
 * Geruest fuer alles unter /admin, Anmeldeseiten eingeschlossen.
 *
 * Clerk haengt nur hier, nicht mehr an der ganzen Website. Die Rollenpruefung
 * bleibt, wo sie war: im Layout der Route-Group (dashboard).
 */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <AdminDocument>{children}</AdminDocument>
}
