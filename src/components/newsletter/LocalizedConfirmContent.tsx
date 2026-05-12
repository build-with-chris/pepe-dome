'use client'

/**
 * Lokalisierte Variante von ConfirmContent — bekommt dict + lang per Props.
 */

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import type { Dictionary } from '@/i18n/get-dictionary'
import { localizedHref, type Locale } from '@/i18n/config'

export default function LocalizedConfirmContent({
  lang,
  dict,
}: {
  lang: Locale
  dict: Dictionary
}) {
  const t = dict.newsletter.confirm
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setErrorMessage(t.errorMissingToken)
      return
    }

    const confirmSubscription = async () => {
      try {
        const response = await fetch(`/api/subscribers/confirm?token=${token}`)
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error?.message || t.errorGeneric)
        }

        if (typeof window !== 'undefined') {
          localStorage.setItem('newsletter_subscribed', 'true')
        }

        setStatus('success')
      } catch (error: unknown) {
        setStatus('error')
        if (error instanceof Error) {
          setErrorMessage(error.message)
        } else {
          setErrorMessage(t.errorUnknown)
        }
      }
    }

    confirmSubscription()
  }, [token, t.errorMissingToken, t.errorGeneric, t.errorUnknown])

  const newsletterHref = localizedHref(lang, '/newsletter')
  const eventsHref = localizedHref(lang, '/events')
  const homeHref = localizedHref(lang, '/')

  if (status === 'loading') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="stage-container text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--pepe-gold)]/10 flex items-center justify-center">
              <div className="w-8 h-8 border-3 border-[var(--pepe-gold)] border-t-transparent rounded-full animate-spin" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-4">
              {t.loadingTitle}
            </h1>
            <p className="text-[var(--pepe-t64)]">{t.loadingText}</p>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="stage-container text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--pepe-error)]/10 flex items-center justify-center">
              <span className="text-[var(--pepe-error)] text-4xl">&#10006;</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-4">
              {t.errorTitle}
            </h1>
            <p className="text-[var(--pepe-t64)] mb-8">{errorMessage}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href={newsletterHref}>
                <Button variant="primary">{t.subscribeAgain}</Button>
              </Link>
              <Link href={homeHref}>
                <Button variant="ghost">{t.backHome}</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-16">
      <div className="stage-container text-center">
        <div className="max-w-2xl mx-auto">
          <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-[var(--pepe-gold)]/10 flex items-center justify-center">
            <span className="text-[var(--pepe-gold)] text-5xl">&#10003;</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-4">
            {t.successTitle}
          </h1>

          <p className="text-lg text-[var(--pepe-t80)] mb-10 max-w-xl mx-auto">
            {t.successText}
          </p>

          <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-xl p-8 mb-10 text-left max-w-lg mx-auto">
            <h2 className="text-xl font-bold text-[var(--pepe-white)] mb-6">
              {t.nextStepsTitle}
            </h2>
            <ul className="space-y-4">
              {t.nextSteps.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-[var(--pepe-gold)] mt-1 flex-shrink-0">&#10003;</span>
                  <span className="text-[var(--pepe-t80)]">{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={eventsHref}>
              <Button variant="primary" size="lg">{t.ctaEvents}</Button>
            </Link>
            <Link href={newsletterHref}>
              <Button variant="secondary" size="lg">{t.ctaArchive}</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
