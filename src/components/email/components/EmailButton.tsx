/**
 * Email Button Component
 *
 * CTA button with golden/bronze styling for email templates
 */

import { Button } from '@react-email/components';

interface EmailButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export function EmailButton({
  href,
  children,
  variant = 'primary',
}: EmailButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <Button
      href={href}
      style={{
        backgroundColor: isPrimary ? '#B8860B' : '#D4A574',
        color: '#FFFFFF',
        fontSize: '16px',
        fontWeight: '600',
        padding: '14px 32px',
        borderRadius: '8px',
        textDecoration: 'none',
        display: 'inline-block',
        textAlign: 'center',
        minHeight: '44px',
        lineHeight: '1.2',
        border: 'none',
      }}
    >
      {children}
    </Button>
  );
}
