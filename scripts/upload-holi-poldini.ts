/**
 * One-off upload: Lädt das Holi-Poldini-Plakat in den Supabase Storage Bucket "uploads".
 *
 * Voraussetzung in .env:
 *   NEXT_PUBLIC_SUPABASE_URL=https://wwawsyhykrbvfgvhqbev.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY=<service_role aus Supabase Dashboard>
 *
 * Ausführen:
 *   npx tsx scripts/upload-holi-poldini.ts
 */

import 'dotenv/config'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !key) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env')
  process.exit(1)
}

const BUCKET = 'uploads'
const SOURCE = path.join(process.cwd(), 'public', 'HoliPolidini.png')
const TARGET = 'holi-poldini-2026.png'

async function main() {
  const supabase = createClient(url!, key!, { auth: { persistSession: false } })

  const buffer = await readFile(SOURCE)
  console.log(`→ Uploading ${SOURCE} (${(buffer.byteLength / 1024).toFixed(1)} KB) to ${BUCKET}/${TARGET}…`)

  const { error } = await supabase.storage.from(BUCKET).upload(TARGET, buffer, {
    contentType: 'image/png',
    upsert: true,
  })

  if (error) {
    console.error('❌ Upload error:', error.message)
    process.exit(1)
  }

  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(TARGET)
  console.log('✅ Public URL:', publicUrl)
}

main().catch((e) => {
  console.error('❌ Fehler:', e)
  process.exit(1)
})
