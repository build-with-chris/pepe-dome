import type { Metadata } from 'next'
import './globals.css'
import I18nProvider from '@/components/I18nProvider'

export const metadata: Metadata = {
  title: 'Pepe Dome - Ein einzigartiger Veranstaltungsort in München',
  description: 'Der Pepe Dome im Ostpark München - geodätische Kuppel für Artistik, Events und kulturelle Erlebnisse',
  keywords: ['Pepe Dome', 'München', 'Ostpark', 'Veranstaltungsort', 'Artistik', 'Events', 'Kultur'],
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
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  )
}