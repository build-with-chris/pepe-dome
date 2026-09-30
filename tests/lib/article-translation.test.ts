import { describe, it, expect } from 'vitest'
import type { Article } from '@prisma/client'
import { transformArticle } from '@/lib/db-data'
import { metaDescription } from '@/lib/seo'

function article(translations: unknown): Article {
  return {
    id: 'a1',
    slug: 'trainieren-im-pepe-dome',
    title: 'Trainieren im Pepe Dome',
    excerpt: 'Seit Mai läuft ein Kursprogramm.',
    content: 'Deutscher Inhalt',
    category: 'News',
    author: 'Chris Hermann',
    imageUrl: null,
    tags: [],
    featured: false,
    translations,
    status: 'PUBLISHED',
    publishedAt: new Date('2026-05-13T12:00:00Z'),
    createdBy: null,
    createdAt: new Date('2026-05-13T12:00:00Z'),
    updatedAt: new Date('2026-05-13T12:00:00Z'),
  } as Article
}

describe('transformArticle', () => {
  it('zeigt ohne Übersetzung auf Englisch den deutschen Text und meldet nur DE', () => {
    const a = transformArticle(article({}), 'en')
    expect(a.title).toBe('Trainieren im Pepe Dome')
    expect(a.availableLocales).toEqual(['de'])
  })

  it('überlagert die englischen Felder und meldet EN als verfügbar', () => {
    const a = transformArticle(
      article({ en: { title: 'Training at Pepe Dome', excerpt: 'Since May…', content: 'English' } }),
      'en'
    )
    expect(a.title).toBe('Training at Pepe Dome')
    expect(a.content).toBe('English')
    expect(a.availableLocales).toEqual(['de', 'en'])
  })

  it('lässt die deutsche Seite unberührt, auch wenn EN gepflegt ist', () => {
    const a = transformArticle(article({ en: { title: 'Training', content: 'English' } }), 'de')
    expect(a.title).toBe('Trainieren im Pepe Dome')
  })

  it('zählt einen Artikel nur mit Titel UND Inhalt als übersetzt', () => {
    const a = transformArticle(article({ en: { title: 'Training at Pepe Dome' } }), 'en')
    expect(a.title).toBe('Training at Pepe Dome')
    expect(a.content).toBe('Deutscher Inhalt')
    expect(a.availableLocales).toEqual(['de'])
  })
})

describe('metaDescription', () => {
  it('kürzt an der Wortgrenze und endet mit Auslassungszeichen', () => {
    const text = 'KAIROS ist gefühlte Zeit. '.repeat(10)
    const d = metaDescription(text)
    expect(d.length).toBeLessThanOrEqual(160)
    expect(d.endsWith('…')).toBe(true)
    expect(d).not.toMatch(/\s…$/)
  })

  it('entfernt Markdown und fasst Leerraum zusammen', () => {
    expect(metaDescription('**Fett** und [Link](https://x.de)\n\nneuer  Absatz')).toBe(
      'Fett und Link neuer Absatz'
    )
  })
})
