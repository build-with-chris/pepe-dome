import type { Metadata } from 'next'
import { Outfit, Inter } from 'next/font/google'
import { headers } from 'next/headers'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import ConditionalLayout from '@/components/layout/ConditionalLayout'
import I18nProvider from '@/components/layout/I18nProvider'
import ConsentBanner from '@/components/consent/ConsentBanner'
import ConsentScripts from '@/components/consent/ConsentScripts'
import { getSiteContent } from '@/lib/data'
import { OrganizationJsonLd, WebSiteJsonLd } from '@/components/seo/JsonLd'
import { isLocale, DEFAULT_LOCALE, type Locale } from '@/i18n/config'

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
})

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

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

// Only skip Clerk in development and when the dev flag is explicitly set.
const skipClerkInDev =
  process.env.NODE_ENV === 'development' &&
  process.env.NEXT_PUBLIC_DISABLE_CLERK_IN_DEV === 'true'

function LayoutContent({
  children,
  lang,
}: Readonly<{
  children: React.ReactNode
  lang: Locale
}>) {
  return (
    <html lang={lang} className={`${outfit.variable} ${inter.variable}`}>
      <body className="antialiased">
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <I18nProvider>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </I18nProvider>
        {/* Analytics und Pixel laden erst nach Einwilligung, siehe src/lib/consent.ts */}
        <ConsentScripts />
        <ConsentBanner />
      </body>
    </html>
  )
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Locale kommt aus dem von der Middleware gesetzten x-locale-Header, damit
  // <html lang> serverseitig stimmt (auch für JS-lose Crawler auf /en-Seiten).
  const headerLocale = (await headers()).get('x-locale')
  const lang: Locale = isLocale(headerLocale ?? '') ? (headerLocale as Locale) : DEFAULT_LOCALE

  if (skipClerkInDev) {
    return <LayoutContent lang={lang}>{children}</LayoutContent>
  }
  return (
    <ClerkProvider>
      <LayoutContent lang={lang}>{children}</LayoutContent>
    </ClerkProvider>
  )
}
