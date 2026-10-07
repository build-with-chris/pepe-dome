/**
 * Bilder vor dem Upload im Browser verkleinern.
 *
 * Der Upload läuft über eine Vercel-Funktion, und die nimmt pro Request
 * höchstens 4,5 MB an. Was darüber liegt, weist Vercel mit 413 ab, bevor
 * unsere Route überhaupt läuft. Ein Handyfoto hat schnell 5 bis 8 MB, und
 * die Admin-Oberfläche versprach bis dahin "max 10 MB".
 *
 * Kamera-Originale braucht hier ohnehin niemand: Das größte Bild der Seite
 * ist ein Hero über die volle Breite, und im Newsletter landet dasselbe Bild
 * in einer Mail. Deshalb wird auf höchstens 2400 px an der langen Kante
 * verkleinert und als JPEG gespeichert, nicht als WebP, weil Outlook am
 * Desktop WebP nicht anzeigt.
 */

/** Etwas unter der Vercel-Grenze, das Formular selbst braucht auch Platz. */
export const UPLOAD_GRENZE_BYTES = 4 * 1024 * 1024

export const MAX_KANTE = 2400

const JPEG_QUALITAETEN = [0.85, 0.75, 0.65]

/** Zielmaße bei gleichem Seitenverhältnis, nie größer als das Original. */
export function zielMasse(breite: number, hoehe: number, maxKante = MAX_KANTE) {
  const faktor = Math.min(1, maxKante / Math.max(breite, hoehe))
  return { breite: Math.round(breite * faktor), hoehe: Math.round(hoehe * faktor) }
}

/** Gleicher Dateiname mit neuer Endung, aus "hero.webp" wird "hero.jpg". */
export function mitEndung(name: string, endung: string) {
  const ohne = name.replace(/\.[^./]+$/, '')
  return `${ohne || 'bild'}.${endung}`
}

function alsBlob(canvas: HTMLCanvasElement, typ: string, qualitaet?: number) {
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, typ, qualitaet))
}

/**
 * Gibt die Datei unverändert zurück, wenn sie schon klein genug ist.
 * GIFs bleiben immer unverändert, sonst ginge die Animation verloren.
 */
export async function bildFuerUpload(datei: File): Promise<File> {
  if (datei.type === 'image/gif') return datei

  const bitmap = await createImageBitmap(datei)
  const { breite, hoehe } = zielMasse(bitmap.width, bitmap.height)
  const schonPassend =
    breite === bitmap.width && hoehe === bitmap.height && datei.size <= UPLOAD_GRENZE_BYTES
  if (schonPassend) {
    bitmap.close()
    return datei
  }

  const canvas = document.createElement('canvas')
  canvas.width = breite
  canvas.height = hoehe
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    bitmap.close()
    return datei
  }

  // PNG zuerst als PNG versuchen, wegen möglicher Transparenz.
  if (datei.type === 'image/png') {
    ctx.drawImage(bitmap, 0, 0, breite, hoehe)
    const png = await alsBlob(canvas, 'image/png')
    if (png && png.size <= UPLOAD_GRENZE_BYTES) {
      bitmap.close()
      return new File([png], mitEndung(datei.name, 'png'), { type: 'image/png' })
    }
  }

  // JPEG kennt keine Transparenz. Weiß dahinter, sonst würde sie schwarz.
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, breite, hoehe)
  ctx.drawImage(bitmap, 0, 0, breite, hoehe)
  bitmap.close()

  let letzte: Blob | null = null
  for (const qualitaet of JPEG_QUALITAETEN) {
    letzte = await alsBlob(canvas, 'image/jpeg', qualitaet)
    if (letzte && letzte.size <= UPLOAD_GRENZE_BYTES) break
  }
  if (!letzte) return datei

  return new File([letzte], mitEndung(datei.name, 'jpg'), { type: 'image/jpeg' })
}

/** Lesbare Meldung für ein Bild, das auch nach dem Verkleinern zu groß ist. */
export function zuGrossMeldung(datei: File) {
  return `${datei.name} ist mit ${(datei.size / 1024 / 1024).toFixed(1)} MB zu groß, erlaubt sind 4 MB. Bei einem GIF hilft nur ein kleineres GIF.`
}

/** Ausschnitt in Pixeln des Originalbilds, so wie ihn der Zuschneide-Dialog liefert. */
export type Ausschnitt = { x: number; y: number; width: number; height: number }

/**
 * Rundet den Ausschnitt auf ganze Pixel und hält ihn innerhalb des Bildes.
 * Der Zuschneide-Dialog liefert Kommazahlen, und am Rand kann er um ein
 * Pixel über das Bild hinausragen.
 */
export function ausschnittImBild(a: Ausschnitt, bildBreite: number, bildHoehe: number): Ausschnitt {
  const x = Math.min(Math.max(0, Math.round(a.x)), bildBreite - 1)
  const y = Math.min(Math.max(0, Math.round(a.y)), bildHoehe - 1)
  const width = Math.max(1, Math.min(Math.round(a.width), bildBreite - x))
  const height = Math.max(1, Math.min(Math.round(a.height), bildHoehe - y))
  return { x, y, width, height }
}

/**
 * Schneidet einen Ausschnitt aus dem Bild und verkleinert ihn dabei auf
 * höchstens `maxKante`. PNG bleibt PNG wegen möglicher Transparenz, alles
 * andere wird JPEG. Die Größengrenze prüft danach wie gewohnt bildFuerUpload.
 */
export async function bildZuschneiden(
  quelle: Blob,
  ausschnitt: Ausschnitt,
  name: string,
  maxKante = MAX_KANTE
): Promise<File> {
  const bitmap = await createImageBitmap(quelle)
  const a = ausschnittImBild(ausschnitt, bitmap.width, bitmap.height)
  const { breite, hoehe } = zielMasse(a.width, a.height, maxKante)

  const canvas = document.createElement('canvas')
  canvas.width = breite
  canvas.height = hoehe
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    bitmap.close()
    throw new Error('Der Browser kann das Bild nicht zuschneiden.')
  }

  const alsPng = quelle.type === 'image/png'
  if (!alsPng) {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, breite, hoehe)
  }
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(bitmap, a.x, a.y, a.width, a.height, 0, 0, breite, hoehe)
  bitmap.close()

  const typ = alsPng ? 'image/png' : 'image/jpeg'
  const blob = await alsBlob(canvas, typ, alsPng ? undefined : 0.88)
  if (!blob) throw new Error('Das zugeschnittene Bild konnte nicht erzeugt werden.')
  return new File([blob], mitEndung(name, alsPng ? 'png' : 'jpg'), { type: typ })
}
