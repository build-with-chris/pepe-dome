/**
 * /mithelfen: Helferinnen und Helfer finden über drei Fragen eine Aufgabe.
 *
 * Vorerst versteckt: kein Menüpunkt, nicht in der Sitemap (steht nicht in
 * LOCALIZED_PATHS), noindex. Zum Testen den Link direkt weitergeben.
 * Umfang und offene Punkte: pepe-dome-mithelfen/SPEC.md.
 */

import type { Metadata } from 'next'
import MithelfenClient from '@/components/mithelfen/MithelfenClient'

export const metadata: Metadata = {
  title: 'Mithelfen',
  description: 'Finde in drei Fragen eine Aufgabe, bei der du im Pepe Dome mithelfen kannst.',
  robots: { index: false, follow: false },
  alternates: { canonical: null },
}

export default function MithelfenPage() {
  return <MithelfenClient />
}
