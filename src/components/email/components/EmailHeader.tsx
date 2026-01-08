/**
 * Email Header Component
 *
 * Contains the PEPE Dome logo and branding
 */

import {
  Section,
  Img,
  Link,
} from '@react-email/components';

interface EmailHeaderProps {
  logoUrl?: string;
  homeUrl?: string;
}

export function EmailHeader({
  // Use PNG logo with clean filename (no spaces)
  logoUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3004'}/images/pepe-dome-logo.png`,
  homeUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3004',
}: EmailHeaderProps) {
  return (
    <Section
      style={{
        backgroundColor: '#000000',
        padding: '32px 20px',
        textAlign: 'center',
      }}
    >
      <Link href={homeUrl}>
        <Img
          src={logoUrl}
          alt="PEPE Dome"
          width="200"
          height="auto"
          style={{
            margin: '0 auto',
            display: 'block',
          }}
        />
      </Link>
    </Section>
  );
}
