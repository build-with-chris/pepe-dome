'use client'

/**
 * ContactPageClient — Kontaktseite mit GDPR-Formular (Client Component).
 * Bekommt dict + lang per Props. Adresse/Mail/WhatsApp-Werte kommen aus
 * getSiteContent() und werden vom Server-Wrapper mitgegeben.
 *
 * Kein direkter Anruf-Kanal: Besucher:innen schildern ihr Anliegen und
 * wählen, wie sie kontaktiert werden möchten (Rückruf / WhatsApp / E-Mail).
 * Die Anfrage geht per /api/contact raus; zusätzlich gibt es nach dem
 * Absenden einen WhatsApp-Deep-Link, damit die Anfrage direkt auf dem
 * Handy des Teams landet.
 */

import { useState, type FormEvent } from 'react'
import HeroSection from '@/components/custom/HeroSection'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/textarea'
import type { Dictionary } from '@/i18n/get-dictionary'
import type { Locale } from '@/i18n/config'

type Social = { instagram?: string; facebook?: string; youtube?: string }
type Channel = 'callback' | 'whatsapp' | 'email'

export default function ContactPageClient({
  dict,
  email,
  whatsapp,
  social,
}: {
  lang: Locale
  dict: Dictionary
  email: string
  whatsapp: string
  social: Social
}) {
  const t = dict.contact
  const waNumber = whatsapp.replace(/\D/g, '')

  const [formData, setFormData] = useState({
    name: '',
    message: '',
    channel: 'callback' as Channel,
    phone: '',
    email: '',
    reachability: '',
    privacy: false,
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [whatsappLink, setWhatsappLink] = useState('')

  const needsPhone = formData.channel === 'callback' || formData.channel === 'whatsapp'

  const channelLabels: Record<Channel, string> = {
    callback: t.form.fields.channelCallback,
    whatsapp: t.form.fields.channelWhatsapp,
    email: t.form.fields.channelEmail,
  }

  const buildWhatsappLink = () => {
    const parts = [
      formData.message.trim(),
      '',
      `${t.form.fields.name}: ${formData.name.trim()}`,
      `${t.form.fields.channel} ${channelLabels[formData.channel]}`,
      ...(formData.phone.trim() ? [`${t.form.fields.phone}: ${formData.phone.trim()}`] : []),
      ...(formData.email.trim() ? [`${t.form.fields.email}: ${formData.email.trim()}`] : []),
      ...(formData.reachability.trim() ? [`${t.form.fields.reachability.replace(/\s*\(.*\)$/, '')}: ${formData.reachability.trim()}`] : []),
    ]
    return `https://wa.me/${waNumber}?text=${encodeURIComponent(parts.join('\n'))}`
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    if (!formData.name.trim() || !formData.message.trim()) {
      setStatus('error')
      setErrorMessage(t.form.errors.missing)
      return
    }
    if (needsPhone && !formData.phone.trim()) {
      setStatus('error')
      setErrorMessage(t.form.errors.phone)
      return
    }
    if (formData.channel === 'email' && !formData.email.trim()) {
      setStatus('error')
      setErrorMessage(t.form.errors.email)
      return
    }
    if (!formData.privacy) {
      setStatus('error')
      setErrorMessage(t.form.errors.privacy)
      return
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          message: formData.message.trim(),
          channel: formData.channel,
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          reachability: formData.reachability.trim(),
          gdprConsent: formData.privacy,
        }),
      })
      const json = await res.json().catch(() => null)
      if (!res.ok || json?.error) {
        setStatus('error')
        setErrorMessage(json?.error?.message || t.form.errors.generic)
        return
      }
      setWhatsappLink(buildWhatsappLink())
      setStatus('success')
      setFormData({ name: '', message: '', channel: 'callback', phone: '', email: '', reachability: '', privacy: false })
    } catch {
      setStatus('error')
      setErrorMessage(t.form.errors.generic)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--pepe-black)]">
      <HeroSection title={t.hero.title} subtitle={t.hero.subtitle} size="sm" />

      <div className="stage-container py-20 md:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 max-w-6xl mx-auto">
          {/* Info-Cards */}
          <div className="space-y-6">
            {/* Callback */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-xl p-6 hover:border-[var(--pepe-gold)] transition-colors duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-[var(--pepe-gold)]/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-[var(--pepe-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 3h6m0 0v6m0-6l-7 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--pepe-white)] mb-2">{t.cards.callback.title}</h3>
                  <p className="text-[var(--pepe-t80)]">{t.cards.callback.content}</p>
                </div>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-xl p-6 hover:border-[var(--pepe-gold)] transition-colors duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-[var(--pepe-gold)]/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-[var(--pepe-gold)]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--pepe-white)] mb-2">{t.cards.whatsapp.title}</h3>
                  <p className="text-[var(--pepe-t80)] mb-3">{t.cards.whatsapp.content}</p>
                  <a
                    href={`https://wa.me/${waNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--pepe-gold)] hover:underline font-medium"
                  >
                    {t.cards.whatsapp.cta} →
                  </a>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-xl p-6 hover:border-[var(--pepe-gold)] transition-colors duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-[var(--pepe-gold)]/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-[var(--pepe-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--pepe-white)] mb-2">{t.cards.email.title}</h3>
                  <a href={`mailto:${email}`} className="text-[var(--pepe-gold)] hover:underline">{email}</a>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-xl p-6 hover:border-[var(--pepe-gold)] transition-colors duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-[var(--pepe-gold)]/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-[var(--pepe-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--pepe-white)] mb-2">{t.cards.address.title}</h3>
                  <p className="text-[var(--pepe-t80)] whitespace-pre-line">{t.cards.address.content}</p>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-xl p-6 hover:border-[var(--pepe-gold)] transition-colors duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-[var(--pepe-gold)]/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-[var(--pepe-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--pepe-white)] mb-2">{t.cards.hours.title}</h3>
                  <p className="text-[var(--pepe-t80)] whitespace-pre-line">{t.cards.hours.content}</p>
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-xl p-6">
              <h3 className="text-lg font-bold text-[var(--pepe-white)] mb-4">{t.cards.follow}</h3>
              <div className="flex gap-4">
                {social.instagram && (
                  <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-lg bg-[var(--pepe-surface)] flex items-center justify-center hover:bg-[var(--pepe-gold)]/20 transition-colors" aria-label="Instagram">
                    <svg className="w-5 h-5 text-[var(--pepe-t80)]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                )}
                {social.facebook && (
                  <a href={social.facebook} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-lg bg-[var(--pepe-surface)] flex items-center justify-center hover:bg-[var(--pepe-gold)]/20 transition-colors" aria-label="Facebook">
                    <svg className="w-5 h-5 text-[var(--pepe-t80)]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                )}
                {social.youtube && (
                  <a href={social.youtube} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-lg bg-[var(--pepe-surface)] flex items-center justify-center hover:bg-[var(--pepe-gold)]/20 transition-colors" aria-label="YouTube">
                    <svg className="w-5 h-5 text-[var(--pepe-t80)]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-xl p-8">
            <h2 className="text-2xl font-bold text-[var(--pepe-white)] mb-3">{t.form.title}</h2>
            <p className="text-[var(--pepe-t64)] mb-6">{t.form.intro}</p>

            {status === 'success' ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--pepe-success)]/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-[var(--pepe-success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[var(--pepe-white)] mb-2">{t.form.successTitle}</h3>
                <p className="text-[var(--pepe-t64)] mb-8">{t.form.successText}</p>
                {whatsappLink && (
                  <div className="border-t border-[var(--pepe-line)] pt-8">
                    <p className="text-[var(--pepe-t64)] mb-4">{t.form.successWhatsapp}</p>
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--pepe-gold)]/10 border border-[var(--pepe-gold)] text-[var(--pepe-gold)] font-medium hover:bg-[var(--pepe-gold)]/20 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      {t.form.whatsappButton}
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[var(--pepe-t80)] mb-2">
                    {t.form.fields.name} *
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    disabled={status === 'loading'}
                    placeholder={t.form.fields.namePlaceholder}
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[var(--pepe-t80)] mb-2">
                    {t.form.fields.message} *
                  </label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    disabled={status === 'loading'}
                    placeholder={t.form.fields.messagePlaceholder}
                    rows={5}
                    className="w-full"
                  />
                </div>

                <fieldset>
                  <legend className="block text-sm font-medium text-[var(--pepe-t80)] mb-2">
                    {t.form.fields.channel} *
                  </legend>
                  <div className="grid grid-cols-3 gap-2">
                    {(['callback', 'whatsapp', 'email'] as Channel[]).map((ch) => (
                      <button
                        key={ch}
                        type="button"
                        disabled={status === 'loading'}
                        onClick={() => setFormData({ ...formData, channel: ch })}
                        aria-pressed={formData.channel === ch}
                        className={`px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                          formData.channel === ch
                            ? 'border-[var(--pepe-gold)] bg-[var(--pepe-gold)]/10 text-[var(--pepe-gold)]'
                            : 'border-[var(--pepe-line)] bg-[var(--pepe-surface)] text-[var(--pepe-t80)] hover:border-[var(--pepe-gold)]/50'
                        }`}
                      >
                        {channelLabels[ch]}
                      </button>
                    ))}
                  </div>
                </fieldset>

                {needsPhone && (
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-[var(--pepe-t80)] mb-2">
                      {t.form.fields.phone} *
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      disabled={status === 'loading'}
                      placeholder={t.form.fields.phonePlaceholder}
                      className="w-full"
                    />
                  </div>
                )}

                {formData.channel === 'email' && (
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[var(--pepe-t80)] mb-2">
                      {t.form.fields.email} *
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      disabled={status === 'loading'}
                      placeholder={t.form.fields.emailPlaceholder}
                      className="w-full"
                    />
                  </div>
                )}

                {needsPhone && (
                  <div>
                    <label htmlFor="reachability" className="block text-sm font-medium text-[var(--pepe-t80)] mb-2">
                      {t.form.fields.reachability}
                    </label>
                    <Input
                      id="reachability"
                      type="text"
                      value={formData.reachability}
                      onChange={(e) => setFormData({ ...formData, reachability: e.target.value })}
                      disabled={status === 'loading'}
                      placeholder={t.form.fields.reachabilityPlaceholder}
                      className="w-full"
                    />
                  </div>
                )}

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
                    {t.form.fields.privacy} *
                  </label>
                </div>

                {status === 'error' && errorMessage && (
                  <div className="p-4 bg-[var(--pepe-error)]/10 border border-[var(--pepe-error)]/30 rounded-lg">
                    <p className="text-[var(--pepe-error)] text-sm">{errorMessage}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? t.form.submitting : t.form.submit}
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Map */}
        <section className="mt-32 pt-16 border-t border-[var(--pepe-line)]">
          <h2 className="text-2xl font-bold text-[var(--pepe-white)] mb-10 text-center">
            {t.map.title}
          </h2>
          <div className="relative h-96 rounded-2xl overflow-hidden border border-[var(--pepe-line)] shadow-2xl group">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2664.116634887349!2d11.640768!3d48.1119726!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479ddfe1623e7b83%3A0x8f776b2413dcab9e!2sPepe%20Dome%20im%20Theatron%20im%20Ostpark!5e0!3m2!1sde!2sde!4v1738148400000"
              width="100%"
              height="100%"
              style={{ border: 0, opacity: 0.7 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale invert contrast-125 transition-all duration-700 group-hover:grayscale-0 group-hover:invert-0 group-hover:opacity-100"
            />
            <div className="absolute inset-0 pointer-events-none border-[var(--pepe-gold)]/20 border-2 rounded-2xl"></div>
          </div>
          <div className="text-center mt-8">
            <a
              href="https://www.google.com/maps/place/Pepe+Dome+im+Theatron+im+Ostpark/@48.1119726,11.640768,17z/data=!3m1!4b1!4m6!3m5!1s0x479ddfe1623e7b83:0x8f776b2413dcab9e!8m2!3d48.1119726!4d11.6433429"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[var(--pepe-gold)] hover:underline font-medium"
            >
              <span>{t.map.route}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
