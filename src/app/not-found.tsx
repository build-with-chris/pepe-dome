/**
 * Globale 404 für Pfade ausserhalb des /[lang]-Baums.
 *
 * Für alles unter /de und /en greift src/app/[lang]/not-found.tsx, das die
 * Sprache kennt. Diese Fassung sieht nur, wer eine URL erwischt, die zu keiner
 * Locale gehört — dort ist Deutsch die richtige Annahme.
 *
 * Die Links zeigen direkt auf /de/..., nicht auf / und /events. Die alten
 * Root-Pfade werden von der Middleware erst umgeleitet; wer schon auf einer
 * Fehlerseite steht, soll nicht noch durch zwei Weiterleitungen laufen.
 */

import Link from 'next/link'
import Button from '@/components/ui/Button'
import { DEFAULT_LOCALE, localizedHref } from '@/i18n/config'

export default function NotFound() {
  return (
    <div className="section-hero flex items-center justify-center">
      <div className="stage-container text-center">
        <h1 className="display-1 mb-4">404</h1>
        <p className="lead text-pepe-gold mb-6">Seite nicht gefunden</p>
        <p className="body-lg text-pepe-t64 mb-8 max-w-lg mx-auto">
          Die Seite, die du suchst, gibt es nicht oder sie ist umgezogen.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
          <Link href={localizedHref(DEFAULT_LOCALE, '/')} className="w-full sm:w-auto">
            <Button variant="primary" className="w-full sm:w-auto">Zur Startseite</Button>
          </Link>
          <Link href={localizedHref(DEFAULT_LOCALE, '/events')} className="w-full sm:w-auto">
            <Button variant="secondary" className="w-full sm:w-auto">Zum Programm</Button>
          </Link>
          <Link href={localizedHref(DEFAULT_LOCALE, '/galerie')} className="w-full sm:w-auto">
            <Button variant="ghost" className="w-full sm:w-auto">Zur Galerie</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
