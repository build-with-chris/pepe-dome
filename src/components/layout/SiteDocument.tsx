/**
 * Das HTML-Geruest der Seite: <html>, <body>, Schriften, globale Styles.
 *
 * Warum das hier liegt und nicht in src/app/layout.tsx:
 *
 * Das Root-Layout kennt den [lang]-Parameter nicht. Damit `<html lang>` auf
 * den englischen Seiten trotzdem schon im ausgelieferten HTML stimmt, hat es
 * die Sprache frueher ueber `headers()` aus einem Request-Header gelesen. Ein
 * `headers()` im Root-Layout macht aber jede einzelne Seite dynamisch: nichts
 * liess sich mehr vorrendern oder zwischenspeichern, jede Anfrage lief durch
 * eine Serverfunktion und, wo Daten gebraucht wurden, bis in die Datenbank.
 * Gemessen waren das 1,2 bis 1,9 Sekunden bis zum ersten Byte, auch auf
 * Seiten wie /cafe oder /impressum, die sich nie aendern. Die Trainingsseite
 * hatte ISR eingestellt und bekam es dadurch stillschweigend nicht.
 *
 * Jetzt rendert das Layout das Geruest, das die Sprache als Parameter
 * bekommt: src/app/[lang]/layout.tsx. Die Sprache steht damit zur Bauzeit
 * fest, und die Seiten darunter koennen statisch oder per ISR ausgeliefert
 * werden. Das Root-Layout reicht nur noch durch.
 *
 * Nebeneffekt, ebenfalls gewollt: Clerk haengt nur noch am Admin-Geruest
 * (AdminDocument.tsx). Vorher lud jede oeffentliche Seite die
 * Clerk-Bibliothek und fragte bei Clerk nach einer Sitzung, auch fuer
 * Besucher, die nie einen Login sehen.
 *
 * Das Admin-Geruest liegt bewusst in einer eigenen Datei. Stuenden beide
 * hier, zoege der Import von ClerkProvider die Bibliothek wieder in das
 * Paket der oeffentlichen Seiten, auch wenn sie dort nie gerendert wird.
 */

import { fontClasses } from '@/components/layout/site-fonts'
import I18nProvider from '@/components/layout/I18nProvider'
import ParticleBackground from '@/components/layout/ParticleBackground'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ConsentBanner from '@/components/consent/ConsentBanner'
import ConsentScripts from '@/components/consent/ConsentScripts'
import { OrganizationJsonLd, WebSiteJsonLd } from '@/components/seo/JsonLd'
import type { Locale } from '@/i18n/config'

/** Oeffentliche Seiten: Navigation, Fusszeile, Partikel, Einwilligung. */
export function PublicDocument({
  lang,
  children,
}: Readonly<{
  lang: Locale
  children: React.ReactNode
}>) {
  return (
    <html lang={lang} className={fontClasses}>
      <body className="antialiased">
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <I18nProvider>
          <ParticleBackground />
          <Navbar />
          <main className="min-h-screen pt-20">{children}</main>
          <Footer />
        </I18nProvider>
        {/* Analytics und Pixel laden erst nach Einwilligung, siehe src/lib/consent.ts */}
        <ConsentScripts />
        <ConsentBanner />
      </body>
    </html>
  )
}
