import 'server-only'

/**
 * Freier redaktioneller Block aus dem Admin
 *
 * Bekommt bewusst keine Kartenoptik: Ein Hinweis der Redaktion soll wie
 * ein Absatz im Text wirken und nicht wie ein weiteres Angebot.
 */

import { Section, Text } from '@react-email/components'
import { emailTheme, emailText } from '../theme'
import { EmailMarkdown } from './EmailMarkdown'
import type { NewsletterNoteItem } from '@/lib/newsletter-content'

export function EmailNote({ note }: { note: NewsletterNoteItem }) {
  if (!note.title && !note.text) return null

  return (
    <Section
      style={{
        backgroundColor: emailTheme.color.surface,
        borderRadius: '12px',
        padding: '20px 22px',
      }}
    >
      {note.title && (
        <Text style={{ ...emailText.cardTitle, fontSize: '18px', margin: '0 0 8px 0' }}>
          {note.title}
        </Text>
      )}
      {/* Freitext eines redaktionellen Blocks als Markdown. */}
      {note.text && <EmailMarkdown source={note.text} />}
    </Section>
  )
}
