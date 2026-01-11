import 'server-only'

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
        backgroundColor: isPrimary ? '#016dca' : 'transparent',
        color: isPrimary ? '#FFFFFF' : '#016dca',
        fontSize: '14px',
        fontWeight: '600',
        padding: '10px 20px',
        borderRadius: '8px',
        textDecoration: 'none',
        display: 'inline-block',
        textAlign: 'center',
        lineHeight: '1',
        border: isPrimary ? 'none' : '1px solid #016dca',
      }}
    >
      {children}
    </Button>
  );
}
