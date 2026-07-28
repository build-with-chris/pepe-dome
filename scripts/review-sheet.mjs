/**
 * Sichtbogen der engeren Auswahl (Arbeitswerkzeug, kein Build-Schritt).
 *
 *   node scripts/review-sheet.mjs <praefix> "<datei>" "<datei>" ...
 *
 * Wie contact-sheet.mjs, nur mit großen Kacheln: hier wird entschieden, was auf
 * dem Bild tatsächlich zu sehen ist, bevor der Alt-Text geschrieben wird.
 */
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const [prefix, ...files] = process.argv.slice(2)
const COLS = 3
const ROWS = 2
const CELL = 620
const PER_SHEET = COLS * ROWS

await mkdir('.contact', { recursive: true })

for (let sheet = 0; sheet * PER_SHEET < files.length; sheet++) {
  const slice = files.slice(sheet * PER_SHEET, (sheet + 1) * PER_SHEET)
  const tiles = await Promise.all(
    slice.map(async (file, i) => ({
      input: await sharp(file)
        .rotate()
        .resize(CELL, CELL, { fit: 'contain', background: '#111' })
        .composite([
          {
            input: Buffer.from(
              `<svg width="${CELL}" height="${CELL}">
                 <rect x="0" y="0" width="${Math.min(CELL, 34 + path.basename(file).length * 11)}" height="30" fill="#000" opacity="0.8"/>
                 <text x="6" y="22" font-family="monospace" font-size="19" fill="#fff">${path.basename(file).replace(/&/g, '&amp;')}</text>
               </svg>`
            ),
            top: 0,
            left: 0,
          },
        ])
        .jpeg({ quality: 82 })
        .toBuffer(),
      top: Math.floor(i / COLS) * CELL,
      left: (i % COLS) * CELL,
    }))
  )

  await sharp({
    create: { width: COLS * CELL, height: ROWS * CELL, channels: 3, background: '#111' },
  })
    .composite(tiles)
    .jpeg({ quality: 84 })
    .toFile(`.contact/${prefix}-review-${String(sheet).padStart(2, '0')}.jpg`)
}
