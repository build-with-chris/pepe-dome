import type { Metadata } from 'next'
import './globals.css'
import ParticleBackground from '@/components/layout/ParticleBackground'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { getSiteContent } from '@/lib/data'

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
    <html lang="de">
      <body className="antialiased">
        <ParticleBackground />
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
