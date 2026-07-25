'use client'

/**
 * Lädt Google Analytics und das Meta Pixel — aber erst nach Einwilligung.
 *
 * Bewusst "Basic Consent Mode": ohne Einwilligung wird gar kein Skript
 * geladen und kein Request an Google oder Meta gestellt. Der Advanced Mode
 * würde die Skripte immer laden und nur die Speicherung unterdrücken. Das
 * ist bequemer, kontaktiert aber auch bei Ablehnung fremde Server und ist
 * in Deutschland umstritten.
 */

import { useEffect, useState } from 'react'
import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { onConsentChange, readConsent, type ConsentState } from '@/lib/consent'

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-CGE01LR2LC'
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID

export default function ConsentScripts() {
  const pathname = usePathname()
  const [consent, setConsent] = useState<ConsentState | null>(null)

  useEffect(() => {
    setConsent(readConsent())
    return onConsentChange(setConsent)
  }, [])

  const analyticsOn = consent?.analytics === true
  /** Die Einwilligung selbst. Steuert die Werbesignale in GA4. */
  const marketingConsent = consent?.marketing === true
  /** Ob das Pixel tatsächlich geladen wird. Ohne ID gibt es nichts zu laden. */
  const pixelOn = marketingConsent && Boolean(META_PIXEL_ID)

  // Bei clientseitiger Navigation feuert kein Skript-Load, also melden wir
  // Seitenaufrufe selbst nach. Der allererste Aufruf steckt schon im
  // Init-Snippet, deshalb hier nur bei Pfadwechsel.
  useEffect(() => {
    if (!pathname) return
    if (analyticsOn && typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: pathname,
        page_location: window.location.href,
      })
    }
    if (pixelOn && typeof window.fbq === 'function') {
      window.fbq('track', 'PageView')
    }
    // Absicht: nur bei Pfadwechsel, nicht bei jeder Consent-Änderung.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return (
    <>
      {analyticsOn && (
        <>
          <Script
            id="ga4-loader"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('consent', 'default', {
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                analytics_storage: 'denied'
              });
              gtag('consent', 'update', {
                analytics_storage: 'granted',
                ad_storage: ${marketingConsent ? "'granted'" : "'denied'"},
                ad_user_data: ${marketingConsent ? "'granted'" : "'denied'"},
                ad_personalization: ${marketingConsent ? "'granted'" : "'denied'"}
              });
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}

      {pixelOn && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window,document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}
    </>
  )
}
