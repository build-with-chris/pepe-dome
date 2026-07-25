'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ROLES, getRoleDisplayName, type UserRole } from '@/lib/roles'

/**
 * Die eigentliche Entscheidung.
 *
 * Bewusst per POST statt über Links: Ein GET-Link, der Rechte vergibt, wird von
 * Mailprogrammen und Sicherheits-Scannern beim bloßen Öffnen der Mail ausgelöst.
 */

type AssignableRole = Exclude<UserRole, 'none'>

const ROLE_OPTIONS: Array<{ role: AssignableRole; description: string }> = [
  {
    role: ROLES.VIEWER,
    description: 'Darf Dashboard und Inhalte ansehen, aber nichts ändern.',
  },
  {
    role: ROLES.EDITOR,
    description: 'Darf Events, Artikel und Newsletter anlegen und bearbeiten, aber nichts löschen und nichts versenden.',
  },
  {
    role: ROLES.SUPER_ADMIN,
    description: 'Vollzugriff inklusive Abonnenten, Versand, Löschen und Freigaben.',
  },
]

interface FreigabeActionsProps {
  token: string
  requesterEmail: string
}

export default function FreigabeActions({ token, requesterEmail }: FreigabeActionsProps) {
  const router = useRouter()
  const [pending, setPending] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState<string | null>(null)

  async function decide(decision: 'approve' | 'reject', role?: AssignableRole) {
    setPending(role ?? decision)
    setError(null)

    try {
      const response = await fetch('/api/admin/access-requests/decide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, decision, role }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || data.error || 'Die Entscheidung konnte nicht gespeichert werden.')
        return
      }

      setDone(
        decision === 'approve'
          ? `${requesterEmail} ist jetzt ${getRoleDisplayName(role as UserRole)} und kommt ab sofort ins Panel.`
          : `${requesterEmail} wurde abgelehnt und bleibt ohne Rechte.`
      )
      router.refresh()
    } catch {
      setError('Verbindung fehlgeschlagen. Bitte noch einmal versuchen.')
    } finally {
      setPending(null)
    }
  }

  if (done) {
    return (
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-200 leading-relaxed">
        {done}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-200">
          {error}
        </div>
      )}

      {ROLE_OPTIONS.map((option) => (
        <button
          key={option.role}
          onClick={() => decide('approve', option.role)}
          disabled={pending !== null}
          className="w-full text-left rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:border-[#016dca]/40 px-5 py-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="block text-sm font-semibold text-white mb-1">
            {pending === option.role
              ? 'Wird freigegeben ...'
              : `Als ${getRoleDisplayName(option.role)} freigeben`}
          </span>
          <span className="block text-[13px] text-white/50 leading-relaxed">
            {option.description}
          </span>
        </button>
      ))}

      <button
        onClick={() => decide('reject')}
        disabled={pending !== null}
        className="w-full rounded-xl border border-red-500/25 text-red-300 hover:bg-red-500/10 px-5 py-3 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {pending === 'reject' ? 'Wird abgelehnt ...' : 'Ablehnen'}
      </button>
    </div>
  )
}
