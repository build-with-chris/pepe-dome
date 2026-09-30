import { NextRequest, NextResponse } from 'next/server'
import { requireApiRole } from '@/lib/roles.server'
import { ROLES } from '@/lib/roles'
import prisma from '@/lib/prisma'
import { deeplTranslate } from '@/lib/deepl'

/**
 * POST /api/admin/articles/[id]/translate
 *
 * Gegenstück zu /api/admin/events/[id]/translate: übersetzt Titel, Teaser und
 * Inhalt per DeepL nach Englisch und speichert das Ergebnis in der
 * `translations`-JSON-Spalte unter "en". Bestehende manuelle Korrekturen
 * werden überschrieben, der Button im Admin ist eine bewusste Aktion.
 *
 * Der Inhalt ist Markdown. DeepL lässt Satzzeichen wie `##`, `**` und
 * Link-Klammern in aller Regel stehen; vor dem Veröffentlichen lohnt trotzdem
 * ein Blick auf die englische Seite.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireApiRole(ROLES.EDITOR)
  if (guard.response) return guard.response

  const apiKey = process.env.DEEPL_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'DEEPL_API_KEY ist nicht konfiguriert. Bitte in der .env hinterlegen.' },
      { status: 503 }
    )
  }

  const { id } = await params
  const article = await prisma.article.findUnique({ where: { id } })
  if (!article) {
    return NextResponse.json({ error: 'Article not found' }, { status: 404 })
  }

  try {
    const [title, excerpt, content] = await deeplTranslate(
      [article.title, article.excerpt, article.content],
      apiKey
    )

    const existing = (article.translations ?? {}) as Record<string, unknown>
    const updated = await prisma.article.update({
      where: { id },
      data: { translations: { ...existing, en: { title, excerpt, content } } },
    })

    return NextResponse.json({ translations: updated.translations })
  } catch (error) {
    console.error('Error translating article:', error)
    const message = error instanceof Error ? error.message : 'Übersetzung fehlgeschlagen'
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
