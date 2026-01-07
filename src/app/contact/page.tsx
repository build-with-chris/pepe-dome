/**
 * Phase 3 Task 3.5.2: Contact Page Rebuild
 *
 * Features:
 * - Contact form with validation
 * - Contact info cards
 * - Map placeholder (optional)
 * - GDPR-compliant form
 */

'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { getContactContent, getSiteContent } from '@/lib/data'
import HeroSection from '@/components/custom/HeroSection'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/textarea'

export default function ContactPage() {
  const contact = getContactContent()
  const site = getSiteContent()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    privacy: false,
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setStatus('error')
      setErrorMessage('Bitte fülle alle Pflichtfelder aus.')
      return
    }

    if (!formData.privacy) {
      setStatus('error')
      setErrorMessage('Bitte stimme der Datenschutzerklarung zu.')
      return
    }

    try {
      // TODO: Implement actual form submission API
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      setStatus('success')
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        privacy: false,
      })

      // Reset to idle after 5 seconds
      setTimeout(() => setStatus('idle'), 5000)
    } catch (error) {
      setStatus('error')
      setErrorMessage('Etwas ist schiefgelaufen. Bitte versuche es spater erneut.')
    }
  }

  return (
    <div className="min-h-screen bg-[var(--pepe-black)]">
      {/* Hero Section */}
      <HeroSection
        title={contact.title}
        subtitle={contact.subtitle}
        size="sm"
      />

      <div className="stage-container py-20 md:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 max-w-6xl mx-auto">
          {/* Contact Info Cards */}
          <div className="space-y-6">
            {/* Address Card */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-xl p-6 hover:border-[var(--pepe-gold)] transition-colors duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-[var(--pepe-gold)]/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-[var(--pepe-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--pepe-white)] mb-2">
                    {contact.info.address.title}
                  </h3>
                  <p className="text-[var(--pepe-t80)] whitespace-pre-line">
                    {contact.info.address.content}
                  </p>
                </div>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-xl p-6 hover:border-[var(--pepe-gold)] transition-colors duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-[var(--pepe-gold)]/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-[var(--pepe-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--pepe-white)] mb-2">
                    {contact.info.email.title}
                  </h3>
                  <a
                    href={`mailto:${contact.info.email.content}`}
                    className="text-[var(--pepe-gold)] hover:underline"
                  >
                    {contact.info.email.content}
                  </a>
                </div>
              </div>
            </div>

            {/* Phone Card */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-xl p-6 hover:border-[var(--pepe-gold)] transition-colors duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-[var(--pepe-gold)]/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-[var(--pepe-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--pepe-white)] mb-2">
                    {contact.info.phone.title}
                  </h3>
                  <a
                    href={`tel:${contact.info.phone.content.replace(/\s/g, '')}`}
                    className="text-[var(--pepe-t80)] hover:text-[var(--pepe-gold)] transition-colors"
                  >
                    {contact.info.phone.content}
                  </a>
                </div>
              </div>
            </div>

            {/* Hours Card */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-xl p-6 hover:border-[var(--pepe-gold)] transition-colors duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-[var(--pepe-gold)]/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-[var(--pepe-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--pepe-white)] mb-2">
                    {contact.info.hours.title}
                  </h3>
                  <p className="text-[var(--pepe-t80)] whitespace-pre-line">
                    {contact.info.hours.content}
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-xl p-6">
              <h3 className="text-lg font-bold text-[var(--pepe-white)] mb-4">
                Folge uns
              </h3>
              <div className="flex gap-4">
                {site.social.instagram && (
                  <a
                    href={site.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-lg bg-[var(--pepe-surface)] flex items-center justify-center hover:bg-[var(--pepe-gold)]/20 transition-colors"
                    aria-label="Instagram"
                  >
                    <svg className="w-5 h-5 text-[var(--pepe-t80)]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                )}
                {site.social.facebook && (
                  <a
                    href={site.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-lg bg-[var(--pepe-surface)] flex items-center justify-center hover:bg-[var(--pepe-gold)]/20 transition-colors"
                    aria-label="Facebook"
                  >
                    <svg className="w-5 h-5 text-[var(--pepe-t80)]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                )}
                {site.social.youtube && (
                  <a
                    href={site.social.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-lg bg-[var(--pepe-surface)] flex items-center justify-center hover:bg-[var(--pepe-gold)]/20 transition-colors"
                    aria-label="YouTube"
                  >
                    <svg className="w-5 h-5 text-[var(--pepe-t80)]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-xl p-8">
            <h2 className="text-2xl font-bold text-[var(--pepe-white)] mb-6">
              {contact.form.title}
            </h2>

            {status === 'success' ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--pepe-success)]/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-[var(--pepe-success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[var(--pepe-white)] mb-2">
                  Nachricht gesendet!
                </h3>
                <p className="text-[var(--pepe-t64)]">
                  Vielen Dank fur deine Nachricht. Wir melden uns bald bei dir.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-[var(--pepe-t80)] mb-2"
                  >
                    {contact.form.fields.name} *
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    disabled={status === 'loading'}
                    placeholder="Dein Name"
                    className="w-full"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[var(--pepe-t80)] mb-2"
                  >
                    {contact.form.fields.email} *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={status === 'loading'}
                    placeholder="deine@email.de"
                    className="w-full"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-[var(--pepe-t80)] mb-2"
                  >
                    {contact.form.fields.subject}
                  </label>
                  <Input
                    id="subject"
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    disabled={status === 'loading'}
                    placeholder="Worum geht es?"
                    className="w-full"
                  />
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-[var(--pepe-t80)] mb-2"
                  >
                    {contact.form.fields.message} *
                  </label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    disabled={status === 'loading'}
                    placeholder="Deine Nachricht..."
                    rows={6}
                    className="w-full"
                  />
                </div>

                {/* Privacy Checkbox (GDPR) */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="privacy"
                    checked={formData.privacy}
                    onChange={(e) => setFormData({ ...formData, privacy: e.target.checked })}
                    required
                    disabled={status === 'loading'}
                    className="mt-1 w-4 h-4 rounded border-[var(--pepe-line)] bg-[var(--pepe-surface)] text-[var(--pepe-gold)] focus:ring-[var(--pepe-gold)] focus:ring-offset-0"
                  />
                  <label htmlFor="privacy" className="text-sm text-[var(--pepe-t64)]">
                    {contact.form.fields.privacy} *
                  </label>
                </div>

                {/* Error Message */}
                {status === 'error' && errorMessage && (
                  <div className="p-4 bg-[var(--pepe-error)]/10 border border-[var(--pepe-error)]/30 rounded-lg">
                    <p className="text-[var(--pepe-error)] text-sm">{errorMessage}</p>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? 'Wird gesendet...' : contact.form.submit}
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Map Section (Optional) */}
        <section className="mt-20">
          <h2 className="text-2xl font-bold text-[var(--pepe-white)] mb-6 text-center">
            So findest du uns
          </h2>
          <div className="relative h-80 rounded-xl overflow-hidden bg-[var(--pepe-surface)] border border-[var(--pepe-line)]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-[var(--pepe-t48)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <p className="text-[var(--pepe-t64)]">
                  Karte wird geladen...
                </p>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(site.address.street + ', ' + site.address.city)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block"
                >
                  <Button variant="secondary" size="sm">
                    In Google Maps öffnen
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
