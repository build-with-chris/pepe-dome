/**
 * Plain-Text-Variante des Newsletters
 *
 * Warum eigenhändig statt über den plainText-Modus von react-email:
 * Der automatische Weg läuft über den fertigen HTML-Baum und produziert bei
 * einem Layout mit Datumsfeldern und mehrspaltigen Zeilen eine Textwüste
 * aus zusammenhanglosen Fragmenten. Der Text-Teil hat aber zwei echte
 * Aufgaben: Er senkt den Spam-Score, und er ist das, was Screenreader und
 * puristische Clients tatsächlich vorlesen. Beides verdient eine eigene,
 * lesbare Fassung.
 */

import type { NewsletterViewModel, NewsletterEventItem } from './newsletter-content'

function eventBlock(event: NewsletterEventItem, compact: boolean): string {
  const lines: string[] = []

  lines.push(event.title.toUpperCase())

  const when = [event.dateLabel, event.time].filter(Boolean).join(', ')
  lines.push(when)
  if (event.location) lines.push(event.location)

  if (!compact && event.teaser) {
    lines.push('')
    lines.push(event.teaser)
  }

  lines.push('')
  // Im Fließtext liest sich die nackte Adresse besser als "mailto:…"
  lines.push(`${event.ctaLabel}: ${event.ctaUrl.replace(/^mailto:/, '')}`)

  return lines.join('\n')
}

export function renderNewsletterText(
  viewModel: NewsletterViewModel,
  options: { firstName?: string; unsubscribeUrl: string; subscriberEmail?: string }
): string {
  const vm = viewModel
  const blocks: string[] = []

  blocks.push('PEPE DOME')
  blocks.push('='.repeat(60))
  blocks.push(vm.hero.title)
  if (vm.hero.subtitle) blocks.push(vm.hero.subtitle)

  if (vm.hero.ctaLabel && vm.hero.ctaUrl) {
    blocks.push(`${vm.hero.ctaLabel}: ${vm.hero.ctaUrl}`)
  }

  if (vm.introText) {
    // Anrede nur mit echtem Vornamen, sonst trägt der Einstiegstext sie selbst
    // (siehe NewsletterTemplate).
    if (options.firstName) blocks.push(`Hallo ${options.firstName},`)
    blocks.push(vm.introText)
  }

  for (const section of vm.sections) {
    if (section.heading) {
      blocks.push('-'.repeat(60))
      blocks.push(section.heading.toUpperCase())
      if (section.description) blocks.push(section.description)
      blocks.push('-'.repeat(60))
    }

    for (const item of section.items) {
      if (item.kind === 'event') {
        blocks.push(eventBlock(item, item.emphasis === 'compact'))
      } else if (item.kind === 'article') {
        const lines = [item.title.toUpperCase()]
        if (item.teaser) lines.push(item.teaser)
        lines.push(`Weiterlesen: ${item.articleUrl}`)
        blocks.push(lines.join('\n'))
      } else if (item.title || item.text) {
        blocks.push([item.title, item.text].filter(Boolean).join('\n'))
      }
    }
  }

  blocks.push('-'.repeat(60))
  blocks.push(`Alle Termine ansehen: ${vm.eventsUrl}`)
  blocks.push('Bis bald im Dome\ndas Team vom PEPE Dome')

  blocks.push('='.repeat(60))
  blocks.push(
    [
      'PEPE Arts, Ostpark, 81735 München',
      'info@pepe-dome.de',
      '',
      options.subscriberEmail
        ? `Du bekommst diese Mail an ${options.subscriberEmail}, weil du dich für den Newsletter des PEPE Dome angemeldet hast.`
        : 'Du bekommst diese Mail, weil du dich für den Newsletter des PEPE Dome angemeldet hast.',
      `Abmelden: ${options.unsubscribeUrl}`,
      `Datenschutz: ${vm.baseUrl}/datenschutz`,
      `Impressum: ${vm.baseUrl}/impressum`,
      `Im Browser ansehen: ${vm.webViewUrl}`,
    ].join('\n')
  )

  return blocks.join('\n\n')
}
