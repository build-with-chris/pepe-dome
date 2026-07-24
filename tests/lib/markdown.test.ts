import { describe, it, expect } from 'vitest'
import { parseMarkdown, parseInline, markdownToPlainText, hasMarkdown } from '@/lib/markdown'

describe('parseInline', () => {
  it('erkennt fett, kursiv und Links', () => {
    const nodes = parseInline('Ganz **wichtig** und *fein*, siehe [hier](https://x.de)')
    const types = nodes.map((n) => n.type)
    expect(types).toContain('bold')
    expect(types).toContain('italic')
    expect(types).toContain('link')
  })

  it('parst Link-Inhalte rekursiv', () => {
    const nodes = parseInline('[**Tickets**](https://x.de)')
    const link = nodes.find((n) => n.type === 'link')
    expect(link).toBeTruthy()
    if (link && link.type === 'link') {
      expect(link.href).toBe('https://x.de')
      expect(link.children[0].type).toBe('bold')
    }
  })

  it('lässt reinen Text unangetastet', () => {
    const nodes = parseInline('einfach nur Text')
    expect(nodes).toHaveLength(1)
    expect(nodes[0]).toEqual({ type: 'text', value: 'einfach nur Text' })
  })
})

describe('parseMarkdown', () => {
  it('trennt Überschriften, Absätze und Listen', () => {
    const md = [
      '## Kurse',
      '',
      'Ab sofort geht es wieder los.',
      '',
      '- Akrobatik',
      '- Luftakrobatik',
      '',
      '> Ohne Leistungsdruck.',
      '',
      '---',
    ].join('\n')

    const blocks = parseMarkdown(md)
    const types = blocks.map((b) => b.type)
    expect(types).toEqual(['heading', 'paragraph', 'list', 'quote', 'hr'])

    const list = blocks.find((b) => b.type === 'list')
    if (list && list.type === 'list') {
      expect(list.ordered).toBe(false)
      expect(list.items).toHaveLength(2)
    }
  })

  it('fasst mehrzeilige Absätze zusammen', () => {
    const blocks = parseMarkdown('Zeile eins\nZeile zwei\n\nNeuer Absatz')
    expect(blocks).toHaveLength(2)
    expect(blocks[0].type).toBe('paragraph')
  })

  it('erkennt geordnete Listen', () => {
    const blocks = parseMarkdown('1. erstens\n2. zweitens')
    expect(blocks[0].type).toBe('list')
    if (blocks[0].type === 'list') expect(blocks[0].ordered).toBe(true)
  })

  it('kommt mit leerem Input zurecht', () => {
    expect(parseMarkdown('')).toEqual([])
    expect(parseMarkdown(null)).toEqual([])
  })
})

describe('markdownToPlainText', () => {
  it('entfernt Syntax und behält Link-Ziele', () => {
    const text = markdownToPlainText('## Titel\n\nEin **fetter** [Link](https://x.de).')
    expect(text).toContain('TITEL')
    expect(text).toContain('fetter')
    expect(text).not.toContain('**')
    expect(text).toContain('https://x.de')
  })

  it('macht aus Listen Aufzählungszeilen', () => {
    const text = markdownToPlainText('- eins\n- zwei')
    expect(text).toContain('• eins')
    expect(text).toContain('• zwei')
  })
})

describe('hasMarkdown', () => {
  it('erkennt Markdown-Auszeichnung', () => {
    expect(hasMarkdown('## Titel')).toBe(true)
    expect(hasMarkdown('ein **fett** Wort')).toBe(true)
    expect(hasMarkdown('- Liste')).toBe(true)
    expect(hasMarkdown('[x](https://y.de)')).toBe(true)
  })

  it('erkennt reinen Fließtext als Nicht-Markdown', () => {
    expect(hasMarkdown('Nur ganz normaler Fließtext ohne alles.')).toBe(false)
    expect(hasMarkdown('')).toBe(false)
  })
})
