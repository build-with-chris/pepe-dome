'use client'

import { useState, FormEvent, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'

/**
 * SignupForm component following PEPE Dome design system
 *
 * Features:
 * - Newsletter signup with validation
 * - Simple (email only) and extended (with name, interests) variants
 * - Success/error states
 * - GDPR checkbox
 * - Returning subscriber detection
 */

type SignupLang = 'de' | 'en'

interface SignupFormProps {
  /** Form variant - simple (email only) or extended (with name and interests) */
  variant?: 'simple' | 'extended'
  /** Callback on successful signup */
  onSuccess?: () => void
  /** Custom class name */
  className?: string
  /** Contextual message to display above form */
  contextMessage?: string
  /** Language (defaults to 'de') */
  lang?: SignupLang
}

const STRINGS: Record<SignupLang, {
  cardTitle: string
  cardDescription: string
  emailLabel: string
  emailPlaceholder: string
  firstNameLabel: string
  firstNamePlaceholder: string
  interestsLabel: string
  interests: { id: string; label: string }[]
  gdprPrefix: string
  gdprPrivacyLink: string
  privacyHref: string
  submitSimple: string
  submitExtended: string
  loading: string
  errorEmail: string
  errorGdpr: string
  errorGeneric: string
  errorUnknown: string
  privacyNoteSimple: string
  privacyNoteExtended: string
  returningTitle: string
  returningText: string
  returningCta: string
  successTitle: string
  successText: string
}> = {
  de: {
    cardTitle: 'Newsletter abonnieren',
    cardDescription: 'Erhalte monatlich Updates zu Events, Shows und Workshops direkt in dein Postfach.',
    emailLabel: 'E-Mail-Adresse',
    emailPlaceholder: 'deine@email.com',
    firstNameLabel: 'Vorname (optional)',
    firstNamePlaceholder: 'Max',
    interestsLabel: 'Interessen (optional)',
    interests: [
      { id: 'shows-events', label: 'Shows & Events' },
      { id: 'workshops',    label: 'Workshops & Community' },
      { id: 'corporate',    label: 'Corporate & Business Events' },
    ],
    gdprPrefix: 'Ich stimme zu, dass meine Daten zum Versand des Newsletters verarbeitet werden. Mehr Informationen in unserer ',
    gdprPrivacyLink: 'Datenschutzerklärung',
    privacyHref: '/de/datenschutz',
    submitSimple: 'Newsletter abonnieren',
    submitExtended: 'Jetzt abonnieren',
    loading: 'Wird gesendet…',
    errorEmail: 'Bitte gib eine gültige E-Mail-Adresse ein.',
    errorGdpr: 'Bitte stimme der Datenschutzerklärung zu.',
    errorGeneric: 'Ein Fehler ist aufgetreten.',
    errorUnknown: 'Ein unbekannter Fehler ist aufgetreten.',
    privacyNoteSimple: 'Wir respektieren deine Privatsphäre. Abmeldung jederzeit möglich.',
    privacyNoteExtended: 'Wir respektieren deine Privatsphäre und versenden nur qualitativ hochwertige Inhalte. Abmeldung jederzeit möglich.',
    returningTitle: 'Danke, du bist schon dabei!',
    returningText: 'Du hast unseren Newsletter bereits abonniert.',
    returningCta: 'Trotzdem anmelden',
    successTitle: 'Danke für deine Anmeldung!',
    successText: 'Schau in dein Postfach und bestätige deine E-Mail-Adresse.',
  },
  en: {
    cardTitle: 'Subscribe to our newsletter',
    cardDescription: 'Get monthly updates on events, shows and workshops straight to your inbox.',
    emailLabel: 'E-mail address',
    emailPlaceholder: 'you@email.com',
    firstNameLabel: 'First name (optional)',
    firstNamePlaceholder: 'Alex',
    interestsLabel: 'Interests (optional)',
    interests: [
      { id: 'shows-events', label: 'Shows & Events' },
      { id: 'workshops',    label: 'Workshops & Community' },
      { id: 'corporate',    label: 'Corporate & Business Events' },
    ],
    gdprPrefix: 'I agree that my data is processed to send the newsletter. More info in our ',
    gdprPrivacyLink: 'privacy policy',
    privacyHref: '/en/datenschutz',
    submitSimple: 'Subscribe to newsletter',
    submitExtended: 'Subscribe now',
    loading: 'Sending…',
    errorEmail: 'Please enter a valid e-mail address.',
    errorGdpr: 'Please accept the privacy policy.',
    errorGeneric: 'Something went wrong.',
    errorUnknown: 'An unknown error occurred.',
    privacyNoteSimple: 'We respect your privacy. Unsubscribe anytime.',
    privacyNoteExtended: 'We respect your privacy and only send high-quality content. Unsubscribe anytime.',
    returningTitle: 'Thanks, you’re already in!',
    returningText: 'You’ve already subscribed to our newsletter.',
    returningCta: 'Subscribe again',
    successTitle: 'Thanks for subscribing!',
    successText: 'Check your inbox and confirm your e-mail address.',
  },
}

export default function SignupForm({
  variant = 'simple',
  onSuccess,
  className = '',
  contextMessage,
  lang = 'de',
}: SignupFormProps) {
  const t = STRINGS[lang]
  const INTEREST_OPTIONS = t.interests
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [interests, setInterests] = useState<string[]>([])
  const [gdprConsent, setGdprConsent] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [validationError, setValidationError] = useState('')
  const [isReturningSubscriber, setIsReturningSubscriber] = useState(false)
  const [showFormAnyway, setShowFormAnyway] = useState(false)

  // Check for returning subscriber on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const subscribed = localStorage.getItem('newsletter_subscribed')
      setIsReturningSubscriber(subscribed === 'true')
    }
  }, [])

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleInterestToggle = (interestId: string) => {
    setInterests((prev) =>
      prev.includes(interestId)
        ? prev.filter((id) => id !== interestId)
        : [...prev, interestId]
    )
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setValidationError('')
    setErrorMessage('')

    // Validate email
    if (!validateEmail(email)) {
      setValidationError(t.errorEmail)
      return
    }

    // Validate GDPR consent for extended variant
    if (variant === 'extended' && !gdprConsent) {
      setValidationError(t.errorGdpr)
      return
    }

    setStatus('loading')

    try {
      const payload: Record<string, unknown> = { email }

      if (variant === 'extended') {
        if (firstName.trim()) {
          payload.firstName = firstName.trim()
        }
        if (interests.length > 0) {
          payload.interests = interests
        }
      }

      const response = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error?.message || t.errorGeneric)
      }

      // Success
      setStatus('success')
      setEmail('')
      setFirstName('')
      setInterests([])
      setGdprConsent(false)

      // Set localStorage flag
      if (typeof window !== 'undefined') {
        localStorage.setItem('newsletter_subscribed', 'true')
      }

      // Call onSuccess callback
      if (onSuccess) {
        onSuccess()
      }

      // Reset to idle after 5 seconds
      setTimeout(() => {
        setStatus('idle')
      }, 5000)
    } catch (error: unknown) {
      setStatus('error')
      if (error instanceof Error) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage(t.errorUnknown)
      }
    }
  }

  // Returning subscriber message
  if (isReturningSubscriber && !showFormAnyway) {
    return (
      <Card className={cn('text-center', className)}>
        <CardContent className="pt-6">
          <div className="mb-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--pepe-gold)]/10 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-[var(--pepe-gold)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[var(--pepe-white)] mb-2">
              {t.returningTitle}
            </h3>
            <p className="text-[var(--pepe-t64)] text-sm mb-4">
              {t.returningText}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFormAnyway(true)}
          >
            {t.returningCta}
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Success message
  if (status === 'success') {
    return (
      <Card className={cn('text-center', className)}>
        <CardContent className="pt-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--pepe-gold)]/10 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-[var(--pepe-gold)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-[var(--pepe-white)] mb-2">
            {t.successTitle}
          </h3>
          <p className="text-[var(--pepe-t64)] text-sm">
            {t.successText}
          </p>
        </CardContent>
      </Card>
    )
  }

  // Simple variant (email only)
  if (variant === 'simple') {
    return (
      <div className={className}>
        {contextMessage && (
          <p className="text-[var(--pepe-t64)] text-sm mb-4">{contextMessage}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.emailPlaceholder}
              required
              disabled={status === 'loading'}
              hasError={!!validationError}
            />
            {validationError && (
              <p className="text-xs text-[var(--pepe-error)] mt-1">{validationError}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? t.loading : t.submitSimple}
          </Button>

          {status === 'error' && (
            <p className="text-xs text-[var(--pepe-error)]">{errorMessage}</p>
          )}

          <p className="text-xs text-[var(--pepe-t48)]">
            {t.privacyNoteSimple}
          </p>
        </form>
      </div>
    )
  }

  // Extended variant (email, name, interests, GDPR)
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{t.cardTitle}</CardTitle>
        <CardDescription>
          {t.cardDescription}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {contextMessage && (
          <p className="text-[var(--pepe-t64)] text-sm mb-4">{contextMessage}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" required>
              {t.emailLabel}
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.emailPlaceholder}
              required
              disabled={status === 'loading'}
              hasError={!!validationError && (validationError.includes('E-Mail') || validationError.includes('e-mail'))}
            />
          </div>

          {/* First Name Field */}
          <div className="space-y-2">
            <Label htmlFor="firstName">{t.firstNameLabel}</Label>
            <Input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder={t.firstNamePlaceholder}
              disabled={status === 'loading'}
            />
          </div>

          {/* Interests */}
          <div className="space-y-3">
            <Label>{t.interestsLabel}</Label>
            <div className="space-y-2">
              {INTEREST_OPTIONS.map((option) => (
                <label
                  key={option.id}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={interests.includes(option.id)}
                    onChange={() => handleInterestToggle(option.id)}
                    disabled={status === 'loading'}
                    className={cn(
                      'w-5 h-5 rounded border-[var(--pepe-line)]',
                      'bg-transparent cursor-pointer transition-colors',
                      'checked:bg-[var(--pepe-gold)] checked:border-[var(--pepe-gold)]',
                      'focus:ring-2 focus:ring-[var(--pepe-gold-glow)]'
                    )}
                  />
                  <span className="text-sm text-[var(--pepe-t80)] group-hover:text-[var(--pepe-white)] transition-colors">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* GDPR Checkbox */}
          <div className="space-y-2">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={gdprConsent}
                onChange={(e) => setGdprConsent(e.target.checked)}
                disabled={status === 'loading'}
                className={cn(
                  'w-5 h-5 rounded border-[var(--pepe-line)] mt-0.5',
                  'bg-transparent cursor-pointer transition-colors',
                  'checked:bg-[var(--pepe-gold)] checked:border-[var(--pepe-gold)]',
                  'focus:ring-2 focus:ring-[var(--pepe-gold-glow)]'
                )}
              />
              <span className="text-xs text-[var(--pepe-t64)] group-hover:text-[var(--pepe-t80)] transition-colors">
                {t.gdprPrefix}
                <a
                  href={t.privacyHref}
                  className="text-[var(--pepe-gold)] hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t.gdprPrivacyLink}
                </a>
                .
              </span>
            </label>
          </div>

          {/* Validation Error */}
          {validationError && (
            <p className="text-sm text-[var(--pepe-error)]">{validationError}</p>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? t.loading : t.submitExtended}
          </Button>

          {/* Error Message */}
          {status === 'error' && (
            <p className="text-sm text-[var(--pepe-error)]">{errorMessage}</p>
          )}

          {/* Privacy Note */}
          <p className="text-xs text-[var(--pepe-t48)]">
            {t.privacyNoteExtended}
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
