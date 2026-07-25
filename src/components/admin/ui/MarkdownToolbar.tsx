'use client'

import { useCallback, type RefObject } from 'react'

/**
 * Formatier-Leiste für die Markdown-Textfelder im Admin
 *
 * Artikeltext, Event-Beschreibung und Newsletter-Intro werden als Markdown
 * gespeichert und beim Anzeigen gerendert. Bisher stand unter dem Feld nur ein
 * Spickzettel ("**fett**, # Überschrift"), die Redaktion musste die Zeichen
 * also auswendig kennen und von Hand setzen. Fett schreiben ist damit
 * umständlicher als in jedem Textprogramm, und falsch gesetzte Sternchen fallen
 * erst nach dem Speichern auf.
 *
 * Die Leiste setzt die Zeichen um die Markierung herum und gibt den Cursor
 * anschließend an die Stelle zurück, an der weitergeschrieben wird. Ohne
 * Markierung wird ein Platzhalter eingefügt und gleich markiert, damit man
 * direkt lostippen kann.
 */

interface MarkdownToolbarProps {
  /** Das zugehörige Textfeld */
  textareaRef: RefObject<HTMLTextAreaElement | null>
  /** Aktueller Inhalt des Felds */
  value: string
  /** Wird mit dem neuen Inhalt aufgerufen */
  onChange: (next: string) => void
  /** Überschriften und Zitate ergeben in kurzen Feldern wenig Sinn */
  variant?: 'full' | 'inline'
}

type Edit = { value: string; selectionStart: number; selectionEnd: number }

/** Legt Zeichen um die Markierung, z.B. **fett** */
function wrap(
  value: string,
  start: number,
  end: number,
  marker: string,
  placeholder: string
): Edit {
  const selected = value.slice(start, end)
  const inner = selected || placeholder
  const before = value.slice(0, start)
  const after = value.slice(end)

  // Schon formatiert? Dann Formatierung wieder entfernen, statt sie zu verdoppeln.
  if (
    before.endsWith(marker) &&
    after.startsWith(marker) &&
    selected.length > 0
  ) {
    return {
      value: before.slice(0, -marker.length) + selected + after.slice(marker.length),
      selectionStart: start - marker.length,
      selectionEnd: end - marker.length,
    }
  }

  return {
    value: `${before}${marker}${inner}${marker}${after}`,
    selectionStart: start + marker.length,
    selectionEnd: start + marker.length + inner.length,
  }
}

/** Stellt jeder markierten Zeile ein Präfix voran, z.B. "- " oder "## " */
function prefixLines(
  value: string,
  start: number,
  end: number,
  prefix: string,
  placeholder: string
): Edit {
  // Auf ganze Zeilen ausdehnen: eine Überschrift beginnt am Zeilenanfang,
  // egal wo in der Zeile der Cursor gerade steht.
  const lineStart = value.lastIndexOf('\n', start - 1) + 1
  const lineEndIndex = value.indexOf('\n', end)
  const lineEnd = lineEndIndex === -1 ? value.length : lineEndIndex

  const block = value.slice(lineStart, lineEnd) || placeholder
  const lines = block.split('\n')
  const allPrefixed = lines.every((line) => line.startsWith(prefix))

  const nextBlock = lines
    .map((line) => (allPrefixed ? line.slice(prefix.length) : `${prefix}${line}`))
    .join('\n')

  return {
    value: value.slice(0, lineStart) + nextBlock + value.slice(lineEnd),
    selectionStart: lineStart,
    selectionEnd: lineStart + nextBlock.length,
  }
}

/** [Text](URL) mit vormarkierter Adresse */
function insertLink(value: string, start: number, end: number): Edit {
  const selected = value.slice(start, end) || 'Linktext'
  const url = 'https://'
  const snippet = `[${selected}](${url})`
  return {
    value: value.slice(0, start) + snippet + value.slice(end),
    // Cursor hinter "https://", dort geht es weiter
    selectionStart: start + selected.length + 3 + url.length,
    selectionEnd: start + selected.length + 3 + url.length,
  }
}

/**
 * Die Knöpfe stehen bewusst außerhalb der Komponente: als Modul-Konstante sind
 * es reine Funktionen über (Text, Auswahl). Würden sie im Rendern gebaut und
 * dabei den Ref einfangen, wäre die Liste selbst ein Ref-Wert, und React
 * beanstandet zu Recht jeden Zugriff darauf während des Renderns.
 */
const ACTIONS: {
  label: string
  title: string
  /** Überschrift und Zitat ergeben nur im großen Textfeld Sinn */
  fullOnly?: boolean
  style?: 'bold' | 'italic'
  apply: (value: string, start: number, end: number) => Edit
}[] = [
  {
    label: 'F',
    title: 'Fett',
    style: 'bold',
    apply: (v, s, e) => wrap(v, s, e, '**', 'fetter Text'),
  },
  {
    label: 'K',
    title: 'Kursiv',
    style: 'italic',
    apply: (v, s, e) => wrap(v, s, e, '*', 'kursiver Text'),
  },
  {
    label: 'H2',
    title: 'Uberschrift',
    fullOnly: true,
    apply: (v, s, e) => prefixLines(v, s, e, '## ', 'Uberschrift'),
  },
  {
    label: 'Liste',
    title: 'Aufzahlung',
    apply: (v, s, e) => prefixLines(v, s, e, '- ', 'Punkt'),
  },
  {
    label: 'Zitat',
    title: 'Zitat',
    fullOnly: true,
    apply: (v, s, e) => prefixLines(v, s, e, '> ', 'Zitat'),
  },
  {
    label: 'Link',
    title: 'Link einfugen',
    apply: (v, s, e) => insertLink(v, s, e),
  },
]

export default function MarkdownToolbar({
  textareaRef,
  value,
  onChange,
  variant = 'full',
}: MarkdownToolbarProps) {
  const applyEdit = useCallback(
    (edit: Edit) => {
      onChange(edit.value)
      // Der Wert kommt über den State zurück, deshalb erst im nächsten Frame
      // die Auswahl setzen. Sonst überschreibt React sie sofort wieder.
      requestAnimationFrame(() => {
        const el = textareaRef.current
        if (!el) return
        el.focus()
        el.setSelectionRange(edit.selectionStart, edit.selectionEnd)
      })
    },
    [onChange, textareaRef]
  )

  const run = useCallback(
    (action: (value: string, start: number, end: number) => Edit) => {
      const el = textareaRef.current
      const start = el?.selectionStart ?? value.length
      const end = el?.selectionEnd ?? value.length
      applyEdit(action(value, start, end))
    },
    [applyEdit, textareaRef, value]
  )

  const actions = variant === 'full' ? ACTIONS : ACTIONS.filter((a) => !a.fullOnly)

  return (
    <div
      className="flex flex-wrap items-center gap-1 rounded-lg border border-white/[0.08] bg-white/[0.03] p-1.5"
      role="toolbar"
      aria-label="Textformatierung"
    >
      {actions.map((action) => (
        <button
          key={action.label}
          type="button"
          title={action.title}
          aria-label={action.title}
          onClick={() => run(action.apply)}
          className={
            'min-w-[38px] rounded-md px-2.5 py-1.5 text-[13px] font-semibold text-white/70 ' +
            'transition-colors hover:bg-white/[0.08] hover:text-white ' +
            'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#016dca] ' +
            (action.style === 'bold' ? 'font-bold ' : '') +
            (action.style === 'italic' ? 'italic ' : '')
          }
        >
          {action.label}
        </button>
      ))}
    </div>
  )
}
