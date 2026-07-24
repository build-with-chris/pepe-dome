import 'server-only'

/**
 * Rendert einen Markdown-Text als E-Mail-taugliches HTML.
 *
 * Alle Stile inline aus dem Theme, keine Klassen und kein <style>: Outlook
 * und die meisten Webmailer entfernen beides. Überschriften, Absätze, Listen
 * und Zitate bekommen bewusste Abstände, damit ein langer redaktioneller Text
 * gegliedert wirkt statt als Fließtextwand.
 */

import { Section, Text, Link } from '@react-email/components'
import { emailTheme, emailText } from '../theme'
import { parseMarkdown, type MarkdownInline, type MarkdownBlock } from '@/lib/markdown'

function renderInline(nodes: MarkdownInline[], keyPrefix: string): React.ReactNode[] {
  return nodes.map((node, index) => {
    const key = `${keyPrefix}-${index}`
    switch (node.type) {
      case 'text':
        return <span key={key}>{node.value}</span>
      case 'bold':
        return (
          <strong key={key} style={{ color: emailTheme.color.textStrong, fontWeight: 700 }}>
            {renderInline(node.children, key)}
          </strong>
        )
      case 'italic':
        return (
          <em key={key} style={{ fontStyle: 'italic' }}>
            {renderInline(node.children, key)}
          </em>
        )
      case 'link':
        return (
          <Link
            key={key}
            href={node.href}
            style={{ color: emailTheme.color.accentText, textDecoration: 'underline' }}
          >
            {renderInline(node.children, key)}
          </Link>
        )
    }
  })
}

function Block({ block, index }: { block: MarkdownBlock; index: number }) {
  const key = `md-${index}`

  switch (block.type) {
    case 'heading':
      return (
        <Text
          style={{
            fontSize: block.level === 2 ? '20px' : '17px',
            fontWeight: 700,
            lineHeight: 1.3,
            color: emailTheme.color.textStrong,
            margin: block.level === 2 ? '24px 0 10px 0' : '20px 0 8px 0',
          }}
        >
          {renderInline(block.children, key)}
        </Text>
      )

    case 'paragraph':
      return <Text style={{ ...emailText.body, margin: '0 0 14px 0' }}>{renderInline(block.children, key)}</Text>

    case 'quote':
      return (
        <Section
          style={{
            borderLeft: `3px solid ${emailTheme.color.accent}`,
            paddingLeft: '14px',
            margin: '0 0 16px 0',
          }}
        >
          <Text
            style={{
              ...emailText.body,
              fontStyle: 'italic',
              color: emailTheme.color.textMuted,
              margin: '0',
            }}
          >
            {renderInline(block.children, key)}
          </Text>
        </Section>
      )

    case 'list':
      // Jede Zeile als eigener Text mit Präfix: robuster über E-Mail-Clients
      // hinweg als echte <ul>/<ol> mit erwartetem Einzug.
      return (
        <Section style={{ margin: '0 0 14px 0' }}>
          {block.items.map((item, itemIndex) => (
            <Text
              key={`${key}-i${itemIndex}`}
              style={{ ...emailText.body, margin: '0 0 6px 0', paddingLeft: '4px' }}
            >
              <span style={{ color: emailTheme.color.accentText, fontWeight: 700 }}>
                {block.ordered ? `${itemIndex + 1}.` : '•'}
              </span>{' '}
              {renderInline(item, `${key}-i${itemIndex}`)}
            </Text>
          ))}
        </Section>
      )

    case 'hr':
      return (
        <Section
          style={{
            borderTop: `1px solid ${emailTheme.color.line}`,
            margin: '18px 0',
            fontSize: '1px',
            lineHeight: '1px',
          }}
        >
          &nbsp;
        </Section>
      )
  }
}

export function EmailMarkdown({ source }: { source: string }) {
  const blocks = parseMarkdown(source)
  return (
    <>
      {blocks.map((block, index) => (
        <Block key={index} block={block} index={index} />
      ))}
    </>
  )
}
