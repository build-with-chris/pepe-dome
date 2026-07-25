'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Locale } from '@/i18n/config'

/**
 * Rückfrage vor der Abmeldung.
 *
 * Die eigentliche Änderung läuft über POST. Ein GET-Link, der abmeldet, wird
 * von Mailprogrammen und Link-Scannern beim Öffnen der Mail von selbst
 * ausgelöst und trägt Leute aus, die nie geklickt haben.
 */

const COPY = {
  de: {
    title: 'Newsletter abmelden',
    intro:
      'Du bekommst dann keine Mails mehr von uns. Anmelden kannst du dich jederzeit wieder.',
    confirm: 'Jetzt abmelden',
    pending: 'Wird abgemeldet ...',
    doneTitle: 'Du bist abgemeldet',
    doneText:
      'Wir schicken dir keine Mails mehr. Schade, dass du gehst — die Tür steht offen.',
    error: 'Das hat nicht geklappt. Versuche es später noch einmal oder schreib uns an info@pepe-dome.de.',
    back: 'Zur Startseite',
  },
  en: {
    title: 'Unsubscribe from the newsletter',
    intro: 'You will stop receiving our emails. You can sign up again at any time.',
    confirm: 'Unsubscribe',
    pending: 'Unsubscribing ...',
    doneTitle: 'You are unsubscribed',
    doneText: 'We will not send you any more emails. Sorry to see you go — you are welcome back.',
    error: 'That did not work. Please try again later or write to info@pepe-dome.de.',
    back: 'Back to the homepage',
  },
} as const

interface UnsubscribeConfirmProps {
  token: string
  lang: Locale
}

export default function UnsubscribeConfirm({ token, lang }: UnsubscribeConfirmProps) {
  const t = COPY[lang] ?? COPY.de
  const [state, setState] = useState<'idle' | 'pending' | 'done' | 'error'>('idle')

  async function confirm() {
    setState('pending')
    try {
      const response = await fetch(
        `/api/subscribers/unsubscribe?token=${encodeURIComponent(token)}`,
        { method: 'POST' }
      )

      // Nicht am Statuscode festmachen: Die Route antwortet immer mit 200,
      // damit Mailprovider den One-Click-Knopf nicht abschalten. Ob wirklich
      // jemand ausgetragen wurde, steht im Body. Sonst meldete die Seite auch
      // bei einem ungültigen oder alten Link Erfolg, und die Person hielte
      // sich für abgemeldet, während weiter Post käme.
      const data = await response.json().catch(() => null)
      setState(response.ok && data?.unsubscribed ? 'done' : 'error')
    } catch {
      setState('error')
    }
  }

  if (state === 'done') {
    return (
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-white mb-4">{t.doneTitle}</h1>
        <p className="text-white/60 leading-relaxed mb-8">{t.doneText}</p>
        <Link href={`/${lang}`} className="text-[#016dca] hover:text-[#0180e8] transition-colors">
          {t.back}
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md text-center">
      <h1 className="text-3xl font-bold text-white mb-4">{t.title}</h1>
      <p className="text-white/60 leading-relaxed mb-8">{t.intro}</p>

      {state === 'error' && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 mb-6 text-sm text-red-200">
          {t.error}
        </div>
      )}

      <button
        onClick={confirm}
        disabled={state === 'pending'}
        className="w-full rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium py-3.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
      >
        {state === 'pending' ? t.pending : t.confirm}
      </button>

      <Link
        href={`/${lang}`}
        className="inline-block text-sm text-white/40 hover:text-white/70 transition-colors py-2"
      >
        {t.back}
      </Link>
    </div>
  )
}
