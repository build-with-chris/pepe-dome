import type { Metadata } from 'next'
import './globals.css'
import I18nProvider from '@/components/I18nProvider'
import CookieBanner from '@/components/CookieBanner'
import Script from 'next/script'

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
      <head>
        <Script
          id="facebook-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1206142338236184');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1206142338236184&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>
      <body className="antialiased">
        <I18nProvider>
          {children}
          <CookieBanner />
        </I18nProvider>
      </body>
    </html>
  )
}