import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

/**
 * POST /api/admin/events/[id]/translate
 *
 * Übersetzt die deutschen Event-Felder (Titel, Untertitel, Beschreibung,
 * Highlights, Preis) per DeepL nach Englisch und speichert das Ergebnis in
 * der `translations`-JSON-Spalte unter dem Key "en". Bestehende manuelle
 * Korrekturen werden dabei überschrieben — der Button im Admin ist deshalb
 * als bewusste Aktion gedacht.
 *
 * Benötigt DEEPL_API_KEY in der Env (Free-Keys enden auf ":fx" und laufen
 * gegen api-free.deepl.com).
 */

async function deeplTranslate(texts: string[], apiKey: string): Promise<string[]> {
  if (texts.length === 0) return []

  const endpoint = apiKey.endsWith(':fx')
    ? 'https://api-free.deepl.com/v2/translate'
    : 'https://api.deepl.com/v2/translate'

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `DeepL-Auth-Key ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: texts,
      source_lang: 'DE',
      target_lang: 'EN-GB',
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`DeepL ${res.status}: ${body.slice(0, 200)}`)
  }

  const data = (await res.json()) as { translations: { text: string }[] }
  return data.translations.map((t) => t.text)
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const apiKey = process.env.DEEPL_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'DEEPL_API_KEY ist nicht konfiguriert. Bitte in der .env hinterlegen.' },
      { status: 503 }
    )
  }

  const { id } = await params
  const event = await prisma.event.findUnique({ where: { id } })
  if (!event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 })
  }

  try {
    const highlights = (event.highlights as string[]) || []

    // Feste Reihenfolge: [title, description, subtitle?, price?, ...highlights]
    const texts: string[] = [event.title, event.description]
    if (event.subtitle) texts.push(event.subtitle)
    if (event.price) texts.push(event.price)
    texts.push(...highlights)

    const translated = await deeplTranslate(texts, apiKey)

    let cursor = 0
    const en = {
      title: translated[cursor++],
      description: translated[cursor++],
      subtitle: event.subtitle ? translated[cursor++] : null,
      price: event.price ? translated[cursor++] : null,
      highlights: translated.slice(cursor),
    }

    const existing = (event.translations ?? {}) as Record<string, unknown>
    const updated = await prisma.event.update({
      where: { id },
      data: { translations: { ...existing, en } },
    })

    return NextResponse.json({ translations: updated.translations })
  } catch (error) {
    console.error('Error translating event:', error)
    const message = error instanceof Error ? error.message : 'Übersetzung fehlgeschlagen'
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
