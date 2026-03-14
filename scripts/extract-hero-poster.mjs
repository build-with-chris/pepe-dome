#!/usr/bin/env node
/**
 * Extrahiert den ersten Frame aus dem Desktop-Hero-Video (PepeDome-Atmosphaere.mp4)
 * und speichert ihn als WebP für das Hero-Poster (object-cover, gleiches Format).
 * Ausführung: node scripts/extract-hero-poster.mjs
 */

import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const videoPath = path.join(root, 'public/videos/PepeDome-Atmosphaere.mp4')
const outputPath = path.join(root, 'public/images/Aufbau/hero-poster.webp')

async function main() {
  const ffmpegPath = (await import('ffmpeg-static')).default
  if (!ffmpegPath) {
    console.error('ffmpeg-static binary not found')
    process.exit(1)
  }

  return new Promise((resolve, reject) => {
    const args = [
      '-y',
      '-i', videoPath,
      '-vframes', '1',
      '-c:v', 'libwebp',
      '-quality', '85',
      '-f', 'webp',
      outputPath,
    ]
    const proc = spawn(ffmpegPath, args, { stdio: 'inherit' })
    proc.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}`))))
    proc.on('error', reject)
  })
}

main()
  .then(() => console.log('Hero-Poster erstellt:', outputPath))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
