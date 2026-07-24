/**
 * Design-Tokens für E-Mails
 *
 * Bewusst als feste Hex-Werte statt CSS-Variablen: Outlook und die meisten
 * Webmailer entfernen custom properties, Variablen würden dort zu schwarzem
 * Text auf schwarzem Grund führen.
 *
 * Farblogik gegenüber der Website:
 * Die Marke ist dunkel mit Blau #016dca. Das gilt hier weiter, mit einer
 * Ausnahme: Als Textfarbe auf dunklem Grund erreicht #016dca nur ein
 * Kontrastverhältnis von rund 3,6:1 und ist damit für kleine Schrift zu
 * dunkel. Für Textlinks wird deshalb ein aufgehelltes Blau verwendet
 * (rund 6,9:1), für Flächen und Buttons bleibt es beim Markenblau, das
 * mit weißer Schrift auf 5,2:1 kommt.
 */

export const emailTheme = {
  color: {
    /** Fläche außerhalb des Inhaltsbereichs */
    page: '#0A0A0A',
    /** Inhaltsbereich, 600px */
    canvas: '#111111',
    /** Karten und abgesetzte Blöcke */
    surface: '#181818',
    /** Aufmacher, eine Stufe heller als eine normale Karte */
    surfaceRaised: '#1F1F1F',
    line: '#2C2C2C',
    lineSoft: '#232323',

    textStrong: '#FFFFFF',
    textBody: '#D8D8D8',
    textMuted: '#9B9B9B',
    textFaint: '#7A7A7A',

    /** Markenblau, für Flächen und Buttons */
    accent: '#016dca',
    /** Aufgehelltes Blau, für Text und Links auf dunklem Grund */
    accentText: '#4DA3F0',
    accentSoft: '#0E2438',

    buttonText: '#FFFFFF',
  },

  font: {
    /**
     * Systemschriften. Webfonts werden von Gmail und Outlook verworfen,
     * die Marke lebt hier über Größe, Gewicht und Weißraum statt über
     * eine Schriftart, die die Hälfte der Empfänger nicht sieht.
     */
    stack:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
  },

  size: {
    /** Klassische E-Mail-Breite, von allen Clients zuverlässig unterstützt */
    container: 600,
    /** Horizontaler Innenabstand des Inhalts */
    gutter: 24,
  },
} as const

/** Wiederkehrende Textstile, damit Hierarchie nicht pro Komponente neu erfunden wird */
export const emailText = {
  eyebrow: {
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '1.2px',
    textTransform: 'uppercase' as const,
    color: emailTheme.color.accentText,
    margin: '0 0 10px 0',
  },
  heroTitle: {
    fontSize: '30px',
    fontWeight: '700',
    lineHeight: '1.18',
    color: emailTheme.color.textStrong,
    margin: '0 0 12px 0',
  },
  sectionTitle: {
    fontSize: '13px',
    fontWeight: '700',
    letterSpacing: '1.4px',
    textTransform: 'uppercase' as const,
    color: emailTheme.color.textMuted,
    margin: '0 0 4px 0',
  },
  leadTitle: {
    fontSize: '24px',
    fontWeight: '700',
    lineHeight: '1.25',
    color: emailTheme.color.textStrong,
    margin: '0 0 10px 0',
  },
  cardTitle: {
    fontSize: '19px',
    fontWeight: '700',
    lineHeight: '1.3',
    color: emailTheme.color.textStrong,
    margin: '0 0 8px 0',
  },
  rowTitle: {
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '1.35',
    color: emailTheme.color.textStrong,
    margin: '0 0 4px 0',
  },
  body: {
    fontSize: '16px',
    lineHeight: '1.65',
    color: emailTheme.color.textBody,
    margin: '0 0 16px 0',
  },
  meta: {
    fontSize: '14px',
    lineHeight: '1.5',
    color: emailTheme.color.textMuted,
    margin: '0',
  },
  small: {
    fontSize: '13px',
    lineHeight: '1.6',
    color: emailTheme.color.textFaint,
    margin: '0',
  },
} as const
