/**
 * Schriften und globale Styles, gemeinsam fuer beide Gerueste
 * (SiteDocument.tsx und AdminDocument.tsx).
 *
 * Eigene Datei, damit das Admin-Geruest nicht das oeffentliche importieren
 * muss und umgekehrt. Sonst wandern Navigation und Fusszeile in das Paket des
 * Admins und Clerk in das der oeffentlichen Seiten.
 */

import { Outfit, Inter } from 'next/font/google'
import '@/app/globals.css'

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

export const fontClasses = `${outfit.variable} ${inter.variable}`
