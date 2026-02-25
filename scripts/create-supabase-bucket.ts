/**
 * One-off script: Creates the "uploads" bucket in Supabase Storage (public).
 * Run once: npx dotenv -e .env -- tsx scripts/create-supabase-bucket.ts
 * Or: node --import tsx --env-file=.env -e "..." (Node 20+)
 */

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL/SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env')
  process.exit(1)
}

const supabase = createClient(url, key, { auth: { persistSession: false } })
const BUCKET = 'uploads'

async function main() {
  const { data: buckets } = await supabase.storage.listBuckets()
  if (buckets?.some((b) => b.name === BUCKET)) {
    console.log(`Bucket "${BUCKET}" exists already.`)
    return
  }

  const { data, error } = await supabase.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  })

  if (error) {
    console.error('Error creating bucket:', error.message)
    process.exit(1)
  }

  console.log('Bucket "%s" created (public).', data?.name ?? BUCKET)
}

main()
