/**
 * Root-Layout: reicht nur durch und traegt die Standard-Metadaten.
 *
 * <html> und <body> rendern die Layouts darunter, weil erst sie die Sprache
 * kennen: src/app/[lang]/layout.tsx fuer die oeffentlichen Seiten,
 * src/app/admin/layout.tsx fuer den Admin. Warum das so ist und was es
 * bringt, steht in src/components/layout/SiteDocument.tsx.
 *
 * Wichtig fuer alles, was hier neu dazukommt: Eine Seite direkt unter
 * src/app, die etwas anzeigt statt nur weiterzuleiten, braucht ein eigenes
 * Layout mit PublicDocument (Beispiel: src/app/mithelfen/layout.tsx). Und
 * hier oben darf nichts stehen, was den Request liest (headers, cookies),
 * sonst wird wieder jede Seite bei jedem Aufruf neu gerendert.
 */

import type { Metadata } from 'next'
import { getSiteContent } from '@/lib/data'

function getSiteContentSafe() {
  try {
    return getSiteContent()
  } catch {
    return {
      name: 'Pepe Dome',
      tagline: 'Zuhause für Artistik & Kultur in München',
      description: 'Der Pepe Dome im Ostpark München – Shows, Training und Events.',
    }
  }
}

const siteContent = getSiteContentSafe()

const BASE_URL = 'https://www.pepe-dome.de'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: siteContent.name + ' - ' + siteContent.tagline,
    template: '%s | Pepe Dome',
  },
  description: siteContent.description,
  keywords: ['Pepe Dome', 'München', 'Ostpark', 'Artistik', 'Zirkus', 'Shows', 'Events', 'Kultur', 'zeitgenössischer Zirkus', 'Workshops'],
  authors: [{ name: 'Pepe Dome' }],
  creator: 'Pepe Dome',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: BASE_URL,
    siteName: 'Pepe Dome',
    title: siteContent.name + ' - ' + siteContent.tagline,
    description: siteContent.description,
    images: [
      { url: '/og-image.png',  width: 1200, height: 630,  alt: 'Pepe Dome' },
      { url: '/og-square.png', width: 1200, height: 1200, alt: 'Pepe Dome' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteContent.name + ' - ' + siteContent.tagline,
    description: siteContent.description,
    images: ['/og-image.png'],
  },
  alternates: { canonical: BASE_URL },
  robots: { index: true, follow: true },
  // Domain-Verifizierung fuer Meta. Bestaetigt, dass pepe-dome.de uns gehoert,
  // und ist Voraussetzung dafuer, Conversion-Ereignisse dieser Domain zu
  // priorisieren. Kein Geheimnis: der Wert ist oeffentlich im Quelltext lesbar.
  other: {
    'facebook-domain-verification': 'nksu2wj60j5gnrbydbmrt2a8oblq5o',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
