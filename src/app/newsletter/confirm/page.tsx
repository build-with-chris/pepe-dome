/**
 * Phase 3 Task 3.4.2: Newsletter Confirmation Page Rebuild
 *
 * Features:
 * - Thank you message
 * - Next steps info
 * - Loading, success, and error states
 */

'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

function ConfirmContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setErrorMessage('Kein Bestatigungstoken gefunden.')
      return
    }

    // Call confirmation API
    const confirmSubscription = async () => {
      try {
        const response = await fetch(`/api/subscribers/confirm?token=${token}`)
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error?.message || 'Bestatigung fehlgeschlagen.')
        }

        // Success - set localStorage flag
        if (typeof window !== 'undefined') {
          localStorage.setItem('newsletter_subscribed', 'true')
        }

        setStatus('success')
      } catch (error: unknown) {
        setStatus('error')
        if (error instanceof Error) {
          setErrorMessage(error.message)
        } else {
          setErrorMessage('Ein unbekannter Fehler ist aufgetreten.')
        }
      }
    }

    confirmSubscription()
  }, [token])

  if (status === 'loading') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="stage-container text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--pepe-gold)]/10 flex items-center justify-center">
              <div className="w-8 h-8 border-3 border-[var(--pepe-gold)] border-t-transparent rounded-full animate-spin" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-4">
              Bestatigung lauft...
            </h1>
            <p className="text-[var(--pepe-t64)]">
              Bitte warten, wahrend wir deine Anmeldung bestatigen.
            </p>
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
              Bestatigung fehlgeschlagen
            </h1>
            <p className="text-[var(--pepe-t64)] mb-8">{errorMessage}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/newsletter">
                <Button variant="primary">Erneut anmelden</Button>
              </Link>
              <Link href="/">
                <Button variant="ghost">Zur Startseite</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Success state
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-16">
      <div className="stage-container text-center">
        <div className="max-w-2xl mx-auto">
          {/* Success Icon */}
          <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-[var(--pepe-gold)]/10 flex items-center justify-center">
            <span className="text-[var(--pepe-gold)] text-5xl">&#10003;</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-4">
            Willkommen beim PEPE Dome Newsletter!
          </h1>

          {/* Description */}
          <p className="text-lg text-[var(--pepe-t80)] mb-10 max-w-xl mx-auto">
            Deine E-Mail-Adresse wurde erfolgreich bestatigt. Du erhaltst ab sofort
            monatliche Updates zu Events, Shows und Workshops.
          </p>

          {/* Next Steps Card */}
          <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-xl p-8 mb-10 text-left max-w-lg mx-auto">
            <h2 className="text-xl font-bold text-[var(--pepe-white)] mb-6">
              Was kommt als Nachstes?
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-[var(--pepe-gold)] mt-1 flex-shrink-0">&#10003;</span>
                <span className="text-[var(--pepe-t80)]">
                  Du erhaltst eine Willkommens-E-Mail mit allen wichtigen Informationen
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--pepe-gold)] mt-1 flex-shrink-0">&#10003;</span>
                <span className="text-[var(--pepe-t80)]">
                  Der nachste Newsletter wird automatisch an dich versendet
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--pepe-gold)] mt-1 flex-shrink-0">&#10003;</span>
                <span className="text-[var(--pepe-t80)]">
                  Du kannst dich jederzeit mit einem Klick wieder abmelden
                </span>
              </li>
            </ul>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/events">
              <Button variant="primary" size="lg">
                Kommende Events entdecken
              </Button>
            </Link>
            <Link href="/newsletter">
              <Button variant="secondary" size="lg">
                Newsletter-Archiv ansehen
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function NewsletterConfirmPage() {
  return (
    <div className="min-h-screen bg-[var(--pepe-black)]">
      <Suspense
        fallback={
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-[var(--pepe-gold)]/10 flex items-center justify-center">
              <div className="w-8 h-8 border-3 border-[var(--pepe-gold)] border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
        }
      >
        <ConfirmContent />
      </Suspense>
    </div>
  )
}
