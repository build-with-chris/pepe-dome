'use client'

/**
 * ContractForm
 *
 * Ein Formular für beide Vertragstypen. Oben die Gegenseite, darunter je nach
 * Typ die Felder der Mietvereinbarung oder des Angebots. Schalter blenden
 * ganze Abschnitte des PDFs ein und zeigen dann die Felder, die dazugehören.
 *
 * Fast alles darf leer bleiben. Was fehlt, steht im PDF als Linie zum
 * Ausfüllen von Hand.
 *
 * Schlägt das Speichern fehl, steht die Meldung oben und noch einmal direkt
 * am Knopf, und das erste betroffene Feld kommt ins Bild. Das Formular ist
 * mehrere Bildschirme lang. Eine Meldung nur am Anfang sieht niemand, der
 * unten auf „Vertrag anlegen“ klickt.
 *
 * Ist der Vertrag kein Entwurf mehr, ist das Formular gesperrt. Das PDF kommt
 * dann aus der eingefrorenen Fassung, eine Änderung hier hätte keine Wirkung.
 */

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label, labelVariants } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import FieldHint from '@/components/admin/ui/FieldHint'
import {
  angebotFelder,
  fristVor,
  mieteFelder,
  type AngebotFelder,
  type MieteFelder,
} from '@/lib/vertraege/formular'
import {
  betragAlsEingabe,
  betragAlsText,
  TYP_LABEL,
  VERTRAGSTYPEN,
  type Standardpreise,
  type Vertragstyp,
} from '@/lib/vertraege/validation'

export type ContractFormVertrag = {
  id: string
  type: Vertragstyp
  partnerName: string
  partnerEmail: string | null
  partnerPhone: string | null
  partnerAddress: string | null
  /** JJJJ-MM-TT */
  eventDate: string | null
  data: unknown
}

type Gegenseite = {
  partnerName: string
  partnerEmail: string
  partnerPhone: string
  partnerAddress: string
  eventDate: string
}

type Errors = Record<string, string>

const TYP_HINWEIS: Record<Vertragstyp, string> = {
  MIETE: 'Vereinbarung zur Nutzung des Dome, mit Regeln, Zahlung und Unterschriften.',
  ANGEBOT: 'Eine Seite mit Logo: Eckdaten, Leistungen und Preis. Unverbindlich, ohne Unterschrift.',
}

function Karte({ titel, children }: { titel: string; children: ReactNode }) {
  return (
    <div className="bg-[#111113] border border-white/[0.08] rounded-xl p-6 space-y-5">
      <h2 className="text-[13px] font-semibold text-white uppercase tracking-wider">{titel}</h2>
      {children}
    </div>
  )
}

function Feld({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  placeholder,
  required,
  type = 'text',
  inputMode,
  einheit,
  children,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  hint?: ReactNode
  placeholder?: string
  required?: boolean
  type?: 'text' | 'date' | 'email' | 'tel'
  inputMode?: 'decimal'
  /** Steht hinter dem Feld, etwa „€“ oder „%“. */
  einheit?: string
  /** Steht direkt unter dem Feld, etwa Knöpfe zum schnellen Ausfüllen. */
  children?: ReactNode
}) {
  return (
    <div className="space-y-2.5">
      <Label htmlFor={id} hasError={!!error} required={required}>
        {label}
      </Label>
      <div className="flex items-center gap-2">
        <Input
          id={id}
          type={type}
          inputMode={inputMode}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          hasError={!!error}
          placeholder={placeholder}
        />
        {einheit && <span className="text-sm text-white/50 shrink-0">{einheit}</span>}
      </div>
      {children}
      {error ? <p className="text-sm text-red-400">{error}</p> : hint ? <FieldHint>{hint}</FieldHint> : null}
    </div>
  )
}

function Schalter({
  id,
  label,
  hint,
  checked,
  onChange,
  children,
}: {
  id: string
  label: string
  hint: string
  checked: boolean
  onChange: (checked: boolean) => void
  /** Felder, die nur bei eingeschaltetem Schalter gebraucht werden. */
  children?: ReactNode
}) {
  return (
    <div
      // `relative`, damit das unsichtbare Feld hinter dem Schalter an dieser
      // Zeile hängt und nicht am Dokument (siehe AdminShell).
      className={`relative rounded-lg border px-4 py-3 ${
        checked ? 'border-[#016dca]/40 bg-[#016dca]/[0.06]' : 'border-white/[0.08]'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <label htmlFor={id} className="text-sm font-medium text-white cursor-pointer">
            {label}
          </label>
          <p className="text-[11px] leading-relaxed text-white/45 mt-0.5">{hint}</p>
        </div>
        <Switch id={id} checked={checked} onCheckedChange={onChange} className="shrink-0" />
      </div>
      {checked && children ? <div className="mt-4 space-y-4">{children}</div> : null}
    </div>
  )
}

/**
 * Erst wahr, wenn die Seite im Browser wirklich bedienbar ist. Auf dem Server
 * und im ausgelieferten HTML ist der Wert falsch.
 */
const keinAbo = () => () => {}
function useBedienbar(): boolean {
  return useSyncExternalStore(keinAbo, () => true, () => false)
}

const heute = () =>
  new Date().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })

export default function ContractForm({
  mode,
  vertrag,
  vorbelegung,
  standardpreise,
  gesperrt = false,
}: {
  mode: 'create' | 'edit'
  /** Nur beim Bearbeiten. */
  vertrag?: ContractFormVertrag
  /** Nur beim Anlegen: Betragsfelder des letzten Vertrags je Typ. */
  vorbelegung?: Partial<Record<Vertragstyp, Record<string, unknown>>>
  /** Reguläre Preise für halben und ganzen Tag, gepflegt unter Verträge. */
  standardpreise?: Standardpreise
  gesperrt?: boolean
}) {
  const router = useRouter()
  // Solange das Skript der Seite nicht geladen ist, würde ein Klick auf den
  // Knopf das Formular vom Browser abschicken lassen: Die Seite lädt neu, alle
  // Eingaben sind weg, gespeichert ist nichts. Deshalb bleibt der Knopf bis
  // dahin aus.
  const bedienbar = useBedienbar()

  const [type, setType] = useState<Vertragstyp>(vertrag?.type ?? 'MIETE')
  const [gegenseite, setGegenseite] = useState<Gegenseite>({
    partnerName: vertrag?.partnerName ?? '',
    partnerEmail: vertrag?.partnerEmail ?? '',
    partnerPhone: vertrag?.partnerPhone ?? '',
    partnerAddress: vertrag?.partnerAddress ?? '',
    eventDate: vertrag?.eventDate ?? '',
  })
  // Beide Typen behalten ihren Zustand. Wer beim Anlegen den Typ wechselt und
  // zurückkommt, findet seine Eingaben wieder.
  const [miete, setMiete] = useState<MieteFelder>(() =>
    mieteFelder(vertrag?.type === 'MIETE' ? vertrag.data : vorbelegung?.MIETE)
  )
  const [angebot, setAngebot] = useState<AngebotFelder>(() =>
    angebotFelder(vertrag?.type === 'ANGEBOT' ? vertrag.data : vorbelegung?.ANGEBOT, heute())
  )

  const [errors, setErrors] = useState<Errors>({})
  const [saving, setSaving] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [gespeichert, setGespeichert] = useState(false)
  const [geaendert, setGeaendert] = useState(false)

  function beruehrt(feld: string) {
    setGeaendert(true)
    setGespeichert(false)
    setErrors((prev) => {
      if (!prev[feld]) return prev
      const next = { ...prev }
      delete next[feld]
      return next
    })
  }

  const g = <K extends keyof Gegenseite>(feld: K, wert: Gegenseite[K]) => {
    setGegenseite((prev) => ({ ...prev, [feld]: wert }))
    beruehrt(feld)
  }

  /**
   * Das Datum der Veranstaltung bestimmt die Frist der Anzahlung: zwei Wochen
   * vorher. Die Frist zieht nur mit, solange sie leer ist oder noch der
   * berechnete Wert drinsteht. Eine eigene Eingabe bleibt stehen.
   */
  function setzeDatum(neu: string) {
    const bisher = fristVor(gegenseite.eventDate)
    g('eventDate', neu)
    setMiete((prev) =>
      prev.anzahlungFrist === '' || prev.anzahlungFrist === bisher
        ? { ...prev, anzahlungFrist: fristVor(neu) }
        : prev
    )
  }
  const m = <K extends keyof MieteFelder>(feld: K, wert: MieteFelder[K]) => {
    setMiete((prev) => ({ ...prev, [feld]: wert }))
    beruehrt(feld)
  }
  const a = <K extends keyof AngebotFelder>(feld: K, wert: AngebotFelder[K]) => {
    setAngebot((prev) => ({ ...prev, [feld]: wert }))
    beruehrt(feld)
  }

  /**
   * Holt das erste Feld mit Fehler ins Bild und setzt den Cursor hinein.
   *
   * Das passiert erst nach dem nächsten Rendern (siehe useEffect unten):
   * Während des Speicherns sind alle Felder gesperrt, und ein gesperrtes Feld
   * nimmt keinen Fokus an.
   */
  const fehlerZumZeigen = useRef<Errors | null>(null)
  function zeigeErstenFehler(gefunden: Errors) {
    fehlerZumZeigen.current = gefunden
  }
  useEffect(() => {
    const gefunden = fehlerZumZeigen.current
    if (saving || !gefunden) return
    fehlerZumZeigen.current = null
    const feld = Object.keys(gefunden)
      .map((id) => document.getElementById(id))
      .find((element): element is HTMLElement => element !== null)
    if (!feld) return
    feld.scrollIntoView?.({ block: 'center', behavior: 'smooth' })
    feld.focus({ preventScroll: true })
  }, [saving, errors])

  function validate(): Errors {
    const next: Errors = {}
    if (!gegenseite.partnerName.trim()) next.partnerName = 'Name ist Pflicht'
    if (type === 'MIETE') {
      if (!miete.anlass.trim()) next.anlass = 'Anlass ist Pflicht'
      if (!miete.termin.trim()) next.termin = 'Termin ist Pflicht'
      if (miete.preismodell === 'showbesuch' && !miete.showName.trim()) {
        next.showName = 'Beim Showbesuch gehört der Name der Show dazu'
      }
    } else if (!angebot.veranstaltung.trim()) {
      next.veranstaltung = 'Veranstaltung ist Pflicht'
    }
    return next
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setServerError(null)
    setGespeichert(false)

    const gefunden = validate()
    if (Object.keys(gefunden).length > 0) {
      setErrors(gefunden)
      setServerError('Noch nicht gespeichert: Bitte die markierten Felder ausfüllen.')
      zeigeErstenFehler(gefunden)
      return
    }

    setSaving(true)
    try {
      const res = await fetch(
        mode === 'create' ? '/api/admin/contracts' : `/api/admin/contracts/${vertrag?.id}`,
        {
          method: mode === 'create' ? 'POST' : 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type,
            ...gegenseite,
            data: type === 'MIETE' ? miete : angebot,
          }),
        }
      )
      const body = await res.json().catch(() => null)

      if (!res.ok) {
        // Die API meldet je Feld, was nicht passt. Der Schlüssel ist der Feldname.
        const vomServer: Errors = {}
        for (const issue of (body?.details ?? []) as Array<{ path?: unknown[]; message?: string }>) {
          const feld = (issue.path ?? []).find(
            (teil, index) => typeof teil === 'string' && !(index === 0 && teil === 'data')
          )
          if (typeof feld === 'string' && issue.message && !vomServer[feld]) {
            vomServer[feld] = issue.message
          }
        }
        setErrors(vomServer)
        zeigeErstenFehler(vomServer)
        throw new Error(`Nicht gespeichert: ${body?.error ?? `Fehler ${res.status}`}`)
      }

      if (mode === 'create') {
        router.push(`/admin/contracts/${body.contract.id}`)
        router.refresh()
        return
      }
      setGeaendert(false)
      setGespeichert(true)
      router.refresh()
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Nicht gespeichert.')
    } finally {
      setSaving(false)
    }
  }

  // ── Zeilen-Editoren ───────────────────────────────────────────────────
  const zeilenKnopf =
    'text-[12px] text-white/50 hover:text-white transition-colors disabled:opacity-40'

  const zusatzZeilen = (
    <div className="space-y-2">
      {miete.zusatzleistungenZeilen.map((zeile, index) => (
        <div key={index} className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
          <Input
            aria-label={`Zusatzleistung ${index + 1}`}
            value={zeile.leistung}
            placeholder="Leistung"
            onChange={(event) =>
              m(
                'zusatzleistungenZeilen',
                miete.zusatzleistungenZeilen.map((z, i) =>
                  i === index ? { ...z, leistung: event.target.value } : z
                )
              )
            }
          />
          <Input
            aria-label={`Preis der Zusatzleistung ${index + 1}`}
            value={zeile.preis}
            placeholder="Preis"
            className="max-w-[11rem]"
            onChange={(event) =>
              m(
                'zusatzleistungenZeilen',
                miete.zusatzleistungenZeilen.map((z, i) =>
                  i === index ? { ...z, preis: event.target.value } : z
                )
              )
            }
          />
          <button
            type="button"
            className={zeilenKnopf}
            aria-label={`Zusatzleistung ${index + 1} entfernen`}
            onClick={() =>
              m(
                'zusatzleistungenZeilen',
                miete.zusatzleistungenZeilen.filter((_, i) => i !== index)
              )
            }
          >
            Entfernen
          </button>
        </div>
      ))}
      <button
        type="button"
        className={zeilenKnopf}
        onClick={() =>
          m('zusatzleistungenZeilen', [...miete.zusatzleistungenZeilen, { leistung: '', preis: '' }])
        }
      >
        + Zeile
      </button>
      {errors.zusatzleistungenZeilen ? (
        <p className="text-sm text-red-400">{errors.zusatzleistungenZeilen}</p>
      ) : (
        <FieldHint>
          Der Preis ist freier Text, so geht auch ein Zusatz wie „für den Abend“. Im PDF steht vor
          jeder Zeile ein Kästchen zum Ankreuzen.
        </FieldHint>
      )}
    </div>
  )

  const leistungsZeilen = (
    <div className="space-y-2">
      {angebot.leistungen.map((zeile, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            aria-label={`Leistung ${index + 1}`}
            value={zeile}
            placeholder="Leistung"
            onChange={(event) =>
              a(
                'leistungen',
                angebot.leistungen.map((z, i) => (i === index ? event.target.value : z))
              )
            }
          />
          <button
            type="button"
            className={zeilenKnopf}
            aria-label={`Leistung ${index + 1} entfernen`}
            onClick={() =>
              a(
                'leistungen',
                angebot.leistungen.filter((_, i) => i !== index)
              )
            }
          >
            Entfernen
          </button>
        </div>
      ))}
      <button
        type="button"
        className={zeilenKnopf}
        onClick={() => a('leistungen', [...angebot.leistungen, ''])}
      >
        + Zeile
      </button>
      {errors.leistungen && <p className="text-sm text-red-400">{errors.leistungen}</p>}
    </div>
  )

  const showbesuch = miete.preismodell === 'showbesuch'

  // ── Standardpreise ────────────────────────────────────────────────────
  const STANDARD = [
    { preis: standardpreise?.halbtag ?? null, label: 'Halber Tag', bezeichnung: 'Regulärer Halbtagessatz' },
    { preis: standardpreise?.ganztag ?? null, label: 'Ganzer Tag', bezeichnung: 'Regulärer Tagessatz' },
  ].filter((eintrag): eintrag is { preis: number; label: string; bezeichnung: string } => eintrag.preis !== null)

  /** Knöpfe, die den regulären Preis mit einem Klick setzen. */
  const standardKnoepfe = (aktuell: string, waehle: (eintrag: (typeof STANDARD)[number]) => void) =>
    STANDARD.length > 0 ? (
      <div className="flex flex-wrap gap-2">
        {STANDARD.map((eintrag) => {
          const aktiv = aktuell.trim() === betragAlsEingabe(eintrag.preis)
          return (
            <button
              key={eintrag.label}
              type="button"
              aria-pressed={aktiv}
              onClick={() => waehle(eintrag)}
              className={`rounded-md border px-2.5 py-1 text-[12px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#016dca] ${
                aktiv
                  ? 'border-[#016dca] bg-[#016dca]/15 text-white'
                  : 'border-white/[0.12] text-white/60 hover:border-white/30 hover:text-white'
              }`}
            >
              {eintrag.label}: {betragAlsText(eintrag.preis)} €
            </button>
          )
        })}
      </div>
    ) : null

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {gesperrt && (
        <div className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
          Dieser Vertrag ist kein Entwurf mehr und deshalb gesperrt. Das PDF kommt aus der Fassung,
          die beim Statuswechsel eingefroren wurde. Zum Ändern den Status oben zurück auf
          „Entwurf“ setzen.
        </div>
      )}

      {serverError && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {serverError}
        </div>
      )}

      {/* Gesperrt heißt hier: nur lesen. Die Werte sollen dann lesbar bleiben
          und nicht so blass sein wie ein Feld, das gerade nicht dran ist. */}
      <fieldset
        disabled={gesperrt || saving}
        className={`space-y-6 min-w-0 ${
          gesperrt
            ? '[&_input:disabled]:opacity-100 [&_input:disabled]:text-white/80 [&_textarea:disabled]:opacity-100 [&_textarea:disabled]:text-white/80'
            : ''
        }`}
      >
        {mode === 'create' && (
          <Karte titel="Vertragstyp">
            <fieldset>
              <legend className="sr-only">Vertragstyp</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {VERTRAGSTYPEN.map((wert) => {
                  const aktiv = type === wert
                  return (
                    <label
                      key={wert}
                      className={`relative cursor-pointer rounded-lg border px-4 py-3 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#016dca] ${
                        aktiv
                          ? 'border-[#016dca] bg-[#016dca]/15'
                          : 'border-white/[0.12] hover:border-white/30'
                      }`}
                    >
                      <input
                        type="radio"
                        name="type"
                        value={wert}
                        checked={aktiv}
                        onChange={() => {
                          setType(wert)
                          setErrors({})
                        }}
                        className="sr-only"
                      />
                      <span className="block text-sm font-medium text-white">{TYP_LABEL[wert]}</span>
                      <span className="block text-[11px] leading-relaxed text-white/45 mt-1">
                        {TYP_HINWEIS[wert]}
                      </span>
                    </label>
                  )
                })}
              </div>
            </fieldset>
          </Karte>
        )}

        <Karte titel="Gegenseite">
          <Feld
            id="partnerName"
            label="Name"
            required
            value={gegenseite.partnerName}
            onChange={(wert) => g('partnerName', wert)}
            error={errors.partnerName}
            placeholder={type === 'MIETE' ? 'Vor- und Nachname' : 'Person oder Organisation'}
            hint={
              type === 'MIETE'
                ? 'So steht der Name im Vertrag und unter der Unterschriftslinie.'
                : 'Erscheint nur in der Liste, nicht im Angebot.'
            }
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <Feld
              id="partnerEmail"
              label="E-Mail"
              type="email"
              value={gegenseite.partnerEmail}
              onChange={(wert) => g('partnerEmail', wert)}
              error={errors.partnerEmail}
            />
            <Feld
              id="partnerPhone"
              label="Telefon"
              type="tel"
              value={gegenseite.partnerPhone}
              onChange={(wert) => g('partnerPhone', wert)}
              error={errors.partnerPhone}
            />
          </div>
          <Feld
            id="partnerAddress"
            label="Anschrift"
            value={gegenseite.partnerAddress}
            onChange={(wert) => g('partnerAddress', wert)}
            error={errors.partnerAddress}
            placeholder="Straße, PLZ Ort"
            hint={
              type === 'MIETE'
                ? 'Leer lassen: Im Vertrag steht dann eine Linie zum Ausfüllen.'
                : undefined
            }
          />
        </Karte>

        {type === 'MIETE' ? (
          <>
            <Karte titel="Anlass und Termin">
              <Feld
                id="anlass"
                label="Anlass"
                required
                value={miete.anlass}
                onChange={(wert) => m('anlass', wert)}
                error={errors.anlass}
                placeholder="Feier zum 30. Geburtstag"
                hint="Steht als Untertitel unter „Vereinbarung zur Nutzung des Pepe Dome“."
              />
              <Feld
                id="termin"
                label="Termin"
                required
                value={miete.termin}
                onChange={(wert) => m('termin', wert)}
                error={errors.termin}
                placeholder="Samstag, 14.03.2027"
                hint="Freier Text. Auch „Freitag oder Samstag, wird bis zum … festgelegt“ geht."
              />
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <Feld
                  id="eventDate"
                  label="Datum der Veranstaltung"
                  type="date"
                  value={gegenseite.eventDate}
                  onChange={setzeDatum}
                  error={errors.eventDate}
                  hint="Sortiert die Liste und bestimmt die Frist der Anzahlung. Steht nicht im PDF."
                />
                <Feld
                  id="aufbauAb"
                  label="Aufbau ab"
                  value={miete.aufbauAb}
                  onChange={(wert) => m('aufbauAb', wert)}
                  error={errors.aufbauAb}
                  placeholder="15:00"
                  einheit="Uhr"
                />
                <Feld
                  id="beginn"
                  label="Beginn"
                  value={miete.beginn}
                  onChange={(wert) => m('beginn', wert)}
                  error={errors.beginn}
                  placeholder="18:00"
                  einheit="Uhr"
                />
                <Feld
                  id="ende"
                  label="Ende"
                  value={miete.ende}
                  onChange={(wert) => m('ende', wert)}
                  error={errors.ende}
                  placeholder="2:00"
                  einheit="Uhr"
                />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Feld
                  id="gaesteGeplant"
                  label="Gäste geplant"
                  value={miete.gaesteGeplant}
                  onChange={(wert) => m('gaesteGeplant', wert)}
                  error={errors.gaesteGeplant}
                  placeholder="etwa 80"
                  hint="Im Vertrag: „Geplant sind … Personen“."
                />
                <Feld
                  id="gaesteMax"
                  label="Gäste höchstens"
                  value={miete.gaesteMax}
                  onChange={(wert) => m('gaesteMax', wert)}
                  error={errors.gaesteMax}
                  placeholder="200"
                />
              </div>
              <Feld
                id="einweisung"
                label="Einweisungstermin"
                value={miete.einweisung}
                onChange={(wert) => m('einweisung', wert)}
                error={errors.einweisung}
                placeholder="Samstag, 07.03.2027, Uhrzeit nach Absprache"
                hint="Im Vertrag: „Einweisung eine Woche vorher: …“. Leer lassen: „Termin nach Absprache“."
              />
            </Karte>

            <Karte titel="Preis und Zahlung">
              <fieldset className="space-y-2.5">
                <legend className={`${labelVariants()} mb-2.5`}>Preismodell</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {(
                    [
                      ['pauschale', 'Mietpauschale', 'Ein fester Preis für Miete und Heizung.'],
                      [
                        'showbesuch',
                        'Showbesuch',
                        'Die Gruppe besucht eine Show und feiert danach. Ticketregel und Heizpauschale statt Miete.',
                      ],
                    ] as const
                  ).map(([wert, label, hinweis]) => {
                    const aktiv = miete.preismodell === wert
                    return (
                      <label
                        key={wert}
                        className={`relative cursor-pointer rounded-lg border px-4 py-3 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#016dca] ${
                          aktiv
                            ? 'border-[#016dca] bg-[#016dca]/15'
                            : 'border-white/[0.12] hover:border-white/30'
                        }`}
                      >
                        <input
                          type="radio"
                          name="preismodell"
                          value={wert}
                          checked={aktiv}
                          onChange={() => m('preismodell', wert)}
                          className="sr-only"
                        />
                        <span className="block text-sm font-medium text-white">{label}</span>
                        <span className="block text-[11px] leading-relaxed text-white/45 mt-1">
                          {hinweis}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </fieldset>

              {showbesuch ? (
                <div className="grid gap-5 sm:grid-cols-3">
                  <Feld
                    id="showName"
                    label="Name der Show"
                    required
                    value={miete.showName}
                    onChange={(wert) => m('showName', wert)}
                    error={errors.showName}
                  />
                  <Feld
                    id="ticketQuote"
                    label="Ticketregel"
                    inputMode="decimal"
                    einheit="%"
                    value={miete.ticketQuote}
                    onChange={(wert) => m('ticketQuote', wert)}
                    error={errors.ticketQuote}
                    hint="So viele Gäste kaufen mindestens ein reguläres Ticket."
                  />
                  <Feld
                    id="preisVereinbart"
                    label="Heizpauschale"
                    inputMode="decimal"
                    einheit="€"
                    value={miete.preisVereinbart}
                    onChange={(wert) => m('preisVereinbart', wert)}
                    error={errors.preisVereinbart}
                  />
                </div>
              ) : (
                <>
                  <Feld
                    id="preisBezeichnung"
                    label="Bezeichnung des Preises"
                    value={miete.preisBezeichnung}
                    onChange={(wert) => m('preisBezeichnung', wert)}
                    error={errors.preisBezeichnung}
                    placeholder="Freundschaftspreis"
                    hint="So heißt der Preis im Vertrag. Leer lassen: „Preis“, mit Sonderpreis „Vereinbarter Preis“."
                  />
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Feld
                      id="preisRegulaer"
                      label="Regulärer Preis"
                      inputMode="decimal"
                      einheit="€"
                      value={miete.preisRegulaer}
                      onChange={(wert) => m('preisRegulaer', wert)}
                      error={errors.preisRegulaer}
                      hint="Gilt, solange kein Sonderpreis eingetragen ist."
                    >
                      {standardKnoepfe(miete.preisRegulaer, (eintrag) =>
                        m('preisRegulaer', betragAlsEingabe(eintrag.preis))
                      )}
                    </Feld>
                    <Feld
                      id="preisVereinbart"
                      label="Sonderpreis"
                      inputMode="decimal"
                      einheit="€"
                      value={miete.preisVereinbart}
                      onChange={(wert) => m('preisVereinbart', wert)}
                      error={errors.preisVereinbart}
                      hint="Etwa ein Freundschaftspreis. Leer lassen: Es gilt der reguläre Preis. Mit Sonderpreis nennt der Vertrag beide und knüpft ihn an die Einhaltung der Regeln."
                    />
                  </div>
                </>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                <Feld
                  id="anzahlungProzent"
                  label="Anzahlung"
                  inputMode="decimal"
                  einheit="%"
                  value={miete.anzahlungProzent}
                  onChange={(wert) => m('anzahlungProzent', wert)}
                  error={errors.anzahlungProzent}
                  hint="Üblich ist die Hälfte. Der Betrag wird im Vertrag aus dem geltenden Preis ausgerechnet. Leer oder 0: keine Anzahlung."
                />
                <Feld
                  id="anzahlungFrist"
                  label="Anzahlung bis"
                  value={miete.anzahlungFrist}
                  onChange={(wert) => m('anzahlungFrist', wert)}
                  error={errors.anzahlungFrist}
                  placeholder="28.02.2027"
                  hint="Wird aus dem Datum der Veranstaltung berechnet: zwei Wochen vorher. Lässt sich überschreiben."
                />
              </div>
            </Karte>

            <Karte titel="Bausteine">
              <FieldHint>
                Jeder Schalter blendet einen Abschnitt oder eine Regel im Vertrag ein. Die
                Abschnitte werden fortlaufend nummeriert.
              </FieldHint>
              <div className="space-y-3">
                <Schalter
                  id="minderjaehrig"
                  label="Gegenseite ist minderjährig"
                  hint="Zeilen für Geburtsdatum und erziehungsberechtigte Person, dazu ein zweites Unterschriftsfeld."
                  checked={miete.minderjaehrig}
                  onChange={(wert) => m('minderjaehrig', wert)}
                />
                <Schalter
                  id="zusatzleistungen"
                  label="Zusatzleistungen"
                  hint="Eigener Abschnitt mit Leistungen zum Ankreuzen."
                  checked={miete.zusatzleistungen}
                  onChange={(wert) => m('zusatzleistungen', wert)}
                >
                  {zusatzZeilen}
                </Schalter>
                <Schalter
                  id="material"
                  label="Material vor Ort"
                  hint="Leihgebühr für Werkzeug und Regel für Verbrauchsmaterial."
                  checked={miete.material}
                  onChange={(wert) => m('material', wert)}
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Feld
                      id="werkzeugGebuehr"
                      label="Leihgebühr pro Werkzeug"
                      inputMode="decimal"
                      einheit="€"
                      value={miete.werkzeugGebuehr}
                      onChange={(wert) => m('werkzeugGebuehr', wert)}
                      error={errors.werkzeugGebuehr}
                    />
                    <Feld
                      id="verbrauchsmaterial"
                      label="Verbrauchsmaterial"
                      value={miete.verbrauchsmaterial}
                      onChange={(wert) => m('verbrauchsmaterial', wert)}
                      error={errors.verbrauchsmaterial}
                      placeholder="zum Einkaufspreis"
                      hint="Im Vertrag: „Verbrauchsmaterial (Tape usw.): …“."
                    />
                  </div>
                </Schalter>
                <Schalter
                  id="bier"
                  label="Bier über den Pepe Dome"
                  hint="Bier wird nur vom Pepe Dome bezogen. Die Mindestmenge bleibt eine Linie zum Ausfüllen."
                  checked={miete.bier}
                  onChange={(wert) => m('bier', wert)}
                >
                  <div className="max-w-xs">
                    <Feld
                      id="bierPreis"
                      label="Preis pro Kasten"
                      inputMode="decimal"
                      einheit="€"
                      value={miete.bierPreis}
                      onChange={(wert) => m('bierPreis', wert)}
                      error={errors.bierPreis}
                    />
                  </div>
                </Schalter>
                <Schalter
                  id="aufsichtsperson"
                  label="Erwachsene Aufsichtsperson"
                  hint="Regel und eigenes Feld zum Unterschreiben. Gedacht für Feiern mit vielen Jugendlichen."
                  checked={miete.aufsichtsperson}
                  onChange={(wert) => m('aufsichtsperson', wert)}
                />
                <Schalter
                  id="feuer"
                  label="Offenes Feuer"
                  hint="Regel und eigenes Feld für die Aufsichtsperson am Feuer."
                  checked={miete.feuer}
                  onChange={(wert) => m('feuer', wert)}
                />
                <Schalter
                  id="jugendschutz"
                  label="Jugendschutz"
                  hint="Regeln für Gäste unter 16 und unter 18 Jahren."
                  checked={miete.jugendschutz}
                  onChange={(wert) => m('jugendschutz', wert)}
                />
                <Schalter
                  id="lautstaerkeHervorgehoben"
                  label="Lautstärke als hervorgehobene Regel"
                  hint="Eigener Abschnitt im farbigen Kasten statt eines Punkts unter den Regeln."
                  checked={miete.lautstaerkeHervorgehoben}
                  onChange={(wert) => m('lautstaerkeHervorgehoben', wert)}
                />
                <Schalter
                  id="kaution"
                  label="Kaution"
                  hint="Wird mit der Anzahlung fällig und nach der Abnahme zurückgezahlt oder verrechnet."
                  checked={miete.kaution}
                  onChange={(wert) => m('kaution', wert)}
                >
                  <div className="max-w-xs">
                    <Feld
                      id="kautionBetrag"
                      label="Kaution"
                      inputMode="decimal"
                      einheit="€"
                      value={miete.kautionBetrag}
                      onChange={(wert) => m('kautionBetrag', wert)}
                      error={errors.kautionBetrag}
                    />
                  </div>
                </Schalter>
              </div>
            </Karte>

            <Karte titel="Sonderabsprache">
              <div className="space-y-2.5">
                <Label htmlFor="sonderabsprache" hasError={!!errors.sonderabsprache}>
                  Freier Text
                </Label>
                <Textarea
                  id="sonderabsprache"
                  value={miete.sonderabsprache}
                  onChange={(event) => m('sonderabsprache', event.target.value)}
                  rows={5}
                />
                {errors.sonderabsprache ? (
                  <p className="text-sm text-red-400">{errors.sonderabsprache}</p>
                ) : (
                  <FieldHint>
                    Erscheint als eigener, letzter Abschnitt im Vertrag. Eine Leerzeile trennt
                    Absätze. Leer lassen: kein Abschnitt.
                  </FieldHint>
                )}
              </div>
            </Karte>
          </>
        ) : (
          <>
            <Karte titel="Veranstaltung">
              <Feld
                id="veranstaltung"
                label="Veranstaltung"
                required
                value={angebot.veranstaltung}
                onChange={(wert) => a('veranstaltung', wert)}
                error={errors.veranstaltung}
                placeholder="Name der Veranstaltung"
                hint="Steht im Kopf, in den Eckdaten und in der Preiszeile."
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <Feld
                  id="datum"
                  label="Datum"
                  value={angebot.datum}
                  onChange={(wert) => a('datum', wert)}
                  error={errors.datum}
                  placeholder="Sonntag, 14. März 2027"
                />
                <Feld
                  id="eventDate"
                  label="Datum für die Liste"
                  type="date"
                  value={gegenseite.eventDate}
                  onChange={(wert) => g('eventDate', wert)}
                  error={errors.eventDate}
                  hint="Nur zum Sortieren, nicht im PDF."
                />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Feld
                  id="uhrzeit"
                  label="Uhrzeit"
                  value={angebot.uhrzeit}
                  onChange={(wert) => a('uhrzeit', wert)}
                  error={errors.uhrzeit}
                  placeholder="11:00 bis 14:00 Uhr"
                />
                <Feld
                  id="gaeste"
                  label="Gäste"
                  value={angebot.gaeste}
                  onChange={(wert) => a('gaeste', wert)}
                  error={errors.gaeste}
                  placeholder="ca. 40 Personen"
                />
              </div>
              <Feld
                id="reservierung"
                label="Reservierung"
                value={angebot.reservierung}
                onChange={(wert) => a('reservierung', wert)}
                error={errors.reservierung}
                placeholder="Halbtag: Der Vormittag ist für Sie geblockt"
                hint="Leere Eckdaten erscheinen nicht im Angebot."
              />
            </Karte>

            <Karte titel="Leistungen">{leistungsZeilen}</Karte>

            <Karte titel="Preis">
              <Feld
                id="preisRegulaerBezeichnung"
                label="Bezeichnung des regulären Preises"
                value={angebot.preisRegulaerBezeichnung}
                onChange={(wert) => a('preisRegulaerBezeichnung', wert)}
                error={errors.preisRegulaerBezeichnung}
                placeholder="Regulärer Halbtagessatz inkl. Heizung"
                hint="Leer lassen: Im Angebot steht „Regulärer Preis“."
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <Feld
                  id="preisRegulaer"
                  label="Regulärer Preis"
                  inputMode="decimal"
                  einheit="€"
                  value={angebot.preisRegulaer}
                  onChange={(wert) => a('preisRegulaer', wert)}
                  error={errors.preisRegulaer}
                  hint="Gilt, solange kein Angebotspreis eingetragen ist. Mit Angebotspreis steht er durchgestrichen darüber."
                >
                  {standardKnoepfe(angebot.preisRegulaer, (eintrag) => {
                    a('preisRegulaer', betragAlsEingabe(eintrag.preis))
                    // Die Bezeichnung zieht nur mit, solange dort nichts Eigenes steht.
                    if (
                      angebot.preisRegulaerBezeichnung.trim() === '' ||
                      STANDARD.some((s) => s.bezeichnung === angebot.preisRegulaerBezeichnung)
                    ) {
                      a('preisRegulaerBezeichnung', eintrag.bezeichnung)
                    }
                  })}
                </Feld>
                <Feld
                  id="preisAngebot"
                  label="Angebotspreis"
                  inputMode="decimal"
                  einheit="€"
                  value={angebot.preisAngebot}
                  onChange={(wert) => a('preisAngebot', wert)}
                  error={errors.preisAngebot}
                />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Feld
                  id="getraenke"
                  label="Getränke"
                  value={angebot.getraenke}
                  onChange={(wert) => a('getraenke', wert)}
                  error={errors.getraenke}
                  hint="Dritte Zeile der Preistabelle. Leer lassen: keine Zeile."
                />
                <Feld
                  id="stand"
                  label="Stand"
                  value={angebot.stand}
                  onChange={(wert) => a('stand', wert)}
                  error={errors.stand}
                  hint="Datum des Angebots, steht klein am Ende."
                />
              </div>
            </Karte>
          </>
        )}
      </fieldset>

      {!gesperrt && serverError && (
        <div
          role="alert"
          className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
        >
          {serverError}
        </div>
      )}

      {!gesperrt && (
        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" variant="primary" disabled={saving || !bedienbar}>
            {saving ? 'Speichern…' : mode === 'create' ? 'Vertrag anlegen' : 'Änderungen speichern'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push('/admin/contracts')}
            disabled={saving}
          >
            {mode === 'create' ? 'Abbrechen' : 'Zurück zur Liste'}
          </Button>
          {gespeichert && <span className="text-sm text-emerald-300">Gespeichert.</span>}
          {mode === 'edit' && geaendert && (
            <span className="text-sm text-amber-300">
              Ungespeicherte Änderungen stehen noch nicht im PDF.
            </span>
          )}
        </div>
      )}
    </form>
  )
}
