import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pepe Dome - Ein einzigartiger Veranstaltungsort in München',
  description: 'Der Pepe Dome im Ostpark München - geodätische Kuppel für Artistik, Events und kulturelle Erlebnisse',
  keywords: ['Pepe Dome', 'München', 'Ostpark', 'Veranstaltungsort', 'Artistik', 'Events', 'Kultur'],
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
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
        {children}
      </body>
    </html>
  )
}