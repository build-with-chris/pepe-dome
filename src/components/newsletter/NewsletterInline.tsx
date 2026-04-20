/**
 * Compact inline newsletter signup — designed for the navbar.
 * Horizontal layout: [email input] [→]
 */

'use client'

import { useState, FormEvent } from 'react'

interface NewsletterInlineProps {
  className?: string
}

export default function NewsletterInline({ className = '' }: NewsletterInlineProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setMessage('')
    if (!validateEmail(email)) {
      setStatus('error')
      setMessage('Bitte gültige E-Mail eingeben.')
      return
    }
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error?.message || 'Fehler')
      setStatus('success')
      setMessage('Danke! Prüfe dein Postfach.')
      setEmail('')
      if (typeof window !== 'undefined') {
        localStorage.setItem('newsletter_subscribed', 'true')
      }
      setTimeout(() => {
        setStatus('idle')
        setMessage('')
      }, 4000)
    } catch (err: any) {
      setStatus('error')
      setMessage(err.message || 'Fehler')
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`newsletter-inline ${className}`} aria-label="Newsletter-Anmeldung">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Newsletter: E-Mail"
        required
        disabled={status === 'loading' || status === 'success'}
        className="newsletter-inline-input"
      />
      <button
        type="submit"
        disabled={status === 'loading' || status === 'success'}
        className="newsletter-inline-button"
        aria-label="Newsletter abonnieren"
      >
        {status === 'loading' ? '…' : status === 'success' ? '✓' : '→'}
      </button>
      {message && (
        <span
          className={`newsletter-inline-message ${
            status === 'error' ? 'is-error' : status === 'success' ? 'is-success' : ''
          }`}
        >
          {message}
        </span>
      )}
    </form>
  )
}
