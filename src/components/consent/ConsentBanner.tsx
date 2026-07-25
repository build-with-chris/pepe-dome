'use client'

/**
 * Cookie-Banner (TDDDG § 25 Abs. 1, DSGVO Art. 6 Abs. 1 lit. a)
 *
 * Gestaltungsregeln, die hier bewusst eingehalten sind:
 *   - Ablehnen ist genauso leicht erreichbar wie Zustimmen, gleiche Ebene,
 *     gleiche Größe. Ein versteckter Ablehnen-Button ist der häufigste
 *     Abmahngrund bei Cookie-Bannern.
 *   - Ohne Entscheidung wird nichts geladen. Wegklicken gilt nicht als Ja.
 *   - Der Widerruf ist über den Footer jederzeit erreichbar.
 */

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CONSENT_OPEN_EVENT, readConsent, writeConsent } from '@/lib/consent'

const COPY = {
  de: {
    title: 'Kurz gefragt: Cookies?',
    body: 'Technisch notwendige Cookies sind immer aktiv. Zusätzlich möchten wir messen, wie unsere Seite genutzt wird, und sehen, ob unsere Anzeigen jemanden erreichen. Du entscheidest.',
    acceptAll: 'Alle akzeptieren',
    necessaryOnly: 'Nur notwendige',
    settings: 'Einstellungen',
    save: 'Auswahl speichern',
    privacy: 'Datenschutzerklärung',
    imprint: 'Impressum',
    analyticsTitle: 'Statistik',
    analyticsBody: 'Google Analytics. Zeigt uns, welche Veranstaltungen euch interessieren.',
    marketingTitle: 'Marketing',
    marketingBody: 'Meta Pixel. Misst, ob unsere Anzeigen auf Instagram und Facebook funktionieren.',
    necessaryTitle: 'Notwendig',
    necessaryBody: 'Für Login, Formulare und Spracheinstellung. Ohne die geht die Seite nicht.',
    always: 'Immer aktiv',
    revoke: 'Du kannst deine Entscheidung jederzeit im Footer ändern.',
  },
  en: {
    title: 'Quick question: cookies?',
    body: 'Strictly necessary cookies are always on. Beyond that we would like to measure how the site is used and whether our ads reach anyone. Your call.',
    acceptAll: 'Accept all',
    necessaryOnly: 'Necessary only',
    settings: 'Settings',
    save: 'Save selection',
    privacy: 'Privacy policy',
    imprint: 'Imprint',
    analyticsTitle: 'Statistics',
    analyticsBody: 'Google Analytics. Shows us which events you are interested in.',
    marketingTitle: 'Marketing',
    marketingBody: 'Meta Pixel. Measures whether our ads on Instagram and Facebook work.',
    necessaryTitle: 'Necessary',
    necessaryBody: 'For login, forms and language settings. The site does not work without them.',
    always: 'Always on',
    revoke: 'You can change your choice any time via the footer.',
  },
} as const

export default function ConsentBanner() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [marketing, setMarketing] = useState(false)

  const isEnglish = pathname?.startsWith('/en') ?? false
  const t = isEnglish ? COPY.en : COPY.de
  const lang = isEnglish ? 'en' : 'de'

  useEffect(() => {
    // Erst nach dem Mount entscheiden, sonst weicht der Server-HTML vom
    // Client-HTML ab (localStorage gibt es serverseitig nicht).
    const stored = readConsent()
    if (!stored) {
      setVisible(true)
    } else {
      setAnalytics(stored.analytics)
      setMarketing(stored.marketing)
    }

    const reopen = () => {
      const current = readConsent()
      setAnalytics(current?.analytics ?? false)
      setMarketing(current?.marketing ?? false)
      setShowDetails(true)
      setVisible(true)
    }

    window.addEventListener(CONSENT_OPEN_EVENT, reopen)
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, reopen)
  }, [])

  const decide = useCallback((choice: { analytics: boolean; marketing: boolean }) => {
    writeConsent(choice)
    setVisible(false)
    setShowDetails(false)
  }, [])

  // Im Admin-Panel ist der Banner nur im Weg, dort läuft kein Tracking.
  if (pathname?.startsWith('/admin')) return null
  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="consent-title"
      className="fixed inset-x-0 bottom-0 z-[100] p-3 sm:p-4"
    >
      <div className="mx-auto max-w-3xl rounded-xl border border-[var(--pepe-line)] bg-[var(--pepe-ink)]/95 backdrop-blur-md shadow-2xl">
        <div className="p-5 sm:p-6">
          <h2 id="consent-title" className="text-lg font-semibold text-[var(--pepe-white)] mb-2">
            {t.title}
          </h2>
          <p className="text-sm text-[var(--pepe-t64)] leading-relaxed">{t.body}</p>

          {showDetails && (
            <div className="mt-5 space-y-3 border-t border-[var(--pepe-line)] pt-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-medium text-[var(--pepe-t80)]">
                    {t.necessaryTitle}
                  </div>
                  <p className="text-xs text-[var(--pepe-t48)] mt-0.5">{t.necessaryBody}</p>
                </div>
                <span className="shrink-0 text-xs text-[var(--pepe-t48)] pt-1">{t.always}</span>
              </div>

              <ConsentToggle
                title={t.analyticsTitle}
                description={t.analyticsBody}
                checked={analytics}
                onChange={setAnalytics}
              />
              <ConsentToggle
                title={t.marketingTitle}
                description={t.marketingBody}
                checked={marketing}
                onChange={setMarketing}
              />
            </div>
          )}

          <div className="mt-5 flex flex-col sm:flex-row gap-2">
            {showDetails ? (
              <button
                type="button"
                onClick={() => decide({ analytics, marketing })}
                className="btn btn-primary btn-md flex-1"
              >
                {t.save}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => decide({ analytics: true, marketing: true })}
                className="btn btn-primary btn-md flex-1"
              >
                {t.acceptAll}
              </button>
            )}

            <button
              type="button"
              onClick={() => decide({ analytics: false, marketing: false })}
              className="btn btn-secondary btn-md flex-1"
            >
              {t.necessaryOnly}
            </button>

            {!showDetails && (
              <button
                type="button"
                onClick={() => setShowDetails(true)}
                className="btn btn-ghost btn-md flex-1"
              >
                {t.settings}
              </button>
            )}
          </div>

          <p className="mt-4 text-xs text-[var(--pepe-t48)]">
            {t.revoke}{' '}
            <Link
              href={`/${lang}/datenschutz`}
              className="underline hover:text-[var(--pepe-accent-text)] transition-colors"
            >
              {t.privacy}
            </Link>
            {' · '}
            <Link
              href={`/${lang}/impressum`}
              className="underline hover:text-[var(--pepe-accent-text)] transition-colors"
            >
              {t.imprint}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function ConsentToggle({
  title,
  description,
  checked,
  onChange,
}: {
  title: string
  description: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <label className="flex items-start justify-between gap-4 cursor-pointer group">
      <div>
        <div className="text-sm font-medium text-[var(--pepe-t80)] group-hover:text-[var(--pepe-white)] transition-colors">
          {title}
        </div>
        <p className="text-xs text-[var(--pepe-t48)] mt-0.5">{description}</p>
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="shrink-0 mt-1 w-5 h-5 rounded border-[var(--pepe-line)] bg-transparent checked:bg-[var(--pepe-gold)] checked:border-[var(--pepe-gold)] cursor-pointer transition-colors"
      />
    </label>
  )
}
