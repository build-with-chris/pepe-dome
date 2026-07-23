import React from 'react'

/**
 * ArticleContent — Renderer für Artikel-Inhalte aus der DB.
 *
 * Die Inhalte sind Klartext mit Konventionen statt sauberem Markdown:
 * - Absätze durch Leerzeile getrennt, aber einzelne Zeilen innerhalb
 *   eines Blocks tragen eigene Semantik:
 *   - kurze Zeile ohne Satzzeichen am Ende → Zwischenüberschrift
 *   - "Montag — Kursname …"-Zeilenläufe → Aufzählung
 *   - "Name, Rolle:" direkt vor einem „Zitat" → Sprecher-Label
 *   - „…" -Blöcke → Zitate
 *   - "Label: Text"-Absätze → Bullet-Points mit fettem Lead
 * - Vereinzelt echte Markdown-Reste (##, ###, **fett**, "- ")
 *
 * Der Renderer arbeitet deshalb zeilenbasiert mit Block-Kontext und
 * setzt die Muster typografisch sauber.
 */

interface ArticleContentProps {
  content: string
}

type Line = {
  text: string
  blockIdx: number
  idxInBlock: number
  blockLen: number
}

/** **fett** → <strong> */
function parseInline(text: string, keyPrefix: string): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  const regex = /\*\*(.+?)\*\*/g
  let lastIndex = 0
  let match
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index))
    parts.push(
      <strong key={`${keyPrefix}-b${match.index}`} className="font-semibold text-[var(--pepe-white)]">
        {match[1]}
      </strong>
    )
    lastIndex = regex.lastIndex
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex))
  return parts.length > 0 ? parts : [text]
}

function isQuote(text: string): boolean {
  return /^[„“"']/.test(text)
}

/** "Montag — Circus Dome Lab …" — kurzer Lead, dann Em-Dash */
function isDashItem(text: string): boolean {
  const idx = text.indexOf(' — ')
  return idx > 1 && idx <= 40
}

/** Kurze Zeile ohne Satzende → wirkt wie eine Überschrift */
function looksLikeHeading(text: string): boolean {
  if (text.length < 8 || text.length > 90) return false
  if (/[.!?;,:]$/.test(text)) return false
  if (text.startsWith('- ') || text.startsWith('**') || isQuote(text) || isDashItem(text)) return false
  return true
}

/** "Label: Text" mit kurzem Label ohne Satzzeichen → Bullet mit fettem Lead */
function splitLeadLabel(text: string): { label: string; rest: string } | null {
  const match = /^([^.!?:\n]{3,60}):\s+(.+)$/.exec(text)
  if (!match || match[1].includes('http')) return null
  return { label: match[1], rest: match[2] }
}

const H2_CLASSES = 'text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mt-12 mb-5 leading-snug'
const H3_CLASSES = 'text-xl md:text-2xl font-bold text-[var(--pepe-white)] mt-10 mb-4 leading-snug'
const P_CLASSES = 'text-lg text-[var(--pepe-t80)] leading-[1.8] mb-6'

function BulletItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="relative m-0 pl-7 text-lg text-[var(--pepe-t80)] leading-[1.8]">
      <span
        aria-hidden="true"
        className="absolute left-0 top-[0.7em] h-2 w-2 rounded-full bg-[var(--pepe-gold)]"
      />
      {children}
    </li>
  )
}

export default function ArticleContent({ content }: ArticleContentProps) {
  // Blöcke splitten, dann zeilenweise mit Block-Kontext flach auslegen
  const lines: Line[] = []
  content.split(/\n\s*\n/).forEach((block, blockIdx) => {
    const blockLines = block.split('\n').map((l) => l.trim()).filter(Boolean)
    blockLines.forEach((text, idxInBlock) => {
      lines.push({ text, blockIdx, idxInBlock, blockLen: blockLines.length })
    })
  })

  const elements: React.ReactNode[] = []
  let bullets: React.ReactNode[] = []
  let bulletsAreLeadLabels = false

  const flushBullets = (key: string) => {
    if (bullets.length === 0) return
    elements.push(<ul key={key} className="list-none pl-0 my-0 mb-8 space-y-4">{bullets}</ul>)
    bullets = []
    bulletsAreLeadLabels = false
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const { text } = line
    const next = lines[i + 1]
    const prev = lines[i - 1]
    const sameBlockNext = next && next.blockIdx === line.blockIdx ? next : null
    const sameBlockPrev = prev && prev.blockIdx === line.blockIdx ? prev : null
    const key = `l-${i}`

    // Trennlinie: "---" / "***" / "———"
    if (/^(-{3,}|\*{3,}|—{3,})$/.test(text)) {
      flushBullets(`ul-${key}`)
      elements.push(<hr key={key} className="border-0 border-t border-[var(--pepe-line)] my-10" />)
      continue
    }

    // Explizites Markdown: ## / ###
    if (text.startsWith('### ')) {
      flushBullets(`ul-${key}`)
      elements.push(<h3 key={key} className={H3_CLASSES}>{parseInline(text.slice(4), key)}</h3>)
      continue
    }
    if (text.startsWith('## ')) {
      flushBullets(`ul-${key}`)
      elements.push(<h2 key={key} className={H2_CLASSES}>{parseInline(text.slice(3), key)}</h2>)
      continue
    }

    // Echte "- "-Listenzeile
    if (text.startsWith('- ')) {
      if (bulletsAreLeadLabels) flushBullets(`ul-${key}`)
      bullets.push(<BulletItem key={key}>{parseInline(text.slice(2), key)}</BulletItem>)
      continue
    }

    // "Montag — Kurs …"-Läufe: mindestens zwei Dash-Zeilen hintereinander
    if (
      isDashItem(text) &&
      ((sameBlockPrev && isDashItem(sameBlockPrev.text)) || (sameBlockNext && isDashItem(sameBlockNext.text)))
    ) {
      if (bulletsAreLeadLabels) flushBullets(`ul-${key}`)
      const dashIdx = text.indexOf(' — ')
      bullets.push(
        <BulletItem key={key}>
          <strong className="font-semibold text-[var(--pepe-white)]">{text.slice(0, dashIdx)}</strong>
          {' · '}
          {parseInline(text.slice(dashIdx + 3), key)}
        </BulletItem>
      )
      continue
    }

    // „Zitat" → Blockquote
    if (isQuote(text)) {
      flushBullets(`ul-${key}`)
      elements.push(
        <blockquote
          key={key}
          className="border-l-4 border-[var(--pepe-gold)] pl-5 my-8 text-lg md:text-xl text-[var(--pepe-t80)] italic leading-[1.7]"
        >
          {parseInline(text, key)}
        </blockquote>
      )
      continue
    }

    // Kurze Zeile mit ":" am Ende
    if (text.endsWith(':') && text.length <= 80) {
      flushBullets(`ul-${key}`)
      if (next && isQuote(next.text)) {
        // Sprecher-Label direkt vor einem Zitat
        elements.push(
          <p key={key} className="mt-10 mb-0 text-base font-semibold text-[var(--pepe-white)]">
            {text.slice(0, -1)}
          </p>
        )
      } else {
        // Einleitung einer Aufzählung / eines Abschnitts
        elements.push(<h3 key={key} className={H3_CLASSES}>{text.slice(0, -1)}</h3>)
      }
      continue
    }

    // Überschrift-Zeile innerhalb eines Blocks (weitere Zeilen folgen)
    if (sameBlockNext && looksLikeHeading(text)) {
      flushBullets(`ul-${key}`)
      elements.push(<h2 key={key} className={H2_CLASSES}>{text}</h2>)
      continue
    }

    // "Label: Text"-Absatz → Bullet mit fettem Lead (nur eigenständige Blöcke)
    if (line.blockLen === 1) {
      const lead = splitLeadLabel(text)
      if (lead) {
        if (!bulletsAreLeadLabels) flushBullets(`ul-${key}`)
        bulletsAreLeadLabels = true
        bullets.push(
          <BulletItem key={key}>
            <strong className="font-semibold text-[var(--pepe-white)]">{lead.label}:</strong>{' '}
            {parseInline(lead.rest, key)}
          </BulletItem>
        )
        continue
      }
    }

    // Normaler Absatz — aufeinanderfolgende Fließtextzeilen desselben
    // Blocks zu einem Absatz zusammenfassen
    flushBullets(`ul-${key}`)
    const parts = [text]
    while (
      i + 1 < lines.length &&
      lines[i + 1].blockIdx === line.blockIdx &&
      !lines[i + 1].text.startsWith('- ') &&
      !lines[i + 1].text.startsWith('#') &&
      !isQuote(lines[i + 1].text) &&
      !isDashItem(lines[i + 1].text) &&
      !(lines[i + 1].text.endsWith(':') && lines[i + 1].text.length <= 80)
    ) {
      parts.push(lines[i + 1].text)
      i++
    }
    elements.push(<p key={key} className={P_CLASSES}>{parseInline(parts.join(' '), key)}</p>)
  }

  flushBullets('ul-end')

  return <div>{elements}</div>
}
