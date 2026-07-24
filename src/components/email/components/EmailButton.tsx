import 'server-only'

/**
 * CTA-Elemente für E-Mails
 *
 * Drei Stufen, damit nicht jede Veranstaltung mit demselben blauen Button
 * um dieselbe Aufmerksamkeit kämpft:
 *
 *   primary   nur für die wichtigste Handlung eines Abschnitts
 *   secondary für unterstützende Handlungen
 *   inline    Textlink für Termine der dritten Ebene
 */

import { Button, Link } from '@react-email/components'
import { emailTheme } from '../theme'

type ButtonVariant = 'primary' | 'secondary'

interface EmailButtonProps {
  href: string
  children: React.ReactNode
  variant?: ButtonVariant
  /** Volle Breite: bessere Touch-Fläche auf dem Smartphone */
  fullWidth?: boolean
}

export function EmailButton({
  href,
  children,
  variant = 'primary',
  fullWidth = false,
}: EmailButtonProps) {
  const isPrimary = variant === 'primary'

  return (
    <Button
      href={href}
      style={{
        backgroundColor: isPrimary ? emailTheme.color.accent : 'transparent',
        color: isPrimary ? emailTheme.color.buttonText : emailTheme.color.accentText,
        fontFamily: emailTheme.font.stack,
        fontSize: '16px',
        fontWeight: '700',
        // 44px Mindesthöhe: verlässlich treffbar auf dem Touchscreen
        padding: '14px 26px',
        borderRadius: '8px',
        textDecoration: 'none',
        display: fullWidth ? 'block' : 'inline-block',
        textAlign: 'center',
        lineHeight: '1',
        border: isPrimary ? 'none' : `1px solid ${emailTheme.color.line}`,
        width: fullWidth ? '100%' : undefined,
        boxSizing: 'border-box',
      }}
    >
      {children}
    </Button>
  )
}

interface EmailInlineLinkProps {
  href: string
  children: React.ReactNode
  /** Etwas kleiner, für Fußzeilen und Nebenhandlungen */
  muted?: boolean
}

/**
 * Textlink mit Pfeil. Bewusst kein Button: Termine der dritten Ebene
 * sollen anklickbar sein, ohne dem Aufmacher Aufmerksamkeit zu nehmen.
 */
export function EmailInlineLink({ href, children, muted = false }: EmailInlineLinkProps) {
  return (
    <Link
      href={href}
      style={{
        color: muted ? emailTheme.color.textMuted : emailTheme.color.accentText,
        fontFamily: emailTheme.font.stack,
        fontSize: muted ? '13px' : '15px',
        fontWeight: '600',
        textDecoration: 'none',
      }}
    >
      {children}
      {' ›'}
    </Link>
  )
}
