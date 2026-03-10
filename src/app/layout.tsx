import type { Metadata } from 'next'
import { Outfit, Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import Script from 'next/script'
import './globals.css'
import ConditionalLayout from '@/components/layout/ConditionalLayout'
import { getSiteContent } from '@/lib/data'

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

export const metadata: Metadata = {
  title: siteContent.name + ' - ' + siteContent.tagline,
  description: siteContent.description,
  keywords: ['Pepe Dome', 'München', 'Ostpark', 'Artistik', 'Zirkus', 'Shows', 'Events', 'Kultur'],
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/PepeDome Logo ausgeschnitten.png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/PepeDome Logo ausgeschnitten.png',
  },
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
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-CGE01LR2LC');
            `}
        </Script>
      </head>
      <body className="antialiased">
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
