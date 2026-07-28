/**
 * Galerie-Bilder aus den Kamera-Ordnern in Web-Größe bringen.
 *
 *   node scripts/optimize-gallery-images.mjs
 *
 * Warum es dieses Script gibt:
 * Die drei Ordner unter public/ mit den Originalen wiegen zusammen rund 3 GB.
 * Ein einziges Freeman-Foto ist bis zu 30 MB groß. Alles unter public/ wird
 * unverändert mit deployed und ist öffentlich abrufbar, ein Original würde also
 * bei jedem Aufruf komplett über die Leitung gehen. Deshalb: einmal verkleinern,
 * nur das Ergebnis versionieren, die Originale bleiben lokal (siehe .gitignore).
 *
 * Was passiert:
 *   - EXIF-Rotation anwenden (.rotate() ohne Argument), sonst liegen Hochformate quer
 *   - Lange Kante auf 1800 px, nie hochskalieren
 *   - WebP q78: über der Grenze, ab der man Artefakte sieht, deutlich unter
 *     dem, was JPEG für dieselbe Qualität braucht
 *   - Metadaten fallen weg (sharp behält sie ohne .withMetadata() nicht):
 *     spart Bytes und nimmt GPS-Koordinaten aus den Dateien
 *
 * Am Ende steht die Liste mit den echten Pixelmaßen auf der Konsole. Genau die
 * gehören nach src/data/gallery.ts, damit das Layout beim Laden nicht springt.
 *
 * Idempotent: vorhandene Zieldateien werden übersprungen (--force überschreibt).
 */
import sharp from 'sharp'
import { mkdir, access, stat } from 'node:fs/promises'
import path from 'node:path'

const LONG_EDGE = 1800
const QUALITY = 78
const FORCE = process.argv.includes('--force')

const FREEMAN = 'public/✺ Freeman Festival - Pepe '
const FLOWER = 'public/dome-atmosphaere'
const POETRY = 'public/Pepe Dome - Circus and Poetry'

/**
 * Quelle → Ziel. Die Zieldateien heißen nach dem Motiv und nicht nach der
 * Kamera: `freeman-kerze.webp` sagt in der Bildersuche und im Repo mehr als
 * `DSC_6450.jpg`.
 */
const MANIFEST = [
  // ── Freeman Festival ────────────────────────────────────────────────────
  [`${FREEMAN}/DSC_6540.jpg`, 'public/images/festival/freeman-kuppel-herbst.webp'],
  [`${FREEMAN}/DSC_6592-2.jpg`, 'public/images/festival/freeman-handstand-stuhl.webp'],
  [`${FREEMAN}/DSC_6476.jpg`, 'public/images/festival/freeman-cyr-wheel-park.webp'],
  [`${FREEMAN}/DSC_6421-2.jpg`, 'public/images/festival/freeman-sitzkreis.webp'],
  [`${FREEMAN}/DSC_6400-2.jpg`, 'public/images/festival/freeman-publikum-lachen.webp'],
  [`${FREEMAN}/DSC_6450.jpg`, 'public/images/festival/freeman-kerze.webp'],
  [`${FREEMAN}/_DSC4068.jpg`, 'public/images/festival/freeman-popcorn.webp'],
  [`${FREEMAN}/DSC_7004.jpg`, 'public/images/festival/freeman-buehne-getraenkekisten.webp'],
  [`${FREEMAN}/_DSC4047.jpg`, 'public/images/festival/freeman-jonglage-keulen.webp'],
  [`${FREEMAN}/_DSC4084.jpg`, 'public/images/festival/freeman-rollschuhe-solo.webp'],
  [`${FREEMAN}/DSC_6708.jpg`, 'public/images/festival/freeman-rollschuhe-gruppe.webp'],
  [`${FREEMAN}/DSC_6901.jpg`, 'public/images/festival/freeman-buehnenlicht-blau.webp'],
  [`${FREEMAN}/DSC_7477.jpg`, 'public/images/festival/freeman-vertikaltuch-blau.webp'],
  [`${FREEMAN}/DSC_7491.jpg`, 'public/images/festival/freeman-vertikaltuch-gegenlicht.webp'],
  [`${FREEMAN}/DSC_7689.jpg`, 'public/images/festival/freeman-duo-schwebefigur.webp'],
  [`${FREEMAN}/DSC_7824.jpg`, 'public/images/festival/freeman-seil-wasser.webp'],
  [`${FREEMAN}/_DSC4023.jpg`, 'public/images/festival/freeman-chinese-pole.webp'],
  [`${FREEMAN}/_DSC4247.jpg`, 'public/images/festival/freeman-theaterszene.webp'],
  [`${FREEMAN}/_DSC4312.jpg`, 'public/images/festival/freeman-artistin-am-seil.webp'],
  [`${FREEMAN}/_DSC4401.jpg`, 'public/images/festival/freeman-rigging.webp'],
  [`${FREEMAN}/_DSC4372.jpg`, 'public/images/festival/freeman-portrait-artistin.webp'],

  // ── Flower Festival (aus dome-atmosphaere) ──────────────────────────────
  [`${FLOWER}/FlowerFestival-43.jpg`, 'public/images/festival/flower-garten-blumen.webp'],
  [`${FLOWER}/FlowerFestival-54.jpg`, 'public/images/festival/flower-basteltisch.webp'],
  [`${FLOWER}/FlowerFestival-141.jpg`, 'public/images/festival/flower-kartentrick.webp'],
  [`${FLOWER}/FlowerFestival-117.jpg`, 'public/images/dome/flower-publikum-kuppel.webp'],
  [`${FLOWER}/FlowerFestival-157.jpg`, 'public/images/dome/flower-cyr-wheel-buehne.webp'],
  [`${FLOWER}/Show.jpg`, 'public/images/dome/flower-partnerakrobatik.webp'],
  [`${FLOWER}/FlowerFestival-82.jpg`, 'public/images/cafe/flower-kueche.webp'],

  // ── Circus and Poetry ───────────────────────────────────────────────────
  [`${POETRY}/Clown.jpg`, 'public/images/circus-poetry/clown-hut.webp'],
  [`${POETRY}/Martin Fink_imgp2334.jpg`, 'public/images/circus-poetry/clown-marienkaefer.webp'],
  [`${POETRY}/Cyr wheel.jpg`, 'public/images/circus-poetry/cyr-wheel-handstand.webp'],
  [`${POETRY}/Martin Fink_imgp2194.jpg`, 'public/images/circus-poetry/cyr-wheel-einarmig.webp'],
  [`${POETRY}/Luftacro.jpg`, 'public/images/circus-poetry/luftring-kugel.webp'],
  [`${POETRY}/Martin Fink_imgp2290.jpg`, 'public/images/circus-poetry/luftring-kopfueber.webp'],
  [`${POETRY}/Martin Fink_imgp2522.jpg`, 'public/images/circus-poetry/kugel-portrait.webp'],
  [`${POETRY}/Martin Fink_imgp2236.jpg`, 'public/images/circus-poetry/musiker-gitarre.webp'],
  [`${POETRY}/Music.jpg`, 'public/images/circus-poetry/musiker-mikrofon.webp'],
  [`${POETRY}/Martin Fink_imgp2258.jpg`, 'public/images/circus-poetry/ringelstulpen-tisch.webp'],
  [`${POETRY}/Martin Fink_imgp2268.jpg`, 'public/images/circus-poetry/taenzerin-boden.webp'],
  [`${POETRY}/Martin Fink_imgp2413.jpg`, 'public/images/circus-poetry/balance-holzbohle.webp'],
  [`${POETRY}/Martin Fink_imgp2443.jpg`, 'public/images/circus-poetry/handstand-holzgeruest.webp'],
  [`${POETRY}/Martin Fink_imgp2625.jpg`, 'public/images/circus-poetry/schlussapplaus.webp'],
]

const exists = (file) => access(file).then(() => true, () => false)

let bytesIn = 0
let bytesOut = 0
const rows = []

for (const [source, target] of MANIFEST) {
  await mkdir(path.dirname(target), { recursive: true })

  if (!FORCE && (await exists(target))) {
    const meta = await sharp(target).metadata()
    rows.push([target, meta.width, meta.height, 'übersprungen'])
    continue
  }

  const before = (await stat(source)).size
  await sharp(source)
    .rotate()
    .resize({
      width: LONG_EDGE,
      height: LONG_EDGE,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: QUALITY, effort: 6 })
    .toFile(target)

  const after = (await stat(target)).size
  const meta = await sharp(target).metadata()
  bytesIn += before
  bytesOut += after
  rows.push([target, meta.width, meta.height, `${(before / 1e6).toFixed(1)} MB → ${(after / 1e3).toFixed(0)} kB`])
}

const mb = (n) => (n / 1e6).toFixed(1) + ' MB'
for (const [file, w, h, note] of rows) {
  console.log(`${file.replace('public', '')}\t${w}\t${h}\t${note}`)
}
console.log(`\n${rows.length} Bilder, ${mb(bytesIn)} Original → ${mb(bytesOut)} ausgeliefert`)
