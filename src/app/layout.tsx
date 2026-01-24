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

const siteContent = getSiteContent()

export const metadata: Metadata = {
  title: siteContent.name + ' - ' + siteContent.tagline,
  description: siteContent.description,
  keywords: ['Pepe Dome', 'München', 'Ostpark', 'Artistik', 'Zirkus', 'Shows', 'Events', 'Kultur'],
  icons: {
    icon: '/PepeDome Logo ausgeschnitten.png',
    shortcut: '/PepeDome Logo ausgeschnitten.png',
    apple: '/PepeDome Logo ausgeschnitten.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
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
    </ClerkProvider>
  )
}
