import 'server-only'

/**
 * Email News Card Component
 *
 * Displays news/article information in newsletter emails
 */

import {
  Section,
  Img,
  Text,
  Link,
} from '@react-email/components';

interface EmailNewsCardProps {
  title: string;
  excerpt?: string;
  imageUrl?: string;
  articleUrl: string;
  category?: string;
}

export function EmailNewsCard({
  title,
  excerpt,
  imageUrl,
  articleUrl,
  category,
}: EmailNewsCardProps) {
  return (
    <Section
      style={{
        backgroundColor: '#1a1a1a',
        borderRadius: '12px',
        overflow: 'hidden',
        marginBottom: '24px',
        border: '1px solid #333333',
      }}
    >
      {/* Article Image */}
      {imageUrl && (
        <Link href={articleUrl}>
          <Img
            src={imageUrl}
            alt={title}
            width="100%"
            height="auto"
            style={{
              display: 'block',
              maxWidth: '600px',
              width: '100%',
            }}
          />
        </Link>
      )}

      {/* Article Content */}
      <Section
        style={{
          padding: '24px',
        }}
      >
        {/* Category */}
        {category && (
          <Text
            style={{
              fontSize: '12px',
              fontWeight: '600',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              color: '#016dca',
              margin: '0 0 8px 0',
            }}
          >
            {category}
          </Text>
        )}

        {/* Article Title */}
        <Text
          style={{
            fontSize: '20px',
            fontWeight: '700',
            lineHeight: '1.3',
            color: '#FFFFFF',
            margin: '0 0 12px 0',
          }}
        >
          <Link
            href={articleUrl}
            style={{
              color: '#FFFFFF',
              textDecoration: 'none',
            }}
          >
            {title}
          </Link>
        </Text>

        {/* Excerpt */}
        {excerpt && (
          <Text
            style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#CCCCCC',
              margin: '0 0 12px 0',
            }}
          >
            {excerpt}
          </Text>
        )}

        {/* Read More Link */}
        <Text
          style={{
            fontSize: '16px',
            lineHeight: '1.6',
            margin: '0',
          }}
        >
          <Link
            href={articleUrl}
            style={{
              color: '#016dca',
              textDecoration: 'none',
              fontWeight: '600',
            }}
          >
            Weiterlesen →
          </Link>
        </Text>
      </Section>
    </Section>
  );
}
