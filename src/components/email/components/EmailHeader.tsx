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
  logoUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/PEPE_logos_dome.svg`,
  homeUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
}: EmailHeaderProps) {
  return (
    <Section
      style={{
        backgroundColor: '#0F0520',
        padding: '32px 20px',
        textAlign: 'center',
      }}
    >
      <Link href={homeUrl}>
        <Img
          src={logoUrl}
          alt="PEPE Dome"
          width="180"
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
