'use client'

import React from 'react'

interface MarkdownTextProps {
  content: string
  className?: string
}

function parseInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  const regex = /\*\*(.+?)\*\*/g
  let lastIndex = 0
  let match

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    parts.push(<strong key={match.index}>{match[1]}</strong>)
    lastIndex = regex.lastIndex
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts.length > 0 ? parts : [text]
}

export function MarkdownText({ content, className }: MarkdownTextProps) {
  const blocks = content.split('\n\n')
  const elements: React.ReactNode[] = []

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i].trim()
    if (!block) continue

    const lines = block.split('\n')

    // Check if block is a list (all lines start with "- ")
    if (lines.every(line => line.trimStart().startsWith('- '))) {
      elements.push(
        <ul key={i} className="list-disc list-inside space-y-1">
          {lines.map((line, j) => (
            <li key={j}>{parseInline(line.trimStart().slice(2))}</li>
          ))}
        </ul>
      )
      continue
    }

    // Mixed block: some lines are list items, some are not
    if (lines.some(line => line.trimStart().startsWith('- '))) {
      const subElements: React.ReactNode[] = []
      let listItems: string[] = []

      for (let j = 0; j < lines.length; j++) {
        const line = lines[j]
        if (line.trimStart().startsWith('- ')) {
          listItems.push(line.trimStart().slice(2))
        } else {
          if (listItems.length > 0) {
            subElements.push(
              <ul key={`${i}-ul-${j}`} className="list-disc list-inside space-y-1">
                {listItems.map((item, k) => (
                  <li key={k}>{parseInline(item)}</li>
                ))}
              </ul>
            )
            listItems = []
          }
          subElements.push(<p key={`${i}-p-${j}`}>{parseInline(line)}</p>)
        }
      }

      if (listItems.length > 0) {
        subElements.push(
          <ul key={`${i}-ul-end`} className="list-disc list-inside space-y-1">
            {listItems.map((item, k) => (
              <li key={k}>{parseInline(item)}</li>
            ))}
          </ul>
        )
      }

      elements.push(<div key={i} className="space-y-2">{subElements}</div>)
      continue
    }

    // Regular paragraph
    elements.push(
      <p key={i}>{parseInline(block.replace(/\n/g, ' '))}</p>
    )
  }

  return <div className={className ?? 'space-y-4'}>{elements}</div>
}
