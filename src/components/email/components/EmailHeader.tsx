import 'server-only'

/**
 * Kopfbereich der E-Mail
 *
 * Logo links, Browser-Ansicht rechts. Der Browser-Link stand vorher ganz
 * unten im Footer, wo er niemandem hilft: Gebraucht wird er genau dann,
 * wenn oben etwas nicht richtig dargestellt wird.
 */

import { Section, Row, Column, Img, Link } from '@react-email/components'
import { emailTheme } from '../theme'

interface EmailHeaderProps {
  logoUrl: string
  homeUrl: string
  webViewUrl?: string
}

export function EmailHeader({ logoUrl, homeUrl, webViewUrl }: EmailHeaderProps) {
  return (
    <Section
      style={{
        backgroundColor: emailTheme.color.canvas,
        padding: `20px ${emailTheme.size.gutter}px 16px ${emailTheme.size.gutter}px`,
      }}
    >
      <Row>
        <Column style={{ verticalAlign: 'middle' }}>
          <Link href={homeUrl}>
            <Img
              src={logoUrl}
              alt="PEPE Dome"
              width="132"
              height="78"
              style={{ display: 'block', border: 'none', outline: 'none' }}
            />
          </Link>
        </Column>
        {webViewUrl && (
          <Column style={{ verticalAlign: 'middle', textAlign: 'right' }}>
            <Link
              href={webViewUrl}
              style={{
                color: emailTheme.color.textFaint,
                fontFamily: emailTheme.font.stack,
                fontSize: '12px',
                textDecoration: 'underline',
              }}
            >
              Im Browser ansehen
            </Link>
          </Column>
        )}
      </Row>
    </Section>
  )
}
