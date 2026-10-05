import { NextRequest, NextResponse } from 'next/server'
import { requireApiRole } from '@/lib/roles.server'
import { ROLES } from '@/lib/roles'
import { deeplTranslate } from '@/lib/deepl'
import { BIO_MAX } from '@/lib/artist-validation'

/**
 * POST /api/admin/artists/translate  { bio: string } → { bio: string }
 *
 * Anders als bei Events und Artikeln übersetzt diese Route den Text, der
 * gerade im Formular steht, und speichert nichts. So geht der Knopf schon
 * beim Anlegen, bevor es eine ID gibt, und eine noch nicht gespeicherte
 * Änderung an der deutschen Bio wird mit übersetzt. Gespeichert wird erst
 * mit dem Formular, nachdem man die Übersetzung gelesen hat.
 */
export async function POST(request: NextRequest) {
  const guard = await requireApiRole(ROLES.EDITOR)
  if (guard.response) return guard.response

  const apiKey = process.env.DEEPL_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'DEEPL_API_KEY ist nicht konfiguriert. Bitte in der .env hinterlegen.' },
      { status: 503 }
    )
  }

  let bio = ''
  try {
    const body = (await request.json()) as { bio?: unknown }
    bio = typeof body.bio === 'string' ? body.bio.trim() : ''
  } catch {
    return NextResponse.json({ error: 'Ungültiges JSON' }, { status: 400 })
  }

  if (!bio) {
    return NextResponse.json({ error: 'Erst die deutsche Bio eintragen' }, { status: 400 })
  }
  if (bio.length > BIO_MAX) {
    return NextResponse.json(
      { error: `Bio darf höchstens ${BIO_MAX} Zeichen haben` },
      { status: 400 }
    )
  }

  try {
    const [translated] = await deeplTranslate([bio], apiKey)
    return NextResponse.json({ bio: translated ?? '' })
  } catch (error) {
    console.error('Error translating artist bio:', error)
    const message = error instanceof Error ? error.message : 'Übersetzung fehlgeschlagen'
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
