/**
 * Newsletter Signup Form Component
 * Task 7.1.2: Create base SignupForm component
 * Task 7.1.3: Add returning subscriber detection
 */

'use client'

import { useState, FormEvent, useEffect } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

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
      setValidationError('Bitte gib eine gültige E-Mail-Adresse ein.')
      return
    }

    setStatus('loading')

    try {
      const payload: any = { email }

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
    } catch (error: any) {
      setStatus('error')
      setErrorMessage(error.message)
    }
  }

  // Returning subscriber message
  if (isReturningSubscriber && !showFormAnyway) {
    return (
      <div className={`card p-6 text-center ${className}`}>
        <div className="mb-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-pepe-gold/10 flex items-center justify-center">
            <span className="text-pepe-gold text-3xl">✓</span>
          </div>
          <h3 className="h4 mb-2">Danke, du bist schon dabei!</h3>
          <p className="text-pepe-t64 text-sm mb-4">
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
      </div>
    )
  }

  // Success message
  if (status === 'success') {
    return (
      <div className={`card p-6 text-center ${className}`}>
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-pepe-gold/10 flex items-center justify-center">
          <span className="text-pepe-gold text-3xl">✓</span>
        </div>
        <h3 className="h4 mb-2">Danke für deine Anmeldung!</h3>
        <p className="text-pepe-t64 text-sm">
          Schau in dein Postfach und bestätige deine E-Mail-Adresse.
        </p>
      </div>
    )
  }

  // Simple variant (email only)
  if (variant === 'simple') {
    return (
      <div className={className}>
        {contextMessage && (
          <p className="text-pepe-t64 text-sm mb-4">{contextMessage}</p>
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
              className={validationError ? 'border-pepe-error' : ''}
            />
            {validationError && (
              <p className="text-xs text-pepe-error mt-1">{validationError}</p>
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
            <p className="text-xs text-pepe-error">{errorMessage}</p>
          )}

          <p className="text-xs text-pepe-t48">
            Wir respektieren deine Privatsphäre. Abmeldung jederzeit möglich.
          </p>
        </form>
      </div>
    )
  }

  // Extended variant (email, name, interests)
  return (
    <div className={`card p-8 ${className}`}>
      <h3 className="h3 mb-2">Newsletter abonnieren</h3>
      <p className="text-pepe-t64 mb-6">
        Erhalte monatlich Updates zu Events, Shows und Workshops direkt in dein Postfach.
      </p>

      {contextMessage && (
        <p className="text-pepe-t64 text-sm mb-4">{contextMessage}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="form-label">
            E-Mail-Adresse *
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="deine@email.com"
            required
            disabled={status === 'loading'}
            className={validationError ? 'border-pepe-error' : ''}
          />
          {validationError && (
            <p className="text-xs text-pepe-error mt-1">{validationError}</p>
          )}
        </div>

        <div>
          <label htmlFor="firstName" className="form-label">
            Vorname (optional)
          </label>
          <Input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Max"
            disabled={status === 'loading'}
          />
        </div>

        <div>
          <label className="form-label mb-3 block">
            Interessen (optional)
          </label>
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
                  className="w-5 h-5 rounded border-pepe-line bg-transparent checked:bg-pepe-gold checked:border-pepe-gold cursor-pointer transition-colors"
                />
                <span className="text-sm text-pepe-t80 group-hover:text-pepe-white transition-colors">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={status === 'loading'}
          size="lg"
        >
          {status === 'loading' ? 'Wird gesendet...' : 'Jetzt abonnieren'}
        </Button>

        {status === 'error' && (
          <p className="text-sm text-pepe-error">{errorMessage}</p>
        )}

        <p className="text-xs text-pepe-t48">
          Wir respektieren deine Privatsphäre und versenden nur qualitativ hochwertige
          Inhalte. Abmeldung jederzeit möglich.
        </p>
      </form>
    </div>
  )
}
