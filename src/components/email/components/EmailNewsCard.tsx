import 'server-only'

/**
 * Artikel im Newsletter
 *
 * Redaktionelle Beiträge werden bewusst anders behandelt als
 * Veranstaltungen: keine Karte, kein Button, sondern ein abgesetzter Block
 * mit farbiger Kante. So sieht man auf einen Blick, dass hier etwas zu
 * lesen und nichts zu buchen ist.
 */

import { Section, Img, Text, Link } from '@react-email/components'
import { EmailInlineLink } from './EmailButton'
import { emailTheme, emailText } from '../theme'
import type { NewsletterArticleItem } from '@/lib/newsletter-content'

const CONTENT_WIDTH = emailTheme.size.container - emailTheme.size.gutter * 2

export function EmailNewsCard({ article }: { article: NewsletterArticleItem }) {
  const isFeature = article.emphasis === 'feature'

  return (
    <Section
      style={{
        borderLeft: `3px solid ${emailTheme.color.accent}`,
        paddingLeft: '16px',
        marginBottom: '20px',
      }}
    >
      {isFeature && article.imageUrl && (
        <Link href={article.articleUrl}>
          <Img
            src={article.imageUrl}
            alt={article.title}
            width={CONTENT_WIDTH - 19}
            style={{
              display: 'block',
              width: '100%',
              maxWidth: '100%',
              borderRadius: '8px',
              marginBottom: '14px',
              border: 'none',
              outline: 'none',
            }}
          />
        </Link>
      )}

      {article.category && (
        <Text style={{ ...emailText.eyebrow, color: emailTheme.color.textMuted, margin: '0 0 6px 0' }}>
          {article.category}
        </Text>
      )}

      <Text style={{ ...emailText.cardTitle, fontSize: isFeature ? '19px' : '17px' }}>
        <Link href={article.articleUrl} style={{ color: emailTheme.color.textStrong, textDecoration: 'none' }}>
          {article.title}
        </Link>
      </Text>

      {article.teaser && (
        <Text style={{ ...emailText.body, fontSize: '15px', margin: '0 0 12px 0' }}>
          {article.teaser}
        </Text>
      )}

      <EmailInlineLink href={article.articleUrl}>Weiterlesen</EmailInlineLink>
    </Section>
  )
}
