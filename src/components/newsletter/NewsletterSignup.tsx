'use client'

import { useState, FormEvent } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { getNewsletterContent } from '@/lib/data'

interface NewsletterSignupProps {
  compact?: boolean
}

export default function NewsletterSignup({ compact = false }: NewsletterSignupProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const content = getNewsletterContent().signup

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error?.message || 'Ein Fehler ist aufgetreten.')
      }

      setStatus('success')
      setEmail('')
      if (typeof window !== 'undefined') {
        localStorage.setItem('newsletter_subscribed', 'true')
      }
      setTimeout(() => setStatus('idle'), 5000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  if (compact) {
    return (
      <div className="footer-newsletter">
        <h4 className="footer-newsletter-title">{content.title}</h4>
        <form onSubmit={handleSubmit} className="newsletter-form">
          <div className="newsletter-input-group">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={content.placeholder}
              className="newsletter-input"
              required
              disabled={status === 'loading' || status === 'success'}
            />
            <Button
              type="submit"
              className="newsletter-btn"
              disabled={status === 'loading' || status === 'success'}
            >
              {status === 'loading' ? '...' : status === 'success' ? '✓' : content.button}
            </Button>
          </div>
          {status === 'success' && (
            <p className="text-xs text-pepe-success mt-2">{content.success}</p>
          )}
          {status === 'error' && (
            <p className="text-xs text-pepe-error mt-2">{content.error}</p>
          )}
        </form>
      </div>
    )
  }

  return (
    <div className="card p-8 max-w-md mx-auto">
      <h3 className="h3 mb-4">{content.title}</h3>
      <p className="body-sm text-pepe-t64 mb-6">{content.description}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={content.placeholder}
          required
          disabled={status === 'loading' || status === 'success'}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={status === 'loading' || status === 'success'}
        >
          {status === 'loading' ? 'Wird gesendet...' : status === 'success' ? 'Erfolgreich!' : content.button}
        </Button>

        <p className="text-xs text-pepe-t48">{content.privacy}</p>

        {status === 'success' && (
          <p className="text-sm text-pepe-success">{content.success}</p>
        )}
        {status === 'error' && (
          <p className="text-sm text-pepe-error">{content.error}</p>
        )}
      </form>
    </div>
  )
}
