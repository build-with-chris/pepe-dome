import type { Metadata } from 'next'
import { Outfit, Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import Script from 'next/script'
import './globals.css'
import ConditionalLayout from '@/components/layout/ConditionalLayout'
import { getSiteContent } from '@/lib/data'
import { OrganizationJsonLd } from '@/components/seo/JsonLd'

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
    icon: [{ url: '/favicon.ico' }, { url: '/PepeDome Logo ausgeschnitten.png' }],
    shortcut: '/favicon.ico',
    apple: '/PepeDome Logo ausgeschnitten.png',
  },
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: BASE_URL,
    siteName: 'Pepe Dome',
    title: siteContent.name + ' - ' + siteContent.tagline,
    description: siteContent.description,
    images: [{ url: '/PepeDome Logo ausgeschnitten.png', width: 800, height: 800, alt: 'Pepe Dome Logo' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteContent.name + ' - ' + siteContent.tagline,
    description: siteContent.description,
    images: ['/PepeDome Logo ausgeschnitten.png'],
  },
  alternates: { canonical: BASE_URL },
  robots: { index: true, follow: true },
}

// Only skip Clerk in development and when the dev flag is explicitly set.
const skipClerkInDev =
  process.env.NODE_ENV === 'development' &&
  process.env.NEXT_PUBLIC_DISABLE_CLERK_IN_DEV === 'true'

function LayoutContent({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de" className={`${outfit.variable} ${inter.variable}`}>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-CGE01LR2LC"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-CGE01LR2LC');
            `}
        </Script>
      </head>
      <body className="antialiased">
        <OrganizationJsonLd />
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  if (skipClerkInDev) {
    return <LayoutContent>{children}</LayoutContent>
  }
  return (
    <ClerkProvider>
      <LayoutContent>{children}</LayoutContent>
    </ClerkProvider>
  )
}
