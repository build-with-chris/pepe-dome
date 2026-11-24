import { ClerkProvider } from '@clerk/nextjs'
import I18nProvider from '@/components/layout/I18nProvider'
import { fontClasses } from '@/components/layout/site-fonts'

// Clerk nur in der Entwicklung und nur mit gesetztem Schalter ueberspringen.
const skipClerkInDev =
  process.env.NODE_ENV === 'development' &&
  process.env.NEXT_PUBLIC_DISABLE_CLERK_IN_DEV === 'true'

/**
 * Admin-Bereich: eigenes Geruest mit Clerk, ohne Navigation und Fusszeile.
 * Die bringt AdminShell selbst mit.
 *
 * Bewusst ohne Einwilligungsbanner und ohne Analytics: Aufrufe der Redaktion
 * im Admin sind keine Besuche und gehoeren nicht in die Statistik.
 */
export function AdminDocument({ children }: Readonly<{ children: React.ReactNode }>) {
  const document = (
    <html lang="de" className={fontClasses}>
      <body className="antialiased">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  )

  if (skipClerkInDev) return document
  return <ClerkProvider>{document}</ClerkProvider>
}
