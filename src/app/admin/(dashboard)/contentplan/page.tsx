'use client'

import { useCallback, useEffect, useState } from 'react'
import { PageHeader } from '@/components/admin/PageHeader'
import { AdminCard } from '@/components/admin/AdminCard'
import { StatsGrid } from '@/components/admin/StatsGrid'
import FieldHint from '@/components/admin/ui/FieldHint'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import {
  PLANNED_REELS,
  REEL_STATUS_LABELS,
  REEL_STATUS_ORDER,
  SCALED_TARGET,
  costPerResult,
  type ReelStatus,
} from '@/lib/contentplan'

/**
 * Contentplan.
 *
 * Die Seite beantwortet drei Fragen und sonst nichts:
 * Reicht der Puffer? Steht die Schwelle? Welches Reel wartet auf Budget?
 *
 * Alles andere zum Plan steht im Briefing, nicht hier. Ein Modul, das den
 * ganzen Plan abbildet, wäre ein zweites Dokument, das gepflegt werden müsste
 * und beim ersten Widerspruch zum Briefing wertlos wird.
 */

interface Reel {
  id: string
  position: number
  artist: string
  discipline: string
  status: ReelStatus
  shootDate: string | null
  plannedFor: string | null
  publishedAt: string | null
  shares48: number | null
  saves48: number | null
  shares72: number | null
  saves72: number | null
  budgetReleasedAt: string | null
  spendCents: number | null
  results: number | null
  notes: string | null
  /**
   * Über der Schwelle, aber nach 48 Stunden immer noch ohne Budget. Kommt vom
   * Server, weil die Antwort von der aktuellen Uhrzeit abhängt.
   */
  overdue: boolean
}

interface PlanConfig {
  baselineMedian: number | null
  threshold: number | null
  fixedAt: string | null
  priorMedian: number | null
}

interface PlanStats {
  buffer: {
    count: number
    required: number
    ok: boolean
    next: { deadline: string; target: number } | null
  }
  baselineMedian: number | null
  suggestedThreshold: number | null
  scaled: number
  published: number
}

const STATUS_STYLES: Record<ReelStatus, string> = {
  PLANNED: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  FILMED: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  EDITED: 'bg-[#016dca]/20 text-[#016dca] border-[#016dca]/30',
  PUBLISHED: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
}

function formatDate(value: string | null): string {
  if (!value) return 'offen'
  return new Date(value).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function sumOrNull(a: number | null, b: number | null): number | null {
  if (a === null || b === null) return null
  return a + b
}

export default function ContentPlanPage() {
  const [reels, setReels] = useState<Reel[]>([])
  const [config, setConfig] = useState<PlanConfig | null>(null)
  const [stats, setStats] = useState<PlanStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)

  const load = useCallback(async () => {
    const response = await fetch('/api/admin/contentplan')
    if (!response.ok) {
      setLoading(false)
      return
    }
    const data = await response.json()
    setReels(data.reels)
    setConfig(data.config)
    setStats(data.stats)
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const patchReel = useCallback(
    async (id: string, body: Record<string, unknown>) => {
      await fetch(`/api/admin/contentplan/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      await load()
    },
    [load]
  )

  const patchConfig = useCallback(
    async (body: Record<string, unknown>) => {
      await fetch('/api/admin/contentplan/config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      await load()
    },
    [load]
  )

  const threshold = config?.threshold ?? null

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contentplan"
        description="Zwölf Artist-Reels, ein Puffer, eine Schwelle. Details stehen im Briefing."
        action={
          <Button onClick={() => setCreateOpen(true)}>Reel anlegen</Button>
        }
      />

      {stats && <PlanStatsRow stats={stats} threshold={threshold} />}

      {stats && config && (
        <ThresholdCard
          stats={stats}
          config={config}
          onSave={patchConfig}
        />
      )}

      <div className="space-y-3">
        {loading && <p className="text-sm text-white/40">Wird geladen.</p>}

        {!loading && reels.length === 0 && (
          <AdminCard>
            <p className="text-sm text-white/50">
              Noch kein Reel angelegt. Die zwölf Slots werden nacheinander gefüllt, einer pro Woche,
              beginnend mit dem Front-Load in den ersten zehn Tagen.
            </p>
          </AdminCard>
        )}

        {reels.map((reel) => (
          <ReelCard
            key={reel.id}
            reel={reel}
            threshold={threshold}
            onPatch={patchReel}
          />
        ))}
      </div>

      <CreateReelDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        nextPosition={reels.length > 0 ? Math.max(...reels.map((r) => r.position)) + 1 : 1}
        onCreated={load}
      />
    </div>
  )
}

/**
 * Die vier Zahlen, die der Plan hat. Der Puffer steht vorne, weil er als
 * einziger eine Handlung auslöst, solange noch nichts veröffentlicht ist.
 */
function PlanStatsRow({ stats, threshold }: { stats: PlanStats; threshold: number | null }) {
  const bufferOk = stats.buffer.ok

  return (
    <StatsGrid columns={4}>
      <div
        className={cn(
          'border rounded-xl p-6',
          bufferOk
            ? 'bg-white/[0.02] border-white/[0.08]'
            : 'bg-red-500/[0.07] border-red-500/30'
        )}
      >
        <p className="text-sm text-white/50 uppercase tracking-wider mb-3">Puffer</p>
        <p className={cn('text-4xl font-bold', bufferOk ? 'text-white' : 'text-red-400')}>
          {stats.buffer.count}
          <span className="text-xl text-white/30 font-normal"> / {stats.buffer.required}</span>
        </p>
        <p className="text-xs text-white/40 mt-2">
          {bufferOk
            ? 'fertig geschnitten, ungepostet'
            : 'unter Soll. Diese Woche einen zusätzlichen Schnitt-Slot einplanen.'}
        </p>
        {stats.buffer.next && (
          <p className="text-[11px] text-white/30 mt-1">
            Nächste Stufe: {stats.buffer.next.target} bis {formatDate(stats.buffer.next.deadline)}
          </p>
        )}
      </div>

      <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-6">
        <p className="text-sm text-white/50 uppercase tracking-wider mb-3">Veröffentlicht</p>
        <p className="text-4xl font-bold text-white">
          {stats.published}
          <span className="text-xl text-white/30 font-normal"> / {PLANNED_REELS}</span>
        </p>
        <p className="text-xs text-white/40 mt-2">Reels im Plan</p>
      </div>

      <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-6">
        <p className="text-sm text-white/50 uppercase tracking-wider mb-3">Skaliert</p>
        <p
          className={cn(
            'text-4xl font-bold',
            stats.scaled >= SCALED_TARGET ? 'text-emerald-400' : 'text-white'
          )}
        >
          {stats.scaled}
          <span className="text-xl text-white/30 font-normal"> / {SCALED_TARGET}</span>
        </p>
        <p className="text-xs text-white/40 mt-2">Creatives mit Budget, das Projektziel</p>
      </div>

      <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-6">
        <p className="text-sm text-white/50 uppercase tracking-wider mb-3">Schwelle</p>
        <p className={cn('text-4xl font-bold', threshold === null ? 'text-white/30' : 'text-[#016dca]')}>
          {threshold ?? 'offen'}
        </p>
        <p className="text-xs text-white/40 mt-2">
          {threshold === null ? 'bis dahin läuft kein Budget' : 'Shares plus Saves nach 48 h'}
        </p>
      </div>
    </StatsGrid>
  )
}

/**
 * Baseline und Schwelle.
 *
 * Der Median wird laufend mitgerechnet, sobald fünf Reels vollständige Zahlen
 * haben. Übernommen wird er trotzdem nur auf Knopfdruck, denn die Schwelle ist
 * eine Entscheidung mit Datum und keine Formel, die im Hintergrund mitwandert.
 */
function ThresholdCard({
  stats,
  config,
  onSave,
}: {
  stats: PlanStats
  config: PlanConfig
  onSave: (body: Record<string, unknown>) => Promise<void>
}) {
  const [thresholdInput, setThresholdInput] = useState(config.threshold?.toString() ?? '')
  const [priorInput, setPriorInput] = useState(config.priorMedian?.toString() ?? '')

  // Die Felder ziehen nach, wenn der Server nach dem Speichern neue Werte
  // liefert. Angleich während des Renderns statt im Effekt: Ein Effekt würde
  // erst einen Durchlauf mit dem alten Wert zeigen und dann neu rendern.
  const [lastConfig, setLastConfig] = useState(config)
  if (config !== lastConfig) {
    setLastConfig(config)
    setThresholdInput(config.threshold?.toString() ?? '')
    setPriorInput(config.priorMedian?.toString() ?? '')
  }

  return (
    <AdminCard title="Baseline und Schwelle">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <p className="text-sm text-white/70">
            Median der ersten fünf Reels:{' '}
            <span className="font-semibold text-white">
              {stats.baselineMedian ?? 'noch nicht berechenbar'}
            </span>
          </p>
          <FieldHint>
            Wird erst gerechnet, wenn fünf veröffentlichte Reels vollständige 48-Stunden-Zahlen
            haben. Eine Baseline aus drei Reels wäre eine Zahl ohne Aussage, und mit ihr würde
            Budget auf einer Schätzung fließen.
          </FieldHint>

          <div className="flex items-end gap-2 pt-2">
            <div className="flex-1 space-y-1.5">
              <label htmlFor="threshold" className="text-sm text-white/70">
                Schwelle (Shares plus Saves nach 48 h)
              </label>
              <Input
                id="threshold"
                type="number"
                min={0}
                value={thresholdInput}
                placeholder={stats.suggestedThreshold?.toString() ?? 'offen'}
                onChange={(event) => setThresholdInput(event.target.value)}
              />
            </div>
            <Button
              onClick={() =>
                onSave({
                  threshold: thresholdInput === '' ? null : Number(thresholdInput),
                  baselineMedian: stats.baselineMedian,
                })
              }
            >
              Fixieren
            </Button>
          </div>
          {stats.suggestedThreshold !== null && config.threshold === null && (
            <FieldHint>
              Vorschlag aus dem Median: {stats.suggestedThreshold}. Ab dieser Summe gilt ein Reel als
              Gewinner und bekommt innerhalb von 48 Stunden Budget.
            </FieldHint>
          )}
          {config.fixedAt && (
            <FieldHint>
              Fixiert am {formatDate(config.fixedAt)}. Ab hier nicht mehr ändern, sonst lässt sich
              später nicht mehr sagen, wogegen im September gemessen wurde.
            </FieldHint>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="prior" className="text-sm text-white/70">
            Median der bisherigen Reels
          </label>
          <div className="flex items-end gap-2">
            <Input
              id="prior"
              type="number"
              min={0}
              value={priorInput}
              placeholder="aus Instagram Insights"
              onChange={(event) => setPriorInput(event.target.value)}
            />
            <Button
              variant="outline"
              onClick={() => onSave({ priorMedian: priorInput === '' ? null : Number(priorInput) })}
            >
              Speichern
            </Button>
          </div>
          <FieldHint>
            Referenzwert für den Abbruchtest nach den ersten drei Reels. Liegen alle drei darunter,
            wird das Format geändert statt fortgesetzt. Ohne diese Zahl gibt es am Stichtag nichts
            zu vergleichen, deshalb vor dem ersten Drehtag einmal eintragen.
          </FieldHint>
        </div>
      </div>
    </AdminCard>
  )
}

function ReelCard({
  reel,
  threshold,
  onPatch,
}: {
  reel: Reel
  threshold: number | null
  onPatch: (id: string, body: Record<string, unknown>) => Promise<void>
}) {
  const engagement48 = sumOrNull(reel.shares48, reel.saves48)
  const engagement72 = sumOrNull(reel.shares72, reel.saves72)
  const winner = threshold !== null && engagement48 !== null ? engagement48 >= threshold : null
  const cpr = costPerResult(reel.spendCents, reel.results)

  // Überfällig heißt: veröffentlicht, über der Schwelle, kein Budget, und die
  // 48 Stunden sind vorbei. Der teuerste Fehler im ganzen Plan.
  const overdue = reel.overdue

  return (
    <div
      className={cn(
        'border rounded-xl p-5 space-y-4',
        overdue ? 'bg-red-500/[0.07] border-red-500/30' : 'bg-white/[0.02] border-white/[0.08]'
      )}
    >
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-mono text-white/40 tabular-nums w-8">
          {reel.position.toString().padStart(2, '0')}
        </span>
        <div className="flex-1 min-w-[12rem]">
          <p className="font-medium text-white">{reel.artist}</p>
          <p className="text-xs text-white/40">{reel.discipline}</p>
        </div>

        <Badge variant="outline" className={cn('text-xs border', STATUS_STYLES[reel.status])}>
          {REEL_STATUS_LABELS[reel.status]}
        </Badge>

        <Select
          value={reel.status}
          onValueChange={(value) => onPatch(reel.id, { status: value })}
        >
          <SelectTrigger className="w-[9.5rem]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {REEL_STATUS_ORDER.map((status) => (
              <SelectItem key={status} value={status}>
                {REEL_STATUS_LABELS[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="text-right">
          <p className="text-xs text-white/40">Slot</p>
          <p className="text-sm text-white/70 tabular-nums">{formatDate(reel.plannedFor)}</p>
        </div>
      </div>

      {overdue && (
        <p className="text-sm text-red-300">
          Über der Schwelle, aber ohne Budget, und die 48 Stunden sind vorbei. Jetzt freigeben oder
          begründen, warum nicht.
        </p>
      )}

      {reel.status === 'PUBLISHED' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-3 border-t border-white/[0.08]">
          <NumberField
            label="Shares 48 h"
            value={reel.shares48}
            onCommit={(value) => onPatch(reel.id, { shares48: value })}
          />
          <NumberField
            label="Saves 48 h"
            value={reel.saves48}
            onCommit={(value) => onPatch(reel.id, { saves48: value })}
          />
          <NumberField
            label="Shares 72 h"
            value={reel.shares72}
            onCommit={(value) => onPatch(reel.id, { shares72: value })}
          />
          <NumberField
            label="Saves 72 h"
            value={reel.saves72}
            onCommit={(value) => onPatch(reel.id, { saves72: value })}
          />

          <div className="sm:col-span-2 lg:col-span-4 flex flex-wrap items-center gap-4 pt-1">
            <div>
              <p className="text-xs text-white/40">Summe 48 h</p>
              <p className="text-lg font-semibold text-white tabular-nums">
                {engagement48 ?? 'offen'}
              </p>
            </div>
            <div>
              <p className="text-xs text-white/40">Summe 72 h</p>
              <p className="text-lg text-white/60 tabular-nums">{engagement72 ?? 'offen'}</p>
            </div>

            {winner !== null && (
              <Badge
                variant="outline"
                className={cn(
                  'text-xs border',
                  winner
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-gray-500/20 text-gray-300 border-gray-500/30'
                )}
              >
                {winner ? 'über Schwelle' : 'unter Schwelle'}
              </Badge>
            )}

            <label className="flex items-center gap-2 text-sm text-white/70">
              <input
                type="checkbox"
                checked={reel.budgetReleasedAt !== null}
                onChange={(event) => onPatch(reel.id, { budgetReleased: event.target.checked })}
                className="w-4 h-4 accent-[#016dca]"
              />
              Budget freigegeben
              {reel.budgetReleasedAt && (
                <span className="text-white/40">am {formatDate(reel.budgetReleasedAt)}</span>
              )}
            </label>
          </div>

          {reel.budgetReleasedAt && (
            <>
              <NumberField
                label="Ausgegeben (Cent)"
                value={reel.spendCents}
                onCommit={(value) => onPatch(reel.id, { spendCents: value })}
              />
              <NumberField
                label="Ergebnisse"
                value={reel.results}
                onCommit={(value) => onPatch(reel.id, { results: value })}
              />
              <div>
                <p className="text-xs text-white/40">Kosten pro Ergebnis</p>
                <p className="text-lg font-semibold text-[#016dca] tabular-nums">
                  {cpr === null
                    ? 'offen'
                    : cpr.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 })}
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * Zahlenfeld, das erst beim Verlassen speichert.
 *
 * Bei jedem Tastendruck zu speichern hieße, dass aus einer 12 unterwegs eine 1
 * wird und der Server sie kurz als echten Wert sieht. Beim Verlassen ist die
 * Zahl fertig getippt.
 */
function NumberField({
  label,
  value,
  onCommit,
}: {
  label: string
  value: number | null
  onCommit: (value: number | null) => void
}) {
  const [draft, setDraft] = useState(value?.toString() ?? '')

  // Nach dem Speichern kommt der Wert vom Server zurück. Der Entwurf im Feld
  // wird darauf angeglichen, sonst stünde nach einem verworfenen Wert weiter
  // die alte Eingabe da.
  const [lastValue, setLastValue] = useState(value)
  if (value !== lastValue) {
    setLastValue(value)
    setDraft(value?.toString() ?? '')
  }

  return (
    <div className="space-y-1.5">
      <label className="text-xs text-white/40">{label}</label>
      <Input
        type="number"
        min={0}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={() => {
          const next = draft === '' ? null : Number(draft)
          if (next !== value) onCommit(next)
        }}
      />
    </div>
  )
}

function CreateReelDialog({
  open,
  onOpenChange,
  nextPosition,
  onCreated,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  nextPosition: number
  onCreated: () => Promise<void>
}) {
  const [position, setPosition] = useState(nextPosition.toString())
  const [artist, setArtist] = useState('')
  const [discipline, setDiscipline] = useState('')
  const [shootDate, setShootDate] = useState('')
  const [plannedFor, setPlannedFor] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // Beim Öffnen leeren. Ohne das stünde beim zweiten Anlegen noch der vorige
  // Künstlername im Feld, und die Nummer wäre die schon vergebene.
  const [wasOpen, setWasOpen] = useState(open)
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) {
      setPosition(nextPosition.toString())
      setArtist('')
      setDiscipline('')
      setShootDate('')
      setPlannedFor('')
      setError(null)
    }
  }

  const submit = async () => {
    setSaving(true)
    setError(null)

    const response = await fetch('/api/admin/contentplan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        position: Number(position),
        artist,
        discipline,
        shootDate: shootDate || null,
        plannedFor: plannedFor || null,
      }),
    })

    setSaving(false)

    if (!response.ok) {
      const data = await response.json().catch(() => null)
      setError(data?.message || 'Das Reel konnte nicht angelegt werden.')
      return
    }

    await onCreated()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reel anlegen</DialogTitle>
          <DialogDescription>
            Ein Slot im Plan. Zahlen und Budget kommen erst dazu, wenn das Reel veröffentlicht ist.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="position" className="text-sm text-white/70">Nummer im Plan</label>
            <Input
              id="position"
              type="number"
              min={1}
              value={position}
              onChange={(event) => setPosition(event.target.value)}
            />
            <FieldHint>
              Bestimmt die Reihenfolge und legt fest, welche Reels die Baseline bilden. Die ersten
              fünf zählen, deshalb keine Nummer doppelt vergeben.
            </FieldHint>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="artist" className="text-sm text-white/70">Künstlerin oder Künstler</label>
            <Input id="artist" value={artist} onChange={(event) => setArtist(event.target.value)} />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="discipline" className="text-sm text-white/70">Disziplin</label>
            <Input
              id="discipline"
              value={discipline}
              placeholder="Contortion, Luftakrobatik, Hula Hoop"
              onChange={(event) => setDiscipline(event.target.value)}
            />
            <FieldHint>
              Die ersten drei Reels sollen drei verschiedene Disziplinen zeigen. Sonst testet der
              Front-Load eine Person und nicht das Format.
            </FieldHint>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="shootDate" className="text-sm text-white/70">Drehtag</label>
              <Input
                id="shootDate"
                type="date"
                value={shootDate}
                onChange={(event) => setShootDate(event.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="plannedFor" className="text-sm text-white/70">Geplanter Slot</label>
              <Input
                id="plannedFor"
                type="date"
                value={plannedFor}
                onChange={(event) => setPlannedFor(event.target.value)}
              />
              <FieldHint>In aller Regel ein Donnerstag.</FieldHint>
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Abbrechen</Button>
          <Button onClick={submit} disabled={saving || !artist || !discipline}>
            {saving ? 'Wird angelegt' : 'Anlegen'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
