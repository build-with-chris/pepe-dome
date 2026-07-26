'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import CopyField, { CopyButton } from '@/components/admin/CopyField'
import type { ChannelKit, EventChannelKit } from '@/lib/channel-kit/types'

/**
 * Kanal-Kit
 *
 * Links die Kanäle, rechts die Felder des gewählten Kanals, jedes einzeln
 * kopierbar. Das Kit veröffentlicht nichts, es schreibt nur den Text: der
 * Mensch fügt im Portalformular ein, was hier steht.
 *
 * Unten das Häkchen "eingetragen". Es ist die einzige Stelle, an der etwas
 * gespeichert wird, und es erzeugt genau die Zeile in "event_distributions",
 * die ein automatischer Adapter später auch schreiben würde.
 */

interface Distribution {
  channel: string
  status: string
  externalUrl: string | null
  completedAt: string | null
}

interface Props {
  eventId: string
  /** Häkchen setzen darf ab Editor. Lesen darf jeder mit Admin-Zugang. */
  canEdit?: boolean
}

const REASON_TEXT: Record<string, string> = {
  BUSINESS:
    'Firmenvermietungen sind geschlossene Veranstaltungen. Für sie wird bewusst kein Kanal-Kit erzeugt, denn in einem Stadtmagazin hilft eine Firmenfeier niemandem.',
  CHILD_EVENT:
    'Das ist ein Termin einer Serie. Das Kanal-Kit liegt beim Hauptevent und enthält dort die vollständige Terminliste, damit nicht jeder einzelne Termin extra eingetragen werden muss.',
}

export default function ChannelKitPanel({ eventId, canEdit = true }: Props) {
  const [kit, setKit] = useState<EventChannelKit | null>(null)
  const [distributions, setDistributions] = useState<Distribution[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  // Eingetippte URLs je Kanal. Ohne diesen Zwischenspeicher wäre die Eingabe
  // beim Wechsel auf einen anderen Kanal und zurück wieder weg.
  const [urlDrafts, setUrlDrafts] = useState<Record<string, string>>({})

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/events/${eventId}/channel-kit`)
      if (!res.ok) throw new Error('Kanal-Kit konnte nicht geladen werden.')
      const data: { kit: EventChannelKit; distributions: Distribution[] } = await res.json()
      setKit(data.kit)
      setDistributions(data.distributions)
      setActiveId((current) => current ?? data.kit.channels[0]?.id ?? null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler')
    } finally {
      setLoading(false)
    }
  }, [eventId])

  useEffect(() => {
    load()
  }, [load])

  const active: ChannelKit | null = useMemo(
    () => kit?.channels.find((channel) => channel.id === activeId) ?? null,
    [kit, activeId]
  )

  const activeDistribution = useMemo(
    () => distributions.find((d) => d.channel === active?.distributionChannel) ?? null,
    [distributions, active]
  )

  // Was im URL-Feld steht: das Getippte, sonst der bereits gespeicherte Wert.
  const urlDraft = active
    ? urlDrafts[active.id] ?? activeDistribution?.externalUrl ?? ''
    : ''

  async function markDone(channel: ChannelKit, externalUrl: string) {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/events/${eventId}/distributions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel: channel.distributionChannel, externalUrl }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Speichern fehlgeschlagen')
      setDistributions((current) => [
        ...current.filter((d) => d.channel !== channel.distributionChannel),
        data as Distribution,
      ])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Speichern fehlgeschlagen')
    } finally {
      setSaving(false)
    }
  }

  async function markOpen(channel: ChannelKit) {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(
        `/api/admin/events/${eventId}/distributions?channel=${channel.distributionChannel}`,
        { method: 'DELETE' }
      )
      if (!res.ok) throw new Error('Zurücknehmen fehlgeschlagen')
      setDistributions((current) =>
        current.filter((d) => d.channel !== channel.distributionChannel)
      )
      setUrlDrafts((current) => ({ ...current, [channel.id]: '' }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Zurücknehmen fehlgeschlagen')
    } finally {
      setSaving(false)
    }
  }

  const doneCount = kit
    ? kit.channels.filter((channel) =>
        distributions.some(
          (d) => d.channel === channel.distributionChannel && d.status === 'success'
        )
      ).length
    : 0

  return (
    <div className="bg-[#111113] border border-white/[0.08] rounded-xl p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="text-[13px] font-semibold text-white uppercase tracking-wider">
          Kanal-Kit
        </h2>
        {kit?.available && (
          <span className="text-[11px] text-white/45">
            {doneCount} von {kit.channels.length} Kanälen eingetragen
          </span>
        )}
      </div>

      {loading && <p className="text-sm text-white/50">Lade Kanal-Kit…</p>}

      {!loading && error && !kit && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      {!loading && kit && !kit.available && (
        <p className="text-sm leading-relaxed text-white/50">
          {REASON_TEXT[kit.reason ?? ''] ?? 'Für dieses Event gibt es kein Kanal-Kit.'}
        </p>
      )}

      {!loading && kit?.available && (
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-6">
          {/* Kanalliste */}
          <nav className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible">
            {kit.channels.map((channel) => {
              const done = distributions.some(
                (d) => d.channel === channel.distributionChannel && d.status === 'success'
              )
              const isActive = channel.id === activeId
              return (
                <button
                  key={channel.id}
                  type="button"
                  onClick={() => setActiveId(channel.id)}
                  className={`flex shrink-0 items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-[13px] transition-colors ${
                    isActive
                      ? 'bg-[#016dca]/12 text-[#016dca]'
                      : 'text-white/60 hover:bg-white/[0.04] hover:text-white/85'
                  }`}
                >
                  <span>{channel.label}</span>
                  <span
                    className={done ? 'text-[#016dca]' : 'text-white/20'}
                    aria-label={done ? 'eingetragen' : 'offen'}
                  >
                    {done ? '✓' : '○'}
                  </span>
                </button>
              )
            })}
          </nav>

          {/* Felder des gewählten Kanals */}
          {active && (
            <div className="space-y-5 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white">{active.label}</p>
                  {active.formUrl && (
                    <a
                      href={active.formUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-white/40 hover:text-[#016dca] transition-colors"
                    >
                      Formular öffnen
                    </a>
                  )}
                </div>
                <CopyButton text={active.copyAll} label="Alles kopieren" />
              </div>

              {active.hasAssumedLimits && (
                <p className="text-[11px] leading-relaxed text-white/40">
                  Die mit ? markierten Zeichenlimits sind angenommen, nicht am echten
                  Formular nachgemessen. Ein ~ steht für eine eigene Vorgabe: dort ist
                  mehr erlaubt, wird aber nicht gelesen.
                </p>
              )}

              {active.warnings.length > 0 && (
                <ul className="space-y-1.5">
                  {active.warnings.map((warning, index) => (
                    <li
                      key={index}
                      className="rounded-lg border border-amber-500/25 bg-amber-500/[0.05] px-3 py-2 text-[11px] leading-relaxed text-amber-200/85"
                    >
                      {warning}
                    </li>
                  ))}
                </ul>
              )}

              <div className="space-y-5">
                {active.fields.map((field) => (
                  <CopyField key={field.key} field={field} />
                ))}
              </div>

              {/* Protokoll: was steht wo */}
              <div className="border-t border-white/[0.08] pt-5 space-y-3">
                <label className="flex items-center gap-2.5 text-[13px] text-white/75">
                  <input
                    type="checkbox"
                    checked={Boolean(activeDistribution)}
                    disabled={!canEdit || saving}
                    onChange={(e) =>
                      e.target.checked ? markDone(active, urlDraft) : markOpen(active)
                    }
                    className="h-4 w-4 accent-[#016dca]"
                  />
                  Bei {active.label} eingetragen
                </label>

                <div className="flex flex-wrap items-center gap-2.5">
                  <Input
                    value={urlDraft}
                    onChange={(e) =>
                      setUrlDrafts((current) => ({ ...current, [active.id]: e.target.value }))
                    }
                    placeholder="Link zur Veröffentlichung (optional)"
                    inputSize="sm"
                    disabled={!canEdit || saving}
                    className="max-w-md"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="xs"
                    disabled={!canEdit || saving}
                    onClick={() => markDone(active, urlDraft)}
                  >
                    {saving ? 'Speichere…' : 'Übernehmen'}
                  </Button>
                </div>

                {activeDistribution?.completedAt && (
                  <p className="text-[11px] text-white/40">
                    Eingetragen am{' '}
                    {new Date(activeDistribution.completedAt).toLocaleDateString('de-DE')}
                  </p>
                )}

                {error && <p className="text-[11px] text-red-400">{error}</p>}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
