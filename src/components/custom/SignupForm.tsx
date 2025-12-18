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

interface SignupFormProps {
  /** Form variant - simple (email only) or extended (with name and interests) */
  variant?: 'simple' | 'extended'
  /** Callback on successful signup */
  onSuccess?: () => void
  /** Custom class name */
  className?: string
  /** Contextual message to display above form */
  contextMessage?: string
}

const INTEREST_OPTIONS = [
  { id: 'shows-events', label: 'Shows & Events' },
  { id: 'workshops', label: 'Workshops & Community' },
  { id: 'corporate', label: 'Corporate & Business Events' },
]

export default function SignupForm({
  variant = 'simple',
  onSuccess,
  className = '',
  contextMessage,
}: SignupFormProps) {
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
      setValidationError('Bitte gib eine gultige E-Mail-Adresse ein.')
      return
    }

    // Validate GDPR consent for extended variant
    if (variant === 'extended' && !gdprConsent) {
      setValidationError('Bitte stimme der Datenschutzerklarung zu.')
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
        throw new Error(result.error?.message || 'Ein Fehler ist aufgetreten.')
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
        setErrorMessage('Ein unbekannter Fehler ist aufgetreten.')
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
              Danke, du bist schon dabei!
            </h3>
            <p className="text-[var(--pepe-t64)] text-sm mb-4">
              Du hast unseren Newsletter bereits abonniert.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFormAnyway(true)}
          >
            Trotzdem anmelden
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
            Danke fur deine Anmeldung!
          </h3>
          <p className="text-[var(--pepe-t64)] text-sm">
            Schau in dein Postfach und bestatige deine E-Mail-Adresse.
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
              placeholder="deine@email.com"
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
            {status === 'loading' ? 'Wird gesendet...' : 'Newsletter abonnieren'}
          </Button>

          {status === 'error' && (
            <p className="text-xs text-[var(--pepe-error)]">{errorMessage}</p>
          )}

          <p className="text-xs text-[var(--pepe-t48)]">
            Wir respektieren deine Privatsphare. Abmeldung jederzeit moglich.
          </p>
        </form>
      </div>
    )
  }

  // Extended variant (email, name, interests, GDPR)
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Newsletter abonnieren</CardTitle>
        <CardDescription>
          Erhalte monatlich Updates zu Events, Shows und Workshops direkt in dein Postfach.
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
              E-Mail-Adresse
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="deine@email.com"
              required
              disabled={status === 'loading'}
              hasError={!!validationError && validationError.includes('E-Mail')}
            />
          </div>

          {/* First Name Field */}
          <div className="space-y-2">
            <Label htmlFor="firstName">Vorname (optional)</Label>
            <Input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Max"
              disabled={status === 'loading'}
            />
          </div>

          {/* Interests */}
          <div className="space-y-3">
            <Label>Interessen (optional)</Label>
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
                Ich stimme zu, dass meine Daten zum Versand des Newsletters verarbeitet werden.
                Mehr Informationen in unserer{' '}
                <a
                  href="/datenschutz"
                  className="text-[var(--pepe-gold)] hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Datenschutzerklarung
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
            {status === 'loading' ? 'Wird gesendet...' : 'Jetzt abonnieren'}
          </Button>

          {/* Error Message */}
          {status === 'error' && (
            <p className="text-sm text-[var(--pepe-error)]">{errorMessage}</p>
          )}

          {/* Privacy Note */}
          <p className="text-xs text-[var(--pepe-t48)]">
            Wir respektieren deine Privatsphare und versenden nur qualitativ hochwertige
            Inhalte. Abmeldung jederzeit moglich.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
