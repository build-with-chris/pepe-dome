import Link from 'next/link'
import { getUserRole } from '@/lib/roles.server'
import { ROLES, getRoleDisplayName, type UserRole } from '@/lib/roles'
import { findPendingRequestByToken, listAccessRequests } from '@/lib/admin-access'
import FreigabeActions from './FreigabeActions'

/**
 * Freigabe von Zugriffsanfragen.
 *
 * Zwei Ansichten in einer Route:
 *
 *   mit ?token=…   die einzelne Anfrage aus der Freigabe-Mail
 *   ohne Token     die Übersicht aller wartenden Anfragen
 *
 * Die Übersicht kam dazu, weil der Mail-Weg allein zu dünn war: Wer die Mail
 * nicht mehr fand oder sie im Spam lag, kam an eine wartende Anfrage nicht mehr
 * heran. Die Seite sagte dann nur, es gebe nichts zu entscheiden, obwohl jemand
 * seit Tagen wartete.
 *
 * Der Mail-Weg bleibt unverändert, damit verschickte Links weiter funktionieren.
 *
 * Zwei Schlösser: das Token und ein Login als Super Admin. Das Token allein
 * würde reichen, wenn Mailpostfächer sicher wären — sind sie nicht. Wer die Mail
 * abfängt, kommt hier ohne passenden Login nicht weiter.
 *
 * Das Gate der Route-Group hat davor schon geprüft, dass überhaupt eine Rolle
 * vorliegt; hier kommt die Einschränkung auf Super Admin dazu.
 */

export const dynamic = 'force-dynamic'

function Frame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-white mb-6">{title}</h1>
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

function datum(wert: Date): string {
  return wert.toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })
}

/** Kopfzeile einer Anfrage: Name, Adresse, Datum. */
function Antragsteller({
  name,
  email,
  angefragtAm,
}: {
  name: string | null
  email: string
  angefragtAm: Date
}) {
  return (
    <>
      {name && <p className="text-base font-medium text-white/90 mb-1">{name}</p>}
      <p className="text-sm text-white/60 break-all">{email}</p>
      <p className="text-[11px] text-white/35 mt-3">Angefragt am {datum(angefragtAm)}</p>
    </>
  )
}

export default async function FreigabePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const role = await getUserRole()

  if (role !== ROLES.SUPER_ADMIN) {
    return (
      <Frame title="Zugriffsanfrage">
        <Notice tone="error">
          Nur ein Super Admin kann Zugriffe freigeben. Deine Rolle reicht dafür nicht.
        </Notice>
      </Frame>
    )
  }

  const { token } = await searchParams

  // ── Einzelansicht aus der Mail ────────────────────────────────────────────
  if (token) {
    const request = await findPendingRequestByToken(token)

    if (!request) {
      return (
        <Frame title="Zugriffsanfrage">
          <Notice tone="muted">
            Diese Anfrage ist unbekannt, wurde bereits entschieden oder der Link ist abgelaufen.
            In der{' '}
            <Link href="/admin/freigabe" className="text-[#2a92f0] hover:underline">
              Übersicht
            </Link>{' '}
            siehst du, was gerade wartet.
          </Notice>
        </Frame>
      )
    }

    return (
      <Frame title="Zugriffsanfrage">
        <p className="text-white/60 text-sm leading-relaxed mb-6">
          Dieser Account wartet auf eine Freigabe. Ohne deine Entscheidung sieht er nichts und
          kann nichts ändern.
        </p>

        <div className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 mb-8">
          <Antragsteller
            name={request.name}
            email={request.email}
            angefragtAm={request.createdAt}
          />
        </div>

        <FreigabeActions token={token} requesterEmail={request.email} />
      </Frame>
    )
  }

  // ── Übersicht ─────────────────────────────────────────────────────────────
  const { offen, entschieden } = await listAccessRequests()
  const jetzt = new Date()

  return (
    <Frame title="Freigaben">
      {offen.length === 0 ? (
        <Notice tone="muted">
          Gerade wartet niemand auf eine Freigabe. Wer sich neu anmeldet, taucht hier auf.
        </Notice>
      ) : (
        <>
          <p className="text-white/60 text-sm leading-relaxed mb-6">
            {offen.length === 1
              ? 'Ein Account wartet auf eine Freigabe.'
              : `${offen.length} Accounts warten auf eine Freigabe.`}{' '}
            Ohne deine Entscheidung sehen sie nichts und können nichts ändern.
          </p>

          <div className="space-y-6">
            {offen.map((anfrage) => {
              // Das Token der Mail läuft ab. Danach weist die Entscheidung-Route
              // jede Anfrage ab, also gar nicht erst Knöpfe anbieten, die
              // zuverlässig scheitern.
              const abgelaufen = anfrage.tokenExpires <= jetzt

              return (
                <div
                  key={anfrage.id}
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-5"
                >
                  <div className="mb-5">
                    <Antragsteller
                      name={anfrage.name}
                      email={anfrage.email}
                      angefragtAm={anfrage.createdAt}
                    />
                  </div>

                  {abgelaufen ? (
                    <Notice tone="muted">
                      Der Freigabe-Link dieser Anfrage ist am {datum(anfrage.tokenExpires)}{' '}
                      abgelaufen. Wer weiterhin Zugang braucht, meldet sich einfach erneut an,
                      dann kommt eine frische Anfrage.
                    </Notice>
                  ) : (
                    <FreigabeActions token={anfrage.token} requesterEmail={anfrage.email} />
                  )}
                </div>
              )
            })}
          </div>
        </>
      )}

      {entschieden.length > 0 && (
        <div className="mt-12">
          <h2 className="text-sm font-semibold text-white/70 mb-4">Zuletzt entschieden</h2>
          <ul className="space-y-2">
            {entschieden.map((anfrage) => (
              <li
                key={anfrage.id}
                className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3"
              >
                <span className="text-sm text-white/70 break-all">{anfrage.email}</span>
                <span className="text-[12px] text-white/40">
                  {anfrage.status === 'APPROVED' && anfrage.grantedRole
                    ? getRoleDisplayName(anfrage.grantedRole as UserRole)
                    : 'Abgelehnt'}
                  {anfrage.decidedAt ? ` · ${datum(anfrage.decidedAt)}` : ''}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Frame>
  )
}
