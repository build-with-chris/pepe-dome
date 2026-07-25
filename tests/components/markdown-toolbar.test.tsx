/**
 * MarkdownToolbar
 *
 * Die Leiste ersetzt das Tippen von Sternchen und Rauten von Hand. Der Test
 * prüft das, worauf sich die Redaktion verlässt: die Zeichen landen um die
 * Markierung herum, nicht irgendwo im Text, und ein zweiter Klick nimmt die
 * Formatierung wieder zurück.
 */

import { useRef, useState } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import MarkdownToolbar from '@/components/admin/ui/MarkdownToolbar'

/** Nachbau der Einbindung im Formular: Leiste plus kontrolliertes Textfeld */
function Harness({ initial = '' }: { initial?: string }) {
  const ref = useRef<HTMLTextAreaElement>(null)
  const [value, setValue] = useState(initial)

  return (
    <>
      <MarkdownToolbar textareaRef={ref} value={value} onChange={setValue} />
      <textarea
        ref={ref}
        aria-label="Inhalt"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </>
  )
}

/** Markiert einen Bereich im Textfeld, so wie es ein Doppelklick täte */
function select(textarea: HTMLTextAreaElement, start: number, end: number) {
  textarea.focus()
  textarea.setSelectionRange(start, end)
}

describe('MarkdownToolbar', () => {
  it('legt Sternchen um die Markierung', () => {
    render(<Harness initial="Heute ist Premiere" />)
    const textarea = screen.getByLabelText('Inhalt') as HTMLTextAreaElement

    select(textarea, 10, 18) // "Premiere"
    fireEvent.click(screen.getByRole('button', { name: 'Fett' }))

    expect(textarea.value).toBe('Heute ist **Premiere**')
  })

  it('nimmt die Formatierung beim zweiten Klick wieder zurück', () => {
    render(<Harness initial="Heute ist **Premiere**" />)
    const textarea = screen.getByLabelText('Inhalt') as HTMLTextAreaElement

    select(textarea, 12, 20) // "Premiere" innerhalb der Sternchen
    fireEvent.click(screen.getByRole('button', { name: 'Fett' }))

    expect(textarea.value).toBe('Heute ist Premiere')
  })

  it('setzt einen Platzhalter, wenn nichts markiert ist', () => {
    render(<Harness />)
    const textarea = screen.getByLabelText('Inhalt') as HTMLTextAreaElement

    select(textarea, 0, 0)
    fireEvent.click(screen.getByRole('button', { name: 'Kursiv' }))

    expect(textarea.value).toBe('*kursiver Text*')
  })

  it('stellt jeder markierten Zeile den Listenpunkt voran', () => {
    render(<Harness initial={'Jonglage\nAkrobatik\nMusik'} />)
    const textarea = screen.getByLabelText('Inhalt') as HTMLTextAreaElement

    select(textarea, 0, 18) // erste beide Zeilen, "Musik" bleibt unberuhrt
    fireEvent.click(screen.getByRole('button', { name: 'Aufzahlung' }))

    expect(textarea.value).toBe('- Jonglage\n- Akrobatik\nMusik')
  })

  it('macht aus einer Zeile mitten im Text eine Uberschrift', () => {
    render(<Harness initial={'Erste Zeile\nZweite Zeile'} />)
    const textarea = screen.getByLabelText('Inhalt') as HTMLTextAreaElement

    // Cursor irgendwo in der zweiten Zeile, nicht am Zeilenanfang
    select(textarea, 15, 15)
    fireEvent.click(screen.getByRole('button', { name: 'Uberschrift' }))

    expect(textarea.value).toBe('Erste Zeile\n## Zweite Zeile')
  })

  it('baut einen Link um die Markierung', () => {
    render(<Harness initial="Tickets hier" />)
    const textarea = screen.getByLabelText('Inhalt') as HTMLTextAreaElement

    select(textarea, 0, 7) // "Tickets"
    fireEvent.click(screen.getByRole('button', { name: 'Link einfugen' }))

    expect(textarea.value).toBe('[Tickets](https://) hier')
  })

  it('blendet Uberschrift und Zitat in der schmalen Variante aus', () => {
    render(
      <MarkdownToolbar
        textareaRef={{ current: null }}
        value=""
        onChange={() => {}}
        variant="inline"
      />
    )

    expect(screen.queryByRole('button', { name: 'Uberschrift' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Zitat' })).toBeNull()
    expect(screen.getByRole('button', { name: 'Fett' })).toBeTruthy()
  })
})
