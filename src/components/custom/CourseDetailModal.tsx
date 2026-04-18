'use client'

/**
 * CourseDetailModal
 * Zeigt die Details eines Kurses und ein Anmeldeformular.
 * Daten werden an /api/course-interest gesendet und in der Datenbank gespeichert.
 */

import { useEffect, useState, type FormEvent } from 'react'
import type { Kurs } from './CourseScheduleGrid'

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

export default function CourseDetailModal({
  kurs,
  onClose,
}: {
  kurs: Kurs | null
  onClose: () => void
}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [gdprConsent, setGdprConsent] = useState(false)
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // ESC schließt das Modal
  useEffect(() => {
    if (!kurs) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)

    // Body-Scroll sperren solange Modal offen ist
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = originalOverflow
    }
  }, [kurs, onClose])

  // Reset State, wenn Modal neu geöffnet wird
  useEffect(() => {
    if (kurs) {
      setSubmitState('idle')
      setErrorMessage(null)
    }
  }, [kurs])

  if (!kurs) return null

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!kurs) return

    setSubmitState('submitting')
    setErrorMessage(null)

    try {
      const res = await fetch('/api/course-interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          courseSlug: kurs.slug,
          courseTitle: kurs.title,
          gdprConsent,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error?.message || 'Anmeldung fehlgeschlagen')
      }

      setSubmitState('success')
      // Formular zurücksetzen
      setName('')
      setEmail('')
      setPhone('')
      setGdprConsent(false)
    } catch (err) {
      setSubmitState('error')
      setErrorMessage(err instanceof Error ? err.message : 'Unbekannter Fehler')
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="course-modal-title"
      onClick={onClose}
    >
      <div
        className="relative bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Schließen-Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-[var(--pepe-surface)] hover:bg-[var(--pepe-line)] flex items-center justify-center text-[var(--pepe-white)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--pepe-gold)]"
          aria-label="Schließen"
        >
          <span className="text-xl leading-none" aria-hidden="true">×</span>
        </button>

        {/* Kurs-Details */}
        <div className="p-6 md:p-8 border-b border-[var(--pepe-line)]">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <span className="text-[var(--pepe-gold)] text-xs font-semibold uppercase tracking-widest">
              {kurs.day} · {kurs.time}
            </span>
            <span className="text-[var(--pepe-t48)] text-xs">mit {kurs.trainer}</span>
          </div>
          <h2
            id="course-modal-title"
            className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-4"
          >
            {kurs.title}
          </h2>
          <p className="text-[var(--pepe-t80)] leading-relaxed mb-6">{kurs.description}</p>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <p className="text-[var(--pepe-gold)] text-xs font-semibold uppercase tracking-widest mb-2">
                Inhalte
              </p>
              <ul className="space-y-1.5 text-[var(--pepe-t80)] text-sm">
                {kurs.inhalte.map((inhalt) => (
                  <li key={inhalt} className="flex items-start gap-2">
                    <span className="text-[var(--pepe-gold)] mt-0.5">·</span>
                    <span>{inhalt}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[var(--pepe-gold)] text-xs font-semibold uppercase tracking-widest mb-2">
                Für wen
              </p>
              <p className="text-[var(--pepe-t80)] text-sm leading-relaxed">{kurs.fuerWen}</p>
            </div>
          </div>
        </div>

        {/* Anmeldeformular */}
        <div className="p-6 md:p-8">
          <h3 className="text-lg font-bold text-[var(--pepe-white)] mb-2">
            Auf dem Laufenden bleiben
          </h3>
          <p className="text-[var(--pepe-t64)] text-sm mb-6">
            Trag dich ein und wir melden uns, sobald es losgeht oder sich am Kurs etwas ändert.
          </p>

          {submitState === 'success' ? (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-5 text-emerald-200">
              <p className="font-semibold mb-1">Danke! ✨</p>
              <p className="text-sm">
                Wir haben dich für <strong>{kurs.title}</strong> vorgemerkt und melden uns bei dir.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="ci-name"
                  className="block text-[var(--pepe-t80)] text-sm font-medium mb-1.5"
                >
                  Name <span className="text-[var(--pepe-gold)]">*</span>
                </label>
                <input
                  id="ci-name"
                  type="text"
                  required
                  minLength={2}
                  maxLength={100}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[var(--pepe-surface)] border border-[var(--pepe-line)] rounded-lg text-[var(--pepe-white)] focus:outline-none focus:border-[var(--pepe-gold)] transition-colors"
                  autoComplete="name"
                />
              </div>

              <div>
                <label
                  htmlFor="ci-email"
                  className="block text-[var(--pepe-t80)] text-sm font-medium mb-1.5"
                >
                  E-Mail <span className="text-[var(--pepe-gold)]">*</span>
                </label>
                <input
                  id="ci-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[var(--pepe-surface)] border border-[var(--pepe-line)] rounded-lg text-[var(--pepe-white)] focus:outline-none focus:border-[var(--pepe-gold)] transition-colors"
                  autoComplete="email"
                />
              </div>

              <div>
                <label
                  htmlFor="ci-phone"
                  className="block text-[var(--pepe-t80)] text-sm font-medium mb-1.5"
                >
                  Handynummer <span className="text-[var(--pepe-t48)] font-normal">(optional)</span>
                </label>
                <input
                  id="ci-phone"
                  type="tel"
                  maxLength={30}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[var(--pepe-surface)] border border-[var(--pepe-line)] rounded-lg text-[var(--pepe-white)] focus:outline-none focus:border-[var(--pepe-gold)] transition-colors"
                  autoComplete="tel"
                  placeholder="z.B. +49 170 1234567"
                />
              </div>

              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  required
                  checked={gdprConsent}
                  onChange={(e) => setGdprConsent(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-[var(--pepe-line)] bg-[var(--pepe-surface)] accent-[var(--pepe-gold)] focus:ring-2 focus:ring-[var(--pepe-gold)] cursor-pointer"
                />
                <span className="text-[var(--pepe-t64)] text-xs leading-relaxed">
                  Ich willige ein, dass meine Angaben zur Kontaktaufnahme und Information über
                  diesen Kurs gespeichert werden. Die Einwilligung kann jederzeit per Mail an{' '}
                  <a
                    href="mailto:info@pepe-dome.de"
                    className="text-[var(--pepe-gold)] underline hover:no-underline"
                  >
                    info@pepe-dome.de
                  </a>{' '}
                  widerrufen werden. <span className="text-[var(--pepe-gold)]">*</span>
                </span>
              </label>

              {submitState === 'error' && errorMessage && (
                <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-red-200 text-sm">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={submitState === 'submitting'}
                className="w-full py-3 bg-[var(--pepe-gold)] text-[var(--pepe-black)] rounded-lg font-semibold hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--pepe-gold)] focus:ring-offset-2 focus:ring-offset-[var(--pepe-ink)]"
              >
                {submitState === 'submitting' ? 'Wird gesendet…' : 'Eintragen'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
