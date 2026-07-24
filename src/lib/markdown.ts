/**
 * Kleiner Markdown-Parser für redaktionelle Newsletter-Texte
 *
 * Zweck: Der Einstiegstext und freie Abschnitte sollen sich mit Überschriften,
 * Absätzen, Hervorhebungen und Listen flüssig lesen, statt als eine Wand aus
 * `pre-wrap`-Fließtext zu erscheinen.
 *
 * Bewusst ohne externe Abhängigkeit und bewusst auf eine kleine, für
 * E-Mails sinnvolle Teilmenge beschränkt. Kein HTML-Passthrough (E-Mail-
 * Sicherheit), keine verschachtelten Listen, keine Codeblöcke, keine Bilder
 * (Bilder sind im Newsletter eigene Inhaltselemente).
 *
 * Der Parser liefert ein Blockmodell. Wie daraus HTML wird, entscheiden die
 * Renderer: einer inline-gestylt für die E-Mail, einer mit Klassen fürs Web.
 * So gibt es genau eine Parselogik und zwei Darstellungen.
 */

export type MarkdownInline =
  | { type: 'text'; value: string }
  | { type: 'bold'; children: MarkdownInline[] }
  | { type: 'italic'; children: MarkdownInline[] }
  | { type: 'link'; href: string; children: MarkdownInline[] }

export type MarkdownBlock =
  | { type: 'heading'; level: 2 | 3; children: MarkdownInline[] }
  | { type: 'paragraph'; children: MarkdownInline[] }
  | { type: 'list'; ordered: boolean; items: MarkdownInline[][] }
  | { type: 'quote'; children: MarkdownInline[] }
  | { type: 'hr' }

// Reihenfolge der Alternativen zählt: Link vor Bold vor Italic.
// Als String, weil parseInline sich selbst aufruft (verschachtelte Auszeichnung).
// Ein geteiltes /g-RegExp würde dabei seinen lastIndex gegenseitig zerschießen
// und die äußere Schleife endlos laufen lassen. Deshalb pro Aufruf eine
// eigene Instanz.
const INLINE_SOURCE =
  '\\[([^\\]]+)\\]\\(([^)\\s]+)\\)|\\*\\*([^*]+?)\\*\\*|__([^_]+?)__|\\*([^*\\s][^*]*?)\\*|_([^_\\s][^_]*?)_'

/**
 * Zerlegt eine Zeile in Inline-Spans (Text, fett, kursiv, Link).
 * Fett/Kursiv/Link-Inhalte werden rekursiv geparst, damit z. B.
 * `[**Tickets**](url)` funktioniert.
 */
export function parseInline(text: string): MarkdownInline[] {
  const nodes: MarkdownInline[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  const regex = new RegExp(INLINE_SOURCE, 'g')
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push({ type: 'text', value: text.slice(lastIndex, match.index) })
    }

    if (match[1] !== undefined) {
      // [label](href)
      nodes.push({ type: 'link', href: match[2], children: parseInline(match[1]) })
    } else if (match[3] !== undefined || match[4] !== undefined) {
      // **bold** oder __bold__
      nodes.push({ type: 'bold', children: parseInline(match[3] ?? match[4]) })
    } else if (match[5] !== undefined || match[6] !== undefined) {
      // *italic* oder _italic_
      nodes.push({ type: 'italic', children: parseInline(match[5] ?? match[6]) })
    }

    lastIndex = regex.lastIndex
  }

  if (lastIndex < text.length) {
    nodes.push({ type: 'text', value: text.slice(lastIndex) })
  }

  // Leere Eingabe ergibt einen leeren Textknoten, damit Aufrufer nie undefined bekommen
  return nodes.length > 0 ? nodes : [{ type: 'text', value: text }]
}

const HR_RE = /^\s*([-*_])\1{2,}\s*$/
const HEADING_RE = /^(#{1,3})\s+(.*)$/
const UL_RE = /^\s*[-*]\s+(.*)$/
const OL_RE = /^\s*\d+[.)]\s+(.*)$/
const QUOTE_RE = /^\s*>\s?(.*)$/

/**
 * Parst einen Markdown-String in ein Blockmodell.
 */
export function parseMarkdown(source: string | null | undefined): MarkdownBlock[] {
  if (!source) return []

  // \r\n normalisieren, damit die Zeilenlogik überall gleich greift
  const lines = source.replace(/\r\n?/g, '\n').split('\n')
  const blocks: MarkdownBlock[] = []

  let i = 0
  while (i < lines.length) {
    const line = lines[i]

    // Leerzeile trennt Blöcke
    if (line.trim() === '') {
      i++
      continue
    }

    // Trennlinie
    if (HR_RE.test(line)) {
      blocks.push({ type: 'hr' })
      i++
      continue
    }

    // Überschrift
    const heading = HEADING_RE.exec(line)
    if (heading) {
      const hashes = heading[1].length
      blocks.push({
        type: 'heading',
        level: hashes >= 3 ? 3 : 2,
        children: parseInline(heading[2].trim()),
      })
      i++
      continue
    }

    // Zitat: aufeinanderfolgende ">"-Zeilen zusammenfassen
    if (QUOTE_RE.test(line)) {
      const quoteLines: string[] = []
      while (i < lines.length && QUOTE_RE.test(lines[i])) {
        quoteLines.push(QUOTE_RE.exec(lines[i])![1])
        i++
      }
      blocks.push({ type: 'quote', children: parseInline(quoteLines.join(' ').trim()) })
      continue
    }

    // Ungeordnete Liste
    if (UL_RE.test(line)) {
      const items: MarkdownInline[][] = []
      while (i < lines.length && UL_RE.test(lines[i])) {
        items.push(parseInline(UL_RE.exec(lines[i])![1].trim()))
        i++
      }
      blocks.push({ type: 'list', ordered: false, items })
      continue
    }

    // Geordnete Liste
    if (OL_RE.test(line)) {
      const items: MarkdownInline[][] = []
      while (i < lines.length && OL_RE.test(lines[i])) {
        items.push(parseInline(OL_RE.exec(lines[i])![1].trim()))
        i++
      }
      blocks.push({ type: 'list', ordered: true, items })
      continue
    }

    // Absatz: Folgezeilen bis Leerzeile oder Beginn eines Spezialblocks
    const paragraph: string[] = [line.trim()]
    i++
    while (i < lines.length) {
      const next = lines[i]
      if (
        next.trim() === '' ||
        HR_RE.test(next) ||
        HEADING_RE.test(next) ||
        UL_RE.test(next) ||
        OL_RE.test(next) ||
        QUOTE_RE.test(next)
      ) {
        break
      }
      paragraph.push(next.trim())
      i++
    }
    blocks.push({ type: 'paragraph', children: parseInline(paragraph.join(' ')) })
  }

  return blocks
}

/** Inline-Spans zu reinem Text (für die Plain-Text-Variante der Mail). */
function inlineToText(nodes: MarkdownInline[]): string {
  return nodes
    .map((node) => {
      switch (node.type) {
        case 'text':
          return node.value
        case 'bold':
        case 'italic':
          return inlineToText(node.children)
        case 'link': {
          const label = inlineToText(node.children)
          // "Label (URL)", damit im Text-Teil das Ziel erhalten bleibt
          return label && label !== node.href ? `${label} (${node.href})` : node.href
        }
      }
    })
    .join('')
}

/**
 * Wandelt Markdown in sauberen Fließtext ohne Syntaxzeichen um.
 * Für den Plain-Text-Teil der E-Mail (Deliverability, Screenreader).
 */
export function markdownToPlainText(source: string | null | undefined): string {
  const blocks = parseMarkdown(source)
  const out: string[] = []

  for (const block of blocks) {
    switch (block.type) {
      case 'heading':
        out.push(inlineToText(block.children).toUpperCase())
        break
      case 'paragraph':
        out.push(inlineToText(block.children))
        break
      case 'quote':
        out.push(`"${inlineToText(block.children)}"`)
        break
      case 'hr':
        out.push('—')
        break
      case 'list':
        block.items.forEach((item, index) => {
          const prefix = block.ordered ? `${index + 1}. ` : '• '
          out.push(prefix + inlineToText(item))
        })
        break
    }
  }

  return out.join('\n\n')
}

/** Enthält der Text überhaupt Markdown-Auszeichnung, oder ist es reiner Fließtext? */
export function hasMarkdown(source: string | null | undefined): boolean {
  if (!source) return false
  return /(^|\n)\s*(#{1,3}\s|[-*]\s|\d+[.)]\s|>\s)|\*\*|__|\[[^\]]+\]\([^)\s]+\)/.test(source)
}
