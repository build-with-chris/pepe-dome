'use client'

import { useState } from 'react'
import FieldHint from '@/components/admin/ui/FieldHint'
import type { KitField } from '@/lib/channel-kit/types'

/**
 * Ein Feld des Kanal-Kits: Beschriftung, Zeichenzähler, Kopierknopf.
 *
 * Der Text ist bewusst nicht bearbeitbar. Er wird bei jedem Aufruf aus dem
 * Event erzeugt, eine Änderung hier wäre beim nächsten Laden wieder weg.
 * Angepasst wird nach dem Einfügen im Portal, oder am Event selbst.
 */

/** Kopieren mit Rückfallweg für Browser ohne Clipboard-API (wie in ShareButtons). */
export async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.opacity = '0'
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
  }
}

export function CopyButton({
  text,
  label = 'Kopieren',
  disabled = false,
}: {
  text: string
  label?: string
  disabled?: boolean
}) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await copyToClipboard(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={disabled || text.length === 0}
      className="shrink-0 rounded-md border border-white/[0.12] px-2.5 py-1 text-[11px] font-medium text-white/70 transition-colors hover:border-[#016dca]/50 hover:text-[#016dca] disabled:cursor-not-allowed disabled:opacity-40"
      aria-label={`${label}: ${text.slice(0, 40)}`}
    >
      {copied ? 'Kopiert' : label}
    </button>
  )
}

function counterClass(field: KitField): string {
  if (field.max === null) return 'text-white/35'
  if (field.overLimit) return 'text-red-400'
  if (field.length >= field.max * 0.9) return 'text-amber-400'
  return 'text-white/35'
}

/**
 * Woher kommt die Zahl im Zähler?
 *
 * Ein Portallimit schneidet beim Einfügen hart ab, eine eigene Vorgabe kostet
 * nur Wirkung, und eine Annahme ist bloß geraten. Das sind drei verschiedene
 * Aussagen, und wer den Zähler liest, soll sie unterscheiden können.
 */
const ORIGIN_MARK: Record<string, { mark: string; title: string }> = {
  redaktion: {
    mark: '~',
    title: 'Eigene Vorgabe. Das Portal erlaubt mehr, aber längerer Text wird dort zusammengeklappt.',
  },
  annahme: {
    mark: '?',
    title: 'Angenommen, nicht am echten Formular nachgemessen.',
  },
}

export default function CopyField({ field }: { field: KitField }) {
  const missing = field.missing !== null

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[12px] font-medium text-white/80">{field.label}</span>

        <div className="flex items-center gap-2.5">
          {field.max !== null && !missing && (
            <span className={`font-mono text-[11px] tabular-nums ${counterClass(field)}`}>
              {field.length} / {field.max}
              {field.limitOrigin && ORIGIN_MARK[field.limitOrigin] && (
                <span
                  className="ml-1 cursor-help text-white/30"
                  title={ORIGIN_MARK[field.limitOrigin].title}
                >
                  {ORIGIN_MARK[field.limitOrigin].mark}
                </span>
              )}
            </span>
          )}
          {!missing && <CopyButton text={field.value} />}
        </div>
      </div>

      {missing ? (
        <p className="rounded-lg border border-amber-500/30 bg-amber-500/[0.06] px-3 py-2.5 text-[12px] leading-relaxed text-amber-200/90">
          {field.missing}
        </p>
      ) : (
        <pre
          className={`max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-lg border bg-black/40 px-3 py-2.5 font-mono text-[12px] leading-relaxed text-white/80 ${
            field.overLimit ? 'border-red-500/50' : 'border-white/[0.08]'
          } ${field.multiline ? 'min-h-[72px]' : ''}`}
        >
          {field.value}
        </pre>
      )}

      {field.overLimit && (
        <p className="text-[11px] leading-relaxed text-red-400">
          Zu lang für dieses Feld und nicht sinnvoll kürzbar, ohne ein Wort oder einen
          Link zu zerschneiden. Bitte den Text am Event kürzen.
        </p>
      )}

      {field.truncated && (
        <p className="text-[11px] leading-relaxed text-amber-400/80">
          {field.limitOrigin === 'redaktion'
            ? 'Auf unsere eigene Vorgabe gekürzt. Länger wäre erlaubt, würde dort aber zusammengeklappt.'
            : 'Für dieses Feld gekürzt. Der vollständige Text steht weiter auf der eigenen Event-Seite.'}
        </p>
      )}

      {field.hint && <FieldHint>{field.hint}</FieldHint>}
    </div>
  )
}
