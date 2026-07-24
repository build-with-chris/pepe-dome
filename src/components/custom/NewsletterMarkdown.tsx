import React from 'react'
import Link from 'next/link'
import { parseMarkdown, type MarkdownInline, type MarkdownBlock } from '@/lib/markdown'

/**
 * Markdown-Renderer für die Web-Ansicht des Newsletters.
 *
 * Dieselbe Parselogik wie in der E-Mail (`@/lib/markdown`), aber mit den
 * Design-System-Klassen der Website statt Inline-Styles. So liest sich der
 * redaktionelle Text im Browser wie in der Mail: gegliedert, nicht als Wand.
 */

function renderInline(nodes: MarkdownInline[], keyPrefix: string): React.ReactNode[] {
  return nodes.map((node, index) => {
    const key = `${keyPrefix}-${index}`
    switch (node.type) {
      case 'text':
        return <React.Fragment key={key}>{node.value}</React.Fragment>
      case 'bold':
        return (
          <strong key={key} className="font-semibold text-pepe-white">
            {renderInline(node.children, key)}
          </strong>
        )
      case 'italic':
        return (
          <em key={key} className="italic">
            {renderInline(node.children, key)}
          </em>
        )
      case 'link': {
        const isExternal = /^https?:\/\//.test(node.href)
        const className = 'text-pepe-gold underline hover:text-pepe-gold/80'
        return isExternal ? (
          <a key={key} href={node.href} target="_blank" rel="noopener noreferrer" className={className}>
            {renderInline(node.children, key)}
          </a>
        ) : (
          <Link key={key} href={node.href} className={className}>
            {renderInline(node.children, key)}
          </Link>
        )
      }
    }
  })
}

function renderBlock(block: MarkdownBlock, index: number): React.ReactNode {
  const key = `md-${index}`
  switch (block.type) {
    case 'heading':
      return block.level === 2 ? (
        <h2 key={key} className="text-2xl md:text-3xl font-bold text-pepe-white mt-10 mb-4 leading-snug">
          {renderInline(block.children, key)}
        </h2>
      ) : (
        <h3 key={key} className="text-xl md:text-2xl font-bold text-pepe-white mt-8 mb-3 leading-snug">
          {renderInline(block.children, key)}
        </h3>
      )
    case 'paragraph':
      return (
        <p key={key} className="text-lg text-pepe-t80 leading-relaxed mb-5">
          {renderInline(block.children, key)}
        </p>
      )
    case 'quote':
      return (
        <blockquote
          key={key}
          className="border-l-4 border-pepe-gold pl-5 my-6 text-lg text-pepe-t80 italic leading-relaxed"
        >
          {renderInline(block.children, key)}
        </blockquote>
      )
    case 'list':
      return block.ordered ? (
        <ol key={key} className="list-decimal pl-6 mb-6 space-y-2 text-lg text-pepe-t80 leading-relaxed marker:text-pepe-gold">
          {block.items.map((item, i) => (
            <li key={`${key}-${i}`}>{renderInline(item, `${key}-${i}`)}</li>
          ))}
        </ol>
      ) : (
        <ul key={key} className="list-disc pl-6 mb-6 space-y-2 text-lg text-pepe-t80 leading-relaxed marker:text-pepe-gold">
          {block.items.map((item, i) => (
            <li key={`${key}-${i}`}>{renderInline(item, `${key}-${i}`)}</li>
          ))}
        </ul>
      )
    case 'hr':
      return <hr key={key} className="border-0 border-t border-pepe-line my-8" />
  }
}

export default function NewsletterMarkdown({ source }: { source: string }) {
  const blocks = parseMarkdown(source)
  return <div>{blocks.map((block, index) => renderBlock(block, index))}</div>
}
