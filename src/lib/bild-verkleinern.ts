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
