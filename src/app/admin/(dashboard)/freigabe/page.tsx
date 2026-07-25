import Link from 'next/link'
import { getUserRole } from '@/lib/roles.server'
import { ROLES } from '@/lib/roles'
import { findPendingRequestByToken } from '@/lib/admin-access'
import FreigabeActions from './FreigabeActions'

/**
 * Freigabe einer Zugriffsanfrage.
 *
 * Zwei Schlösser: das Token aus der Mail und ein Login als Super Admin. Das
 * Token allein würde reichen, wenn Mailpostfächer sicher wären — sind sie
 * nicht. Wer die Mail abfängt, kommt hier ohne passenden Login nicht weiter.
 *
 * Das Gate der Route-Group hat davor schon geprüft, dass überhaupt eine Rolle
 * vorliegt; hier kommt die Einschränkung auf Super Admin dazu.
 */

export const dynamic = 'force-dynamic'

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-white mb-6">Zugriffsanfrage</h1>
      {children}
      <div className="mt-8">
        <Link href="/admin" className="text-sm text-white/40 hover:text-white/70 transition-colors">
          &larr; Zurück zum Dashboard
        </Link>
      </div>
    </div>
  )
}

function Notice({ tone, children }: { tone: 'error' | 'muted'; children: React.ReactNode }) {
  const styles =
    tone === 'error'
      ? 'border-red-500/30 bg-red-500/10 text-red-200'
      : 'border-white/10 bg-white/[0.03] text-white/70'

  return <div className={`rounded-xl border px-5 py-4 text-sm leading-relaxed ${styles}`}>{children}</div>
}

export default async function FreigabePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const role = await getUserRole()

  if (role !== ROLES.SUPER_ADMIN) {
    return (
      <Frame>
        <Notice tone="error">
          Nur ein Super Admin kann Zugriffe freigeben. Deine Rolle reicht dafür nicht.
        </Notice>
      </Frame>
    )
  }

  const { token } = await searchParams

  if (!token) {
    return (
      <Frame>
        <Notice tone="muted">
          Diese Seite wird über den Link in der Freigabe-Mail geöffnet. Ohne Token gibt es
          nichts zu entscheiden.
        </Notice>
      </Frame>
    )
  }

  const request = await findPendingRequestByToken(token)

  if (!request) {
    return (
      <Frame>
        <Notice tone="muted">
          Diese Anfrage ist unbekannt, wurde bereits entschieden oder der Link ist abgelaufen.
          Wer weiterhin Zugang braucht, meldet sich einfach erneut an, dann kommt eine frische
          Anfrage.
        </Notice>
      </Frame>
    )
  }

  return (
    <Frame>
      <p className="text-white/60 text-sm leading-relaxed mb-6">
        Dieser Account wartet auf eine Freigabe. Ohne deine Entscheidung sieht er nichts und
        kann nichts ändern.
      </p>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 mb-8">
        {request.name && (
          <p className="text-base font-medium text-white/90 mb-1">{request.name}</p>
        )}
        <p className="text-sm text-white/60 break-all">{request.email}</p>
        <p className="text-[11px] text-white/35 mt-3">
          Angefragt am{' '}
          {request.createdAt.toLocaleDateString('de-DE', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })}
        </p>
      </div>

      <FreigabeActions token={token} requesterEmail={request.email} />
    </Frame>
  )
}
