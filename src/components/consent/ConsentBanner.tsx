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
 *
 * Ton: Der Banner sagt, wofür wir fragen (sehen, was euch interessiert; ob
 * Anzeigen ankommen), statt von "notwendigen Cookies" zu reden. Die Technik
 * steht in den Einstellungen und in der Datenschutzerklärung. Die Karte sitzt
 * auf dem Desktop unten links, damit sie den Hero-Button nicht verdeckt.
 */

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as SwitchPrimitive from '@radix-ui/react-switch'
import { CONSENT_OPEN_EVENT, readConsent, writeConsent } from '@/lib/consent'

const COPY = {
  de: {
    title: 'Schön, dass du da bist',
    body: 'Wir würden gern sehen, was euch interessiert und ob unsere Anzeigen ankommen. Ist das okay? Die Seite geht auch ohne.',
    acceptAll: 'Einverstanden',
    necessaryOnly: 'Nein, danke',
    settings: 'Selbst auswählen',
    save: 'Speichern',
    privacy: 'Datenschutz',
    imprint: 'Impressum',
    analyticsTitle: 'Statistik',
    analyticsBody: 'Zeigt uns, welche Veranstaltungen euch interessieren. Dafür nutzen wir Google Analytics.',
    marketingTitle: 'Werbung',
    marketingBody: 'Zeigt uns, ob unsere Anzeigen auf Instagram und Facebook ankommen. Dafür nutzen wir das Meta Pixel.',
    necessaryTitle: 'Notwendig',
    necessaryBody: 'Für Formulare, Login und die Spracheinstellung. Ohne das läuft die Seite nicht.',
    always: 'Immer an',
    revoke: 'Ändern kannst du das jederzeit unten im Footer.',
  },
  en: {
    title: 'Nice to have you here',
    body: 'We would like to see what interests you and whether our ads reach anyone. Is that okay? The site works without it too.',
    acceptAll: 'Sounds good',
    necessaryOnly: 'No, thanks',
    settings: 'Let me choose',
    save: 'Save',
    privacy: 'Privacy',
    imprint: 'Imprint',
    analyticsTitle: 'Statistics',
    analyticsBody: 'Shows us which events you are interested in. We use Google Analytics for this.',
    marketingTitle: 'Advertising',
    marketingBody: 'Shows us whether our ads on Instagram and Facebook reach anyone. We use the Meta Pixel for this.',
    necessaryTitle: 'Necessary',
    necessaryBody: 'For forms, login and your language setting. The site does not work without it.',
    always: 'Always on',
    revoke: 'You can change this any time in the footer.',
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
      aria-describedby="consent-body"
      // Handy: volle Breite unten. Desktop: schmale Karte unten links, der
      // Hero-Button in der Mitte bleibt frei. Breiten in rem, weil tokens.css
      // die max-w-*-Klassen auf 1920px umbiegt.
      className="fixed inset-x-0 bottom-0 z-[100] p-3 sm:inset-x-auto sm:left-0 sm:p-5 sm:w-[25rem] animate-[consent-in_0.35s_ease-out]"
    >
      {/* max-h + Scrollen: Mit aufgeklappten Einstellungen ist die Karte auf
          niedrigen Bildschirmen höher als der Viewport und liefe oben heraus. */}
      <div className="max-h-[calc(100dvh-1.5rem)] overflow-y-auto overflow-x-hidden rounded-2xl border border-white/10 bg-[var(--pepe-ink)]/95 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-md">
        {/* Schmaler Farbstreifen oben: bringt die Karte in die Bildsprache der Seite. */}
        <div aria-hidden className="h-1 bg-gradient-to-r from-[var(--pepe-gold)] via-[var(--pepe-accent-text)] to-[var(--pepe-gold)]" />

        <div className="p-5">
          <div className="flex items-center gap-3">
            <Image src="/PEPE_logos_dome.svg" alt="" width={40} height={40} className="shrink-0" />
            <h2 id="consent-title" className="text-base font-semibold text-[var(--pepe-white)]">
              {t.title}
            </h2>
          </div>
          <p id="consent-body" className="mt-2 text-sm leading-relaxed text-[var(--pepe-t64)]">
            {t.body}
          </p>

          {showDetails && (
            <div className="mt-5 space-y-4 rounded-xl bg-white/[0.03] p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-medium text-[var(--pepe-t80)]">
                    {t.necessaryTitle}
                  </div>
                  <p className="mt-0.5 text-xs leading-relaxed text-[var(--pepe-t48)]">
                    {t.necessaryBody}
                  </p>
                </div>
                <span className="shrink-0 pt-0.5 text-xs text-[var(--pepe-t48)]">{t.always}</span>
              </div>

              <ConsentToggle
                id="consent-analytics"
                title={t.analyticsTitle}
                description={t.analyticsBody}
                checked={analytics}
                onChange={setAnalytics}
              />
              <ConsentToggle
                id="consent-marketing"
                title={t.marketingTitle}
                description={t.marketingBody}
                checked={marketing}
                onChange={setMarketing}
              />
            </div>
          )}

          {/*
            Beide Wege nebeneinander und gleich groß. Ablehnen muss so leicht
            sein wie Zustimmen, das ist Pflicht, und nebeneinander bleibt der
            Banner auf dem Handy flach. "Nein, danke" ist als Ablehnung
            eindeutig und klingt trotzdem nicht nach Formular.
          */}
          <div className="mt-5 flex flex-row gap-2">
            {showDetails ? (
              <button
                type="button"
                onClick={() => decide({ analytics, marketing })}
                className="btn btn-primary btn-md flex-1 rounded-full"
              >
                {t.save}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => decide({ analytics: true, marketing: true })}
                className="btn btn-primary btn-md flex-1 rounded-full"
              >
                {t.acceptAll}
              </button>
            )}

            <button
              type="button"
              onClick={() => decide({ analytics: false, marketing: false })}
              className="btn btn-secondary btn-md flex-1 rounded-full"
            >
              {t.necessaryOnly}
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-xs text-[var(--pepe-t48)]">
            {!showDetails ? (
              <button
                type="button"
                onClick={() => setShowDetails(true)}
                className="font-medium text-[var(--pepe-t80)] underline-offset-4 hover:text-[var(--pepe-accent-text)] hover:underline transition-colors"
              >
                {t.settings}
              </button>
            ) : (
              <span>{t.revoke}</span>
            )}
            <span>
              <Link
                href={`/${lang}/datenschutz`}
                className="underline-offset-4 hover:text-[var(--pepe-accent-text)] hover:underline transition-colors"
              >
                {t.privacy}
              </Link>
              {' · '}
              <Link
                href={`/${lang}/impressum`}
                className="underline-offset-4 hover:text-[var(--pepe-accent-text)] hover:underline transition-colors"
              >
                {t.imprint}
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function ConsentToggle({
  id,
  title,
  description,
  checked,
  onChange,
}: {
  id: string
  title: string
  description: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <label htmlFor={id} className="cursor-pointer">
        <div className="text-sm font-medium text-[var(--pepe-t80)]">{title}</div>
        <p className="mt-0.5 text-xs leading-relaxed text-[var(--pepe-t48)]">{description}</p>
      </label>
      {/* Schalter statt Häkchen: liest sich als "an/aus" und nicht als
          Formularfeld. Direkt auf Radix statt über ui/switch, weil dessen Knopf
          die Theme-Farbe `background` nutzt, die es hier nicht gibt; der Knopf
          war dadurch unsichtbar. */}
      <SwitchPrimitive.Root
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        className="relative mt-0.5 inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors data-[state=checked]:bg-[var(--pepe-gold)] data-[state=unchecked]:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pepe-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pepe-ink)]"
      >
        <SwitchPrimitive.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-[1.375rem]" />
      </SwitchPrimitive.Root>
    </div>
  )
}
