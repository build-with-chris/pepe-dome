import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale, type Locale } from '@/i18n/config'
import UnsubscribeConfirm from '@/components/newsletter/UnsubscribeConfirm'

/**
 * Abmelde-Bestätigung.
 *
 * Diese Seite existierte bisher gar nicht: Der Abmeldelink in jeder
 * versendeten Mail zeigte auf /newsletter/unsubscribe/<id> und lief in einen
 * 404. Es gab damit faktisch keinen funktionierenden Opt-out.
 *
 * Die Seite fragt bewusst nach, statt sofort auszutragen. Mailprogramme und
 * Sicherheits-Scanner öffnen Links in Mails von allein — ein Aufruf allein
 * darf niemanden abmelden.
 */

export const metadata: Metadata = {
  title: 'Newsletter abmelden | Pepe Dome',
  description: 'Newsletter des Pepe Dome abbestellen.',
  robots: { index: false, follow: false },
}

export default async function UnsubscribePage({
  params,
}: {
  params: Promise<{ lang: string; token: string }>
}) {
  const { lang: rawLang, token } = await params
  if (!isLocale(rawLang)) notFound()
  const lang: Locale = rawLang

  return (
    <div className="min-h-screen bg-[var(--pepe-black)] flex items-center justify-center px-6 py-20">
      <UnsubscribeConfirm token={token} lang={lang} />
    </div>
  )
}
