/**
 * Email Event Card Component
 *
 * Displays event information in newsletter emails
 */

import {
  Section,
  Img,
  Text,
  Link,
} from '@react-email/components';
import { EmailButton } from './EmailButton';

interface EmailEventCardProps {
  title: string;
  date: string;
  time?: string;
  location?: string;
  description?: string;
  imageUrl?: string;
  ctaUrl: string;
  ctaLabel?: string;
}

export function EmailEventCard({
  title,
  date,
  time,
  location,
  description,
  imageUrl,
  ctaUrl,
  ctaLabel = 'Tickets sichern',
}: EmailEventCardProps) {
  return (
    <Section
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        overflow: 'hidden',
        marginBottom: '24px',
        border: '1px solid #E5E5E5',
      }}
    >
      {/* Event Image */}
      {imageUrl && (
        <Link href={ctaUrl}>
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

      {/* Event Content */}
      <Section
        style={{
          padding: '24px',
        }}
      >
        {/* Event Title */}
        <Text
          style={{
            fontSize: '20px',
            fontWeight: '700',
            lineHeight: '1.3',
            color: '#0F0520',
            margin: '0 0 12px 0',
          }}
        >
          <Link
            href={ctaUrl}
            style={{
              color: '#0F0520',
              textDecoration: 'none',
            }}
          >
            {title}
          </Link>
        </Text>

        {/* Date & Time */}
        <Text
          style={{
            fontSize: '16px',
            lineHeight: '1.5',
            color: '#D4A574',
            fontWeight: '600',
            margin: '0 0 8px 0',
          }}
        >
          {date}
          {time && ` · ${time}`}
        </Text>

        {/* Location */}
        {location && (
          <Text
            style={{
              fontSize: '14px',
              lineHeight: '1.5',
              color: '#666666',
              margin: '0 0 12px 0',
            }}
          >
            {location}
          </Text>
        )}

        {/* Description */}
        {description && (
          <Text
            style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#333333',
              margin: '0 0 20px 0',
            }}
          >
            {description}
          </Text>
        )}

        {/* CTA Button */}
        <EmailButton href={ctaUrl}>{ctaLabel}</EmailButton>
      </Section>
    </Section>
  );
}
