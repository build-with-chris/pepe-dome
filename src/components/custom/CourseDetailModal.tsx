'use client'

/**
 * CourseDetailModal
 * Zeigt die Details eines Kurses und ein Anmeldeformular.
 * Daten werden an /api/course-interest gesendet und in der Datenbank gespeichert.
 */

import { useEffect, useState, type FormEvent } from 'react'
import type { Kurs } from './CourseScheduleGrid'

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'
type CopyState = 'idle' | 'copied'

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
  const [copyState, setCopyState] = useState<CopyState>('idle')

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
      setCopyState('idle')
    }
  }, [kurs])

  if (!kurs) return null

  // Shareable URL für diesen Kurs (nutzt window.location.origin)
  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/training?kurs=${kurs.slug}#kursprogramm`
      : ''

  async function handleCopyLink() {
    if (!kurs) return
    const url = `${window.location.origin}/training?kurs=${kurs.slug}#kursprogramm`
    try {
      await navigator.clipboard.writeText(url)
      setCopyState('copied')
      setTimeout(() => setCopyState('idle'), 2000)
    } catch {
      // Fallback: Prompt mit der URL zum manuellen Kopieren
      window.prompt('URL zum Kopieren:', url)
    }
  }

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
        {/* Top-Right Buttons: Link teilen + Schließen */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyLink}
            className="h-10 px-3.5 rounded-full bg-[var(--pepe-surface)] hover:bg-[var(--pepe-line)] flex items-center gap-2 text-[var(--pepe-t80)] hover:text-[var(--pepe-white)] text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--pepe-gold)]"
            aria-label="Link zu diesem Kurs kopieren"
            title={shareUrl}
          >
            {copyState === 'copied' ? (
              <>
                <span aria-hidden="true">✓</span>
                <span>Kopiert</span>
              </>
            ) : (
              <>
                <svg
                  width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  strokeLinejoin="round" aria-hidden="true"
                >
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                <span>Link teilen</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-[var(--pepe-surface)] hover:bg-[var(--pepe-line)] flex items-center justify-center text-[var(--pepe-white)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--pepe-gold)]"
            aria-label="Schließen"
          >
            <span className="text-xl leading-none" aria-hidden="true">×</span>
          </button>
        </div>

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

          {/* Termine — wenn der Kurs konkrete Datums-Slots hat (z.B. Sonntags-Flow-Arts) */}
          {kurs.termine && kurs.termine.length > 0 && (
            <div className="mt-6 pt-6 border-t border-[var(--pepe-line)]">
              <p className="text-[var(--pepe-gold)] text-xs font-semibold uppercase tracking-widest mb-3">
                {kurs.termineTitel ?? 'Termine'}
              </p>
              <ul className="space-y-2">
                {kurs.termine.map((t, i) =>
                  t.highlight ? (
                    <li key={i}>
                      <div
                        className="rounded-lg p-3"
                        style={{
                          background:
                            'linear-gradient(135deg, rgba(196,167,103,0.18), rgba(196,167,103,0.06))',
                          border: '1px solid rgba(196,167,103,0.45)',
                        }}
                      >
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-[var(--pepe-gold)] font-bold tabular-nums">
                            {t.date}
                          </span>
                          {t.badge && (
                            <span
                              className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest"
                              style={{ backgroundColor: 'var(--pepe-gold)', color: 'var(--pepe-black)' }}
                            >
                              {t.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[var(--pepe-white)] font-semibold leading-snug text-sm">
                          {t.title}
                          {t.trainer && (
                            <span className="text-[var(--pepe-t64)] font-normal"> · {t.trainer}</span>
                          )}
                        </p>
                        {t.sub && (
                          <p className="text-[var(--pepe-gold)] text-xs font-medium mt-1 leading-snug">
                            {t.sub}
                          </p>
                        )}
                      </div>
                    </li>
                  ) : (
                    <li key={i} className="flex items-baseline gap-3 text-sm py-1">
                      <span className="text-[var(--pepe-t80)] font-bold tabular-nums whitespace-nowrap min-w-[3.5rem]">
                        {t.date}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[var(--pepe-white)] leading-snug">
                          {t.title}
                          {t.trainer && (
                            <span className="text-[var(--pepe-t48)]"> · {t.trainer}</span>
                          )}
                        </p>
                        {t.sub && (
                          <p className="text-[var(--pepe-t48)] text-xs mt-0.5 italic leading-snug">
                            {t.sub}
                          </p>
                        )}
                      </div>
                    </li>
                  )
                )}
              </ul>
            </div>
          )}
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
