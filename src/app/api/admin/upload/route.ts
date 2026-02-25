import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'
import { getSupabaseAdmin, UPLOAD_BUCKET } from '@/lib/supabase-server'

// Maximum file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024

// Allowed file types
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

// Generate unique filename
function generateFilename(originalName: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const ext = path.extname(originalName).toLowerCase()
  const baseName = path.basename(originalName, ext)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50)
  return `${baseName}-${timestamp}-${random}${ext}`
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { error: 'Keine Datei hochgeladen' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Ungültiger Dateityp. Erlaubt sind: JPG, PNG, GIF, WebP' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Datei zu groß. Maximale Größe: 10MB' },
        { status: 400 }
      )
    }

    const filename = generateFilename(file.name)

    // Supabase Storage (Production oder lokal, wenn konfiguriert)
    const supabase = getSupabaseAdmin()
    if (supabase) {
      // In Serverless (Vercel) File oft als ArrayBuffer/Buffer uploaden, sonst kann der Request fehlschlagen
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const { data, error } = await supabase.storage
        .from(UPLOAD_BUCKET)
        .upload(filename, buffer, {
          contentType: file.type,
          upsert: false,
        })

      if (error) {
        console.error('Supabase upload error:', error.message, error)
        return NextResponse.json(
          {
            error:
              error.message === 'The resource already exists'
                ? 'Datei mit diesem Namen existiert bereits.'
                : `Supabase: ${error.message}`,
          },
          { status: 500 }
        )
      }

      const path = data?.path ?? filename
      const {
        data: { publicUrl },
      } = supabase.storage.from(UPLOAD_BUCKET).getPublicUrl(path)

      return NextResponse.json({
        success: true,
        url: publicUrl,
        filename,
        size: file.size,
        type: file.type,
      })
    }

    // Fallback: Lokales Dateisystem (nur für lokale Entwicklung)
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }
    const filepath = path.join(uploadsDir, filename)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    return NextResponse.json({
      success: true,
      url: `/uploads/${filename}`,
      filename,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Upload error:', message, error)
    if (process.env.VERCEL) {
      const hasSupabase =
        (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL) &&
        process.env.SUPABASE_SERVICE_ROLE_KEY
      if (!hasSupabase) {
        return NextResponse.json(
          {
            error:
              'Supabase Storage nicht konfiguriert. NEXT_PUBLIC_SUPABASE_URL und SUPABASE_SERVICE_ROLE_KEY in Vercel setzen.',
          },
          { status: 503 }
        )
      }
    }
    return NextResponse.json(
      { error: `Fehler beim Hochladen: ${message}` },
      { status: 500 }
    )
  }
}

// Optional: Handle DELETE to remove images (Supabase Storage oder lokale Datei)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get('filename')

    if (!filename) {
      return NextResponse.json(
        { error: 'Kein Dateiname angegeben' },
        { status: 400 }
      )
    }

    const sanitizedFilename = path.basename(filename)

    const supabase = getSupabaseAdmin()
    if (supabase) {
      const { error } = await supabase.storage.from(UPLOAD_BUCKET).remove([sanitizedFilename])
      if (error) {
        if (error.message?.includes('not found') || error.message?.includes('Object not found')) {
          return NextResponse.json({ error: 'Datei nicht gefunden' }, { status: 404 })
        }
        console.error('Supabase delete error:', error)
        return NextResponse.json({ error: 'Fehler beim Löschen' }, { status: 500 })
      }
      return NextResponse.json({ success: true })
    }

    const filepath = path.join(process.cwd(), 'public', 'uploads', sanitizedFilename)
    if (!existsSync(filepath)) {
      return NextResponse.json({ error: 'Datei nicht gefunden' }, { status: 404 })
    }
    const { unlink } = await import('fs/promises')
    await unlink(filepath)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: 'Fehler beim Löschen der Datei' },
      { status: 500 }
    )
  }
}
