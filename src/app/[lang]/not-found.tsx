/**
 * 404 innerhalb des lokalisierten Baums.
 *
 * Ohne diese Datei landete jeder `notFound()`-Aufruf aus einer /de- oder
 * /en-Route in src/app/not-found.tsx. Die ist hart deutsch und verlinkt `/` und
 * `/events` — beides Pfade, die die Middleware erst auf `/de/...` weiterleitet.
 * Ein englischer Besucher bekam also eine deutsche Fehlerseite mit zwei
 * Umleitungen als Ausweg.
 *
 * Warum die Texte hier inline stehen und nicht im Dictionary:
 * Eine not-found.tsx bekommt in Next keine `params`. Die Locale ist hier also
 * nicht als Prop verfügbar, und `getDictionary()` bräuchte sie. Die Sprache
 * kommt daher clientseitig aus dem Pfad. Es sind zwei Sätze, dafür lohnt die
 * zusätzliche Mechanik nicht.
 */

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Button from '@/components/ui/Button'
import { LOCALES, DEFAULT_LOCALE, localizedHref, type Locale } from '@/i18n/config'

const TEXTS: Record<Locale, {
  headline: string
  lead: string
  body: string
  home: string
  events: string
  gallery: string
}> = {
  de: {
    headline: '404',
    lead: 'Seite nicht gefunden',
    body: 'Die Seite, die du suchst, gibt es nicht oder sie ist umgezogen.',
    home: 'Zur Startseite',
    events: 'Zum Programm',
    gallery: 'Zur Galerie',
  },
  en: {
    headline: '404',
    lead: 'Page not found',
    body: 'The page you are looking for does not exist, or it has moved.',
    home: 'Go to start page',
    events: 'See the programme',
    gallery: 'See the gallery',
  },
}

function localeFromPathname(pathname: string | null): Locale {
  const segment = pathname?.split('/')[1] ?? ''
  return (LOCALES as readonly string[]).includes(segment)
    ? (segment as Locale)
    : DEFAULT_LOCALE
}

export default function LocalizedNotFound() {
  const lang = localeFromPathname(usePathname())
  const t = TEXTS[lang]

  return (
    <div className="section-hero flex items-center justify-center">
      <div className="stage-container text-center">
        <h1 className="display-1 mb-4">{t.headline}</h1>
        <p className="lead text-pepe-gold mb-6">{t.lead}</p>
        <p className="body-lg text-pepe-t64 mb-8 max-w-lg mx-auto">{t.body}</p>
        {/* Drei Wege weiter statt zwei: wer auf einer toten Event-URL landet,
            will meistens ins Programm, und die Galerie fängt die auf, die
            eigentlich nur schauen wollten, wie es hier aussieht. */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
          <Link href={localizedHref(lang, '/')} className="w-full sm:w-auto">
            <Button variant="primary" className="w-full sm:w-auto">{t.home}</Button>
          </Link>
          <Link href={localizedHref(lang, '/events')} className="w-full sm:w-auto">
            <Button variant="secondary" className="w-full sm:w-auto">{t.events}</Button>
          </Link>
          <Link href={localizedHref(lang, '/galerie')} className="w-full sm:w-auto">
            <Button variant="ghost" className="w-full sm:w-auto">{t.gallery}</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
