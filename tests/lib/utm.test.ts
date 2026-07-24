import { describe, it, expect } from 'vitest'
import {
  buildCampaignId,
  contentId,
  withUtm,
  isMailLink,
  normalizeContactUrl,
} from '@/lib/utm'

describe('UTM-Parameter', () => {
  const campaign = '2026-08-sommerprogramm'

  it('hängt alle vier Standardparameter an', () => {
    const url = withUtm('https://pepe-dome.de/events/tanzabend', {
      campaign,
      content: contentId('lead', 'ticket'),
    })
    const params = new URL(url).searchParams

    expect(params.get('utm_source')).toBe('newsletter')
    expect(params.get('utm_medium')).toBe('email')
    expect(params.get('utm_campaign')).toBe(campaign)
    expect(params.get('utm_content')).toBe('lead_ticket')
  })

  it('macht Positionen innerhalb derselben Mail unterscheidbar', () => {
    const lead = withUtm('https://pepe-dome.de/events/a', { campaign, content: contentId('lead', 'ticket') })
    const third = withUtm('https://pepe-dome.de/events/a', { campaign, content: contentId('p3', 'ticket') })

    expect(new URL(lead).searchParams.get('utm_content')).not.toBe(
      new URL(third).searchParams.get('utm_content')
    )
  })

  it('erhält vorhandene Query-Parameter des Ticketshops', () => {
    const url = withUtm('https://tickets.example.com/buy?event=42', { campaign, content: 'lead_ticket' })
    const params = new URL(url).searchParams

    expect(params.get('event')).toBe('42')
    expect(params.get('utm_campaign')).toBe(campaign)
  })

  it('überschreibt bereits gesetzte Kampagnenparameter nicht', () => {
    const url = withUtm('https://example.com/?utm_campaign=handgesetzt', {
      campaign,
      content: 'lead_ticket',
    })

    expect(new URL(url).searchParams.get('utm_campaign')).toBe('handgesetzt')
  })

  it('lässt mailto und tel unangetastet', () => {
    expect(withUtm('mailto:info@pepe-dome.de', { campaign, content: 'p2_anmeldung' })).toBe(
      'mailto:info@pepe-dome.de'
    )
    expect(withUtm('tel:+491796990707', { campaign, content: 'footer_tel' })).toBe(
      'tel:+491796990707'
    )
  })

  it('kippt nicht bei einer kaputten URL', () => {
    expect(withUtm('nicht mal ansatzweise eine url', { campaign, content: 'x_y' })).toBe(
      'nicht mal ansatzweise eine url'
    )
  })

  it('leitet die Kampagnen-ID aus dem Slug ab', () => {
    expect(buildCampaignId('2026-08-Sommer Programm')).toBe('2026-08-sommer-programm')
  })

  it('erkennt E-Mail-Anmeldungen als Ticket-Ersatz', () => {
    expect(isMailLink('anmeldung@pepe-dome.de')).toBe(true)
    expect(isMailLink('mailto:anmeldung@pepe-dome.de')).toBe(true)
    expect(isMailLink('https://tickets.example.com/x?a=b@c')).toBe(false)
    expect(isMailLink(null)).toBe(false)
  })

  it('ergänzt das fehlende mailto-Schema', () => {
    expect(normalizeContactUrl('anmeldung@pepe-dome.de')).toBe('mailto:anmeldung@pepe-dome.de')
    expect(normalizeContactUrl('mailto:a@b.de')).toBe('mailto:a@b.de')
    expect(normalizeContactUrl('https://x.de')).toBe('https://x.de')
  })
})
