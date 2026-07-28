/**
 * Kontaktbogen bauen (nur Arbeitswerkzeug, kein Build-Schritt).
 *
 *   node scripts/contact-sheet.mjs "<ordner>" <ziel-praefix>
 *
 * Legt nummerierte Übersichtsbilder in .contact/ ab, damit man 170 Fotos
 * sichten kann, ohne 170 Dateien einzeln zu öffnen. .contact/ ist ignoriert.
 */
import sharp from 'sharp'
import { readdir, mkdir } from 'node:fs/promises'
import path from 'node:path'

const [dir, prefix] = process.argv.slice(2)
const COLS = 5
const ROWS = 4
const CELL = 320
const PER_SHEET = COLS * ROWS

const files = (await readdir(dir))
  .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
  .sort()

await mkdir('.contact', { recursive: true })

for (let sheet = 0; sheet * PER_SHEET < files.length; sheet++) {
  const slice = files.slice(sheet * PER_SHEET, (sheet + 1) * PER_SHEET)
  const tiles = await Promise.all(
    slice.map(async (file, i) => {
      const n = sheet * PER_SHEET + i
      const thumb = await sharp(path.join(dir, file))
        .rotate()
        .resize(CELL, CELL, { fit: 'contain', background: '#111' })
        .composite([
          {
            input: Buffer.from(
              `<svg width="${CELL}" height="${CELL}">
                 <rect x="0" y="0" width="54" height="26" fill="#000" opacity="0.75"/>
                 <text x="6" y="19" font-family="monospace" font-size="18" fill="#fff">${n}</text>
               </svg>`
            ),
            top: 0,
            left: 0,
          },
        ])
        .jpeg({ quality: 70 })
        .toBuffer()
      return {
        input: thumb,
        top: Math.floor(i / COLS) * CELL,
        left: (i % COLS) * CELL,
      }
    })
  )

  await sharp({
    create: {
      width: COLS * CELL,
      height: ROWS * CELL,
      channels: 3,
      background: '#111',
    },
  })
    .composite(tiles)
    .jpeg({ quality: 72 })
    .toFile(`.contact/${prefix}-${String(sheet).padStart(2, '0')}.jpg`)
}

console.log(
  files.map((f, i) => `${i}\t${f}`).join('\n') + `\n\n${files.length} Dateien`
)
