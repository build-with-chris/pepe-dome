'use client'

/**
 * Mithelfen: drei Fragen (Ort, Bereich, Zeit), dann passende Aufgaben als
 * Abrisskarten. Gemerkte Aufgaben gehen mit Name und Kontakt an /api/helfer.
 *
 * Vorlage ist der Prototyp in pepe-dome-mithelfen/prototyp/index.html. Die
 * Orga-Ansicht daraus fehlt bewusst: Das Postfach ist die Liste.
 */

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/textarea'
import { Honeypot, useBotSchutz } from '@/components/newsletter/Honeypot'
import {
  AUFGABEN,
  BEREICHE,
  ZEIT_OPTIONEN,
  aufgabeVon,
  bereichVon,
  bereicheDerAuswahl,
  dauerTeile,
  ortPasst,
  treffer,
  werAntwortet,
  type Aufgabe,
  type OrtWahl,
} from '@/lib/mithelfen'

type Ansicht = 'fragen' | 'alle' | 'formular' | 'fertig'

const ORT_OPTIONEN: { wert: OrtWahl; titel: string; text: string }[] = [
  { wert: 'ort', titel: 'Vor Ort im Ostpark', text: 'Café, Aufbau, Einlass, Küche' },
  { wert: 'remote', titel: 'Von zuhause', text: 'Schreiben, Website, Planung' },
  { wert: 'beides', titel: 'Beides geht', text: 'Zeig mir alles' },
]

const auswahlKlasse = (an: boolean) =>
  [
    'text-left rounded-xl border p-4 flex flex-col gap-1 transition-colors',
    an
      ? 'border-[var(--pepe-gold)] bg-[var(--pepe-gold)]/15'
      : 'border-[var(--pepe-line)] bg-[var(--pepe-ink)] hover:border-[var(--pepe-t48)]',
  ].join(' ')

function Fortschritt({ frage }: { frage: number }) {
  return (
    <div className="flex items-center gap-2 text-sm text-[var(--pepe-t64)]">
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className={`h-1.5 flex-1 rounded-full ${i <= frage ? 'bg-[var(--pepe-gold)]' : 'bg-[var(--pepe-line)]'}`}
        />
      ))}
      <span className="whitespace-nowrap font-medium">Frage {frage} von 3</span>
    </div>
  )
}

function Karte({ a, gemerkt, umschalten }: { a: Aufgabe; gemerkt: boolean; umschalten: () => void }) {
  const [zahl, einheit] = dauerTeile(a.dauerMinuten)
  const bereich = bereichVon(a.bereich)
  return (
    <article
      className={`grid grid-cols-[76px_1fr] sm:grid-cols-[92px_1fr] overflow-hidden rounded-xl border bg-[var(--pepe-ink)] ${
        gemerkt ? 'border-[var(--pepe-gold)]' : 'border-[var(--pepe-line)]'
      }`}
    >
      <div className="flex flex-col items-center justify-center gap-0.5 border-r-2 border-dashed border-[var(--pepe-black)] bg-[var(--pepe-gold)] px-2 py-4 text-center text-white">
        <b className="text-2xl sm:text-3xl leading-none tabular-nums">{zahl}</b>
        <span className="text-xs font-semibold">{einheit}</span>
        <em className="mt-1.5 text-[11px] not-italic leading-tight opacity-90">{a.rhythmus}</em>
      </div>
      <div className="flex min-w-0 flex-col gap-2 p-4">
        <div className="flex flex-wrap gap-2 text-xs font-semibold text-[var(--pepe-t64)]">
          <span>{bereich?.name}</span>
          <span>·</span>
          <span>{a.ort === 'ort' ? 'Vor Ort' : 'Von zuhause'}</span>
        </div>
        <h3 className="text-lg font-bold leading-snug text-[var(--pepe-white)]">{a.titel}</h3>
        <ul className="list-disc space-y-0.5 pl-5 text-sm text-[var(--pepe-t80)]">
          {a.schritte.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <p className="text-sm text-[var(--pepe-t64)]">{a.voraussetzung}</p>
        <button
          type="button"
          onClick={umschalten}
          aria-pressed={gemerkt}
          className={`mt-1 self-start rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
            gemerkt
              ? 'border-[var(--pepe-gold)] bg-[var(--pepe-gold)] text-white'
              : 'border-[var(--pepe-t48)] text-[var(--pepe-white)] hover:border-[var(--pepe-white)]'
          }`}
        >
          {gemerkt ? 'Gemerkt ✓' : 'Das würde ich machen'}
        </button>
      </div>
    </article>
  )
}

export default function MithelfenClient() {
  const [ansicht, setAnsicht] = useState<Ansicht>('fragen')
  const [frage, setFrage] = useState(1)
  const [ort, setOrt] = useState<OrtWahl | null>(null)
  const [bereiche, setBereiche] = useState<string[]>([])
  const [zeit, setZeit] = useState<number | null>(null)
  const [gemerkt, setGemerkt] = useState<string[]>([])
  const [filter, setFilter] = useState('alle')

  const [form, setForm] = useState({ name: '', kontakt: '', notiz: '', einwilligung: false })
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [fehler, setFehler] = useState('')
  const [gemeldet, setGemeldet] = useState<{ name: string; aufgaben: string[] } | null>(null)
  const { honeypotProps, botFelder } = useBotSchutz()

  const nachOben = () => window.scrollTo({ top: 0 })
  const gehe = (a: Ansicht) => {
    setAnsicht(a)
    nachOben()
  }
  const neuStarten = () => {
    setFrage(1)
    setOrt(null)
    setBereiche([])
    setZeit(null)
    gehe('fragen')
  }
  const merken = (id: string) =>
    setGemerkt((g) => (g.includes(id) ? g.filter((x) => x !== id) : [...g, id]))

  const absenden = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setFehler('')
    try {
      const res = await fetch('/api/helfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, aufgaben: gemerkt, ...botFelder() }),
      })
      const json = await res.json().catch(() => null)
      if (!res.ok) {
        setStatus('error')
        setFehler(
          json?.error?.details?.[0]?.message ||
            json?.error?.message ||
            'Etwas ist schiefgelaufen. Bitte versuche es später erneut.'
        )
        return
      }
      setGemeldet({ name: form.name.trim(), aufgaben: gemerkt })
      setGemerkt([])
      setForm({ name: '', kontakt: '', notiz: '', einwilligung: false })
      setStatus('idle')
      gehe('fertig')
    } catch {
      setStatus('error')
      setFehler('Keine Verbindung. Bitte versuche es gleich noch einmal.')
    }
  }

  const leisteZeigen = gemerkt.length > 0 && (ansicht === 'fragen' || ansicht === 'alle')
  const karten = (liste: Aufgabe[]) => (
    <div className="grid gap-4">
      {liste.map((a) => (
        <Karte key={a.id} a={a} gemerkt={gemerkt.includes(a.id)} umschalten={() => merken(a.id)} />
      ))}
    </div>
  )

  let inhalt: React.ReactNode

  if (ansicht === 'formular') {
    const auswahl = gemerkt.map(aufgabeVon).filter(Boolean) as Aufgabe[]
    inhalt = (
      <>
        <h1 className="text-3xl font-bold text-[var(--pepe-white)]">Fast geschafft</h1>
        <div className="rounded-xl border border-[var(--pepe-line)] bg-[var(--pepe-ink)] p-4">
          <strong className="text-[var(--pepe-white)]">Deine Auswahl</strong>
          <ul className="mt-2 list-disc pl-5 text-[var(--pepe-t80)]">
            {auswahl.map((a) => (
              <li key={a.id}>
                {a.titel} ({dauerTeile(a.dauerMinuten).join(' ')})
              </li>
            ))}
          </ul>
        </div>
        <form onSubmit={absenden} className="grid gap-5" noValidate>
          <Honeypot {...honeypotProps} />
          <div>
            <label htmlFor="h-name" className="mb-2 block text-sm font-medium text-[var(--pepe-t80)]">
              Dein Name *
            </label>
            <Input
              id="h-name"
              autoComplete="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              disabled={status === 'loading'}
            />
          </div>
          <div>
            <label htmlFor="h-kontakt" className="mb-2 block text-sm font-medium text-[var(--pepe-t80)]">
              E-Mail oder Telefonnummer *
            </label>
            <Input
              id="h-kontakt"
              autoComplete="email"
              value={form.kontakt}
              onChange={(e) => setForm({ ...form, kontakt: e.target.value })}
              disabled={status === 'loading'}
            />
          </div>
          <div>
            <label htmlFor="h-notiz" className="mb-2 block text-sm font-medium text-[var(--pepe-t80)]">
              Wann passt es dir? (freiwillig)
            </label>
            <Textarea
              id="h-notiz"
              placeholder="z. B. samstags, abends ab 18 Uhr"
              value={form.notiz}
              onChange={(e) => setForm({ ...form, notiz: e.target.value })}
              disabled={status === 'loading'}
            />
          </div>
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="h-einwilligung"
              checked={form.einwilligung}
              onChange={(e) => setForm({ ...form, einwilligung: e.target.checked })}
              disabled={status === 'loading'}
              className="mt-1 h-4 w-4 rounded border-[var(--pepe-line)] bg-[var(--pepe-surface)]"
            />
            <label htmlFor="h-einwilligung" className="text-sm text-[var(--pepe-t64)]">
              Meine Angaben dürfen an die Ansprechpersonen der gewählten Bereiche gehen, damit sie sich bei mir
              melden. Mehr dazu in der{' '}
              <Link href="/de/datenschutz" className="text-[var(--pepe-accent-text)] underline">
                Datenschutzerklärung
              </Link>
              . *
            </label>
          </div>
          {status === 'error' && fehler && (
            <p className="rounded-lg border border-[var(--pepe-error)]/30 bg-[var(--pepe-error)]/10 p-3 text-sm text-[var(--pepe-error)]">
              {fehler}
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="secondary" onClick={() => gehe('fragen')} disabled={status === 'loading'}>
              Zurück
            </Button>
            <Button type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? 'Wird gesendet …' : 'Interesse melden'}
            </Button>
          </div>
        </form>
      </>
    )
  } else if (ansicht === 'fertig' && gemeldet) {
    inhalt = (
      <>
        <h1 className="text-3xl font-bold text-[var(--pepe-white)]">
          Danke, {gemeldet.name.split(/\s+/)[0]}. Deine Meldung ist da.
        </h1>
        <div className="grid gap-2 rounded-xl border border-[var(--pepe-line)] bg-[var(--pepe-ink)] p-4">
          <p className="font-semibold text-[var(--pepe-success)]">Innerhalb von 48 Stunden meldet sich jemand bei dir:</p>
          <ul className="list-disc pl-5 text-[var(--pepe-t80)]">
            {bereicheDerAuswahl(gemeldet.aufgaben).map((b) => (
              <li key={b.id}>
                {werAntwortet(b)} {b.ansprechperson.trim() ? `für ${b.name}` : ''}
              </li>
            ))}
          </ul>
          <p className="text-sm text-[var(--pepe-t64)]">
            Bis dahin musst du nichts tun. Termin und Einweisung klärt ihr im Gespräch.
          </p>
        </div>
        <div>
          <Button variant="secondary" onClick={neuStarten}>
            Weitere Aufgaben ansehen
          </Button>
        </div>
      </>
    )
  } else if (ansicht === 'alle') {
    const liste = AUFGABEN.filter((a) => filter === 'alle' || filter === a.ort || filter === a.bereich).sort(
      (a, b) => a.dauerMinuten - b.dauerMinuten
    )
    const chip = (wert: string, text: string) => (
      <button
        key={wert}
        type="button"
        aria-pressed={filter === wert}
        onClick={() => setFilter(wert)}
        className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${
          filter === wert
            ? 'border-[var(--pepe-gold)] bg-[var(--pepe-gold)] text-white'
            : 'border-[var(--pepe-line)] bg-[var(--pepe-ink)] text-[var(--pepe-t80)]'
        }`}
      >
        {text}
      </button>
    )
    inhalt = (
      <>
        <h1 className="text-3xl font-bold text-[var(--pepe-white)]">Alle Aufgaben im Pepe Dome</h1>
        <div className="flex flex-wrap gap-2">
          {chip('alle', 'Alle')}
          {chip('ort', 'Vor Ort')}
          {chip('remote', 'Von zuhause')}
          {BEREICHE.map((b) => chip(b.id, b.name))}
        </div>
        <p className="text-sm text-[var(--pepe-t64)]">{liste.length} Aufgaben, kürzeste zuerst.</p>
        {karten(liste)}
        <div>
          <Button variant="secondary" onClick={neuStarten}>
            Zu den drei Fragen
          </Button>
        </div>
      </>
    )
  } else if (frage === 1) {
    inhalt = (
      <>
        <h1 className="text-3xl md:text-4xl font-bold leading-tight text-[var(--pepe-white)]">
          Du willst im Pepe Dome mithelfen? Hier findest du deine Aufgabe.
        </h1>
        <p className="max-w-prose text-[var(--pepe-t80)]">
          Drei Fragen, dann siehst du passende Aufgaben mit Dauer und Ablauf. Du meldest Interesse, wir melden uns
          bei dir.
        </p>
        <Fortschritt frage={1} />
        <h2 className="text-xl font-bold text-[var(--pepe-white)]">Wo möchtest du helfen?</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {ORT_OPTIONEN.map((o) => (
            <button
              key={o.wert}
              type="button"
              aria-pressed={ort === o.wert}
              className={auswahlKlasse(ort === o.wert)}
              onClick={() => {
                setOrt(o.wert)
                setBereiche([])
                setFrage(2)
                nachOben()
              }}
            >
              <strong className="text-[var(--pepe-white)]">{o.titel}</strong>
              <small className="text-sm text-[var(--pepe-t64)]">{o.text}</small>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => gehe('alle')}
          className="self-start text-sm font-medium text-[var(--pepe-accent-text)] underline-offset-4 hover:underline"
        >
          Lieber gleich alle {AUFGABEN.length} Aufgaben ansehen
        </button>
      </>
    )
  } else if (frage === 2) {
    const verfuegbar = BEREICHE.filter((b) => AUFGABEN.some((a) => a.bereich === b.id && ortPasst(a, ort)))
    inhalt = (
      <>
        <Fortschritt frage={2} />
        <h2 className="text-xl font-bold text-[var(--pepe-white)]">Was liegt dir?</h2>
        <p className="text-[var(--pepe-t80)]">Mehrere Antworten möglich. Ohne Auswahl zeigen wir dir alle Bereiche.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {verfuegbar.map((b) => {
            const n = AUFGABEN.filter((a) => a.bereich === b.id && ortPasst(a, ort)).length
            const an = bereiche.includes(b.id)
            return (
              <button
                key={b.id}
                type="button"
                aria-pressed={an}
                className={auswahlKlasse(an)}
                onClick={() => setBereiche((x) => (an ? x.filter((y) => y !== b.id) : [...x, b.id]))}
              >
                <strong className="text-[var(--pepe-white)]">{b.name}</strong>
                <small className="text-sm text-[var(--pepe-t64)]">
                  {n} {n === 1 ? 'Aufgabe' : 'Aufgaben'}
                </small>
              </button>
            )
          })}
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => setFrage(1)}>
            Zurück
          </Button>
          <Button
            onClick={() => {
              setFrage(3)
              nachOben()
            }}
          >
            Weiter
          </Button>
        </div>
      </>
    )
  } else if (frage === 3) {
    inhalt = (
      <>
        <Fortschritt frage={3} />
        <h2 className="text-xl font-bold text-[var(--pepe-white)]">Wie viel Zeit hast du für einen Einsatz?</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {ZEIT_OPTIONEN.map((z) => (
            <button
              key={z.label}
              type="button"
              aria-pressed={zeit === z.minuten}
              className={auswahlKlasse(zeit === z.minuten)}
              onClick={() => {
                setZeit(z.minuten)
                setFrage(4)
                nachOben()
              }}
            >
              <strong className="text-[var(--pepe-white)]">{z.label}</strong>
            </button>
          ))}
        </div>
        <div>
          <Button variant="secondary" onClick={() => setFrage(2)}>
            Zurück
          </Button>
        </div>
      </>
    )
  } else {
    const { liste, gelockert } = treffer(ort, bereiche, zeit ?? Infinity)
    inhalt = (
      <>
        <h1 className="text-3xl font-bold text-[var(--pepe-white)]">
          {liste.length} {liste.length === 1 ? 'Aufgabe passt' : 'Aufgaben passen'} zu dir
        </h1>
        <p className="text-[var(--pepe-t80)]">
          {gelockert
            ? 'In deinem Zeitrahmen gibt es gerade nichts. Das sind die Aufgaben aus deinen Bereichen mit längerer Dauer.'
            : 'Merke dir eine oder mehrere. Die Zeit links ist die Dauer eines Einsatzes.'}
        </p>
        {liste.length ? (
          karten(liste)
        ) : (
          <p className="rounded-xl border border-[var(--pepe-line)] bg-[var(--pepe-ink)] p-4 text-[var(--pepe-t80)]">
            Für diese Auswahl gibt es keine Aufgabe.
          </p>
        )}
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={neuStarten}>
            Neu starten
          </Button>
          <Button variant="ghost" onClick={() => gehe('alle')}>
            Alle Aufgaben ansehen
          </Button>
        </div>
      </>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--pepe-black)] pb-28">
      <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-10 md:py-16">
        <p className="self-start rounded-full border border-[var(--pepe-line)] px-3 py-1 text-xs font-medium text-[var(--pepe-t64)]">
          Testversion · noch nicht verlinkt
        </p>
        {inhalt}
      </div>

      {leisteZeigen && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--pepe-gold)] bg-[var(--pepe-ink)]">
          <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-3">
            <span className="text-[var(--pepe-white)]">
              {gemerkt.length} {gemerkt.length === 1 ? 'Aufgabe gemerkt' : 'Aufgaben gemerkt'}
            </span>
            <Button onClick={() => gehe('formular')}>Weiter</Button>
          </div>
        </div>
      )}
    </div>
  )
}
